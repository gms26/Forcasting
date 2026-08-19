import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, AlertCircle } from 'lucide-react';

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
      <div className="rasera-card rounded-2xl p-6 shadow-md">
        <h3 className="text-base font-bold text-white mb-4">Active Data Source</h3>
        <div className="flex items-center justify-between p-4 bg-[#002842] rounded-xl border border-[#004775]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#001726] rounded-xl border border-[#003b64]">
              <File className="h-5 w-5 text-[#a2fff4]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{file.name}</p>
              <p className="text-xs text-[#94a3b8]">
                {(file.size / 1024).toFixed(1)} KB • CSV Parsed
              </p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="p-2 text-[#94a3b8] hover:text-rose-400 transition-colors rounded-lg hover:bg-rose-950/30"
            title="Remove file"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rasera-card rounded-2xl p-6 shadow-md">
      <h3 className="text-base font-bold text-white mb-4">Upload Time-Series CSV</h3>
      
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          isDragActive 
            ? 'border-[#a2fff4] bg-[#a2fff4]/10' 
            : 'border-[#003b64] hover:border-[#a2fff4]/60 bg-[#001726]/80'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className={`mx-auto h-10 w-10 mb-3 ${isDragActive ? 'text-[#a2fff4]' : 'text-[#97dcff]'}`} />
        <p className="text-sm font-semibold text-white">
          {isDragActive ? 'Drop your CSV here...' : 'Click or drag CSV dataset here'}
        </p>
        <p className="text-xs text-[#94a3b8] mt-1.5">
          Requires <code className="text-[#a2fff4] font-mono bg-[#00111a] px-1.5 py-0.5 rounded border border-[#003152]">date</code> and <code className="text-[#a2fff4] font-mono bg-[#00111a] px-1.5 py-0.5 rounded border border-[#003152]">value</code> columns
        </p>
      </div>
    </div>
  );
}
