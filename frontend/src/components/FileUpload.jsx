import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, Database } from 'lucide-react';
import axios from 'axios';

const FileUpload = ({ onDataLoaded }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:8000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onDataLoaded(response.data.data, file.name);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'File upload failed');
    } finally {
      setLoading(false);
    }
  }, [onDataLoaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false
  });

  const loadSampleData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://127.0.0.1:8000/sample');
      onDataLoaded(response.data.data, 'Sample Dataset (Sales)');
    } catch (err) {
      setError('Could not load sample data. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-navy-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-navy-700">
      <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
        <Database className="w-5 h-5 text-orange-500" /> Data Source
      </h2>
      
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200
          ${isDragActive ? 'border-orange-500 bg-orange-50 dark:bg-navy-700/50' : 'border-slate-300 dark:border-navy-600 hover:bg-slate-50 dark:hover:bg-navy-800/80'}`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="w-10 h-10 mx-auto mb-3 text-slate-400" />
        {isDragActive ? (
          <p className="text-orange-600 dark:text-orange-400 font-medium">Drop CSV file here...</p>
        ) : (
          <div>
            <p className="text-slate-700 dark:text-slate-300 font-medium">Drag & drop your CSV here, or click to browse</p>
            <p className="text-sm text-slate-500 mt-2">Requires columns: date, value</p>
          </div>
        )}
      </div>

      {loading && (
        <div className="mt-4 flex items-center justify-center gap-2 text-orange-500">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent"></div>
          <span className="text-sm">Processing data...</span>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-800/30">
          {error}
        </div>
      )}

      <div className="mt-6 text-center">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-navy-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-navy-800 text-slate-500">OR</span>
          </div>
        </div>
        
        <button 
          onClick={loadSampleData}
          disabled={loading}
          className="mt-4 w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-navy-700 dark:hover:bg-navy-600 text-slate-700 dark:text-slate-200 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" /> Try with Sample Data
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
