from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
import pandas as pd
import io
import json

from utils.data_parser import validate_csv
from forecasting.moving_average import run_moving_average
from forecasting.arima_model import run_arima
from forecasting.holt_winters import run_holt_winters
from utils.evaluator import evaluate_model
from llm.gemini_explainer import generate_explanation
from utils.pdf_generator import generate_pdf_report
from utils.auth import router as auth_router

app = FastAPI(title="SmartForecast AI", description="Time Series Forecasting Dashboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Authentication"])

class ForecastRequest(BaseModel):
    model_name: str
    forecast_period: int
    data: list

@app.get("/")
def root():
    return {"message": "SmartForecast AI API is running"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    
    contents = await file.read()
    try:
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        processed_data, preview = validate_csv(df)
        return {"message": "File uploaded successfully", "preview": preview, "data": processed_data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing CSV: {str(e)}")

def get_model_function(name: str):
    if name == "Moving Average": return run_moving_average
    elif name == "ARIMA": return run_arima
    elif name == "Holt-Winters": return run_holt_winters
    else: raise ValueError("Invalid model name")

@app.post("/forecast")
async def run_forecast(request: ForecastRequest):
    try:
        df = pd.DataFrame(request.data)
        model_func = get_model_function(request.model_name)
        
        # Run forecast
        forecast_result = model_func(df, period=request.forecast_period)
        
        # Get metrics
        metrics = evaluate_model(df, model_func, period=request.forecast_period)
        
        return {
            "forecast": forecast_result,
            "metrics": metrics
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forecast error: {str(e)}")

@app.post("/compare")
async def compare_models(request: ForecastRequest):
    try:
        df = pd.DataFrame(request.data)
        results = {}
        for m_name in ["Moving Average", "ARIMA", "Holt-Winters"]:
            func = get_model_function(m_name)
            fk = func(df, period=request.forecast_period)
            met = evaluate_model(df, func, period=request.forecast_period)
            results[m_name] = {"forecast": fk, "metrics": met}
            
        return {"comparison": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Comparison error: {str(e)}")

@app.post("/explain")
async def get_explanation(request: dict):
    try:
        req_data = request.get('data', [])
        forecast_data = request.get('forecast', [])
        
        hist_vals = [d['value'] for d in req_data]
        future_vals = [f['forecast'] for f in forecast_data]
        
        # Calculate frequency for units
        freq = pd.Timedelta(days=1)
        if len(req_data) > 1:
            try:
                dates = pd.to_datetime([d['date'] for d in req_data])
                freq_infer = pd.infer_freq(dates)
                if freq_infer:
                    freq = pd.tseries.frequencies.to_offset(freq_infer)
                else:
                    freq = (dates[-1] - dates[-2])
            except:
                pass

        explanation = generate_explanation(
            model_name=request.get('model_name', 'Unknown'),
            period=request.get('forecast_period', 30),
            hist_vals=hist_vals,
            forecast_vals=future_vals,
            metrics=request.get('metrics', {}),
            freq=freq
        )
        return {"explanation": explanation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Explanation error: {str(e)}")

@app.post("/download/pdf")
async def download_pdf(request: dict):
    try:
        pdf_bytes = generate_pdf_report(request)
        return Response(content=pdf_bytes, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=report.pdf"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation error: {str(e)}")

@app.post("/download/csv")
async def download_csv(request: dict):
    try:
        forecast_data = request.get('forecast', [])
        df_fc = pd.DataFrame(forecast_data)
        csv_str = df_fc.to_csv(index=False)
        return Response(content=csv_str, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=forecast.csv"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"CSV export error: {str(e)}")

# Simple in-memory cache for sample data
sample_cache = None

@app.get("/sample")
async def get_sample_data():
    global sample_cache
    if sample_cache:
        return sample_cache

    try:
        import os
        # Path assumes running from backend directory or project root
        sample_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'sample_data', 'sales_data.csv')
        
        if not os.path.exists(sample_path):
            sample_path = os.path.join('..', 'sample_data', 'sales_data.csv')
            
        df = pd.read_csv(sample_path)
        processed_data, preview = validate_csv(df)
        
        sample_cache = {"message": "Sample data loaded", "preview": preview, "data": processed_data}
        return sample_cache
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading sample data: {str(e)}")
