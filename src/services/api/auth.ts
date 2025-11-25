import { apiClient } from './client';
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
  VerifyTokenResponse
} from '@/types/api';

export class AuthService {
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.post('/auth/register', data, true);
  }

  async verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    return apiClient.post('/auth/verify-otp', data, true);
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post('/auth/login', data, true);
  }

  async invite(data: InviteRequest): Promise<InviteResponse> {
    return apiClient.post('/auth/invite', data);
  }

  async verify(data: VerifyRequest): Promise<VerifyResponse> {
    return apiClient.post('/auth/verify', data);
  }

  async verifyToken(): Promise<VerifyTokenResponse> {
    return apiClient.get('/auth/verify-token');
  }
}

export const authService = new AuthService();