import pandas as pd
import numpy as np
from statsmodels.tsa.holtwinters import ExponentialSmoothing
from utils.evaluator import evaluate_model
import logging

def run_forecast(df: pd.DataFrame, periods: int = 30) -> dict:
    """
    Holt-Winters Exponential Smoothing forecaster.
    """
    try:
        df = df.copy()
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date')
        
        # Metrics evaluation
        from forecasting.holt_winters import _run_hw_internal
        metrics = evaluate_model(df, _run_hw_internal, period=periods)
        
        y = df['value'].values
        seasonal_periods = 7 if len(y) >= 14 else None
        
        model = ExponentialSmoothing(
            y, trend='add', seasonal='add' if seasonal_periods else None, 
            seasonal_periods=seasonal_periods, initialization_method="estimated"
        ).fit(optimized=True)
        
        forecast_values = model.forecast(periods)
        residuals = model.resid
        std_resid = np.std(residuals) if len(residuals) > 0 else 1.0

        last_date = df['date'].iloc[-1]
        freq = pd.infer_freq(df['date']) or (df['date'].diff().median())
        future_dates = pd.date_range(start=last_date + freq, periods=periods, freq=freq)
        
        conf_upper = []
        conf_lower = []
        for i in range(periods):
            margin = std_resid * (1.2 + 0.1 * i)
            conf_upper.append(float(forecast_values[i] + margin))
            conf_lower.append(float(max(0, forecast_values[i] - margin)))

        return {
            "forecast": [float(max(0, x)) for x in forecast_values],
            "confidence_upper": conf_upper,
            "confidence_lower": conf_lower,
            "mae": metrics.get("mae", 0.0),
            "rmse": metrics.get("rmse", 0.0),
            "mape": metrics.get("mape", 0.0),
            "dates": [d.strftime('%Y-%m-%d') for d in future_dates]
        }
    except Exception as e:
        logging.error(f"HW Error: {e}")
        return {
            "forecast": [], "confidence_upper": [], "confidence_lower": [],
            "mae": 0.0, "rmse": 0.0, "mape": 0.0, "dates": [], "error": str(e)
        }

def _run_hw_internal(df: pd.DataFrame, period: int = 30) -> list:
    y = df['value'].values
    model = ExponentialSmoothing(y, trend='add').fit(optimized=True)
    preds = model.forecast(period)
    return [{"forecast": float(x)} for x in preds]
