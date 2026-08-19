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
    }, 15);
    
    return () => clearInterval(timer);
  }, [explanation]);

  if (!explanation && !isLoading) {
    return null;
  }

  return (
    <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-700 p-6 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-20" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-blue-400">
            <Sparkles className="h-5 w-5" />
            <h3 className="text-lg font-medium">AI Business Insights</h3>
          </div>
          <button
            onClick={onRegenerate}
            disabled={isLoading}
            className="p-2 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
            title="Regenerate Insights"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <div className="prose prose-invert max-w-none">
          {isLoading && !displayedText ? (
            <div className="flex items-center space-x-2 text-slate-400 py-4">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="ml-2 text-sm">Analyzing forecast with Gemini...</span>
            </div>
          ) : (
            <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
              {displayedText}
              {!isLoading && displayedText.length === explanation?.length && (
                <span className="inline-block w-1.5 h-4 ml-1 bg-blue-400 animate-pulse align-middle" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
