<template>
  <div class="event-detail">
    <div class="header">
      <h2>{{ event?.name }}</h2>
      <button @click="$emit('back')">Back to Events</button>
    </div>

    <div v-if="loading" class="loading">Loading event details...</div>
    <div v-else-if="event">
      <div class="event-info">
        <p><strong>Created:</strong> {{ new Date(event.createdAt).toLocaleDateString() }}</p>
        <p v-if="event.assignedAt"><strong>Assignments Generated:</strong> {{ new Date(event.assignedAt).toLocaleDateString() }}</p>
      </div>

      <div class="participants-section">
        <h3>Participants ({{ event.participants.length }})</h3>
        <button @click="showAddParticipant = !showAddParticipant" class="add-btn">
          {{ showAddParticipant ? 'Cancel' : 'Add Participant' }}
        </button>

        <form v-if="showAddParticipant" @submit.prevent="handleAddParticipant" class="add-form">
          <input
            v-model="newParticipant.name"
            placeholder="Name"
            required
          />
          <input
            v-model="newParticipant.email"
            type="email"
            placeholder="Email"
            required
          />
          <input
            v-model="newParticipant.phone"
            placeholder="Phone (optional)"
          />
          <button type="submit" :disabled="addingParticipant">
            {{ addingParticipant ? 'Adding...' : 'Add' }}
          </button>
        </form>

        <ul class="participants-list">
          <li v-for="participant in event.participants" :key="participant.id" class="participant-item">
            <div class="participant-info">
              <strong>{{ participant.name }}</strong>
              <span v-if="authStore.hasRole('organizer') || authStore.hasRole('admin')"> - {{ participant.email }}</span>
              <span v-if="(authStore.hasRole('organizer') || authStore.hasRole('admin')) && participant.phone"> ({{ participant.phone }})</span>
            </div>
            <button @click="removeParticipant(participant.id)" class="remove-btn">Remove</button>
          </li>
        </ul>
      </div>

      <div class="assignments-section" v-if="event.participants.length >= 2">
        <h3>Assignments</h3>
        <button
          v-if="!event.assignedAt"
          @click="generateAssignments"
          :disabled="generating"
          class="generate-btn"
        >
          {{ generating ? 'Generating...' : 'Generate Assignments' }}
        </button>
        <button
          v-else
          @click="viewMyAssignment"
          class="view-btn"
        >
          View My Assignment
        </button>
        <p v-if="assignmentMessage">{{ assignmentMessage }}</p>
      </div>
    </div>

    <ChristmasGiftModal :message="modalMessage" :isVisible="showModal" @close="closeModal" />

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useEventStore } from '@/stores/event';
import { useAuthStore } from '@/stores/auth';
import ChristmasGiftModal from '@/components/ui/ChristmasGiftModal.vue';
import type { Event } from '@/types/api';

interface Props {
  eventId: string;
}

const props = defineProps<Props>();

const eventStore = useEventStore();
const authStore = useAuthStore();

const event = ref<Event | null>(null);
const loading = ref(false);
const error = ref('');
const showAddParticipant = ref(false);
const newParticipant = ref({ name: '', email: '', phone: '' });
const addingParticipant = ref(false);
const generating = ref(false);
const assignmentMessage = ref('');
const showModal = ref(false);
const modalMessage = ref('');

const loadEvent = async () => {
  loading.value = true;
  error.value = '';
  try {
    event.value = await eventStore.fetchEvent(props.eventId);
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
};

const handleAddParticipant = async () => {
  addingParticipant.value = true;
  try {
    await eventStore.addParticipant(props.eventId, {
      name: newParticipant.value.name,
      email: newParticipant.value.email,
      phone: newParticipant.value.phone || undefined
    });
    newParticipant.value = { name: '', email: '', phone: '' };
    showAddParticipant.value = false;
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    addingParticipant.value = false;
  }
};

const removeParticipant = async (participantId: string) => {
  if (confirm('Are you sure you want to remove this participant?')) {
    try {
      await eventStore.deleteParticipant(props.eventId, participantId);
    } catch (err) {
      error.value = (err as Error).message;
    }
  }
};

const generateAssignments = async () => {
  generating.value = true;
  assignmentMessage.value = '';
  try {
    const result = await eventStore.generateAssignments(props.eventId);
    assignmentMessage.value = result.message;
    await loadEvent(); // Refresh to show assignedAt
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    generating.value = false;
  }
};

const viewMyAssignment = async () => {
  try {
    const assignments = await eventStore.fetchMyAssignment();
    const eventAssignment = assignments.find(a => a.eventId === props.eventId);

    if (eventAssignment) {
      modalMessage.value = `<strong>${eventAssignment.eventName}</strong> <br><br>🎁 You need to buy a gift for: ${eventAssignment.receiverName}<br><br>Happy gifting! 🎅`;
    } else {
      modalMessage.value = 'No assignment found for this event yet.';
    }
    showModal.value = true;
  } catch (err) {
    modalMessage.value = 'Error loading your assignment: ' + (err as Error).message;
    showModal.value = true;
  }
};

const closeModal = () => {
  showModal.value = false;
};

onMounted(() => {
  loadEvent();
});

defineEmits<{
  back: [];
}>();
</script>

<style scoped>
.event-detail {
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.participants-section, .assignments-section {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #ddd;
}

.add-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 1rem;
}

.add-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  align-items: center;
}

.add-form input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
}

.participants-list {
  list-style: none;
  padding: 0;
}

.participant-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.remove-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.generate-btn, .view-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.generate-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 2rem;
}

.error {
  color: red;
  text-align: center;
}
</style>