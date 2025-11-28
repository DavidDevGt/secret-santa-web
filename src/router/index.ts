import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useHead } from '@vueuse/head';
import type { RouteRecordRaw } from 'vue-router';

interface RouteMeta {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  requiresAuth?: boolean;
  requiresRole?: 'admin' | 'organizer';
}

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: () => import('@/components/layout/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/components/pages/LoginPage.vue'),
        meta: {
          title: 'Login - Secret Santa App',
          description: 'Inicia sesión en tu cuenta de Secret Santa para organizar y participar en intercambios de regalos.',
          ogTitle: 'Login - Secret Santa App',
          ogDescription: 'Inicia sesión en tu cuenta de Secret Santa para organizar y participar en intercambios de regalos.',
          ogImage: '/favicon.ico'
        }
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/components/pages/RegisterPage.vue'),
        meta: {
          title: 'Register - Secret Santa App',
          description: 'Regístrate en Secret Santa App para crear y unirte a eventos de intercambio de regalos navideños.',
          ogTitle: 'Register - Secret Santa App',
          ogDescription: 'Regístrate en Secret Santa App para crear y unirte a eventos de intercambio de regalos navideños.',
          ogImage: '/favicon.ico'
        }
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
        meta: {
          title: 'Dashboard - Secret Santa App',
          description: 'Tu panel principal para gestionar eventos de Secret Santa, ver asignaciones y organizar intercambios de regalos.',
          ogTitle: 'Dashboard - Secret Santa App',
          ogDescription: 'Tu panel principal para gestionar eventos de Secret Santa, ver asignaciones y organizar intercambios de regalos.',
          ogImage: '/favicon.ico'
        }
      },
      {
        path: 'events',
        name: 'EventList',
        component: () => import('@/components/pages/EventListPage.vue'),
        meta: {
          title: 'Events - Secret Santa App',
          description: 'Lista de todos tus eventos de Secret Santa. Crea nuevos eventos o únete a los existentes.',
          ogTitle: 'Events - Secret Santa App',
          ogDescription: 'Lista de todos tus eventos de Secret Santa. Crea nuevos eventos o únete a los existentes.',
          ogImage: '/favicon.ico'
        }
      },
      {
        path: 'events/create',
        name: 'EventCreate',
        component: () => import('@/components/pages/EventCreatePage.vue'),
        meta: {
          title: 'Create Event - Secret Santa App',
          description: 'Crea un nuevo evento de Secret Santa. Invita a participantes y configura las reglas del intercambio.',
          ogTitle: 'Create Event - Secret Santa App',
          ogDescription: 'Crea un nuevo evento de Secret Santa. Invita a participantes y configura las reglas del intercambio.',
          ogImage: '/favicon.ico',
          requiresRole: 'organizer'
        }
      },
      {
        path: 'events/:id',
        name: 'EventDetail',
        component: () => import('@/components/pages/EventDetailPage.vue'),
        meta: {
          title: 'Event Details - Secret Santa App',
          description: 'Detalles del evento de Secret Santa, incluyendo participantes, asignaciones y configuraciones.',
          ogTitle: 'Event Details - Secret Santa App',
          ogDescription: 'Detalles del evento de Secret Santa, incluyendo participantes, asignaciones y configuraciones.',
          ogImage: '/favicon.ico'
        },
        props: true
      },
      {
        path: 'admin',
        name: 'AdminDashboard',
        component: () => import('@/components/pages/AdminDashboardPage.vue'),
        meta: {
          title: 'Admin Dashboard - Secret Santa App',
          description: 'Panel de administración para gestionar usuarios, eventos y configuraciones del sistema.',
          ogTitle: 'Admin Dashboard - Secret Santa App',
          ogDescription: 'Panel de administración para gestionar usuarios, eventos y configuraciones del sistema.',
          ogImage: '/favicon.ico',
          requiresRole: 'admin'
        }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/components/pages/SettingsPage.vue'),
        meta: {
          title: 'Settings - Secret Santa App',
          description: 'Configura tu perfil, preferencias y ajustes de cuenta en Secret Santa App.',
          ogTitle: 'Settings - Secret Santa App',
          ogDescription: 'Configura tu perfil, preferencias y ajustes de cuenta en Secret Santa App.',
          ogImage: '/favicon.ico'
        }
      },
      {
        path: 'help',
        name: 'Help',
        component: () => import('@/components/pages/HelpPage.vue'),
        meta: {
          title: 'Help Center - Secret Santa App',
          description: 'Centro de ayuda con guías, preguntas frecuentes y soporte para Secret Santa App.',
          ogTitle: 'Help Center - Secret Santa App',
          ogDescription: 'Centro de ayuda con guías, preguntas frecuentes y soporte para Secret Santa App.',
          ogImage: '/favicon.ico'
        }
      },
      {
        path: 'support',
        name: 'Support',
        component: () => import('@/components/pages/SupportPage.vue'),
        meta: {
          title: 'Support - Secret Santa App',
          description: 'Contacta con nuestro equipo de soporte para asistencia con Secret Santa App.',
          ogTitle: 'Support - Secret Santa App',
          ogDescription: 'Contacta con nuestro equipo de soporte para asistencia con Secret Santa App.',
          ogImage: '/favicon.ico'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/components/pages/NotFoundPage.vue'),
    meta: {
      title: 'Page Not Found - Secret Santa App',
      description: 'La página que buscas no existe. Regresa al inicio de Secret Santa App.',
      ogTitle: 'Page Not Found - Secret Santa App',
      ogDescription: 'La página que buscas no existe. Regresa al inicio de Secret Santa App.',
      ogImage: '/favicon.ico'
    }
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

 // Set page head
 const meta = to.meta as RouteMeta;
 if (meta.title) {
   useHead({
     title: meta.title,
     meta: [
       { name: 'description', content: meta.description },
       { property: 'og:title', content: meta.ogTitle },
       { property: 'og:description', content: meta.ogDescription },
       { property: 'og:image', content: meta.ogImage },
       { property: 'og:type', content: 'website' },
       { name: 'twitter:card', content: 'summary_large_image' },
       { name: 'twitter:title', content: meta.ogTitle },
       { name: 'twitter:description', content: meta.ogDescription },
       { name: 'twitter:image', content: meta.ogImage }
     ]
   });
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
