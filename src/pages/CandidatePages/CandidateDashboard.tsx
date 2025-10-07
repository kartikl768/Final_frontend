import React from 'react';
import { useCandidate } from '../../contexts/CandidateContext';
import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, FileText, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CandidateDashboard: React.FC = () => {
  const { applications, jobs, loading } = useCandidate();
  const { user } = useAuth();
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Applied':
        return <span className="badge bg-primary">Applied</span>;
      case 'Interview Scheduled':
        return <span className="badge bg-success">Interview Scheduled</span>;
      case 'In Progress':
        return <span className="badge bg-warning text-dark">In Progress</span>;
      case 'Rejected':
        return <span className="badge bg-danger">Rejected</span>;
      case 'Selected':
        return <span className="badge bg-success">Selected</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
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
        <h1 className="h2 fw-bold">Welcome, {user?.FirstName || 'Candidate'}!</h1>
        <p className="text-muted">Track your job applications and explore new opportunities</p>
      </div>

      {/* Metrics Cards */}
      <div className="row mb-5">
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="card-title text-muted mb-0">Available Jobs</h6>
                <Briefcase className="text-primary" size={24} />
              </div>
              <h2 className="display-4 fw-bold text-primary mb-0">
                {jobs.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="card-title text-muted mb-0">My Applications</h6>
                <FileText className="text-info" size={24} />
              </div>
              <h2 className="display-4 fw-bold text-info mb-0">
                {applications.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="card-title text-muted mb-0">In Progress</h6>
                <Clock className="text-warning" size={24} />
              </div>
              <h2 className="display-4 fw-bold text-warning mb-0">
                {applications.filter(a => a.status === "In Progress" || a.status === "Interview Scheduled").length}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="card-title text-muted mb-0">Selected</h6>
                <CheckCircle className="text-success" size={24} />
              </div>
              <h2 className="display-4 fw-bold text-success mb-0">
                {applications.filter(a => a.status === "Selected").length}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="card-title fw-bold mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <button 
                    className="btn btn-primary w-100"
                    onClick={() => navigate('/candidate/jobs')}
                  >
                    <Briefcase className="me-2" size={20} />
                    Browse Available Jobs
                  </button>
                </div>
                <div className="col-md-6 mb-3">
                  <button 
                    className="btn btn-outline-primary w-100"
                    onClick={() => navigate('/candidate/applications')}
                  >
                    <FileText className="me-2" size={20} />
                    View My Applications
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="card-title fw-bold mb-0">Recent Applications</h5>
            </div>
            <div className="card-body">
              {applications.length === 0 ? (
                <div className="text-center py-5">
                  <FileText size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No applications yet</h5>
                  <p className="text-muted">
                    Start by browsing available jobs and applying to positions that interest you.
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/candidate/jobs')}
                  >
                    Browse Jobs
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Job Title</th>
                        <th>Applied Date</th>
                        <th>Status</th>
                        <th>Current Round</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.slice(0, 5).map((application) => (
                        <tr key={application.application_id}>
                          <td>
                            <strong>Job #{application.job_id}</strong>
                          </td>
                          <td>
                            {new Date(application.created_at).toLocaleDateString()}
                          </td>
                          <td>
                            {getStatusBadge(application.status)}
                          </td>
                          <td>
                            <span className="badge bg-light text-dark">
                              Round {application.current_round}
                            </span>
                          </td>
                          <td>
                            <span className={`fw-bold ${
                              application.keyword_score >= 8 ? 'text-success' :
                              application.keyword_score >= 6 ? 'text-warning' : 'text-danger'
                            }`}>
                              {application.keyword_score}/10
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
