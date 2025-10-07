import api from "../axiosInstance";

export interface LoginRequest {
  email: string;
  password: string;
}


export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
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


// export const registerCandidate = async (data: RegisterCandidateRequest) => {
//   const payload = {
//     ...data,
//     role: 3, 
//   };
//   const res = await api.post<AuthResponse>(`/Auth/register`, payload);
//   return res.data;
// };
