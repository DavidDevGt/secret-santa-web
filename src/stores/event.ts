import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Event, Participant, Rules, Assignment, MyAssignmentResponse, MyInfoResponse } from '@/types/api';
import { api } from '@/services/api';

export const useEventStore = defineStore('event', () => {
  const events = ref<Event[]>([]);
  const currentEvent = ref<Event | null>(null);
  const myAssignment = ref<MyAssignmentResponse | null>(null);

  const fetchEvents = async () => {
    try {
      events.value = await api.getEvents();
    } catch (error) {
      throw error;
    }
  };

  const createEvent = async (name: string) => {
    try {
      const newEvent = await api.createEvent({ name });
      events.value.push(newEvent);
      return newEvent;
    } catch (error) {
      throw error;
    }
  };

  const fetchEvent = async (id: string) => {
    try {
      currentEvent.value = await api.getEvent(id);
      return currentEvent.value;
    } catch (error) {
      throw error;
    }
  };

  const updateEvent = async (id: string, name: string) => {
    try {
      await api.updateEvent(id, { name });
      if (currentEvent.value?.id === id) {
        currentEvent.value.name = name;
      }
      const eventIndex = events.value.findIndex(e => e.id === id);
      if (eventIndex !== -1) {
        events.value[eventIndex]!.name = name;
      }
    } catch (error) {
      throw error;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await api.deleteEvent(id);
      events.value = events.value.filter(e => e.id !== id);
      if (currentEvent.value?.id === id) {
        currentEvent.value = null;
      }
    } catch (error) {
      throw error;
    }
  };

  const fetchParticipants = async (eventId: string) => {
    try {
      return await api.getParticipants(eventId);
    } catch (error) {
      throw error;
    }
  };

  const addParticipant = async (eventId: string, participant: { name: string; email: string; phone?: string; groupId?: string }) => {
    try {
      const newParticipant = await api.addParticipant(eventId, participant);
      if (currentEvent.value?.id === eventId) {
        currentEvent.value.participants.push(newParticipant);
      }
      return newParticipant;
    } catch (error) {
      throw error;
    }
  };

  const updateParticipant = async (eventId: string, id: string, participant: { name: string; email: string; phone?: string; groupId?: string }) => {
    try {
      await api.updateParticipant(eventId, id, participant);
      if (currentEvent.value?.id === eventId) {
        const index = currentEvent.value.participants.findIndex(p => p.id === id);
        if (index !== -1) {
          const existing = currentEvent.value.participants[index]!;
          currentEvent.value.participants[index] = {
            id: existing.id,
            event_id: existing.event_id,
            name: participant.name,
            email: participant.email,
            phone: participant.phone,
            group_id: participant.groupId
          };
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const deleteParticipant = async (eventId: string, id: string) => {
    try {
      await api.deleteParticipant(eventId, id);
      if (currentEvent.value?.id === eventId) {
        currentEvent.value.participants = currentEvent.value.participants.filter(p => p.id !== id);
      }
    } catch (error) {
      throw error;
    }
  };

  const fetchRules = async (eventId: string) => {
    try {
      return await api.getRules(eventId);
    } catch (error) {
      throw error;
    }
  };

  const updateRules = async (eventId: string, rules: Rules) => {
    try {
      await api.updateRules(eventId, rules);
      if (currentEvent.value?.id === eventId) {
        currentEvent.value.rules = rules;
      }
    } catch (error) {
      throw error;
    }
  };

  const fetchAssignments = async (eventId: string) => {
    try {
      return await api.getAssignments(eventId);
    } catch (error) {
      throw error;
    }
  };

  const generateAssignments = async (eventId: string) => {
    try {
      const response = await api.generateAssignments(eventId);
      // Refresh event to get updated assignments
      await fetchEvent(eventId);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const fetchMyAssignment = async () => {
    try {
      myAssignment.value = await api.getMyAssignment();
      return myAssignment.value;
    } catch (error) {
      throw error;
    }
  };

  const fetchMyInfo = async (eventId: string) => {
    try {
      return await api.getMyInfo(eventId);
    } catch (error) {
      throw error;
    }
  };

  return {
    events,
    currentEvent,
    myAssignment,
    fetchEvents,
    createEvent,
    fetchEvent,
    updateEvent,
    deleteEvent,
    fetchParticipants,
    addParticipant,
    updateParticipant,
    deleteParticipant,
    fetchRules,
    updateRules,
    fetchAssignments,
    generateAssignments,
    fetchMyAssignment,
    fetchMyInfo
  };
});