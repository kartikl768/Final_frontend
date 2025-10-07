import api from "../axiosInstance";
import type { Job } from "../../data";

// Candidate-facing job endpoints
const CANDIDATE_BASE = '/candidate/Jobs';
const ADMIN_BASE = '/admin/Jobs';

export interface CreateJobRequest {
  requirementId: number;
  jobTitle: string;
  jobDescription: string;
  yearsExperience: number;
  requiredSkills: string;
  numberOfOpenings: number;
  numberOfRounds: number;
}

// Candidate endpoints
export const getJobs = async (): Promise<Job[]> => {
  const res = await api.get<Job[]>(CANDIDATE_BASE);
  return res.data;
};

export const getJobById = async (id: number): Promise<Job> => {
  const res = await api.get<Job>(`${CANDIDATE_BASE}/${id}`);
  return res.data;
};

// Admin endpoints
export const getAllJobs = async (): Promise<Job[]> => {
  const res = await api.get<Job[]>(ADMIN_BASE);
  return res.data;
};

export const createJob = async (jobData: CreateJobRequest): Promise<Job> => {
  const res = await api.post<Job>(ADMIN_BASE, jobData);
  return res.data;
};

export const updateJob = async (id: number, jobData: Partial<Job>): Promise<Job> => {
  const res = await api.put<Job>(`${ADMIN_BASE}/${id}`, jobData);
  return res.data;
};

export const deleteJob = async (id: number): Promise<void> => {
  await api.delete(`${ADMIN_BASE}/${id}`);
};
