import React, { useState, useEffect } from 'react';
import BottomSheet from '../common/BottomSheet';
import { Pin } from 'lucide-react';
import { avisosService } from '../../services/avisosService';
import { useAuth } from '../../context/AuthContext';

export default function AvisoModal({ isOpen, onClose, avisoToEdit }) {
  const { profile } = useAuth();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [fixado, setFixado] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (avisoToEdit) {
      setTitulo(avisoToEdit.title);
      setDescricao(avisoToEdit.content);
      setFixado(avisoToEdit.is_important || false);
    } else {
      setTitulo('');
      setDescricao('');
      setFixado(false);
    }
  }, [avisoToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo || !descricao) return;
    
    setLoading(true);
    try {
      if (avisoToEdit) {
        await avisosService.updateNotice(avisoToEdit.id, {
          title: titulo,
          content: descricao,
          is_important: fixado
        });
      } else {
        await avisosService.createNotice({
          title: titulo,
          content: descricao,
          is_important: fixado,
          created_by: profile.id
        });
      }
      onClose();
      window.location.reload();
    } catch (error) {
      alert('Erro ao salvar aviso: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if(!window.confirm('Tem certeza que deseja apagar este aviso?')) return;
    
    setLoading(true);
    try {
      await avisosService.deleteNotice(avisoToEdit.id);
      onClose();
      window.location.reload();
    } catch (error) {
      alert('Erro ao apagar aviso: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={avisoToEdit ? "Editar Aviso" : "Novo Aviso"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Título do Aviso</label>
          <input 
            type="text" required value={titulo} onChange={e => setTitulo(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" 
            placeholder="Ex: Conta de Luz"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Mensagem</label>
          <textarea 
            rows="4" required value={descricao} onChange={e => setDescricao(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500" 
            placeholder="Descreva o aviso para a galera..."
          ></textarea>
        </div>

        <div 
          className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${fixado ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-200'}`}
          onClick={() => setFixado(!fixado)}
        >
          <div className={`p-2 rounded-full ${fixado ? 'bg-orange-500 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>
            <Pin size={18} />
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">Aviso Importante (Fixar)</p>
            <p className="text-xs text-slate-500">Mantém o aviso no topo do mural.</p>
          </div>
        </div>

        <button disabled={loading} type="submit" className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors mt-2">
          {loading ? 'Salvando...' : (avisoToEdit ? "Salvar Alterações" : "Publicar Aviso")}
        </button>
        
        {avisoToEdit && (
          <button type="button" disabled={loading} onClick={handleDelete} className="w-full bg-red-100 text-red-600 font-bold py-3 rounded-xl hover:bg-red-200 transition-colors mt-1">
            Apagar Aviso
          </button>
        )}
      </form>
    </BottomSheet>
  );
}
