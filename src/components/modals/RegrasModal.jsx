import React from 'react';
import BottomSheet from '../common/BottomSheet';
import { BookOpen, Trophy, Zap, AlertTriangle } from 'lucide-react';

const regras = [
  {
    num: 1,
    texto: 'Pontuação de 10+ pontos: Multa de R$15 + Lavar toda a louça acumulada por 1 dia.',
    icone: '⚠️',
  },
  {
    num: 2,
    texto: 'Pontuação de 15+ pontos: Multa de R$30 (escalonada ao final do mês) + Limpeza da pior área da casa por 1 mês.',
    icone: '🚨',
  },
  {
    num: 3,
    texto: 'Pontuação de 20+ pontos: Multa de R$45 (escalonada ao final do mês) + Limpeza total das louças do próximo churrasco + Semáforo durante 1 hora.',
    icone: '🛑',
  },
  {
    num: 4,
    texto: 'O Babá do Mês (quem tomou mais pontos) deverá lavar a sua própria louça.',
    icone: '🧽',
  },
  {
    num: 5,
    texto: 'Benefício: Escolher 1 membro entre as 3 piores pontuações para passar uma reunião de sunga, óculos e touca de natação.',
    icone: '🩲',
  },
  {
    num: 6,
    texto: 'Benefício: Troca de área da limpeza à sua escolha entre as 3 piores pontuações do mês (uso único).',
    icone: '🔄',
  },
  {
    num: 7,
    texto: 'Benefício: Uma resenha do mês sem ter que pagar (Conversa) + Foto na parede da sala de "Laranja do Mês".',
    icone: '🍊',
  },
  {
    num: 8,
    texto: 'As pontuações resetam mensalmente.',
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
