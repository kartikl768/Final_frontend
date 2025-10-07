
import React, { useState } from "react";
import { Users, Clock, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { useHR } from "../../contexts/HRContext";

export default function Approvals() {
  const { pendingApprovals, approveJobRequirement, rejectJobRequirement, approvalsLoading } = useHR();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState<'1' | '2'>('1');
  const [comments, setComments] = useState('');

  const handleApprove = async (job: any) => {
    setSelectedJob(job);
    setAction('1');
    setShowModal(true);
  };

  const handleReject = async (job: any) => {
    setSelectedJob(job);
    setAction('2');
    setShowModal(true);
  };

  const handleSubmitAction = async () => {
    if (!selectedJob) return;

    try {
      if (action === '1') {
        await approveJobRequirement(selectedJob.requirementId, 1);
      } else {
        await rejectJobRequirement(selectedJob.requirementId, 2);
      }
      setShowModal(false);
      setComments('');
      setSelectedJob(null);
    } catch (error) {
      console.error('Failed to process approval:', error);
      alert('Failed to process approval. Please try again.');
    }
  };


  if (approvalsLoading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading pending approvals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h1 className="h2 fw-bold">Job Requirements Approval</h1>
        <p className="text-muted">Review and approve job requirements from managers</p>
      </div>

      {pendingApprovals.length === 0 ? (
        <div className="text-center py-5">
          <CheckCircle size={48} className="text-success mb-3" />
          <h5 className="text-muted">No pending approvals</h5>
          <p className="text-muted">All job requirements have been reviewed.</p>
        </div>
      ) : (
        <div className="row">
          {pendingApprovals.map((job) => (
            <div key={job.requirementId} className="col-lg-6 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">{job.jobTitle}</h5>
                    <span className="badge bg-warning text-dark">Pending</span>
                  </div>
                </div>
                <div className="card-body">
                  <p className="card-text text-muted mb-3">{job.jobDescription}</p>
                  
                  <div className="row mb-3">
                    <div className="col-6">
                      <div className="d-flex align-items-center text-muted">
                        <Clock size={16} className="me-2" />
                        <small>{job.yearsExperience} years exp</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center text-muted">
                        <Users size={16} className="me-2" />
                        <small>{job.numberOfOpenings} openings</small>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h6 className="fw-bold mb-2">Required Skills:</h6>
                    <div className="d-flex flex-wrap gap-1">
                      {job.requiredSkills.split(',').map((skill: string, index: number) => (
                        <span key={index} className="badge bg-light text-dark">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted">
                      <strong>Interview Rounds:</strong> {job.numberOfRounds}
                    </small>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success flex-fill"
                      onClick={() => handleApprove(job)}
                    >
                      <CheckCircle size={16} className="me-1" />
                      Approve
                    </button>
                    <button
                      className="btn btn-danger flex-fill"
                      onClick={() => handleReject(job)}
                    >
                      <XCircle size={16} className="me-1" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approval/Rejection Modal */}
      {showModal && selectedJob && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {action === 'approve' ? 'Approve' : 'Reject'} Job Requirement
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p><strong>Job Title:</strong> {selectedJob.jobTitle}</p>
                <div className="mb-3">
                  <label className="form-label">
                    <MessageSquare size={16} className="me-1" />
                    Comments (Optional)
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder={`Add comments for ${action === 'approve' ? 'approval' : 'rejection'}...`}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className={`btn ${action === 'approve' ? 'btn-success' : 'btn-danger'}`}
                  onClick={handleSubmitAction}
                >
                  {action === 'approve' ? 'Approve' : 'Reject'} Job Requirement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
