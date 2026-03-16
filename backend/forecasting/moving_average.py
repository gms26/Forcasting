import pandas as pd
import numpy as np
from utils.evaluator import evaluate_model

def run_forecast(df: pd.DataFrame, periods: int = 30) -> dict:
    """
    Moving Average forecaster with standardized return.
    """
    try:
        df = df.copy()
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date')
        
        # Metrics evaluation
        from forecasting.moving_average import _run_ma_internal
        metrics = evaluate_model(df, _run_ma_internal, period=periods)
        
        window = 7
        sma = df['value'].rolling(window=window, min_periods=1).mean()
        last_sma_val = float(sma.iloc[-1])
        
        y_trail = sma.tail(window).values
        x_trail = np.arange(len(y_trail))
        slope = 0.0
        if len(y_trail) > 1:
            valid_mask = ~np.isnan(y_trail)
            if np.sum(valid_mask) > 1:
                slope, _ = np.polyfit(x_trail[valid_mask], y_trail[valid_mask], 1)

        std_dev = df['value'].tail(window).std() or 1.0
        last_date = df['date'].iloc[-1]
        
        freq = pd.infer_freq(df['date'])
        if freq is None:
            freq = df['date'].diff().median()
            
        future_dates = pd.date_range(start=last_date, periods=periods + 1, freq=freq)[1:]
        
        forecast_vals = []
        conf_upper = []
        conf_lower = []
        
        def clean_val(x):
            if pd.isna(x) or x is None: return 0.0
            return float(round(max(0, x), 2))
            
        for i in range(1, periods + 1):
            f_val = last_sma_val + (slope * i)
            margin = std_dev * (1.1 + 0.15 * i)
            forecast_vals.append(clean_val(f_val))
            conf_upper.append(clean_val(f_val + margin))
            conf_lower.append(clean_val(f_val - margin))

        return {
            "forecast": forecast_vals,
            "confidence_upper": conf_upper,
            "confidence_lower": conf_lower,
            "dates": [str(d.date()) for d in future_dates],
            "mae": float(round(metrics.get("mae", 0.0), 2)),
            "rmse": float(round(metrics.get("rmse", 0.0), 2)),
            "mape": float(round(metrics.get("mape", 0.0), 2))
        }
    except Exception as e:
        print(f"MA Error: {e}")
        return {
            "forecast": [], "confidence_upper": [], "confidence_lower": [],
            "dates": [], "mae": 0.0, "rmse": 0.0, "mape": 0.0
        }

def _run_ma_internal(df: pd.DataFrame, period: int = 30) -> list:
    val = df['value'].tail(7).mean()
    return [{"forecast": float(val)}] * period
