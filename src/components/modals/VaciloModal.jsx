import React, { useState, useEffect, useRef } from 'react';
import BottomSheet from '../common/BottomSheet';
import { Camera, X } from 'lucide-react';
import { babaloradoService } from '../../services/babaloradoService';
import { limpezaService } from '../../services/limpezaService';
import { useAuth } from '../../context/AuthContext';

import { compressImage } from '../../utils/imageUtils';

export const CATEGORIAS = [
  { id: 1, emoji: '🗑️', label: 'Largar lixo na sala', pontos: 2 },
  { id: 2, emoji: '🧹', label: 'Sujar e não limpar áreas comuns', pontos: 3 },
  { id: 3, emoji: '🍽️', label: 'Louça na pia sem pregador', pontos: 3 },
  { id: 4, emoji: '⏳', label: 'Louça na pia por mais de 24h', pontos: 2 },
  { id: 5, emoji: '🥤', label: 'Copos/canecas jogados na sala', pontos: 2 },
  { id: 6, emoji: '🧽', label: 'Não realização da faxina', pontos: 5 },
  { id: 7, emoji: '⚠️', label: 'Esqueceu a faxina do cômodo', pontos: 3 },
  { id: 8, emoji: '💡', label: 'Não apagar as luzes', pontos: 1 },
  { id: 9, emoji: '♻️', label: 'Não tirou o lixo no dia', pontos: 3 },
  { id: 10, emoji: '👕', label: 'Lavar roupa fora do dia sem avisar', pontos: 4 },
  { id: 11, emoji: '📌', label: 'Não executar tarefa definida em reunião', pontos: 3 },
  { id: 12, emoji: '🔑', label: 'Esquecer a chave', pontos: 1 },
  { id: 13, emoji: '🍲', label: 'Deixar comida na pia', pontos: 2 },
  { id: 14, emoji: '⏰', label: 'Atrasar na reunião (justificado)', pontos: 3 },
  { id: 15, emoji: '🚨', label: 'Atrasar na reunião (não justificado)', pontos: 4 },
  { id: 16, emoji: '❌', label: 'Faltar na reunião', pontos: 5 },
  { id: 17, emoji: '🍺', label: 'Perder o copo', pontos: 2 },
  { id: 18, emoji: '🎒', label: 'Coisas pessoais largadas em áreas comuns', pontos: 2 },
  { id: 19, emoji: '🚪', label: 'Deixar a porta destrancada', pontos: 2 },
  { id: 20, emoji: '➕', label: 'Outro vacilo', pontos: 1, custom: true },
];

export default function VaciloModal({ isOpen, onClose }) {
  const { profile } = useAuth();
  const [moradores, setMoradores] = useState([]);
  const [infrator, setInfrator] = useState('');
  const [categoria, setCategoria] = useState(null);
  const [pontos, setPontos] = useState('');
  const [motivoCustom, setMotivoCustom] = useState('');
  const [fotoPreview, setFotoPreview] = useState(null);
  const [fotoFile, setFotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  // Buscar moradores reais do Supabase
  useEffect(() => {
    if (isOpen) {
      limpezaService.getResidents().then(setMoradores).catch(console.error);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setInfrator('');
      setCategoria(null);
      setPontos('');
      setMotivoCustom('');
      setFotoPreview(null);
      setFotoFile(null);
    }
  }, [isOpen]);

  const handleCategoria = (cat) => {
    setCategoria(cat);
    setPontos(cat.pontos.toString());
  };

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoFile(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!infrator || !categoria) return;

    setLoading(true);
    try {
      let imageUrl = null;

      // Upload da evidência fotográfica (se houver)
      if (fotoFile) {
        try {
          const compressedFile = await compressImage(fotoFile, 800, 0.7);
          imageUrl = await babaloradoService.uploadEvidencia(compressedFile, compressedFile.name);
        } catch (uploadError) {
          console.warn('Não foi possível fazer upload da foto:', uploadError.message);
        }
      }

      const motivo = categoria.custom ? (motivoCustom || 'Outro vacilo') : `${categoria.emoji} ${categoria.label}`;

      await babaloradoService.registrarVacilo({
        givenBy: profile.id,
        receivedBy: infrator,
        reason: motivo,
        points: parseInt(pontos) || categoria.pontos,
        imageUrl
      });

      onClose(); // Fecha o modal
      window.location.reload(); // Recarrega para buscar novo ranking e histórico
    } catch (error) {
      alert('Erro ao registrar vacilo: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="⚡ Registrar Vacilo">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Infrator */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Infrator</label>
          <div className="flex gap-2 flex-wrap">
            {moradores.length === 0 && (
              <p className="text-sm text-slate-400">Carregando moradores...</p>
            )}
            {moradores.map(m => (
              <button
                type="button"
                key={m.id}
                onClick={() => setInfrator(m.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border font-semibold text-sm transition-all ${infrator === m.id
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-200'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
              >
                <span className="w-6 h-6 rounded-full bg-slate-400 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                  {m.avatar_url
                    ? <img src={m.avatar_url} alt="" className="w-full h-full object-cover" />
                    : m.nickname?.charAt(0).toUpperCase()
                  }
                </span>
                {m.nickname}
              </button>
            ))}
          </div>
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Tipo de Vacilo</label>
          <div className="flex flex-col gap-2">
            {CATEGORIAS.map(cat => (
              <button
                type="button"
                key={cat.id}
                onClick={() => handleCategoria(cat)}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${categoria?.id === cat.id
                  ? 'bg-orange-50 border-orange-400 shadow-sm'
                  : 'bg-white border-slate-100 hover:bg-slate-50'
                  }`}
              >
                <span className="text-sm font-medium text-slate-700">
                  {cat.emoji} {cat.label}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${categoria?.id === cat.id ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                  +{cat.pontos} pt{cat.pontos > 1 ? 's' : ''}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Motivo customizado */}
        {categoria?.custom && (
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Descreva o Vacilo</label>
            <input
              type="text"
              value={motivoCustom}
              onChange={e => setMotivoCustom(e.target.value)}
              placeholder="Ex: Barulho excessivo à noite"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
            />
          </div>
        )}

        {/* Pontuação */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Pontuação (ajustável)</label>
          <input
            type="number"
            min="1"
            value={pontos}
            onChange={e => setPontos(e.target.value)}
            placeholder="Pts..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Foto */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Evidência Fotográfica</label>
          <input type="file" accept="image/*" ref={fileRef} onChange={handleFoto} className="hidden" />

          {fotoPreview ? (
            <div className="relative w-full h-36 rounded-2xl overflow-hidden border border-slate-200">
              <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => { setFotoPreview(null); setFotoFile(null); }}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              className="w-full h-28 flex flex-col items-center justify-center gap-2 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-orange-400 hover:text-orange-500 transition-colors"
            >
              <Camera size={28} />
              <span className="text-xs font-semibold">Toque para anexar foto</span>
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={!infrator || !categoria || loading}
          className="w-full bg-orange-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors mt-2"
        >
          {loading ? 'Registrando...' : '⚡ Registrar Vacilo'}
        </button>
      </form>
    </BottomSheet>
  );
}
