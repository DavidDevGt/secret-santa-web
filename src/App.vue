<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useEventStore } from '@/stores/event';
import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';
import EventList from '@/components/EventList.vue';
import EventForm from '@/components/EventForm.vue';
import EventDetail from '@/components/EventDetail.vue';

const authStore = useAuthStore();
const eventStore = useEventStore();

const showRegister = ref(false);
const currentView = ref<'list' | 'create' | 'edit' | 'detail'>('list');
const editingEventId = ref<string | undefined>();

onMounted(() => {
  authStore.initializeAuth();
});

const switchToRegister = () => {
  showRegister.value = true;
};

const switchToLogin = () => {
  showRegister.value = false;
};

const showEventList = () => {
  currentView.value = 'list';
  editingEventId.value = undefined;
};

const showCreateEvent = () => {
  currentView.value = 'create';
  editingEventId.value = undefined;
};

const showEditEvent = (id: string) => {
  currentView.value = 'edit';
  editingEventId.value = id;
};

const showDetailEvent = (id: string) => {
  currentView.value = 'detail';
  editingEventId.value = id;
};

const handleEventCreated = () => {
  showEventList();
};

const handleEventUpdated = () => {
  showEventList();
};

const handleDeleteEvent = async (id: string) => {
  if (confirm('Are you sure you want to delete this event?')) {
    try {
      await eventStore.deleteEvent(id);
    } catch (error) {
      alert('Error deleting event: ' + (error as Error).message);
    }
  }
};
</script>

<template>
  <div v-if="!authStore.isAuthenticated">
    <h1>Secret Santa</h1>
    <Login v-if="!showRegister" @switch-to-register="switchToRegister" />
    <Register v-else @switch-to-login="switchToLogin" />
  </div>
  <div v-else>
    <header class="app-header">
      <h1>Secret Santa</h1>
      <div class="user-info">
        <span>Welcome, {{ authStore.user?.name }} ({{ authStore.user?.role }})</span>
        <button @click="authStore.logout()">Logout</button>
      </div>
    </header>
    <main>
      <EventList
        v-if="currentView === 'list'"
        @create-event="showCreateEvent"
        @view-event="showDetailEvent"
        @edit-event="showEditEvent"
        @delete-event="handleDeleteEvent"
      />
      <EventDetail
        v-else-if="currentView === 'detail' && editingEventId"
        :event-id="editingEventId"
        @back="showEventList"
      />
      <EventForm
        v-else-if="currentView === 'create'"
        @created="handleEventCreated"
        @cancel="showEventList"
      />
      <EventForm
        v-else-if="currentView === 'edit' && editingEventId"
        :event-id="editingEventId"
        @updated="handleEventUpdated"
        @cancel="showEventList"
      />
    </main>
  </div>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

main {
  padding: 1rem;
}
</style>
