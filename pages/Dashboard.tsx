// src/pages/Dashboard.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen pt-32 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-4">Painel de Controle</h1>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <p>Bem-vindo ao seu painel, <strong>{user?.user_metadata?.name || user?.email}</strong>.</p>
        <p className="text-slate-500 mt-2">Esta área é protegida e só pode ser vista por usuários autenticados.</p>
      </div>
    </div>
  );
};
