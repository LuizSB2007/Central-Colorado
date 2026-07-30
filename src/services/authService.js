import { supabase } from '../lib/supabase';

// Senha mestra provisória (idealmente deve vir do .env)
const MASTER_PASSWORD = import.meta.env.VITE_MASTER_PASSWORD || 'babalorado2026';

// Helper para transformar apelido em "email" falso
const getEmailFromNickname = (nickname) => `${nickname.toLowerCase().replace(/\s+/g, '')}@republicacolorado.com.br`;

export const authService = {
  /**
   * Realiza o login do usuário usando apelido e senha
   */
  async login(nickname, password) {
    const email = getEmailFromNickname(nickname);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Registra um novo morador (Exige senha mestra da república)
   */
  async register(nickname, password, masterPassword) {
    if (masterPassword !== MASTER_PASSWORD) {
      throw new Error('Senha mestra da república incorreta!');
    }

    const email = getEmailFromNickname(nickname);

    // 1. Cria o usuário no auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // 2. Cria o perfil na tabela profiles (usando o UUID retornado pelo Auth)
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            nickname: nickname,
            full_name: nickname, // Padrão, pode ser editado depois
          }
        ]);

      if (profileError) throw profileError;
    }

    return authData;
  },

  /**
   * Faz o logout do usuário atual
   */
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Atualiza o perfil do morador logado
   */
  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select();

    if (error) throw error;
    return data;
  }
};
