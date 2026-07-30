import React, { useState, useEffect } from 'react';
import EventoCard from '../components/eventos/EventoCard';
import { Plus } from 'lucide-react';
import { eventosService } from '../services/eventosService';

export default function Eventos({ openEventoModal }) {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarEventos = async () => {
    try {
      setLoading(true);
      const data = await eventosService.getEvents();
      setEventos(data);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEventos();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Agenda</h1>
          <p className="text-slate-500 text-sm">Próximos eventos da rep.</p>
        </div>
        <button
          onClick={() => {
            openEventoModal();
            setTimeout(carregarEventos, 2000);
          }}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-full transition-colors"
        >
          <Plus size={20} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex flex-col mt-4">
        {loading && <p className="text-center text-sm text-slate-500 py-4">Carregando...</p>}
        {!loading && eventos.map(evento => (
          <EventoCard
            key={evento.id}
            evento={evento}
            onEdit={() => {
              openEventoModal(evento);
              setTimeout(carregarEventos, 2000);
            }}
          />
        ))}
        {!loading && eventos.length === 0 && (
          <div className="text-center p-6 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            Nenhum evento agendado.
          </div>
        )}
      </div>
    </div>
  );
}
