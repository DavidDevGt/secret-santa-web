// Domain models extending API types with business logic
import type { User as ApiUser, Event as ApiEvent, Participant as ApiParticipant } from './api';

export interface User extends ApiUser {
  permissions: Permission[];
  isVerified: boolean;
  canCreateEvents: boolean;
  canManageAllEvents: boolean;
}

export interface Event extends ApiEvent {
  canEdit: boolean;
  canDelete: boolean;
  canManageParticipants: boolean;
  canGenerateAssignments: boolean;
  canViewAssignments: boolean;
  isOwner: boolean;
  participantCount: number;
  hasAssignments: boolean;
}

export interface Participant extends ApiParticipant {
  canRemove: boolean;
  isCurrentUser: boolean;
  displayName: string;
}

// Permission types
export type Permission =
  | 'read_own_profile'
  | 'read_own_assignment'
  | 'read_event'
  | 'update_own_profile'
  | 'create_event'
  | 'update_event'
  | 'delete_event'
  | 'manage_participants'
  | 'manage_rules'
  | 'generate_assignments'
  | 'read_assignments'
  | 'manage_all_events'
  | 'manage_users'
  | 'view_admin_dashboard'
  | 'view_all_events'
  | 'view_all_users'
  | 'system_admin'
  | 'audit_system';

// UI State types
export interface LoadingState {
  global: boolean;
  auth: boolean;
  events: boolean;
  participants: boolean;
}

export interface ErrorState {
  global: string | null;
  auth: string | null;
  events: string | null;
  participants: string | null;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export interface OtpForm {
  email: string;
  otp: string;
}

export interface EventForm {
  name: string;
}

export interface ParticipantForm {
  name: string;
  email: string;
  phone?: string;
  groupId?: string;
}

export interface RulesForm {
  avoidSameGroup?: boolean;
  maxShuffleAttempts?: number;
  avoidPreviousAssignments?: boolean;
}

// Route meta types
export interface RouteMeta {
  requiresAuth?: boolean;
  requiresRole?: 'participant' | 'organizer' | 'admin';
  permissions?: Permission[];
  title?: string;
}

// API Response wrappers
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    handler: () => void;
  };
}