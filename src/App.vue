<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import { useEventStore } from '@/stores/events';
import { authService } from '@/services/api/auth';
import ErrorBoundary from '@/components/ui/ErrorBoundary.vue';

const authStore = useAuthStore();
const eventStore = useEventStore();

onMounted(async () => {
  console.log('App mounted, token present:', !!authStore.token);
  await authStore.initializeAuth();
  console.log('After init, token present:', !!authStore.token);

  // Verify token if present (following USER_ROLE_ALL.md pattern)
  if (authStore.token) {
    try {
      console.log('Verifying token...');
      const response = await authService.verifyToken();
      if (response.valid) {
        console.log('Token valid, user authenticated');
        // User data already restored from localStorage
        await eventStore.fetchEvents();
      } else {
        // Token invalid
        console.warn('Token invalid, logging out');
        authStore.logout();
      }
    } catch (error) {
      // Token verification failed, logout
      console.warn('Token verification failed:', error);
      authStore.logout();
    }
  }
});
</script>

<template>
  <ErrorBoundary>
    <router-view />
  </ErrorBoundary>
</template>
