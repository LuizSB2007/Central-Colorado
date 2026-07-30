import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { babaloradoService } from '../services/babaloradoService';

export const BabaloradoExample = () => {
  const { profile } = useAuth(); // O perfil possui os dados do usuário e totalPoints
  const [ranking, setRanking] = useState([]);
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const r = await babaloradoService.getRanking();
      setRanking(r);

      const h = await babaloradoService.getHistorico();
      setHistorico(h);
    } catch (error) {
      console.error('Erro ao carregar babalorado:', error);
    }
  };

  const handlePunir = async () => {
    try {
      await babaloradoService.registrarVacilo({
        givenBy: profile.id, // Quem deu a punição
        receivedBy: 'ID_DO_MORADOR_ALVO', // Exemplo fixo
        reason: 'Deixou a louça suja de novo',
        points: 5,
        imageUrl: null // Aqui entraria o URL do uploadEvidencia se tivesse foto
      });
      alert('Vacilão punido com sucesso!');
      carregarDados(); // Recarrega a lista
    } catch (error) {
      alert('Erro: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Babalorado (Vacilômetro)</h2>
      
      {/* Informações do usuário logado */}
      <div style={{ background: '#eee', padding: '10px', marginBottom: '20px' }}>
        <p><strong>Meu Perfil:</strong> {profile?.nickname}</p>
        <p><strong>Meus Pontos Atuais:</strong> {profile?.totalPoints} 🔴</p>
      </div>

      <button onClick={handlePunir}>+ Punir Alguém (Teste)</button>

      <h3>Ranking dos Vacilões</h3>
      <ul>
        {ranking.map((morador, index) => (
          <li key={morador.id}>
            {index + 1}º - {morador.nickname} ({morador.total_points} pts)
          </li>
        ))}
      </ul>

      <h3>Histórico (Últimos 30 dias)</h3>
      <ul>
        {historico.map((h) => (
          <li key={h.id}>
            <strong>{h.giver?.nickname}</strong> puniu <strong>{h.receiver?.nickname}</strong><br />
            Motivo: {h.reason} ({h.points} pts)
          </li>
        ))}
      </ul>
    </div>
  );
};
