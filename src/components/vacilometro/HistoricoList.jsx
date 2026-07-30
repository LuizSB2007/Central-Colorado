import React, { useState } from 'react';
import { Trash2, ImageOff, X } from 'lucide-react';
import { babaloradoService } from '../../services/babaloradoService';

export default function HistoricoList({ historico = [] }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleDelete = async (vacilo) => {
    const nickname = vacilo.receiver?.nickname || 'alguém';
    if (window.confirm(`Contestar o vacilo de ${nickname} ("${vacilo.reason}")? Isso vai remover os ${vacilo.points}pts do placar.`)) {
      try {
        await babaloradoService.deletarVacilo(vacilo.id);
        // Idealmente, o pai recarregaria, mas sem prop callback vamos dar um reload simples
        window.location.reload();
      } catch (err) {
        alert('Erro ao contestar vacilo: ' + err.message);
      }
    }
  };

  if (historico.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 mt-4">
        <span className="text-5xl mb-3">🎉</span>
        <p className="font-bold text-slate-500 mb-1">Nenhum vacilo registrado!</p>
        <p className="text-sm">A rep está em paz. Aproveite!</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3 mt-4">
        {historico.map((vacilo) => {
          const data = new Date(vacilo.created_at);
          const dataFormatada = isNaN(data)
            ? vacilo.created_at
            : data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) +
              ' às ' +
              data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

          const receiverNickname = vacilo.receiver?.nickname || 'Desconhecido';
          const receiverAvatar = vacilo.receiver?.avatar_url;

          return (
            <div key={vacilo.id} className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
              {/* Foto de evidência */}
              {vacilo.image_url ? (
                <div 
                  className="w-full h-36 bg-slate-100 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedImage(vacilo.image_url)}
                >
                  <img src={vacilo.image_url} alt="Evidência" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-full h-20 bg-slate-50 flex items-center justify-center gap-2 text-slate-300 border-b border-slate-100">
                  <ImageOff size={20} />
                  <span className="text-xs font-medium">Sem foto de evidência</span>
                </div>
              )}

              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
                      {receiverAvatar 
                        ? <img src={receiverAvatar} alt="" className="w-full h-full object-cover" />
                        : receiverNickname.charAt(0).toUpperCase()
                      }
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm leading-tight">{receiverNickname}</p>
                      <p className="text-xs text-slate-500">{dataFormatada}</p>
                    </div>
                  </div>
                  <span className="bg-red-100 text-red-600 font-black text-sm px-2.5 py-1 rounded-lg shrink-0">
                    +{vacilo.points}pts
                  </span>
                </div>

                <p className="text-sm text-slate-700 font-medium bg-slate-50 rounded-xl px-3 py-2 mb-3">
                  {vacilo.reason}
                </p>

                <button
                  onClick={() => handleDelete(vacilo)}
                  className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 hover:text-red-500 hover:bg-red-50 py-2 rounded-xl transition-colors border border-slate-100"
                >
                  <Trash2 size={14} /> Contestar / Remover Punição
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Popup de Imagem */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 p-2 rounded-full backdrop-blur-md transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X size={24} />
          </button>
          <img 
            src={selectedImage} 
            alt="Evidência Ampliada" 
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
