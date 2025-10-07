import api from "../axiosInstance";
import type { JobRequirement } from "../../data";

const BASE = '/admin/JobRequirements';

export interface ApprovalRequest {
  status: '0' | '1' | '2';
  comments?: string;
}

export const getPendingApprovals = async (): Promise<JobRequirement[]> => {
  const res = await api.get<JobRequirement[]>(`${BASE}/0`);
  return res.data;
};

export const approveJobRequirement = async (id: number, approvalData: ApprovalRequest): Promise<JobRequirement> => {
  const res = await api.put<JobRequirement>(`${BASE}/${id}/1`, approvalData);
  return res.data;
};

export const rejectJobRequirement = async (id: number, approvalData: ApprovalRequest): Promise<JobRequirement> => {
  const res = await api.put<JobRequirement>(`${BASE}/${id}/2`, approvalData);
  return res.data;
};
