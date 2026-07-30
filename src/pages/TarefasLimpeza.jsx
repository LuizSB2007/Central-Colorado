import React, { useState, useEffect } from 'react';
import { RotateCcw, CheckCircle2, Circle, Clock } from 'lucide-react';
import { limpezaService } from '../services/limpezaService';
import { useAuth } from '../context/AuthContext';

export default function TarefasLimpeza() {
  const { profile } = useAuth();
  const [tarefas, setTarefas] = useState([]);
  const [cycle, setCycle] = useState(0);
  const [loading, setLoading] = useState(true);

  const carregarEscala = async () => {
    try {
      setLoading(true);
      const currentCycle = limpezaService.getCurrentCycleNumber();
      setCycle(currentCycle);

      let items = await limpezaService.getAssignments(currentCycle);
      
      if (items.length === 0) {
        await limpezaService.generateAssignmentsForCycle(currentCycle);
        items = await limpezaService.getAssignments(currentCycle);
      }

      setTarefas(items);
    } catch (error) {
      console.error('Erro ao carregar escala de limpeza:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEscala();
  }, []);

  const toggleTarefa = async (id, currentStatus, userId) => {
    // Apenas o dono da tarefa pode marcar como concluída
    if (profile?.id !== userId) return;

    try {
      const updated = await limpezaService.toggleConcluido(id, !currentStatus);
      setTarefas(prev => 
        prev.map(t => t.id === id ? { ...t, is_completed: updated.is_completed, updated_at: updated.updated_at } : t)
      );
    } catch (error) {
      alert('Erro ao atualizar status: ' + error.message);
    }
  };

  const concluidas = tarefas.filter(t => t.is_completed).length;
  const total = tarefas.length || 1;
  const progress = Math.round((concluidas / total) * 100);

  const weekLabel = `Ciclo #${cycle} - Rotaciona a cada 15 dias`;

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Limpeza 🧹</h1>
          <p className="text-slate-500 text-sm">Escala rotativa da casa.</p>
        </div>
        <div className="bg-orange-100 p-2 rounded-full cursor-pointer" onClick={carregarEscala}>
          <RotateCcw size={20} className={`text-orange-600 ${loading ? 'animate-spin' : ''}`} />
        </div>
      </div>

      {/* Semana + Progresso */}
      <div className="bg-slate-800 rounded-2xl p-4 mb-6 shadow-lg shadow-slate-800/20">
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Escala Atual</p>
            <p className="text-white font-bold text-sm mt-0.5">{weekLabel}</p>
          </div>
          <span className="text-orange-400 font-black text-lg">{concluidas}/{tarefas.length}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-orange-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-slate-400 text-xs mt-2">{progress}% da limpeza concluída</p>
      </div>

      {/* Cards das tarefas */}
      <div className="flex flex-col gap-3">
        {tarefas.map((tarefa) => {
          const isLoggedUser = tarefa.user_id === profile?.id;
          const concluidaFormatada = tarefa.updated_at
            ? new Date(tarefa.updated_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) +
              ' · ' +
              new Date(tarefa.updated_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
            : null;

          return (
            <div
              key={tarefa.id}
              onClick={() => toggleTarefa(tarefa.id, tarefa.is_completed, tarefa.user_id)}
              className={`p-4 rounded-2xl flex items-center justify-between border transition-all shadow-sm ${
                isLoggedUser ? 'cursor-pointer active:scale-[0.98]' : 'opacity-80'
              } ${
                tarefa.is_completed
                  ? 'bg-green-50 border-green-200'
                  : isLoggedUser
                  ? 'border-orange-300 bg-orange-50/30'
                  : 'border-slate-100 bg-white'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner bg-slate-400 overflow-hidden">
                  {tarefa.profiles?.avatar_url ? (
                    <img src={tarefa.profiles.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    tarefa.profiles?.nickname?.charAt(0).toUpperCase() || '?'
                  )}
                </div>
                <div>
                  <h3 className={`font-semibold ${tarefa.is_completed ? 'text-green-700' : 'text-slate-800'}`}>
                    {tarefa.profiles?.nickname}
                    {isLoggedUser && <span className="text-[10px] ml-1.5 bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-bold">Você</span>}
                  </h3>
                  <p className={`text-sm font-medium ${tarefa.is_completed ? 'text-green-600' : 'text-slate-500'}`}>
                    {tarefa.cleaning_rooms?.name}
                  </p>
                  {tarefa.is_completed && concluidaFormatada && (
                    <p className="text-xs text-green-500 font-medium flex items-center gap-1 mt-0.5">
                      <Clock size={10} /> {concluidaFormatada}
                    </p>
                  )}
                </div>
              </div>

              <button disabled={!isLoggedUser} className={`transition-colors shrink-0 ${tarefa.is_completed ? 'text-green-500' : 'text-slate-300 hover:text-slate-400'}`}>
                {tarefa.is_completed ? (
                  <CheckCircle2 size={28} className="fill-green-100" />
                ) : (
                  <Circle size={28} />
                )}
              </button>
            </div>
          );
        })}
        {!loading && tarefas.length === 0 && (
          <p className="text-center text-slate-400 text-sm py-4">Nenhuma tarefa carregada.</p>
        )}
      </div>
    </div>
  );
}
