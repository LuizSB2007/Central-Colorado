import { supabase } from '../lib/supabase';

export const comprasService = {
  /**
   * Retorna todos os itens de compra como lista flat
   * Adiciona campo virtual is_purchased para compatibilidade com UI
   */
  async getItems() {
    const { data, error } = await supabase
      .from('shopping_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Mapear status do banco para campo is_purchased usado no UI
    return (data || []).map(item => ({
      ...item,
      is_purchased: item.status === 'COMPRADO'
    }));
  },

  /**
   * Adiciona um novo item à lista de compras
   */
  async addItem({ name }) {
    const { data, error } = await supabase
      .from('shopping_items')
      .insert([{ name, status: 'A_COMPRAR' }])
      .select();

    if (error) throw error;
    return { ...data[0], is_purchased: false };
  },

  /**
   * Alterna o status de um item
   */
  async togglePurchased(itemId, isPurchased) {
    const newStatus = isPurchased ? 'COMPRADO' : 'A_COMPRAR';
    const { data, error } = await supabase
      .from('shopping_items')
      .update({ status: newStatus })
      .eq('id', itemId)
      .select();

    if (error) throw error;
    return { ...data[0], is_purchased: isPurchased };
  },

  /**
   * Apaga (deleção física) um item do banco de dados
   */
  async deleteItem(itemId) {
    const { error } = await supabase
      .from('shopping_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
    return true;
  }
};
