import pandas as pd
import numpy as np
from pmdarima import auto_arima
import warnings
from utils.evaluator import evaluate_model

warnings.filterwarnings('ignore')

def run_forecast(df: pd.DataFrame, periods: int = 30) -> dict:
    """
    ARIMA forecaster using auto_arima.
    Returns standardized dictionary with forecast and metrics.
    """
    try:
        df = df.copy()
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date')
        
        # Internal evaluation to get metrics
        from forecasting.arima_model import _run_arima_internal
        metrics = evaluate_model(df, _run_arima_internal, period=periods)
        
        # Fit final model on all data
        model = auto_arima(
            df['value'], 
            seasonal=True, m=7, 
            stepwise=True, suppress_warnings=True, 
            error_action="ignore", max_order=None, trace=False
        )
        
        preds, conf_int = model.predict(n_periods=periods, return_conf_int=True)
        conf_lower = conf_int[:, 0]
        conf_upper = conf_int[:, 1]

        last_date = df['date'].iloc[-1]
        freq = pd.infer_freq(df['date']) or (df['date'].diff().median())
        dates = pd.date_range(start=last_date + freq, periods=periods, freq=freq)
        
        return {
            "forecast": [float(max(0, x)) for x in preds],
            "confidence_upper": [float(x) for x in conf_upper],
            "confidence_lower": [float(max(0, x)) for x in conf_lower],
            "mae": metrics.get("mae", 0.0),
            "rmse": metrics.get("rmse", 0.0),
            "mape": metrics.get("mape", 0.0),
            "dates": [d.strftime('%Y-%m-%d') for d in dates]
        }
    except Exception as e:
        print(f"ARIMA Error: {e}")
        return {
            "forecast": [], "confidence_upper": [], "confidence_lower": [],
            "mae": 0.0, "rmse": 0.0, "mape": 0.0, "dates": [], "error": str(e)
        }

def _run_arima_internal(df: pd.DataFrame, period: int = 30) -> list:
    """Internal helper for evaluation compatibility with old list format."""
    model = auto_arima(df['value'], seasonal=True, m=7, stepwise=True, suppress_warnings=True, error_action="ignore")
    preds = model.predict(n_periods=period)
    return [{"forecast": float(x)} for x in preds]
