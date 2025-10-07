import api from "../axiosInstance";
import type { Application, Job } from "../../data";

const CANDIDATE_BASE = '/candidate/applications';
const ADMIN_BASE = '/admin/Applications';

// Backend DTO interface (camelCase - matching actual backend response)
interface ApplicationDTO {
  applicationId: number;
  job:{
    jobId: number;
    jobTitle: string;
    yearsExperience: string;
    numberOfRounds: number;
    numberOfOpenings: number;
    requiredSkills: string[];
  }
  candidateId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resumePath: string;
  keywordScore: number;
  status: string;
  currentRound: number;
  createdAt: string;
  updatedAt: string;
}

const mapStatusEnumToString = (status: number): Application['status'] => {
  switch (status) {
    case 0: return 'Applied';
    case 1: return 'UnderReview';
    case 2: return 'InterviewScheduled';
    case 3: return 'InProgress';
    case 4: return 'Selected';
    case 5: return 'Rejected';
    default: return 'Applied'; // fallback
  }
};
const transformApplication = (dto: ApplicationDTO, jobMap:Record<number,Job>): Application => {
  console.log("Applications API: Transforming DTO:", dto);

  const transformed: Application = {
    applicationId: dto.applicationId,
    job: jobMap[dto.jobId] ,
    candidateId: dto.candidateId,
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    phone: dto.phone,
    resumePath: dto.resumePath,
    keywordScore: dto.keywordScore,
    status: mapStatusEnumToString(dto.status as number), // 👈 convert number to string
    currentRound: dto.currentRound,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt ?? "",
  };

  console.log("Applications API: Transformed result:", transformed);
  return transformed;
};


export default interface CreateApplicationRequest {
  jobId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resume: File;
}

export interface UpdateApplicationRequest {
  status?: 'Applied' | 'UnderReview' | 'InterviewScheduled' | 'InProgress' | 'Selected' | 'Rejected';
  currentRound?: number;
}

// Candidate endpoints
export const getAllJobs = async (): Promise<Job[]> => {
  const res = await api.get<Job[]>('/candidate/Jobs'); // Adjust endpoint as needed
  return res.data;
};
export const getMyApplications = async (): Promise<Application[]> => {
  const [applicationsRes, jobsRes] = await Promise.all([
    api.get<ApplicationDTO[]>(CANDIDATE_BASE),
    getAllJobs()
  ]);

  const jobMap: Record<number, Job> = {};
  jobsRes.forEach(job => {
    jobMap[job.jobId] = job;
  });

  const transformedData = applicationsRes.data.map(dto => transformApplication(dto, jobMap));
  return transformedData;
};


export const createApplication = async (applicationData: CreateApplicationRequest): Promise<Application> => {
  console.log("Applications API: Creating application with data:", applicationData);
  
  // Create FormData for file upload
  const formData = new FormData();
  formData.append('resume', applicationData.resume);
  formData.append('jobId', applicationData.jobId.toString());
  formData.append('firstName', applicationData.firstName);
  formData.append('lastName', applicationData.lastName);
  formData.append('email', applicationData.email);
  formData.append('phone', applicationData.phone);
  
  const res = await api.post<ApplicationDTO>(CANDIDATE_BASE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log("Applications API: Raw response from backend:", res.data);
  
  const transformed = transformApplication(res.data);
  console.log("Applications API: Transformed result:", transformed);
  
  return transformed;
};

export const getApplicationById = async (id: number): Promise<Application> => {
  const res = await api.get<ApplicationDTO[]>(`${ADMIN_BASE}/job/${id}`);
  console.log("Applications API: Raw response from backend:", res.data);
  return transformApplication(res.data);
};

// Admin endpoints
export const getAllApplications = async (): Promise<Application[]> => {
  console.log("Applications API: Fetching all applications from", ADMIN_BASE);
  const res = await api.get<ApplicationDTO[]>(`${ADMIN_BASE}`);
  console.log("Applications API: Raw response from backend:", res.data);
  
  const transformedData = res.data.map(transformApplication);
  console.log("Applications API: Transformed data:", transformedData);
  
  return transformedData;
};
 // adjust path if needed

export const getApplicantById = async (applicationId: number): Promise<Application> => {
  const [res, jobs] = await Promise.all([
    api.get<ApplicationDTO>(`${ADMIN_BASE}/${applicationId}`),
    getAllJobs()
  ]);

  const jobMap: Record<number, Job> = {};
  jobs.forEach(job => {
    jobMap[job.jobId] = job;
  });

  const transformed = transformApplication(res.data, jobMap);
  return transformed;
};

export const getApplicationsByJob = async (jobId: number): Promise<Application[]> => {
  const res = await api.get<Application[]>(`${ADMIN_BASE}/job/${jobId}`);
  console.log("printing the data", res);
  return res.data;
};

export const updateApplication = async (id: number): Promise<Application> => {
  const res = await api.put<Application>(`${ADMIN_BASE}/${id}/reject`);
  return res.data;
};

// export const updateApplication = async (id: number): Promise<Application> => {
//   const res = await api.put<Application>(`${ADMIN_BASE}/${id}/scheduled`);
//   return res.data;
// };

export const deleteApplication = async (id: number): Promise<void> => {
  await api.delete(`${ADMIN_BASE}/${id}`);
};

export interface JobApplicationsAnalytics {
  jobTitle: string;
  applicantCount: number;
}

export const getApplicationsByJobAnalytics = async (): Promise<JobApplicationsAnalytics[]> => {
  const res = await api.get<JobApplicationsAnalytics[]>("/admin/Applications/analytics/by-job");
  return res.data;
};