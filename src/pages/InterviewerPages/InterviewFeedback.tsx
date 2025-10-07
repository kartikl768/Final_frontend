import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Star, Clock, Calendar, User, Briefcase, Video } from "lucide-react";
import { getAllInterviews, type InterviewDTO } from "../../services/api/interviews";
import {
  getFeedbackByInterview,
  upsertFeedback,
  uiToServerResult,
  serverResultToUi,
  type InterviewFeedbackRequest,
} from "../../services/api/feedback";

type Recommendation = "Strong Hire" | "Hire" | "Pending" | "No Hire" | "Strong No Hire";

type FormState = {
  technicalSkills: number;
  communicationSkills: number;
  problemSolving: number;
  culturalFit: number;
  overallRating: number; // used as `score` in backend
  comments: string;
  recommendation: Recommendation;
};

const RECOMMENDATIONS: Recommendation[] = [
  "Strong Hire",
  "Hire",
  "Pending",
  "No Hire",
  "Strong No Hire",
];

const resultMap: Record<Recommendation, number> = {
  "Strong Hire": 2,
  "Hire": 1,
  "Pending": 0,
  "No Hire": -1,
  "Strong No Hire": -2,
};

// Small star rating control
function StarRating({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (val: number) => void;
  label: string;
}) {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <div className="d-flex align-items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="btn btn-link p-0 me-1"
            onClick={() => onChange(star)}
            aria-label={`${label}: ${star} star`}
          >
            <Star
              size={18}
              className={star <= value ? "text-warning fill-current" : "text-muted"}
            />
          </button>
        ))}
        <span className="ms-2 text-muted">({value}/5)</span>
      </div>
    </div>
  );
}

export default function InterviewFeedbackPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // if you route like /interviews/feedback/:id
  const location = useLocation() as {
    state?: { interview?: Partial<InterviewDTO> & { jobTitle?: string } };
  };

  // Either passed from dashboard via state OR we fetch by :id
  const passedInterview = location.state?.interview;

  const [interview, setInterview] = React.useState<InterviewDTO | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const [form, setForm] = React.useState<FormState>({
    technicalSkills: 0,
    communicationSkills: 0,
    problemSolving: 0,
    culturalFit: 0,
    overallRating: 0,
    comments: "",
    recommendation: "Pending",
  });

  // Fetch interview details if not provided
  React.useEffect(() => {
    let active = true;

    const ensureInterview = async () => {
      try {
        setLoading(true);
        setError(null);

        // Prefer state payload (fastest), else use route param
        if (passedInterview && passedInterview.interviewId) {
          // Normalize to Detail DTO shape
          const normalized: InterviewDTO = {
            interviewId: Number(passedInterview.interviewId),
            interviewerId: Number(passedInterview.interviewerId ?? 0),
            applicationId: Number(passedInterview.applicationId ?? 0),
            applicantName:
              (passedInterview as any).candidateName ??
              passedInterview.applicantName ??
              "Candidate",
            email: (passedInterview as any).candidateEmail ?? "",
            resumePath: (passedInterview as any).resumePath,
            keywordScore: (passedInterview as any).keywordScore,
            currentRound: (passedInterview as any).currentRound ?? 1,
            teamsLink: passedInterview.teamsLink,
            scheduledTime: String(passedInterview.scheduledTime),
            status: (passedInterview as any).status ?? "Completed",
            jobTitle: (passedInterview as any).jobTitle ?? "Interview",
          };
          if (active) setInterview(normalized);
        } else if (id) {
          const details = await getAllInterviews();
          if (active) setInterview(details);
        } else {
          throw new Error("No interview passed and no :id present in the route.");
        }
      } catch (e: any) {
        if (active) setError(e?.message ?? "Failed to load interview details.");
      } finally {
        if (active) setLoading(false);
      }
    };

    ensureInterview();
    return () => {
      active = false;
    };
  }, [id, passedInterview]);

  // If feedback already exists for this interview, prefill the form
//   React.useEffect(() => {
//     let active = true;
//     const prefill = async () => {
//       if (!interview?.interviewId) return;
//       try {
//         const all = await getAllFeedback();
//         const existing = all.find((f) => f.interviewId === interview.interviewId);
//         if (existing && active) {
//           setForm((prev) => ({
//             ...prev,
//             comments: existing.comments ?? "",
//             overallRating: typeof existing.score === "number" ? existing.score : 0,
//             // If you want to map existing.result back to a recommendation:
//             recommendation:
//               (Object.keys(resultMap).find(
//                 (k) => resultMap[k as Recommendation] === existing.result
//               ) as Recommendation) ?? "Pending",
//           }));
//         }
//       } catch {
//         // ignore — treat as new feedback
//       }
//     };
//     prefill();
//     return () => {
//       active = false;
//     };
//   }, [interview?.interviewId]);

//   const mapToPayload = (): InterviewFeedbackRequest => {
//     // If you want to compute score from the 4 sub-categories, you can do:
//     // const avg =
//     //   (form.technicalSkills + form.communicationSkills + form.problemSolving + form.culturalFit) / 4;
//     // const score = Math.round(avg);

//     // For now, use overallRating directly as the score:
//     const score = form.overallRating;

//     return {
//       comments: form.comments,
//       score,
//       result: resultMap[form.recommendation] ?? 0,
//     };
//   };

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!interview?.interviewId) return;
//     if (!form.comments?.trim()) {
//       alert("Please add comments before submitting.");
//       return;
//     }
//     if (form.overallRating <= 0) {
//       // Optional safeguard: ensure at least 1 star chosen
//       const proceed = confirm(
//         "Overall rating is 0. Do you still want to submit?"
//       );
//       if (!proceed) return;
//     }

//     try {
//       setSubmitting(true);
//       const payload = mapToPayload();
//       const saved: InterviewFeedback = await updateFeedback(interview.interviewId, payload);
//       console.log("Feedback saved:", saved);
//       alert("Feedback submitted successfully!");

//       // Navigate the user back (adjust path to your desired destination)
//       navigate("/interviewer/interviews", { replace: true });
//     } catch (err: any) {
//       console.error(err);
//       alert("Failed to submit feedback. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };



// ...

// Prefill existing feedback (if present)
React.useEffect(() => {
  let active = true;
  (async () => {
    if (!interview?.interviewId) return;
    try {
      const list = await getFeedbackByInterview(interview.interviewId);
      const existing = list?.[0]; // backend returns an array
      if (existing && active) {
        setForm(prev => ({
          ...prev,
          comments: existing.comments ?? "",
          overallRating: existing.score ?? 0,
          recommendation: serverResultToUi(existing.result), // "Accepted" | "Rejected" | "Pending"
        }));
      }
    } catch (err) {
      // no existing feedback or error → ignore for prefill
      console.warn("No existing feedback or failed to load feedback:", err);
    }
  })();
  return () => { active = false; };
}, [interview?.interviewId]);

// Submit handler (upsert)
const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!interview?.interviewId) return;

  const payload: InterviewFeedbackRequest = {
    comments: form.comments,
    score: form.overallRating,            // or compute a weighted average
    result: uiToServerResult(form.recommendation),
  };

  setSubmitting(true);
  try {
    await upsertFeedback(interview.interviewId, payload);
    alert("Feedback submitted successfully!");
    navigate("/interviewer/interviews", { replace: true });
  } catch (err) {
    console.error(err);
    alert("Failed to submit feedback. Please try again.");
  } finally {
    setSubmitting(false);
  }
};

  const formatDateTime = (s?: string) => {
    if (!s) return "";
    const d = new Date(String(s).replace(" ", "T"));
    if (isNaN(d.getTime())) return s;
    return `${d.toLocaleDateString()} • ${d.toLocaleTimeString()}`;
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger" role="alert">
          {error ?? "Interview not found."}
        </div>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1">Interview Feedback</h1>
        <p className="text-muted mb-0">Please provide your assessment and recommendation.</p>
      </div>

      {/* Interview summary card */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6 d-flex align-items-center">
              <User size={18} className="text-muted me-2" />
              <div>
                <div className="fw-medium">{interview.applicantName ?? "Candidate"}</div>
                <small className="text-muted">{interview.email}</small>
              </div>
            </div>
            <div className="col-md-3 d-flex align-items-center">
              <Briefcase size={18} className="text-muted me-2" />
              <div>
                <div className="fw-medium">{(interview as any).jobTitle ?? "Interview"}</div>
                <small className="text-muted">Application #{interview.applicationId}</small>
              </div>
            </div>
            <div className="col-md-3 d-flex align-items-center">
              <Clock size={18} className="text-muted me-2" />
              <div>
                <div className="fw-medium">{formatDateTime(interview.scheduledTime)}</div>
                {interview.teamsLink && (
                  <small className="text-muted d-flex align-items-center">
                    <Video size={14} className="me-1" />
                    <a
                      href={interview.teamsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join Meeting
                    </a>
                  </small>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback form */}
      <form onSubmit={onSubmit}>
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <StarRating
                  label="Technical Skills"
                  value={form.technicalSkills}
                  onChange={(v) => setForm((f) => ({ ...f, technicalSkills: v }))}
                />
              </div>
              <div className="col-md-6">
                <StarRating
                  label="Communication Skills"
                  value={form.communicationSkills}
                  onChange={(v) => setForm((f) => ({ ...f, communicationSkills: v }))}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <StarRating
                  label="Problem Solving"
                  value={form.problemSolving}
                  onChange={(v) => setForm((f) => ({ ...f, problemSolving: v }))}
                />
              </div>
              <div className="col-md-6">
                <StarRating
                  label="Cultural Fit"
                  value={form.culturalFit}
                  onChange={(v) => setForm((f) => ({ ...f, culturalFit: v }))}
                />
              </div>
            </div>

            <StarRating
              label="Overall Rating"
              value={form.overallRating}
              onChange={(v) => setForm((f) => ({ ...f, overallRating: v }))}
            />

            <div className="mb-3">
              <label className="form-label">Recommendation</label>
              <select
                className="form-select"
                value={form.recommendation}
                onChange={(e) =>
                  setForm((f) => ({ ...f, recommendation: e.target.value as Recommendation }))
                }
                required
              >
                {RECOMMENDATIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-0">
              <label className="form-label">Comments</label>
              <textarea
                className="form-control"
                rows={5}
                placeholder="Provide detailed feedback about the candidate's performance..."
                value={form.comments}
                onChange={(e) => setForm((f) => ({ ...f, comments: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="card-footer bg-white d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}