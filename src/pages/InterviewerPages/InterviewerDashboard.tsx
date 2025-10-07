import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle,
  Star,
  MessageSquare,
  Video
} from "lucide-react";

export default function InterviewerDashboard() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    completedInterviews: 0,
    pendingInterviews: 0,
    averageRating: 0
  });

  useEffect(() => {
    fetchInterviewerData();
  }, []);

  const fetchInterviewerData = async () => {
    try {
      // Fetch interviews assigned to this interviewer
      const interviewsResponse = await fetch(`/api/interviewer/interviews?interviewerId=${user?.UserId}`);
      const interviewsData = await interviewsResponse.json();
      setInterviews(interviewsData);

      // Fetch feedback given by this interviewer
      const feedbackResponse = await fetch(`/api/interviewer/feedback?interviewerId=${user?.UserId}`);
      const feedbackData = await feedbackResponse.json();
      setFeedback(feedbackData);

      // Calculate stats
      const totalInterviews = interviewsData.length;
      const completedInterviews = interviewsData.filter((i: any) => i.status === "Completed").length;
      const pendingInterviews = interviewsData.filter((i: any) => i.status === "Scheduled").length;
      const averageRating = feedbackData.length > 0 
        ? feedbackData.reduce((sum: number, f: any) => sum + f.overallRating, 0) / feedbackData.length 
        : 0;

      setStats({
        totalInterviews,
        completedInterviews,
        pendingInterviews,
        averageRating: Math.round(averageRating * 10) / 10
      });

    } catch (error) {
      console.error('Failed to fetch interviewer data:', error);
    } finally {
      setLoading(false);
    }
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

  const getUpcomingInterviews = () => {
    const now = new Date();
    return interviews
      .filter(interview => 
        interview.status === "Scheduled" && 
        new Date(interview.scheduledTime) > now
      )
      .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h1 className="h2 fw-bold">Interviewer Dashboard</h1>
        <p className="text-muted">Welcome back, {user?.FirstName}! Manage your interviews and provide feedback.</p>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                  <Calendar size={20} />
                </div>
                <div>
                  <h6 className="mb-0">Total Interviews</h6>
                  <h4 className="mb-0">{stats.totalInterviews}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar-sm bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <h6 className="mb-0">Completed</h6>
                  <h4 className="mb-0">{stats.completedInterviews}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar-sm bg-warning text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                  <Clock size={20} />
                </div>
                <div>
                  <h6 className="mb-0">Pending</h6>
                  <h4 className="mb-0">{stats.pendingInterviews}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar-sm bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                  <Star size={20} />
                </div>
                <div>
                  <h6 className="mb-0">Avg Rating</h6>
                  <h4 className="mb-0">{stats.averageRating}/5</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Upcoming Interviews */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="card-title mb-0">Upcoming Interviews</h5>
            </div>
            <div className="card-body">
              {getUpcomingInterviews().length === 0 ? (
                <div className="text-center py-4">
                  <Calendar size={48} className="text-muted mb-3" />
                  <h6 className="text-muted">No upcoming interviews</h6>
                  <p className="text-muted">You have no scheduled interviews at the moment.</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {getUpcomingInterviews().map((interview) => (
                    <div key={interview.interviewId} className="list-group-item border-0 px-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-2">
                            <div className="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                              {interview.candidateName?.[0] || 'C'}
                            </div>
                            <div>
                              <h6 className="mb-0">{interview.candidateName || 'Unknown Candidate'}</h6>
                              <small className="text-muted">{interview.candidateEmail}</small>
                            </div>
                          </div>
                          <div className="d-flex align-items-center text-muted mb-2">
                            <Clock size={14} className="me-1" />
                            <small>
                              {new Date(interview.scheduledTime).toLocaleDateString()} at{' '}
                              {new Date(interview.scheduledTime).toLocaleTimeString()}
                            </small>
                          </div>
                          <div className="d-flex align-items-center text-muted">
                            <span className="badge bg-light text-dark me-2">
                              Round {interview.roundNumber}
                            </span>
                            <span className={`badge ${getStatusBadgeColor(interview.status)}`}>
                              {interview.status}
                            </span>
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          {interview.teamsLink && (
                            <a
                              href={interview.teamsLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-primary"
                              title="Join Meeting"
                            >
                              <Video size={16} />
                            </a>
                          )}
                          <button
                            className="btn btn-sm btn-outline-success"
                            title="Provide Feedback"
                          >
                            <MessageSquare size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="card-title mb-0">Recent Feedback</h5>
            </div>
            <div className="card-body">
              {feedback.length === 0 ? (
                <div className="text-center py-4">
                  <MessageSquare size={48} className="text-muted mb-3" />
                  <h6 className="text-muted">No feedback yet</h6>
                  <p className="text-muted">Complete interviews to provide feedback.</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {feedback.slice(0, 5).map((item) => (
                    <div key={item.feedbackId} className="list-group-item border-0 px-0">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="mb-0">{item.candidateName}</h6>
                          <small className="text-muted">Round {item.roundNumber}</small>
                        </div>
                        <div className="d-flex align-items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < item.overallRating ? "text-warning fill-current" : "text-muted"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted small mb-0">
                        {item.comments?.substring(0, 100)}
                        {item.comments?.length > 100 && '...'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
