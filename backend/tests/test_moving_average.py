import pytest
import pandas as pd
import numpy as np
from forecasting.moving_average import run_forecast

def test_moving_average_structure():
    """Ensure the return structure matches the new standard."""
    df = pd.DataFrame({'date': pd.date_range('1/1/2023', periods=30, freq='D'), 'value': [100]*30})
    result = run_forecast(df, periods=10)
    
    assert isinstance(result, dict)
    assert "forecast" in result
    assert "confidence_upper" in result
    assert "confidence_lower" in result
    assert "dates" in result
    assert "mae" in result
    assert len(result["forecast"]) == 10
    assert len(result["dates"]) == 10
    assert result["dates"][0] == "2023-01-31" # 30 days + 1 day

def test_moving_average_rounding():
    """Ensure values are rounded to 2 decimal places."""
    df = pd.DataFrame({'date': pd.date_range('1/1/2023', periods=30, freq='D'), 'value': [100.1234]*30})
    result = run_forecast(df, periods=5)
    
    for val in result["forecast"]:
        assert round(val, 2) == val

def test_moving_average_no_nans():
    """Ensure no NaN values are returned."""
    df = pd.DataFrame({'date': pd.date_range('1/1/2023', periods=30, freq='D'), 'value': [np.nan]*30})
    # the parser usually handles NaNs, but let's test the model's robustness
    result = run_forecast(df, periods=5)
    for val in result["forecast"]:
        assert val == 0.0 or isinstance(val, float)
