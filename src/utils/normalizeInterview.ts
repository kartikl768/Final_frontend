export type UiInterview = {
  interviewId: number;
  applicationId: number;
  jobTitle: string;
  scheduledTime: Date;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  roundNumber: number;
  teamsLink?: string;
  candidateName?: string;
  candidateEmail?: string;
};

const parseLocalDateTime = (v: unknown): Date => {
  // Backend sends: "YYYY-MM-DDTHH:mm:ss" (no timezone)
  // In modern browsers, this is parsed as LOCAL time (what we want here).
  // We still guard against invalid strings.
  if (!v) return new Date(NaN);
  const s = String(v).replace(' ', 'T'); // safety: handle "YYYY-MM-DD HH:mm:ss"
  const d = new Date(s);
  return isNaN(d.getTime()) ? new Date(NaN) : d;
};

export const normalizeInterview = (raw: any): UiInterview => {
  const when = parseLocalDateTime(raw.scheduledTime ?? raw.scheduledAt ?? raw.datetime);
  return {
    interviewId: Number(raw.interviewId ?? raw.id),
    applicationId: Number(raw.applicationId),
    jobTitle: raw.jobTitle ?? "Interview",
    scheduledTime: when,
    // Backend doesn’t send status/round -> provide safe defaults
    status: "Scheduled",
    roundNumber: 1,
    teamsLink: raw.teamsLink ?? raw.meetingLink ?? "",
    // Not in payload (optional – consider enriching with another call)
    candidateName: raw.candidateName ?? undefined,
    candidateEmail: raw.candidateEmail ?? undefined
  };
};