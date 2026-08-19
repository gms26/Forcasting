import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
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
        model_name: modelName || 'Best Model',
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
    <div className="dash-card p-6">
      <div className="flex items-center space-x-2 text-gray-900 mb-4">
        <Download className="h-5 w-5 text-blue-600" />
        <h3 className="text-base font-bold text-gray-900">Export Results</h3>
      </div>
      
      {error && (
        <div className="mb-4 text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {/* PDF Download Button */}
        <button
          onClick={handleDownloadPDF}
          disabled={isPdfLoading}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-colors disabled:opacity-50"
        >
          {isPdfLoading ? (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          <span>Download PDF Report</span>
        </button>

        {/* CSV Download Button */}
        <button
          onClick={handleDownloadCSV}
          disabled={isCsvLoading}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold text-sm shadow-sm transition-colors disabled:opacity-50"
        >
          {isCsvLoading ? (
            <div className="h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
          )}
          <span>Export Forecast Data (CSV)</span>
        </button>
      </div>
    </div>
  );
}
