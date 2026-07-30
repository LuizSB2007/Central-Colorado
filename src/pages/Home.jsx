import React, { useEffect, useState } from 'react';
import AvisoCard from '../components/home/AvisoCard';
import NextEventWidget from '../components/home/NextEventWidget';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { avisosService } from '../services/avisosService';

export default function Home({ openAvisoModal }) {
  const { profile } = useAuth();
  const [avisos, setAvisos] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarAvisos = async () => {
    try {
      const data = await avisosService.getNotices();
      setAvisos(data);
    } catch (error) {
      console.error('Erro ao carregar avisos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAvisos();
  }, []);

  // Ordena os avisos: importantes primeiro, depois mais recentes
  const avisosOrdenados = [...avisos].sort((a, b) => {
    if (a.is_important === b.is_important) {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    return a.is_important ? -1 : 1;
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Olá, {profile?.full_name || profile?.nickname || 'Morador'}! </h1>
          <p className="text-slate-500 text-sm">Aqui está o resumo da república hoje.</p>
        </div>
      </div>

      {/* Widget modificado/removido conforme a nova estrutura, pode precisar adaptar por dentro se buscar algo do banco */}
      <NextEventWidget />

      {/* O TaskWidget da home dependia da escala, vamos ocultar por hora pra simplificar e usar a aba Limpeza, 
          ou você pode recriá-lo puxando o ciclo atual. */}

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-slate-800 text-lg">Mural de Avisos</h2>
          <button
            onClick={() => {
              openAvisoModal();
              // Forçar reload após fechar
              setTimeout(carregarAvisos, 2000); // gambiarra simples caso o modal n tenha callback onRefresh
            }}
            className="flex items-center gap-1 bg-orange-100 text-orange-600 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-orange-200 transition-colors"
          >
            <Plus size={14} strokeWidth={2.5} /> Novo Aviso
          </button>
        </div>

        <div className="flex flex-col">
          {loading ? (
            <p className="text-sm text-slate-500 text-center py-4">Carregando...</p>
          ) : (
            avisosOrdenados.map(aviso => (
              <AvisoCard
                key={aviso.id}
                aviso={aviso}
                onEdit={() => {
                  openAvisoModal(aviso);
                  setTimeout(carregarAvisos, 2000);
                }}
              />
            ))
          )}
          {!loading && avisosOrdenados.length === 0 && (
            <div className="text-center p-6 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              Nenhum aviso no mural.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
