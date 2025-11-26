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
            v-if="authStore.hasRole('organizer') || authStore.hasRole('admin')"
            to="/events/create"
            class="action-card create-event"
          >
            <h4>Create Event</h4>
            <p>Start a new Secret Santa event</p>
          </router-link>
        </div>
      </div>

      <!-- Assignments Section -->
      <div v-if="authStore.hasRole('participant')" class="assignments-section">
        <h3>My Secret Santa Assignments</h3>
        <div v-if="loadingAssignments" class="loading-state">
          <p>Loading your assignments...</p>
        </div>
        <div v-else-if="assignments.length === 0" class="empty-state">
          <p>🎄 No assignments yet! Check back after assignments are generated for your events.</p>
        </div>
        <div v-else class="assignments-grid">
          <div
            v-for="assignment in assignments"
            :key="assignment.eventId"
            class="assignment-card"
            @click="viewAssignment(assignment)"
          >
            <h4>{{ assignment.eventName }}</h4>
            <p>Click to see your assignment</p>
            <small>🎁 Ready to gift!</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useEventStore } from '@/stores/events';
import type { MyAssignment } from '@/types/api';

const authStore = useAuthStore();
const eventStore = useEventStore();
const assignments = ref<MyAssignment[]>([]);
const loadingAssignments = ref(false);

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

  // Load assignments if user is participant
  if (authStore.hasRole('participant')) {
    await loadAssignments();
  }
});

const loadAssignments = async () => {
  loadingAssignments.value = true;
  try {
    assignments.value = await eventStore.fetchMyAssignment();
    console.log('Loaded assignments:', assignments.value.length);
  } catch (error) {
    assignments.value = [];
    console.log('User has no assignments yet');
  } finally {
    loadingAssignments.value = false;
  }
};

const viewAssignment = (assignment: MyAssignment) => {
  alert(`🎄 ${assignment.eventName}\n\n🎁 You need to buy a gift for: ${assignment.receiverName}\n📧 Email: ${assignment.receiverEmail}\n\nHappy gifting! 🎅`);
};
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
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-lg);
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

.assignment-card {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  cursor: pointer;
}

.assignment-card:hover {
  box-shadow: 0 8px 25px -8px rgba(59, 130, 246, 0.3);
}

.assignment-card h4,
.assignment-card p {
  color: var(--color-white);
  position: relative;
  z-index: 1;
}

/* Assignments Section */
.assignments-section {
  background: var(--color-white);
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-gray-200);
}

.assignments-section h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-gray-700);
  margin: 0 0 var(--space-lg) 0;
}

.assignments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-lg);
}

.assignments-grid .assignment-card {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.assignments-grid .assignment-card:hover {
  box-shadow: 0 8px 25px -8px rgba(16, 185, 129, 0.3);
  transform: translateY(-2px);
}

.assignments-grid .assignment-card h4 {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-white);
  margin: 0 0 var(--space-sm) 0;
  position: relative;
  z-index: 1;
}

.assignments-grid .assignment-card p {
  color: var(--color-white);
  margin: 0 0 var(--space-sm) 0;
  font-size: var(--font-size-sm);
  position: relative;
  z-index: 1;
  opacity: 0.9;
}

.assignments-grid .assignment-card small {
  color: var(--color-white);
  font-size: var(--font-size-xs);
  position: relative;
  z-index: 1;
  opacity: 0.8;
}

/* Loading and Empty States */
.loading-state,
.empty-state {
  text-align: center;
  padding: var(--space-xl);
  color: var(--color-gray-600);
}

.loading-state p {
  margin: 0;
  font-style: italic;
}

.empty-state p {
  margin: 0;
  font-size: var(--font-size-base);
  line-height: 1.6;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .assignments-grid {
    grid-template-columns: 1fr;
  }

  .assignments-section {
    padding: var(--space-lg);
  }
}
</style>