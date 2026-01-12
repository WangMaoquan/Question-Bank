import { AxiosInstance } from 'axios';
import { AuthResponse, User, JwtPayload } from '@question-bank/types';

export interface LoginDto {
  email: string;
  password?: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password?: string;
}

export class AuthApi {
  constructor(private client: AxiosInstance) {}

  async login(data: LoginDto): Promise<AuthResponse> {
    return this.client.post('/auth/login', data);
  }

  async register(data: RegisterDto): Promise<AuthResponse> {
    return this.client.post('/auth/register', data);
  }

  async getProfile(): Promise<User> {
    return this.client.get('/auth/profile');
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return this.client.put('/auth/profile', data);
  }
}
