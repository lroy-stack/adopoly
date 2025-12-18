
import React, { useState } from 'react';
import { Users, Copy, Check, Share2, Sparkles } from 'lucide-react';

interface ReferralModalProps {
  code: string;
  onClose: () => void;
}

const ReferralModal: React.FC<ReferralModalProps> = ({ code, onClose }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`Join me on Ad-Opoly! Use my code ${code} for 500 free credits: [URL]`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden relative animate-in zoom-in-95">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-10 text-center text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Users size={120} />
          </div>
          <h2 className="text-3xl font-black mb-2">INVITE FRIENDS</h2>
          <p className="text-indigo-100 font-medium">Grow the ecosystem together and earn permanent multipliers.</p>
        </div>

        <div className="p-10">
          <div className="bg-slate-50 rounded-3xl p-6 mb-8 border border-slate-100 text-center">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Your Referral Code</div>
             <div className="text-4xl font-black text-slate-800 tracking-tighter mb-4">{code}</div>
             <button 
               onClick={copyToClipboard}
               className={`flex items-center gap-2 mx-auto px-6 py-3 rounded-full font-bold text-sm transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white shadow-sm hover:shadow-md text-slate-600 border border-slate-200'}`}
             >
               {copied ? <Check size={18} /> : <Copy size={18} />}
               {copied ? 'COPIED!' : 'COPY CODE'}
             </button>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex gap-4 items-center">
               <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-black">1</div>
               <p className="text-sm font-bold text-slate-600">Friend joins using your code</p>
            </div>
            <div className="flex gap-4 items-center">
               <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-black">2</div>
               <p className="text-sm font-bold text-slate-600">You both get 500 Credits instantly</p>
            </div>
            <div className="flex gap-4 items-center">
               <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 font-black">
                 <Sparkles size={18} />
               </div>
               <p className="text-sm font-bold text-slate-600">Unlock 1.5x Streak Bonus forever</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black transition-all hover:bg-black active:scale-95"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReferralModal;
