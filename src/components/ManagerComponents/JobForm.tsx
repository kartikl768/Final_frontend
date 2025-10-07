import React from "react";
import { JobRequirement } from '../../data/index';

interface Props {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: (job: JobRequirement) => void;
  editingJob: JobRequirement | null;
  userId: number;
  onCancel: () => void;
  jobRequirements: JobRequirement[];
}

const JobForm: React.FC<Props> = ({
  formData,
  setFormData,
  onSubmit,
  editingJob,
  userId,
  onCancel,
  jobRequirements,
}) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date().toISOString();
    
    const jobData: JobRequirement = {
      requirementId: editingJob?.requirementId || 0,
      managerId: userId,
      jobTitle: formData.job_title,
      jobDescription: formData.job_description,
      yearsExperience: Number(formData.years_experience),
      requiredSkills: formData.required_skills,
      numberOfOpenings: Number(formData.number_of_openings),
      numberOfRounds: Number(formData.number_of_rounds),
      status: editingJob?.status || 'Pending',
      createdAt: editingJob?.createdAt || now,
      updatedAt: now,
    };
    
    onSubmit(jobData);
  };

  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-primary text-white">
            <h5 className="card-title mb-0">
              {editingJob ? "Edit Job Requirement" : "Create New Job Requirement"}
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* Job Title, Experience, Openings */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Job Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.job_title}
                    onChange={(e) =>
                      setFormData({ ...formData, job_title: e.target.value })
                    }
                    required
                  />

                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Years of Experience</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.years_experience}
                    onChange={(e) =>
                      setFormData({ ...formData, years_experience: e.target.value })
                    }
                    required
                    min="0"
                  />

                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Number of Openings</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.number_of_openings}
                    onChange={(e) =>
                      setFormData({ ...formData, number_of_openings: e.target.value })
                    }
                    required
                    min="1"
                  />
                </div>
              </div>
              {/* Skills & Rounds */}
              <div className="row">
                <div className="col-md-8 mb-3">
                  <label className="form-label">Required Skills</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.required_skills}
                    onChange={(e) =>
                      setFormData({ ...formData, required_skills: e.target.value })
                    }
                    required
                  />

                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Number of Rounds</label>
                  <select
                    className="form-select"
                    value={formData.number_of_rounds}
                    onChange={(e) =>
                      setFormData({ ...formData, number_of_rounds: e.target.value })
                    }
                    required
                  >

                    <option value="1">1 Round</option>
                    <option value="2">2 Rounds</option>
                    <option value="3">3 Rounds</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label">Job Description</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={formData.job_description}
                  onChange={(e) =>
                    setFormData({ ...formData, job_description: e.target.value })
                  }
                  required
                ></textarea>
              </div>

              {/* Actions */}
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  {editingJob ? "Update Job" : "Create Job"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobForm;