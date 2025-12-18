
import React from 'react';
import { PlayerRank } from '../types';
import { Trophy, Medal, X } from 'lucide-react';

interface LeaderboardProps {
  ranks: PlayerRank[];
  onClose: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ ranks, onClose }) => {
  return (
    <div className="fixed inset-y-0 right-0 z-50 pointer-events-none flex items-center p-4">
      <div className="w-72 max-h-[80vh] bg-white/80 backdrop-blur-xl rounded-[32px] shadow-2xl pointer-events-auto border border-white/50 overflow-hidden flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-6 pb-2 flex justify-between items-center">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 tracking-tight">
            <Trophy className="text-amber-500" size={18} />
            RANKING
          </h2>
          <button onClick={onClose} className="p-1.5 bg-slate-100/50 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-full transition-all">
            <X size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
          {ranks.sort((a, b) => b.score - a.score).map((rank, i) => (
            <div 
              key={rank.name} 
              className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                rank.isPlayer 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white/50 text-slate-700 border border-white'
              }`}
            >
              <div className="w-6 text-center font-black text-xs">
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-black truncate">{rank.name}</div>
                <div className={`text-[8px] font-black uppercase tracking-wider ${rank.isPlayer ? 'text-blue-200' : 'text-slate-400'}`}>
                  {rank.loops} LAPS
                </div>
              </div>
              <div className="text-[11px] font-black">
                {rank.score.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-slate-900/5 backdrop-blur border-t border-white/50 text-center">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Compete for the Top Slot</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
