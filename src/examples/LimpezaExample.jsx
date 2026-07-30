import React, { useEffect, useState } from 'react';
import { limpezaService } from '../services/limpezaService';
import { useAuth } from '../context/AuthContext';

export const LimpezaExample = () => {
  const { profile } = useAuth();
  const [cycle, setCycle] = useState(0);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    carregarEscala();
  }, []);

  const carregarEscala = async () => {
    try {
      const currentCycle = limpezaService.getCurrentCycleNumber();
      setCycle(currentCycle);

      // Tenta carregar as atribuições
      let items = await limpezaService.getAssignments(currentCycle);
      
      // Se não existir, as gera (O ideal é um cron fazer isso ou o primeiro a abrir gerar)
      if (items.length === 0) {
        items = await limpezaService.generateAssignmentsForCycle(currentCycle);
        // O Supabase upsert pode não retornar o join automático, então buscamos de novo
        items = await limpezaService.getAssignments(currentCycle);
      }

      setAssignments(items);
    } catch (error) {
      console.error('Erro ao carregar escala de limpeza:', error);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await limpezaService.toggleConcluido(id, !currentStatus);
      // Atualizar local para refletir na interface rapidamente
      setAssignments(prev => 
        prev.map(a => a.id === id ? { ...a, is_completed: !currentStatus } : a)
      );
    } catch (error) {
      alert('Erro ao atualizar status');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Escala de Limpeza</h2>
      <p>Ciclo Atual: #{cycle} (Rotaciona a cada 15 dias)</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {assignments.map(a => (
          <div 
            key={a.id} 
            style={{ 
              border: '1px solid #ccc', 
              padding: '10px',
              backgroundColor: a.user_id === profile?.id ? '#d4edda' : '#fff' // Destaque pro usuário atual
            }}
          >
            <h3>{a.cleaning_rooms?.name}</h3>
            <p>Responsável: {a.profiles?.nickname}</p>
            <label>
              <input 
                type="checkbox" 
                checked={a.is_completed}
                onChange={() => toggleStatus(a.id, a.is_completed)}
                disabled={a.user_id !== profile?.id} // Só o dono pode marcar
              />
              {' '} Concluído
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
