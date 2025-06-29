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
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  theme: Theme;
  login: (payload: Record<string, unknown>) => Promise<void>;
  register: (payload: FormData | Record<string, unknown>) => Promise<void>;
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
      const parsedUser: User = JSON.parse(storedUser);
      setToken(storedToken);
      setUser(parsedUser);
      setTheme(themes[parsedUser.favoriteTeam] || themes.default);
    }
    setIsLoading(false);
  }, []);

  const login = async (payload: Record<string, unknown>) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/users/login`;
    const response = await axios.post(apiUrl, payload);
    const { token: resToken, user: resUser } = response.data;
    setUser(resUser);
    setToken(resToken);
    setTheme(themes[resUser.favoriteTeam] || themes.default);
    localStorage.setItem('token', resToken);
    localStorage.setItem('user', JSON.stringify(resUser));
    router.push('/');
  };

  // Register with avatar support (FormData)
  const register = async (payload: FormData | Record<string, unknown>) => {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/users/register`;
    const response = await axios.post(apiUrl, payload, {
      headers: payload instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : undefined,
    });
    const { token: resToken, user: resUser } = response.data;
    setUser(resUser);
    setToken(resToken);
    setTheme(themes[resUser.favoriteTeam] || themes.default);
    localStorage.setItem('token', resToken);
    localStorage.setItem('user', JSON.stringify(resUser));
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
      const response = await axios.put(
        apiUrl,
        { favoriteTeam: team },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedUser = response.data;
      setUser(updatedUser);
      setTheme(themes[updatedUser.favoriteTeam] || themes.default);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to update favorite team', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        theme,
        login,
        register,
        logout,
        updateFavoriteTeam,
      }}
    >
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
