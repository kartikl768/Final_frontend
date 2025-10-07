import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Calendar, Video, MessageSquare, CheckCircle } from "lucide-react";
import FeedbackModal from "../../components/FeedbackComponent/FeedbackModal";
import api from "../../services/axiosInstance";
import { toast } from "react-toastify";

export default function InterviewManagement() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRound, setFilterRound] = useState("all");
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    if (user?.UserId) {
      fetchInterviews();
    }
  }, [user]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const res = await api.get("/Interviews");
      const data = Array.isArray(res.data) ? res.data : [res.data];
      const now = new Date();

      // ✅ Load submitted feedback IDs from localStorage
      const submittedFeedbackIds =
        JSON.parse(localStorage.getItem("submittedFeedbacks") || "[]") || [];

      const normalized = data.map((i: any) => {
        const scheduledDate = new Date(i.scheduledTime);
        let status = i.status
          ? i.status.charAt(0).toUpperCase() + i.status.slice(1).toLowerCase()
          : scheduledDate > now
          ? "Scheduled"
          : "Completed";

        return {
          ...i,
          status,
          roundNumber: i.roundNumber || 1,
          feedbackSubmitted: submittedFeedbackIds.includes(i.interviewId),
        };
      });

      setInterviews(normalized);
    } catch (error) {
      console.error("❌ Failed to fetch interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteInterview = async (interviewId: number) => {
    try {
      await api.put(`/interviewer/interviews/${interviewId}/complete`);
      toast.success("Interview completed successfully!");
      fetchInterviews();
    } catch (error) {
      console.error("Failed to complete interview:", error);
      toast.error ("Failed to complete interview. Please try again.");
    }
  };

  const handleProvideFeedback = (interview: any) => {
    setSelectedInterview(interview);
    setShowFeedbackModal(true);
  };

  // ✅ Mark interview feedback as submitted and disable button
  const handleFeedbackSuccess = () => {
    if (selectedInterview) {
      // Update UI to mark feedback as submitted
      setInterviews((prev) =>
        prev.map((i) =>
          i.interviewId === selectedInterview.interviewId
            ? { ...i, feedbackSubmitted: true }
            : i
        )
      );

      // Save submitted feedback locally
      const submittedFeedbackIds =
        JSON.parse(localStorage.getItem("submittedFeedbacks") || "[]") || [];
      if (!submittedFeedbackIds.includes(selectedInterview.interviewId)) {
        submittedFeedbackIds.push(selectedInterview.interviewId);
        localStorage.setItem(
          "submittedFeedbacks",
          JSON.stringify(submittedFeedbackIds)
        );
      }

      toast.success(`Feedback submitted for ${selectedInterview.applicantName}! 🎉`);
    }
    setShowFeedbackModal(false);
    setSelectedInterview(null);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-primary";
      case "Completed":
        return "bg-success";
      case "Cancelled":
        return "bg-danger";
      case "In Progress":
        return "bg-warning text-dark";
      default:
        return "bg-secondary";
    }
  };
  const getRoundBadgeColor = (round: number): string => {
  switch (round) {
    case 1:
      return "bg-primary"; // Blue
    case 2:
      return "bg-success"; // Green
    case 3:
      return "bg-warning"; // Yellow
    case 4:
      return "bg-danger";  // Red
    case 5:
      return "bg-info";    // Light Blue
    default:
      return "bg-secondary"; // Gray
  }
};

  const getStatusActions = (interview: any) => {
    const buttonStyle = {
      minWidth: "100px",
      padding: "6px 14px",
      borderRadius: "6px",
    };

    switch (interview.status) {
      case "Scheduled":
        return (
          <div className="d-flex justify-content-center align-items-center">
            {!!interview.teamsLink && (
              <a
                href={interview.teamsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm d-flex align-items-center justify-content-center"
                title="Join Meeting"
                style={buttonStyle}
              >
                <Video size={16} className="me-2" />
                Join
              </a>
            )}
          </div>
        );
      case "Completed":
        return (
          <div className="d-flex justify-content-center align-items-center">
            <button
              className={`btn btn-sm d-flex align-items-center justify-content-center ${
                interview.feedbackSubmitted ? "btn-outline-success" : "btn-primary"
              }`}
              onClick={() => handleProvideFeedback(interview)}
              style={buttonStyle}
              disabled={interview.feedbackSubmitted}
            >
              {interview.feedbackSubmitted ? (
                <>
                  <CheckCircle size={14} className="me-2 text-success" />
                  Submitted
                </>
              ) : (
                <>
                  <MessageSquare size={14} className="me-2" />
                  Feedback
                </>
              )}
            </button>
          </div>
        );
      case "In Progress":
        return (
          <div className="d-flex flex-column align-items-center justify-content-center gap-2">
            <button
              className="btn btn-success btn-sm w-75 d-flex justify-content-center"
              onClick={() => handleCompleteInterview(interview.interviewId)}
              style={{ borderRadius: "6px", padding: "6px 14px" }}
            >
              Complete
            </button>
            <button
              className={`btn btn-sm d-flex align-items-center justify-content-center ${
                interview.feedbackSubmitted ? "btn-outline-success" : "btn-primary"
              }`}
              onClick={() => handleProvideFeedback(interview)}
              style={buttonStyle}
              disabled={interview.feedbackSubmitted}
            >
              {interview.feedbackSubmitted ? (
                <>
                  <CheckCircle size={14} className="me-2 text-success" />
                  Submitted
                </>
              ) : (
                <>
                  <MessageSquare size={14} className="me-2" />
                  Feedback
                </>
              )}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const filteredInterviews = interviews.filter((interview) => {
    const matchesStatus =
      filterStatus === "all" || interview.status === filterStatus;
    const matchesRound =
      filterRound === "all" || interview.roundNumber?.toString() === filterRound;
    return matchesStatus && matchesRound;
  });

  if (loading) {
    return (
      <div className="container-fluid py-4 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Loading interviews...</p>
      </div>
    );
  }
  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h1 className="h2 fw-bold">Interview Management</h1>
        <p className="text-muted">
          Manage your assigned interviews and provide feedback
        </p>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-4">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filterRound}
            onChange={(e) => setFilterRound(e.target.value)}
          >
            <option value="all">All Rounds</option>
            {[1, 2, 3, 4, 5].map((round) => (
              <option key={round} value={round}>
                Round {round}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4 d-flex align-items-center text-muted">
          <Calendar size={16} className="me-1" />
          <small>{filteredInterviews.length} interviews</small>
        </div>
      </div>

      {/* Interviews Table */}
      <div className="card border-0 shadow-lg rounded-4 animate__animated animate__fadeIn">
  <div className="card-body p-0">
    <div className="table-responsive">
      <table className="table table-hover align-middle text-center mb-0 table-borderless">
        <thead className="table-light text-muted text-uppercase small">
          <tr>
            <th style={{ width: "15%", textAlign: "left", paddingLeft: "1.5rem" }}>Candidate</th>
            <th style={{ width: "25%", textAlign: "center" }}>Job Title</th>
            <th style={{ width: "10%" }}>Round</th>
            <th style={{ width: "25%" }}>Scheduled Time</th>
            <th style={{ width: "15%" }}>Status</th>
            <th style={{ width: "25%" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInterviews.map((interview) => (
            <tr key={interview.interviewId}>
              <td className="text-start ps-4">
                <div className="fw-semibold text-dark">{interview.applicantName}</div>
                <small className="text-muted d-block">{interview.email}</small>
              </td>
              <td>
                <div className="fw-semibold text-dark">{interview.jobTitle}</div>
              </td>
              <td>
                <span className={`badge ${getRoundBadgeColor(interview.roundNumber)} rounded-pill px-3`}>
                  Round {interview.roundNumber}
                </span>
              </td>
              <td>
                <div className="fw-medium text-dark">
                  {new Date(interview.scheduledTime).toLocaleDateString()}
                </div>
                <small className="text-muted">
                  {new Date(interview.scheduledTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>
              </td>
              <td>
                <span className={`badge rounded-pill px-3 py-2 ${getStatusBadgeColor(interview.status || "Scheduled")}`}>
                  {interview.status || "Scheduled"}
                </span>
              </td>
              <td>{getStatusActions(interview)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

      {filteredInterviews.length === 0 && (
        <div className="text-center py-5">
          <Calendar size={48} className="text-muted mb-3" />
          <h5 className="text-muted">No interviews found</h5>
          <p className="text-muted">
            Try adjusting your filters or check back later for new assignments.
          </p>
        </div>
      )}

      {/* ✅ Feedback Modal */}
      {showFeedbackModal && selectedInterview && (
        <FeedbackModal
          interview={selectedInterview}
          onClose={() => {
            setShowFeedbackModal(false);
            setSelectedInterview(null);
          }}
          onSuccess={handleFeedbackSuccess}
        />
      )}
    </div>
  );
}
