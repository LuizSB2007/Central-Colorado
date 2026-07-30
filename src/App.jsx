import { useState } from 'react';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import TarefasLimpeza from './pages/TarefasLimpeza';
import Eventos from './pages/Eventos';
import Vacilometro from './pages/Vacilometro';
import Compras from './pages/Compras';
import Fotos from './pages/Fotos';
import Perfil from './pages/Perfil';
import AuthScreen from './pages/AuthScreen';
import AvisoModal from './components/modals/AvisoModal';
import EventoModal from './components/modals/EventoModal';
import ActionMenuModal from './components/modals/ActionMenuModal';
import { useAuth } from './context/AuthContext';

function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const { user } = useAuth(); // Autenticação real com Supabase

  // O recarregamento das listas agora acontecerá localmente em cada componente
  // O App.jsx apenas mantém os estados dos modais abertos para facilitar o menu global
  const [isActionMenuOpen, setActionMenuOpen] = useState(false);
  const [isAvisoModalOpen, setAvisoModalOpen] = useState(false);
  const [avisoToEdit, setAvisoToEdit] = useState(null);
  const [isEventoModalOpen, setEventoModalOpen] = useState(false);
  const [eventoToEdit, setEventoToEdit] = useState(null);

  // Show login screen if not logged in
  if (!user) {
    return <AuthScreen />;
  }

  const handleOpenAviso = (aviso = null) => {
    setAvisoToEdit(aviso);
    setAvisoModalOpen(true);
  };

  const handleOpenEvento = (evento = null) => {
    setEventoToEdit(evento);
    setEventoModalOpen(true);
  };

  const renderTab = () => {
    switch (currentTab) {
      case 'home':
        return <Home openAvisoModal={handleOpenAviso} />;
      case 'tarefas':
        return <TarefasLimpeza />;
      case 'compras':
        return <Compras />;
      case 'eventos':
        return <Eventos openEventoModal={handleOpenEvento} />;
      case 'vacilometro':
        return <Vacilometro />;
      case 'fotos':
        return <Fotos />;
      case 'perfil':
        return <Perfil />;
      default:
        return <Home openAvisoModal={handleOpenAviso} />;
    }
  };

  return (
    <>
      <AppLayout 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        openActionMenu={() => setActionMenuOpen(true)}
        onGoHome={() => setCurrentTab('home')}
      >
        {renderTab()}
      </AppLayout>

      <ActionMenuModal 
        isOpen={isActionMenuOpen} 
        onClose={() => setActionMenuOpen(false)} 
        onNewAviso={() => {
          setActionMenuOpen(false);
          handleOpenAviso(null);
        }}
        onNewEvento={() => {
          setActionMenuOpen(false);
          handleOpenEvento(null);
        }}
        onGoHome={() => setCurrentTab('home')}
      />
      
      {/* Os modais não gerenciam mais estado global via App.jsx, 
          apenas renderizam se abertos. O salvamento no DB será feito dentro deles ou na Home. */}
      {isAvisoModalOpen && (
        <AvisoModal 
          isOpen={isAvisoModalOpen} 
          onClose={() => setAvisoModalOpen(false)}
          avisoToEdit={avisoToEdit}
        />
      )}
      
      {isEventoModalOpen && (
        <EventoModal 
          isOpen={isEventoModalOpen} 
          onClose={() => setEventoModalOpen(false)}
          eventoToEdit={eventoToEdit}
        />
      )}
    </>
  );
}

export default App;
