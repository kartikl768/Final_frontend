import api from "../axiosInstance";
import { InterviewFeedback, type Interview, type User } from "../../data";

const ADMIN_BASE = '/admin/Interviews';
const INTERVIEWER_BASE = '/interviewer/Interviews';

// Backend DTO interface (PascalCase)
export interface InterviewDTO {
  InterviewId: number;
  ApplicationId: number;
  applicantName: string;
  InterviewerId: number;
  jobTitle?: string;
  HrId: number;
  RoundNumber: number;
  ScheduledTime: string;
  TeamsLink: string;
  MeetingDetails: string;
  Status: string;
  CreatedAt: string;
  UpdatedAt: string;
}


export type InterviewFeedback = {
  feedbackId: number;
  interviewId: number;
  interviewerId: number;
  comments: string;
  score: number;           // overall/aggregate score your backend stores
  result: number;          // mapped from recommendation
  createdAt: string;
  updatedAt: string;
};

// Keep the request minimal: only what the server actually needs
export type InterviewFeedbackRequest = {
  comments: string;
  score: number;
  result: number;
};


export type InterviewApi = {
  interviewId: number;
  applicationId: number;
  jobTitle: string;
  scheduledTime: string;  // e.g. "2025-10-16T08:31:00" (no timezone)
  teamsLink?: string;
};



export type LatestInterviewDto = {
  interviewId: number;
  applicationId: number;
  scheduledTime: string;
  status?: string;
  teamsLink?: string;
  roundNumber?: number;
  jobTitle?: string;
};



const mapStatusEnumToString = (status: number): Interview['status'] => {
  switch (status) {
    case 0: return 'Scheduled';
    case 1: return 'Completed';
    case 2: return 'Cancelled';
    case 3: return 'In Progress';
    default: return 'Scheduled';
  }
};
// Convert backend DTO to frontend format
const transformInterview = (dto: InterviewDTO): Interview => {
  return {
    interviewId: dto.interviewId,
    applicationId: dto.applicationId,
    interviewerId: dto.interviewerId,
    hrId: dto.hrId,
    roundNumber: dto.roundNumber,
    scheduledTime: dto.scheduledTime,
    teamsLink: dto.teamsLink,
    meetingDetails: dto.meetingDetails,
    status: mapStatusEnumToString(dto.status),
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
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



export const getLatestInterviewForApplication = async (
  applicationId: number
): Promise<LatestInterviewDto> => {
  const res = await api.get<LatestInterviewDto>(`/admin/interviews/application/${applicationId}/latest`);
  return res.data;
};

export const getFeedbackByApplicationId = async (id: number) : Promise<Interview> =>{
  const res = await api.get<Interview>(`/admin/Feedback/application/${id}`);
  console.log("printing the feedback", res);
  return res.data;
}


export const createInterviewForApplication = async (
  applicationId: number,
  payload: {
    interviewerId: number;
    scheduledTime: string;
    teamsLink: string;
    meetingDetails: string;
  }
) => {
  if (!applicationId) {
    console.error("Missing applicationId for interview creation");
    throw new Error("applicationId is required");
  }

  const res = await api.post(
    `/admin/Jobs/applications/${applicationId}/interviews`,
    {
      applicationId, // ✅ include in body
      ...payload,
    }
  );
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

export const getInterviewerInterviewById = async (): Promise<Interview> => {
  const res = await api.get<Interview>(`/interviews/interviewer`);
  console.log("printing interview by id", res.data);
  return res.data;
};


export const getAllFeedback = async (): Promise<InterviewFeedback[]> => {
  const res = await api.get<InterviewFeedback[]>("/api/Feedback");
  return res.data ?? [];
};


export const updateFeedback = async (
  id: number,
  payload: InterviewFeedbackRequest
): Promise<InterviewFeedback> => {
  const res = await api.post<InterviewFeedback>(`/Feedback/${id}`, payload);
  return res.data;
};



export interface InterviewAnalytics {
  jobTitle: string;
  roundNumber: number;
  interviewCount: number;
  selectedCount: number;
}

export const getInterviewAnalyticsByJobAndRound = async (): Promise<InterviewAnalytics[]> => {
  const res = await api.get<InterviewAnalytics[]>("/admin/interviews/analytics/by-job-round");
  return res.data;
};