import React, { useState, useEffect } from 'react';
import { Bot, RefreshCw } from 'lucide-react';
import axios from 'axios';

const AIExplanation = ({ explanation, onRegenerate, loading }) => {
  const [displayedText, setDisplayedText] = useState('');

  // Typewriter effect
  useEffect(() => {
    if (!explanation) {
      setDisplayedText('');
      return;
    }
    
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(prev => prev + explanation.charAt(i));
      i++;
      if (i === explanation.length) {
        clearInterval(interval);
      }
    }, 15); // Adjust speed here

    return () => clearInterval(interval);
  }, [explanation]);

  if (!explanation && !loading) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-navy-900 p-6 rounded-xl shadow-lg border border-indigo-500/30 text-white mt-6 relative overflow-hidden animate-fade-in flex flex-col h-full">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full blur-[80px] opacity-20 transform translate-x-10 -translate-y-10"></div>
      
      <div className="flex justify-between items-center mb-4 relative z-10">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Bot className="w-6 h-6 text-orange-400" /> AI Insights
        </h2>
        <button 
          onClick={onRegenerate}
          disabled={loading}
          className="text-indigo-200 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full"
          title="Regenerate Insight"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="flex-1 relative z-10">
        {loading ? (
          <div className="flex items-center gap-3 text-indigo-200">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
            </span>
            Analyzing forecast data...
          </div>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none">
            {displayedText.split('\n').map((line, i) => (
              <p key={i} className="mb-2 leading-relaxed text-indigo-50">{line}</p>
            ))}
            {/* Blinking cursor */}
            {displayedText.length < explanation?.length && (
              <span className="inline-block w-2.5 h-4 bg-orange-400 ml-1 animate-pulse"></span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIExplanation;
