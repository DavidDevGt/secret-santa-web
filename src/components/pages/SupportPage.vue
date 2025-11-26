<template>
  <div class="support-page">
    <div class="page-header">
      <h1>Contact Support</h1>
      <p>We're here to help! Get in touch with our support team</p>
    </div>

    <div class="support-content">
      <!-- Support Options -->
      <div class="support-options">
        <div class="option-card">
          <div class="option-icon">💬</div>
          <h3>Contact Form</h3>
          <p>Send us a message and we'll get back to you within 24 hours</p>
        </div>

        <div class="option-card">
          <div class="option-icon">📧</div>
          <h3>Email Support</h3>
          <p>For urgent issues, email us directly at support@secretsanta.com</p>
        </div>

        <div class="option-card">
          <div class="option-icon">📚</div>
          <h3>Help Center</h3>
          <p>Browse our comprehensive help articles and FAQs</p>
          <router-link to="/help" class="option-link">Visit Help Center</router-link>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="contact-form-section">
        <h2>Send us a Message</h2>
        <form @submit.prevent="submitSupportRequest" class="support-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name">Your Name</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                :disabled="submitting"
                placeholder="Enter your full name"
              />
            </div>

            <div class="form-group">
              <label for="email">Email Address</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                :disabled="submitting"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="category">Category</label>
            <select
              id="category"
              v-model="form.category"
              required
              :disabled="submitting"
            >
              <option value="">Select a category</option>
              <option value="account">Account Issues</option>
              <option value="events">Event Management</option>
              <option value="assignments">Secret Santa Assignments</option>
              <option value="billing">Billing & Payments</option>
              <option value="technical">Technical Issues</option>
              <option value="feature">Feature Request</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div class="form-group">
            <label for="subject">Subject</label>
            <input
              id="subject"
              v-model="form.subject"
              type="text"
              required
              maxlength="100"
              :disabled="submitting"
              placeholder="Brief description of your issue"
            />
          </div>

          <div class="form-group">
            <label for="message">Message</label>
            <textarea
              id="message"
              v-model="form.message"
              required
              rows="6"
              maxlength="1000"
              :disabled="submitting"
              placeholder="Describe your issue in detail. Include any error messages, steps to reproduce, and what you were trying to do."
            ></textarea>
            <small class="char-count">{{ form.message.length }}/1000 characters</small>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input
                type="checkbox"
                v-model="form.includeLogs"
                :disabled="submitting"
              />
              <span>Include browser console logs (helps with technical issues)</span>
            </label>
          </div>

          <div class="form-actions">
            <Button type="submit" variant="primary" :loading="submitting">
              Send Message
            </Button>
            <Button type="button" variant="outline" @click="resetForm" :disabled="submitting">
              Clear Form
            </Button>
          </div>
        </form>
      </div>

      <!-- FAQ Section -->
      <div class="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div class="faq-grid">
          <div class="faq-item">
            <h4>How quickly will I get a response?</h4>
            <p>We typically respond within 24 hours during business days. For urgent technical issues, we aim to respond within 4 hours.</p>
          </div>

          <div class="faq-item">
            <h4>What information should I include?</h4>
            <p>Please include your account email, event details, error messages, and steps to reproduce any issues you're experiencing.</p>
          </div>

          <div class="faq-item">
            <h4>Do you offer phone support?</h4>
            <p>Currently, we provide support through email and our help center. Phone support may be available for enterprise customers.</p>
          </div>

          <div class="faq-item">
            <h4>How do I report a bug?</h4>
            <p>Use the contact form above with the "Technical Issues" category. Include detailed steps to reproduce the bug.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="showSuccess" class="success-message">
      <div class="success-content">
        <div class="success-icon">✅</div>
        <h3>Message Sent Successfully!</h3>
        <p>Thank you for contacting us. We've received your message and will get back to you within 24 hours.</p>
        <p><strong>Reference ID:</strong> {{ referenceId }}</p>
        <Button @click="showSuccess = false" variant="outline">Close</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from '@/components/ui/Button.vue';

const submitting = ref(false);
const showSuccess = ref(false);
const referenceId = ref('');

const form = ref({
  name: '',
  email: '',
  category: '',
  subject: '',
  message: '',
  includeLogs: false
});

const submitSupportRequest = async () => {
  if (!validateForm()) return;

  submitting.value = true;

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate reference ID
    referenceId.value = 'SS-' + Date.now().toString().slice(-6);

    // Reset form and show success
    resetForm();
    showSuccess.value = true;

  } catch (error) {
    alert('Failed to send message. Please try again or contact support@secretsanta.com directly.');
  } finally {
    submitting.value = false;
  }
};

const validateForm = (): boolean => {
  if (!form.value.name.trim()) {
    alert('Please enter your name');
    return false;
  }

  if (!form.value.email.trim() || !isValidEmail(form.value.email)) {
    alert('Please enter a valid email address');
    return false;
  }

  if (!form.value.category) {
    alert('Please select a category');
    return false;
  }

  if (!form.value.subject.trim()) {
    alert('Please enter a subject');
    return false;
  }

  if (!form.value.message.trim()) {
    alert('Please enter a message');
    return false;
  }

  return true;
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const resetForm = () => {
  form.value = {
    name: '',
    email: '',
    category: '',
    subject: '',
    message: '',
    includeLogs: false
  };
};
</script>

<style scoped>
.support-page {
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

.support-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-3xl);
}

.support-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-xl);
}

.option-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-gray-200);
  text-align: center;
  transition: all 0.2s ease;
}

.option-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.option-icon {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--space-md);
}

.option-card h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-primary);
  margin: 0 0 var(--space-sm) 0;
}

.option-card p {
  color: var(--color-gray-600);
  margin: 0 0 var(--space-md) 0;
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

.option-link {
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 500;
  font-size: var(--font-size-sm);
}

.option-link:hover {
  text-decoration: underline;
}

.contact-form-section {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-gray-200);
  margin-top: var(--space-xl);
}

.contact-form-section h2 {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 var(--space-xl) 0;
}

.support-form {
  max-width: 800px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);
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

.form-group input,
.form-group select,
.form-group textarea {
  padding: var(--space-md);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.form-group input:disabled,
.form-group select:disabled,
.form-group textarea:disabled {
  background-color: var(--color-gray-50);
  cursor: not-allowed;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.char-count {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
  margin-top: var(--space-xs);
  text-align: right;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
  cursor: pointer;
}

.checkbox-label input {
  margin-top: 2px;
  flex-shrink: 0;
}

.form-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: flex-start;
  margin-top: var(--space-xl);
}

.faq-section {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-gray-200);
  margin-top: var(--space-xl);
}

.faq-section h2 {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 var(--space-xl) 0;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-lg);
}

.faq-item {
  background: var(--color-gray-50);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  border: 1px solid var(--color-gray-200);
}

.faq-item h4 {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-primary);
  margin: 0 0 var(--space-sm) 0;
}

.faq-item p {
  color: var(--color-gray-600);
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

.success-message {
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

.success-content {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
  box-shadow: var(--shadow-xl);
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.success-icon {
  font-size: var(--font-size-4xl);
  margin-bottom: var(--space-lg);
}

.success-content h3 {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 var(--space-md) 0;
}

.success-content p {
  color: var(--color-gray-600);
  margin: 0 0 var(--space-lg) 0;
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 768px) {
  .support-options {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .faq-grid {
    grid-template-columns: 1fr;
  }

  .contact-form-section {
    padding: var(--space-xl);
  }

  .success-content {
    margin: var(--space-md);
  }
}
</style>