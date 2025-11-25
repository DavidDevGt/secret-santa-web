import { defineStore } from 'pinia';
import { ref } from 'vue';
import { adminService } from '@/services/api/admin';
import type { AdminDashboardStats, AdminEventsResponse, AdminUsersResponse } from '@/services/api/admin';

export const useAdminStore = defineStore('admin', () => {
  // State
  const dashboardStats = ref<AdminDashboardStats | null>(null);
  const allEvents = ref<AdminEventsResponse | null>(null);
  const allUsers = ref<AdminUsersResponse | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Actions
  async function getDashboard(): Promise<AdminDashboardStats> {
    loading.value = true;
    error.value = null;
    try {
      const stats = await adminService.getDashboard();
      dashboardStats.value = stats;
      return stats;
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function getAllEvents(): Promise<AdminEventsResponse> {
    loading.value = true;
    error.value = null;
    try {
      const events = await adminService.getAllEvents();
      allEvents.value = events;
      return events;
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function getAllUsers(): Promise<AdminUsersResponse> {
    loading.value = true;
    error.value = null;
    try {
      const users = await adminService.getAllUsers();
      allUsers.value = users;
      return users;
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    // State
    dashboardStats,
    allEvents,
    allUsers,
    loading,
    error,

    // Actions
    getDashboard,
    getAllEvents,
    getAllUsers
  };
});