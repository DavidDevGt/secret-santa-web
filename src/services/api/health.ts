import { apiClient } from './client';
import type { HealthResponse } from '@/types/api';

export class HealthService {
  async checkHealth(): Promise<HealthResponse> {
    return apiClient.get('/health');
  }

  async checkReadiness(): Promise<HealthResponse> {
    return apiClient.get('/ready');
  }
}

export const healthService = new HealthService();