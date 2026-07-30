import React, { useState } from 'react';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoUrl from '../assets/logo.png';

export default function AuthScreen() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'cadastro'
  const [apelido, setApelido] = useState('');
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaMestra, setSenhaMestra] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!apelido || !senha) { setError('Preencha todos os campos.'); return; }
    
    setLoading(true);
    setError('');
    try {
      await login(apelido, senha);
    } catch (err) {
      setError(err.message || 'Erro ao realizar login.');
    } finally {
      setLoading(false);
    }
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    if (!apelido || !senha || !senhaMestra) { setError('Preencha todos os campos.'); return; }
    if (senha !== confirmarSenha) { setError('As senhas não coincidem.'); return; }
    
    setLoading(true);
    setError('');
    try {
      await register(apelido, senha, senhaMestra);
      // Se tudo der certo, o usuário já será logado automaticamente pelo Supabase
    } catch (err) {
      setError(err.message || 'Erro ao realizar cadastro.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition";

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center items-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-200 mb-4 overflow-hidden">
            <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            República <span className="text-orange-500">Colorado</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Gestão da rep na palma da mão</p>
        </div>

        {/* Tabs Login / Cadastro */}
        <div className="flex bg-white border border-slate-200 rounded-xl p-1 mb-6 shadow-sm">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === 'login' ? 'bg-orange-500 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Entrar
          </button>
          <button
            onClick={() => { setMode('cadastro'); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === 'cadastro' ? 'bg-orange-500 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Cadastrar
          </button>
        </div>

        {/* Formulário de Login */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Apelido na Rep</label>
              <input
                type="text"
                value={apelido}
                onChange={e => setApelido(e.target.value)}
                placeholder="Ex: joao_rep"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type={showSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputClass} pr-12`}
                />
                <button type="button" onClick={() => setShowSenha(!showSenha)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
            <button disabled={loading} type="submit" className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition mt-2 shadow-md shadow-orange-200">
              {loading ? 'Carregando...' : 'Entrar na Rep 🏠'}
            </button>
          </form>
        )}

        {/* Formulário de Cadastro */}
        {mode === 'cadastro' && (
          <form onSubmit={handleCadastro} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Apelido na Rep</label>
              <input type="text" value={apelido} onChange={e => setApelido(e.target.value)} placeholder="Ex: joao_rep" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Senha</label>
              <div className="relative">
                <input type={showSenha ? 'text' : 'password'} value={senha} onChange={e => setSenha(e.target.value)} placeholder="••••••••" className={`${inputClass} pr-12`} />
                <button type="button" onClick={() => setShowSenha(!showSenha)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Confirmar Senha</label>
              <input type="password" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} placeholder="••••••••" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Senha Mestra da Rep</label>
              <input type="password" value={senhaMestra} onChange={e => setSenhaMestra(e.target.value)} placeholder="••••••••" className={inputClass} />
            </div>
            {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
            <button disabled={loading} type="submit" className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition mt-2 shadow-md shadow-orange-200">
              {loading ? 'Criando Conta...' : 'Criar Conta'} <UserPlus size={18} className="inline ml-1" />
            </button>
          </form>
        )}

        <p className="text-center text-xs text-slate-400 mt-6">
          República Colorado — Unicamp Limeira 🎓
        </p>
      </div>
    </div>
  );
}
