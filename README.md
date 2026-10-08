# SmartForecast AI 🚀

An AI-powered time series forecasting dashboard where users can upload CSV data, select a forecasting model, generate predictions with confidence intervals, get AI business insights from Google Gemini, compare all models, and download PDF/CSV reports.

<p align="center">
  <img src="assets/dashboard_1.png" width="48%" alt="SmartForecast AI Dashboard - Chart View" />
  <img src="assets/dashboard_2.png" width="48%" alt="SmartForecast AI Dashboard - Model Comparison" />
</p>

## Features
- 📊 **Upload & Visualize**: Drag and drop CSV files and visualize historical data instantly.
- 🤖 **Multiple AI Models**: Choose from Moving Average, ARIMA, Prophet, and Holt-Winters.
- ✨ **Gemini Insights**: Get AI-powered business insights and recommendations based on the forecast.
- 🏆 **Compare Models**: Run all models simultaneously to find the best fit for your dataset.
- 📄 **Export Reports**: Download comprehensive PDF reports and CSV data of your forecasts.
- 🔒 **Secure Auth**: JWT-based authentication to secure your dashboard.

## System Architecture

```mermaid
flowchart LR
    subgraph Client [Client Side]
        A([React Frontend]) -->|CSV Upload| B(Vite & Tailwind)
        B -->|Visualize| C{Recharts}
    end

    subgraph Server [Backend FastAPI]
        D[Uvicorn Server] -->|Parse & Clean| E[(Pandas/Numpy)]
        E --> F((Forecasting Engine))
    end

    subgraph Engine [AI Models]
        F --> G[ARIMA]
        F --> H[Prophet]
        F --> I[Holt-Winters]
    end

    subgraph Insights [Gen AI]
        J{Google Gemini}
    end

    %% Connections
    B <-->|JWT Auth| D
    B -->|API Requests| D
    F -->|Predictions| B
    E -.->|Context| J
    J -.->|Business Insights| B

    classDef client fill:#e0f7fa,stroke:#006064,stroke-width:2px;
    classDef server fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    classDef ai fill:#ede7f6,stroke:#4527a0,stroke-width:2px;

    class A,B,C client;
    class D,E server;
    class F,G,H,I,J ai;
```

## Tech Stack
| Frontend | Backend | AI/ML |
|----------|---------|-------|
| React 18 | FastAPI | Prophet |
| Vite     | Uvicorn | statsmodels (Holt-Winters) |
| Tailwind | Pandas  | pmdarima (ARIMA) |
| Recharts | Numpy   | Google Gemini |
| Axios    | PyJWT   | scikit-learn |

## Setup Instructions

### Environment Variables
Create a `.env` file in the `backend/` directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```
*Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/).*

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

## Demo Credentials
To login to the local dashboard, use:
- **Username**: admin
- **Password**: admin123

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Authenticate user and receive JWT |
| GET | `/sample` | Load pre-generated sample sales data |
| POST | `/upload` | Upload and parse CSV dataset |
| POST | `/forecast` | Run selected forecasting model |
| POST | `/compare` | Run all models and compare MAPE |
| POST | `/explain` | Generate Gemini business insights |
| POST | `/download/pdf` | Generate PDF report |
| POST | `/download/csv` | Export forecast data as CSV |
