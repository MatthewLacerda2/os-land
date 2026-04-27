import client from './client';

export type UserRole = 'manager' | 'technician';

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: UserRole;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  name: string;
  email: string;
  login_at: string;
  jwt: string;
}

export const userApi = {
  createUser: async (data: CreateUserRequest): Promise<UserResponse> => {
    const response = await client.post('/user/create', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await client.post('/user/login', data);
    return response.data;
  },
};
