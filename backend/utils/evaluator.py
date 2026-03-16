import numpy as np
import pandas as pd

def evaluate_model(df: pd.DataFrame, model_function, period: int = 30):
    """
    Evaluates a forecasting model by splitting the last 20% of data as the test set.
    Calculates MAE, RMSE, MAPE.
    Returns the metrics dict.
    """
    if len(df) < 10:
        return {"mae": 0.0, "rmse": 0.0, "mape": 0.0}
        
    split_idx = int(len(df) * 0.8)
    train_df = df.iloc[:split_idx].copy()
    test_df = df.iloc[split_idx:].copy()
    
    test_period = len(test_df)
    
    try:
        # Run model on train data for the length of test data
        forecast = model_function(train_df, period=test_period)
        
        y_true = test_df['value'].values
        y_pred = np.array([f['forecast'] for f in forecast])
        
        # Calculate metrics
        mae = np.mean(np.abs(y_true - y_pred))
        rmse = np.sqrt(np.mean((y_true - y_pred)**2))
        
        # Avoid division by zero
        epsilon = 1e-10
        mape = np.mean(np.abs((y_true - y_pred) / (y_true + epsilon))) * 100
        
        return {
            "mae": float(mae),
            "rmse": float(rmse),
            "mape": float(mape)
        }
    except Exception as e:
        print(f"Evaluation error: {e}")
        return {"mae": -1.0, "rmse": -1.0, "mape": -1.0}
