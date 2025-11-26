<template>
  <Teleport to="body">
    <div v-if="isVisible" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div v-if="!isOpened" class="gift-container" @click="openGift">
          <svg class="gift-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">

            <defs>
              <!-- Gradiente rojo del regalo -->
              <linearGradient id="boxRed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#ef4444" />
                <stop offset="100%" stop-color="#b91c1c" />
              </linearGradient>

              <!-- Gradiente dorado para cintas -->
              <linearGradient id="goldRibbon" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#fef3c7" />
                <stop offset="40%" stop-color="#facc15" />
                <stop offset="100%" stop-color="#ca8a04" />
              </linearGradient>

              <!-- Sombra -->
              <filter id="softShadow" x="-20%" y="-20%" width="150%" height="150%">
                <feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#000" flood-opacity="0.25" />
              </filter>

              <!-- ClipPath para el moño -->
              <clipPath id="bowClip">
                <rect x="60" y="40" width="80" height="60" />
              </clipPath>

            </defs>

            <!-- Caja -->
            <rect x="50" y="80" width="100" height="85" rx="8" fill="url(#boxRed)" filter="url(#softShadow)" />

            <!-- Tapa -->
            <rect x="45" y="62" width="110" height="25" rx="6" fill="url(#boxRed)" filter="url(#softShadow)" />

            <!-- Cinta vertical -->
            <rect x="95" y="62" width="10" height="103" rx="3" fill="url(#goldRibbon)" />

            <!-- Cinta horizontal -->
            <rect x="45" y="115" width="110" height="12" rx="3" fill="url(#goldRibbon)" />

            <!-- Moño -->
            <g transform="translate(0, -10)" clip-path="url(#bowClip)">
              <!-- Brillo -->
              <circle cx="100" cy="70" r="20" fill="url(#bowGlow)" opacity="0.45" />

              <!-- Lazo izquierdo -->
              <path d="M100 70
         C 88 60, 70 65, 75 78
         C 80 90, 92 85, 100 72" fill="url(#goldRibbon)" stroke="#b45309" stroke-width="2" stroke-linejoin="round" />

              <!-- Lazo derecho -->
              <path d="M100 70
         C 112 60, 130 65, 125 78
         C 120 90, 108 85, 100 72" fill="url(#goldRibbon)" stroke="#b45309" stroke-width="2" stroke-linejoin="round" />

              <!-- Nudo -->
              <ellipse cx="100" cy="72" rx="10" ry="8" fill="url(#goldRibbon)" stroke="#b45309" stroke-width="2" />
            </g>
          </svg>


          <div class="click-hint">Click the gift to open!</div>
        </div>
        <div v-else class="gift-opened">
          <div class="gift-message">
            <p v-html="message"></p>
            <button class="close-btn" @click="closeModal">Ok</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  message: string
  isVisible: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const isOpened = ref(false)

const openGift = () => {
  isOpened.value = true
}

const closeModal = () => {
  isOpened.value = false
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  border: 3px solid #e11d48;
  /* borde rojito */
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.35);
  background: linear-gradient(135deg, #ffffff 0%, #fff5f5 100%);
  position: relative;
  overflow: hidden;
}

/* Snow sparkles ligeritos */
.modal-content::before {
  content: "";
  position: absolute;
  top: -20px;
  left: -20px;
  width: 200%;
  height: 200%;
  background-image: radial-gradient(#ffe4e6 2px, transparent 2px);
  background-size: 40px 40px;
  opacity: 0.15;
  animation: sparkle 8s linear infinite;
}

@keyframes sparkle {
  from {
    transform: translate(0, 0);
  }

  to {
    transform: translate(-40px, -40px);
  }
}

.gift-container {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
}

.gift-svg {
  width: 200px;
  height: 200px;
  transition: transform 0.3s ease, filter 0.3s ease;
  filter: drop-shadow(0 0 10px rgba(220, 38, 38, 0.2));
}

.gift-container:hover .gift-svg {
  transform: scale(1.07);
  filter: drop-shadow(0 0 14px rgba(220, 38, 38, 0.45));
}

.click-hint {
  margin-top: 20px;
  font-size: 16px;
  color: #991b1b;
  font-weight: bold;
  text-shadow: 0 1px 3px rgba(255, 230, 230, 0.6);
}

.gift-opened {
  animation: fadeIn 0.5s ease;
}

.gift-message p {
  font-size: 18px;
  line-height: 1.5;
  margin-bottom: 20px;
  color: #7f1d1d;
}

.close-btn {
  background: #b91c1c;
  color: white;
  border: none;
  padding: 10px 22px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s ease, transform 0.2s ease;
}

.close-btn:hover {
  background: #911616;
  transform: scale(1.05);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
