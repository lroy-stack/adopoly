
import React from 'react';
import { AdData } from '../types';
import { X, ExternalLink, TrendingUp, Award, Share2 } from 'lucide-react';

interface AdModalProps {
  ad: AdData;
  onClose: () => void;
}

const AdModal: React.FC<AdModalProps> = ({ ad, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/20 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="bg-white/90 backdrop-blur-2xl w-full max-w-sm rounded-[40px] shadow-2xl overflow-hidden relative transform transition-all animate-in zoom-in-95 slide-in-from-bottom-5 duration-500 border border-white/50"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100/80 hover:bg-white text-slate-500 rounded-full transition-all z-20 shadow-sm"
        >
          <X size={16} />
        </button>

        <div className="relative h-40 overflow-hidden">
          <img 
            src={`https://picsum.photos/seed/${ad.id}/600/300`} 
            alt={ad.name}
            className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent" />
        </div>

        <div className="px-8 pb-8 pt-0">
          <div className="flex items-center gap-3 mb-4 -mt-6 relative z-10">
            <div className="bg-white p-1 rounded-2xl shadow-xl border border-slate-50">
              <img src={ad.logo} alt="Logo" className="w-14 h-14 rounded-xl object-cover" />
            </div>
            <div className="pt-6">
              <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none mb-1">{ad.name}</h2>
              <div 
                className="inline-block px-2 py-0.5 rounded-full text-white text-[8px] font-black uppercase tracking-widest"
                style={{ backgroundColor: ad.color }}
              >
                {ad.category}
              </div>
            </div>
          </div>

          <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium line-clamp-3">
            {ad.description}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-3 bg-white/50 rounded-2xl border border-white flex items-center gap-2">
              <TrendingUp className="text-blue-500" size={14} />
              <div>
                <div className="text-[8px] text-slate-400 font-black uppercase tracking-tighter">Engage</div>
                <div className="text-xs font-black text-slate-700">{ad.engagementScore}</div>
              </div>
            </div>
            <div className="p-3 bg-white/50 rounded-2xl border border-white flex items-center gap-2">
              <Award className="text-amber-500" size={14} />
              <div>
                <div className="text-[8px] text-slate-400 font-black uppercase tracking-tighter">Tier</div>
                <div className="text-xs font-black text-slate-700">Elite</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a 
              href={ad.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 bg-slate-900 hover:bg-black text-white py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              VISIT BRAND
              <ExternalLink size={14} />
            </a>
            <button className="p-3.5 bg-white shadow-sm hover:shadow-md text-slate-600 rounded-2xl transition-all border border-slate-100">
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdModal;
