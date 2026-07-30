import React, { useState, useEffect } from 'react';
import BottomSheet from '../common/BottomSheet';
import { eventosService } from '../../services/eventosService';
import { useAuth } from '../../context/AuthContext';

export default function EventoModal({ isOpen, onClose, eventoToEdit }) {
  const { profile } = useAuth();
  const [titulo, setTitulo] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [local, setLocal] = useState('');
  const [tipo, setTipo] = useState('Festa');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (eventoToEdit) {
      setTitulo(eventoToEdit.title);
      const eventDate = new Date(eventoToEdit.event_date);
      if (!isNaN(eventDate)) {
        setData(eventDate.toISOString().split('T')[0]);
        setHora(eventDate.toTimeString().split(':')[0] + ':' + eventDate.toTimeString().split(':')[1]);
      }
      setLocal(eventoToEdit.location);
      setTipo(eventoToEdit.category);
      setDescricao(eventoToEdit.description || '');
    } else {
      setTitulo('');
      setData('');
      setHora('');
      setLocal('');
      setTipo('Festa');
      setDescricao('');
    }
  }, [eventoToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo || !data || !hora) return;

    setLoading(true);
    try {
      const isoData = new Date(`${data}T${hora}:00`).toISOString();

      const eventoData = {
        title: titulo,
        event_date: isoData,
        location: local || 'República',
        description: descricao
      };

      if (eventoToEdit) {
        await eventosService.updateEvent(eventoToEdit.id, eventoData);
      } else {
        await eventosService.createEvent({
          ...eventoData,
          created_by: profile.id
        });
      }
      onClose();
      window.location.reload(); // Recarregar a página para atualizar imediatamente
    } catch (error) {
      alert('Erro ao salvar evento: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja apagar este evento?')) return;
    
    setLoading(true);
    try {
      await eventosService.deleteEvent(eventoToEdit.id);
      onClose();
      window.location.reload(); // Recarregar a página
    } catch (error) {
      alert('Erro ao apagar evento: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={eventoToEdit ? "Editar Evento" : "Novo Evento"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Título do Evento</label>
          <input 
            type="text" required value={titulo} onChange={e => setTitulo(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" 
            placeholder="Ex: Churrasco da Rep"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Data</label>
            <input 
              type="date" required value={data} onChange={e => setData(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500" 
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Horário</label>
            <input 
              type="time" required value={hora} onChange={e => setHora(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Local</label>
          <input 
            type="text" value={local} onChange={e => setLocal(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500" 
            placeholder="Ex: Quintal"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Categoria</label>
          <select 
            value={tipo} onChange={e => setTipo(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500"
          >
            <option value="Festa">Festa</option>
            <option value="Acadêmico">Acadêmico</option>
            <option value="Reunião">Reunião</option>
            <option value="Outros">Outros</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Descrição</label>
          <textarea 
            rows="3" value={descricao} onChange={e => setDescricao(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500" 
            placeholder="Detalhes do evento..."
          ></textarea>
        </div>

        <button disabled={loading} type="submit" className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors mt-2">
          {loading ? 'Salvando...' : (eventoToEdit ? "Salvar Alterações" : "Criar Evento")}
        </button>

        {eventoToEdit && (
          <button type="button" disabled={loading} onClick={handleDelete} className="w-full bg-red-100 text-red-600 font-bold py-3 rounded-xl hover:bg-red-200 transition-colors mt-1">
            Apagar Evento
          </button>
        )}
      </form>
    </BottomSheet>
  );
}
