import pandas as pd
import numpy as np
from statsmodels.tsa.holtwinters import ExponentialSmoothing
import logging

def run_holt_winters(df: pd.DataFrame, period: int = 30) -> list:
    """
    Forecaster using Holt-Winters Exponential Smoothing.
    """
    df = df.copy()
    df['date'] = pd.to_datetime(df['date'])
    
    # Ensure sorted by datetime and sort
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date')
    
    # Extract values for the model
    y = df['value'].values
    
    # Determine seasonal periods (fallback to None if not enough data)
    # E.g., 7 for weekly data
    seasonal_periods = 7 if len(y) >= 14 else None
    trend = 'add'
    seasonal = 'add' if seasonal_periods else None
    
    try:
        # Initialize and fit the HW model
        model = ExponentialSmoothing(
            y, 
            trend=trend,
            seasonal=seasonal,
            seasonal_periods=seasonal_periods,
            initialization_method="estimated"
        )
        fitted_model = model.fit(optimized=True)
        
        # Predict future steps
        forecast_values = fitted_model.forecast(period)
        
        # Approximate Confidence Intervals (HW doesn't natively output them easily in statsmodels like Prophet does)
        # We will estimate a simple expanding standard error for the UI.
        residuals = fitted_model.resid
        std_resid = np.std(residuals) if len(residuals) > 0 else 1.0
        
    except Exception as e:
        logging.error(f"HoltWinters fallback error: {str(e)}")
        # Ultimate fallback: Simple moving average continuation
        last_val = y[-1]
        forecast_values = [last_val] * period
        std_resid = np.std(y) if len(y) > 0 else 1.0

    # Generate future dates based on detected frequency
    last_date = pd.to_datetime(df['date'].iloc[-1])
    last_actual = float(df['value'].iloc[-1])
    
    # Infer frequency
    if len(df) > 7:
        freq_infer = pd.infer_freq(df['date'])
        if freq_infer:
            freq = pd.tseries.frequencies.to_offset(freq_infer)
        else:
            diffs = pd.to_datetime(df['date']).diff().dropna()
            freq = diffs.median()
    else:
        freq = pd.Timedelta(days=1)
        
    future_dates = pd.date_range(start=last_date + freq, periods=period, freq=freq)
    
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
    
    # Create the output array matching exact structure
    for i in range(period):
        f_val = float(forecast_values[i])
        
        # Expanding CI based on step forward (more conservative expanding)
        margin = std_resid * (1.2 + 0.1 * i)
        
        forecast_data.append({
            "date": future_dates[i].strftime(date_format),
            "forecast": max(0, f_val), 
            "ci_lower": max(0, f_val - margin),
            "ci_upper": f_val + margin
        })
        
    return forecast_data
