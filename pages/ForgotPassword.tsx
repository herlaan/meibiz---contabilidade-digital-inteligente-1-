import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/Button';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      });

      if (error) throw error;

      setStatus('success');
      setMessage('Instruções de recuperação enviadas para o seu e-mail.');
    } catch (error: any) {
      console.error('Error resetting password:', error);
      setStatus('error');
      setMessage(error.message || 'Erro ao tentar enviar o e-mail de recuperação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-brand-500/5 border border-slate-100 relative overflow-hidden">
        {/* Decorativo */}
        <div className="absolute top-0 right-0 p-4 opacity-10 blur-[2px]">
          <Mail size={80} className="text-brand-500" />
        </div>

        <div className="relative z-10">
          <div>
            <Link to="/login" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors mb-6 group">
              <ArrowLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
              Voltar para o Login
            </Link>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
              Recuperar Senha 🔒
            </h2>
            <p className="text-slate-500 mb-8">
              Esqueceu sua senha? Não se preocupe, insira seu e-mail abaixo e enviaremos um link seguro para você redefini-la.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleResetPassword}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                E-mail cadastrado
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-xl relative block w-full pl-10 px-3 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm bg-slate-50"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {status === 'error' && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                <AlertCircle size={16} className="shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {status === 'success' && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading || status === 'success'}
            >
              {loading ? 'A enviar...' : 'Enviar Link de Recuperação'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
