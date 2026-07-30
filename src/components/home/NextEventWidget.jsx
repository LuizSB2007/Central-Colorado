import React, { useEffect, useState } from 'react';
import { CalendarClock, MapPin, Clock } from 'lucide-react';
import { eventosService } from '../../services/eventosService';

export default function NextEventWidget() {
  const [nextEvent, setNextEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNextEvent() {
      try {
        const events = await eventosService.getEvents();
        const now = new Date();
        const next7Days = new Date();
        next7Days.setDate(now.getDate() + 7);

        const upcomingEvents = events.filter(evento => {
          const eventDate = new Date(evento.event_date);
          return eventDate >= now && eventDate <= next7Days;
        });

        if (upcomingEvents.length > 0) {
          setNextEvent(upcomingEvents[0]);
        }
      } catch (error) {
        console.error('Erro ao carregar o próximo evento:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchNextEvent();
  }, []);

  if (loading || !nextEvent) return null;

  const now = new Date();
  const daysLeft = Math.ceil((new Date(nextEvent.event_date) - now) / (1000 * 60 * 60 * 24));
  let timeText = `Faltam ${daysLeft} dias`;
  if (daysLeft === 0) timeText = 'É hoje!';
  else if (daysLeft === 1) timeText = 'É amanhã!';

  const eventTime = new Date(nextEvent.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl p-4 text-white shadow-md shadow-red-500/20 mb-6">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm shrink-0">
            <CalendarClock size={16} className="text-white" />
          </div>
          <h2 className="font-semibold text-rose-50 text-sm leading-tight">Próximo Evento</h2>
        </div>
        <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm whitespace-nowrap shrink-0 mt-0.5 uppercase tracking-wider text-white">
          {timeText}
        </span>
      </div>
      
      <div className="bg-white/10 p-3.5 rounded-xl backdrop-blur-sm border border-white/10">
        <p className="text-lg font-bold mb-2 break-words leading-tight">{nextEvent.title}</p>
        <div className="flex items-center gap-2 text-xs text-rose-100 font-medium mt-3">
          <div className="flex items-center gap-1.5 bg-rose-900/20 px-2.5 py-1.5 rounded-lg shrink-0">
            <Clock size={14} className="text-rose-200 shrink-0" />
            <span>{eventTime}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-rose-900/20 px-2.5 py-1.5 rounded-lg min-w-0 flex-1">
            <MapPin size={14} className="text-rose-200 shrink-0" />
            <span className="truncate block w-full">{nextEvent.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
