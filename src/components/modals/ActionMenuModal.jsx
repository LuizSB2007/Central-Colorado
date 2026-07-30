import React from 'react';
import BottomSheet from '../common/BottomSheet';
import { MessageSquarePlus, CalendarPlus, Home } from 'lucide-react';

export default function ActionMenuModal({ isOpen, onClose, onNewAviso, onNewEvento, onGoHome }) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="O que deseja fazer?">
      <div className="flex flex-col gap-3">
        <button 
          onClick={() => { onClose(); onGoHome(); }}
          className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-slate-50 transition-colors"
        >
          <div className="bg-slate-100 p-3 rounded-full text-slate-600">
            <Home size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-slate-800 text-lg">Início</h3>
            <p className="text-sm text-slate-500">Voltar para a tela principal</p>
          </div>
        </button>
        <button 
          onClick={() => { onClose(); onNewAviso(); }}
          className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-slate-50 transition-colors"
        >
          <div className="bg-orange-100 p-3 rounded-full text-orange-600">
            <MessageSquarePlus size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-slate-800 text-lg">Novo Aviso</h3>
            <p className="text-sm text-slate-500">Publicar no mural principal</p>
          </div>
        </button>

        <button 
          onClick={() => { onClose(); onNewEvento(); }}
          className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-slate-50 transition-colors"
        >
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <CalendarPlus size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-slate-800 text-lg">Novo Evento</h3>
            <p className="text-sm text-slate-500">Agendar um rolê, festa ou reunião</p>
          </div>
        </button>
      </div>
    </BottomSheet>
  );
}
