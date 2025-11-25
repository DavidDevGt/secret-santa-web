import { apiClient } from './client';
import type { MyAssignmentResponse } from '@/types/api';

export class AssignmentService {
  async getMyAssignment(): Promise<MyAssignmentResponse> {
    return apiClient.get('/me/assignment');
  }
}

export const assignmentService = new AssignmentService();