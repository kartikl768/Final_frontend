import React from "react";
import { JobRequirement } from "../../data/index";
import { jobSkills } from "../../data/skills";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import toast from "react-hot-toast"; // Import toast

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
      requiredSkills: formData.required_skills.join(','),
      numberOfOpenings: Number(formData.number_of_openings),
      numberOfRounds: Number(formData.number_of_rounds),
      status: editingJob?.status || "0",
      createdAt: editingJob?.createdAt || now,
      updatedAt: now,
    };

    onSubmit(jobData);
    
    toast.success('Successfully Posted the Job!');
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
              <h6 className="text-primary mb-3">Job Information</h6>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="job_title" className="form-label">Job Title</label>
                  <input
                    id="job_title"
                    type="text"
                    className="form-control"
                    value={formData.job_title}
                    onChange={(e) =>
                      setFormData({ ...formData, job_title: e.target.value })
                    }
                    required
                    // placeholder="e.g. Frontend Developer"
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="years_experience" className="form-label">Years of Experience</label>
                  <input
                    id="years_experience"
                    type="number"
                    className="form-control"
                    value={formData.years_experience}
                    onChange={(e) =>
                      setFormData({ ...formData, years_experience: e.target.value })
                    }
                    required
                    min="0"
                    placeholder="e.g. 3"
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label htmlFor="number_of_openings" className="form-label">Number of Openings</label>
                  <input
                    id="number_of_openings"
                    type="number"
                    className="form-control"
                    value={formData.number_of_openings}
                    onChange={(e) =>
                      setFormData({ ...formData, number_of_openings: e.target.value })
                    }
                    required
                    min="1"
                    placeholder="e.g. 5"
                  />
                </div>
              </div>

              {/* Skills & Rounds */}
              <h6 className="text-primary mt-4 mb-3">Skills & Hiring Rounds</h6>
              <div className="row">
                <div className="col-md-8 mb-3">
                  <label htmlFor="required_skills" className="form-label">Required Skills</label>
                  <Autocomplete
                    id="required_skills"
                    multiple
                    options={jobSkills}
                    getOptionLabel={(option) => option}
                    value={formData.required_skills || []}
                    onChange={(event, newValue) => {
                      setFormData({ ...formData, required_skills:  newValue });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select or type skills"
                        variant="outlined"
                      />
                    )}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="number_of_rounds" className="form-label">Number of Rounds</label>
                  <select
                    id="number_of_rounds"
                    className="form-select"
                    value={formData.number_of_rounds}
                    onChange={(e) =>
                      setFormData({ ...formData, number_of_rounds: e.target.value })
                    }
                    required
                  >
                    <option value="">Select rounds</option>
                    <option value="1">1 Round</option>
                    <option value="2">2 Rounds</option>
                    <option value="3">3 Rounds</option>
                    <option value="4">4 Rounds</option>
                  </select>
                </div>
              </div>

              {/* Job Description */}
              <h6 className="text-primary mt-4 mb-3">Job Description</h6>
              <div className="mb-4">
                <label htmlFor="job_description" className="form-label">Description</label>
                <textarea
                  id="job_description"
                  className="form-control"
                  rows={4}
                  value={formData.job_description}
                  onChange={(e) =>
                    setFormData({ ...formData, job_description: e.target.value })
                  }
                  required
                  placeholder="Describe the job responsibilities, expectations, and qualifications..."
                />
              </div>

              {/* Actions */}
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  {editingJob ? "Update Job" : "Create Job"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onCancel}
                >
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
