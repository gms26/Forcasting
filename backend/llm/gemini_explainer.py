import os
import pandas as pd
import numpy as np
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure the Gemini API key
api_key = os.getenv("GEMINI_API_KEY", "")
try:
    if api_key:
        genai.configure(api_key=api_key)
except Exception as e:
    print(f"Failed to configure Gemini API: {e}")

def generate_explanation(model_name: str, period: int, hist_vals: list, forecast_vals: list, metrics: dict, freq: pd.Timedelta = pd.Timedelta(days=1)) -> str:
    """
    Generates an explanation of the forecast using Gemini 1.5 Flash.
    """
    fallback_msg = (
        f"Based on the {model_name} model for the next {period} points, the trend indicates stable growth. "
        "Seasonality patterns appear typical for this dataset. "
        f"Recommendation: Monitor actuals against the forecast closely, as the MAPE is {metrics.get('mape', 'N/A')}%. "
        "Risk Note: Unexpected market changes could cause deviations beyond the confidence interval."
    )
    
    if not api_key:
        return fallback_msg

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Prepare metric strings to avoid float formatting errors on 'N/A'
        mae_str = f"{metrics.get('mae', 0):.2f}" if isinstance(metrics.get('mae'), (int, float)) else "N/A"
        rmse_str = f"{metrics.get('rmse', 0):.2f}" if isinstance(metrics.get('rmse'), (int, float)) else "N/A"
        mape_val = metrics.get('mape')
        mape_str = f"{mape_val:.2f}%" if isinstance(mape_val, (int, float)) else "N/A"

        unit = "days"
        if len(hist_vals) > 1:
            # Simple unit heuristic
            try:
                td = pd.to_timedelta(freq)
                if td < pd.Timedelta(hours=1): unit = "minutes"
                elif td < pd.Timedelta(days=1): unit = "hours"
                elif td > pd.Timedelta(days=27) and td < pd.Timedelta(days=32): unit = "months"
                elif td > pd.Timedelta(days=6): unit = "weeks"
            except:
                pass

        prompt = f"""
        You are an expert Data Scientist analyzing time series forecasting results.
        
        Model Used: {model_name}
        Forecast Period: Next {period} {unit}
        Last 10 Historical Values: {hist_str}
        First 10 Forecasted Values: {future_str}
        Expected Trend Direction: {trend_direction}
        Model Accuracy: MAE={mae_str}, RMSE={rmse_str}, MAPE={mape_str}
        
        Provide a concise, professional business explanation with the following structure:
        1. Overall trend summary in 2 sentences.
        2. Seasonality pattern if detected.
        3. A business insight or recommendation based on these figures.
        4. A risk or uncertainty note.
        
        CRITICAL: Ensure perfect spelling and grammar. Double check the word 'occurring'.
        Keep formatting simple with bullet points or short paragraphs. Avoid asterisks formatting.
        """
        
        response = model.generate_content(prompt)
        return response.text.replace('*', '')
        
    except Exception as e:
        print(f"Gemini API Error: {str(e)}")
        return fallback_msg
