'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Theme } from '@mui/material/styles';
import themes from '../theme'; // Import your theme definitions

interface User {
  id: string;
  username: string;
  email: string;
  favoriteTeam: string;
  avatar: string; // Added avatar field
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  theme: Theme;
  login: (payload: any) => Promise<void>;
  register: (payload: any) => Promise<void>; // Added register function
  logout: () => void;
  updateFavoriteTeam: (team: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>(themes.default);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setToken(storedToken);
      setUser(parsedUser);
      setTheme(themes[parsedUser.favoriteTeam] || themes.default);
    }
    setIsLoading(false);
  }, []);

  const login = async (payload: any) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/users/login`;
    const response = await axios.post(apiUrl, payload);
    const { token, user } = response.data;
    setUser(user);
    setToken(token);
    setTheme(themes[user.favoriteTeam] || themes.default);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    router.push('/');
  };

  // New: Register with avatar support (FormData)
  const register = async (payload: any) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/users/register`;
    // If payload is FormData, set headers automatically
    const response = await axios.post(apiUrl, payload, {
      headers: payload instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : undefined,
    });
    const { token, user } = response.data;
    setUser(user);
    setToken(token);
    setTheme(themes[user.favoriteTeam] || themes.default);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    router.push('/');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth');
  };

  const updateFavoriteTeam = async (team: string) => {
    if (!token) return;
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`;
      const response = await axios.put(apiUrl, { favoriteTeam: team }, { headers: { Authorization: `Bearer ${token}` } });
      const updatedUser = response.data;
      setUser(updatedUser);
      setTheme(themes[updatedUser.favoriteTeam] || themes.default);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to update favorite team', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, theme, login, register, logout, updateFavoriteTeam }}>
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
