import pytest
import pandas as pd
import numpy as np
from forecasting.holt_winters import run_holt_winters

@pytest.fixture
def seasonal_data():
    """Generates 90 days of synthetic data with clear 7-day seasonality."""
    dates = pd.date_range(start='1/1/2023', periods=90, freq='D')
    values = [100 + (10 if d.weekday() >= 5 else 0) + np.random.normal(0, 2) for d in dates]
    return pd.DataFrame({'date': dates, 'value': values})

def test_holt_winters_training_and_return_size(seasonal_data):
    """Ensure Holt-Winters trains successfully and returns correct forecast period length."""
    forecast = run_holt_winters(seasonal_data, period=30)
    # 30 days + 1 connection point
    assert len(forecast) == 31

def test_holt_winters_confidence_intervals(seasonal_data):
    """Check Holt-Winters response contains upper and lower bounds properly generated."""
    forecast = run_holt_winters(seasonal_data, period=7)
    for f in forecast:
        assert 'ci_upper' in f
        assert 'ci_lower' in f
        assert f['ci_upper'] >= f['forecast']
        assert f['ci_lower'] <= f['forecast']

def test_holt_winters_missing_dates():
    """Test Holt-Winters automatically works even if days in the data sequence are missing."""
    dates = pd.date_range(start='1/1/2023', periods=40, freq='D')
    df = pd.DataFrame({'date': dates, 'value': range(40)})
    df = df.drop([10, 11, 12, 13]) # Drop middle days
    forecast = run_holt_winters(df, period=5)
    assert len(forecast) == 6

def test_holt_winters_positive_sales(seasonal_data):
    """Verify Holt-Winters prediction doesn't wildly crash into negatives for typical sales."""
    forecast = run_holt_winters(seasonal_data, period=10)
    assert all(f['forecast'] >= 0 for f in forecast)
