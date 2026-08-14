import pandas as pd
import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error
from pmdarima import auto_arima
import warnings

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
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            try:
                model = auto_arima(
                    train['value'],
                    max_p=3, max_q=3, max_d=2,
                    stepwise=True, seasonal=False,
                    suppress_warnings=True,
                    error_action='ignore'
                )
            except Exception:
                # Fallback to ARIMA(1,1,1) if fails
                model = auto_arima(train['value'], start_p=1, start_q=1, max_p=1, max_q=1, d=1, stepwise=True, seasonal=False, suppress_warnings=True)

        test_pred = model.predict(n_periods=len(test))
        test_actual = test['value'].values
        
        # Refit on whole data for future forecast
        model.fit(df['value'])
        forecast_pred, conf_int = model.predict(n_periods=periods, return_conf_int=True)
        
        forecast_values = forecast_pred.values
        lower_values = conf_int[:, 0]
        upper_values = conf_int[:, 1]
        
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
            "model_name": "ARIMA"
        }
    except Exception as e:
        raise Exception(f"Model error: {str(e)}")
