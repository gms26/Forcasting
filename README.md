# SmartForecast AI — Forecasting Dashboard with AI Insights

SmartForecast AI is a fully featured time series forecasting dashboard built with React, FastAPI, statistical models, and Google Gemini 1.5 Flash for AI-powered business insights.

## ✨ Features
- **CSV Data Upload**: Supports date/value CSV files with automatic missing data imputation.
- **Built-in Sample Data**: Instantly try the app using the "Try with Sample Data" button without uploading a CSV.
- **Multiple Forecasting Models**:
  - **Moving Average**: Quick, simple smoothing for short-term trends.
  - **ARIMA**: Statistical model using auto-parameter tuning.
  - **Holt-Winters**: Robust statistical framework excelling in strong seasonality (Exponential Smoothing).
- **Interactive Visualization**: Recharts integration showing historical data, confidence intervals, and forecasted trends.
- **AI Explanations**: Integrates with Google Gemini 1.5 Flash.
- **Compare All Models**: Run all three models simultaneously to find the best MAPE score.
- **Authentication**: Simple Professional Login Page to access the Dashboard.
- **Exporting**: Download results as a professional PDF report or raw CSV data.

---

## 🚀 How to Run the App (Commands)

You will need two separate terminal windows to run this application: one for the Backend, and one for the Frontend.

### Terminal 1: Run the Backend (FastAPI + Python)
1. Open a terminal and go to the `backend` folder.
2. Activate your virtual environment and run the server:
```bash
cd smartforecast-ai/backend
venv\Scripts\activate
uvicorn main:app --reload
```
*(The backend will start running on `http://localhost:8000`)*

### Terminal 2: Run the Frontend (React + Vite)
1. Open a second terminal and go to the `frontend` folder.
2. Start the Vite server:
```bash
cd smartforecast-ai/frontend
npm run dev
```
*(The frontend will start running on `http://localhost:5173` or `http://127.0.0.1:5173`)*

---

## 🛠 Tech Stack

| Component | Technology |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, React Router |
| Backend | FastAPI, Uvicorn |
| Data Processing | Pandas, NumPy |
| ML Models | `statsmodels`, `pmdarima` |
| AI Integration | `google-generativeai` (Gemini 1.5 Flash) |

## 🔑 Setup Gemini API (Optional for AI Insights)
1. Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/).
2. Create a `.env` file in the `backend/` directory.
3. Add your key: `GEMINI_API_KEY=your_api_key_here`

## 📝 Folder Structure
```text
smartforecast-ai/
├── frontend/             # React application (UI, Login, Dashboard)
├── backend/              # FastAPI server (Models, Explainer, PDF)
└── sample_data/          # Synthetic sales dataset
```
