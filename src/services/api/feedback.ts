import api from "../axiosInstance";

// Server's canonical model (based on your curl)
export type InterviewFeedback = {
  feedbackId: number;
  interviewId: number;
  interviewerId: number;
  comments: string;
  score: number;     // numeric score from server
  result: number;    // numeric: e.g., 1=Accepted, 0=Pending, -1=Rejected (adjust as per your API)
  createdAt: string;
  updatedAt: string;
};

// For creating/updating from the UI
export type InterviewFeedbackRequest = {
  comments: string;
  score: number;
  // map Accepted|Rejected|Pending -> number on the UI side
  result: number;
};
export type UiResult = "Accepted" | "Rejected" | "Pending";

export const uiToServerResult = (r: UiResult): number => {
  switch (r) {
    case "Accepted": return 1;
    case "Rejected": return -1;
    case "Pending":
    default: return 0;
  }
};

export const serverResultToUi = (n: number): UiResult => {
  if (n === 1) return "Accepted";
  if (n === -1) return "Rejected";
  return "Pending";
};

// ---------------------------
// Correct BASE + endpoints
// ---------------------------
const BASE = "/Feedback"; 

// GET /api/Feedback/{interviewId}  -> returns an ARRAY
export const getFeedbackByInterview = async (
  interviewId: number
  
): Promise<InterviewFeedback[]> => {
  console.log("Printing Interview ID:",interviewId);
  console.log("Calling URL:", `${BASE}/${interviewId}`);
  const res = await api.get<InterviewFeedback[]>(`${BASE}/${interviewId}`);
  console.log("printing the feedback", res);  
  return res.data ?? [];
};

// POST /api/Feedback/{interviewId} -> create/update (upsert) for that interview
export const upsertFeedback = async (
  interviewId: number,
  payload: InterviewFeedbackRequest
): Promise<InterviewFeedback> => {
  const res = await api.post<InterviewFeedback>(`${BASE}/${interviewId}`, payload);
  return res.data;
};

// If your backend also supports PUT by feedbackId, keep a separate helper (optional)
export const updateFeedbackById = async (
  feedbackId: number,
  payload: Partial<InterviewFeedbackRequest>
): Promise<InterviewFeedback> => {
  const res = await api.put<InterviewFeedback>(`${BASE}/${feedbackId}`, payload);
  return res.data;
};