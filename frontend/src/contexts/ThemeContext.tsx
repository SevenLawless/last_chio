import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';
import { generateTheme, Theme, ThemeColors } from '../styles/theme';

interface ThemeContextType {
  theme: Theme;
  userColors: ThemeColors | null;
  updateColors: (colors: Partial<ThemeColors>) => Promise<void>;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userColors, setUserColors] = useState<ThemeColors | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserPreferences = async () => {
    if (!user) {
      setUserColors(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get<ThemeColors>('/user/preferences');
      setUserColors(response.data);
    } catch (error) {
      console.error('Error loading user preferences:', error);
      setUserColors(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserPreferences();
  }, [user]);

  const updateColors = async (colors: Partial<ThemeColors>) => {
    try {
      await api.put('/user/preferences', colors);
      await loadUserPreferences();
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  };

  const theme = generateTheme(userColors || undefined);

  return (
    <ThemeContext.Provider value={{ theme, userColors, updateColors, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};

