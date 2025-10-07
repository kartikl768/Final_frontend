import api from "../axiosInstance";
import type { User } from "../../data";

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
}

export const getUsers = async (): Promise<User[]> => {
  const res = await api.get<User[]>("/admin/users");
  return res.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const res = await api.get<User>(`/admin/users/${id}`);
  return res.data;
};

export const getInterviewers = async (): Promise<User[]> => {
  const res = await api.get<User[]>("/admin/Users/role?role=interviewer");
  return res.data;
};
export const createUser = async (userData: CreateUserRequest): Promise<User> => {
  const res = await api.post<User>("/admin/users", userData);
  return res.data;
};

export const updateUser = async (userData: Partial<User>): Promise<User> => {
  console.log("Updating user with data:", userData);
  const res = await api.put<User>(`/admin/users/${userData.userId}`, userData);
  return res.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/admin/users/${id}`);
};
