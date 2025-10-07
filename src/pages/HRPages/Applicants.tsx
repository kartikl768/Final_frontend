import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Users, Clock, Briefcase } from 'lucide-react';
import { jobs, applicants } from '../../data/model';

const Applicants: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [sortBy, setSortBy] = useState<string>('Sort by Date');

  const job = jobs.find(j => j.JobId === Number(jobId));
  const jobApplicants = applicants.filter(a => a.jobId === Number(jobId));

  if (!job) {
    return <div className="container py-4">Job not found</div>;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Interview Scheduled':
        return <span className="badge bg-success">Interview Scheduled</span>;
      case 'In Progress':
        return <span className="badge bg-warning text-dark">In Progress</span>;
      case 'Applied':
        return <span className="badge bg-primary">Applied</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <Link to="/hr/jobs" className="btn btn-link text-decoration-none p-0 mb-3">
          <ArrowLeft size={16} className="me-1" />
          Back to Jobs
        </Link>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h2 className="card-title h3 fw-bold mb-3">{job.JobTitle}</h2>
          <p className="text-muted mb-3">{job.JobDescription}</p>
          
          <div className="row text-muted">
            <div className="col-auto">
              <Clock size={16} className="me-1" />
              {job.YearsExperience}
            </div>
            <div className="col-auto">
              <Briefcase size={16} className="me-1" />
              {job.NumberOfOpenings} openings
            </div>
            <div className="col-auto">
              <span className="text-warning">🎯</span>
              {job.NumberOfRounds} rounds
            </div>
            <div className="col-auto">
              <span className="badge bg-light text-primary">
                {job.Status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 py-3">
          <div className="row align-items-center">
            <div className="col">
              <h5 className="mb-0 fw-bold">
                <Users size={20} className="me-2" />
                Applicants ({jobApplicants.length})
              </h5>
            </div>
            <div className="col-auto">
              <div className="row g-2">
                <div className="col-auto">
                  <select 
                    className="form-select form-select-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All Status">All Status</option>
                    <option value="Applied">Applied</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
                <div className="col-auto">
                  <select 
                    className="form-select form-select-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="Sort by Date">Sort by Date</option>
                    <option value="Sort by Score">Sort by Score</option>
                    <option value="Sort by Name">Sort by Name</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          {jobApplicants.map((applicant, index) => (
            <div key={applicant.id} className={`p-4 ${index < jobApplicants.length - 1 ? 'border-bottom' : ''}`}>
              <div className="row align-items-center">
                <div className="col">
                  <div className="d-flex align-items-center mb-2">
                    <h6 className="mb-0 me-3 fw-bold">{applicant.name}</h6>
                    <small className="text-muted">ID: {applicant.id}</small>
                    <div className="ms-auto">
                      {getStatusBadge(applicant.status)}
                    </div>
                  </div>
                  <div className="text-muted mb-2">
                    <div>{applicant.email}</div>
                    <div>{applicant.phone}</div>
                  </div>
                  <div className="row text-muted small">
                    <div className="col-auto">Score: {applicant.score}/10</div>
                    <div className="col-auto">Applied: {applicant.appliedDate}</div>
                  </div>
                </div>
                <div className="col-auto">
                  <div className="text-end mb-2">
                    <small className="text-muted">Round {applicant.currentRound}</small>
                  </div>
                  <Link
                    to={`/hr/applicant/${applicant.id}`}
                    className="btn btn-dark"
                  >
                    Review Application
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Applicants;