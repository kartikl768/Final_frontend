import React from 'react';
import { JobRequirement } from '../../data/index';
import { Calendar, Users, Edit, Trash2, Briefcase } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface Props {
  jobRequirements: JobRequirement[];
  onEdit: (job: JobRequirement) => void;
  onDelete: (id: number) => void;
}

const JobTable: React.FC<Props> = ({ jobRequirements, onEdit, onDelete }) => {
  return (
    <div className="row">
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white">
            <h5 className="card-title mb-0">All My Created Jobs</h5>
            <p className="card-text text-muted mb-0">
              View the status and details of all jobs you have created.
            </p>
          </div>

          <div className="card-body p-0">
            {jobRequirements.length === 0 ? (
              <div className="text-center py-5">
                <Briefcase size={48} className="text-muted mb-3" />
                <h5 className="text-muted">No jobs created yet</h5>
                <p className="text-muted">
                  Create your first job requirement to get started.
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Requirement ID</th>
                      <th>Job Title</th>
                      <th>Date Created</th>
                      <th>Status</th>
                      <th>No Of Openings</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobRequirements.map((job) => (
                      <tr key={job.requirementId}>
                        <td>
                          <span className="badge bg-light text-dark">
                            {job.requirementId}
                          </span>
                        </td>
                        <td>
                          <strong>{job.jobTitle}</strong>
                          <br />
                          <small className="text-muted">
                            {job.yearsExperience} years exp
                          </small>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <Calendar size={14} className="me-1 text-muted" />
                            {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "N/A"}
                          </div>
                        </td>
                        <td>
                          <StatusBadge status={job.status} /> 
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <Users size={14} className="me-1 text-muted" />
                            {job.numberOfOpenings}
                          </div>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm" role="group">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => onEdit(job)}
                              title="Edit"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => onDelete(job.requirementId)}
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobTable;