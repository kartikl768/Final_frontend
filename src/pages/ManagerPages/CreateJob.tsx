import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { JobRequirement } from "../../data";
import Navbar from "../../components/Navbar";
import JobForm from "../../components/ManagerComponents/JobForm";
import { useNavigate } from "react-router-dom";
import { useJobs } from "../../contexts/JobContext";

const CreateJob: React.FC = () => {
  const { user } = useAuth();
  const { addJob, jobs } = useJobs();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    job_title: "",
    job_description: "",
    years_experience: "",
    required_skills: "",
    number_of_openings: "1",
    number_of_rounds: "3",
  });

  const handleSubmit = async (jobData: JobRequirement) => {
    const result = await addJob(jobData);
    if (result) {
      navigate("/manager");
    } else {
      alert("Failed to create job. Please try again.");
    }
  };

  return (
    <div className="container-fluid py-4">
      <JobForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        editingJob={null}
        userId={user!.UserId}
        onCancel={() => navigate("/manager")}
        jobRequirements={jobs}
      />
    </div>
  );
};

export default CreateJob;