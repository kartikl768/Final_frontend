import api from "../axiosInstance";
import type { Application } from "../../data";

const CANDIDATE_BASE = '/candidate/Applications';
const ADMIN_BASE = '/admin/Applications';

// Backend DTO interface (PascalCase)
interface ApplicationDTO {
  ApplicationId: number;
  JobId: number;
  CandidateId: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  ResumePath: string;
  KeywordScore: number;
  Status: string;
  CurrentRound: number;
  CreatedAt: string;
  UpdatedAt: string;
}

// Convert backend DTO to frontend format
const transformApplication = (dto: ApplicationDTO): Application => {
  return {
    applicationId: dto.ApplicationId,
    jobId: dto.JobId,
    candidateId: dto.CandidateId,
    firstName: dto.FirstName,
    lastName: dto.LastName,
    email: dto.Email,
    phone: dto.Phone,
    resumePath: dto.ResumePath,
    keywordScore: dto.KeywordScore,
    status: dto.Status as 'Applied' | 'Interview Scheduled' | 'In Progress' | 'Rejected' | 'Selected',
    currentRound: dto.CurrentRound,
    createdAt: dto.CreatedAt,
    updatedAt: dto.UpdatedAt,
  };
};

export interface CreateApplicationRequest {
  jobId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resumePath: string;
}

export interface UpdateApplicationRequest {
  status?: 'Applied' | 'Interview Scheduled' | 'In Progress' | 'Rejected' | 'Selected';
  currentRound?: number;
}

// Candidate endpoints
export const getMyApplications = async (): Promise<Application[]> => {
  const res = await api.get<Application[]>(CANDIDATE_BASE);
  return res.data;
};

export const createApplication = async (applicationData: CreateApplicationRequest): Promise<Application> => {
  const res = await api.post<Application>(CANDIDATE_BASE, applicationData);
  return res.data;
};

export const getApplicationById = async (id: number): Promise<Application> => {
  const res = await api.get<Application>(`${CANDIDATE_BASE}/${id}`);
  return res.data;
};

// Admin endpoints
export const getAllApplications = async (): Promise<Application[]> => {
  console.log("Applications API: Fetching all applications from", ADMIN_BASE);
  const res = await api.get<ApplicationDTO[]>(ADMIN_BASE);
  console.log("Applications API: Raw response from backend:", res.data);
  
  const transformedData = res.data.map(transformApplication);
  console.log("Applications API: Transformed data:", transformedData);
  
  return transformedData;
};

export const getApplicationsByJob = async (jobId: number): Promise<Application[]> => {
  const res = await api.get<Application[]>(`${ADMIN_BASE}/job/${jobId}`);
  return res.data;
};

export const updateApplication = async (id: number, applicationData: UpdateApplicationRequest): Promise<Application> => {
  const res = await api.put<Application>(`${ADMIN_BASE}/${id}`, applicationData);
  return res.data;
};

export const deleteApplication = async (id: number): Promise<void> => {
  await api.delete(`${ADMIN_BASE}/${id}`);
};
