<template>
  <div class="login-page">
    <h2>Sign In</h2>
    <form @submit.prevent="handleSubmit" class="login-form">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          :disabled="loading"
          placeholder="Enter your email"
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          :disabled="loading"
          placeholder="Enter your password"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        :loading="loading"
        full-width
      >
        Sign In
      </Button>
    </form>

    <div class="auth-links">
      <p>
        Don't have an account?
        <router-link to="/auth/register">Sign up</router-link>
      </p>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Button from '@/components/ui/Button.vue';
import type { LoginForm } from '@/types/domain';

const router = useRouter();
const authStore = useAuthStore();

const form = ref<LoginForm>({
  email: '',
  password: ''
});

const loading = ref(false);
const error = ref<string | null>(null);

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;

  try {
    await authStore.login(form.value);
    router.push('/');
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  width: 100%;
}

.login-page h2 {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--color-primary);
  margin: 0 0 var(--space-xl) 0;
  text-align: center;
  letter-spacing: -0.025em;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.form-group label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-gray-700);
  letter-spacing: 0.025em;
  text-transform: uppercase;
}

.form-group input {
  padding: var(--space-md);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  background-color: var(--color-white);
  transition: all 0.2s ease;
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

.auth-links {
  margin-top: var(--space-xl);
  text-align: center;
}

.auth-links p {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
}

.auth-links a {
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.auth-links a:hover {
  color: var(--color-accent-dark);
  text-decoration: underline;
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