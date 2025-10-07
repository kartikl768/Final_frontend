import api from "../axiosInstance";

export interface ApplicationAnalytics {
  date: string;
  count: number;
}

export const getWeeklyApplications = async (): Promise<ApplicationAnalytics[]> => {
  const res = await api.get<ApplicationAnalytics[]>("/admin/Applications/analytics/weekly");
  return res.data;
};
