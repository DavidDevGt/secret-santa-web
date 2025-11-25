<template>
  <div class="not-found">
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <router-link to="/" class="home-link">Go Home</router-link>
  </div>
</template>

<script setup lang="ts">
// Not Found page component
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: var(--space-2xl) var(--space-xl);
  max-width: var(--max-width-md);
  margin: 0 auto;
}

.not-found h1 {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 var(--space-lg) 0;
  letter-spacing: -0.025em;
}

.not-found p {
  color: var(--color-gray-600);
  font-size: var(--font-size-lg);
  margin: 0 0 var(--space-2xl) 0;
  line-height: 1.6;
}

.home-link {
  display: inline-block;
  background-color: var(--color-primary);
  color: var(--color-white);
  padding: var(--space-md) var(--space-xl);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: 500;
  font-size: var(--font-size-base);
  transition: all 0.2s ease;
  box-shadow: var(--shadow-md);
}

.home-link:hover {
  background-color: var(--color-primary-light);
  box-shadow: var(--shadow-lg);
  transform: translateY(-1px);
}
</style>