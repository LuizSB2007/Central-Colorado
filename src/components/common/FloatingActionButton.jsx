import React from 'react';
import logoUrl from '../../assets/logo.png';

export default function FloatingActionButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute -top-6 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-0 shadow-lg shadow-orange-500/40 transition-transform active:scale-95 border-4 border-slate-50 flex items-center justify-center overflow-hidden"
      aria-label="Ação Principal"
    >
      <img
        src={logoUrl}
        alt="Logo"
        className="w-full h-full object-cover"
      />
    </button>
  );
}