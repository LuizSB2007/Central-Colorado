import React, { useState, useEffect } from 'react';
import RankingItem from '../components/vacilometro/RankingItem';
import HistoricoList from '../components/vacilometro/HistoricoList';
import VaciloModal from '../components/modals/VaciloModal';
import RegrasModal from '../components/modals/RegrasModal';
import { AlertTriangle, Plus, ScrollText } from 'lucide-react';
import { babaloradoService } from '../services/babaloradoService';

export default function Vacilometro() {
  const [ranking, setRanking] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [view, setView] = useState('ranking'); // 'ranking' | 'historico'
  const [isVaciloModalOpen, setVaciloModalOpen] = useState(false);
  const [isRegrasModalOpen, setRegrasModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [rankingData, historicoData] = await Promise.all([
        babaloradoService.getRanking(),
        babaloradoService.getHistorico()
      ]);
      setRanking(rankingData);
      setHistorico(historicoData);
    } catch (error) {
      console.error('Erro ao carregar babalorado:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const totalVacilos = historico.length;
  const totalPontos = historico.reduce((acc, v) => acc + v.points, 0);
  const totalMoradores = ranking.length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Babalorado 🏆</h1>
          <p className="text-slate-500 text-sm">Ranking de convivência da rep.</p>
        </div>
        <button
          onClick={() => setVaciloModalOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white p-2.5 rounded-xl transition-colors flex items-center justify-center shadow-md shadow-orange-200"
        >
          <Plus size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* Stats bar */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 bg-white border border-slate-100 rounded-xl p-3 text-center shadow-sm">
          <p className="text-xl font-black text-orange-500">{totalVacilos}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Vacilos</p>
        </div>
        <div className="flex-1 bg-white border border-slate-100 rounded-xl p-3 text-center shadow-sm">
          <p className="text-xl font-black text-red-500">{totalPontos}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Pts Totais</p>
        </div>
        <div className="flex-1 bg-white border border-slate-100 rounded-xl p-3 text-center shadow-sm">
          <p className="text-xl font-black text-slate-700">{totalMoradores}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Moradores</p>
        </div>
      </div>

      {/* Regra do mês destaque
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-4 mb-5 text-white shadow-lg shadow-slate-900/20">
        <div className="flex items-center gap-2 mb-1.5">
          <AlertTriangle size={16} className="text-yellow-400 shrink-0" />
          <h2 className="font-semibold text-slate-200 text-sm">Regra do Mês</h2>
        </div>
        <p className="text-sm font-medium leading-relaxed text-slate-300">
          O 1º colocado paga 1 fardo de cerveja no próximo churrasco. Evite vacilar!
        </p>
      </div> */}

      {/* Tabs de navegação */}
      <div className="flex bg-slate-100 rounded-xl p-1 mb-5 gap-1">
        <button
          onClick={() => setView('ranking')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${view === 'ranking' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
        >
          🏆 Ranking
        </button>
        <button
          onClick={() => setView('historico')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${view === 'historico' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
        >
          📜 Histórico
          {totalVacilos > 0 && (
            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${view === 'historico' ? 'bg-orange-500 text-white' : 'bg-slate-300 text-slate-600'
              }`}>
              {totalVacilos}
            </span>
          )}
        </button>
      </div>

      {/* Conteúdo da aba */}
      {loading ? (
        <p className="text-center text-sm text-slate-500 py-6">Carregando...</p>
      ) : view === 'ranking' ? (
        <div className="flex flex-col">
          {ranking.length === 0 && (
            <p className="text-center text-slate-400 text-sm py-4">Nenhum vacilo registrado ainda.</p>
          )}
          {ranking.map((morador, index) => (
            <RankingItem
              key={morador.id}
              integrante={morador}
              position={index + 1}
            />
          ))}
        </div>
      ) : (
        <HistoricoList historico={historico} />
      )}

      {/* Botão Regras no rodapé */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setRegrasModalOpen(true)}
          className="flex items-center gap-2 text-slate-400 hover:text-orange-500 text-sm font-semibold transition-colors py-2 px-4 rounded-xl hover:bg-orange-50"
        >
          <ScrollText size={16} />
          📜 Regras do Jogo
        </button>
      </div>

      {/* Modals */}
      <VaciloModal
        isOpen={isVaciloModalOpen}
        onClose={() => {
          setVaciloModalOpen(false);
          carregarDados(); // Recarrega após registrar vacilo
        }}
      />
      <RegrasModal isOpen={isRegrasModalOpen} onClose={() => setRegrasModalOpen(false)} />
    </div>
  );
}
