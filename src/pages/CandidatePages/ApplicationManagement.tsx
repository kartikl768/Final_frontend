import React, { useState } from "react";
import { useCandidate } from "../../contexts/CandidateContext";
import { useAuth } from "../../contexts/AuthContext";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Star,
  Eye,
  Download,
} from "lucide-react";

const ApplicationManagement: React.FC = () => {
  const { applications, jobs,loading } = useCandidate();
  const { user } = useAuth();
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Applied":
        return <span className="badge bg-primary">Applied</span>;
      case "UnderReview":
        return <span className="badge bg-info">UnderReview</span>;
      case "InterviewScheduled":
        return <span className="badge bg-success">InterviewScheduled</span>;
      case "InProgress":
        return <span className="badge bg-warning text-dark">InProgress</span>;
      case "Rejected":
        return <span className="badge bg-danger">Rejected</span>;
      case "Selected":
        return <span className="badge bg-success">Selected</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filterStatus === "all") return true;
    return app.status.replace(/\s+/g, "").toLowerCase() === filterStatus;
  });

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "status":
        return a.status.localeCompare(b.status);
      case "score":
        return b.keywordScore - a.keywordScore;
      default:
        return 0;
    }
  });

  const handleViewDetails = (application: any) => {
    
  console.log("Printing the job details", application);
  const job = jobs?.find(j => j.jobId === application.jobId);
  console.log(job);
  setSelectedApplication({ ...application, jobTitle: job?.jobTitle || 'Unknown' });
  setShowDetailsModal(true);
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
                    {
                      applications.filter(
                        (app) =>
                          app.status === "InProgress" ||
                          app.status === "InterviewScheduled"
                      ).length
                    }
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
                  <h4 className="mb-0">
                    {
                      applications.filter((app) => app.status === "Selected")
                        .length
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
            <option value="UnderReview">Under Review</option>
            <option value="InterviewScheduled">Interview Scheduled</option>
            <option value="InProgress">In Progress</option>
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
                  <th>Job ID</th>
                  <th>Job Title</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Current Round</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedApplications.map((application) => {
                  // With curly braces, an explicit return is required for the JSX
                  const job = jobs.find((j) => j.jobId === application.jobId);
                  return (
                    <tr key={application.applicationId}>
                      <td>
                        <div className="fw-medium">
                           #{application.jobId}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div>
                            <strong>{application.job?.jobTitle}</strong>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Calendar size={16} className="me-2 text-muted" />
                          <span>
                            {new Date(
                              application.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          
                          <span className="ms-2">
                            {getStatusBadge(application.status)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">
                          Round {application.currentRound}
                        </span>
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
                          {application.resumePath && (
                            <a
                              href={application.resumePath}
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
                  );
                })}
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
              : `No applications with status "${filterStatus}" found.`}
          </p>
        </div>
      )}

      {/* Application Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
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
                          <td>
                            <strong>Job ID:</strong>
                          </td>
                          <td>#{selectedApplication.jobId}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Applied Date:</strong>
                          </td>
                          <td>
                            {new Date(
                              selectedApplication.createdAt
                            ).toLocaleDateString()}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Status:</strong>
                          </td>
                          <td>{getStatusBadge(selectedApplication.status)}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Current Round:</strong>
                          </td>
                          <td>Round {selectedApplication.currentRound}</td>
                        </tr>
                      
                      </tbody>
                    </table>
                  </div>
                  {/* <div className="col-md-6">
                    <h6 className="fw-bold">Personal Information</h6>
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <td>
                            <strong>Name:</strong>
                          </td>
                          <td>
                            {selectedApplication.firstName}{" "}
                            {selectedApplication.lastName}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Email:</strong>
                          </td>
                          <td>{selectedApplication.email}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Phone:</strong>
                          </td>
                          <td>{selectedApplication.phone || "Not provided"}</td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Resume:</strong>
                          </td>
                          <td>
                            {selectedApplication.resumePath ? (
                              <a
                                href={selectedApplication.resumePath}
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
                  </div> */}
                </div>

                {selectedApplication.status === "InterviewScheduled" && (
                  <div className="mt-4">
                    <h6 className="fw-bold">Interview Information</h6>
                    <div className="alert alert-info">
                      <Calendar size={16} className="me-2" />
                      Your interview has been scheduled. You will receive
                      further details via email.
                    </div>
                  </div>
                )}

                {selectedApplication.status === "Selected" && (
                  <div className="mt-4">
                    <div className="alert alert-success">
                      <CheckCircle size={16} className="me-2" />
                      Congratulations! You have been selected for this position.
                      HR will contact you with next steps.
                    </div>
                  </div>
                )}

                {selectedApplication.status === "Rejected" && (
                  <div className="mt-4">
                    <div className="alert alert-danger">
                      <div className="me-2" />
                      Dear Candidate,<br/>
                      <br></br>
                      Thank you for your interest in the {selectedApplication.jobTitle} position at FNF India and for taking the time to interview with us. 
                      <br/>
                      <br>
                      </br>
                      We received many qualified applications, and after careful consideration, we've decided to move forward with other candidates whose skills and experience more closely align with the specific requirements of this role. 
                      We appreciate the time and effort you invested in the application process and your interest in joining FNF India. 
                      <br/>
                      <br>
                      </br>
                      We wish you the best of luck in your job search and encourage you to keep an eye on our career page for future openings that may be a better fit. 
                      Warmly,
                      <br/>
                      <br></br>
                      The Hiring
                      <br/>
                      Team FNFI
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
