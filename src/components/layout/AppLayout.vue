<template>
  <div class="app-layout">
    <header class="app-header christmas-card">
      <div class="header-content">
        <!-- Logo/Brand Section -->
        <div class="brand-section">
          <h1 class="app-title">
            <router-link to="/" class="title-link">
              🎄 Secret Santa
            </router-link>
          </h1>
        </div>

        <!-- Desktop Navigation -->
        <nav class="main-nav desktop-nav">
          <router-link to="/" class="nav-link">
            <span class="nav-icon">🏠</span>
            Dashboard
          </router-link>
          <router-link to="/events" class="nav-link">
            <span class="nav-icon">🎁</span>
            Events
          </router-link>
          <router-link
            v-if="authStore.user?.role === 'admin'"
            to="/admin"
            class="nav-link"
          >
            <span class="nav-icon">⚙️</span>
            Admin
          </router-link>
        </nav>

        <!-- User Section -->
        <div class="user-section">
          <div class="user-info">
            <div class="user-avatar">
              {{ getInitials(authStore.user?.name || '') }}
            </div>
            <div class="user-details">
              <span class="user-name">{{ authStore.user?.name }}</span>
              <span class="user-role">{{ authStore.user?.role }}</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            @click="handleLogout"
            class="logout-btn"
          >
            Logout
          </Button>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="mobile-menu-btn"
          @click="toggleMobileMenu"
          :class="{ active: mobileMenuOpen }"
        >
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>

      <!-- Mobile Navigation Menu -->
      <div class="mobile-nav" :class="{ open: mobileMenuOpen }">
        <nav class="mobile-nav-links">
          <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">
            <span class="nav-icon">🏠</span>
            Dashboard
          </router-link>
          <router-link to="/events" class="mobile-nav-link" @click="closeMobileMenu">
            <span class="nav-icon">🎁</span>
            Events
          </router-link>
          <router-link
            v-if="authStore.user?.role === 'admin'"
            to="/admin"
            class="mobile-nav-link"
            @click="closeMobileMenu"
          >
            <span class="nav-icon">⚙️</span>
            Admin
          </router-link>
        </nav>
        <div class="mobile-user-section">
          <div class="mobile-user-info">
            <div class="user-avatar mobile-avatar">
              {{ getInitials(authStore.user?.name || '') }}
            </div>
            <div class="mobile-user-details">
              <span class="user-name">{{ authStore.user?.name }}</span>
              <span class="user-role">{{ authStore.user?.role }}</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            @click="handleLogout"
            class="mobile-logout-btn"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>

    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Button from '@/components/ui/Button.vue';

const router = useRouter();
const authStore = useAuthStore();

// Mobile menu state
const mobileMenuOpen = ref(false);

const handleLogout = () => {
  authStore.logout();
  router.push('/auth/login');
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-christmas-snow);
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid var(--color-christmas-frost);
}

.header-content {
  max-width: var(--max-width-xl);
  margin: 0 auto;
  padding: 0 var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 5rem;
  position: relative;
}

/* Brand Section */
.brand-section {
  display: flex;
  align-items: center;
}

.app-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.025em;
}

.title-link {
  color: var(--color-primary);
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
}

.title-link:hover {
  color: var(--color-accent);
  background: rgba(217, 119, 6, 0.05);
  transform: translateY(-1px);
}

/* Desktop Navigation */
.main-nav {
  display: flex;
  gap: var(--space-lg);
  align-items: center;
}

.nav-link {
  color: var(--color-gray-600);
  text-decoration: none;
  font-weight: 500;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  transition: all 0.3s ease;
  font-size: var(--font-size-sm);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(217, 119, 6, 0.1), transparent);
  transition: left 0.5s ease;
}

.nav-link:hover::before {
  left: 100%;
}

.nav-link:hover {
  color: var(--color-primary);
  background: rgba(15, 81, 50, 0.05);
  border-color: var(--color-christmas-frost);
  transform: translateY(-1px);
  box-shadow: var(--shadow-christmas);
}

.nav-link.router-link-active {
  color: var(--color-primary);
  background: rgba(15, 81, 50, 0.1);
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px rgba(217, 119, 6, 0.2);
}

.nav-icon {
  font-size: var(--font-size-base);
}

/* User Section */
.user-section {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  background: rgba(15, 81, 50, 0.05);
  border: 1px solid var(--color-christmas-frost);
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: var(--font-size-sm);
  box-shadow: var(--shadow-sm);
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-weight: 600;
  color: var(--color-primary);
  font-size: var(--font-size-sm);
}

.user-role {
  color: var(--color-gray-500);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.logout-btn {
  transition: all 0.3s ease;
}

.logout-btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-christmas);
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
}

.mobile-menu-btn:hover {
  background: rgba(15, 81, 50, 0.05);
}

.hamburger-line {
  width: 24px;
  height: 2px;
  background: var(--color-primary);
  transition: all 0.3s ease;
  border-radius: 1px;
}

.mobile-menu-btn.active .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.mobile-menu-btn.active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.active .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* Mobile Navigation */
.mobile-nav {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--color-christmas-frost);
  box-shadow: var(--shadow-lg);
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.mobile-nav.open {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.mobile-nav-links {
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-christmas-frost);
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  color: var(--color-gray-600);
  text-decoration: none;
  font-weight: 500;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  margin-bottom: var(--space-sm);
}

.mobile-nav-link:hover {
  background: rgba(15, 81, 50, 0.05);
  color: var(--color-primary);
}

.mobile-nav-link.router-link-active {
  background: rgba(15, 81, 50, 0.1);
  color: var(--color-primary);
  border-left: 3px solid var(--color-accent);
}

.mobile-user-section {
  padding: var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mobile-user-info {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.mobile-avatar {
  width: 2rem;
  height: 2rem;
  font-size: 12px;
}

.mobile-user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mobile-logout-btn {
  transition: all 0.3s ease;
}

/* Main Content */
.app-main {
  flex: 1;
  max-width: var(--max-width-xl);
  margin: 0 auto;
  padding: var(--space-2xl) var(--space-lg);
  width: 100%;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    padding: 0 var(--space-md);
    height: 4rem;
  }

  .main-nav {
    display: none;
  }

  .user-section {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .mobile-nav {
    display: block;
  }

  .app-title {
    font-size: var(--font-size-lg);
  }

  .app-main {
    padding: var(--space-xl) var(--space-md);
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 0 var(--space-sm);
  }

  .app-main {
    padding: var(--space-lg) var(--space-sm);
  }

  .mobile-nav-links {
    padding: var(--space-md);
  }

  .mobile-user-section {
    padding: var(--space-md);
    flex-direction: column;
    gap: var(--space-md);
    align-items: stretch;
  }
}
</style>