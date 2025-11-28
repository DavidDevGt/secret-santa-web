import { defineStore } from 'pinia';
import type { User, Permission } from '@/types/domain';
import type { User as ApiUser, LoginRequest, RegisterRequest, VerifyOtpRequest, VerifyRequest } from '@/types/api';
import { authService } from '@/services/api/auth';
import { getUserPermissions, hasPermission as checkPermission, hasAnyPermission, hasAllPermissions } from './utils';
import { logger } from '@/utils/logger';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('authToken') as string | null,
    pendingUser: null as ApiUser | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userPermissions: (state) =>
      state.user ? getUserPermissions(state.user) : [],
    canCreateEvents: (state) =>
      state.user ? getUserPermissions(state.user).includes('create_event') : false,
    canManageAllEvents: (state) =>
      state.user ? getUserPermissions(state.user).includes('manage_all_events') : false,

    // Permission checking functions as per USER_ROLE_ALL.md
    hasRole: (state) => (requiredRole: 'participant' | 'organizer' | 'admin') => {
      if (!state.user) return false;
      const hierarchy = { 'participant': 1, 'organizer': 2, 'admin': 3 };
      return hierarchy[state.user.role] >= hierarchy[requiredRole];
    },

    hasPermission: (state) => (permission: Permission) => {
      if (!state.user) return false;
      return checkPermission(state.user, permission);
    },

    hasAnyPermission: (state) => (permissions: Permission[]) => {
      if (!state.user) return false;
      return hasAnyPermission(state.user, permissions);
    },

    hasAllPermissions: (state) => (permissions: Permission[]) => {
      if (!state.user) return false;
      return hasAllPermissions(state.user, permissions);
    },

    canAccessEvent: (state) => (event: { owner_id: string; participants?: { email: string }[] }) => {
      if (!state.user) return false;
      if (state.user.role === 'admin') return true;
      if (event.owner_id === state.user.id) return true;
      // Check if user is a participant
      return event.participants?.some(p => p.email === state.user!.email) ?? false;
    },
  },

  actions: {
    getStoredUser(): User | null {
      try {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
      } catch {
        // If parsing fails, remove corrupted data
        localStorage.removeItem('user');
        return null;
      }
    },

    setToken(newToken: string) {
      this.token = newToken;
      localStorage.setItem('authToken', newToken);
    },

    clearToken() {
      this.token = null;
      localStorage.removeItem('authToken');
    },

    setUser(apiUser: ApiUser) {
      this.user = {
        ...apiUser,
        permissions: getUserPermissions(apiUser),
        isVerified: apiUser.email_verified ?? false,
        canCreateEvents: ['organizer', 'admin'].includes(apiUser.role),
        canManageAllEvents: apiUser.role === 'admin'
      };
      localStorage.setItem('user', JSON.stringify(this.user));
    },

    logout() {
      this.user = null;
      localStorage.removeItem('user');
      this.clearToken();
      this.pendingUser = null;
      this.error = null;
    },

    async register(data: RegisterRequest) {
      // Prevent duplicate registration attempts
      if (this.loading) {
        logger.warn('Registration already in progress');
        return;
      }

      this.loading = true;
      this.error = null;
      try {
        const response = await authService.register(data);
        this.pendingUser = response.user;
        return response;
      } catch (err) {
        this.error = (err as Error).message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async verifyOtp(data: VerifyOtpRequest) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authService.verifyOtp(data);
        this.setToken(response.token);
        this.setUser(this.pendingUser || response.user);
        this.pendingUser = null;
        return response;
      } catch (err) {
        this.error = (err as Error).message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async login(data: LoginRequest) {
      // Prevent duplicate login attempts
      if (this.loading) {
        logger.warn('Login already in progress');
        return;
      }

      this.loading = true;
      this.error = null;
      try {
        const response = await authService.login(data);
        this.setToken(response.token);
        this.setUser(response.user);
        return response;
      } catch (err) {
        this.error = (err as Error).message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async verify(data: VerifyRequest) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authService.verify(data);
        this.setToken(response.token);
        this.setUser(response.user);
        return response;
      } catch (err) {
        this.error = (err as Error).message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async initializeAuth() {
      this.user = this.getStoredUser();
    },
  },
});