import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function TaskWidget({ tarefa }) {
  if (!tarefa) return null;

  return (
    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white shadow-md shadow-orange-500/20 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-orange-100" />
          <h2 className="font-semibold text-orange-50">Sua Tarefa da Semana</h2>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold mb-1">{tarefa.comodo}</p>
          <p className="text-orange-100 text-sm font-medium">Você e a casa agradecem!</p>
        </div>
        {tarefa.concluida ? (
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
            <CheckCircle2 size={28} className="text-white fill-orange-400" />
          </div>
        ) : (
          <button className="bg-white text-orange-600 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-orange-50 transition-colors">
            Fazer
          </button>
        )}
      </div>
    </div>
  );
}
