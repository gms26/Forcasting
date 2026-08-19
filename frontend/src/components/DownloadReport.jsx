import React, { useState } from 'react';
import { FileDown, FileText, Download } from 'lucide-react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function DownloadReport({ forecastData, metrics, explanation, modelName, periods }) {
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isCsvLoading, setIsCsvLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownloadPDF = async () => {
    if (!forecastData || !metrics) return;
    setIsPdfLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_BASE}/download/pdf`, {
        model_name: modelName,
        periods: periods,
        mae: metrics.mae,
        rmse: metrics.rmse,
        mape: metrics.mape,
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
      setError('Failed to generate PDF. Please try again.');
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
        dates: forecastData.dates,
        forecast: forecastData.forecast,
        confidence_upper: forecastData.confidence_upper,
        confidence_lower: forecastData.confidence_lower
      }, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'forecast_data.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError('Failed to generate CSV. Please try again.');
    } finally {
      setIsCsvLoading(false);
    }
  };

  if (!forecastData) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-center h-full">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <Download className="h-5 w-5 mr-2 text-blue-600" />
        Export Results
      </h3>
      
      {error && (
        <div className="mb-4 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={handleDownloadPDF}
          disabled={isPdfLoading || isCsvLoading}
          className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors shadow-sm"
        >
          {isPdfLoading ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <FileText className="h-5 w-5 mr-2" />
          )}
          Download PDF Report
        </button>

        <button
          onClick={handleDownloadCSV}
          disabled={isPdfLoading || isCsvLoading}
          className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors shadow-sm"
        >
          {isCsvLoading ? (
            <div className="h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <FileDown className="h-5 w-5 mr-2 text-green-600" />
          )}
          Export Forecast Data (CSV)
        </button>
      </div>
    </div>
  );
}
