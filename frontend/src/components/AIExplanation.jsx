import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';

export default function AIExplanation({ explanation, onRegenerate, isLoading }) {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    if (!explanation) {
      setDisplayedText('');
      return;
    }
    
    // Typewriter effect
    let i = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      setDisplayedText(prev => prev + explanation.charAt(i));
      i++;
      if (i >= explanation.length) {
        clearInterval(timer);
      }
    }, 12);
    
    return () => clearInterval(timer);
  }, [explanation]);

  if (!explanation && !isLoading) {
    return null;
  }

  return (
    <div className="dash-card p-6">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900">Forecast explanation</h3>
        </div>
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            disabled={isLoading}
            className="p-1.5 text-slate-500 hover:text-blue-700 transition-colors disabled:opacity-50 hover:bg-blue-50 rounded-lg"
            title="Regenerate explanation"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>
      
      <div>
        {isLoading && !displayedText ? (
          <div className="flex items-center space-x-2 text-blue-600 py-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            <span className="ml-2 text-xs text-slate-500">Preparing the explanation…</span>
          </div>
        ) : (
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
            {displayedText}
          </p>
        )}
      </div>
    </div>
  );
}
