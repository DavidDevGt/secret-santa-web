<template>
  <div class="register">
    <h2>Register</h2>
    <form v-if="!showOtp" @submit.prevent="handleRegister" class="register-form">
      <div class="form-row">
        <div class="form-group">
          <label for="name">Name:</label>
          <input
            id="name"
            v-model="name"
            type="text"
            required
          />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
          />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label for="password">Password:</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
          />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm Password:</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
          />
        </div>
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Registering...' : 'Register' }}
      </button>
    </form>
    <form v-else @submit.prevent="handleVerifyOtp">
      <p>Please check your email for the OTP code.</p>
      <div>
        <label for="otp">OTP Code:</label>
        <input
          id="otp"
          v-model="otp"
          type="text"
          required
        />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Verifying...' : 'Verify OTP' }}
      </button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="!showOtp">
      Already have an account?
      <button @click="$emit('switch-to-login')">Login</button>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const otp = ref('');
const showOtp = ref(false);
const loading = ref(false);
const error = ref('');

const handleRegister = async () => {
  if (loading.value) return; // Prevent duplicate submissions

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match';
    return;
  }

  loading.value = true;
  error.value = '';
  try {
    await authStore.register({ name: name.value, email: email.value, password: password.value });
    showOtp.value = true;
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
};

const handleVerifyOtp = async () => {
  if (loading.value) return; // Prevent duplicate submissions

  loading.value = true;
  error.value = '';
  try {
    await authStore.verifyOtp({ email: email.value, otp: otp.value });
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
};

defineEmits<{
  'switch-to-login': [];
}>();
</script>

<style scoped>
.register {
  max-width: 600px;
  margin: 0 auto;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

button {
  padding: 0.75rem 1.5rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  align-self: flex-start;
  margin-top: 0.5rem;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 1rem;
  font-weight: 500;
}

/* Responsive design */
@media (max-width: 640px) {
  .register {
    max-width: 100%;
    padding: 0 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}
</style>