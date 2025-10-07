import api from "../axiosInstance";
import type { InterviewFeedback } from "../../data";

const BASE = '/interviewer/Feedback';

export interface CreateFeedbackRequest {
  interviewId: number;
  comments: string;
  score: number;
  result: 'Accepted' | 'Rejected' | 'Pending';
}

export interface UpdateFeedbackRequest {
  comments?: string;
  score?: number;
  result?: 'Accepted' | 'Rejected' | 'Pending';
}

export const getFeedbackByInterview = async (interviewId: number): Promise<InterviewFeedback> => {
  const res = await api.get<InterviewFeedback>(`${BASE}/interview/${interviewId}`);
  return res.data;
};

export const createFeedback = async (feedbackData: CreateFeedbackRequest): Promise<InterviewFeedback> => {
  const res = await api.post<InterviewFeedback>(BASE, feedbackData);
  return res.data;
};

export const updateFeedback = async (id: number, feedbackData: UpdateFeedbackRequest): Promise<InterviewFeedback> => {
  const res = await api.put<InterviewFeedback>(`${BASE}/${id}`, feedbackData);
  return res.data;
};

export const deleteFeedback = async (id: number): Promise<void> => {
  await api.delete(`${BASE}/${id}`);
};
