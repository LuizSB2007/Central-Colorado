import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

export default function TarefaCard({ tarefa, isLoggedUser }) {
  const isDone = tarefa.concluida;

  return (
    <div className={`p-4 rounded-2xl mb-3 flex items-center justify-between border ${isLoggedUser ? 'border-orange-500 bg-orange-50/30' : 'border-slate-100 bg-white'} shadow-sm`}>
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner ${tarefa.integrante.cor}`}>
          {tarefa.integrante.avatar}
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">{tarefa.integrante.nome}</h3>
          <p className="text-sm text-slate-500 font-medium">{tarefa.comodo}</p>
        </div>
      </div>
      
      <button 
        className={`transition-colors ${isDone ? 'text-green-500' : 'text-slate-300 hover:text-slate-400'}`}
        disabled={!isLoggedUser}
      >
        {isDone ? (
          <CheckCircle2 size={28} className="fill-green-100" />
        ) : (
          <Circle size={28} />
        )}
      </button>
    </div>
  );
}
