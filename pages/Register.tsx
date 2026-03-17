// src/pages/Register.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/Button';

export const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // O Supabase permite passar metadados (como o nome) durante a criação
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        }
      }
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-32 px-4">
        <div className="max-w-md w-full text-center space-y-4 bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto text-3xl">✓</div>
          <h2 className="text-2xl font-bold text-slate-900">Verifique seu e-mail</h2>
          <p className="text-slate-600">Enviamos um link de confirmação para <strong>{email}</strong>. Clique no link para ativar sua conta.</p>
          <Link to="/login" className="block w-full text-brand-600 font-medium hover:underline mt-4">
            Voltar para o Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 pt-32">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-slate-900">Crie sua conta</h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-medium text-brand-600 hover:text-brand-500 transition-colors">
              Faça login
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}
          
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
              <input
                type="text"
                required
                className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
              <input
                type="email"
                required
                className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
              <input
                type="password"
                required
                minLength={6}
                className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                placeholder="Mínimo de 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar minha conta'}
          </Button>
        </form>
      </div>
    </div>
  );
};
