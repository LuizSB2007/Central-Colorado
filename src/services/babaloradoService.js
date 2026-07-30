import { supabase } from '../lib/supabase';

export const babaloradoService = {
  /**
   * Registra um novo vacilo / punição
   */
  async registrarVacilo({ givenBy, receivedBy, reason, points, imageUrl }) {
    const { data, error } = await supabase
      .from('punishments')
      .insert([{
        given_by: givenBy,
        received_by: receivedBy,
        reason,
        points,
        image_url: imageUrl
      }])
      .select();

    if (error) throw error;
    return data[0];
  },

  /**
   * Deleta / contesta um vacilo
   */
  async deletarVacilo(vaciloId) {
    const { error } = await supabase
      .from('punishments')
      .delete()
      .eq('id', vaciloId);

    if (error) throw error;
    return true;
  },

  /**
   * Realiza o upload de uma evidência (foto) para o Supabase Storage
   * O bucket 'evidencias' precisa estar criado no Supabase
   */
  async uploadEvidencia(file, fileName) {
    const filePath = `${Date.now()}_${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('evidencias')
      .upload(filePath, file);

    if (error) throw error;
    
    const { data: publicUrlData } = supabase.storage
      .from('evidencias')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  },

  /**
   * Retorna o ranking consolidado (Soma de pontos por morador)
   */
  async getRanking() {
    const { data, error } = await supabase
      .from('punishments')
      .select('points, profiles!punishments_received_by_fkey(id, nickname, avatar_url)');

    if (error) throw error;

    // Agrupar os pontos por morador
    const rankingMap = {};
    
    (data || []).forEach(punishment => {
      const profile = punishment.profiles;
      if (!profile) return;
      
      if (!rankingMap[profile.id]) {
        rankingMap[profile.id] = { ...profile, total_points: 0 };
      }
      rankingMap[profile.id].total_points += punishment.points;
    });

    const rankingArray = Object.values(rankingMap);
    // Ordenar do maior vacilão pro menor
    rankingArray.sort((a, b) => b.total_points - a.total_points);

    return rankingArray;
  },

  /**
   * Histórico detalhado de vacilos (timeline)
   */
  async getHistorico() {
    const { data, error } = await supabase
      .from('punishments')
      .select(`
        *,
        giver:profiles!punishments_given_by_fkey(nickname, avatar_url),
        receiver:profiles!punishments_received_by_fkey(nickname, avatar_url)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
};
