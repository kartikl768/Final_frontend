import React, { useState } from 'react';
import { useCandidate } from '../../contexts/CandidateContext';
import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, Filter } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../Styles/global.css';

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
    resume: null as File | null,
  });

  const [filter, setFilter] = useState({
    search: '',
    experience: '',
    skills: '',
  });

  const handleApply = (job: any) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationForm.resume) {
      alert('Please select a resume file.');
      return;
    }

    try {
      await createApplication({
        jobId: selectedJob.jobId,
        firstName: applicationForm.firstName,
        lastName: applicationForm.lastName,
        email: applicationForm.email,
        phone: applicationForm.phone,
        resume: applicationForm.resume,
      });

      alert('Application submitted successfully!');
      setShowApplicationModal(false);
      setSelectedJob(null);
      setApplicationForm({
        firstName: user?.FirstName || '',
        lastName: user?.LastName || '',
        email: user?.Email || '',
        phone: '',
        resume: null,
      });
    } catch (error) {
      console.error('Failed to submit application:', error);
      alert('Only one application can be sent for one job.');
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.jobTitle?.toLowerCase().includes(filter.search.toLowerCase()) ||
      job.jobDescription?.toLowerCase().includes(filter.search.toLowerCase());
    const matchesExperience =
      !filter.experience || job.yearsExperience <= parseInt(filter.experience);
    const matchesSkills =
      !filter.skills ||
      job.requiredSkills?.some((skill: string) =>
        skill.toLowerCase().includes(filter.skills.toLowerCase())
      );

    return matchesSearch && matchesExperience && matchesSkills;
  });

  const hasApplied = (jobId: number) =>
    applications.some((app) => app.job?.jobId === jobId);

  if (jobsLoading) {
    return (
      <div className="container-fluid py-4 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Loading available jobs...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
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
                {/* Search */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Search</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search jobs..."
                    value={filter.search}
                    onChange={(e) =>
                      setFilter({ ...filter, search: e.target.value })
                    }
                  />
                </div>

                {/* Experience */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Max Experience (years)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="e.g., 5"
                    value={filter.experience}
                    onChange={(e) =>
                      setFilter({ ...filter, experience: e.target.value })
                    }
                  />
                </div>

                {/* Skills */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">Skills</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., React, Java"
                    value={filter.skills}
                    onChange={(e) =>
                      setFilter({ ...filter, skills: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Browser */}
      <div className="row" style={{ height: '70vh' }}>
        {/* Left: Job List */}
        <div
          className="col-md-5 border-end"
          style={{ overflowY: 'auto', height: '100%' }}
        >
          {filteredJobs.length === 0 ? (
            <div className="text-center py-5">
              <Briefcase size={48} className="text-muted mb-3" />
              <h5 className="text-muted">No jobs found</h5>
              <p className="text-muted">
                Try adjusting your filters or check back later.
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.jobId}
                className={`job-card card mb-3 border-0 shadow-sm ${
                  selectedJob?.jobId === job.jobId ? 'selected' : ''
                }`}
                onClick={() => setSelectedJob(job)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-1">
                    {job.jobTitle || 'Unknown Title'}
                  </h5>
                  <p className="text-muted small mb-1">
                    {job.yearsExperience
                      ? `${job.yearsExperience} years exp`
                      : 'Unknown exp'}
                  </p>
                  <p className="text-muted small mb-2">
                    {job.jobDescription?.length > 80
                      ? `${job.jobDescription.substring(0, 80)}...`
                      : job.jobDescription || 'No description available'}
                  </p>
                  <div className="d-flex flex-wrap gap-1">
                    {job.requiredSkills?.slice(0, 3).map(
                      (skill: string, i: number) => (
                        <span key={i} className="badge bg-light text-dark">
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: Job Details */}
        <div
          className="col-md-7 ps-4"
          style={{ overflowY: 'auto', height: '100%' }}
        >
          {selectedJob ? (
            <>
              <div className="pb-3 border-bottom">
                <h3>{selectedJob.jobTitle || 'Unknown Title'}</h3>
                <div className="row">
                  <div className="col">
                    <p className="text-muted mb-1">
                      Experience: {selectedJob.yearsExperience || 'Unknown'}
                    </p>
                    <p className="text-muted mb-1">
                      Interview Rounds: {selectedJob.numberOfRounds || 'Unknown'}
                    </p>
                    <p className="text-muted mb-1">Location: Bangalore</p>
                  </div>
                  <div className="col">
                    <p className="text-muted mb-1">Job Type: Full Time</p>
                    <p className="text-muted mb-1">Work Site: Hybrid</p>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <h5>Description</h5>
                <p>{selectedJob.jobDescription || 'No description available.'}</p>

                <h5 className="mt-3">Required Skills</h5>
                <div className="d-flex flex-wrap gap-2">
                  {selectedJob.requiredSkills?.length > 0 ? (
                    selectedJob.requiredSkills.map(
                      (skill: string, index: number) => (
                        <span key={index} className="badge bg-secondary">
                          {skill}
                        </span>
                      )
                    )
                  ) : (
                    <span>Unknown</span>
                  )}
                </div>
                {/* Add this inside your JobBrowser component, wherever you want the benefits section to appear */}

<div style={{
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  padding: "24px",
  margin: "32px 0",
  background: "#fff",
  maxWidth: "700px"
}}>
  <div style={{ fontWeight: 500, color: "#444", marginBottom: "14px" }}>
    Benefits/perks listed below may vary depending on the nature of your employment with Fidelity National Financial India and the location where you work.
  </div>
  <div style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px"
  }}>
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
        <span>🏥</span> Comprehensive health plan
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
        <span>💸</span> Employee stock options
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
        <span>👪</span> Maternity and paternity leave
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span>🎁</span> Employee rewards & recognition
      </div>
    </div>
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
        <span>📚</span> Learning & development
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
        <span>💰</span> Savings and investments
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
        <span>🏖️</span> Paid time off
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span>🤝</span> Networking opportunities
      </div>
    </div>
  </div>
  <div style={{
    fontSize: "13px",
    marginTop: "18px",
    color: "#555",
    marginBottom: "18px"
  }}>
    Fidelity National Financial is an equal opportunity employer. All qualified applicants will receive consideration for employment without regard to age, ancestry, citizenship, color, family or medical care leave, gender identity or expression, immigration status, marital status, medical condition, national origin, disability, political affiliation, protected veteran or military status, race, ethnicity, religion, sex, sexual orientation, or any other characteristic protected by applicable law.
  </div>
  
</div>

                {/* Apply Button */}
                <div className="mt-4">
                  {hasApplied(selectedJob.jobId) ? (
                    <button className="btn btn-outline-success" disabled>
                      Applied
                    </button>
                  ) : (
                    <button 
                      style={{background: "#243690",
    color: "#fff",
    border: "none",
    fontWeight: 500,
    borderRadius: "4px",
    padding: "8px 24px",
    fontSize: "15px",
    cursor: "pointer"}}
                      type="button"
                      onClick={() => handleApply(selectedJob)}
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-muted mt-5">
              <h5>Select a job to view its details</h5>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Application Modal (added) */}
      {showApplicationModal && selectedJob && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleSubmitApplication}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    Apply for {selectedJob.jobTitle}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowApplicationModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={applicationForm.firstName}
                        onChange={(e) =>
                          setApplicationForm({
                            ...applicationForm,
                            firstName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={applicationForm.lastName}
                        onChange={(e) =>
                          setApplicationForm({
                            ...applicationForm,
                            lastName: e.target.value,
                          })
                        }
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
                        onChange={(e) =>
                          setApplicationForm({
                            ...applicationForm,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={applicationForm.phone}
                        onChange={(e) =>
                          setApplicationForm({
                            ...applicationForm,
                            phone: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Resume (PDF, DOC, DOCX)
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setApplicationForm({
                          ...applicationForm,
                          resume: file,
                        });
                      }}
                      required
                    />
                    <div className="form-text">
                      Please upload your resume in PDF, DOC, or DOCX format.
                    </div>
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
