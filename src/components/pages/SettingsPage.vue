<template>
  <div class="settings-page">
    <div class="page-header">
      <h1>Account Settings</h1>
      <p>Manage your account preferences and profile information</p>
    </div>

    <div class="settings-content">
      <!-- Profile Section -->
      <div class="settings-section">
        <div class="section-header">
          <h2>Profile Information</h2>
          <p>Update your personal details and contact information</p>
        </div>

        <div class="section-content">
          <form @submit.prevent="updateProfile" class="profile-form">
            <div class="form-row">
              <div class="form-group">
                <label for="name">Full Name</label>
                <input
                  id="name"
                  v-model="profileForm.name"
                  type="text"
                  required
                  maxlength="255"
                  :disabled="updating"
                  placeholder="Enter your full name"
                />
              </div>

              <div class="form-group">
                <label for="email">Email Address</label>
                <input
                  id="email"
                  v-model="profileForm.email"
                  type="email"
                  required
                  maxlength="255"
                  :disabled="updating"
                  placeholder="Enter your email"
                />
                <small class="form-help">
                  Used for notifications and account recovery
                </small>
              </div>
            </div>

            <div class="form-actions">
              <Button
                type="submit"
                variant="primary"
                :loading="updating"
                :disabled="!hasChanges"
              >
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                @click="resetForm"
                :disabled="updating || !hasChanges"
              >
                Reset
              </Button>
            </div>
          </form>
        </div>
      </div>

      <!-- Account Status -->
      <div class="settings-section">
        <div class="section-header">
          <h2>Account Status</h2>
          <p>Your current account information</p>
        </div>

        <div class="section-content">
          <div class="status-grid">
            <div class="status-item">
              <div class="status-label">Account Type</div>
              <div class="status-value">{{ authStore.user?.role || 'N/A' }}</div>
            </div>

            <div class="status-item">
              <div class="status-label">Email Verified</div>
              <div class="status-value">
                <span :class="authStore.user?.isVerified ? 'status-verified' : 'status-unverified'">
                  {{ authStore.user?.isVerified ? '✓ Verified' : '⚠ Unverified' }}
                </span>
              </div>
            </div>


            <div class="status-item">
              <div class="status-label">Events Created</div>
              <div class="status-value">
                {{ eventStore.userEvents.filter(e => e.owner_id === authStore.user?.id).length }}
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>

    <!-- Success/Error Messages -->
    <div v-if="message" :class="['message', message.type]">
      {{ message.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useEventStore } from '@/stores/events';
import Button from '@/components/ui/Button.vue';

const authStore = useAuthStore();
const eventStore = useEventStore();

// Profile form
const profileForm = ref({
  name: '',
  email: ''
});

const originalProfile = ref({
  name: '',
  email: ''
});

const updating = ref(false);

// Message handling
const message = ref<{ type: 'success' | 'error'; text: string } | null>(null);

const hasChanges = computed(() => {
  return profileForm.value.name !== originalProfile.value.name ||
         profileForm.value.email !== originalProfile.value.email;
});

const updateProfile = async () => {
  if (!hasChanges.value) return;

  updating.value = true;
  message.value = null;

  try {
    // Here you would call an API endpoint to update the profile
    // Since the backend doesn't have this endpoint yet, we'll simulate it
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

    // Update the store (in a real app, this would come from the API response)
    if (authStore.user) {
      authStore.user.name = profileForm.value.name;
      authStore.user.email = profileForm.value.email;
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(authStore.user));
    }

    originalProfile.value = { ...profileForm.value };
    showMessage('success', 'Profile updated successfully!');
  } catch (error) {
    showMessage('error', 'Failed to update profile. Please try again.');
  } finally {
    updating.value = false;
  }
};

const resetForm = () => {
  profileForm.value = { ...originalProfile.value };
};


const showMessage = (type: 'success' | 'error', text: string) => {
  message.value = { type, text };
  setTimeout(() => {
    message.value = null;
  }, 5000);
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Never';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

onMounted(() => {
  // Initialize form with current user data
  if (authStore.user) {
    profileForm.value = {
      name: authStore.user.name,
      email: authStore.user.email
    };
    originalProfile.value = { ...profileForm.value };
  }

});
</script>

<style scoped>
.settings-page {
  max-width: var(--max-width-lg);
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
  margin: 0;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
}

.settings-section {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-gray-200);
  overflow: hidden;
}

.section-header {
  padding: var(--space-xl);
  border-bottom: 1px solid var(--color-gray-200);
  background: var(--color-gray-50);
}

.section-header h2 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-primary);
  margin: 0 0 var(--space-xs) 0;
}

.section-header p {
  color: var(--color-gray-600);
  margin: 0;
  font-size: var(--font-size-sm);
}

.section-content {
  padding: var(--space-xl);
}

.profile-form {
  max-width: 600px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-gray-700);
  margin-bottom: var(--space-sm);
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

.form-help {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
  margin-top: var(--space-xs);
}

.form-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: flex-start;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-lg);
}

.status-item {
  padding: var(--space-lg);
  background: var(--color-gray-50);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-gray-200);
}

.status-label {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-gray-700);
  margin-bottom: var(--space-xs);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-value {
  font-size: var(--font-size-base);
  color: var(--color-gray-900);
  font-weight: 500;
}

.status-verified {
  color: var(--color-success);
  font-weight: 600;
}

.status-unverified {
  color: var(--color-warning);
  font-weight: 600;
}

.preferences-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg);
  background: var(--color-gray-50);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-gray-200);
}

.preference-content {
  flex: 1;
  margin-right: var(--space-lg);
}

.preference-content h4 {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-primary);
  margin: 0 0 var(--space-xs) 0;
}

.preference-content p {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  margin: 0;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-gray-300);
  transition: 0.3s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

.toggle input:checked + .toggle-slider {
  background-color: var(--color-accent);
}

.toggle input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.data-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2xl);
}

.action-group {
  padding: var(--space-lg);
  background: var(--color-gray-50);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-gray-200);
}

.action-group h4 {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-primary);
  margin: 0 0 var(--space-xs) 0;
}

.action-group p {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  margin: 0 0 var(--space-lg) 0;
}

.action-group.danger {
  background: rgba(239, 68, 68, 0.05);
  border-color: rgba(239, 68, 68, 0.2);
}

.message {
  position: fixed;
  top: var(--space-xl);
  right: var(--space-xl);
  padding: var(--space-lg);
  border-radius: var(--radius-md);
  font-weight: 500;
  z-index: 1000;
  max-width: 400px;
  box-shadow: var(--shadow-lg);
}

.message.success {
  background: var(--color-success);
  color: white;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.message.error {
  background: var(--color-error);
  color: white;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .status-grid {
    grid-template-columns: 1fr;
  }

  .data-actions {
    grid-template-columns: 1fr;
  }

  .preference-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-md);
  }

  .preference-content {
    margin-right: 0;
  }

  .message {
    left: var(--space-md);
    right: var(--space-md);
    max-width: none;
  }
}
</style>