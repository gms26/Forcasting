import pytest
import pandas as pd
import numpy as np
from forecasting.arima_model import run_arima

@pytest.fixture
def sample_data():
    dates = pd.date_range(start='1/1/2023', periods=60, freq='D')
    values = np.linspace(10, 50, 60) + np.random.normal(0, 1, 60)
    return pd.DataFrame({'date': dates, 'value': values})

@pytest.fixture
def flat_data():
    dates = pd.date_range(start='1/1/2023', periods=60, freq='D')
    return pd.DataFrame({'date': dates, 'value': [100]*60})

def test_arima_training_and_return_size(sample_data):
    """Ensure ARIMA trains successfully and returns the exact requested number of forecast points."""
    period = 10
    forecast = run_arima(sample_data, period=period)
    # 10 days + 1 connection point
    assert len(forecast) == 11

def test_arima_confidence_intervals(sample_data):
    """Check that confidence_lower is less than forecast, which is less than confidence_upper."""
    forecast = run_arima(sample_data, period=5)
    for row in forecast:
        assert row['ci_lower'] <= row['forecast'] <= row['ci_upper']

def test_arima_flat_data(flat_data):
    """Ensure ARIMA doesn't crash on completely flat unvarying data."""
    forecast = run_arima(flat_data, period=5)
    assert len(forecast) == 6
    assert abs(forecast[0]['forecast'] - 100.0) < 1.0

def test_arima_positive_values(sample_data):
    """Ensure ARIMA enforces positive baseline values or doesn't fail wildly."""
    forecast = run_arima(sample_data, period=10)
    assert all(f['forecast'] > 0 for f in forecast)
