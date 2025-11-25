import { apiClient } from './client';
import type { Event, User } from '@/types/api';

export interface AdminDashboardStats {
  message: string;
  stats: {
    totalUsers: number;
    totalEvents: number;
    totalParticipants: number;
    recentEvents: number;
    activeEvents: number;
  };
  timestamp: string;
}

export interface AdminEventsResponse {
  message: string;
  events: Event[];
  total: number;
}

export interface AdminUsersResponse {
  message: string;
  users: User[];
  total: number;
}

export class AdminService {
  async getDashboard(): Promise<AdminDashboardStats> {
    return apiClient.get('/admin/dashboard');
  }

  async getAllEvents(): Promise<AdminEventsResponse> {
    return apiClient.get('/admin/events');
  }

  async getAllUsers(): Promise<AdminUsersResponse> {
    return apiClient.get('/admin/users');
  }
}

export const adminService = new AdminService();