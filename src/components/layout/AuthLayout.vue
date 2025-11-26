<template>
  <div class="auth-layout">
    <!-- Christmas lights -->
    <div class="christmas-lights">
      <div class="light red"></div>
      <div class="light gold"></div>
      <div class="light green"></div>
      <div class="light blue"></div>
      <div class="light red"></div>
      <div class="light gold"></div>
      <div class="light green"></div>
      <div class="light blue"></div>
    </div>

    <!-- Snowflakes -->
    <div class="snowflakes">
      <div class="snowflake">❄</div>
      <div class="snowflake">❅</div>
      <div class="snowflake">❆</div>
      <div class="snowflake">❄</div>
      <div class="snowflake">❅</div>
      <div class="snowflake">❆</div>
      <div class="snowflake">❄</div>
      <div class="snowflake">❅</div>
      <div class="snowflake">❆</div>
      <div class="snowflake">❄</div>
    </div>

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
  background: linear-gradient(135deg, #0a3d15 0%, #145c23 20%, #1e7a30 40%, #28963d 60%, #1e7a30 80%, #145c23 100%);
  background-size: 400% 400%;
  animation: gradientShift 20s ease infinite;
  padding: var(--space-md);
  overflow: hidden;
  position: relative;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Christmas lights */
.christmas-lights {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  z-index: 10;
  pointer-events: none;
}

.light {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  animation: blink 2s ease-in-out infinite;
  box-shadow: 0 0 20px currentColor;
  position: relative;
}

.light::before {
  content: '';
  position: absolute;
  top: -20px;
  left: 50%;
  width: 2px;
  height: 20px;
  background: rgba(255, 255, 255, 0.3);
}

.light.red {
  background: #ff3333;
  animation-delay: 0s;
}

.light.gold {
  background: #ffd700;
  animation-delay: 0.5s;
}

.light.green {
  background: #33ff33;
  animation-delay: 1s;
}

.light.blue {
  background: #3333ff;
  animation-delay: 1.5s;
}

@keyframes blink {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.9); }
}

/* Snowflakes */
.snowflakes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.snowflake {
  position: absolute;
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.9);
  animation: fall linear infinite;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

.snowflake:nth-child(1) { left: 5%; animation-duration: 11s; animation-delay: 0s; font-size: 1.5rem; }
.snowflake:nth-child(2) { left: 15%; animation-duration: 14s; animation-delay: 1s; font-size: 2.5rem; }
.snowflake:nth-child(3) { left: 25%; animation-duration: 10s; animation-delay: 3s; font-size: 1.8rem; }
.snowflake:nth-child(4) { left: 35%; animation-duration: 13s; animation-delay: 2s; font-size: 2rem; }
.snowflake:nth-child(5) { left: 45%; animation-duration: 12s; animation-delay: 0.5s; font-size: 2.2rem; }
.snowflake:nth-child(6) { left: 55%; animation-duration: 15s; animation-delay: 1.5s; font-size: 1.6rem; }
.snowflake:nth-child(7) { left: 65%; animation-duration: 11s; animation-delay: 2.5s; font-size: 2.4rem; }
.snowflake:nth-child(8) { left: 75%; animation-duration: 13s; animation-delay: 3.5s; font-size: 1.9rem; }
.snowflake:nth-child(9) { left: 85%; animation-duration: 14s; animation-delay: 0.8s; font-size: 2.1rem; }
.snowflake:nth-child(10) { left: 95%; animation-duration: 12s; animation-delay: 2.2s; font-size: 1.7rem; }

@keyframes fall {
  0% { 
    top: -10%; 
    transform: translateX(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% { 
    top: 110%; 
    transform: translateX(100px) rotate(360deg);
    opacity: 0;
  }
}


/* Container */
.auth-container {
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 24px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  overflow: hidden;
  position: relative;
  z-index: 5;
  border: 3px solid #d32f2f;
}

.auth-header {
  background: linear-gradient(180deg, #ffffff 0%, #f8fdf9 100%);
  padding: var(--space-2xl) var(--space-2xl) var(--space-lg);
  text-align: center;
  border-bottom: 2px solid #e8f5e9;
  position: relative;
}


.auth-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  background: linear-gradient(135deg, #0a5c1f 0%, #28963d 50%, #0a5c1f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 var(--space-sm) 0;
  letter-spacing: -0.025em;
  text-shadow: 0 2px 10px rgba(40, 150, 61, 0.3);
}

.auth-subtitle {
  color: #2d6a3d;
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: 400;
}

.auth-content {
  padding: var(--space-2xl);
  background: #ffffff;
}

/* Responsive */
@media (max-width: 1440px) {
  .auth-layout {
    padding: var(--space-lg);
  }

  .auth-content {
    padding: var(--space-xl);
  }
}

@media (max-width: 768px) {
  .christmas-lights {
    height: 40px;
  }

  .light {
    width: 15px;
    height: 15px;
  }
}

@media (max-width: 480px) {
  .auth-layout {
    padding: var(--space-sm);
  }

  .auth-content {
    padding: var(--space-lg);
  }

  .auth-header {
    padding: var(--space-lg) var(--space-lg) var(--space-md);
  }
}
</style>