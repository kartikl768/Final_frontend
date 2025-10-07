import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useJobs } from '../../contexts/JobContext';
import Navbar from '../../components/Navbar';
import JobStats from '../../components/ManagerComponents/JobStats';
import JobTable from '../../components/ManagerComponents/JobTable';
import { useNavigate } from "react-router-dom";

const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { jobs, deleteJob, loading } = useJobs(); // ✅ Use context
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this job requirement?")) {
      deleteJob(id); // ✅ Use context method
    }
  };

  // ✅ Add loading check here
  if (loading) {
    return <p className="text-muted">Loading jobs...</p>;
  }

  return (
    <div className="container-fluid py-4">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-md-8">
            <h1 className="h3 mb-3" style={{ color: "#1e3a8a" }}>
              Manager Dashboard
            </h1>
            <p className="text-muted">
              Manage job requirements and track their approval status
            </p>
          </div>
          <div className="col-md-4 text-end">
            <button
              className="btn btn-primary"
              onClick={() => navigate("create-job")}
            >
              + Create New Job
            </button>
          </div>
        </div>

        {/* Stats */}
        <JobStats jobRequirements={jobs} />

        {/* Table */}
        <JobTable
          jobRequirements={jobs}
          onEdit={(job) => navigate(`edit-job/${job.requirementId}`, { state: job })}
          onDelete={handleDelete}
        />
      </div>
  );
};

export default ManagerDashboard;