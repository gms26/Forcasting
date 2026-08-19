import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';

export default function FileUpload({ onUpload, file, onClear, isLoading }) {
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
        <h3 className="text-base font-bold text-gray-900 mb-4">Data Source</h3>
        <div className="flex items-center justify-between p-4 bg-blue-50/60 rounded-xl border border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-100/80 rounded-lg text-blue-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500 font-mono">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-white rounded-lg transition-colors"
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
      <h3 className="text-base font-bold text-gray-900 mb-4">Data Source</h3>
      
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragActive 
            ? 'border-blue-500 bg-blue-50/50' 
            : 'border-gray-300 hover:border-blue-400 bg-gray-50/50 hover:bg-blue-50/20'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className={`mx-auto h-8 w-8 mb-2 ${isDragActive ? 'text-blue-600' : 'text-gray-400'}`} />
        <p className="text-sm font-semibold text-gray-800">
          {isDragActive ? 'Drop your CSV dataset here...' : 'Upload CSV Dataset'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Requires <code className="text-gray-700 font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200">date</code> and <code className="text-gray-700 font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200">value</code> columns
        </p>
      </div>
    </div>
  );
}
