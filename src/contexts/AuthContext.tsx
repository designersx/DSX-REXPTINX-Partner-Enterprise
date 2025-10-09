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

// 'use client';
// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// interface AuthContextType {
//   roleId: string | null;
//   login: (roleId: string) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   // Initialize roleId from localStorage
//   const [roleId, setRoleId] = useState<string | null>(() => localStorage.getItem('roleId'));

//   // Sync localStorage changes to state (handles updates from other tabs)
//   useEffect(() => {
//     const handleStorageChange = () => {
//       setRoleId(localStorage.getItem('roleId'));
//     };

//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   const login = (roleId: string) => {
//     // Store only roleId in localStorage
//     localStorage.setItem('roleId', roleId);
//     setRoleId(roleId);
//   };

//   const logout = () => {
//     // Clear roleId from localStorage and state
//     localStorage.removeItem('roleId');
//     setRoleId(null);
//   };

//   return <AuthContext.Provider value={{ roleId, login, logout }}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
