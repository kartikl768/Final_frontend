import React from 'react';
import { JobRequirement } from '../../data/index';
import { Briefcase, Clock, CheckCircle, Users } from 'lucide-react';

interface Props {
  jobRequirements: JobRequirement[];
}

const JobStats: React.FC<Props> = ({ jobRequirements }) => {
  if (!jobRequirements || !Array.isArray(jobRequirements)) {
  return <p className="text-muted">No job data available.</p>;
}
  return (
    <div className="row mb-4">
      <div className="col-lg-3 col-md-6 mb-3">
        <div className="card border-0 shadow-sm">
          <div className="card-body d-flex align-items-center">
            <div className="bg-primary rounded p-3 me-3">
              <Briefcase size={24} className="text-white" />
            </div>
            <div>
              <h5 className="card-title mb-0">{jobRequirements.length}</h5>
              <p className="card-text text-muted mb-0">Total Jobs</p>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-3 col-md-6 mb-3">
        <div className="card border-0 shadow-sm">
          <div className="card-body d-flex align-items-center">
            <div className="bg-warning rounded p-3 me-3">
              <Clock size={24} className="text-white" />
            </div>
            <div>
              <h5 className="card-title mb-0">
                {jobRequirements.filter((j) => j.status === "Pending").length}
              </h5>
              <p className="card-text text-muted mb-0">Pending</p>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-3 col-md-6 mb-3">
        <div className="card border-0 shadow-sm">
          <div className="card-body d-flex align-items-center">
            <div className="bg-success rounded p-3 me-3">
              <CheckCircle size={24} className="text-white" />
            </div>
            <div>
              <h5 className="card-title mb-0">
                {jobRequirements.filter((j) => j.status === "Approved").length}
              </h5>
              <p className="card-text text-muted mb-0">Approved</p>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-3 col-md-6 mb-3">
        <div className="card border-0 shadow-sm">
          <div className="card-body d-flex align-items-center">
            <div className="bg-info rounded p-3 me-3">
              <Users size={24} className="text-white" />
            </div>
            <div>
              <h5 className="card-title mb-0">
                {jobRequirements.reduce((acc, j) => acc + j.numberOfOpenings, 0)}
              </h5>
              <p className="card-text text-muted mb-0">Total Openings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobStats;