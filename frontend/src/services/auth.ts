import api from './api';

export interface User {
  id: number;
  username: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const register = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', { username, password });
  return response.data;
};

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', { username, password });
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<{ user: User }>('/auth/me');
  return response.data.user;
};

