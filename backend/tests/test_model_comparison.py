import pytest
import pandas as pd
from utils.evaluator import evaluate_model
from forecasting.arima_model import run_arima

def test_model_evaluation_metrics():
    """Ensure evaluate_model properly returns mae, rmse, and mape fields calculating off training holdout."""
    df = pd.DataFrame({'date': pd.date_range('1/1/2023', periods=60, freq='D'), 'value': range(60)})
    
    metrics = evaluate_model(df, run_arima, period=10)
    
    assert "mae" in metrics
    assert "rmse" in metrics
    assert "mape" in metrics
    
    # Assert they are floats
    assert isinstance(metrics["mae"], float)
    assert isinstance(metrics["mape"], float)
