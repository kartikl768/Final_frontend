import React from 'react';
import { useCandidate } from '../../contexts/CandidateContext';
import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, FileText, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {useState,useEffect,CSSProperties} from "react";
import Jobs from '../HRPages/Jobs';
import Slideshow from '../../components/CandidateComponents/Slideshow';
import Footer from '../../components/CandidateComponents/Footer';


const CandidateDashboard: React.FC = () => {
  const { applications, jobs, loading } = useCandidate();
  const { user } = useAuth();
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    
    console.log("Getting status badge for status:", status);
    switch (status) {
      case 'Applied':
        return <span className="badge bg-primary">Applied</span>;
      case 'UnderReview':
        return <span className="badge bg-info">Under Review</span>;
      case 'InterviewScheduled':
        return <span className="badge bg-success">Interview Scheduled</span>;
      case 'InProgress':
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
    <div className="container-fluid py-3">
      <div className="mb-4">
        <h1 className="h2 fw-bold">Welcome, {user?.firstName || 'Candidate'}!</h1>
        <Slideshow/>
        <section className="company-info-section py-5 bg-white">
  <div className="container my-4 py-1">
    <div className="row justify-content-center g-4">
      <div className="col-md-6 col-lg-3">
        <div className="card h-100 shadow-sm border-0 company-info-card">
          <div className="card-body d-flex flex-column">
            <h5 className="card-title text-primary">Title Insurance</h5>
            <p className="card-text text-dark flex-grow-1">
              <strong>FNF®</strong> is the leading provider of title insurance and settlement services to the real estate and mortgage industries. We are #1 in market share in the residential purchase, refinance, and commercial markets and currently hold the #1 or #2 market position in 39 states.
            </p>
          </div>
        </div>
      </div>

      <div className="col-md-6 col-lg-3">
        <div className="card h-100 shadow-sm border-0 company-info-card">
          <div className="card-body d-flex flex-column">
            <h5 className="card-title text-primary">Mortgage & Real Estate Services</h5>
            <p className="card-text text-dark flex-grow-1">
              <strong>FNF®</strong>’s various mortgage and real estate services companies provide services that complement our title insurance business. From a full-service qualified intermediary, home warranties, UCC insurance, relocation services, and notary services, we provide the essential services to fulfill the needs of a changing real estate industry.
            </p>
          </div>
        </div>
      </div>

      <div className="col-md-6 col-lg-3">
        <div className="card h-100 shadow-sm border-0 company-info-card">
          <div className="card-body d-flex flex-column">
            <h5 className="card-title text-primary">Real Estate Technology</h5>
            <p className="card-text text-dark flex-grow-1">
              <strong>FNF®</strong> believes the power of technology can elevate the real estate transaction. From investments in title and escrow software to industry-leading real estate partner solutions, we take our commitment to provide real estate professionals and consumers a truly reimagined, transparent, connected, and trusted real estate experience.
            </p>
          </div>
        </div>
      </div>

      <div className="col-md-6 col-lg-3">
        <div className="card h-100 shadow-sm border-0 company-info-card">
          <div className="card-body d-flex flex-column">
            <h5 className="card-title text-primary">Annuities & Life Insurance</h5>
            <p className="card-text text-dark flex-grow-1">
              <strong>F&G®</strong> offers retirement annuities and life insurance products to help you protect and plan for your future. By providing income for life, downside protection from market volatility, or a valuable death benefit, F&G® helps turn aspirations into reality.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

        {/* <p className="text-muted">Track your job applications and explore new opportunities</p> */}
      </div>

      {/* Metrics Cards */}
      {/* <div className="row mb-5">
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

        <div className="col-lg-3 col-md-6 mb-4"> */}
          {/* <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="card-title text-muted mb-0">In Progress</h6>
                <Clock className="text-warning" size={24} />
              </div>
              <h2 className="display-4 fw-bold text-warning mb-0">
                {applications.filter(a => a.status === "InProgress" || a.status === "InterviewScheduled").length}
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
      </div> */}

      {/* Quick Actions */}
      

      {/* Recent Applications */}
      {/* <div className="row">
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
                        <th>Job ID</th>
                        <th>Job Title</th>
                        <th>Applied Date</th>
                        <th>Status</th>
                        <th>Current Round</th>
                      </tr>
                    </thead>
                    <tbody>
                            {applications.slice(0, 5).map((application) => {
                              const job = jobs.find((j) => j.jobId === application.jobId);
                              return (
                                <tr key={application.applicationId}>
                                  <td>
                                    <strong>#{application.jobId}</strong>
                                  </td>
                                  <td>
                                    <strong> {job?.jobTitle}</strong>
                                  </td>
                                  <td>{new Date(application.createdAt).toLocaleDateString()}</td>
                                  <td>{getStatusBadge(application.status)}</td>
                                  <td>
                                    <span className="badge bg-light text-dark">
                                      Round {application.currentRound}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                      </tbody>
                  </table>
                </div>
              )}
            </div>*/}
          {/* </div> 
        </div>
      </div> */}
      
       <Footer></Footer>
     
    </div>
    
  );
};

export default CandidateDashboard;
