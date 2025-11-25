import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: () => import('@/components/layout/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/components/pages/LoginPage.vue'),
        meta: { title: 'Login' }
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/components/pages/RegisterPage.vue'),
        meta: { title: 'Register' }
      }
    ]
  },
  {
    path: '/',
    component: () => import('@/components/layout/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/components/pages/DashboardPage.vue'),
        meta: { title: 'Dashboard' }
      },
      {
        path: 'events',
        name: 'EventList',
        component: () => import('@/components/pages/EventListPage.vue'),
        meta: { title: 'Events' }
      },
      {
        path: 'events/create',
        name: 'EventCreate',
        component: () => import('@/components/pages/EventCreatePage.vue'),
        meta: {
          title: 'Create Event',
          requiresRole: 'organizer'
        }
      },
      {
        path: 'events/:id',
        name: 'EventDetail',
        component: () => import('@/components/pages/EventDetailPage.vue'),
        meta: { title: 'Event Details' },
        props: true
      },
      {
        path: 'admin',
        name: 'AdminDashboard',
        component: () => import('@/components/pages/AdminDashboardPage.vue'),
        meta: {
          title: 'Admin Dashboard',
          requiresRole: 'admin'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/components/pages/NotFoundPage.vue'),
    meta: { title: 'Page Not Found' }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Initialize auth state from localStorage
  await authStore.initializeAuth();

  // Set page title
  if (to.meta.title) {
    document.title = `${to.meta.title} - Secret Santa`;
  }

  // Check authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'Login' });
  }

  // Check role-based access
  if (to.meta.requiresRole) {
    const requiredRole = to.meta.requiresRole as 'admin' | 'organizer';
    if (!authStore.user || !authStore.hasRole(requiredRole)) {
      return next({ name: 'Dashboard' });
    }
  }

  // Redirect authenticated users away from auth pages
  if (authStore.isAuthenticated && to.path.startsWith('/auth')) {
    return next({ name: 'Dashboard' });
  }

  next();
});

export default router;
