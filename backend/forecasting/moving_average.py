import pandas as pd
import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error

def run_forecast(data: list, periods: int) -> dict:
    try:
        df = pd.DataFrame(data)
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date')
        
        # Split: 80% train, 20% test
        split = int(len(df) * 0.8)
        train = df[:split]
        test = df[split:]
        
        # Fit model and predict
        window_size = 7
        
        # Calculate MA on the whole dataset to get predictions for test and future
        # For moving average, the "prediction" for future points is often just the last known average
        # or extending the average. Let's do a rolling mean.
        
        rolling = df['value'].rolling(window=window_size)
        rolling_mean = rolling.mean()
        rolling_std = rolling.std().bfill()
        
        test_pred = rolling_mean.iloc[split:]
        test_actual = test['value']
        
        # Handle NaNs from initial rolling window in test if split is very early
        test_pred = test_pred.bfill()
        
        # Forecast future values
        # Naive approach for MA: use the last known moving average for all future periods
        last_ma = rolling_mean.iloc[-1]
        last_std = rolling_std.iloc[-1]
        
        forecast_values = [last_ma] * periods
        upper_values = [last_ma + 1.96 * last_std] * periods
        lower_values = [last_ma - 1.96 * last_std] * periods
        
        # Generate future dates correctly
        last_date = df['date'].iloc[-1]
        future_dates = pd.date_range(
            start=last_date, 
            periods=periods+1, 
            freq='D'
        )[1:]
        
        # Calculate metrics on test set
        mae = mean_absolute_error(test_actual, test_pred)
        rmse = np.sqrt(mean_squared_error(test_actual, test_pred))
        mape = np.mean(np.abs((test_actual - test_pred) / test_actual)) * 100
        
        return {
            "forecast": [round(float(v), 2) for v in forecast_values],
            "confidence_upper": [round(float(v), 2) for v in upper_values],
            "confidence_lower": [round(float(v), 2) for v in lower_values],
            "dates": [str(d.date()) for d in future_dates],
            "mae": round(float(mae), 2),
            "rmse": round(float(rmse), 2),
            "mape": round(float(mape), 2),
            "model_name": "Moving Average"
        }
    except Exception as e:
        raise Exception(f"Model error: {str(e)}")
