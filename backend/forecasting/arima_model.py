import pandas as pd
import numpy as np
from pmdarima import auto_arima
from statsmodels.tsa.arima.model import ARIMA as SARIMAX
import warnings
import hashlib
import time
import logging
from utils.evaluator import evaluate_model

warnings.filterwarnings('ignore')

# Result cache: { "hash_periods": result_dict }
arima_cache = {}

def get_df_hash(df: pd.DataFrame):
    """Calculates a unique hash for the dataset to use in caching."""
    return hashlib.md5(pd.util.hash_pandas_object(df).values).hexdigest()

def clear_arima_cache():
    """Clears the ARIMA result cache when new data is uploaded."""
    global arima_cache
    arima_cache.clear()
    logging.info("ARIMA cache cleared.")

def run_forecast(df: pd.DataFrame, periods: int = 30) -> dict:
    """
    ARIMA forecaster with performance optimizations, caching, and fallback.
    """
    try:
        df = df.copy()
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date')
        
        # Caching check
        df_hash = get_df_hash(df[['date', 'value']])
        cache_key = f"{df_hash}_{periods}"
        if cache_key in arima_cache:
            logging.info("ARIMA: Returning cached result.")
            return arima_cache[cache_key]

        # 1. Metrics evaluation
        from forecasting.arima_model import _run_arima_internal
        metrics = evaluate_model(df, _run_arima_internal, period=periods)
        
        # 2. Optimized auto_arima Search
        # Timing the execution for the requested 10s timeout
        start_time = time.time()
        
        try:
            # We limit the search space as requested to ensure speed
            model = auto_arima(
                df['value'], 
                max_p=3, max_q=3, max_d=2,
                seasonal=False,  # Massesively speeds up calculation
                stepwise=True,
                suppress_warnings=True, 
                error_action="ignore",
                trace=False,
                n_jobs=1
            )
            
            # Simple soft timeout check after fitting
            if time.time() - start_time > 10:
                 raise TimeoutError("Auto ARIMA search took too long")
                 
            preds, conf_int = model.predict(n_periods=periods, return_conf_int=True)
            conf_lower = conf_int[:, 0]
            conf_upper = conf_int[:, 1]
            
        except Exception as e:
            logging.warning(f"ARIMA optimization or timeout: {e}. Falling back to ARIMA(1,1,1)")
            # Fallback to a fast ARIMA(1,1,1) model if auto_arima fails or is too slow
            fallback_model = SARIMAX(df['value'], order=(1, 1, 1)).fit(disp=False)
            res = fallback_model.get_forecast(steps=periods)
            preds = res.predicted_mean
            conf_int = res.conf_int()
            conf_lower = conf_int.iloc[:, 0]
            conf_upper = conf_int.iloc[:, 1]

        # 3. Standardize Output
        last_date = df['date'].iloc[-1]
        freq = pd.infer_freq(df['date']) or df['date'].diff().median()
        future_dates = pd.date_range(start=last_date, periods=periods + 1, freq=freq)[1:]
        
        def clean_val(x):
            if pd.isna(x) or x is None: return 0.0
            return float(round(max(0, x), 2))

        result = {
            "forecast": [clean_val(x) for x in preds],
            "confidence_upper": [clean_val(x) for x in conf_upper],
            "confidence_lower": [clean_val(x) for x in conf_lower],
            "dates": [str(d.date()) for d in future_dates],
            "mae": float(round(metrics.get("mae", 0.0), 2)),
            "rmse": float(round(metrics.get("rmse", 0.0), 2)),
            "mape": float(round(metrics.get("mape", 0.0), 2))
        }
        
        # Store in cache
        arima_cache[cache_key] = result
        return result

    except Exception as e:
        logging.error(f"ARIMA Fatal Error: {e}")
        return {
            "forecast": [], "confidence_upper": [], "confidence_lower": [],
            "dates": [], "mae": 0.0, "rmse": 0.0, "mape": 0.0
        }

def _run_arima_internal(df: pd.DataFrame, period: int = 30) -> list:
    """Optimized helper for evaluation."""
    try:
        model = auto_arima(df['value'], max_p=2, max_q=2, seasonal=False, stepwise=True, suppress_warnings=True, error_action="ignore")
        preds = model.predict(n_periods=period)
        return [{"forecast": float(x)} for x in preds]
    except:
        last_val = df['value'].iloc[-1]
        return [{"forecast": float(last_val)}] * period
