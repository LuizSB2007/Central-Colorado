import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function BottomSheet({ isOpen, onClose, title, children }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => setShow(false), 300); // delay for animation
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  if (!isOpen && !show) return null;

  return (
    <div className={`fixed inset-0 z-[60] flex justify-center items-end ${isOpen ? 'visible' : 'invisible'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[90vh] transition-transform duration-300 ease-out transform ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="p-2 bg-slate-50 text-slate-500 hover:text-slate-700 rounded-full">
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto p-5 pb-8">
          {children}
        </div>
      </div>
    </div>
  );
}
