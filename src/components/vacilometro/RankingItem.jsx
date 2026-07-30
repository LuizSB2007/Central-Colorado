import React from 'react';
import { Trophy } from 'lucide-react';

export default function RankingItem({ integrante, position }) {
  const isFirst = position === 1;

  return (
    <div className={`p-4 rounded-2xl flex items-center justify-between mb-3 border shadow-sm ${
      isFirst ? 'bg-red-50/50 border-red-200' : 'bg-white border-slate-100'
    }`}>
      <div className="flex items-center gap-4">
        <div className="w-8 flex justify-center">
          {isFirst ? (
            <Trophy size={24} className="text-red-500 fill-red-500" />
          ) : (
            <span className="text-xl font-bold text-slate-400">#{position}</span>
          )}
        </div>
        
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-inner bg-slate-400 overflow-hidden">
          {integrante.avatar_url 
            ? <img src={integrante.avatar_url} alt="" className="w-full h-full object-cover" />
            : integrante.nickname?.charAt(0).toUpperCase() || '?'
          }
        </div>
        
        <div>
          <h3 className={`font-bold ${isFirst ? 'text-red-600' : 'text-slate-800'}`}>
            {integrante.nickname}
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            {isFirst ? 'Líder de vacilos!' : 'Tá na média'}
          </p>
        </div>
      </div>
      
      <div className="flex flex-col items-center justify-center bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
        <span className={`text-lg font-black ${isFirst ? 'text-red-600' : 'text-slate-700'}`}>
          {integrante.total_points || 0}
        </span>
        <span className="text-[10px] font-bold uppercase text-slate-400">Pts</span>
      </div>
    </div>
  );
}
