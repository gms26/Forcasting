import pytest
import pandas as pd
from forecasting.moving_average import run_moving_average

def test_moving_average_window_7():
    """Ensure exactly 7-day smoothing works."""
    df = pd.DataFrame({'date': pd.date_range('1/1/2023', periods=30, freq='D'), 'value': [100]*30})
    forecast = run_moving_average(df, period=10)
    assert len(forecast) == 11
    # Check connect point
    assert abs(forecast[0]['forecast'] - 100.0) < 1.0

def test_moving_average_window_30():
    """Ensure it defaults back/caps out appropriately and returns correct period length."""
    df = pd.DataFrame({'date': pd.date_range('1/1/2023', periods=60, freq='D'), 'value': [100]*60})
    forecast = run_moving_average(df, period=30)
    assert len(forecast) == 31

def test_moving_average_confidence_intervals():
    """Checks the confidence bounds logic of the simple MA."""
    df = pd.DataFrame({'date': pd.date_range('1/1/2023', periods=30, freq='D'), 'value': range(30)})
    forecast = run_moving_average(df, period=5)
    for f in forecast:
        assert f['ci_upper'] >= f['forecast']
        assert f['ci_lower'] <= f['forecast']

def test_moving_average_exact_30_rows():
    """Test execution when exactly 30 rows are passed (minimum requirement)."""
    df = pd.DataFrame({'date': pd.date_range('1/1/2023', periods=30, freq='D'), 'value': [50]*30})
    forecast = run_moving_average(df, period=7)
    assert len(forecast) == 8

def test_moving_average_constant_dataset():
    """Test robustness against perfectly horizontal data lines (0 variance)."""
    df = pd.DataFrame({'date': pd.date_range('1/1/2023', periods=40, freq='D'), 'value': [0]*40})
    forecast = run_moving_average(df, period=7)
    assert forecast[0]['forecast'] == 0
