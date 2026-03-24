import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/Button';
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Supabase automatically handles the hash token from the email link
  // and sets the session. We just need to call update User.
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Redifinição habilitada
      }
    });
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setStatus('error');
      setMessage('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setStatus('success');
      setMessage('Senha atualizada com sucesso! A redirecionar para o login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error: any) {
      console.error('Error updating password:', error);
      setStatus('error');
      setMessage('O link expirou ou é inválido. Tente solicitar uma nova recuperação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-brand-500/5 border border-slate-100 relative overflow-hidden">
        {/* Decorativo */}
        <div className="absolute top-0 right-0 p-4 opacity-10 blur-[2px]">
          <Lock size={80} className="text-brand-500" />
        </div>

        <div className="relative z-10">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
              Nova Senha 🔑
            </h2>
            <p className="text-slate-500 mb-8">
              Você está quase lá. Digite a sua nova senha abaixo.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleUpdatePassword}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Nova Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-xl relative block w-full pl-10 px-3 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm bg-slate-50"
                  placeholder="Mínimo de 6 caracteres"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                Confirme a Nova Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none rounded-xl relative block w-full pl-10 px-3 py-3 border border-slate-300 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:z-10 sm:text-sm bg-slate-50"
                  placeholder="Repita a senha"
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
              <div className="flex flex-col gap-2 text-sm text-green-700 bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>{message}</span>
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading || status === 'success'}
            >
              {loading ? 'A guardar...' : 'Confirmar Nova Senha'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
