import api from "../axiosInstance";
import type { Interview } from "../../data";

const ADMIN_BASE = '/admin/Interviews';
const INTERVIEWER_BASE = '/interviewer/Interviews';

// Backend DTO interface (PascalCase)
interface InterviewDTO {
  InterviewId: number;
  ApplicationId: number;
  InterviewerId: number;
  HrId: number;
  RoundNumber: number;
  ScheduledTime: string;
  TeamsLink: string;
  MeetingDetails: string;
  Status: string;
  CreatedAt: string;
  UpdatedAt: string;
}

// Convert backend DTO to frontend format
const transformInterview = (dto: InterviewDTO): Interview => {
  return {
    interviewId: dto.InterviewId,
    applicationId: dto.ApplicationId,
    interviewerId: dto.InterviewerId,
    hrId: dto.HrId,
    roundNumber: dto.RoundNumber,
    scheduledTime: dto.ScheduledTime,
    teamsLink: dto.TeamsLink,
    meetingDetails: dto.MeetingDetails,
    status: dto.Status as 'Scheduled' | 'Completed' | 'Cancelled' | 'In Progress',
    createdAt: dto.CreatedAt,
    updatedAt: dto.UpdatedAt,
  };
};

export interface CreateInterviewRequest {
  applicationId: number;
  interviewerId: number;
  roundNumber: number;
  scheduledTime: string;
  teamsLink: string;
  meetingDetails: string;
}

export interface UpdateInterviewRequest {
  scheduledTime?: string;
  teamsLink?: string;
  meetingDetails?: string;
  status?: 'Scheduled' | 'Completed' | 'Cancelled';
}

// Admin endpoints
export const getAllInterviews = async (): Promise<Interview[]> => {
  console.log("Interviews API: Fetching all interviews from", ADMIN_BASE);
  const res = await api.get<InterviewDTO[]>(ADMIN_BASE);
  console.log("Interviews API: Raw response from backend:", res.data);
  
  const transformedData = res.data.map(transformInterview);
  console.log("Interviews API: Transformed data:", transformedData);
  
  return transformedData;
};

export const getInterviewById = async (id: number): Promise<Interview> => {
  const res = await api.get<Interview>(`${ADMIN_BASE}/${id}`);
  return res.data;
};

export const createInterview = async (interviewData: CreateInterviewRequest): Promise<Interview> => {
  const res = await api.post<Interview>(ADMIN_BASE, interviewData);
  return res.data;
};

export const updateInterview = async (id: number, interviewData: UpdateInterviewRequest): Promise<Interview> => {
  const res = await api.put<Interview>(`${ADMIN_BASE}/${id}`, interviewData);
  return res.data;
};

export const deleteInterview = async (id: number): Promise<void> => {
  await api.delete(`${ADMIN_BASE}/${id}`);
};

// Interviewer endpoints
export const getMyInterviews = async (): Promise<Interview[]> => {
  const res = await api.get<Interview[]>(INTERVIEWER_BASE);
  return res.data;
};

export const getInterviewerInterviewById = async (id: number): Promise<Interview> => {
  const res = await api.get<Interview>(`${INTERVIEWER_BASE}/${id}`);
  return res.data;
};