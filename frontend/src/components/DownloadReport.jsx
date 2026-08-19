import React, { useState } from 'react';
import { FileDown, FileText, Download } from 'lucide-react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function DownloadReport({ forecastData, metrics, explanation, modelName, periods }) {
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isCsvLoading, setIsCsvLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownloadPDF = async () => {
    if (!forecastData) return;
    setIsPdfLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_BASE}/download/pdf`, {
        model_name: modelName || 'Champion Model',
        periods: periods || 30,
        mae: metrics?.mae || 0,
        rmse: metrics?.rmse || 0,
        mape: metrics?.mape || 0,
        explanation: explanation || "No explanation generated."
      }, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'forecast_report.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError('Failed to generate PDF report.');
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleDownloadCSV = async () => {
    if (!forecastData) return;
    setIsCsvLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_BASE}/download/csv`, {
        dates: forecastData.dates || [],
        forecast: forecastData.forecast || [],
        confidence_upper: forecastData.confidence_upper || [],
        confidence_lower: forecastData.confidence_lower || []
      }, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'forecast_predictions.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError('Failed to generate CSV download.');
    } finally {
      setIsCsvLoading(false);
    }
  };

  return (
    <div className="rasera-card rounded-2xl p-6 shadow-md border border-[#004775]">
      <h3 className="text-base font-bold text-white mb-4">Export Forecasting Deliverables</h3>
      
      {error && (
        <div className="mb-4 text-xs text-rose-300 bg-rose-950/60 p-3 rounded-xl border border-rose-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* PDF Download Button */}
        <button
          onClick={handleDownloadPDF}
          disabled={isPdfLoading}
          className="flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#a2fff4] via-[#6aceff] to-[#3b82f6] text-[#00131c] font-extrabold text-sm hover:opacity-95 shadow-md shadow-[#6aceff]/20 disabled:opacity-50 transition-all active:scale-[0.99]"
        >
          {isPdfLoading ? (
            <div className="h-4 w-4 border-2 border-[#00131c] border-t-transparent rounded-full animate-spin" />
          ) : (
            <FileText className="h-4 w-4 text-[#00131c]" />
          )}
          <span>Download Executive PDF</span>
        </button>

        {/* CSV Download Button */}
        <button
          onClick={handleDownloadCSV}
          disabled={isCsvLoading}
          className="flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-[#002238] border border-[#004775] text-[#97dcff] hover:text-white hover:bg-[#002f4d] font-bold text-sm disabled:opacity-50 transition-all"
        >
          {isCsvLoading ? (
            <div className="h-4 w-4 border-2 border-[#97dcff] border-t-transparent rounded-full animate-spin" />
          ) : (
            <FileDown className="h-4 w-4 text-[#a2fff4]" />
          )}
          <span>Export Prediction CSV</span>
        </button>
      </div>
    </div>
  );
}
