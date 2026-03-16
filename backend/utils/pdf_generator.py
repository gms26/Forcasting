import io
import matplotlib
matplotlib.use('Agg') # Non-interactive backend
import matplotlib.pyplot as plt
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
import datetime

def generate_pdf_report(report_data: dict) -> bytes:
    """
    Generates a PDF report containing dataset summary, AI explanation,
    metrics table, and a chart image.
    
    report_data should contain:
    - title: Project Title
    - summary: Dataset summary
    - model: Selected model name
    - period: Forecast period
    - explanation: Full AI explanation
    - metrics: dictionary with MAE, RMSE, MAPE
    - history: list of dicts with date, value
    - forecast: list of dicts with date, forecast, ci_lower, ci_upper
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=18)
    
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='CustomNormal', parent=styles['Normal'], fontSize=11, leading=14))
    styles.add(ParagraphStyle(name='TitleStyle', parent=styles['Heading1'], fontSize=18, textColor=colors.navy))
    
    elements = []
    
    # Title
    elements.append(Paragraph(f"SmartForecast AI Report: {report_data.get('title', 'Forecasting')}", styles['TitleStyle']))
    elements.append(Paragraph(f"Generated on: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}", styles['Normal']))
    elements.append(Spacer(1, 12))
    
    # Dataset Summary
    elements.append(Paragraph("Dataset Summary", styles['Heading2']))
    elements.append(Paragraph(report_data.get('summary', 'N/A'), styles['CustomNormal']))
    elements.append(Spacer(1, 12))
    
    # Model Selection
    elements.append(Paragraph(f"Model Used: {report_data.get('model', 'Unknown')}", styles['Heading3']))
    elements.append(Paragraph(f"Forecast Period: {report_data.get('period', 30)} days", styles['Normal']))
    elements.append(Spacer(1, 12))
    
    # Metrics
    if 'metrics' in report_data:
        elements.append(Paragraph("Accuracy Metrics", styles['Heading3']))
        m = report_data['metrics']
        data = [
            ['Metric', 'Value'],
            ['MAE', f"{m.get('mae', 0):.2f}"],
            ['RMSE', f"{m.get('rmse', 0):.2f}"],
            ['MAPE', f"{m.get('mape', 0):.2f}%"]
        ]
        t = Table(data, colWidths=[100, 100])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (1,0), colors.navy),
            ('TEXTCOLOR', (0,0), (1,0), colors.whitesmoke),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0,0), (-1,0), 12),
            ('BACKGROUND', (0,1), (-1,-1), colors.lightgrey),
            ('GRID', (0,0), (-1,-1), 1, colors.black)
        ]))
        elements.append(t)
        elements.append(Spacer(1, 12))
        
    # Generate Chart
    history = report_data.get('history', [])
    forecast = report_data.get('forecast', [])
    
    if history and forecast:
        hist_dates = [h['date'] for h in history]
        hist_vals = [h['value'] for h in history]
        
        fc_dates = [f['date'] for f in forecast]
        fc_vals = [f['forecast'] for f in forecast]
        
        plt.figure(figsize=(7, 4))
        plt.plot(hist_dates, hist_vals, label="Historical", color='blue')
        
        # Connect the last historical point to first forecast point
        plt.plot([hist_dates[-1], fc_dates[0]], [hist_vals[-1], fc_vals[0]], 'r--')
        plt.plot(fc_dates, fc_vals, label="Forecast", color='orange', linestyle='dashed')
        
        # Need fewer ticks so it doesn't overlap
        plt.xticks(np.arange(0, len(hist_dates)+len(fc_dates), step=max(1, (len(hist_dates)+len(fc_dates))//5)), rotation=45)
        plt.title(f"{report_data['model']} Forecast")
        plt.legend()
        plt.tight_layout()
        
        img_buffer = io.BytesIO()
        plt.savefig(img_buffer, format='png')
        img_buffer.seek(0)
        plt.close()
        
        elements.append(Paragraph("Forecast Chart", styles['Heading2']))
        elements.append(Image(img_buffer, width=400, height=220))
        elements.append(Spacer(1, 12))
        
    # Explanation
    if 'explanation' in report_data:
        elements.append(Paragraph("AI Explanation & Business Insight", styles['Heading2']))
        elements.append(Paragraph(report_data['explanation'].replace('\n', '<br/>'), styles['CustomNormal']))
    
    # Build PDF
    doc.build(elements)
    buffer.seek(0)
    return buffer.read()
