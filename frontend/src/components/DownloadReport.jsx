import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import axios from 'axios';

const DownloadReport = ({ reportData, isComparing }) => {
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingCsv, setLoadingCsv] = useState(false);

  // If comparing, we might want to change the download behavior or restrict to CSV
  // But ideally, we can download the comparison too. For now, support both.

  const downloadPdf = async () => {
    setLoadingPdf(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/download/pdf', reportData, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `SmartForecast_Report_${reportData.model || 'Comparison'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download PDF.");
    } finally {
      setLoadingPdf(false);
    }
  };

  const downloadCsv = async () => {
    setLoadingCsv(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/download/csv', reportData, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `SmartForecast_Data_${reportData.model || 'Comparison'}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to download CSV.");
    } finally {
      setLoadingCsv(false);
    }
  };

  return (
    <div className="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-navy-700 mt-6 animate-fade-in flex flex-col justify-center">
      <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
        <Download className="w-5 h-5 text-orange-500" /> Export Results
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button 
          onClick={downloadPdf}
          disabled={loadingPdf}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-navy-800 hover:bg-navy-900 text-white rounded-lg transition-colors disabled:opacity-70"
        >
          {loadingPdf ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          ) : (
            <FileText className="w-5 h-5" />
          )}
          Download PDF
        </button>
        
        <button 
          onClick={downloadCsv}
          disabled={loadingCsv}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-500/30 font-medium rounded-lg transition-colors disabled:opacity-70"
        >
          {loadingCsv ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-orange-500 border-t-transparent"></div>
          ) : (
            <FileSpreadsheet className="w-5 h-5" />
          )}
          Export CSV
        </button>
      </div>
    </div>
  );
};

export default DownloadReport;
