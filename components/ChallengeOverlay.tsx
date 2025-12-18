
import React, { useState, useEffect } from 'react';
import { Zap, Timer, MousePointer2 } from 'lucide-react';

interface ChallengeOverlayProps {
  onComplete: (score: number) => void;
  onCancel: () => void;
}

const ChallengeOverlay: React.FC<ChallengeOverlayProps> = ({ onComplete, onCancel }) => {
  const [timeLeft, setTimeLeft] = useState(5);
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else {
      onComplete(clicks * 50);
    }
  }, [timeLeft]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-blue-600/90 backdrop-blur-lg animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] p-10 max-w-sm w-full text-center shadow-2xl scale-110">
        <div className="inline-flex p-4 bg-amber-100 rounded-3xl mb-6">
          <Zap className="text-amber-500 animate-pulse" size={40} fill="currentColor" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-2">FLASH CHALLENGE</h2>
        <p className="text-slate-500 mb-8 font-medium italic">"Click as many times as possible to boost Ad Engagement Score!"</p>

        <div className="flex justify-between items-center mb-10 bg-slate-50 p-6 rounded-3xl border border-slate-100">
          <div className="text-left">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Timer size={12} /> Time
            </div>
            <div className="text-4xl font-black text-slate-900">{timeLeft}s</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 justify-end">
              Clicks <MousePointer2 size={12} />
            </div>
            <div className="text-4xl font-black text-blue-600">{clicks}</div>
          </div>
        </div>

        <button 
          onMouseDown={() => setClicks(prev => prev + 1)}
          className="w-full h-32 bg-slate-900 hover:bg-black active:scale-95 text-white rounded-3xl font-black text-3xl transition-all shadow-xl select-none"
        >
          CLICK!
        </button>
      </div>
    </div>
  );
};

export default ChallengeOverlay;
