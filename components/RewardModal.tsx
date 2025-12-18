
import React from 'react';
import { Reward } from '../types';
import { PartyPopper, Coins, Star, Trophy, ArrowRight } from 'lucide-react';

interface RewardModalProps {
  reward: Reward;
  streak: number;
  onClose: () => void;
}

const RewardModal: React.FC<RewardModalProps> = ({ reward, streak, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl overflow-hidden relative transform transition-all animate-in zoom-in-95 duration-500">
        
        {/* Animated Background Element */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-500 to-indigo-600">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent animate-pulse" />
        </div>

        <div className="relative pt-16 px-8 pb-8 text-center">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white p-4 rounded-full shadow-xl">
             <div className="bg-amber-100 p-4 rounded-full">
               <Trophy className="text-amber-600" size={40} />
             </div>
          </div>

          <h2 className="text-2xl font-black text-slate-800 mb-1">LOOP COMPLETED!</h2>
          <p className="text-slate-500 text-sm font-medium mb-6">You've successfully explored a full circuit.</p>

          <div className="bg-slate-50 rounded-3xl p-6 mb-6 border border-slate-100 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-xl">
                  <Coins className="text-blue-600" size={20} />
                </div>
                <span className="text-sm font-bold text-slate-600">Credits</span>
              </div>
              <span className="text-lg font-black text-slate-900">+{reward.amount}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-rose-100 p-2 rounded-xl">
                  <Star className="text-rose-600" size={20} />
                </div>
                <span className="text-sm font-bold text-slate-600">Streak Bonus</span>
              </div>
              <span className="text-sm font-black text-rose-600">{streak}x Multiplier</span>
            </div>

            {reward.bonus && (
              <div className="pt-4 mt-4 border-t border-slate-200">
                <div className="bg-amber-500 text-white text-[10px] font-black py-1 px-3 rounded-full w-fit mx-auto mb-2 uppercase tracking-widest">Mystery Box Unlock</div>
                <p className="text-sm font-bold text-slate-700">{reward.bonus}</p>
              </div>
            )}
          </div>

          <button 
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-3xl font-black text-lg transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-3"
          >
            CLAIM REWARDS
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardModal;
