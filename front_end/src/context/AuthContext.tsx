'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/journal';
import { loginApi, registerApi } from '../lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthReady: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, role?: string, adminSecret?: string) => Promise<void>;
  logout: () => void;
  setDemoUser: (asAdmin?: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('jurnal_alam_token');
      const storedUser = localStorage.getItem('jurnal_alam_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to parse auth state:', e);
    } finally {
      setIsAuthReady(true);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const res = await loginApi(username, password);
    if (res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('jurnal_alam_token', res.token);
      localStorage.setItem('jurnal_alam_user', JSON.stringify(res.user));
    }
  };

  const register = async (username: string, password: string, role: string = 'penulis', adminSecret?: string) => {
    await registerApi(username, password, role, adminSecret);
    // After registration, automatically log in
    await login(username, password);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('jurnal_alam_token');
    localStorage.removeItem('jurnal_alam_user');
  };

  const setDemoUser = (asAdmin: boolean = false) => {
    const mockUser: User = {
      id: asAdmin ? 99 : 1,
      username: asAdmin ? 'AdminHutan' : 'RimbaWanderer',
      role: asAdmin ? 'admin' : 'penulis'
    };
    const mockToken = 'demo-jwt-token-simulator';
    setUser(mockUser);
    setToken(mockToken);
    localStorage.setItem('jurnal_alam_token', mockToken);
    localStorage.setItem('jurnal_alam_user', JSON.stringify(mockUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthReady, login, register, logout, setDemoUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
