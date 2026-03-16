import pytest
import pandas as pd
from fastapi.testclient import TestClient
from main import app
from datetime import datetime, timedelta
import io

@pytest.fixture
def client():
    # Provide the test app client
    return TestClient(app)

@pytest.fixture
def sample_valid_csv():
    """Generates a sample valid CSV with 730 rows of daily data."""
    dates = [datetime(2022, 1, 1) + timedelta(days=i) for i in range(730)]
    values = [100 + i * 0.1 for i in range(730)] # slight trend
    df = pd.DataFrame({'date': [d.strftime('%Y-%m-%d') for d in dates], 'value': values})
    return df.to_csv(index=False).encode('utf-8')

@pytest.fixture
def sample_small_csv():
    """Generates a small CSV with only 10 rows (should fail validation)."""
    dates = [datetime(2022, 1, 1) + timedelta(days=i) for i in range(10)]
    values = [100 + i for i in range(10)]
    df = pd.DataFrame({'date': [d.strftime('%Y-%m-%d') for d in dates], 'value': values})
    return df.to_csv(index=False).encode('utf-8')

@pytest.fixture
def sample_invalid_csv():
    """Generates a CSV missing the required value or format."""
    df = pd.DataFrame({'wrong_col_1': [1,2,3], 'wrong_col_2': ['a','b','c']})
    return df.to_csv(index=False).encode('utf-8')

@pytest.fixture
def mock_gemini_api(mocker):
    """Mocks the gemini AI explanation generation so it doesn't use real credits."""
    mock = mocker.patch('llm.gemini_explainer.generate_explanation')
    mock.return_value = "Mocked explanation containing trend summary and business insight."
    return mock
