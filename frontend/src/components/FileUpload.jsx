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
      <div className="ai-card p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center justify-between">
          <span>Data Source</span>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-800/60">
            CSV Ingested
          </span>
        </h3>
        <div className="flex items-center justify-between p-4 bg-[#0a1324] rounded-xl border border-[#1e3a5f]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#0f2442] rounded-xl text-cyan-400 border border-cyan-500/30">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white truncate max-w-[170px]">{file.name}</p>
              <p className="text-xs text-slate-400 font-mono">
                {(file.size / 1024).toFixed(1)} KB • In-Memory
              </p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
            title="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-white">Data Source</h3>
        {onSampleData && (
          <button
            type="button"
            onClick={onSampleData}
            disabled={isLoading}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-mono hover:underline transition-colors"
          >
            <Database className="h-3 w-3" />
            <span>Load Sample Data</span>
          </button>
        )}
      </div>
      
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragActive 
            ? 'border-cyan-400 bg-cyan-950/40' 
            : 'border-[#1e3a5f] hover:border-cyan-500/60 bg-[#091122]/70 hover:bg-[#0c172e]'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className={`mx-auto h-8 w-8 mb-2 ${isDragActive ? 'text-cyan-400' : 'text-slate-400'}`} />
        <p className="text-sm font-semibold text-slate-200">
          {isDragActive ? 'Drop CSV dataset here...' : 'Upload Time-Series CSV'}
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Requires <code className="text-cyan-300 font-mono bg-[#070c18] px-1.5 py-0.5 rounded border border-[#1e3a5f]">date</code> and <code className="text-cyan-300 font-mono bg-[#070c18] px-1.5 py-0.5 rounded border border-[#1e3a5f]">value</code> columns
        </p>
      </div>

      {onSampleData && (
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={onSampleData}
            disabled={isLoading}
            className="text-xs text-slate-400 hover:text-cyan-300 transition-colors inline-flex items-center space-x-1"
          >
            <span>Or quick-test with</span>
            <span className="text-cyan-400 font-semibold underline">sample dataset</span>
          </button>
        </div>
      )}
    </div>
  );
}
