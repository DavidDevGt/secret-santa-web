<template>
  <div class="register">
    <h2>Register</h2>
    <form v-if="!showOtp" @submit.prevent="handleRegister">
      <div>
        <label for="name">Name:</label>
        <input
          id="name"
          v-model="name"
          type="text"
          required
        />
      </div>
      <div>
        <label for="email">Email:</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
        />
      </div>
      <div>
        <label for="password">Password:</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
        />
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
const otp = ref('');
const showOtp = ref(false);
const loading = ref(false);
const error = ref('');

const handleRegister = async () => {
  loading.value = true;
  error.value = '';
  try {
    await authStore.register(name.value, email.value, password.value);
    showOtp.value = true;
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
};

const handleVerifyOtp = async () => {
  loading.value = true;
  error.value = '';
  try {
    await authStore.verifyOtp(email.value, otp.value);
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

button {
  padding: 0.5rem 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>