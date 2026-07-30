import { supabase } from '../lib/supabase';

export const avisosService = {
  /**
   * Busca os avisos para a home, ordenados pelos mais recentes
   */
  async getNotices() {
    const { data, error } = await supabase
      .from('notices')
      .select('*, profiles(nickname, full_name, avatar_url)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Cria um novo aviso
   */
  async createNotice(noticeData) {
    const { data, error } = await supabase
      .from('notices')
      .insert([noticeData])
      .select();

    if (error) throw error;
    return data[0];
  },

  /**
   * Edita um aviso existente
   */
  async updateNotice(noticeId, updates) {
    const { data, error } = await supabase
      .from('notices')
      .update(updates)
      .eq('id', noticeId)
      .select();

    if (error) throw error;
    return data[0];
  },

  /**
   * Apaga um aviso
   */
  async deleteNotice(noticeId) {
    const { error } = await supabase
      .from('notices')
      .delete()
      .eq('id', noticeId);

    if (error) throw error;
    return true;
  }
};
