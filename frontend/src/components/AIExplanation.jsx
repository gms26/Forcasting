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
    <div className="bg-[#0b132b] text-white rounded-2xl p-6 shadow-lg border border-slate-800 relative overflow-hidden">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center space-x-2.5">
          <Sparkles className="h-5 w-5 text-blue-400" />
          <h3 className="text-base font-bold text-white">AI Business Insights</h3>
        </div>
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            disabled={isLoading}
            className="p-1.5 text-slate-400 hover:text-white transition-colors disabled:opacity-50 hover:bg-slate-800 rounded-lg"
            title="Regenerate Insights"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>
      
      <div>
        {isLoading && !displayedText ? (
          <div className="flex items-center space-x-2 text-blue-300 py-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            <span className="ml-2 text-xs text-slate-300">Synthesizing executive briefing with Gemini...</span>
          </div>
        ) : (
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
            {displayedText}
          </p>
        )}
      </div>
    </div>
  );
}
