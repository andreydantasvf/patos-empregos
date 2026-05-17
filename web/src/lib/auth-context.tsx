"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUserDto } from './types';
import { useRouter } from 'next/navigation';
import { AuthModal } from '@/components/auth-modal';

interface AuthContextType {
  user: AuthUserDto | null;
  token: string | null;
  login: (user: AuthUserDto, token: string) => void;
  logout: () => void;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalDefaultTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUserDto | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalDefaultTab, setAuthModalDefaultTab] = useState<'login' | 'register'>('login');
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (newUser: AuthUserDto, newToken: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    router.push('/');
  };

  const openAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthModalDefaultTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const handleAuthSuccess = (newUser: AuthUserDto, newToken: string) => {
    login(newUser, newToken);
    closeAuthModal();
    if (newUser.type === 'admin') {
      router.push('/admin/vagas');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isLoading,
        isAuthModalOpen,
        authModalDefaultTab,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
      <AuthModal
        open={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        defaultTab={authModalDefaultTab}
        onSuccess={handleAuthSuccess}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
