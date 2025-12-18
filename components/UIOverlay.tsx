
import React from 'react';
import { GameState } from '../types';
import { Trophy, Coins, Zap, Target, BarChart3, Star, UserPlus, Building2, ChevronRight } from 'lucide-react';

interface UIOverlayProps {
  gameState: GameState;
  onRandomMove: () => void;
  onToggleLeaderboard: () => void;
  onOpenReferral: () => void;
  onOpenAdManager: () => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ gameState, onRandomMove, onToggleLeaderboard, onOpenReferral, onOpenAdManager }) => {
  const loopProgress = (gameState.currentPosition % 40) / 40 * 100;
  
  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6 font-sans">
      
      {/* Top Left: Mini Stats Pill */}
      <div className="flex flex-col gap-2 items-start pointer-events-auto">
        <div className="bg-white/40 backdrop-blur-xl px-4 py-2 rounded-2xl shadow-sm border border-white/40 flex items-center gap-4 transition-all hover:bg-white/60 group">
          <div className="flex items-center gap-2">
            <Trophy className="text-amber-500 group-hover:scale-110 transition-transform" size={16} />
            <span className="text-sm font-black text-slate-800 tracking-tight">{gameState.score.toLocaleString()}</span>
          </div>
          <div className="w-px h-4 bg-slate-300/50" />
          <div className="flex items-center gap-2">
            <Coins className="text-blue-500 group-hover:scale-110 transition-transform" size={16} />
            <span className="text-sm font-black text-slate-800 tracking-tight">{gameState.tokens}</span>
          </div>
        </div>
        
        {/* Streak/Combo Indicator - Minimal */}
        {gameState.streak > 1 && (
          <div className="bg-rose-500/90 backdrop-blur text-white px-3 py-1 rounded-full font-black text-[10px] shadow-lg flex items-center gap-2 animate-in slide-in-from-left">
            <Star size={10} fill="currentColor" />
            COMBO {gameState.streak}X
          </div>
        )}
      </div>

      {/* Top Right: Vertical Action Stack */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-auto">
        <ActionButton onClick={onOpenAdManager} icon={<Building2 size={20} />} label="Business" color="text-blue-600" />
        <ActionButton onClick={onOpenReferral} icon={<UserPlus size={20} />} label="Invite" color="text-indigo-600" />
        <ActionButton onClick={onToggleLeaderboard} icon={<BarChart3 size={20} />} label="Ranking" color="text-slate-600" />
      </div>

      {/* Bottom Center: The "Discover" Orb & Progress */}
      <div className="flex flex-col items-center gap-6 pointer-events-auto pb-8">
        <button 
          onClick={onRandomMove}
          disabled={gameState.isMoving}
          className={`group relative flex items-center justify-center transition-all ${
            gameState.isMoving ? 'scale-90 opacity-50' : 'hover:scale-110 active:scale-95'
          }`}
        >
          {/* Outer glow ring */}
          <div className={`absolute inset-0 rounded-full bg-blue-500/20 blur-xl transition-all ${
            gameState.isMoving ? 'opacity-0' : 'animate-pulse'
          }`} />
          
          <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl border-2 border-white/50 transition-all ${
            gameState.isMoving ? 'bg-slate-200' : 'bg-slate-900 group-hover:bg-black'
          }`}>
            {gameState.isMoving ? (
              <div className="w-6 h-6 border-4 border-slate-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Target className="text-white" size={32} />
            )}
          </div>
          
          {/* Label that appears on hover */}
          {!gameState.isMoving && (
            <div className="absolute -top-10 bg-black/80 text-white text-[10px] font-black py-1 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap tracking-widest uppercase">
              Next Square
            </div>
          )}
        </button>
      </div>

      {/* Edge-to-Edge Progress Bar (Bottom) */}
      <div className="fixed bottom-0 left-0 w-full h-1.5 bg-slate-200/30 overflow-hidden pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 to-indigo-600 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          style={{ width: `${loopProgress}%` }}
        />
        {/* Lap counter floating just above the bar */}
        <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
          <Zap size={10} className="text-rose-500 fill-current" />
          <span className="text-[10px] font-black text-slate-500/80 uppercase tracking-tighter">
            Lap {gameState.loopsCompleted}
          </span>
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ onClick, icon, label, color }: { onClick: () => void, icon: React.ReactNode, label: string, color: string }) => (
  <button 
    onClick={onClick}
    className="group relative flex items-center justify-end"
  >
    <div className={`mr-2 bg-slate-900/80 text-white text-[10px] font-black py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0`}>
      {label}
    </div>
    <div className={`w-12 h-12 rounded-2xl bg-white/60 backdrop-blur-md border border-white/50 shadow-sm flex items-center justify-center transition-all group-hover:bg-white group-hover:shadow-md group-hover:-translate-y-0.5 active:translate-y-0 ${color}`}>
      {icon}
    </div>
  </button>
);

export default UIOverlay;
