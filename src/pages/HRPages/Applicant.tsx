import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { applicants, jobs } from '../../data/model';
import InterviewScheduleModal from '../../components/HRComponents/InterviewScheduler';
import type { InterviewData } from '../../components/HRComponents/InterviewScheduler';

const Applicant: React.FC = () => {
  const { applicantId } = useParams<{ applicantId: string }>();
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [applicantStatus, setApplicantStatus] = useState<string>('');

  const applicant = applicants.find(a => a.id === Number(applicantId));
  const job = applicant ? jobs.find(j => j.JobId === applicant.jobId) : null;

  React.useEffect(() => {
    if (applicant) {
      setApplicantStatus(applicant.status);
    }
  }, [applicant]);

  if (!applicant || !job) {
    return <div className="container py-4">Applicant not found</div>;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Interview Scheduled':
        return <span className="badge bg-success fs-6">Interview Scheduled</span>;
      case 'In Progress':
        return <span className="badge bg-warning text-dark fs-6">In Progress</span>;
      case 'Applied':
        return <span className="badge bg-primary fs-6">Applied</span>;
      case 'Rejected':
        return <span className="badge bg-danger fs-6">Rejected</span>;
      default:
        return <span className="badge bg-secondary fs-6">{status}</span>;
    }
  };

  const handleScheduleInterview = (interviewData: InterviewData) => {
    console.log('Interview scheduled:', interviewData);
    setApplicantStatus('Interview Scheduled');
    alert(`Interview scheduled successfully for ${applicant.name}!`);
  };

  const handleRejectApplicant = () => {
    if (window.confirm(`Are you sure you want to reject ${applicant.name}?`)) {
      setApplicantStatus('Rejected');
      alert(`${applicant.name} has been rejected.`);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <Link to={`/applicants/${job.JobId}`} className="btn btn-link text-decoration-none p-0 mb-3">
          <ArrowLeft size={16} className="me-1" />
          Back to Applicants
        </Link>
      </div>

      <div className="row">
        <div className="col-lg-8">
          {/* Applicant Header */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col">
                  <div className="d-flex align-items-center mb-3">
                    <h2 className="mb-0 me-3">{applicant.name}</h2>
                    {getStatusBadge(applicantStatus)}
                  </div>
                  <div className="text-muted">
                    <div className="mb-1">{applicant.email}</div>
                    <div>{applicant.phone}</div>
                  </div>
                </div>
                <div className="col-auto text-end">
                  <small className="text-muted">ID: {applicant.id}</small>
                </div>
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-3">Application Details</h5>
                  <div className="row mb-2">
                    <div className="col-sm-5 text-muted">Applied:</div>
                    <div className="col-sm-7">{applicant.appliedDate}</div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-sm-5 text-muted">Last Updated:</div>
                    <div className="col-sm-7">{applicant.lastUpdated}</div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-sm-5 text-muted">Current Round:</div>
                    <div className="col-sm-7">{applicant.currentRound}</div>
                  </div>
                  <div className="row">
                    <div className="col-sm-5 text-muted">Keyword Score:</div>
                    <div className="col-sm-7">
                      <span className={`fw-bold ${applicant.score >= 8 ? 'text-success' : applicant.score >= 6 ? 'text-warning' : 'text-danger'}`}>
                        {applicant.score}/10
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-3">Position Applied</h5>
                  <div className="row mb-2">
                    <div className="col-sm-5 text-muted">Role:</div>
                    <div className="col-sm-7 fw-bold">{job.JobTitle}</div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-sm-5 text-muted">Experience:</div>
                    <div className="col-sm-7">{job.YearsExperience} required</div>
                  </div>
                  <div className="row">
                    <div className="col-sm-5 text-muted">Rounds:</div>
                    <div className="col-sm-7">{job.NumberOfRounds} interview rounds</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resume */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3">Resume</h5>
              <div className="d-flex align-items-center">
                <Download size={20} className="text-muted me-2" />
                <span className="text-muted me-2">/uploads/resumes/emma_taylor_resume.pdf</span>
                <button className="btn btn-link text-decoration-none p-0">
                  Download
                </button>
              </div>
            </div>
          </div>

          {/* Interview History */}
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3">Interview History</h5>
              <p className="text-muted">No interviews scheduled yet.</p>
            </div>
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0">
              <h5 className="card-title fw-bold mb-0">Actions</h5>
            </div>
            <div className="card-body">
              <button 
                className="btn btn-dark btn-lg w-100 mb-3"
                onClick={() => setShowScheduleModal(true)}
                disabled={applicantStatus === 'Rejected'}
              >
                Schedule Interview
              </button>
              <button 
                className="btn btn-danger btn-lg w-100"
                onClick={handleRejectApplicant}
                disabled={applicantStatus === 'Rejected'}
              >
                Reject Applicant
              </button>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="card-title fw-bold mb-0">Job Requirements</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <strong className="text-muted">Experience:</strong> {job.YearsExperience}
              </div>
              <div className="mb-3">
                <strong className="text-muted">Openings:</strong> {job.NumberOfOpenings}
              </div>
              <div className="mb-4">
                <strong className="text-muted">Rounds:</strong> {job.NumberOfRounds}
              </div>
              
              <h6 className="fw-bold mb-2">Required Skills</h6>
              <div className="d-flex flex-wrap gap-1">
                {job.RequiredSkills.map((skill, index) => (
                  <span key={index} className="badge bg-light text-dark border small">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interview Schedule Modal */}
      <InterviewScheduleModal
        show={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSchedule={handleScheduleInterview}
        applicantName={applicant.name}
      />
    </div>
  );
};

export default Applicant;