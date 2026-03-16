import pandas as pd
from prophet import Prophet
from utils.evaluator import evaluate_model
import logging

def run_forecast(df: pd.DataFrame, periods: int = 30) -> dict:
    """
    Prophet forecaster by Meta.
    """
    try:
        df_prophet = df.copy()
        df_prophet['date'] = pd.to_datetime(df_prophet['date'])
        df_prophet = df_prophet.rename(columns={'date': 'ds', 'value': 'y'})
        
        # Metrics
        from forecasting.prophet_model import _run_prophet_internal
        metrics = evaluate_model(df, _run_prophet_internal, period=periods)
        
        model = Prophet(yearly_seasonality=True, weekly_seasonality=True, daily_seasonality=False)
        model.fit(df_prophet)
        
        future = model.make_future_dataframe(periods=periods)
        forecast = model.predict(future)
        
        # Extract only the future part
        future_forecast = forecast.tail(periods)
        
        return {
            "forecast": [float(max(0, x)) for x in future_forecast['yhat']],
            "confidence_upper": [float(x) for x in future_forecast['yhat_upper']],
            "confidence_lower": [float(max(0, x)) for x in future_forecast['yhat_lower']],
            "mae": metrics.get("mae", 0.0),
            "rmse": metrics.get("rmse", 0.0),
            "mape": metrics.get("mape", 0.0),
            "dates": [d.strftime('%Y-%m-%d') for d in future_forecast['ds']]
        }
    except Exception as e:
        logging.error(f"Prophet Error: {e}")
        return {
            "forecast": [], "confidence_upper": [], "confidence_lower": [],
            "mae": 0.0, "rmse": 0.0, "mape": 0.0, "dates": [], "error": str(e)
        }

def _run_prophet_internal(df: pd.DataFrame, period: int = 30) -> list:
    df_p = df.rename(columns={'date': 'ds', 'value': 'y'})
    m = Prophet().fit(df_p)
    future = m.make_future_dataframe(periods=period)
    fcst = m.predict(future)
    return [{"forecast": float(x)} for x in fcst.tail(period)['yhat']]
