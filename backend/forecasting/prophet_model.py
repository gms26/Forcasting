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
        
        def clean_val(x):
            if pd.isna(x) or x is None: return 0.0
            return float(round(max(0, x), 2))

        return {
            "forecast": [clean_val(x) for x in future_forecast['yhat']],
            "confidence_upper": [clean_val(x) for x in future_forecast['yhat_upper']],
            "confidence_lower": [clean_val(x) for x in future_forecast['yhat_lower']],
            "dates": [str(d.date()) for d in future_forecast['ds']],
            "mae": float(round(metrics.get("mae", 0.0), 2)),
            "rmse": float(round(metrics.get("rmse", 0.0), 2)),
            "mape": float(round(metrics.get("mape", 0.0), 2))
        }
    except Exception as e:
        logging.error(f"Prophet Error: {e}")
        return {
            "forecast": [], "confidence_upper": [], "confidence_lower": [],
            "dates": [], "mae": 0.0, "rmse": 0.0, "mape": 0.0
        }

def _run_prophet_internal(df: pd.DataFrame, period: int = 30) -> list:
    try:
        df_p = df.rename(columns={'date': 'ds', 'value': 'y'})
        m = Prophet().fit(df_p)
        future = m.make_future_dataframe(periods=period)
        fcst = m.predict(future)
        return [{"forecast": float(x)} for x in fcst.tail(period)['yhat']]
    except:
        last_val = df['value'].iloc[-1]
        return [{"forecast": float(last_val)}] * period
