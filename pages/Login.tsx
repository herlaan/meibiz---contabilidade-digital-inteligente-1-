import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/Button';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message === 'Invalid login credentials' 
        ? 'E-mail ou senha incorretos.' 
        : 'Ocorreu um erro ao tentar fazer login.');
      setLoading(false);
    } else {
      // Login bem-sucedido. O AuthContext vai detectar a mudança automaticamente.
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 pt-32">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <div className="flex flex-col items-center">
          <Link to="/" className="mb-6 hover:opacity-80 transition-opacity">
            <img src="/logos/logo-blue.png?v=2" alt="MeiBiz Logo" className="h-12 md:h-16 w-auto object-contain" />
          </Link>
          <h2 className="text-center text-3xl font-extrabold text-slate-900">
            Acesse sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Ou{' '}
            <Link to="/cadastro" className="font-medium text-brand-600 hover:text-brand-500 transition-colors">
              crie uma conta gratuitamente
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}
          
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm transition-colors"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700">Senha</label>
                <Link to="/recuperar-senha" className="text-sm font-medium text-brand-600 hover:text-brand-500 transition-colors">
                  Esqueceu a senha?
                </Link>
              </div>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button type="submit" variant="primary" fullWidth disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar na Plataforma'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
