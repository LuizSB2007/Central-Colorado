import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { authService } from '../services/authService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // auth.users data
  const [profile, setProfile] = useState(null); // profiles table data + custom info
  const [loading, setLoading] = useState(true);

  // Busca os dados do perfil e a pontuação consolidada do Babalorado
  const fetchProfileAndPoints = async (userId) => {
    try {
      // 1. Busca os dados do perfil
      let { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Usar maybeSingle para evitar erro PGRST116 caso não exista

      if (profileError) throw profileError;

      // Se o perfil não existir no banco de dados, criamos um automático com base no user
      if (!profileData) {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          const nickname = currentUser.email 
            ? currentUser.email.split('@')[0] 
            : 'morador_' + userId.substring(0, 5);
          
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert([
              {
                id: userId,
                nickname: nickname,
                full_name: nickname,
              }
            ])
            .select()
            .single();

          if (insertError) {
            console.error('Erro ao inserir perfil automático:', insertError);
          } else {
            profileData = newProfile;
          }
        }
      }

      if (profileData) {
        // 2. Busca o total de pontos de punição (Babalorado)
        const { data: punishmentsData, error: punishmentsError } = await supabase
          .from('punishments')
          .select('points')
          .eq('received_by', userId);

        if (punishmentsError) throw punishmentsError;

        const totalPoints = (punishmentsData || []).reduce((acc, curr) => acc + curr.points, 0);

        // 3. Atualiza o estado
        setProfile({ ...profileData, totalPoints });
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Verifica a sessão atual ao iniciar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfileAndPoints(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Escuta mudanças de autenticação (login, logout, refresh de token)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfileAndPoints(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Wrapper com duração de sessão de 1 ano (365 dias em segundos)
  const login = async (nickname, password) => {
    const result = await authService.login(nickname, password);
    // Supabase usa autoRefreshToken=true por padrão + persistSession=true,
    // a sessão dura conforme configurado no projeto (padrão 1 hora).
    // Para 1 ano, isso é configurado no painel do Supabase: Auth > Settings > JWT expiry = 31536000
    return result;
  };

  const value = {
    user,
    profile,
    loading,
    login,
    register: authService.register,
    logout: authService.logout,
    refreshProfile: () => user && fetchProfileAndPoints(user.id)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
