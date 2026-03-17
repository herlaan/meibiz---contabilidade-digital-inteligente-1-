import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: () => void; // Placeholder if needed for UI triggers
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Busca a sessão inicial ao carregar a página
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Escuta mudanças de estado (Login, Logout, Token Expirado)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Limpa o listener para evitar memory leaks
    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Aliases for compatibility with previous implementation
  const login = () => {
    // This would typically trigger a UI modal or redirect to login page
    // For now, it's a placeholder since Supabase handles the actual sign-in
    console.log('Login triggered - use Supabase auth methods to sign in');
  };

  const logout = signOut;

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      isLoggedIn: !!user, 
      isLoading, 
      login, 
      logout, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para facilitar o uso em outros componentes
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
