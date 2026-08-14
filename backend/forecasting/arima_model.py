import pandas as pd
import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error
from statsmodels.tsa.arima.model import ARIMA
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
        
        # Fit model and predict (Simple Auto ARIMA)
        best_aic = float("inf")
        best_order = (1, 1, 1)
        
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            for p in [0, 1, 2]:
                for d in [0, 1]:
                    for q in [0, 1, 2]:
                        try:
                            model = ARIMA(train['value'].values, order=(p, d, q))
                            fitted = model.fit()
                            if fitted.aic < best_aic:
                                best_aic = fitted.aic
                                best_order = (p, d, q)
                        except:
                            continue
            
            # Refit on train with best order
            train_model = ARIMA(train['value'].values, order=best_order).fit()
            test_pred = train_model.forecast(steps=len(test))
            test_actual = test['value'].values
            
            # Refit on whole data for future forecast
            final_model = ARIMA(df['value'].values, order=best_order).fit()
            forecast_result = final_model.get_forecast(steps=periods)
            forecast_values = forecast_result.predicted_mean
            conf_int = forecast_result.conf_int(alpha=0.05) # 95% confidence interval
        
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
