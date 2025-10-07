import api from "../axiosInstance";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  expiresAt: string;
}

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/Auth/login', { email, password });
  return res.data;
};

export const registerUser = async (userData: RegisterRequest): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>('/Auth/register', userData);
  return res.data;
};
