import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';

const DownloadReport = ({ onDownloadPdf, onDownloadCsv }) => {
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingCsv, setLoadingCsv] = useState(false);

  const handleDownloadPdf = async () => {
    setLoadingPdf(true);
    try {
      await onDownloadPdf();
    } catch (err) {
      alert("Failed to download PDF.");
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleDownloadCsv = async () => {
    setLoadingCsv(true);
    try {
      await onDownloadCsv();
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
          onClick={handleDownloadPdf}
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
          onClick={handleDownloadCsv}
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
