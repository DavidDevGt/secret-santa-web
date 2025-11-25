import type { ApiError } from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export class ApiClient {
  private pendingRequests = new Map<string, Promise<any>>();

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private generateRequestKey(endpoint: string, method: string, body?: any): string {
    const bodyKey = body ? JSON.stringify(body) : '';
    return `${method}:${endpoint}:${bodyKey}`;
  }


  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    enableDeduplication = false
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    // Build headers object
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Add any additional headers
    if (options.headers) {
      Object.assign(headers, options.headers as Record<string, string>);
    }

    const config: RequestInit = {
      ...options,
      headers
    };

    // Request deduplication for critical operations
    if (enableDeduplication && (options.method === 'POST' || options.method === 'PUT' || options.method === 'DELETE')) {
      const requestKey = this.generateRequestKey(endpoint, options.method || 'GET', options.body);

      if (this.pendingRequests.has(requestKey)) {
        console.log(`Deduplicating request: ${requestKey}`);
        return this.pendingRequests.get(requestKey);
      }

      const requestPromise = this.executeRequest<T>(url, config);
      this.pendingRequests.set(requestKey, requestPromise);

      try {
        const result = await requestPromise;
        return result;
      } finally {
        this.pendingRequests.delete(requestKey);
      }
    }

    return this.executeRequest<T>(url, config);
  }

  private async executeRequest<T>(url: string, config: RequestInit, retryCount = 0): Promise<T> {
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second

    let response: Response | undefined;

    try {
      response = await fetch(url, config);

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          error: response ? `HTTP ${response.status}: ${response.statusText}` : 'Network error'
        }));

        // Handle unauthorized errors globally
        if (response.status === 401) {
          const { useAuthStore } = await import('@/stores/auth');
          const authStore = useAuthStore();
          authStore.logout();
          // Redirect to login if not already there
          if (window.location.pathname !== '/auth/login') {
            window.location.href = '/auth/login';
          }
        }

        // Handle forbidden errors (insufficient permissions)
        if (response.status === 403) {
          console.warn('Access denied - insufficient permissions');
          // Could show a toast notification here if available
        }

        throw new Error(errorData.error);
      }

      // Handle empty responses (204 No Content)
      if (response.status === 204) {
        return {} as T;
      }

      return response.json();
    } catch (error) {
      // Retry logic for network errors and 5xx server errors
      if (retryCount < maxRetries && this.shouldRetry(error, response)) {
        const delay = baseDelay * Math.pow(2, retryCount); // Exponential backoff
        console.log(`Retrying request in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.executeRequest<T>(url, config, retryCount + 1);
      }

      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  private shouldRetry(error: any, response?: Response): boolean {
    // Retry on network errors
    if (!response) return true;

    // Retry on 5xx server errors
    if (response.status >= 500) return true;

    // Don't retry on 4xx client errors (except 429 Too Many Requests)
    if (response.status === 429) return true;

    return false;
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown, enableDeduplication = true): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    }, enableDeduplication);
  }

  async put<T>(endpoint: string, data?: unknown, enableDeduplication = true): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    }, enableDeduplication);
  }

  async delete<T>(endpoint: string, enableDeduplication = true): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' }, enableDeduplication);
  }

  async patch<T>(endpoint: string, data?: unknown, enableDeduplication = true): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    }, enableDeduplication);
  }
}

export const apiClient = new ApiClient();