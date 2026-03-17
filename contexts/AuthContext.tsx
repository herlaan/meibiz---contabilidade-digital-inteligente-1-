import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: () => void; // Mock login for now
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock initial check
  useEffect(() => {
    const savedAuth = localStorage.getItem('meibiz_auth');
    if (savedAuth) {
      setUser(JSON.parse(savedAuth));
    }
    setIsLoading(false);
  }, []);

  const login = () => {
    const mockUser = { id: '1', email: 'contato@meibiz.com.br', name: 'Usuário Teste' };
    setUser(mockUser);
    localStorage.setItem('meibiz_auth', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('meibiz_auth');
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
