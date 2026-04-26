import client from './client';

export interface CreateTechnicianRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface TechnicianResponse {
  id: string;
  name: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  name: string;
  email: string;
  login_at: string;
  jwt: string;
}

export const userApi = {
  createTechnician: async (data: CreateTechnicianRequest): Promise<TechnicianResponse> => {
    const response = await client.post('/user/create/technician', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await client.post('/user/login', data);
    return response.data;
  },
};
