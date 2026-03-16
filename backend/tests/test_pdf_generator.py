import pytest
from utils.pdf_generator import generate_pdf_report
import io
from PyPDF2 import PdfReader

def test_pdf_generated_successfully():
    """Check that reportlab correctly builds and returns a valid byte array."""
    data = {
        "title": "Sales Forecast",
        "summary": "Detailed summary",
        "model": "ARIMA",
        "period": 30,
        "explanation": "Trending up.",
        "metrics": {"mae": 1.0, "rmse": 1.5, "mape": 5.0},
        "forecast": [{"date": "2023-01-01", "forecast": 100}]
    }
    
    pdf_bytes = generate_pdf_report(data)
    assert len(pdf_bytes) > 2000 # ensure it's not a tiny empty file
    
    # Read back the PDF to ensure it's valid format
    reader = PdfReader(io.BytesIO(pdf_bytes))
    assert len(reader.pages) >= 1
    
    text = reader.pages[0].extract_text()
    assert "Sales Forecast" in text
    assert "ARIMA" in text
