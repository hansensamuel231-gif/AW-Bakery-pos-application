'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthContextType } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('awbakery_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to load user from localStorage', error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    // Mock login - accepts any valid email format
    if (!email || !password) {
      throw new Error('Email dan password harus diisi');
    }

    const user: User = {
      id: 'user_' + Date.now(),
      email,
      name: email.split('@')[0],
      role: 'kasir', // Default role, will be overridden on signup
    };

    setUser(user);
    localStorage.setItem('awbakery_user', JSON.stringify(user));
  };

  const signup = (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ) => {
    if (!email || !password || !name) {
      throw new Error('Semua field harus diisi');
    }

    if (password.length < 6) {
      throw new Error('Password minimal 6 karakter');
    }

    const user: User = {
      id: 'user_' + Date.now(),
      email,
      name,
      role,
    };

    setUser(user);
    localStorage.setItem('awbakery_user', JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('awbakery_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
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
