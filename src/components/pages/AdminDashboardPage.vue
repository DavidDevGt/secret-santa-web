<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1>Admin Dashboard</h1>
      <p>System overview and management</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading dashboard data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <Button @click="loadDashboard" variant="outline">Try Again</Button>
    </div>

    <!-- Dashboard Content -->
    <div v-else-if="stats" class="dashboard-content">
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon users">
            👥
          </div>
          <div class="stat-content">
            <h3>{{ stats.stats.totalUsers }}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon events">
            🎄
          </div>
          <div class="stat-content">
            <h3>{{ stats.stats.totalEvents }}</h3>
            <p>Total Events</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon participants">
            🎁
          </div>
          <div class="stat-content">
            <h3>{{ stats.stats.totalParticipants }}</h3>
            <p>Total Participants</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon recent">
            📈
          </div>
          <div class="stat-content">
            <h3>{{ stats.stats.recentEvents }}</h3>
            <p>Recent Events</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon active">
            ✨
          </div>
          <div class="stat-content">
            <h3>{{ stats.stats.activeEvents }}</h3>
            <p>Active Events</p>
          </div>
        </div>
      </div>

      <!-- System Health -->
      <div class="health-section">
        <h2>System Health</h2>
        <div class="health-grid">
          <div class="health-card">
            <div class="health-header">
              <h3>Liveness Check</h3>
              <div :class="['health-status', healthStatus.liveness ? 'healthy' : 'unhealthy']">
                {{ healthStatus.liveness ? '✓ Healthy' : '✗ Unhealthy' }}
              </div>
            </div>
            <div class="health-details">
              <p><strong>Status:</strong> {{ healthStatus.liveness ? 'Server running' : 'Server down' }}</p>
              <p><strong>Last Check:</strong> {{ formatTimestamp(healthStatus.livenessTimestamp) }}</p>
            </div>
          </div>

          <div class="health-card">
            <div class="health-header">
              <h3>Readiness Check</h3>
              <div :class="['health-status', healthStatus.readiness ? 'healthy' : 'unhealthy']">
                {{ healthStatus.readiness ? '✓ Ready' : '✗ Not Ready' }}
              </div>
            </div>
            <div class="health-details">
              <p><strong>Status:</strong> {{ healthStatus.readiness ? 'Database connected' : 'Database issues' }}</p>
              <p><strong>Last Check:</strong> {{ formatTimestamp(healthStatus.readinessTimestamp) }}</p>
              <p v-if="!healthStatus.readiness && healthStatus.readinessError" class="error-text">
                <strong>Error:</strong> {{ healthStatus.readinessError }}
              </p>
            </div>
          </div>
        </div>
        <div class="health-actions">
          <Button @click="checkHealth" :loading="checkingHealth" variant="outline">
            🔄 Refresh Health Status
          </Button>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="actions-section">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <Button
            @click="viewAllUsers"
            variant="outline"
            size="lg"
            class="action-btn"
          >
            👥 View All Users
          </Button>
          <Button
            @click="viewAllEvents"
            variant="outline"
            size="lg"
            class="action-btn"
          >
            🎄 View All Events
          </Button>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="activity-section">
        <h2>System Information</h2>
        <div class="info-card">
          <p><strong>Last Updated:</strong> {{ formatTimestamp(stats.timestamp) }}</p>
          <p><strong>Server Status:</strong> <span class="status-online">Online</span></p>
          <p><strong>API Version:</strong> v1.0.0</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminStore } from '@/stores/admin/index';
import { api } from '@/services/api';
import Button from '@/components/ui/Button.vue';
import type { AdminDashboardStats } from '@/services/api/admin';

const router = useRouter();
const adminStore = useAdminStore();

const stats = ref<AdminDashboardStats | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

// Health check state
const healthStatus = ref({
  liveness: false,
  readiness: false,
  livenessTimestamp: '',
  readinessTimestamp: '',
  readinessError: ''
});
const checkingHealth = ref(false);

const loadDashboard = async () => {
  loading.value = true;
  error.value = null;
  try {
    stats.value = await adminStore.getDashboard();
  } catch (err) {
    error.value = (err as Error).message;
  } finally {
    loading.value = false;
  }
};

const viewAllUsers = () => {
  // Could navigate to a users management page
  alert('Users management page - Coming soon!');
};

const viewAllEvents = () => {
  // Could navigate to an events management page
  alert('Events management page - Coming soon!');
};

const checkHealth = async () => {
  checkingHealth.value = true;
  try {
    // Check liveness
    const livenessData = await api.health();
    healthStatus.value.liveness = livenessData.status === 'ok';
    healthStatus.value.livenessTimestamp = new Date().toISOString();

    // Check readiness
    const readinessData = await api.ready();
    healthStatus.value.readiness = readinessData.status === 'ready';
    healthStatus.value.readinessTimestamp = new Date().toISOString();
    healthStatus.value.readinessError = readinessData.error || '';
  } catch (error) {
    console.error('Health check failed:', error);
    healthStatus.value.liveness = false;
    healthStatus.value.readiness = false;
    healthStatus.value.livenessTimestamp = new Date().toISOString();
    healthStatus.value.readinessTimestamp = new Date().toISOString();
    healthStatus.value.readinessError = 'Network error';
  } finally {
    checkingHealth.value = false;
  }
};

const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

onMounted(async () => {
  await loadDashboard();
  await checkHealth();
});
</script>

<style scoped>
.admin-dashboard {
  max-width: var(--max-width-xl);
  margin: 0 auto;
}

.dashboard-header {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.dashboard-header h1 {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 var(--space-sm) 0;
}

.dashboard-header p {
  color: var(--color-gray-600);
  font-size: var(--font-size-lg);
  margin: 0;
}

.loading-state,
.error-state {
  text-align: center;
  padding: var(--space-2xl);
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid var(--color-gray-200);
  border-top: 3px solid var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--space-md) auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-lg);
}

.stat-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-gray-200);
  padding: var(--space-lg);
  display: flex;
  align-items: center;
  gap: var(--space-md);
  transition: all 0.2s ease;
}

.stat-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: var(--font-size-2xl);
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
}

.users {
  background: rgba(59, 130, 246, 0.1);
}

.events {
  background: rgba(245, 158, 11, 0.1);
}

.participants {
  background: rgba(16, 185, 129, 0.1);
}

.recent {
  background: rgba(139, 92, 246, 0.1);
}

.active {
  background: rgba(236, 72, 153, 0.1);
}

.stat-content h3 {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 var(--space-xs) 0;
}

.stat-content p {
  color: var(--color-gray-600);
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.health-section,
.actions-section,
.activity-section {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-gray-200);
  padding: var(--space-xl);
}

.actions-section h2,
.activity-section h2 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-primary);
  margin: 0 0 var(--space-lg) 0;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-md);
}

.action-btn {
  height: auto;
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  text-align: center;
  font-size: var(--font-size-base);
}

.info-card {
  background: var(--color-gray-50);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
}

.info-card p {
  margin: 0 0 var(--space-sm) 0;
  color: var(--color-gray-700);
}

.info-card p:last-child {
  margin-bottom: 0;
}

.status-online {
  color: var(--color-success);
  font-weight: 600;
}

.health-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.health-card {
  background: var(--color-gray-50);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  border: 1px solid var(--color-gray-200);
}

.health-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
}

.health-header h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
}

.health-status {
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 600;
  text-transform: uppercase;
}

.health-status.healthy {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.health-status.unhealthy {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
}

.health-details p {
  margin: 0 0 var(--space-sm) 0;
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

.health-details p:last-child {
  margin-bottom: 0;
}

.error-text {
  color: var(--color-error);
  font-weight: 500;
}

.health-actions {
  display: flex;
  justify-content: center;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .health-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: var(--space-md);
  }

  .stat-icon {
    width: 2.5rem;
    height: 2.5rem;
    font-size: var(--font-size-xl);
  }
}
</style>