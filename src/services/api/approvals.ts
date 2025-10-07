import api from "../axiosInstance";
import type { Job, JobCreateDTO, JobRequirement } from "../../data";

const BASE = '/admin/JobRequirements';
const BASE1= '/admin/Jobs';
export interface ApprovalRequest {
  status: '0' | '1' | '2';
  comments?: string;
}

export const getPendingApprovals = async (): Promise<JobRequirement[]> => {
  
  const res = await api.get<JobRequirement[]>(`${BASE}`);
  const allRequirements = res.data;
  console.log("printing all requirements",allRequirements);
  const pending = allRequirements.filter((req) => req.status == "0");
  return pending;
};

// Approve the job requirement
export const approveJobRequirement = async (
  id: number,
  status: number
): Promise<JobRequirement> => {
  const res = await api.put<JobRequirement>(`${BASE}/${id}/status?status=${status}`);
  return res.data;
};


export const rejectJobRequirement = async (id: number, status: number): Promise<JobRequirement> => {
  const res = await api.put<JobRequirement>(`${BASE}/${id}/2`);
  return res.data;
};
