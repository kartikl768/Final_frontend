import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHR } from "../../contexts/HRContext";
import { Users, Clock, Briefcase, Search, Filter } from "lucide-react";

const Jobs: React.FC = () => {
  const { allJobRequirements, applications, loading, jobRequirementsLoading } = useHR();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const totalApplicants = applications.length;

  // Debug logging
  console.log("Jobs.tsx: allJobRequirements:", allJobRequirements);
  console.log("Jobs.tsx: allJobRequirements length:", allJobRequirements?.length);
  if (allJobRequirements && allJobRequirements.length > 0) {
    console.log("Jobs.tsx: First job object:", allJobRequirements[0]);
    console.log("Jobs.tsx: First job object keys:", Object.keys(allJobRequirements[0]));
    console.log("Jobs.tsx: First job jobTitle:", allJobRequirements[0].jobTitle);
    console.log("Jobs.tsx: First job jobTitle type:", typeof allJobRequirements[0].jobTitle);
  }

  // Filter jobs based on search term and status
  const filteredJobs = (allJobRequirements || []).filter((job) => {
    // Add null/undefined checks
    if (!job) {
      console.warn("Jobs.tsx: Job object is null/undefined:", job);
      return false;
    }
    
    if (!job.jobTitle) {
      console.warn("Jobs.tsx: Job object missing jobTitle:", job);
      console.warn("Jobs.tsx: Job object keys:", Object.keys(job));
      return false;
    }
    
    const matchesSearch = job.jobTitle
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const approvedJobs = filteredJobs.filter((job) => job.status === "Approved");

  if (loading || jobRequirementsLoading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="text-center mb-5">
        <h1 className="display-4 text-primary fw-bold">Job Requirements</h1>
        <p className="lead text-muted">
          View and manage all job requirements and their status
        </p>
      </div>

      {/* Search and Filter */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div className="col-md-2">
          <div className="d-flex align-items-center text-muted">
            <Filter size={16} className="me-1" />
            <small>{filteredJobs.length} jobs</small>
          </div>
        </div>
      </div>

      <div className="row justify-content-center mb-4">
        <div className="col-auto">
          <span className="badge bg-secondary fs-6 d-flex flex-column align-items-center p-2">
            <Briefcase size={16} className="mb-1" />
            {approvedJobs.length} Active Jobs
          </span>
        </div>

        <div className="col-auto">
          <span className="badge bg-primary fs-6 d-flex flex-column align-items-center p-2">
            <Users size={16} className="mb-1" />
            {totalApplicants} Total Applicants
          </span>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          {filteredJobs.length === 0 ? (
            <div className="text-center text-muted py-5">
              <h4>No jobs found</h4>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const getStatusBadge = (status: string) => {
                switch (status) {
                  case 'Approved':
                    return <span className="badge bg-success fs-6">Approved</span>;
                  case 'Pending':
                    return <span className="badge bg-warning text-dark fs-6">Pending</span>;
                  case 'Rejected':
                    return <span className="badge bg-danger fs-6">Rejected</span>;
                  default:
                    return <span className="badge bg-secondary fs-6">{status}</span>;
                }
              };

              return (
                <div key={job.requirementId} className="card mb-4 shadow-sm border-0">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h3 className="card-title h4 mb-0">{job.jobTitle}</h3>
                      {getStatusBadge(job.status)}
                    </div>

                  <div className="row text-muted mb-3">
                    <div className="col-auto">
                      <Clock size={16} className="me-1" />
                      {job.yearsExperience} years
                    </div>
                    <div className="col-auto">
                      <Users size={16} className="me-1" />
                      {job.numberOfOpenings} openings
                    </div>
                  </div>

                  <p className="card-text text-muted mb-4">{job.jobDescription}</p>

                  <div className="mb-4">
                    <h6 className="text-muted mb-2">
                      <span className="text-warning">🔧</span> Required Skills
                    </h6>
                    <div className="d-flex flex-wrap gap-2">
                      {job.requiredSkills.split(",").map((skill, index) => (
                        <span key={index} className="badge bg-light text-dark border">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-muted">
                      <span className="text-danger">🎯</span> {job.numberOfRounds} interview rounds
                    </div>
                    {job.status === "Approved" ? (
                      <Link
                        to={`/hr/applicants/${job.requirementId}`}
                        className="btn btn-dark btn-lg px-4"
                      >
                        View Applicants →
                      </Link>
                    ) : (
                      <span className="text-muted">
                        {job.status === "Pending" ? "Awaiting approval" : "Not available"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
