import React, { useState } from 'react';
import { useCandidate } from '../../contexts/CandidateContext';
import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, MapPin, Clock, Users, Star, Filter } from 'lucide-react';

const JobBrowser: React.FC = () => {
  const { jobs, applications, createApplication, jobsLoading } = useCandidate();
  const { user } = useAuth();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    firstName: user?.FirstName || '',
    lastName: user?.LastName || '',
    email: user?.Email || '',
    phone: '',
    resumePath: '',
  });
  const [filter, setFilter] = useState({
    search: '',
    experience: '',
    skills: '',
  });

  const handleApply = async (job: any) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createApplication({
        jobId: selectedJob.JobId,
        firstName: applicationForm.firstName,
        lastName: applicationForm.lastName,
        email: applicationForm.email,
        phone: applicationForm.phone,
        resumePath: applicationForm.resumePath,
      });
      setShowApplicationModal(false);
      setSelectedJob(null);
      setApplicationForm({
        firstName: user?.FirstName || '',
        lastName: user?.LastName || '',
        email: user?.Email || '',
        phone: '',
        resumePath: '',
      });
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Failed to submit application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.JobTitle.toLowerCase().includes(filter.search.toLowerCase()) ||
                         job.JobDescription.toLowerCase().includes(filter.search.toLowerCase());
    const matchesExperience = !filter.experience || job.YearsExperience <= parseInt(filter.experience);
    const matchesSkills = !filter.skills || 
                         job.RequiredSkills.some((skill: string) => 
                           skill.toLowerCase().includes(filter.skills.toLowerCase())
                         );
    return matchesSearch && matchesExperience && matchesSkills;
  });

  const hasApplied = (jobId: number) => {
    return applications.some(app => app.job_id === jobId);
  };

  if (jobsLoading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading available jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h1 className="h2 fw-bold">Available Jobs</h1>
        <p className="text-muted">Browse and apply to job opportunities</p>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h6 className="card-title fw-bold mb-0">
                <Filter className="me-2" size={20} />
                Filters
              </h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Search</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search jobs..."
                    value={filter.search}
                    onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Max Experience (years)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g., 5"
                    value={filter.experience}
                    onChange={(e) => setFilter({ ...filter, experience: e.target.value })}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Skills</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., React, Java"
                    value={filter.skills}
                    onChange={(e) => setFilter({ ...filter, skills: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="row">
        {filteredJobs.length === 0 ? (
          <div className="col-12">
            <div className="text-center py-5">
              <Briefcase size={48} className="text-muted mb-3" />
              <h5 className="text-muted">No jobs found</h5>
              <p className="text-muted">
                Try adjusting your filters or check back later for new opportunities.
              </p>
            </div>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div key={job.JobId} className="col-lg-6 col-xl-4 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title fw-bold">{job.JobTitle}</h5>
                    <span className="badge bg-success">Active</span>
                  </div>
                  
                  <p className="card-text text-muted mb-3">
                    {job.JobDescription.length > 150 
                      ? `${job.JobDescription.substring(0, 150)}...` 
                      : job.JobDescription
                    }
                  </p>

                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <Clock size={16} className="me-2 text-muted" />
                      <small className="text-muted">{job.YearsExperience} years experience</small>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <Users size={16} className="me-2 text-muted" />
                      <small className="text-muted">{job.NumberOfOpenings} opening(s)</small>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <Star size={16} className="me-2 text-muted" />
                      <small className="text-muted">{job.NumberOfRounds} interview rounds</small>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h6 className="fw-bold mb-2">Required Skills:</h6>
                    <div className="d-flex flex-wrap gap-1">
                      {job.RequiredSkills.slice(0, 3).map((skill: string, index: number) => (
                        <span key={index} className="badge bg-light text-dark">
                          {skill}
                        </span>
                      ))}
                      {job.RequiredSkills.length > 3 && (
                        <span className="badge bg-light text-dark">
                          +{job.RequiredSkills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="d-grid">
                    {hasApplied(job.JobId) ? (
                      <button className="btn btn-outline-success" disabled>
                        Applied
                      </button>
                    ) : (
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleApply(job)}
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Application Modal */}
      {showApplicationModal && selectedJob && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Apply for {selectedJob.JobTitle}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowApplicationModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmitApplication}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={applicationForm.firstName}
                        onChange={(e) => setApplicationForm({ ...applicationForm, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={applicationForm.lastName}
                        onChange={(e) => setApplicationForm({ ...applicationForm, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={applicationForm.email}
                        onChange={(e) => setApplicationForm({ ...applicationForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={applicationForm.phone}
                        onChange={(e) => setApplicationForm({ ...applicationForm, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Resume URL</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://example.com/resume.pdf"
                      value={applicationForm.resumePath}
                      onChange={(e) => setApplicationForm({ ...applicationForm, resumePath: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowApplicationModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobBrowser;
