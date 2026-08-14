import pandas as pd
import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error
from statsmodels.tsa.holtwinters import ExponentialSmoothing

def run_forecast(data: list, periods: int) -> dict:
    try:
        df = pd.DataFrame(data)
        df['date'] = pd.to_datetime(df['date'])
        df = df.sort_values('date')
        
        # Split: 80% train, 20% test
        split = int(len(df) * 0.8)
        train = df[:split]
        test = df[split:]
        
        train_values = train['value'].values
        test_values = test['value'].values
        all_values = df['value'].values
        
        # Fit model on train and predict for test
        try:
            model_test = ExponentialSmoothing(train_values, trend='add', seasonal='add', seasonal_periods=7)
            fit_test = model_test.fit()
        except Exception:
            # Fallback to simple exponential if fails
            model_test = ExponentialSmoothing(train_values)
            fit_test = model_test.fit()
            
        test_pred = fit_test.forecast(len(test))
        test_actual = test_values
        
        # Fit on all data for future forecast
        try:
            model = ExponentialSmoothing(all_values, trend='add', seasonal='add', seasonal_periods=7)
            fit_model = model.fit()
        except Exception:
            model = ExponentialSmoothing(all_values)
            fit_model = model.fit()
            
        forecast_values = fit_model.forecast(periods)
        
        # Holt-Winters from statsmodels doesn't natively provide confidence intervals in the same way
        # We will approximate them based on standard error of the residuals
        residuals = fit_model.resid
        std_resid = np.std(residuals)
        
        # Simple approximation of growing confidence interval over time
        lower_values = forecast_values - 1.96 * std_resid * np.sqrt(np.arange(1, periods + 1))
        upper_values = forecast_values + 1.96 * std_resid * np.sqrt(np.arange(1, periods + 1))
        
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
            "model_name": "Holt-Winters"
        }
    except Exception as e:
        raise Exception(f"Model error: {str(e)}")
