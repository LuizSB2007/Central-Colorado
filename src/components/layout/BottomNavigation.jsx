import React from 'react';
import { Home, Calendar, Trophy, Sparkles, ShoppingCart, Camera, User } from 'lucide-react';
import FloatingActionButton from '../common/FloatingActionButton';

export default function BottomNavigation({ currentTab, setCurrentTab, openActionMenu }) {
  const tabs = [
    { id: 'tarefas', icon: Sparkles, label: 'Limpeza' },
    { id: 'compras', icon: ShoppingCart, label: 'Compras' },
    { id: 'eventos', icon: Calendar, label: 'Eventos' },
    { id: 'fab', icon: null, label: '' }, // Placeholder for FAB (Center)
    { id: 'vacilometro', icon: Trophy, label: 'Babalorado' },
    { id: 'fotos', icon: Camera, label: 'Fotos' },
    { id: 'perfil', icon: User, label: 'Perfil' },
  ];

  return (
    <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-200 rounded-t-3xl shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] px-2 py-2 z-50">
      <div className="flex justify-between items-center relative h-16">
        {tabs.map((tab, index) => {
          if (tab.id === 'fab') {
            return (
              <div key="fab" className="relative w-16 h-full flex justify-center">
                <FloatingActionButton onClick={openActionMenu} />
              </div>
            );
          }

          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive ? 'text-orange-500' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
