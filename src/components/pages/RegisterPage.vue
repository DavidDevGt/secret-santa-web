<template>
  <div class="register-page">
    <div class="register-container">
      <h2>{{ showOtp ? 'Verify Your Email' : 'Create Account' }}</h2>

      <!-- Registration Form -->
      <form v-if="!showOtp" @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            :disabled="loading"
            placeholder="Enter your full name"
            maxlength="255"
          />
        </div>

        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            :disabled="loading"
            placeholder="Enter your email address"
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
            placeholder="Create a password (8+ characters)"
            minlength="8"
            maxlength="255"
          />
          <small class="form-hint">Must be at least 8 characters long</small>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          :loading="loading"
          :disabled="!isFormValid"
          full-width
        >
          Create Account
        </Button>
      </form>

      <!-- OTP Verification Form -->
      <div v-else class="otp-section">
        <div class="otp-info">
          <p>We've sent a verification code to:</p>
          <p class="email-display">{{ form.email }}</p>
          <p>Please check your email and enter the 6-digit code below.</p>
        </div>

        <form @submit.prevent="handleVerifyOtp" class="otp-form">
          <div class="form-group">
            <label for="otp">Verification Code</label>
            <input
              id="otp"
              v-model="otp"
              type="text"
              required
              :disabled="verifying"
              placeholder="000000"
              maxlength="6"
              pattern="[0-9]{6}"
              class="otp-input"
            />
            <small class="form-hint">Enter the 6-digit code from your email</small>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            :loading="verifying"
            :disabled="!otp || otp.length !== 6"
            full-width
          >
            Verify & Sign In
          </Button>
        </form>

        <div class="otp-actions">
          <Button
            @click="resendOtp"
            variant="outline"
            :disabled="resendDisabled || loading"
          >
            {{ resendDisabled ? `Resend in ${resendCountdown}s` : 'Resend Code' }}
          </Button>
        </div>
      </div>

      <!-- Navigation -->
      <div class="auth-links">
        <p v-if="!showOtp">
          Already have an account?
          <router-link to="/auth/login">Sign in</router-link>
        </p>
        <p v-else>
          Wrong email?
          <button @click="resetRegistration" class="link-button">Start over</button>
        </p>
      </div>

      <!-- Error Messages -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- Success Messages -->
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Button from '@/components/ui/Button.vue';
import type { RegisterForm } from '@/types/domain';

const router = useRouter();
const authStore = useAuthStore();

const form = ref<RegisterForm>({
  name: '',
  email: '',
  password: ''
});

const otp = ref('');
const showOtp = ref(false);
const loading = ref(false);
const verifying = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

// Resend OTP functionality
const resendDisabled = ref(false);
const resendCountdown = ref(0);
let countdownInterval: number | null = null;

const isFormValid = computed(() => {
  return form.value.name.trim().length >= 1 &&
         form.value.email.includes('@') &&
         form.value.password.length >= 8;
});

const handleRegister = async () => {
  if (!isFormValid.value || loading.value) return; // Prevent duplicate submissions

  loading.value = true;
  error.value = null;
  successMessage.value = null;

  try {
    await authStore.register({
      name: form.value.name.trim(),
      email: form.value.email.trim(),
      password: form.value.password
    });

    successMessage.value = 'Account created! Please check your email for the verification code.';
    showOtp.value = true;
    startResendCountdown();
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
};

const handleVerifyOtp = async () => {
  if (!otp.value || otp.value.length !== 6 || verifying.value) return; // Prevent duplicate submissions

  verifying.value = true;
  error.value = null;

  try {
    await authStore.verifyOtp({ email: form.value.email.trim(), otp: otp.value });
    router.push('/');
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    verifying.value = false;
  }
};

const resendOtp = async () => {
  if (loading.value) return; // Prevent duplicate submissions

  loading.value = true;
  error.value = null;

  try {
    await authStore.register({
      name: form.value.name.trim(),
      email: form.value.email.trim(),
      password: form.value.password
    });

    successMessage.value = 'New verification code sent! Please check your email.';
    startResendCountdown();
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
};

const startResendCountdown = () => {
  resendDisabled.value = true;
  resendCountdown.value = 60; // 60 seconds

  countdownInterval = setInterval(() => {
    resendCountdown.value--;
    if (resendCountdown.value <= 0) {
      resendDisabled.value = false;
      if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
      }
    }
  }, 1000);
};

const resetRegistration = () => {
  showOtp.value = false;
  otp.value = '';
  error.value = null;
  successMessage.value = null;
  resendDisabled.value = false;
  resendCountdown.value = 0;
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
};

onMounted(() => {
  // Clear any existing auth state when visiting register page
  if (authStore.isAuthenticated) {
    authStore.logout();
  }
});
</script>

<style scoped>
.register-page {
  width: 100%;
}

.register-container {
  max-width: 400px;
  margin: 0 auto;
}

.register-page h2 {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  color: var(--color-primary);
  margin: 0 0 var(--space-xl) 0;
  text-align: center;
}

.register-form,
.otp-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
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

.otp-input {
  text-align: center;
  font-size: var(--font-size-xl);
  font-weight: 600;
  letter-spacing: 0.5rem;
  font-family: 'Monaco', 'Menlo', monospace;
}

.otp-section {
  text-align: center;
}

.otp-info {
  margin-bottom: var(--space-xl);
}

.otp-info p {
  margin: var(--space-sm) 0;
  color: var(--color-gray-600);
}

.email-display {
  font-weight: 600;
  color: var(--color-primary);
  font-size: var(--font-size-lg);
}

.otp-actions {
  margin-top: var(--space-lg);
}

.auth-links {
  margin-top: var(--space-xl);
  text-align: center;
  padding-top: var(--space-lg);
  border-top: 1px solid var(--color-gray-200);
}

.auth-links p {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
}

.auth-links a,
.link-button {
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  background: none;
  border: none;
  font-size: inherit;
  transition: color 0.2s ease;
}

.auth-links a:hover,
.link-button:hover {
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

.success-message {
  margin-top: var(--space-lg);
  padding: var(--space-md);
  background-color: rgba(16, 185, 129, 0.05);
  border: 1px solid rgba(16, 185, 129, 0.1);
  border-radius: var(--radius-md);
  color: var(--color-success);
  font-size: var(--font-size-sm);
  text-align: center;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 480px) {
  .register-container {
    padding: 0 var(--space-md);
  }

  .otp-input {
    font-size: var(--font-size-lg);
    letter-spacing: 0.3rem;
  }
}
</style>