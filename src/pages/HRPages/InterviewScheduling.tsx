import React, { useState, useEffect } from "react";
import { useHR } from "../../contexts/HRContext";
import { 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Video,
  MapPin,
  User,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function InterviewScheduling() {
  const { 
    interviews, 
    applications, 
    users, 
    scheduleInterview, 
    loading 
  } = useHR();

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [interviewForm, setInterviewForm] = useState({
    applicationId: 0,
    interviewerId: 0,
    roundNumber: 1,
    scheduledTime: "",
    teamsLink: "",
    meetingDetails: "",
    status: "Scheduled"
  });

  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRound, setFilterRound] = useState("all");

  // Get interviewers from users
  const interviewers = users.filter(user => user.role === "Interviewer");

  // Get applications that are approved and ready for interviews
  const eligibleApplications = applications.filter(app => 
    app.status === "Approved" || app.status === "In Progress"
  );

  const filteredInterviews = interviews.filter(interview => {
    const matchesStatus = filterStatus === "all" || interview.status === filterStatus;
    const matchesRound = filterRound === "all" || interview.roundNumber.toString() === filterRound;
    return matchesStatus && matchesRound;
  });

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await scheduleInterview(interviewForm);
      setShowScheduleModal(false);
      setInterviewForm({
        applicationId: 0,
        interviewerId: 0,
        roundNumber: 1,
        scheduledTime: "",
        teamsLink: "",
        meetingDetails: "",
        status: "Scheduled"
      });
    } catch (error) {
      console.error('Failed to schedule interview:', error);
      alert('Failed to schedule interview. Please try again.');
    }
  };

  const handleSelectApplication = (application: any) => {
    setSelectedApplication(application);
    setInterviewForm({
      ...interviewForm,
      applicationId: application.applicationId
    });
    setShowScheduleModal(true);
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

  const getApplicationById = (applicationId: number) => {
    return applications.find(app => app.applicationId === applicationId);
  };

  const getInterviewerById = (interviewerId: number) => {
    return users.find(user => user.userId === interviewerId);
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold">Interview Scheduling</h1>
          <p className="text-muted">Schedule and manage interview sessions</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowScheduleModal(true)}
        >
          <Plus size={20} className="me-2" />
          Schedule Interview
        </button>
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
                  <h4 className="mb-0">{interviews.length}</h4>
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
                  <h4 className="mb-0">{interviews.filter(i => i.status === "Completed").length}</h4>
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
                  <h6 className="mb-0">Scheduled</h6>
                  <h4 className="mb-0">{interviews.filter(i => i.status === "Scheduled").length}</h4>
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
                  <Users size={20} />
                </div>
                <div>
                  <h6 className="mb-0">Available Apps</h6>
                  <h4 className="mb-0">{eligibleApplications.length}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
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
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="In Progress">In Progress</option>
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
                  <th>Interviewer</th>
                  <th>Round</th>
                  <th>Scheduled Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInterviews.map((interview) => {
                  const application = getApplicationById(interview.applicationId);
                  const interviewer = getInterviewerById(interview.interviewerId);
                  
                  return (
                    <tr key={interview.interviewId}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                            {application?.firstName?.[0]}{application?.lastName?.[0]}
                          </div>
                          <div>
                            <div className="fw-medium">
                              {application?.firstName} {application?.lastName}
                            </div>
                            <small className="text-muted">{application?.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <User size={16} className="me-2 text-muted" />
                          <span>{interviewer?.firstName} {interviewer?.lastName}</span>
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
                        <div className="d-flex gap-1">
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
                            className="btn btn-sm btn-outline-secondary"
                            title="Edit Interview"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Cancel Interview"
                          >
                            <XCircle size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {filteredInterviews.length === 0 && (
        <div className="text-center py-5">
          <Calendar size={48} className="text-muted mb-3" />
          <h5 className="text-muted">No interviews found</h5>
          <p className="text-muted">Try adjusting your filters or schedule a new interview.</p>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Schedule New Interview</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowScheduleModal(false)}
                ></button>
              </div>
              <form onSubmit={handleScheduleInterview}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Select Application</label>
                      <select
                        className="form-select"
                        value={interviewForm.applicationId}
                        onChange={(e) => setInterviewForm({...interviewForm, applicationId: parseInt(e.target.value)})}
                        required
                      >
                        <option value={0}>Choose an application...</option>
                        {eligibleApplications.map(app => (
                          <option key={app.applicationId} value={app.applicationId}>
                            {app.firstName} {app.lastName} - {app.email}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Interviewer</label>
                      <select
                        className="form-select"
                        value={interviewForm.interviewerId}
                        onChange={(e) => setInterviewForm({...interviewForm, interviewerId: parseInt(e.target.value)})}
                        required
                      >
                        <option value={0}>Select interviewer...</option>
                        {interviewers.map(interviewer => (
                          <option key={interviewer.userId} value={interviewer.userId}>
                            {interviewer.firstName} {interviewer.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Round Number</label>
                      <select
                        className="form-select"
                        value={interviewForm.roundNumber}
                        onChange={(e) => setInterviewForm({...interviewForm, roundNumber: parseInt(e.target.value)})}
                        required
                      >
                        <option value={1}>Round 1</option>
                        <option value={2}>Round 2</option>
                        <option value={3}>Round 3</option>
                        <option value={4}>Round 4</option>
                        <option value={5}>Round 5</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Scheduled Date & Time</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={interviewForm.scheduledTime}
                        onChange={(e) => setInterviewForm({...interviewForm, scheduledTime: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Teams Meeting Link</label>
                    <input
                      type="url"
                      className="form-control"
                      value={interviewForm.teamsLink}
                      onChange={(e) => setInterviewForm({...interviewForm, teamsLink: e.target.value})}
                      placeholder="https://teams.microsoft.com/l/meetup-join/..."
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Meeting Details</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={interviewForm.meetingDetails}
                      onChange={(e) => setInterviewForm({...interviewForm, meetingDetails: e.target.value})}
                      placeholder="Additional meeting details, agenda, or notes..."
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowScheduleModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Schedule Interview
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
