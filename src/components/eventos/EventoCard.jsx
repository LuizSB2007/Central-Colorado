import React from 'react';
import { MapPin, Edit2 } from 'lucide-react';

export default function EventoCard({ evento, onEdit }) {
  const eventDate = new Date(evento.event_date);

  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const formattedDay = eventDate.getDate().toString().padStart(2, '0');
  const formattedMonth = monthNames[eventDate.getMonth()];
  const formattedTime = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-white p-4 rounded-2xl mb-4 shadow-sm border border-slate-100 flex gap-4 relative group">
      <div className="flex flex-col items-center justify-center w-16 bg-slate-50 rounded-xl border border-slate-100 py-2">
        <span className="text-xs font-bold text-orange-500 uppercase">{formattedMonth}</span>
        <span className="text-xl font-bold text-slate-700">{formattedDay}</span>
      </div>
      
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">{evento.category}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => onEdit(evento)} className="p-1 text-slate-300 hover:text-blue-500 transition-colors">
              <Edit2 size={14} />
            </button>
          </div>
        </div>
        <h3 className="font-bold text-slate-800 mb-1 leading-tight">{evento.title}</h3>
        <p className="text-xs text-slate-500 flex items-center gap-1 font-medium mb-1">
          <MapPin size={12} /> {evento.location} • {formattedTime}
        </p>
        {evento.description && (
          <p className="text-xs text-slate-400 line-clamp-2">{evento.description}</p>
        )}
      </div>
    </div>
  );
}
