import React from 'react';

export default function Header({ onGoHome }) {
  return (
    <header className="absolute top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 z-50 h-16 flex items-center justify-center">
      <h1 
        className="text-xl font-bold text-slate-800 tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
        onClick={onGoHome}
      >
        República <span className="text-orange-500">Colorado</span>
      </h1>
    </header>
  );
}
