import { supabase } from '../lib/supabase';

export const eventosService = {
  /**
   * Busca todos os eventos, ordenados pela data mais próxima
   */
  async getEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*, profiles(nickname, full_name, avatar_url)')
      .order('event_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Cria um novo evento
   */
  async createEvent(eventData) {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select();

    if (error) throw error;
    return data[0];
  },

  /**
   * Edita um evento existente
   */
  async updateEvent(eventId, updates) {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', eventId)
      .select();

    if (error) throw error;
    return data[0];
  },

  /**
   * Apaga um evento
   */
  async deleteEvent(eventId) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;
    return true;
  }
};
