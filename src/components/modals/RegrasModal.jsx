import React from 'react';
import BottomSheet from '../common/BottomSheet';
import { BookOpen, Trophy, Zap, AlertTriangle } from 'lucide-react';

const regras = [
  {
    num: 1,
    texto: 'Todos os erros exigem evidência em foto para serem computados no placar.',
    icone: '📸',
  },
  {
    num: 2,
    texto: 'O morador com mais pontos ao final do mês paga 1 fardo de cerveja para a rep.',
    icone: '🍺',
  },
  {
    num: 3,
    texto: 'Erros de limpeza (não fez a limpeza semanal) contam pontos em dobro.',
    icone: '🧹',
  },
  {
    num: 4,
    texto: 'Contestações são aceitas por até 24h após o registro. Após esse prazo, o ponto é definitivo.',
    icone: '⚖️',
  },
  {
    num: 5,
    texto: 'Nenhum morador pode registrar vacilo em si mesmo — sempre um terceiro deve registrar.',
    icone: '🤝',
  },
  {
    num: 6,
    texto: 'Portão aberto ou tranca destravada após as 23h conta o dobro de pontos.',
    icone: '🔒',
  },
  {
    num: 7,
    texto: 'O ranking é zerado no início de cada mês. Histórico acumulado é mantido.',
    icone: '📅',
  },
];

export default function RegrasModal({ isOpen, onClose }) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="📜 Regulamento do Jogo">
      <div className="flex flex-col gap-3">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 mb-2">
          <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 font-medium leading-relaxed">
            Este regulamento foi acordado pelos moradores da República Colorado e tem validade interna.
          </p>
        </div>

        {regras.map(regra => (
          <div key={regra.num} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0 text-sm">
              {regra.icone}
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider block mb-0.5">Regra {regra.num}</span>
              <p className="text-sm text-slate-700 leading-relaxed">{regra.texto}</p>
            </div>
          </div>
        ))}

        <div className="mt-2 p-4 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl text-white">
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={16} className="text-yellow-400" />
            <span className="text-sm font-bold">Regra de Ouro</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            O espírito do jogo é a boa convivência. Respeite seus colegas e mantenha a rep em ordem!
          </p>
        </div>
      </div>
    </BottomSheet>
  );
}
