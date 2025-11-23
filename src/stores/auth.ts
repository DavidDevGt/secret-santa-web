import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@/types/api';
import { api } from '@/services/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const isAuthenticated = computed(() => !!token.value && !!user.value);

  const setToken = (newToken: string) => {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  };

  const clearToken = () => {
    token.value = null;
    localStorage.removeItem('token');
  };

  const setUser = (newUser: User) => {
    user.value = newUser;
  };

  const logout = () => {
    user.value = null;
    clearToken();
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.register({ name, email, password });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const response = await api.verifyOtp({ email, otp });
      setToken(response.token);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login({ email, password });
      setToken(response.token);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const invite = async (name: string, email: string, eventId: string) => {
    try {
      return await api.invite({ name, email, eventId });
    } catch (error) {
      throw error;
    }
  };

  const verify = async (token: string, password: string) => {
    try {
      const response = await api.verify({ token, password });
      setToken(response.token);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Initialize user from token if available
  const initializeAuth = async () => {
    if (token.value && !user.value) {
      try {
        // Could fetch user profile, but for now assume token is valid
        // Since API doesn't have /me endpoint, perhaps skip or add one
      } catch (error) {
        logout();
      }
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    register,
    verifyOtp,
    login,
    invite,
    verify,
    logout,
    initializeAuth
  };
});