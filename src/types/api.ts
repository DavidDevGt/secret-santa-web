export interface User {
  id: string;
  email: string;
  name: string;
  role: 'participant' | 'organizer' | 'admin';
  email_verified?: boolean;
}

export interface Event {
  id: string;
  owner_id: string;
  name: string;
  participants: Participant[];
  rules: Rules;
  assignments?: Assignment[];
  createdAt: string;
  assignedAt?: string;
}

export interface Participant {
  id: string;
  event_id: string;
  name: string;
  email: string;
  phone?: string;
  group_id?: string;
}

export interface Rules {
  avoidSameGroup?: boolean;
  maxShuffleAttempts?: number;
  avoidPreviousAssignments?: boolean;
}

export interface Assignment {
  giverId: string;
  receiverId: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  user: User;
  requires_verification: boolean;
  message: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  token: string;
  user: User;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface InviteRequest {
  name: string;
  email: string;
  eventId: string;
}

export interface InviteResponse {
  invitationLink: string;
}

export interface VerifyRequest {
  token: string;
  password: string;
}

export interface VerifyResponse {
  token: string;
  user: User;
  message: string;
}

export interface VerifyTokenResponse {
  valid: boolean;
  user: {
    id: string;
    role: string;
  };
}

export interface CreateEventRequest {
  name: string;
}

export interface CreateEventResponse {
  id: string;
  owner_id: string;
  name: string;
  participants: Participant[];
  rules: Rules;
  createdAt: string;
}

export interface CreateParticipantRequest {
  name: string;
  email: string;
  phone?: string;
  groupId?: string;
}

export interface CreateParticipantResponse {
  id: string;
  event_id: string;
  name: string;
  email: string;
  phone?: string;
  group_id?: string;
}

export interface GenerateAssignmentsResponse {
  assignments: Assignment[];
  emailsSent: number;
  message: string;
}

export interface MyAssignmentResponse {
  eventId: string;
  eventName: string;
  receiverName: string;
  receiverEmail: string;
}

export interface MyInfoResponse {
  event: {
    id: string;
    name: string;
    createdAt: string;
    assignedAt?: string;
  };
  myRole: 'participant' | 'organizer' | 'admin';
  myInfo: {
    id: string;
    name: string;
    email: string;
  };
}

export interface HealthResponse {
  status: 'ok' | 'ready' | 'not ready';
  timestamp: string;
  error?: string;
}

export interface ApiError {
  error: string;
}