import React from 'react';
import { Pin, Edit2 } from 'lucide-react';

export default function AvisoCard({ aviso, onEdit }) {
  const formattedDate = new Date(aviso.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

  return (
    <div className={`p-4 rounded-2xl mb-4 shadow-sm border relative group ${aviso.is_important ? 'bg-orange-50/50 border-orange-200 border-l-4 border-l-orange-500' : 'bg-white border-slate-100'}`}>
      <div className="flex justify-between items-start mb-2 gap-3">
        <h3 className="font-semibold text-slate-800 flex items-start gap-2 flex-1 leading-tight">
          {aviso.is_important && <Pin size={16} className="text-orange-500 fill-orange-500 shrink-0 mt-0.5" />}
          <span className="break-words">{aviso.title}</span>
        </h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded-full shrink-0 mt-0.5">
          {formattedDate}
        </span>
      </div>
      
      <p className="text-sm text-slate-600 leading-relaxed mb-2">
        {aviso.content}
      </p>

      {aviso.profiles && (
        <p className="text-xs text-slate-400 mb-4">
          Publicado por: {aviso.profiles.nickname}
        </p>
      )}

      <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 mt-2">
        <button onClick={() => onEdit(aviso)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          <Edit2 size={14} /> Opções
        </button>
      </div>
    </div>
  );
}
