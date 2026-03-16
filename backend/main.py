from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, JSONResponse
from pydantic import BaseModel
import pandas as pd
import io
import os
import logging

from utils.data_parser import validate_csv
from forecasting.moving_average import run_forecast as run_ma
from forecasting.arima_model import run_forecast as run_arima, clear_arima_cache
from forecasting.holt_winters import run_forecast as run_hw
from forecasting.prophet_model import run_forecast as run_prophet
from llm.gemini_explainer import get_gemini_explanation
from utils.pdf_generator import generate_pdf_report
from utils.auth import router as auth_router

app = FastAPI(title="SmartForecast AI", description="Time Series Forecasting Dashboard API")

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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
        return JSONResponse(status_code=400, content={"detail": "Only CSV files are supported"})
    
    contents = await file.read()
    try:
        clear_arima_cache()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        processed_data, preview = validate_csv(df)
        return {"message": "File uploaded successfully", "preview": preview, "data": processed_data}
    except Exception as e:
        return JSONResponse(status_code=400, content={"detail": f"Error parsing CSV: {str(e)}"})

def get_model_function(name: str):
    models = {
        "Moving Average": run_ma,
        "ARIMA": run_arima,
        "Holt-Winters": run_hw,
        "Prophet": run_prophet
    }
    if name in models:
        return models[name]
    raise ValueError(f"Invalid model name: {name}")

@app.post("/forecast")
async def run_forecast_endpoint(request: ForecastRequest):
    try:
        df = pd.DataFrame(request.data)
        model_func = get_model_function(request.model_name)
        result = model_func(df, periods=request.forecast_period)
        
        if "error" in result:
             return JSONResponse(status_code=500, content={"detail": result["error"]})
             
        return result
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"Forecast error: {str(e)}"})

@app.post("/compare")
async def compare_models(request: ForecastRequest):
    try:
        df = pd.DataFrame(request.data)
        model_names = ["Moving Average", "ARIMA", "Holt-Winters", "Prophet"]
        comparison = {}
        best_model = None
        min_mae = float('inf')

        for name in model_names:
            func = get_model_function(name)
            res = func(df, periods=request.forecast_period)
            comparison[name] = res
            
            # Identify best model based on MAE
            if res.get("mae", float('inf')) < min_mae:
                min_mae = res["mae"]
                best_model = name
                
        return {
            "comparison": comparison,
            "best_model": best_model,
            "min_mae": min_mae
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"Comparison error: {str(e)}"})

@app.post("/explain")
async def get_explanation(request: dict):
    try:
        hist_data = request.get('data', [])
        forecast_data = request.get('forecast', [])
        
        hist_vals = [d['value'] for d in hist_data]
        future_vals = forecast_data # Already a list of floats in new format
        
        # Calculate trend direction for explainer
        trend_direction = "Increasing" if future_vals[-1] > future_vals[0] else "Decreasing"
        metrics_dict = request.get('metrics', {})

        explanation = get_gemini_explanation(
            model_name=request.get('model_name', 'Unknown'),
            periods=request.get('forecast_period', 30),
            historical_values=hist_vals,
            forecast_values=future_vals,
            trend_direction=trend_direction,
            mae=metrics_dict.get('mae', 0.0),
            rmse=metrics_dict.get('rmse', 0.0),
            mape=metrics_dict.get('mape', 0.0)
        )
        return {"explanation": explanation}
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"Explanation error: {str(e)}"})

# Note: Keeping these as POST as they require the result data to generate the files
# but adding GET versions if they can be used with cached/example data
@app.post("/download/pdf")
async def download_pdf_post(request: dict):
    try:
        pdf_bytes = generate_pdf_report(request)
        return Response(
            content=pdf_bytes, 
            media_type="application/pdf", 
            headers={"Content-Disposition": "attachment; filename=forecast_report.pdf"}
        )
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"PDF generation error: {str(e)}"})

@app.get("/download/pdf")
async def download_pdf_get():
    return JSONResponse(status_code=400, content={"detail": "Please use POST with forecast data to generate PDF"})

@app.post("/download/csv")
async def download_csv_post(request: dict):
    try:
        forecast_vals = request.get('forecast', [])
        dates = request.get('dates', [])
        df_fc = pd.DataFrame({"Date": dates, "Forecast": forecast_vals})
        csv_str = df_fc.to_csv(index=False)
        return Response(
            content=csv_str, 
            media_type="text/csv", 
            headers={"Content-Disposition": "attachment; filename=forecast_data.csv"}
        )
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"CSV export error: {str(e)}"})

@app.get("/download/csv")
async def download_csv_get():
    return JSONResponse(status_code=400, content={"detail": "Please use POST with forecast data to generate CSV"})

@app.get("/sample")
async def get_sample_data():
    clear_arima_cache()
    try:
        # Navigate to sample_data/sales_data.csv from backend/main.py
        current_dir = os.path.dirname(__file__)
        sample_path = os.path.join(os.path.dirname(current_dir), 'sample_data', 'sales_data.csv')
        
        if not os.path.exists(sample_path):
             return JSONResponse(status_code=404, content={"detail": "Sample data file not found"})
            
        df = pd.read_csv(sample_path)
        processed_data, preview = validate_csv(df)
        
        return {"message": "Sample data loaded", "preview": preview, "data": processed_data}
    except Exception as e:
        return JSONResponse(status_code=500, content={"detail": f"Error loading sample data: {str(e)}"})
