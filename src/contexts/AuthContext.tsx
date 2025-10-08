// context/AuthContext.tsx
'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  isUserType: string;
}

interface AuthContextType {
  user: any | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    console.log(userData, 'userData');
    setUser(userData); // Store user data (including role) on login
  };

  const logout = () => {
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  console.log('authcontect');
  const context = useContext(AuthContext);
  if (!context) {
    console.log('jai jo');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
