import api from "../axiosInstance";
import type { Job } from "../../data";

// Candidate-facing job endpoints
const CANDIDATE_BASE = '/candidate/Jobs';
const ADMIN_BASE = '/admin/Jobs';

// Backend DTO interface
interface JobDTO {
  jobId: number;
  requirementId: number;
  hrId: number;
  jobTitle: string;
  jobDescription: string;
  yearsExperience: number;
  requiredSkills: string;
  numberOfOpenings: number;
  numberOfRounds: number;
  status: number; // 0=Active, 1=Inactive, etc.
  createdAt: string;
  updatedAt: string;
}

// Convert backend DTO to frontend format
const transformJob = (dto: JobDTO): Job => {
  console.log("Jobs API: Transforming DTO:", dto);
  
  const getStatusString = (status: number): string => {
    switch (status) {
      case 0: return 'Active';
      case 1: return 'Inactive';
      default: return 'Active';
    }
  };

  // Parse RequiredSkills from string to array
  const parseSkills = (skillsString: string): string[] => {
    if (!skillsString) return [];
    try {
      // Try to parse as JSON array first
      if (skillsString.startsWith('[') && skillsString.endsWith(']')) {
        return JSON.parse(skillsString);
      }
      // Otherwise split by comma
      return skillsString.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    } catch (error) {
      console.warn("Failed to parse skills string:", skillsString);
      return skillsString.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    }
  };

  const transformed = {
    jobId: dto.jobId ?? 0,
    requirementId: dto.requirementId ?? 0,
    hrId: dto.hrId ?? 0,
    jobTitle: dto.jobTitle ?? 'N/A',
    jobDescription: dto.jobDescription ?? 'No description',
    yearsExperience: dto.yearsExperience ?? 0,
    requiredSkills: parseSkills(dto.requiredSkills ?? ''),
    numberOfOpenings: dto.numberOfOpenings ?? 0,
    numberOfRounds: dto.numberOfRounds ?? 0,
    status: getStatusString(dto.status ?? 0),
    createdAt: dto.createdAt ?? new Date().toISOString(),
    updatedAt: dto.updatedAt ?? new Date().toISOString(),
  };
  
  console.log("Jobs API: Transformed result:", transformed);
  return transformed;
};

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
  console.log("Jobs API: Fetching jobs from", CANDIDATE_BASE);
  try {
    const res = await api.get<JobDTO[]>(CANDIDATE_BASE);
    console.log("Jobs API: Raw response from backend:", res.data);
    console.log("Jobs API: Response status:", res.status);
    console.log("Jobs API: Data length:", res.data?.length || 0);
    
    if (!res.data || res.data.length === 0) {
      console.warn("Jobs API: No job data received from backend");
      return [];
    }
    
    if (res.data && res.data.length > 0) {
      console.log("Jobs API: First raw item:", res.data[0]);
      console.log("Jobs API: First item keys:", Object.keys(res.data[0]));
      console.log("Jobs API: First item jobId:", res.data[0].jobId);
      console.log("Jobs API: First item jobTitle:", res.data[0].jobTitle);
    }
    
    let transformedData: Job[] = [];
    try {
      transformedData = res.data.map(transformJob);
      console.log("Jobs API: Transformed data:", transformedData);
      
      if (transformedData && transformedData.length > 0) {
        console.log("Jobs API: First transformed item:", transformedData[0]);
        console.log("Jobs API: First transformed item keys:", Object.keys(transformedData[0]));
      }
    } catch (error) {
      console.error("Jobs API: Error transforming data:", error);
      console.error("Jobs API: Raw data that caused error:", res.data);
      return [];
    }
    
    return transformedData;
  } catch (error) {
    console.error("Jobs API: Error fetching jobs:", error);
    return [];
  }
};

export const getJobById = async (id: number): Promise<Job> => {
  const res = await api.get<JobDTO>(`${CANDIDATE_BASE}/${id}`);
  return transformJob(res.data);
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
