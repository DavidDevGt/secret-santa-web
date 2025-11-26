<template>
  <div class="not-found">
    <div class="snowflakes">
      <div class="snowflake">❄</div>
      <div class="snowflake">❄</div>
      <div class="snowflake">❄</div>
      <div class="snowflake">❄</div>
      <div class="snowflake">❄</div>
      <div class="snowflake">❄</div>
      <div class="snowflake">❄</div>
      <div class="snowflake">❄</div>
      <div class="snowflake">❄</div>
      <div class="snowflake">❄</div>
    </div>
    <div class="christmas-tree">🎄</div>
    <h1>404 - ¡Página No Encontrada!</h1>
    <p>Parece que te has perdido en el Polo Norte. ¡Regresa a casa para continuar con tu lista de regalos!</p>
    <router-link to="/" class="home-link">🏠 Ir al Inicio</router-link>
  </div>
</template>

<script setup lang="ts">
// Not Found page component
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: var(--space-2xl) var(--space-xl);
  background: linear-gradient(135deg, #d32f2f, #388e3c);
  position: relative;
  overflow: hidden;
  color: white;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.snowflakes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.snowflake {
  position: absolute;
  font-size: 2rem;
  color: white;
  animation: fall linear infinite;
  opacity: 0.8;
}

.snowflake:nth-child(1) { left: 10%; animation-duration: 10s; animation-delay: 0s; }
.snowflake:nth-child(2) { left: 20%; animation-duration: 12s; animation-delay: 1s; }
.snowflake:nth-child(3) { left: 30%; animation-duration: 8s; animation-delay: 2s; }
.snowflake:nth-child(4) { left: 40%; animation-duration: 14s; animation-delay: 0s; }
.snowflake:nth-child(5) { left: 50%; animation-duration: 11s; animation-delay: 3s; }
.snowflake:nth-child(6) { left: 60%; animation-duration: 9s; animation-delay: 1s; }
.snowflake:nth-child(7) { left: 70%; animation-duration: 13s; animation-delay: 2s; }
.snowflake:nth-child(8) { left: 80%; animation-duration: 10s; animation-delay: 0s; }
.snowflake:nth-child(9) { left: 90%; animation-duration: 12s; animation-delay: 4s; }
.snowflake:nth-child(10) { left: 95%; animation-duration: 8s; animation-delay: 1s; }

@keyframes fall {
  0% { top: -10%; transform: translateX(0) rotate(0deg); }
  100% { top: 110%; transform: translateX(50px) rotate(360deg); }
}

.christmas-tree {
  font-size: clamp(3rem, 10vw, 5rem);
  margin-bottom: var(--space-lg);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.not-found h1 {
  font-size: clamp(2rem, 5vw, var(--font-size-4xl));
  font-weight: 700;
  color: #ffeb3b;
  margin: 0 0 var(--space-lg) 0;
  letter-spacing: -0.025em;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.not-found p {
  color: #ffebee;
  font-size: clamp(1rem, 3vw, var(--font-size-lg));
  margin: 0 0 var(--space-2xl) 0;
  line-height: 1.6;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
  max-width: 600px;
}

.home-link {
  display: inline-block;
  background-color: #ff5722;
  color: var(--color-white);
  padding: var(--space-md) var(--space-xl);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: 500;
  font-size: clamp(0.9rem, 2.5vw, var(--font-size-base));
  transition: all 0.2s ease;
  box-shadow: var(--shadow-md);
  position: relative;
  z-index: 1;
}

.home-link:hover {
  background-color: #e64a19;
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .not-found {
    padding: var(--space-xl) var(--space-md);
  }

  .snowflake {
    font-size: 1.5rem;
  }

  .christmas-tree {
    font-size: clamp(2.5rem, 15vw, 4rem);
  }
}

@media (max-width: 480px) {
  .not-found {
    padding: var(--space-lg) var(--space-sm);
  }

  .snowflake {
    font-size: 1rem;
  }

  .christmas-tree {
    font-size: clamp(2rem, 20vw, 3rem);
  }

  .not-found h1 {
    font-size: clamp(1.5rem, 8vw, 2.5rem);
  }

  .not-found p {
    font-size: clamp(0.9rem, 4vw, 1.1rem);
  }
}
</style>