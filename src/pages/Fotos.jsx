import React from 'react';
import { Camera, CloudUpload } from 'lucide-react';

export default function Fotos() {
  return (
    <div className="p-6 h-full flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera size={40} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Galeria da Rep</h1>
        <p className="text-slate-500 text-sm max-w-[250px] mx-auto">
          Envie fotos do rolê ou do dia a dia diretamente para o Drive da galera.
        </p>
      </div>

      <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-2xl flex items-center gap-3 shadow-lg shadow-orange-500/30 transition-transform active:scale-95">
        <CloudUpload size={24} />
        Enviar Foto
      </button>
    </div>
  );
}
