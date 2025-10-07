import api from "../axiosInstance";
import type { JobRequirement } from "../../data";

const BASE = "/manager/JobRequirements";

export interface CreateJobRequirementRequest {
  jobTitle: string;
  jobDescription: string;
  yearsExperience: number;
  requiredSkills: string;
  numberOfOpenings: number;
  numberOfRounds: number;
}

export const getJobRequirements = async (): Promise<JobRequirement[]> => {
  const res = await api.get<JobRequirement[]>(BASE);
  console.log("Printing the job requirements", res);
  return res.data;
};

export const getJobRequirement = async (id: number): Promise<JobRequirement> => {
  const res = await api.get<JobRequirement>(`${BASE}/${id}`);
  return res.data;
};

export const createJobRequirement = async (jobData: CreateJobRequirementRequest): Promise<JobRequirement> => {
  // Convert to backend DTO format
  const dto = {
    JobTitle: jobData.jobTitle,
    JobDescription: jobData.jobDescription,
    YearsExperience: jobData.yearsExperience,
    RequiredSkills: jobData.requiredSkills,
    NumberOfOpenings: jobData.numberOfOpenings,
    NumberOfRounds: jobData.numberOfRounds,
  };
  console.log(dto);
  const res = await api.post<JobRequirement>(BASE, dto);
  console.log("111111111111111111");
  console.log(res);
  return res.data;
};

export const updateJobRequirement = async (
  id: number,
  jobData: Partial<JobRequirement>
): Promise<JobRequirement> => {
  // Convert status string to enum value
  const getStatusValue = (status: string) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Approved': return 1;
      case 'Rejected': return 2;
      default: return 0;
    }
  };

  // Convert to backend DTO format
  const dto = {
    RequirementId: jobData.requirementId,
    ManagerId: jobData.managerId,
    JobTitle: jobData.jobTitle,
    JobDescription: jobData.jobDescription,
    YearsExperience: jobData.yearsExperience,
    RequiredSkills: jobData.requiredSkills,
    NumberOfOpenings: jobData.numberOfOpenings,
    NumberOfRounds: jobData.numberOfRounds,
    Status: getStatusValue(jobData.status || 'Pending'),
    CreatedAt: jobData.createdAt ? new Date(jobData.createdAt) : new Date(),
    UpdatedAt: new Date(),
  };
  
  console.log('Sending DTO to backend:', dto);
  
  const res = await api.put<JobRequirement>(`${BASE}/${id}`, dto);
  return res.data;
};

export const deleteJobRequirement = async (id: number): Promise<void> => {
  await api.delete(`${BASE}/${id}`);
};