import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, BrainCircuit } from 'lucide-react';

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
    <div className="bg-[#091122] text-white rounded-2xl p-6 shadow-xl border border-[#1e3a5f] relative overflow-hidden">
      {/* Subtle top-right ambient glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-3.5 relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className="h-7 w-7 rounded-lg bg-[#0f2442] border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <BrainCircuit className="h-4 w-4" />
          </div>
          <h3 className="text-base font-bold text-white">Gemini AI Executive Insights</h3>
        </div>
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            disabled={isLoading}
            className="p-1.5 text-slate-400 hover:text-cyan-300 transition-colors disabled:opacity-50 hover:bg-[#13233f] rounded-lg"
            title="Regenerate Insights"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>
      
      <div className="relative z-10">
        {isLoading && !displayedText ? (
          <div className="flex items-center space-x-2 text-cyan-300 py-3">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            <span className="ml-2 text-xs text-slate-300 font-mono">Synthesizing executive briefing with Gemini...</span>
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
