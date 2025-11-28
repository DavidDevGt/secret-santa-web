<template>
  <div class="error-boundary">
    <div v-if="hasError" class="error-content">
      <h2>Oops! Something went wrong</h2>
      <p>{{ error?.message || 'An unexpected error occurred' }}</p>
      <Button @click="resetError">Try Again</Button>
      <details v-if="error?.stack" class="error-details">
        <summary>Error Details (for developers)</summary>
        <pre>{{ error.stack }}</pre>
      </details>
    </div>
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';
import Button from './Button.vue';
import { logger } from '@/utils/logger';

const hasError = ref(false);
const error = ref<Error | null>(null);

const resetError = () => {
  hasError.value = false;
  error.value = null;
};

onErrorCaptured((err) => {
  hasError.value = true;
  error.value = err as Error;
  logger.error('Error boundary caught an error', { error: err });
  return false; // Prevent the error from propagating further
});
</script>

<style scoped>
.error-boundary {
  width: 100%;
  height: 100%;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
  text-align: center;
}

.error-content h2 {
  color: #dc2626;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0 1rem 0;
}

.error-content p {
  color: #6b7280;
  margin: 0 0 2rem 0;
  max-width: 500px;
}

.error-details {
  margin-top: 2rem;
  text-align: left;
  max-width: 800px;
}

.error-details pre {
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>