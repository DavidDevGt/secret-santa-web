<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import { useEventStore } from '@/stores/events';
import { authService } from '@/services/api/auth';
import ErrorBoundary from '@/components/ui/ErrorBoundary.vue';
import { logger } from '@/utils/logger';

const authStore = useAuthStore();
const eventStore = useEventStore();

onMounted(async () => {
  logger.debug('App mounted', { tokenPresent: !!authStore.token });
  await authStore.initializeAuth();
  logger.debug('After auth init', { tokenPresent: !!authStore.token });

  // Verify token if present (following USER_ROLE_ALL.md pattern)
  if (authStore.token) {
    try {
      logger.debug('Verifying token');
      const response = await authService.verifyToken();
      if (response.valid) {
        logger.info('Token valid, user authenticated');
        // User data already restored from localStorage
        await eventStore.fetchEvents();
      } else {
        // Token invalid
        logger.warn('Token invalid, logging out');
        authStore.logout();
      }
    } catch (error) {
      // Token verification failed, logout
      logger.warn('Token verification failed, logging out', { error });
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
