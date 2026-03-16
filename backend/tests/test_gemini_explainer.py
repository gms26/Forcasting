import pytest
from unittest.mock import patch
from llm.gemini_explainer import generate_explanation

def test_gemini_api_mock_response():
    """Check that we gracefully mock and parse Gemini responses."""
    with patch("llm.gemini_explainer.genai.GenerativeModel.generate_content") as mock_generate:
        mock_generate.return_value.text = "Mock trend summary. Business insight: invest."
        
        explanation = generate_explanation(
            model_name="ARIMA",
            period=30,
            hist_vals=[100, 105, 110],
            forecast_vals=[115, 120, 125],
            metrics={"mape": 5.0}
        )
        assert "invest" in explanation
        assert "Mock trend" in explanation

def test_gemini_api_failure_fallback():
    """Ensure that if the real API timeouts or fails, a friendly fallback string is used, not a 500 error."""
    with patch("llm.gemini_explainer.genai.GenerativeModel.generate_content") as mock_generate:
        mock_generate.side_effect = Exception("API Timeout")
        
        explanation = generate_explanation(
            model_name="ARIMA",
            period=30,
            hist_vals=[100],
            forecast_vals=[110],
            metrics={"mape": 5.0}
        )
        assert "unable to generate an AI explanation" in explanation.lower()

def test_gemini_missing_api_key(monkeypatch):
    """Test response when API key is None/empty."""
    monkeypatch.setenv("GEMINI_API_KEY", "")
    
    explanation = generate_explanation(
        model_name="ARIMA",
        period=30,
        hist_vals=[100],
        forecast_vals=[110],
        metrics={}
    )
    assert "api key is missing" in explanation.lower() or "unable" in explanation.lower()
