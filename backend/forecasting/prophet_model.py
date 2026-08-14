import pandas as pd
import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error
from prophet import Prophet
import logging

# Suppress prophet logs
logging.getLogger("cmdstanpy").setLevel(logging.WARNING)

def run_forecast(data: list, periods: int) -> dict:
    try:
        df = pd.DataFrame(data)
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date')
        
        # Prophet expects 'ds' and 'y'
        prophet_df = df.rename(columns={'date': 'ds', 'value': 'y'})
        
        # Split: 80% train, 20% test
        split = int(len(prophet_df) * 0.8)
        train = prophet_df[:split]
        test = prophet_df[split:]
        
        # Fit model on train and predict for test
        model_test = Prophet(daily_seasonality=True)
        model_test.fit(train)
        
        future_test = model_test.make_future_dataframe(periods=len(test), freq='D')
        forecast_test = model_test.predict(future_test)
        
        test_pred = forecast_test['yhat'].iloc[-len(test):].values
        test_actual = test['y'].values
        
        # Fit on all data for future forecast
        model = Prophet(daily_seasonality=True)
        model.fit(prophet_df)
        
        future = model.make_future_dataframe(periods=periods, freq='D')
        forecast = model.predict(future)
        
        # Extract only the future predictions
        future_forecast = forecast.iloc[-periods:]
        
        forecast_values = future_forecast['yhat'].values
        lower_values = future_forecast['yhat_lower'].values
        upper_values = future_forecast['yhat_upper'].values
        
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
            "model_name": "Prophet"
        }
    except Exception as e:
        raise Exception(f"Model error: {str(e)}")
