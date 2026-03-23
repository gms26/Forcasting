import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

def get_gemini_explanation(
    model_name: str,
    periods: int,
    historical_values: list,
    forecast_values: list,
    trend_direction: str,
    mae: float,
    rmse: float,
    mape: float
) -> str:
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return get_fallback_explanation(
                model_name, periods, trend_direction, mape)

        client = genai.Client(api_key=api_key)

        hist_values = historical_values[-10:] \
            if len(historical_values) >= 10 \
            else historical_values
        fore_values = forecast_values[:10] \
            if len(forecast_values) >= 10 \
            else forecast_values

        hist_str = ", ".join(
            [str(round(float(v), 2)) for v in hist_values])
        forecast_str = ", ".join(
            [str(round(float(v), 2)) for v in fore_values])

        prompt = f"""
You are a business data analyst. Analyze this forecast.

Model: {model_name}
Forecast Period: Next {periods} days
Last 10 Historical Values: {hist_str}
Next 10 Forecasted Values: {forecast_str}
Trend Direction: {trend_direction}
MAE: {mae}, RMSE: {rmse}, MAPE: {mape}%

Provide exactly this in under 120 words:
1. Trend Summary: What direction is the data moving
2. Pattern: Any seasonality or recurring pattern
3. Recommendation: One clear business action
4. Risk: One key uncertainty or risk factor
"""
        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt
        )
        return response.text

    except Exception as e:
        print(f"Gemini API Error: {str(e)}")
        return get_fallback_explanation(
            model_name, periods, trend_direction, mape)


def get_fallback_explanation(
    model_name: str,
    periods: int,
    trend_direction: str,
    mape: float
) -> str:
    return (
        f"Based on the {model_name} model for the next "
        f"{periods} days, the trend indicates "
        f"{trend_direction} growth. "
        f"Recommendation: Monitor actuals closely. "
        f"MAPE is {mape}%. "
        f"Risk: Unexpected changes could cause deviations "
        f"beyond the confidence interval."
    )
