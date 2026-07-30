import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Check, Circle, Trash2 } from 'lucide-react';
import { comprasService } from '../services/comprasService';
import { useAuth } from '../context/AuthContext';

export default function Compras() {
  const { profile } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [novoItem, setNovoItem] = useState('');
  const [selecionados, setSelecionados] = useState(new Set());
  const [modoSelecao, setModoSelecao] = useState(false);
  const [confirmandoDelecao, setConfirmandoDelecao] = useState(false);

  const carregarItems = async () => {
    try {
      setLoading(true);
      const data = await comprasService.getItems();
      setItems(data);
    } catch (error) {
      console.error('Erro ao carregar compras:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarItems();
  }, []);

  const adicionarItem = async (e) => {
    e.preventDefault();
    if (!novoItem.trim()) return;
    try {
      await comprasService.addItem({
        name: novoItem.trim(),
        created_by: profile.id
      });
      setNovoItem('');
      carregarItems(); // recarrega do supabase
    } catch (error) {
      alert('Erro ao adicionar item: ' + error.message);
    }
  };

  const toggleItem = async (id) => {
    if (modoSelecao) {
      toggleSelecionado(id);
      return;
    }
    const item = items.find(i => i.id === id);
    if (!item) return;

    try {
      // Otimista (opcional)
      setItems(items.map(i => i.id === id ? { ...i, is_purchased: !i.is_purchased } : i));
      await comprasService.togglePurchased(id, !item.is_purchased);
    } catch (error) {
      alert('Erro ao atualizar status: ' + error.message);
      carregarItems(); // reverte estado em caso de erro
    }
  };

  const toggleSelecionado = (id) => {
    const novo = new Set(selecionados);
    if (novo.has(id)) novo.delete(id);
    else novo.add(id);
    setSelecionados(novo);
  };

  const toggleModoSelecao = () => {
    setModoSelecao(!modoSelecao);
    setSelecionados(new Set());
  };

  const selecionarTodos = () => {
    if (selecionados.size === items.length) setSelecionados(new Set());
    else setSelecionados(new Set(items.map(i => i.id)));
  };

  const excluirSelecionados = async () => {
    try {
      setLoading(true);
      // Apagar um por um ou via batch
      for (const id of selecionados) {
        await comprasService.deleteItem(id);
      }
      setSelecionados(new Set());
      setModoSelecao(false);
      setConfirmandoDelecao(false);
      carregarItems();
    } catch (error) {
      alert('Erro ao apagar itens: ' + error.message);
      setLoading(false);
    }
  };

  const pendentes = items.filter(i => !i.is_purchased).length;
  const comprados = items.filter(i => i.is_purchased).length;

  return (
    <div className="p-6 pb-32">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Compras 🛒</h1>
          <p className="text-slate-500 text-sm">
            {pendentes} {pendentes === 1 ? 'item faltando' : 'itens faltando'} · {comprados} comprados
          </p>
        </div>
        <button
          onClick={toggleModoSelecao}
          className={`text-xs font-bold px-3 py-2 rounded-xl transition-all border ${
            modoSelecao
              ? 'bg-orange-500 text-white border-orange-500'
              : 'bg-white text-slate-600 border-slate-200 shadow-sm'
          }`}
        >
          {modoSelecao ? '✓ Selecionar' : '⬜ Selecionar'}
        </button>
      </div>

      {/* Form adicionar */}
      <form onSubmit={adicionarItem} className="flex gap-2 mb-6">
        <input
          type="text"
          value={novoItem}
          onChange={(e) => setNovoItem(e.target.value)}
          placeholder="Adicionar à lista..."
          className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-sm"
        />
        <button disabled={loading} type="submit" className="bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center shadow-md shadow-orange-100">
          <Plus size={20} />
        </button>
      </form>

      {/* Barra de seleção */}
      {modoSelecao && (
        <div className="flex items-center justify-between mb-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
          <button onClick={selecionarTodos} className="text-xs font-bold text-orange-500">
            {selecionados.size === items.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
          </button>
          <span className="text-xs text-slate-500 font-medium">{selecionados.size} selecionados</span>
        </div>
      )}

      {/* Lista de itens */}
      <div className="flex flex-col gap-2">
        {loading && <p className="text-center text-sm text-slate-500 py-4">Carregando...</p>}
        {/* Pendentes */}
        {!loading && items.filter(i => !i.is_purchased).map(item => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all shadow-sm ${
              selecionados.has(item.id) ? 'bg-orange-50 border-orange-300' : 'bg-white border-slate-200'
            }`}
          >
            {modoSelecao ? (
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                selecionados.has(item.id) ? 'bg-orange-500 border-orange-500' : 'border-slate-300'
              }`}>
                {selecionados.has(item.id) && <Check size={14} className="text-white" strokeWidth={3} />}
              </div>
            ) : (
              <Circle size={24} className="text-slate-300 shrink-0" />
            )}
            <span className="font-medium text-slate-700">{item.name}</span>
          </div>
        ))}

        {/* Comprados */}
        {!loading && comprados > 0 && (
          <>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-3 mb-1 px-1">
              ✅ Já comprado ({comprados})
            </p>
            {items.filter(i => i.is_purchased).map(item => (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  selecionados.has(item.id) ? 'bg-orange-50 border-orange-300' : 'bg-slate-50 border-slate-100 opacity-60'
                }`}
              >
                {modoSelecao ? (
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selecionados.has(item.id) ? 'bg-orange-500 border-orange-500' : 'border-slate-300'
                  }`}>
                    {selecionados.has(item.id) && <Check size={14} className="text-white" strokeWidth={3} />}
                  </div>
                ) : (
                  <Check size={24} className="text-green-500 shrink-0" />
                )}
                <span className="font-medium text-slate-400 line-through">{item.name}</span>
              </div>
            ))}
          </>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center p-8 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <ShoppingCart size={36} className="mx-auto mb-2 opacity-30" />
            <p className="font-medium">A lista de compras está vazia!</p>
          </div>
        )}
      </div>

      {/* Barra flutuante de ação em massa */}
      {modoSelecao && selecionados.size > 0 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-sm px-6 z-40">
          {!confirmandoDelecao ? (
            <button
              onClick={() => setConfirmandoDelecao(true)}
              className="w-full flex items-center justify-center gap-2 bg-red-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-red-200 hover:bg-red-600 transition"
            >
              <Trash2 size={18} /> Apagar Selecionados ({selecionados.size})
            </button>
          ) : (
            <div className="bg-white border border-red-200 rounded-2xl shadow-xl p-4 text-center">
              <p className="font-bold text-slate-800 mb-1">Remover {selecionados.size} {selecionados.size === 1 ? 'item' : 'itens'}?</p>
              <p className="text-xs text-slate-500 mb-4">Esta ação não pode ser desfeita.</p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmandoDelecao(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50">
                  Cancelar
                </button>
                <button onClick={excluirSelecionados} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600">
                  Remover
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
