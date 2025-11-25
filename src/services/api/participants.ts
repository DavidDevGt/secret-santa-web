import { apiClient } from './client';
import type {
  Participant,
  CreateParticipantRequest,
  CreateParticipantResponse
} from '@/types/api';

export class ParticipantService {
  async getParticipants(eventId: string): Promise<Participant[]> {
    return apiClient.get(`/events/${eventId}/participants`);
  }

  async addParticipant(
    eventId: string,
    data: CreateParticipantRequest
  ): Promise<CreateParticipantResponse> {
    return apiClient.post(`/events/${eventId}/participants`, data);
  }

  async updateParticipant(
    eventId: string,
    id: string,
    data: CreateParticipantRequest
  ): Promise<void> {
    return apiClient.put(`/events/${eventId}/participants/${id}`, data);
  }

  async deleteParticipant(eventId: string, id: string): Promise<void> {
    return apiClient.delete(`/events/${eventId}/participants/${id}`);
  }
}

export const participantService = new ParticipantService();