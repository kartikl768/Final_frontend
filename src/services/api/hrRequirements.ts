import api from "../axiosInstance";
import type { JobRequirement } from "../../data";

const BASE = "/admin/JobRequirements";

// Backend DTO interface (PascalCase)
interface JobRequirementDTO {
  RequirementId: number;
  ManagerId: number;
  JobTitle: string;
  JobDescription: string;
  YearsExperience: number;
  RequiredSkills: string;
  NumberOfOpenings: number;
  NumberOfRounds: number;
  Status: '0' | '1' | '2'; // 0=Pending, 1=Approved, 2=Rejected
  CreatedAt: string;
  UpdatedAt: string;
}

// Convert backend DTO to frontend format
const transformJobRequirement = (dto: JobRequirementDTO): JobRequirement => {
  console.log("HR Requirements API: Transforming DTO:", dto);
  console.log("HR Requirements API: DTO.JobTitle:", dto.JobTitle);
  console.log("HR Requirements API: DTO keys:", Object.keys(dto));
  
  const getStatusString = (status: number): '0' | '1' | '2' => {
    switch (status) {
      case 0: return '0';
      case 1: return '1';
      case 2: return '2';
      default: return '0';
    }
  };

  // Add safety checks for undefined values
  if (!dto) {
    console.error("HR Requirements API: DTO is undefined or null");
    throw new Error("Invalid job requirement data");
  }

  const transformed = {
    requirementId: dto.RequirementId || 0,
    managerId: dto.ManagerId || 0,
    jobTitle: dto.JobTitle || 'N/A',
    jobDescription: dto.JobDescription || 'No description',
    yearsExperience: dto.YearsExperience || 0,
    requiredSkills: dto.RequiredSkills || 'None',
    numberOfOpenings: dto.NumberOfOpenings || 0,
    numberOfRounds: dto.NumberOfRounds || 0,
    status: getStatusString(parseInt(dto.Status)),
    createdAt: dto.CreatedAt || new Date().toISOString(),
    updatedAt: dto.UpdatedAt || new Date().toISOString(),
  };
  
  console.log("HR Requirements API: Transformed result:", transformed);
  console.log("HR Requirements API: Transformed jobTitle:", transformed.jobTitle);
  return transformed;
};

export const getAllJobRequirements = async (): Promise<JobRequirement[]> => {
  console.log("HR Requirements API: Fetching all job requirements from", BASE);
  const res = await api.get<any[]>(BASE); // Use any[] to handle any response format
  console.log("HR Requirements API: Raw response from backend:", res.data);
  console.log("HR Requirements API: Response data type:", typeof res.data);
  console.log("HR Requirements API: Response data length:", res.data?.length);
  
  if (res.data && res.data.length > 0) {
    console.log("HR Requirements API: First raw item:", res.data[0]);
    console.log("HR Requirements API: First item keys:", Object.keys(res.data[0]));
    console.log("HR Requirements API: First item values:", res.data[0]);
  }
  
  let transformedData: JobRequirement[] = [];
  try {
    transformedData = res.data.map((item: any) => {
      console.log("HR Requirements API: Processing item:", item);
      
      // Handle different possible field name formats
      const dto: JobRequirementDTO = {
        RequirementId: item.RequirementId || item.requirementId || item.id || 0,
        ManagerId: item.ManagerId || item.managerId || 0,
        JobTitle: item.JobTitle || item.jobTitle || item.title || 'N/A',
        JobDescription: item.JobDescription || item.jobDescription || item.description || 'No description',
        YearsExperience: item.YearsExperience || item.yearsExperience || item.experience || 0,
        RequiredSkills: item.RequiredSkills || item.requiredSkills || item.skills || 'None',
        NumberOfOpenings: item.NumberOfOpenings || item.numberOfOpenings || item.openings || 0,
        NumberOfRounds: item.NumberOfRounds || item.numberOfRounds || item.rounds || 0,
        Status: item.Status !== undefined ? item.Status : (item.status !== undefined ? item.status : 0),
        CreatedAt: item.CreatedAt || item.createdAt || new Date().toISOString(),
        UpdatedAt: item.UpdatedAt || item.updatedAt || new Date().toISOString(),
      };
      
      console.log("HR Requirements API: Normalized DTO:", dto);
      return transformJobRequirement(dto);
    });
    
    console.log("HR Requirements API: Transformed data:", transformedData);
    
    if (transformedData && transformedData.length > 0) {
      console.log("HR Requirements API: First transformed item:", transformedData[0]);
      console.log("HR Requirements API: First transformed item keys:", Object.keys(transformedData[0]));
    }
  } catch (error) {
    console.error("HR Requirements API: Error transforming data:", error);
    console.error("HR Requirements API: Raw data that caused error:", res.data);
    return [];
  }
  
  return transformedData;
};

export const getJobRequirementById = async (id: number): Promise<JobRequirement> => {
  const res = await api.get<JobRequirementDTO>(`${BASE}/${id}`);
  return transformJobRequirement(res.data);
};
