import React, { useState } from 'react';
import { useCandidate } from '../../contexts/CandidateContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar,
  User,
  Star,
  Eye,
  Download
} from 'lucide-react';

const ApplicationManagement: React.FC = () => {
  const { applications, loading } = useCandidate();
  const { user } = useAuth();
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Applied':
        return <FileText size={16} className="text-primary" />;
      case 'Interview Scheduled':
        return <Calendar size={16} className="text-success" />;
      case 'In Progress':
        return <Clock size={16} className="text-warning" />;
      case 'Rejected':
        return <XCircle size={16} className="text-danger" />;
      case 'Selected':
        return <CheckCircle size={16} className="text-success" />;
      default:
        return <FileText size={16} className="text-secondary" />;
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filterStatus === "all") return true;
    return app.status === filterStatus;
  });

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "status":
        return a.status.localeCompare(b.status);
      case "score":
        return b.keyword_score - a.keyword_score;
      default:
        return 0;
    }
  });

  const handleViewDetails = (application: any) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-success';
    if (score >= 6) return 'text-warning';
    return 'text-danger';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Poor';
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h1 className="h2 fw-bold">My Applications</h1>
        <p className="text-muted">Track and manage your job applications</p>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                  <FileText size={20} />
                </div>
                <div>
                  <h6 className="mb-0">Total Applications</h6>
                  <h4 className="mb-0">{applications.length}</h4>
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
                  <h6 className="mb-0">In Progress</h6>
                  <h4 className="mb-0">
                    {applications.filter(app => app.status === "In Progress" || app.status === "Interview Scheduled").length}
                  </h4>
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
                  <h6 className="mb-0">Selected</h6>
                  <h4 className="mb-0">{applications.filter(app => app.status === "Selected").length}</h4>
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
                  <h6 className="mb-0">Avg Score</h6>
                  <h4 className="mb-0">
                    {applications.length > 0 
                      ? (applications.reduce((sum, app) => sum + app.keyword_score, 0) / applications.length).toFixed(1)
                      : '0.0'
                    }
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="row mb-4">
        <div className="col-md-4">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Applied">Applied</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Sort by: Newest First</option>
            <option value="oldest">Sort by: Oldest First</option>
            <option value="status">Sort by: Status</option>
            <option value="score">Sort by: Score</option>
          </select>
        </div>
        <div className="col-md-4">
          <div className="d-flex align-items-center text-muted">
            <FileText size={16} className="me-1" />
            <small>{filteredApplications.length} applications</small>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Job</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Current Round</th>
                  <th>Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedApplications.map((application) => (
                  <tr key={application.application_id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                          <FileText size={16} />
                        </div>
                        <div>
                          <div className="fw-medium">
                            Job #{application.job_id}
                          </div>
                          <small className="text-muted">
                            Applied {new Date(application.created_at).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <Calendar size={16} className="me-2 text-muted" />
                        <span>{new Date(application.created_at).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        {getStatusIcon(application.status)}
                        <span className="ms-2">{getStatusBadge(application.status)}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark">
                        Round {application.current_round}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className={`fw-bold ${getScoreColor(application.keyword_score)}`}>
                          {application.keyword_score}/10
                        </span>
                        <small className="text-muted ms-2">
                          ({getScoreLabel(application.keyword_score)})
                        </small>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleViewDetails(application)}
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        {application.resume_path && (
                          <a
                            href={application.resume_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-secondary"
                            title="Download Resume"
                          >
                            <Download size={14} />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-5">
          <FileText size={48} className="text-muted mb-3" />
          <h5 className="text-muted">No applications found</h5>
          <p className="text-muted">
            {filterStatus === "all" 
              ? "You haven't applied to any jobs yet. Start by browsing available positions."
              : `No applications with status "${filterStatus}" found.`
            }
          </p>
        </div>
      )}

      {/* Application Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Application Details</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="fw-bold">Application Information</h6>
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <td><strong>Job ID:</strong></td>
                          <td>#{selectedApplication.job_id}</td>
                        </tr>
                        <tr>
                          <td><strong>Applied Date:</strong></td>
                          <td>{new Date(selectedApplication.created_at).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                          <td><strong>Status:</strong></td>
                          <td>{getStatusBadge(selectedApplication.status)}</td>
                        </tr>
                        <tr>
                          <td><strong>Current Round:</strong></td>
                          <td>Round {selectedApplication.current_round}</td>
                        </tr>
                        <tr>
                          <td><strong>Score:</strong></td>
                          <td>
                            <span className={`fw-bold ${getScoreColor(selectedApplication.keyword_score)}`}>
                              {selectedApplication.keyword_score}/10
                            </span>
                            <small className="text-muted ms-2">
                              ({getScoreLabel(selectedApplication.keyword_score)})
                            </small>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold">Personal Information</h6>
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <td><strong>Name:</strong></td>
                          <td>{selectedApplication.first_name} {selectedApplication.last_name}</td>
                        </tr>
                        <tr>
                          <td><strong>Email:</strong></td>
                          <td>{selectedApplication.email}</td>
                        </tr>
                        <tr>
                          <td><strong>Phone:</strong></td>
                          <td>{selectedApplication.phone || 'Not provided'}</td>
                        </tr>
                        <tr>
                          <td><strong>Resume:</strong></td>
                          <td>
                            {selectedApplication.resume_path ? (
                              <a 
                                href={selectedApplication.resume_path} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-primary"
                              >
                                <Download size={14} className="me-1" />
                                Download
                              </a>
                            ) : (
                              <span className="text-muted">Not provided</span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {selectedApplication.status === "Interview Scheduled" && (
                  <div className="mt-4">
                    <h6 className="fw-bold">Interview Information</h6>
                    <div className="alert alert-info">
                      <Calendar size={16} className="me-2" />
                      Your interview has been scheduled. You will receive further details via email.
                    </div>
                  </div>
                )}

                {selectedApplication.status === "Selected" && (
                  <div className="mt-4">
                    <div className="alert alert-success">
                      <CheckCircle size={16} className="me-2" />
                      Congratulations! You have been selected for this position. HR will contact you with next steps.
                    </div>
                  </div>
                )}

                {selectedApplication.status === "Rejected" && (
                  <div className="mt-4">
                    <div className="alert alert-danger">
                      <XCircle size={16} className="me-2" />
                      Unfortunately, you were not selected for this position. Keep applying to other opportunities!
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationManagement;
