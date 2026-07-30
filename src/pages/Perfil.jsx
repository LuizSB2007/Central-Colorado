import React, { useRef, useState } from 'react';
import { Camera, LogOut, Edit3, Eye, EyeOff, Save } from 'lucide-react';
import BottomSheet from '../components/common/BottomSheet';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { supabase } from '../lib/supabase';
import { compressImage } from '../utils/imageUtils';

export default function Perfil() {
  const { profile, user, logout, refreshProfile } = useAuth();
  const fileRef = useRef();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [apelido, setApelido] = useState(profile?.nickname || '');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [editError, setEditError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleFoto = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    try {
      // Comprime a imagem antes de subir
      const compressedFile = await compressImage(file, 800, 0.7);

      // Upload para o Supabase Storage
      const filePath = `avatars/${user.id}_${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, compressedFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      // Atualiza o perfil com a nova URL
      await authService.updateProfile(user.id, { avatar_url: urlData.publicUrl });
      refreshProfile();
    } catch (err) {
      alert('Erro ao atualizar foto: ' + err.message);
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    if (senha && senha !== confirmarSenha) {
      setEditError('As senhas não coincidem.');
      return;
    }

    setSaving(true);
    setEditError('');
    try {
      // Atualizar o apelido (nickname) no perfil
      if (apelido !== profile?.nickname) {
        await authService.updateProfile(user.id, { nickname: apelido });
      }

      // Atualizar a senha no Supabase Auth (se fornecida)
      if (senha) {
        const { error } = await supabase.auth.updateUser({ password: senha });
        if (error) throw error;
      }

      await refreshProfile();
      setEditModalOpen(false);
      setSenha('');
      setConfirmarSenha('');
    } catch (err) {
      setEditError(err.message || 'Erro ao salvar alterações.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      alert('Erro ao sair: ' + err.message);
    }
  };

  if (!profile) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <p className="text-slate-400">Carregando perfil...</p>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Meu Perfil</h1>
        <p className="text-slate-500 text-sm">Gerencie sua conta.</p>
      </div>

      {/* Avatar + info */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-4xl shadow-lg bg-orange-400">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Foto de Perfil" className="w-full h-full object-cover" />
            ) : (
              profile.nickname?.charAt(0).toUpperCase() || '?'
            )}
          </div>
          <button
            onClick={() => fileRef.current.click()}
            className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-full border-2 border-white text-white shadow-md hover:bg-orange-600 transition"
          >
            <Camera size={16} />
          </button>
          <input type="file" accept="image/*" ref={fileRef} onChange={handleFoto} className="hidden" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">{profile.full_name || profile.nickname}</h2>
        <p className="text-sm text-slate-500 mt-0.5">@{profile.nickname}</p>
        <span className="text-xs font-bold text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full mt-2">
          {profile.role || 'Morador'}
        </span>

        {/* Pontuação Babalorado */}
        {profile.totalPoints > 0 && (
          <div className="mt-3 bg-red-50 border border-red-100 rounded-xl px-4 py-2 text-center">
            <p className="text-xs text-red-500 font-medium">Pontos Babalorado</p>
            <p className="text-2xl font-black text-red-600">{profile.totalPoints}</p>
          </div>
        )}
      </div>

      {/* Ações */}
      <div className="flex flex-col gap-3 flex-1">
        <button
          onClick={() => { setApelido(profile.nickname); setEditModalOpen(true); }}
          className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-xl text-orange-600">
              <Edit3 size={20} />
            </div>
            <span className="font-semibold text-slate-700">Editar Dados</span>
          </div>
          <span className="text-slate-400 text-xs">→</span>
        </button>

        <div className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Informações da Conta</p>
          <div className="flex flex-col gap-2">
            {profile.full_name && (
              <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                <span className="text-sm text-slate-500">Nome</span>
                <span className="text-sm font-semibold text-slate-700">{profile.full_name}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
              <span className="text-sm text-slate-500">Apelido</span>
              <span className="text-sm font-semibold text-slate-700">@{profile.nickname}</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-sm text-slate-500">Função</span>
              <span className="text-sm font-semibold text-orange-600">{profile.role || 'Morador'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Botão Sair */}
      <button
        onClick={handleLogout}
        className="mt-6 flex items-center justify-center gap-2 w-full p-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-colors border border-red-100"
      >
        <LogOut size={20} />
        Sair da Conta
      </button>

      {/* Modal de Edição */}
      <BottomSheet isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title="⚙️ Editar Dados">
        <form onSubmit={handleSalvar} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Apelido na Rep</label>
            <input
              type="text"
              value={apelido}
              onChange={e => setApelido(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nova Senha <span className="text-slate-400 font-normal normal-case">(deixe em branco para manter)</span></label>
            <div className="relative">
              <input
                type={showSenha ? 'text' : 'password'}
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-orange-500"
              />
              <button type="button" onClick={() => setShowSenha(!showSenha)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                {showSenha ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {senha && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Confirmar Nova Senha</label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={e => setConfirmarSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
          )}
          {editError && <p className="text-red-500 text-xs font-medium">{editError}</p>}
          <button disabled={saving} type="submit" className="w-full bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition mt-2">
            <Save size={16} className="inline mr-2" /> {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </BottomSheet>
    </div>
  );
}
