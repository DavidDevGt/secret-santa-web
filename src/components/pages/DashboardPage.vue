<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Dashboard</h1>
      <p>Welcome back! Here's an overview of your Secret Santa activities.</p>
    </div>

    <div class="dashboard-grid">
      <div class="stat-card">
        <h3>My Events</h3>
        <p class="stat-number">{{ eventStore.userEvents.length }}</p>
        <p class="stat-description">Events you're participating in or organizing</p>
      </div>

      <div class="quick-actions">
        <h3>Quick Actions</h3>
        <div class="actions-grid">
          <router-link to="/events" class="action-card">
            <h4>View Events</h4>
            <p>Browse and manage your events</p>
          </router-link>
          <router-link
            to="/events/create"
            class="action-card create-event"
          >
            <h4>Create Event</h4>
            <p>Start a new Secret Santa event</p>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useEventStore } from '@/stores/events';

const authStore = useAuthStore();
const eventStore = useEventStore();

// Ensure events are loaded when dashboard mounts
onMounted(async () => {
  console.log('Dashboard mounted, authenticated:', authStore.isAuthenticated);
  console.log('Current user:', authStore.user);
  console.log('Events count:', eventStore.eventsCount);
  console.log('User events count:', eventStore.userEvents.length);

  if (authStore.isAuthenticated && eventStore.eventsCount === 0) {
    console.log('Fetching events from dashboard...');
    try {
      await eventStore.fetchEvents();
      console.log('Events fetched, new count:', eventStore.eventsCount);
      console.log('User events:', eventStore.userEvents.length);
    } catch (error) {
      console.error('Failed to load events in dashboard:', error);
    }
  }
});
</script>

<style scoped>
.dashboard {
  max-width: var(--max-width-lg);
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: var(--space-2xl);
  text-align: center;
}

.dashboard-header h1 {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 var(--space-sm) 0;
  letter-spacing: -0.025em;
}

.dashboard-header p {
  color: var(--color-gray-600);
  margin: 0;
  font-size: var(--font-size-lg);
}

.dashboard-grid {
  display: grid;
  gap: var(--space-2xl);
}

.stat-card {
  background: var(--color-white);
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-gray-200);
  transition: box-shadow 0.2s ease;
}

.stat-card:hover {
  box-shadow: var(--shadow-lg);
}

.stat-card h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-gray-700);
  margin: 0 0 var(--space-lg) 0;
}

.stat-number {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  color: var(--color-accent);
  margin: 0 0 var(--space-sm) 0;
  letter-spacing: -0.025em;
}

.stat-description {
  color: var(--color-gray-500);
  margin: 0;
  font-size: var(--font-size-sm);
}

.quick-actions h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-gray-700);
  margin: 0 0 var(--space-lg) 0;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-md);
}

.action-card {
  display: block;
  background: var(--color-white);
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-gray-200);
  text-decoration: none;
  transition: all 0.2s ease;
}

.action-card:hover {
  box-shadow: var(--shadow-lg);
  border-color: var(--color-accent);
  transform: translateY(-2px);
}

.action-card h4 {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-primary);
  margin: 0 0 var(--space-sm) 0;
}

.action-card p {
  color: var(--color-gray-600);
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

.create-event {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  border-color: var(--color-primary);
  position: relative;
  overflow: hidden;
}

.create-event::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.create-event:hover::before {
  left: 100%;
}

.create-event h4,
.create-event p {
  color: var(--color-white);
  position: relative;
  z-index: 1;
}

.create-event:hover {
  box-shadow: 0 8px 25px -8px rgba(15, 23, 42, 0.3);
}
</style>