import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { JobRequirement } from '../../data';
import Navbar from '../../components/Navbar';
import JobForm from '../../components/ManagerComponents/JobForm';
import { useLocation, useNavigate } from 'react-router-dom';
import { useJobs } from '../../contexts/JobContext';

const EditJob: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { updateJob, jobs } = useJobs();
  const location = useLocation();
  const job = location.state as JobRequirement;

  // Redirect if no job data
  if (!job) {
    navigate("/manager");
    return null;
  }
  const [formData, setFormData] = useState({
    job_title: job.jobTitle,
    job_description: job.jobDescription,
    years_experience: job.yearsExperience.toString(),
    required_skills: job.requiredSkills,
    number_of_openings: job.numberOfOpenings.toString(),
    number_of_rounds: job.numberOfRounds.toString(),
  });

  const handleSubmit = (updatedJob: JobRequirement) => {
  updateJob(updatedJob); // This updates the job in context
  console.log("Updated job:", updatedJob);
  navigate("/manager"); // Navigate back to dashboard
};

  return (
    <div className="container-fluid py-4">
      <JobForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        editingJob={job}
        userId={user!.UserId}
        onCancel={() => navigate("/manager")}
        jobRequirements={jobs}
      />
    </div>
  );
};

export default EditJob;