import pandas as pd
import numpy as np
from pmdarima import auto_arima
import warnings
warnings.filterwarnings('ignore')

def run_arima(df: pd.DataFrame, period: int = 30) -> list:
    """
    ARIMA forecaster using auto_arima for automatic parameter selection.
    """
    df = df.copy()
    df['date'] = pd.to_datetime(df['date'])
    
    # Fit auto_arima
    # suppress warnings and output
    try:
        model = auto_arima(
            df['value'], 
            seasonal=True, m=7, # Weekly seasonality
            stepwise=True, suppress_warnings=True, 
            error_action="ignore", max_order=None, trace=False
        )
    except Exception as e:
        # Fallback to simple ARIMA if auto_arima fails
        from statsmodels.tsa.arima.model import ARIMA
        model = ARIMA(df['value'], order=(1,1,1)).fit()
    
    # Forecast
    try:
        # pmdarima forecast
        preds, conf_int = model.predict(n_periods=period, return_conf_int=True)
        conf_lower = conf_int[:, 0]
        conf_upper = conf_int[:, 1]
    except:
        # statsmodels fallback forecast
        forecast_res = model.get_forecast(steps=period)
        preds = forecast_res.predicted_mean.values
        conf_int = forecast_res.conf_int()
        conf_lower = conf_int.iloc[:, 0].values
        conf_upper = conf_int.iloc[:, 1].values

    last_date = pd.to_datetime(df['date'].iloc[-1])
    last_actual = float(df['value'].iloc[-1])
    
    # Infer frequency
    if len(df) > 1:
        freq_infer = pd.infer_freq(df['date'])
        if freq_infer:
            freq = pd.tseries.frequencies.to_offset(freq_infer)
        else:
            diffs = pd.to_datetime(df['date']).diff().dropna()
            freq = diffs.median()
    else:
        freq = pd.Timedelta(days=1)

    forecast_data = []
    
    # Include last historical point for connection
    try:
        is_sub_daily = pd.to_timedelta(freq) < pd.Timedelta(days=1)
    except:
        is_sub_daily = False
        
    date_format = '%Y-%m-%d %H:%M:%S' if is_sub_daily else '%Y-%m-%d'

    forecast_data.append({
        "date": last_date.strftime(date_format),
        "forecast": last_actual,
        "ci_lower": last_actual,
        "ci_upper": last_actual
    })
    
    for i in range(period):
        future_date = (last_date + freq * (i + 1)).strftime(date_format)
        f_val = float(preds[i] if isinstance(preds, (list, np.ndarray)) else preds.iloc[i])
        forecast_data.append({
            "date": future_date,
            "forecast": max(0, f_val), 
            "ci_lower": max(0, float(conf_lower[i])),
            "ci_upper": float(conf_upper[i])
        })
        
    return forecast_data
