from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
import io
from datetime import datetime

def generate_forecast_pdf(data):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=18)
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30,
        textColor=colors.HexColor('#1e3a8a') # Dark blue
    )
    
    subtitle_style = ParagraphStyle(
        'Subtitle',
        parent=styles['Heading2'],
        fontSize=14,
        spaceAfter=12,
        textColor=colors.HexColor('#374151')
    )
    
    normal_style = styles['Normal']
    
    Story = []
    
    # Title & Header
    Story.append(Paragraph("SmartForecast AI - Forecast Report", title_style))
    Story.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", normal_style))
    Story.append(Spacer(1, 0.25 * inch))
    
    # Dataset Summary
    Story.append(Paragraph("Dataset Summary", subtitle_style))
    dataset_summary = f"""
    Selected Model: {data.get('model_name', 'Unknown')}<br/>
    Forecast Period: Next {data.get('periods', 'N/A')} days<br/>
    """
    Story.append(Paragraph(dataset_summary, normal_style))
    Story.append(Spacer(1, 0.25 * inch))
    
    # Metrics
    Story.append(Paragraph("Accuracy Metrics", subtitle_style))
    metrics_data = [
        ['Metric', 'Value'],
        ['MAE (Mean Absolute Error)', f"{data.get('mae', 'N/A')}"],
        ['RMSE (Root Mean Square Error)', f"{data.get('rmse', 'N/A')}"],
        ['MAPE (Mean Absolute Percentage Error)', f"{data.get('mape', 'N/A')}%"]
    ]
    
    t = Table(metrics_data, colWidths=[3*inch, 2*inch])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3b82f6')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f3f4f6')),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#d1d5db'))
    ]))
    Story.append(t)
    Story.append(Spacer(1, 0.5 * inch))
    
    # AI Explanation
    Story.append(Paragraph("AI Business Insights", subtitle_style))
    explanation = data.get('explanation', 'No explanation provided.')
    Story.append(Paragraph(explanation.replace('\n', '<br/>'), normal_style))
    Story.append(Spacer(1, 1 * inch))
    
    # Footer
    Story.append(Paragraph("SmartForecast AI - AI-powered time series forecasting dashboard", normal_style))
    
    doc.build(Story)
    buffer.seek(0)
    return buffer
