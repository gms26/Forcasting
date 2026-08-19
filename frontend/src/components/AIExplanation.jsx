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
    <div className="rasera-card rounded-2xl p-6 relative overflow-hidden shadow-lg border border-[#00507d]">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-32 h-32 bg-[#a2fff4] rounded-full blur-3xl opacity-10" />
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-32 h-32 bg-[#6aceff] rounded-full blur-3xl opacity-10" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xl bg-[#002f4d] border border-[#00558a] flex items-center justify-center text-[#a2fff4]">
              <BrainCircuit className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-white">Gemini 2.5 Executive AI Insights</h3>
          </div>
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              disabled={isLoading}
              className="p-2 text-[#97dcff] hover:text-white transition-colors disabled:opacity-50 hover:bg-[#002f4d] rounded-lg"
              title="Regenerate Insights"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
        
        <div>
          {isLoading && !displayedText ? (
            <div className="flex items-center space-x-2 text-[#97dcff] py-4">
              <div className="w-2 h-2 bg-[#a2fff4] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-[#a2fff4] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-[#a2fff4] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="ml-2 text-sm">Synthesizing executive briefing with Gemini...</span>
            </div>
          ) : (
            <div className="text-sm text-[#cbd5e1] leading-relaxed bg-[#001726]/80 p-5 rounded-xl border border-[#003b64] whitespace-pre-wrap font-sans">
              {displayedText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
