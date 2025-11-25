import { apiClient } from './client';
import type {
  Event,
  CreateEventRequest,
  CreateEventResponse,
  Rules,
  Assignment,
  GenerateAssignmentsResponse
} from '@/types/api';

export class EventService {
  async getEvents(): Promise<Event[]> {
    return apiClient.get('/events');
  }

  async createEvent(data: CreateEventRequest): Promise<CreateEventResponse> {
    return apiClient.post('/events', data);
  }

  async getEvent(id: string): Promise<Event> {
    return apiClient.get(`/events/${id}`);
  }

  async updateEvent(id: string, data: { name: string }): Promise<void> {
    return apiClient.put(`/events/${id}`, data);
  }

  async deleteEvent(id: string): Promise<void> {
    return apiClient.delete(`/events/${id}`);
  }

  async getRules(eventId: string): Promise<Rules> {
    return apiClient.get(`/events/${eventId}/rules`);
  }

  async updateRules(eventId: string, data: Rules): Promise<void> {
    return apiClient.put(`/events/${eventId}/rules`, data);
  }

  async getAssignments(eventId: string): Promise<Assignment[]> {
    return apiClient.get(`/events/${eventId}/assignments`);
  }

  async generateAssignments(eventId: string): Promise<GenerateAssignmentsResponse> {
    return apiClient.post(`/events/${eventId}/assignments`);
  }
}

export const eventService = new EventService();