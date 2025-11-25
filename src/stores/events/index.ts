import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Event, User } from '@/types/domain';
import type { User as ApiUser } from '@/types/api';
import { eventService } from '@/services/api/events';
import { participantService } from '@/services/api/participants';
import { assignmentService } from '@/services/api/assignments';
import { useAuthStore } from '../auth';

export const useEventStore = defineStore('events', () => {
  // State
  const events = ref<Event[]>([]);
  const currentEvent = ref<Event | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const eventsCount = computed(() => events.value.length);
  const hasEvents = computed(() => eventsCount.value > 0);

  const userEvents = computed(() => {
    const authStore = useAuthStore();
    if (!authStore.user) return [];

    return events.value
      .map(event => enrichEventWithPermissions(event, authStore.user!))
      .filter(event => event.canEdit || event.canViewAssignments || event.canManageParticipants);
  });

  const hasAnyAssignments = computed(() => {
    return userEvents.value.some(event => event.hasAssignments);
  });

  // Helper function to enrich events with permissions
  function enrichEventWithPermissions(event: Event, user: ApiUser): Event {
    const isOwner = event.owner_id === user.id;
    const isAdmin = user.role === 'admin';

    return {
      ...event,
      canEdit: isOwner || isAdmin,
      canDelete: isOwner || isAdmin,
      canManageParticipants: isOwner || isAdmin,
      canGenerateAssignments: isOwner || isAdmin,
      canViewAssignments: isOwner || isAdmin || event.participants.some(p => p.email === user.email),
      isOwner,
      participantCount: event.participants.length,
      hasAssignments: !!event.assignedAt
    };
  }

  // Actions
  async function fetchEvents() {
    loading.value = true;
    error.value = null;
    try {
      const apiEvents = await eventService.getEvents();
      const authStore = useAuthStore();

      if (!authStore.user) {
        console.warn('Cannot fetch events: user not authenticated');
        events.value = [];
        return;
      }

      events.value = apiEvents.map(event =>
        enrichEventWithPermissions(event as Event, authStore.user!)
      );

      console.log(`Fetched ${events.value.length} events for user ${authStore.user.email}`);
    } catch (err) {
      error.value = (err as Error).message;
      console.error('Failed to fetch events:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createEvent(name: string) {
    loading.value = true;
    error.value = null;
    try {
      const newEvent = await eventService.createEvent({ name });
      const authStore = useAuthStore();

      const enrichedEvent = enrichEventWithPermissions(newEvent as Event, authStore.user!);
      events.value.push(enrichedEvent);

      return enrichedEvent;
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchEvent(id: string) {
    loading.value = true;
    error.value = null;
    try {
      const event = await eventService.getEvent(id);
      const authStore = useAuthStore();

      currentEvent.value = enrichEventWithPermissions(event as Event, authStore.user!);
      return currentEvent.value;
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateEvent(id: string, name: string) {
    loading.value = true;
    error.value = null;
    try {
      await eventService.updateEvent(id, { name });

      // Update in events list
      const eventIndex = events.value.findIndex(e => e.id === id);
      if (eventIndex !== -1) {
        events.value[eventIndex]!.name = name;
      }

      // Update current event if it's the same
      if (currentEvent.value?.id === id) {
        currentEvent.value.name = name;
      }
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteEvent(id: string) {
    loading.value = true;
    error.value = null;
    try {
      await eventService.deleteEvent(id);

      // Remove from events list
      events.value = events.value.filter(e => e.id !== id);

      // Clear current event if it's the deleted one
      if (currentEvent.value?.id === id) {
        currentEvent.value = null;
      }
    } catch (err) {
      error.value = (err as Error).message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Additional actions for participants, rules, and assignments
  async function addParticipant(eventId: string, participant: { name: string; email: string; phone?: string; groupId?: string }) {
    try {
      const newParticipant = await participantService.addParticipant(eventId, participant);
      if (currentEvent.value?.id === eventId) {
        currentEvent.value.participants.push(newParticipant);
      }
      return newParticipant;
    } catch (error) {
      throw error;
    }
  }

  async function deleteParticipant(eventId: string, participantId: string) {
    try {
      await participantService.deleteParticipant(eventId, participantId);
      if (currentEvent.value?.id === eventId) {
        currentEvent.value.participants = currentEvent.value.participants.filter(p => p.id !== participantId);
      }
    } catch (error) {
      throw error;
    }
  }

  async function updateRules(eventId: string, rules: any) {
    try {
      await eventService.updateRules(eventId, rules);
      if (currentEvent.value?.id === eventId) {
        currentEvent.value.rules = rules;
      }
    } catch (error) {
      throw error;
    }
  }

  async function generateAssignments(eventId: string) {
    try {
      const result = await eventService.generateAssignments(eventId);
      // Refresh event to get updated assignments
      await fetchEvent(eventId);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async function fetchMyAssignment() {
    try {
      return await assignmentService.getMyAssignment();
    } catch (error) {
      throw error;
    }
  }

  return {
    // State
    events,
    currentEvent,
    loading,
    error,

    // Getters
    eventsCount,
    hasEvents,
    userEvents,
    hasAnyAssignments,

    // Actions
    fetchEvents,
    createEvent,
    fetchEvent,
    updateEvent,
    deleteEvent,
    addParticipant,
    deleteParticipant,
    updateRules,
    generateAssignments,
    fetchMyAssignment
  };
});