import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, X, Database } from 'lucide-react';

export default function FileUpload({ onUpload, file, onClear, onSampleData, isLoading }) {
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles?.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1,
    disabled: isLoading
  });

  if (file) {
    return (
      <div className="dash-card p-6">
        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center justify-between">
          <span>Data Source</span>
          <span className="text-[11px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
            CSV Active
          </span>
        </h3>
        <div className="flex items-center justify-between p-3.5 bg-blue-50/60 rounded-xl border border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 text-white rounded-lg">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 truncate max-w-[170px]">{file.name}</p>
              <p className="text-xs text-gray-500 font-mono">
                {(file.size / 1024).toFixed(1)} KB • Parsed
              </p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-900">Data Source</h3>
        {onSampleData && (
          <button
            type="button"
            onClick={onSampleData}
            disabled={isLoading}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1"
          >
            <Database className="h-3.5 w-3.5" />
            <span>Load Sample Data</span>
          </button>
        )}
      </div>
      
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50/60' 
            : 'border-gray-300 hover:border-blue-400 bg-gray-50/50 hover:bg-blue-50/20'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className={`mx-auto h-8 w-8 mb-2 ${isDragActive ? 'text-blue-600' : 'text-gray-400'}`} />
        <p className="text-sm font-semibold text-gray-700">
          {isDragActive ? 'Drop CSV dataset here...' : 'Upload Time-Series CSV'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Requires <code className="text-blue-700 font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200">date</code> and <code className="text-blue-700 font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200">value</code> columns
        </p>
      </div>

      {onSampleData && (
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={onSampleData}
            disabled={isLoading}
            className="text-xs text-gray-500 hover:text-blue-600 transition-colors inline-flex items-center space-x-1"
          >
            <span>Or quick-test with</span>
            <span className="text-blue-600 font-semibold underline">sample dataset</span>
          </button>
        </div>
      )}
    </div>
  );
}
