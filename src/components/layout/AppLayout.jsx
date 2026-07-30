import React from 'react';
import Header from './Header';
import BottomNavigation from './BottomNavigation';

export default function AppLayout({ children, currentTab, setCurrentTab, openActionMenu, onGoHome }) {
  return (
    <div className="min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-md bg-slate-50 shadow-sm relative min-h-screen flex flex-col">
        <Header onGoHome={onGoHome} />
        
        {/* Main content scrollable area with padding for header and bottom nav */}
        <main className="flex-1 overflow-y-auto pb-24 pt-16 hide-scrollbar">
          {children}
        </main>
        
        <BottomNavigation currentTab={currentTab} setCurrentTab={setCurrentTab} openActionMenu={openActionMenu} />
      </div>
    </div>
  );
}
