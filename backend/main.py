from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse, FileResponse
from pydantic import BaseModel
import pandas as pd
import json
import os
import io
from typing import Optional, List, Dict, Any

from utils.auth import create_access_token, verify_password, get_password_hash, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
from utils.data_parser import parse_data
from utils.pdf_generator import generate_forecast_pdf
from llm.gemini_explainer import get_gemini_explanation
from datetime import timedelta

# Import Models
from forecasting import moving_average, arima_model, prophet_model, holt_winters

app = FastAPI(title="SmartForecast AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# User database supporting custom emails
USERS_DB: Dict[str, Dict[str, Any]] = {
    "analyst@smartforecast.ai": {
        "email": "analyst@smartforecast.ai",
        "name": "Senior Data Analyst",
        "hashed_password": get_password_hash("forecast2025"),
    },
    "admin@smartforecast.ai": {
        "email": "admin@smartforecast.ai",
        "name": "Platform Administrator",
        "hashed_password": get_password_hash("smartforecast"),
    }
}

class LoginRequest(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    password: str
    name: Optional[str] = None

class RegisterRequest(BaseModel):
    email: str
    password: str
    name: Optional[str] = None

@app.post("/auth/register")
async def register(request: RegisterRequest):
    email_key = request.email.strip().lower()
    if not email_key or "@" not in email_key:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a valid email address."
        )
    if len(request.password) < 4:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 4 characters long."
        )
    if email_key in USERS_DB:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists. Please sign in."
        )
    
    display_name = request.name.strip() if request.name and request.name.strip() else email_key.split('@')[0].capitalize()
    USERS_DB[email_key] = {
        "email": email_key,
        "name": display_name,
        "hashed_password": get_password_hash(request.password)
    }
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": email_key, "name": display_name}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "email": email_key,
            "name": display_name
        }
    }

@app.post("/auth/login")
async def login(request: LoginRequest):
    # Accept either email or username
    user_identifier = (request.email or request.username or "").strip().lower()
    if not user_identifier:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address is required."
        )
    
    user = USERS_DB.get(user_identifier)
    
    # If user doesn't exist yet, auto-provision seamless account so any user email works immediately
    if not user:
        if len(request.password) < 3:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must be at least 3 characters long."
            )
        display_name = request.name.strip() if request.name and request.name.strip() else user_identifier.split('@')[0].capitalize()
        user = {
            "email": user_identifier,
            "name": display_name,
            "hashed_password": get_password_hash(request.password)
        }
        USERS_DB[user_identifier] = user
    else:
        if not verify_password(request.password, user["hashed_password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect password for this email account.",
                headers={"WWW-Authenticate": "Bearer"},
            )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    user_name = user.get("name", user_identifier.split('@')[0].capitalize())
    access_token = create_access_token(
        data={"sub": user_identifier, "name": user_name}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "email": user.get("email", user_identifier),
            "name": user_name
        }
    }

@app.get("/sample")
async def get_sample():
    sample_path = os.path.join(os.path.dirname(__file__), "..", "sample_data", "sales_data.csv")
    if not os.path.exists(sample_path):
        raise HTTPException(status_code=404, detail="Sample data not found.")
    
    df = pd.read_csv(sample_path)
    return df.to_dict(orient="records")

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
    
    content = await file.read()
    try:
        df = parse_data(content, is_json=False)
        # Convert date back to string for JSON serialization
        df['date'] = df['date'].dt.strftime('%Y-%m-%d')
        return df.to_dict(orient="records")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

class ForecastRequest(BaseModel):
    data: List[Dict[str, Any]]
    model: str
    periods: int

@app.post("/forecast")
async def forecast(request: ForecastRequest):
    data = request.data
    model_name = request.model
    periods = request.periods
    
    try:
        if model_name == "Moving Average":
            result = moving_average.run_forecast(data, periods)
        elif model_name == "ARIMA":
            result = arima_model.run_forecast(data, periods)
        elif model_name == "Prophet":
            result = prophet_model.run_forecast(data, periods)
        elif model_name == "Holt-Winters":
            result = holt_winters.run_forecast(data, periods)
        else:
            raise HTTPException(status_code=400, detail="Invalid model selected.")
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/compare")
async def compare_models(request: ForecastRequest):
    data = request.data
    periods = request.periods
    
    results = []
    models = {
        "Moving Average": moving_average,
        "ARIMA": arima_model,
        "Prophet": prophet_model,
        "Holt-Winters": holt_winters
    }
    
    best_model = None
    lowest_mape = float('inf')
    
    for name, module in models.items():
        try:
            res = module.run_forecast(data, periods)
            res["model_name"] = name
            results.append({
                "model_name": name,
                "mae": res["mae"],
                "rmse": res["rmse"],
                "mape": res["mape"]
            })
            
            if res["mape"] < lowest_mape:
                lowest_mape = res["mape"]
                best_model = name
        except Exception as e:
            print(f"Error running {name}: {e}")
            continue
            
    if not results:
        raise HTTPException(status_code=500, detail="All models failed.")
        
    return {
        "results": results,
        "best_model": best_model
    }

class ExplainRequest(BaseModel):
    model_name: str
    periods: int
    historical_values: List[float]
    forecast_values: List[float]
    mae: float
    rmse: float
    mape: float

@app.post("/explain")
async def explain_forecast(request: ExplainRequest):
    # Determine basic trend direction
    first_hist = request.historical_values[0] if request.historical_values else 0
    last_hist = request.historical_values[-1] if request.historical_values else 0
    last_fore = request.forecast_values[-1] if request.forecast_values else 0
    
    if last_fore > last_hist:
        trend = "upward"
    elif last_fore < last_hist:
        trend = "downward"
    else:
        trend = "stable"
        
    explanation = get_gemini_explanation(
        model_name=request.model_name,
        periods=request.periods,
        historical_values=request.historical_values,
        forecast_values=request.forecast_values,
        trend_direction=trend,
        mae=request.mae,
        rmse=request.rmse,
        mape=request.mape
    )
    return {"explanation": explanation}

class DownloadPDFRequest(BaseModel):
    model_name: str
    periods: int
    mae: float
    rmse: float
    mape: float
    explanation: str

@app.post("/download/pdf")
async def download_pdf(request: DownloadPDFRequest):
    data = request.dict()
    pdf_buffer = generate_forecast_pdf(data)
    
    return StreamingResponse(
        pdf_buffer, 
        media_type="application/pdf", 
        headers={"Content-Disposition": f"attachment; filename=forecast_report.pdf"}
    )

class DownloadCSVRequest(BaseModel):
    dates: List[str]
    forecast: List[float]
    confidence_upper: List[float]
    confidence_lower: List[float]

@app.post("/download/csv")
async def download_csv(request: DownloadCSVRequest):
    df = pd.DataFrame({
        "Date": request.dates,
        "Forecast": request.forecast,
        "Upper Confidence": request.confidence_upper,
        "Lower Confidence": request.confidence_lower
    })
    
    csv_buffer = io.StringIO()
    df.to_csv(csv_buffer, index=False)
    
    return StreamingResponse(
        iter([csv_buffer.getvalue()]), 
        media_type="text/csv", 
        headers={"Content-Disposition": f"attachment; filename=forecast_data.csv"}
    )
