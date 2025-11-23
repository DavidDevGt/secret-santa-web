<template>
  <div class="event-form">
    <h2>{{ isEditing ? 'Edit Event' : 'Create New Event' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="name">Event Name:</label>
        <input
          id="name"
          v-model="name"
          type="text"
          required
          maxlength="255"
        />
      </div>
      <div class="form-actions">
        <button type="submit" :disabled="loading">
          {{ loading ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
        </button>
        <button type="button" @click="$emit('cancel')">Cancel</button>
      </div>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useEventStore } from '@/stores/event';

interface Props {
  eventId?: string;
}

const props = defineProps<Props>();

const eventStore = useEventStore();

const name = ref('');
const loading = ref(false);
const error = ref('');
const isEditing = ref(false);

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';
  try {
    if (isEditing.value && props.eventId) {
      await eventStore.updateEvent(props.eventId, name.value);
      $emit('updated');
    } else {
      await eventStore.createEvent(name.value);
      $emit('created');
    }
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
};

const loadEvent = async () => {
  if (props.eventId) {
    isEditing.value = true;
    loading.value = true;
    try {
      const event = await eventStore.fetchEvent(props.eventId);
      name.value = event.name;
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      loading.value = false;
    }
  }
};

onMounted(() => {
  loadEvent();
});

const $emit = defineEmits<{
  created: [];
  updated: [];
  cancel: [];
}>();
</script>

<style scoped>
.event-form {
  max-width: 400px;
  margin: 0 auto;
}

form div {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

button {
  padding: 0.5rem 1rem;
  border: 1px solid #007bff;
  background-color: white;
  color: #007bff;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"] {
  background-color: #007bff;
  color: white;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  border-color: #ccc;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>