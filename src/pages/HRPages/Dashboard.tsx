import React from 'react';
import { useHR } from '../../contexts/HRContext';
import { Briefcase, Users, Clock, Calendar } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { applications, interviews, allJobRequirements, loading } = useHR();
  
  // Calculate active jobs from all job requirements (approved and pending)
  const activeJobs = allJobRequirements.filter(
    job => job.status === "1" || job.status === "0"
  ).length;
  const totalApplications = applications.length;
  const pendingReview = applications.filter(a => a.status === "Applied" || a.status === "In Progress").length;
  const scheduledInterviews = interviews.filter(i => i.status === "Scheduled").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Applied':
        return <span className="badge bg-primary">Applied</span>;
      case 'Interview Scheduled':
        return <span className="badge bg-success">Interview Scheduled</span>;
      case 'In Progress':
        return <span className="badge bg-warning text-dark">In Progress</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-success';
    if (score >= 6) return 'text-warning';
    return 'text-danger';
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h1 className="h2 fw-bold">HR Dashboard</h1>
        <p className="text-muted">Overview of recruitment activities and metrics</p>
      </div>

      {/* Metrics Cards */}
      <div className="row mb-5">
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="card-title text-muted mb-0">Active Jobs</h6>
                <Briefcase className="text-primary" size={24} />
              </div>
              <h2 className="display-4 fw-bold text-primary mb-0">
                {activeJobs}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="card-title text-muted mb-0">Total Applications</h6>
                <Users className="text-success" size={24} />
              </div>
              <h2 className="display-4 fw-bold text-success mb-0">
                {totalApplications}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="card-title text-muted mb-0">Pending Review</h6>
                <Clock className="text-warning" size={24} />
              </div>
              <h2 className="display-4 fw-bold text-warning mb-0">
                {pendingReview}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="card-title text-muted mb-0">Scheduled Interviews</h6>
                <Calendar className="text-info" size={24} />
              </div>
              <h2 className="display-4 fw-bold text-info mb-0">
                {scheduledInterviews}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications & Interviews */}
      <div className="row">
        {/* Recent Applications */}
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0">
              <h5 className="card-title fw-bold mb-0">Recent Applications</h5>
            </div>
            <div className="card-body">
              {applications.slice(0, 5).map((application) => (
                <div key={application.applicationId} className="d-flex justify-content-between align-items-center py-3 border-bottom">
                  <div>
                    <h6 className="mb-1 fw-bold">{application.firstName} {application.lastName}</h6>
                    <small className="text-muted">Applied {new Date(application.createdAt).toLocaleDateString()}</small>
                  </div>
                  <div className="text-end">
                    {getStatusBadge(application.status)}
                    <div className="mt-1">
                      <small className={`fw-bold ${getScoreColor(application.keywordScore)}`}>
                        Score: {application.keywordScore}/10
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0">
              <h5 className="card-title fw-bold mb-0">Upcoming Interviews</h5>
            </div>
            <div className="card-body">
              {interviews.slice(0, 5).map((interview) => (
                <div key={interview.interviewId} className="d-flex justify-content-between align-items-center py-3 border-bottom">
                  <div>
                    <h6 className="mb-1 fw-bold">Interview #{interview.interviewId}</h6>
                    <small className="text-muted">{new Date(interview.scheduledTime).toLocaleDateString()}</small>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-success">Round {interview.roundNumber}</span>
                    <div className="mt-1">
                      <small className="text-primary fw-bold">{interview.status}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
