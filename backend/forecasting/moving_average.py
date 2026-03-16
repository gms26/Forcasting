import pandas as pd
import numpy as np

def run_moving_average(df: pd.DataFrame, period: int = 30, window: int = 7) -> list:
    """
    Simple Moving Average forecaster.
    Uses the last `window` days to calculate a moving average trend and extends it.
    """
    df = df.copy()
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date').reset_index(drop=True)

    if 'value' not in df.columns:
        raise ValueError("Dataframe must contain 'value' column.")
        
    # Calculate SMA
    sma = df['value'].rolling(window=window, min_periods=1).mean()
    
    # Base for projection should be the SMA to avoid noise
    last_sma_val = float(sma.iloc[-1])
    last_actual = float(df['value'].iloc[-1])
    
    # Calculate trend from SMA values
    y_trail = sma.tail(window).values
    x_trail = np.arange(len(y_trail))
    
    slope = 0.0
    if len(y_trail) > 1:
        # Check if we have enough non-nan values
        valid_mask = ~np.isnan(y_trail)
        if np.sum(valid_mask) > 1:
            slope, _ = np.polyfit(x_trail[valid_mask], y_trail[valid_mask], 1)

    # Calculate volatility for CI
    std_dev = df['value'].tail(window).std()
    if pd.isna(std_dev) or std_dev == 0:
        std_dev = df['value'].std() * 0.1 if len(df) > 1 else 1.0
        if pd.isna(std_dev): std_dev = 1.0
        
    last_date = pd.to_datetime(df['date'].iloc[-1])
    
    # Infer frequency
    if len(df) > 1:
        freq_infer = pd.infer_freq(df['date'])
        if freq_infer:
            freq = pd.tseries.frequencies.to_offset(freq_infer)
        else:
            diffs = df['date'].diff().dropna()
            freq = diffs.median()
    else:
        freq = pd.Timedelta(days=1)

    # Determine if we should include time in dates
    try:
        is_sub_daily = pd.to_timedelta(freq) < pd.Timedelta(days=1)
    except:
        is_sub_daily = False
    date_format = '%Y-%m-%d %H:%M:%S' if is_sub_daily else '%Y-%m-%d'

    forecast = []
    
    # 1. Include last historical point to connect the lines in UI
    forecast.append({
        "date": last_date.strftime(date_format),
        "forecast": last_actual,
        "ci_lower": last_actual,
        "ci_upper": last_actual
    })
    
    # 2. Project future points
    for i in range(1, period + 1):
        future_date = (last_date + freq * i).strftime(date_format)
        
        # Project from the last SMA value using the slope
        future_val = last_sma_val + (slope * i)
        future_val = max(0, future_val)
        
        # Confidence intervals (expanding based on volatility and step)
        margin = std_dev * (1.1 + 0.15 * i)
        
        forecast.append({
            "date": future_date,
            "forecast": float(future_val),
            "ci_lower": float(max(0, future_val - margin)),
            "ci_upper": float(future_val + margin)
        })
        
    return forecast
