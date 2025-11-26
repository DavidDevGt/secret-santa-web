<template>
  <div class="event-list-page">
    <div class="page-header">
      <h1>My Events</h1>
      <p>Manage your Secret Santa events</p>
      <Button
        v-if="authStore.hasRole('organizer') || authStore.hasRole('admin')"
        variant="primary"
        size="lg"
        @click="goToCreate"
        class="create-btn"
      >
        Create New Event
      </Button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading events...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <Button @click="loadEvents" variant="outline">Try Again</Button>
    </div>

    <!-- Empty State -->
    <div v-else-if="!events.length" class="empty-state">
      <h3>No events yet</h3>
      <p v-if="authStore.hasRole('organizer') || authStore.hasRole('admin')">
        Create your first Secret Santa event to get started!
      </p>
      <p v-else>
        You haven't been invited to any events yet. Ask an organizer to invite you!
      </p>
    </div>

    <!-- Events Grid -->
    <div v-else class="events-grid">
      <div
        v-for="event in events"
        :key="event.id"
        class="event-card"
      >
        <div class="event-header">
          <h3 class="event-name">{{ event.name }}</h3>
          <div class="event-actions">
            <Button
              v-if="event.canEdit"
              @click="editEvent(event)"
              variant="outline"
              size="sm"
            >
              Edit
            </Button>
            <Button
              v-if="event.canDelete"
              @click="confirmDelete(event)"
              variant="danger"
              size="sm"
            >
              Delete
            </Button>
          </div>
        </div>

        <div class="event-info">
          <div class="info-item">
            <span class="label">Participants:</span>
            <span class="value">{{ event.participantCount }}</span>
          </div>
          <div class="info-item">
            <span class="label">Created:</span>
            <span class="value">{{ formatDate(event.createdAt) }}</span>
          </div>
          <div v-if="event.assignedAt" class="info-item">
            <span class="label">Assigned:</span>
            <span class="value">{{ formatDate(event.assignedAt) }}</span>
          </div>
        </div>

        <div class="event-status">
          <span
            :class="[
              'status-badge',
              event.hasAssignments ? 'status-complete' : 'status-pending'
            ]"
          >
            {{ event.hasAssignments ? 'Assignments Generated' : 'Setup Required' }}
          </span>
        </div>

        <Button
          @click="viewEvent(event)"
          variant="primary"
          size="sm"
          class="view-btn"
        >
          View Details
        </Button>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Edit Event</h3>
          <button @click="closeEditModal" class="close-btn">&times;</button>
        </div>
        <form @submit.prevent="handleUpdateEvent" class="edit-form">
          <div class="form-group">
            <label for="edit-name">Event Name</label>
            <input
              id="edit-name"
              v-model="editForm.name"
              type="text"
              required
              maxlength="255"
              :disabled="updating"
            />
          </div>
          <div class="modal-actions">
            <Button
              type="button"
              @click="closeEditModal"
              variant="outline"
              :disabled="updating"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              :loading="updating"
              :disabled="!editForm.name.trim()"
            >
              Update Event
            </Button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Delete Event</h3>
          <button @click="closeDeleteModal" class="close-btn">&times;</button>
        </div>
        <div class="delete-confirmation">
          <p>Are you sure you want to delete <strong>{{ eventToDelete?.name }}</strong>?</p>
          <p class="warning-text">This action cannot be undone.</p>
          <div class="modal-actions">
            <Button
              @click="closeDeleteModal"
              variant="outline"
              :disabled="deleting"
            >
              Cancel
            </Button>
            <Button
              @click="handleDeleteEvent"
              variant="danger"
              :loading="deleting"
            >
              Delete Event
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useEventStore } from '@/stores/events';
import { useAuthStore } from '@/stores/auth';
import Button from '@/components/ui/Button.vue';
import type { Event } from '@/types/domain';

const router = useRouter();
const eventStore = useEventStore();
const authStore = useAuthStore();

const events = ref<Event[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// Edit modal
const showEditModal = ref(false);
const editingEvent = ref<Event | null>(null);
const editForm = ref({ name: '' });
const updating = ref(false);

// Delete modal
const showDeleteModal = ref(false);
const eventToDelete = ref<Event | null>(null);
const deleting = ref(false);

const loadEvents = async () => {
  loading.value = true;
  error.value = null;
  try {
    await eventStore.fetchEvents();
    events.value = eventStore.userEvents;
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
};

const goToCreate = () => {
  router.push('/events/create');
};

const viewEvent = (event: Event) => {
  router.push(`/events/${event.id}`);
};

const editEvent = (event: Event) => {
  editingEvent.value = event;
  editForm.value.name = event.name;
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  editingEvent.value = null;
  editForm.value.name = '';
};

const handleUpdateEvent = async () => {
  if (!editingEvent.value || !editForm.value.name.trim()) return;

  updating.value = true;
  try {
    await eventStore.updateEvent(editingEvent.value.id, editForm.value.name.trim());
    closeEditModal();
    await loadEvents(); // Refresh the list
  } catch (err) {
    // Error is handled by the store
  } finally {
    updating.value = false;
  }
};

const confirmDelete = (event: Event) => {
  eventToDelete.value = event;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  eventToDelete.value = null;
};

const handleDeleteEvent = async () => {
  if (!eventToDelete.value) return;

  deleting.value = true;
  try {
    await eventStore.deleteEvent(eventToDelete.value.id);
    closeDeleteModal();
    await loadEvents(); // Refresh the list
  } catch (err) {
    // Error is handled by the store
  } finally {
    deleting.value = false;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

onMounted(() => {
  loadEvents();
});
</script>

<style scoped>
.event-list-page {
  max-width: var(--max-width-xl);
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.page-header h1 {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 var(--space-sm) 0;
}

.page-header p {
  color: var(--color-gray-600);
  font-size: var(--font-size-lg);
  margin: 0 0 var(--space-xl) 0;
}

.create-btn {
  margin-top: var(--space-lg);
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: var(--space-2xl);
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid var(--color-gray-200);
  border-top: 3px solid var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--space-md) auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state h3 {
  color: var(--color-gray-700);
  margin: 0 0 var(--space-sm) 0;
}

.empty-state p {
  color: var(--color-gray-500);
  margin: 0 0 var(--space-lg) 0;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-lg);
}

.event-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-gray-200);
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
}

.event-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-md);
}

.event-name {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
  flex: 1;
  margin-right: var(--space-md);
}

.event-actions {
  display: flex;
  gap: var(--space-sm);
}

.event-info {
  margin-bottom: var(--space-lg);
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-xs);
}

.info-item .label {
  color: var(--color-gray-600);
  font-weight: 500;
}

.info-item .value {
  color: var(--color-gray-900);
  font-weight: 600;
}

.event-status {
  margin-bottom: var(--space-lg);
}

.status-badge {
  display: inline-block;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-complete {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.status-pending {
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--color-warning);
}

.view-btn {
  align-self: flex-start;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-md);
}

.modal-content {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-gray-200);
}

.modal-header h3 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: var(--font-size-xl);
  cursor: pointer;
  color: var(--color-gray-500);
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: var(--color-gray-100);
  color: var(--color-gray-700);
}

.edit-form,
.delete-confirmation {
  padding: var(--space-lg);
}

.form-group {
  margin-bottom: var(--space-lg);
}

.form-group label {
  display: block;
  margin-bottom: var(--space-sm);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-gray-700);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.form-group input {
  width: 100%;
  padding: var(--space-md);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  transition: border-color 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.form-group input:disabled {
  background-color: var(--color-gray-50);
  cursor: not-allowed;
}

.modal-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: flex-end;
  margin-top: var(--space-lg);
}

.warning-text {
  color: var(--color-error);
  font-weight: 500;
  margin: var(--space-sm) 0 var(--space-lg) 0;
}

/* Responsive */
@media (max-width: 768px) {
  .events-grid {
    grid-template-columns: 1fr;
  }

  .event-header {
    flex-direction: column;
    gap: var(--space-sm);
  }

  .event-name {
    margin-right: 0;
  }

  .event-actions {
    align-self: flex-end;
  }

  .modal-content {
    margin: var(--space-md);
    max-height: calc(100vh - 2 * var(--space-md));
  }
}
</style>