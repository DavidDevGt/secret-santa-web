<template>
  <div class="auth-layout">
    <div class="auth-container">
      <div class="auth-header">
        <h1 class="auth-title">Secret Santa</h1>
        <p class="auth-subtitle">Organize your gift exchanges with ease</p>
      </div>
      <div class="auth-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Auth layout component
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  padding: var(--space-md);
}

.auth-container {
  width: 100%;
  max-width: 400px;
  background: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  border: 1px solid var(--color-gray-200);
}

.auth-header {
  background: var(--color-white);
  padding: var(--space-2xl) var(--space-2xl) var(--space-lg);
  text-align: center;
  border-bottom: 1px solid var(--color-gray-200);
}

.auth-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 var(--space-sm) 0;
  letter-spacing: -0.025em;
}

.auth-subtitle {
  color: var(--color-gray-600);
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: 400;
}

.auth-content {
  padding: var(--space-2xl);
}

/* Responsive for laptops */
@media (max-width: 1440px) {
  .auth-layout {
    padding: var(--space-lg);
  }

  .auth-content {
    padding: var(--space-xl);
  }
}
</style>