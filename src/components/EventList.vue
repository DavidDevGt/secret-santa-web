<template>
  <div class="event-list">
    <h2>Your Events</h2>
    <button @click="$emit('create-event')" class="create-btn">Create New Event</button>
    <div v-if="loading" class="loading">Loading events...</div>
    <div v-else-if="events.length === 0" class="no-events">
      No events found. Create your first event!
    </div>
    <ul v-else class="events">
      <li v-for="event in events" :key="event.id" class="event-item">
        <div class="event-info">
          <h3>{{ event.name }}</h3>
          <p>Participants: {{ event.participants.length }}</p>
          <p>Created: {{ new Date(event.createdAt).toLocaleDateString() }}</p>
          <p v-if="event.assignedAt">Assigned: {{ new Date(event.assignedAt).toLocaleDateString() }}</p>
        </div>
        <div class="event-actions">
          <button @click="$emit('view-event', event.id)">View</button>
          <button @click="$emit('edit-event', event.id)">Edit</button>
          <button @click="$emit('delete-event', event.id)" class="delete-btn">Delete</button>
        </div>
      </li>
    </ul>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useEventStore } from '@/stores/event';
import type { Event } from '@/types/api';

const eventStore = useEventStore();

const events = ref<Event[]>([]);
const loading = ref(false);
const error = ref('');

const loadEvents = async () => {
  loading.value = true;
  error.value = '';
  try {
    await eventStore.fetchEvents();
    events.value = eventStore.events;
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadEvents();
});

defineEmits<{
  'create-event': [];
  'view-event': [id: string];
  'edit-event': [id: string];
  'delete-event': [id: string];
}>();
</script>

<style scoped>
.event-list {
  max-width: 800px;
  margin: 0 auto;
}

.create-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 1rem;
}

.events {
  list-style: none;
  padding: 0;
}

.event-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.event-info h3 {
  margin: 0 0 0.5rem 0;
}

.event-info p {
  margin: 0.25rem 0;
  color: #666;
}

.event-actions {
  display: flex;
  gap: 0.5rem;
}

.event-actions button {
  padding: 0.25rem 0.5rem;
  border: 1px solid #007bff;
  background-color: white;
  color: #007bff;
  border-radius: 4px;
  cursor: pointer;
}

.event-actions button:hover {
  background-color: #007bff;
  color: white;
}

.delete-btn {
  border-color: #dc3545;
  color: #dc3545;
}

.delete-btn:hover {
  background-color: #dc3545;
  color: white;
}

.loading, .no-events {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: red;
  text-align: center;
}
</style>