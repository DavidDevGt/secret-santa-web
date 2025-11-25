<template>
  <div class="event-create">
    <div class="create-header">
      <h1>Create New Event</h1>
      <p>Set up a new Secret Santa event for your group</p>
    </div>

    <div class="create-form-container">
      <form @submit.prevent="handleSubmit" class="event-form">
        <div class="form-group">
          <label for="name">Event Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            :disabled="loading"
            placeholder="Enter event name"
            maxlength="255"
          />
          <small class="form-hint">Choose a descriptive name for your Secret Santa event</small>
        </div>

        <div class="form-actions">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            :loading="loading"
            :disabled="!form.name.trim()"
          >
            Create Event
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            @click="goBack"
            :disabled="loading"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useEventStore } from '@/stores/events';
import Button from '@/components/ui/Button.vue';
import type { EventForm } from '@/types/domain';

const router = useRouter();
const eventStore = useEventStore();

const form = ref<EventForm>({
  name: ''
});

const loading = ref(false);
const error = ref<string | null>(null);

const handleSubmit = async () => {
  if (!form.value.name.trim()) return;

  loading.value = true;
  error.value = null;

  try {
    const newEvent = await eventStore.createEvent(form.value.name.trim());
    router.push(`/events/${newEvent.id}`);
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push('/events');
};
</script>

<style scoped>
.event-create {
  max-width: var(--max-width-md);
  margin: 0 auto;
}

.create-header {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.create-header h1 {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 var(--space-sm) 0;
  letter-spacing: -0.025em;
}

.create-header p {
  color: var(--color-gray-600);
  font-size: var(--font-size-lg);
  margin: 0;
}

.create-form-container {
  background: var(--color-white);
  padding: var(--space-2xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-gray-200);
}

.event-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
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
  letter-spacing: 0.025em;
  text-transform: uppercase;
}

.form-group input {
  padding: var(--space-lg);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  background-color: var(--color-white);
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.form-group input:disabled {
  background-color: var(--color-gray-50);
  cursor: not-allowed;
  opacity: 0.7;
}

.form-hint {
  color: var(--color-gray-500);
  font-size: var(--font-size-sm);
  margin-top: var(--space-xs);
}

.form-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  margin-top: var(--space-lg);
}

.error-message {
  margin-top: var(--space-lg);
  padding: var(--space-md);
  background-color: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.1);
  border-radius: var(--radius-md);
  color: var(--color-error);
  font-size: var(--font-size-sm);
  text-align: center;
  font-weight: 500;
}
</style>