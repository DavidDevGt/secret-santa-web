import type {
  RegisterRequest,
  RegisterResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  LoginRequest,
  LoginResponse,
  InviteRequest,
  InviteResponse,
  VerifyRequest,
  VerifyResponse,
  Event,
  CreateEventRequest,
  CreateEventResponse,
  Participant,
  CreateParticipantRequest,
  CreateParticipantResponse,
  Rules,
  GenerateAssignmentsResponse,
  MyAssignmentResponse,
  MyInfoResponse,
  HealthResponse,
  ApiError
} from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers
      }
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error);
    }

    return response.json();
  }

  // Authentication
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return this.request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    return this.request<VerifyOtpResponse>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async invite(data: InviteRequest): Promise<InviteResponse> {
    return this.request<InviteResponse>('/auth/invite', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async verify(data: VerifyRequest): Promise<VerifyResponse> {
    return this.request<VerifyResponse>('/auth/verify', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Events
  async getEvents(): Promise<Event[]> {
    return this.request<Event[]>('/events');
  }

  async createEvent(data: CreateEventRequest): Promise<CreateEventResponse> {
    return this.request<CreateEventResponse>('/events', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getEvent(id: string): Promise<Event> {
    return this.request<Event>(`/events/${id}`);
  }

  async updateEvent(id: string, data: { name: string }): Promise<void> {
    return this.request<void>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteEvent(id: string): Promise<void> {
    return this.request<void>(`/events/${id}`, {
      method: 'DELETE'
    });
  }

  // Participants
  async getParticipants(eventId: string): Promise<Participant[]> {
    return this.request<Participant[]>(`/events/${eventId}/participants`);
  }

  async addParticipant(eventId: string, data: CreateParticipantRequest): Promise<CreateParticipantResponse> {
    return this.request<CreateParticipantResponse>(`/events/${eventId}/participants`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateParticipant(eventId: string, id: string, data: CreateParticipantRequest): Promise<void> {
    return this.request<void>(`/events/${eventId}/participants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteParticipant(eventId: string, id: string): Promise<void> {
    return this.request<void>(`/events/${eventId}/participants/${id}`, {
      method: 'DELETE'
    });
  }

  // Rules
  async getRules(eventId: string): Promise<Rules> {
    return this.request<Rules>(`/events/${eventId}/rules`);
  }

  async updateRules(eventId: string, data: Rules): Promise<void> {
    return this.request<void>(`/events/${eventId}/rules`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Assignments
  async getAssignments(eventId: string): Promise<Assignment[]> {
    return this.request<Assignment[]>(`/events/${eventId}/assignments`);
  }

  async generateAssignments(eventId: string): Promise<GenerateAssignmentsResponse> {
    return this.request<GenerateAssignmentsResponse>(`/events/${eventId}/assignments`, {
      method: 'POST'
    });
  }

  async getMyAssignment(): Promise<MyAssignmentResponse> {
    return this.request<MyAssignmentResponse>('/me/assignment');
  }

  async getMyInfo(eventId: string): Promise<MyInfoResponse> {
    return this.request<MyInfoResponse>(`/events/${eventId}/my-info`);
  }

  // Health
  async health(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health');
  }

  async ready(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/ready');
  }
}

export const api = new ApiService();