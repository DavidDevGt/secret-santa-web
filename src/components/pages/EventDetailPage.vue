<template>
  <div class="event-detail-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading event details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <Button @click="loadEvent" variant="outline">Try Again</Button>
    </div>

    <!-- Event Content -->
    <div v-else-if="event" class="event-content">
      <!-- Header -->
      <div class="event-header">
        <div class="header-info">
          <h1>{{ event.name }}</h1>
          <div class="event-meta">
            <span class="meta-item">
              Created: {{ formatDate(event.createdAt) }}
            </span>
            <span v-if="event.assignedAt" class="meta-item">
              Assignments: {{ formatDate(event.assignedAt) }}
            </span>
            <span class="meta-item">
              Participants: {{ event.participants.length }}
            </span>
          </div>
        </div>
        <div class="header-actions">
          <Button @click="goBack" variant="outline">Back to Events</Button>
          <Button
            v-if="event.canEdit"
            @click="showEditModal = true"
            variant="outline"
          >
            Edit Event
          </Button>
        </div>
      </div>

      <!-- Participants Section -->
      <section class="section">
        <div class="section-header">
          <h2>Participants ({{ event.participants.length }})</h2>
          <Button
            v-if="event.canManageParticipants"
            @click="showAddParticipant = !showAddParticipant"
            :variant="showAddParticipant ? 'outline' : 'primary'"
          >
            {{ showAddParticipant ? 'Cancel' : 'Add Participant' }}
          </Button>
        </div>

        <!-- Add Participant Form -->
        <div v-if="showAddParticipant && event.canManageParticipants" class="add-form">
          <form @submit.prevent="handleAddParticipant" class="participant-form">
            <div class="form-row">
              <div class="form-group">
                <label for="participant-name">Name *</label>
                <input
                  id="participant-name"
                  v-model="newParticipant.name"
                  type="text"
                  required
                  maxlength="255"
                  :disabled="addingParticipant"
                  placeholder="Enter participant name"
                />
              </div>
              <div class="form-group">
                <label for="participant-email">Email *</label>
                <input
                  id="participant-email"
                  v-model="newParticipant.email"
                  type="email"
                  required
                  :disabled="addingParticipant"
                  placeholder="Enter participant email"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="participant-phone">Phone</label>
                <input
                  id="participant-phone"
                  v-model="newParticipant.phone"
                  type="tel"
                  maxlength="50"
                  :disabled="addingParticipant"
                  placeholder="Enter phone number (optional)"
                />
              </div>
              <div class="form-group">
                <label for="participant-group">Group</label>
                <input
                  id="participant-group"
                  v-model="newParticipant.groupId"
                  type="text"
                  :disabled="addingParticipant"
                  placeholder="Enter group name (optional)"
                />
              </div>
            </div>
            <div class="form-actions">
              <Button
                type="submit"
                variant="primary"
                :loading="addingParticipant"
                :disabled="!newParticipant.name.trim() || !newParticipant.email.trim()"
              >
                Add Participant
              </Button>
            </div>
          </form>
        </div>

        <!-- Participants List -->
        <div class="participants-list">
          <div
            v-for="participant in event.participants"
            :key="participant.id"
            class="participant-card"
          >
            <div class="participant-info">
              <h4>{{ participant.name }}</h4>
              <p v-if="authStore.hasRole('organizer') || authStore.hasRole('admin')">{{ participant.email }}</p>
              <p v-if="(authStore.hasRole('organizer') || authStore.hasRole('admin')) && participant.phone" class="phone">{{ participant.phone }}</p>
              <p v-if="participant.group_id" class="group">Group: {{ participant.group_id }}</p>
            </div>
            <div v-if="event.canManageParticipants && !event.hasAssignments" class="participant-actions">
              <Button
                @click="removeParticipant(participant)"
                variant="danger"
                size="sm"
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      </section>

      <!-- Rules Section - Only for organizers and admins -->
      <section v-if="authStore.hasRole('organizer') || authStore.hasRole('admin')" class="section">
        <div class="section-header">
          <h2>Rules</h2>
          <Button
            @click="showRulesForm = !showRulesForm"
            variant="outline"
          >
            {{ showRulesForm ? 'Cancel' : 'Edit Rules' }}
          </Button>
        </div>

        <!-- Current Rules -->
        <div v-if="!showRulesForm" class="rules-display">
          <div class="rule-item">
            <span class="rule-label">Avoid Same Group:</span>
            <span class="rule-value">{{ event.rules?.avoidSameGroup ? 'Yes' : 'No' }}</span>
          </div>
          <div class="rule-item">
            <span class="rule-label">Max Shuffle Attempts:</span>
            <span class="rule-value">{{ event.rules?.maxShuffleAttempts || 1000 }}</span>
          </div>
          <div class="rule-item">
            <span class="rule-label">Avoid Previous Assignments:</span>
            <span class="rule-value">{{ event.rules?.avoidPreviousAssignments ? 'Yes' : 'No' }}</span>
          </div>
        </div>

        <!-- Rules Form -->
        <div v-else class="rules-form">
          <form @submit.prevent="handleUpdateRules" class="rules-edit-form">
            <div class="form-group">
              <label class="checkbox-label">
                <input
                  v-model="rulesForm.avoidSameGroup"
                  type="checkbox"
                  :disabled="updatingRules"
                />
                Avoid Same Group
              </label>
            </div>
            <div class="form-group">
              <label for="max-attempts">Max Shuffle Attempts</label>
              <input
                id="max-attempts"
                v-model.number="rulesForm.maxShuffleAttempts"
                type="number"
                min="1"
                max="10000"
                :disabled="updatingRules"
              />
            </div>
            <div class="form-group">
              <label class="checkbox-label">
                <input
                  v-model="rulesForm.avoidPreviousAssignments"
                  type="checkbox"
                  :disabled="updatingRules"
                />
                Avoid Previous Assignments
              </label>
            </div>
            <div class="form-actions">
              <Button
                type="submit"
                variant="primary"
                :loading="updatingRules"
              >
                Update Rules
              </Button>
            </div>
          </form>
        </div>
      </section>

      <!-- Assignments Section -->
      <section v-if="event.participants.length >= 2" class="section">
        <div class="section-header">
          <h2>Secret Santa Assignments</h2>
          <div class="assignment-actions">
            <!-- Only organizers/admins can generate assignments -->
            <Button
              v-if="!event.hasAssignments && (authStore.hasRole('organizer') || authStore.hasRole('admin'))"
              @click="generateAssignments"
              variant="primary"
              :loading="generating"
            >
              Generate Assignments
            </Button>
            <!-- Everyone can view their own assignment once generated -->
            <Button
              v-if="event.hasAssignments"
              @click="viewMyAssignment"
              variant="accent"
            >
              View My Assignment
            </Button>
          </div>
        </div>

        <!-- Different messages based on role and assignment status -->
        <div v-if="!event.hasAssignments" class="no-assignments">
          <p v-if="authStore.hasRole('organizer') || authStore.hasRole('admin')">
            Assignments haven't been generated yet. Add at least 2 participants and click "Generate Assignments" to start the Secret Santa fun! 🎄
          </p>
          <p v-else>
            Assignments haven't been generated yet. The organizer will generate them when ready. You'll receive an email notification! 📧
          </p>
        </div>

        <div v-else class="assignments-ready">
          <p>🎄 Secret Santa assignments have been generated!</p>
          <p v-if="authStore.hasRole('organizer') || authStore.hasRole('admin')">
            All participants have been notified via email. Click "View My Assignment" to see who you're buying a gift for.
          </p>
          <p v-else>
            Check your email for your assignment! Or click "View My Assignment" to see who you're buying a gift for.
          </p>
        </div>

        <div v-if="assignmentMessage" :class="['assignment-message', isErrorMessage ? 'error' : '']">
          {{ assignmentMessage }}
        </div>
      </section>

      <!-- Edit Event Modal -->
      <div v-if="showEditModal" class="modal-overlay" @click="showEditModal = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Edit Event</h3>
            <button class="modal-close" @click="showEditModal = false">&times;</button>
          </div>
          <form @submit.prevent="handleUpdateEvent" class="modal-body">
            <div class="form-group">
              <label for="event-name">Event Name</label>
              <input
                id="event-name"
                v-model="editForm.name"
                type="text"
                required
                maxlength="255"
                :disabled="updatingEvent"
                placeholder="Enter event name"
              />
            </div>
            <div class="modal-actions">
              <Button
                type="button"
                @click="showEditModal = false"
                variant="outline"
                :disabled="updatingEvent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                :loading="updatingEvent"
                :disabled="!editForm.name.trim()"
              >
                Update Event
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <ChristmasGiftModal :message="modalMessage" :isVisible="showModal" @close="closeModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useEventStore } from '@/stores/events';
import { useAuthStore } from '@/stores/auth';
import Button from '@/components/ui/Button.vue';
import ChristmasGiftModal from '@/components/ui/ChristmasGiftModal.vue';
import type { Event } from '@/types/domain';
import type { Participant as ApiParticipant } from '@/types/api';

const route = useRoute();
const router = useRouter();
const eventStore = useEventStore();
const authStore = useAuthStore();

const event = ref<Event | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

// Participants
const showAddParticipant = ref(false);
const newParticipant = ref({
  name: '',
  email: '',
  phone: '',
  groupId: ''
});
const addingParticipant = ref(false);

// Rules
const showRulesForm = ref(false);
const rulesForm = ref({
  avoidSameGroup: false,
  maxShuffleAttempts: 1000,
  avoidPreviousAssignments: false
});
const updatingRules = ref(false);

// Edit Event
const showEditModal = ref(false);
const editForm = ref({
  name: ''
});
const updatingEvent = ref(false);

// Assignments
const generating = ref(false);
const assignmentMessage = ref('');
const isErrorMessage = ref(false);
const showModal = ref(false);
const modalMessage = ref('');

const eventId = route.params.id as string;

const loadEvent = async () => {
  loading.value = true;
  error.value = null;
  try {
    event.value = await eventStore.fetchEvent(eventId);
    if (event.value) {
      // Initialize rules form
      rulesForm.value = {
        avoidSameGroup: event.value.rules?.avoidSameGroup || false,
        maxShuffleAttempts: event.value.rules?.maxShuffleAttempts || 1000,
        avoidPreviousAssignments: event.value.rules?.avoidPreviousAssignments || false
      };
      // Initialize edit form
      editForm.value.name = event.value.name;
    }
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push('/events');
};

const handleUpdateEvent = async () => {
  if (!event.value || !editForm.value.name.trim()) return;

  updatingEvent.value = true;
  try {
    await eventStore.updateEvent(eventId, editForm.value.name.trim());
    showEditModal.value = false;
    await loadEvent(); // Reload to get updated name
  } catch (err) {
    // Error handled by store
  } finally {
    updatingEvent.value = false;
  }
};

const handleAddParticipant = async () => {
  if (!event.value || !newParticipant.value.name.trim() || !newParticipant.value.email.trim()) return;

  addingParticipant.value = true;
  try {
    await eventStore.addParticipant(eventId, {
      name: newParticipant.value.name.trim(),
      email: newParticipant.value.email.trim(),
      phone: newParticipant.value.phone.trim() || undefined,
      groupId: newParticipant.value.groupId.trim() || undefined
    });

    // Reset form
    newParticipant.value = { name: '', email: '', phone: '', groupId: '' };
    showAddParticipant.value = false;

    // Reload event to get updated participants
    await loadEvent();
  } catch (err) {
    // Error handled by store
  } finally {
    addingParticipant.value = false;
  }
};

const removeParticipant = async (participant: ApiParticipant) => {
  if (!event.value || !confirm(`Remove ${participant.name} from this event?`)) return;

  try {
    await eventStore.deleteParticipant(eventId, participant.id);
    await loadEvent(); // Reload to update the list
  } catch (err) {
    // Error handled by store
  }
};

const handleUpdateRules = async () => {
  if (!event.value) return;

  updatingRules.value = true;
  try {
    await eventStore.updateRules(eventId, rulesForm.value);
    showRulesForm.value = false;
    await loadEvent(); // Reload to get updated rules
  } catch (err) {
    // Error handled by store
  } finally {
    updatingRules.value = false;
  }
};

const generateAssignments = async () => {
  if (!event.value) return;

  generating.value = true;
  assignmentMessage.value = '';
  isErrorMessage.value = false;
  try {
    const result = await eventStore.generateAssignments(eventId);
    assignmentMessage.value = result.message;
    isErrorMessage.value = false;
    await loadEvent(); // Reload to update assignment status
  } catch (err) {
    const errorMessage = (err as Error).message;
    isErrorMessage.value = true;

    // Provide better error messages for common issues
    if (errorMessage.includes('ImpossibleAssignmentError') ||
        errorMessage.includes('No valid assignment could be found')) {
      assignmentMessage.value =
        '❌ Cannot generate assignments with current rules and participants.\n\n' +
        'This usually happens when:\n' +
        '• Too many participants are in the same group with "Avoid Same Group" enabled\n' +
        '• Group restrictions make it mathematically impossible to create valid assignments\n\n' +
        'Solutions:\n' +
        '• Disable "Avoid Same Group" rule\n' +
        '• Add more participants outside the restricted groups\n' +
        '• Reorganize participants into smaller or different groups';
    } else {
      assignmentMessage.value = errorMessage;
    }
  } finally {
    generating.value = false;
  }
};

const viewMyAssignment = async () => {
  try {
    const assignments = await eventStore.fetchMyAssignment();
    const eventAssignment = assignments.find(a => a.eventId === eventId);

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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

onMounted(() => {
  loadEvent();
});
</script>

<style scoped>
.event-detail-page {
  max-width: var(--max-width-xl);
  margin: 0 auto;
}

.loading-state,
.error-state {
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

.event-content {
  padding: var(--space-xl) 0;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-2xl);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--color-gray-200);
}

.header-info h1 {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 var(--space-sm) 0;
}

.event-meta {
  display: flex;
  gap: var(--space-lg);
  flex-wrap: wrap;
}

.meta-item {
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
}

.header-actions {
  display: flex;
  gap: var(--space-md);
}

.section {
  margin-bottom: var(--space-2xl);
  padding: var(--space-xl);
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-gray-200);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.section-header h2 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
}

/* Participants */
.add-form {
  margin-bottom: var(--space-xl);
  padding: var(--space-lg);
  background: var(--color-gray-50);
  border-radius: var(--radius-md);
}

.participant-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.form-group label {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-gray-700);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.form-group input {
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

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--space-md);
}

.participants-list {
  display: grid;
  gap: var(--space-md);
}

.participant-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  background: var(--color-white);
  transition: box-shadow 0.2s ease;
}

.participant-card:hover {
  box-shadow: var(--shadow-md);
}

.participant-info h4 {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-primary);
  margin: 0 0 var(--space-xs) 0;
}

.participant-info p {
  margin: 0;
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
}

.participant-info .phone,
.participant-info .group {
  color: var(--color-gray-500);
  font-size: var(--font-size-xs);
  margin-top: var(--space-xs);
}

.participant-actions {
  display: flex;
  gap: var(--space-sm);
}

/* Rules */
.rules-display {
  display: grid;
  gap: var(--space-sm);
}

.rule-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm) 0;
  border-bottom: 1px solid var(--color-gray-100);
}

.rule-item:last-child {
  border-bottom: none;
}

.rule-label {
  font-weight: 500;
  color: var(--color-gray-700);
}

.rule-value {
  font-weight: 600;
  color: var(--color-primary);
}

.rules-form {
  padding: var(--space-lg);
  background: var(--color-gray-50);
  border-radius: var(--radius-md);
}

.rules-edit-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
  font-weight: 500;
  color: var(--color-gray-700);
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin: 0;
}

/* Assignments */
.assignment-actions {
  display: flex;
  gap: var(--space-md);
}

.no-assignments,
.assignments-ready {
  padding: var(--space-lg);
  background: var(--color-gray-50);
  border-radius: var(--radius-md);
  text-align: center;
}

.no-assignments p,
.assignments-ready p {
  margin: 0;
  color: var(--color-gray-600);
}

.assignment-message {
  margin-top: var(--space-md);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  font-weight: 500;
  white-space: pre-line;
}

.assignment-message {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.assignment-message.error {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 500px;
  width: 90%;
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

.modal-close {
  background: none;
  border: none;
  font-size: var(--font-size-xl);
  cursor: pointer;
  color: var(--color-gray-500);
  padding: var(--space-xs);
  border-radius: var(--radius-sm);
  transition: color 0.2s ease;
}

.modal-close:hover {
  color: var(--color-primary);
}

.modal-body {
  padding: var(--space-lg);
}

.modal-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: flex-end;
  margin-top: var(--space-lg);
}

/* Responsive */
@media (max-width: 768px) {
  .event-header {
    flex-direction: column;
    gap: var(--space-lg);
    align-items: stretch;
  }

  .header-actions {
    justify-content: stretch;
  }

  .section-header {
    flex-direction: column;
    gap: var(--space-md);
    align-items: stretch;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .participant-card {
    flex-direction: column;
    gap: var(--space-md);
    align-items: stretch;
  }

  .participant-actions {
    justify-content: center;
  }
}
</style>