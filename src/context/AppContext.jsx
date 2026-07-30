import React, { createContext } from 'react';

// O AppContext foi limpo pois todo o estado agora reside no AuthContext (para o usuário)
// e os dados são buscados localmente por cada página (Home, Eventos, etc) no Supabase.
// Mantido apenas para evitar quebra no main.jsx, mas pode ser removido no futuro.
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  return (
    <AppContext.Provider value={{}}>
      {children}
    </AppContext.Provider>
  );
};
