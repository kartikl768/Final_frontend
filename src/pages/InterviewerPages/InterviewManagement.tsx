import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle,
  Video,
  MessageSquare,
  Edit,
  Eye
} from "lucide-react";

export default function InterviewManagement() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRound, setFilterRound] = useState("all");
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await fetch(`/api/interviewer/interviews?interviewerId=${user?.UserId}`);
      const data = await response.json();
      setInterviews(data);
    } catch (error) {
      console.error('Failed to fetch interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInterviews = interviews.filter(interview => {
    const matchesStatus = filterStatus === "all" || interview.status === filterStatus;
    const matchesRound = filterRound === "all" || interview.roundNumber.toString() === filterRound;
    return matchesStatus && matchesRound;
  });

  const handleStartInterview = async (interviewId: number) => {
    try {
      const response = await fetch(`/api/interviewer/interviews/${interviewId}/start`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        await fetchInterviews(); // Refresh the list
        alert('Interview started successfully!');
      } else {
        alert('Failed to start interview. Please try again.');
      }
    } catch (error) {
      console.error('Failed to start interview:', error);
      alert('Failed to start interview. Please try again.');
    }
  };

  const handleCompleteInterview = async (interviewId: number) => {
    try {
      const response = await fetch(`/api/interviewer/interviews/${interviewId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        await fetchInterviews(); // Refresh the list
        alert('Interview completed successfully!');
      } else {
        alert('Failed to complete interview. Please try again.');
      }
    } catch (error) {
      console.error('Failed to complete interview:', error);
      alert('Failed to complete interview. Please try again.');
    }
  };

  const handleCancelInterview = async (interviewId: number) => {
    if (!window.confirm('Are you sure you want to cancel this interview?')) {
      return;
    }

    try {
      const response = await fetch(`/api/interviewer/interviews/${interviewId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        await fetchInterviews(); // Refresh the list
        alert('Interview cancelled successfully!');
      } else {
        alert('Failed to cancel interview. Please try again.');
      }
    } catch (error) {
      console.error('Failed to cancel interview:', error);
      alert('Failed to cancel interview. Please try again.');
    }
  };

  const handleProvideFeedback = (interview: any) => {
    setSelectedInterview(interview);
    setShowFeedbackModal(true);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Scheduled": return "bg-primary";
      case "Completed": return "bg-success";
      case "Cancelled": return "bg-danger";
      case "In Progress": return "bg-warning text-dark";
      default: return "bg-secondary";
    }
  };

  const getStatusActions = (interview: any) => {
    switch (interview.status) {
      case "Scheduled":
        return (
          <div className="d-flex gap-2">
            {interview.teamsLink && (
              <a
                href={interview.teamsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-primary"
                title="Join Meeting"
              >
                <Video size={14} />
              </a>
            )}
            <button
              className="btn btn-sm btn-success"
              onClick={() => handleStartInterview(interview.interviewId)}
            >
              Start Interview
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => handleCancelInterview(interview.interviewId)}
            >
              Cancel
            </button>
          </div>
        );
      case "In Progress":
        return (
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => handleCompleteInterview(interview.interviewId)}
            >
              Complete Interview
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => handleProvideFeedback(interview)}
            >
              <MessageSquare size={14} className="me-1" />
              Feedback
            </button>
          </div>
        );
      case "Completed":
        return (
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => handleProvideFeedback(interview)}
            >
              <MessageSquare size={14} className="me-1" />
              View/Edit Feedback
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading interviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h1 className="h2 fw-bold">Interview Management</h1>
        <p className="text-muted">Manage your assigned interviews and provide feedback</p>
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
            <option value="1">Round 1</option>
            <option value="2">Round 2</option>
            <option value="3">Round 3</option>
            <option value="4">Round 4</option>
            <option value="5">Round 5</option>
          </select>
        </div>
        <div className="col-md-4">
          <div className="d-flex align-items-center text-muted">
            <Calendar size={16} className="me-1" />
            <small>{filteredInterviews.length} interviews</small>
          </div>
        </div>
      </div>

      {/* Interviews Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Candidate</th>
                  <th>Round</th>
                  <th>Scheduled Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInterviews.map((interview) => (
                  <tr key={interview.interviewId}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                          {interview.candidateName?.[0] || 'C'}
                        </div>
                        <div>
                          <div className="fw-medium">
                            {interview.candidateName || 'Unknown Candidate'}
                          </div>
                          <small className="text-muted">{interview.candidateEmail}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark">
                        Round {interview.roundNumber}
                      </span>
                    </td>
                    <td>
                      <div>
                        <div className="fw-medium">
                          {new Date(interview.scheduledTime).toLocaleDateString()}
                        </div>
                        <small className="text-muted">
                          {new Date(interview.scheduledTime).toLocaleTimeString()}
                        </small>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeColor(interview.status)}`}>
                        {interview.status}
                      </span>
                    </td>
                    <td>
                      {getStatusActions(interview)}
                    </td>
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
          <p className="text-muted">Try adjusting your filters or check back later for new assignments.</p>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && selectedInterview && (
        <FeedbackModal
          interview={selectedInterview}
          onClose={() => {
            setShowFeedbackModal(false);
            setSelectedInterview(null);
          }}
          onSuccess={() => {
            fetchInterviews(); // Refresh the list
            setShowFeedbackModal(false);
            setSelectedInterview(null);
          }}
        />
      )}
    </div>
  );
}

// Feedback Modal Component
function FeedbackModal({ interview, onClose, onSuccess }: any) {
  const [feedback, setFeedback] = useState({
    technicalSkills: 0,
    communicationSkills: 0,
    problemSolving: 0,
    culturalFit: 0,
    overallRating: 0,
    comments: '',
    recommendation: 'Pending'
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/interviewer/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewId: interview.interviewId,
          ...feedback
        }),
      });

      if (response.ok) {
        alert('Feedback submitted successfully!');
        onSuccess();
      } else {
        alert('Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ value, onChange, label }: any) => (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <div className="d-flex align-items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="btn btn-link p-0 me-1"
            onClick={() => onChange(star)}
          >
            <i className={`bi bi-star${star <= value ? '-fill text-warning' : ' text-muted'}`}></i>
          </button>
        ))}
        <span className="ms-2 text-muted">({value}/5)</span>
      </div>
    </div>
  );

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Interview Feedback</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <h6>Candidate: {interview.candidateName}</h6>
                <p className="text-muted">Round {interview.roundNumber} - {new Date(interview.scheduledTime).toLocaleDateString()}</p>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <StarRating
                    value={feedback.technicalSkills}
                    onChange={(value: number) => setFeedback({...feedback, technicalSkills: value})}
                    label="Technical Skills"
                  />
                </div>
                <div className="col-md-6">
                  <StarRating
                    value={feedback.communicationSkills}
                    onChange={(value: number) => setFeedback({...feedback, communicationSkills: value})}
                    label="Communication Skills"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <StarRating
                    value={feedback.problemSolving}
                    onChange={(value: number) => setFeedback({...feedback, problemSolving: value})}
                    label="Problem Solving"
                  />
                </div>
                <div className="col-md-6">
                  <StarRating
                    value={feedback.culturalFit}
                    onChange={(value: number) => setFeedback({...feedback, culturalFit: value})}
                    label="Cultural Fit"
                  />
                </div>
              </div>

              <StarRating
                value={feedback.overallRating}
                onChange={(value: number) => setFeedback({...feedback, overallRating: value})}
                label="Overall Rating"
              />

              <div className="mb-3">
                <label className="form-label">Recommendation</label>
                <select
                  className="form-select"
                  value={feedback.recommendation}
                  onChange={(e) => setFeedback({...feedback, recommendation: e.target.value})}
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Strong Hire">Strong Hire</option>
                  <option value="Hire">Hire</option>
                  <option value="No Hire">No Hire</option>
                  <option value="Strong No Hire">Strong No Hire</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Comments</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={feedback.comments}
                  onChange={(e) => setFeedback({...feedback, comments: e.target.value})}
                  placeholder="Provide detailed feedback about the candidate's performance..."
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
