import { supabase } from '../lib/supabase';

export const limpezaService = {
  /**
   * Retorna os cômodos ordenados.
   */
  async getRooms() {
    const { data, error } = await supabase
      .from('cleaning_rooms')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Retorna os moradores (profiles) ordenados por data de criação ou nome.
   * Usaremos isso para definir a ordem na cascata.
   */
  async getResidents() {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, nickname, full_name, avatar_url')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Busca as atribuições salvas para um ciclo específico
   */
  async getAssignments(cycleNumber) {
    const { data, error } = await supabase
      .from('cleaning_assignments')
      .select('*, cleaning_rooms(*), profiles(*)')
      .eq('cycle_number', cycleNumber);

    if (error) throw error;
    return data;
  },

  /**
   * Marca ou desmarca a conclusão de uma tarefa de limpeza
   */
  async toggleConcluido(assignmentId, isCompleted) {
    const { data, error } = await supabase
      .from('cleaning_assignments')
      .update({ is_completed: isCompleted })
      .eq('id', assignmentId)
      .select();

    if (error) throw error;
    return data[0];
  },

  /**
   * Cria as atribuições para o ciclo atual, se não existirem.
   * A fórmula é: Posição_Cômodo = (Índice_Morador + Ciclo_Atual) % 10
   *
   * IMPORTANTE: esta versão só INSERE quem ainda não tem atribuição
   * nesse ciclo, então funciona corretamente mesmo quando um morador
   * é cadastrado depois que o ciclo já foi gerado pela primeira vez.
   * Não depende de nenhuma constraint UNIQUE existir no banco (ao
   * contrário do upsert com onConflict, que falha silenciosamente
   * se a constraint não existir).
   */
  async generateAssignmentsForCycle(cycleNumber) {
    const rooms = await this.getRooms();
    const residents = await this.getResidents();
    const existentes = await this.getAssignments(cycleNumber);

    if (rooms.length === 0 || residents.length === 0) {
      return existentes;
    }

    const jaTemAtribuicao = new Set(existentes.map((a) => a.user_id));
    const modulo = Math.max(rooms.length, 1);

    // Mantém o índice baseado na lista COMPLETA de residentes, na ordem
    // original, para não alterar a posição de quem já foi atribuído.
    const faltantes = residents
      .map((resident, index) => ({ resident, index }))
      .filter(({ resident }) => !jaTemAtribuicao.has(resident.id));

    if (faltantes.length === 0) {
      return existentes;
    }

    const novasAtribuicoes = faltantes.map(({ resident, index }) => {
      const roomIndex = (index + cycleNumber) % modulo;
      const assignedRoom = rooms[roomIndex];

      return {
        user_id: resident.id,
        room_id: assignedRoom.id,
        cycle_number: cycleNumber,
        is_completed: false
      };
    });

    const { data, error } = await supabase
      .from('cleaning_assignments')
      .insert(novasAtribuicoes)
      .select('*, cleaning_rooms(*), profiles(*)');

    if (error) throw error;

    return [...existentes, ...data];
  },

  /**
   * Utilitário para calcular o número do ciclo atual com base em uma data inicial
   * Exemplo: Início em 01/01/2026. A cada 15 dias, muda de ciclo.
   */
  getCurrentCycleNumber() {
    const startDate = new Date('2026-01-01T00:00:00Z');
    const now = new Date();
    const diffTime = Math.abs(now - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // Cada ciclo dura 15 dias
    const currentCycle = Math.floor(diffDays / 15);
    return currentCycle;
  }
};