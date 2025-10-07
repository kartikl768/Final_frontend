import React, { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import type { JobRequirement } from "../data";
import {
  getJobRequirements,
  addJobRequirement,
  updateJobRequirement,
  deleteJobRequirement,
} from "../services/api/requirements";

interface JobContextType {
  jobs: JobRequirement[];
  approveJob: (id: number) => Promise<void>;
  addJob: (job: Partial<JobRequirement>) => Promise<JobRequirement | null>;
  updateJob: (job: JobRequirement) => Promise<JobRequirement | null>;
  deleteJob: (id: number) => Promise<void>;
}

export const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<JobRequirement[]>([]);

  const fetchManagerJobs = async () => {
    try {
      const allJobs = await getJobRequirements(); // This calls /manager/JobRequirements
      setJobs(allJobs); // No need to filter by managerId if backend already does that
    } catch (err) {
      console.error("Failed to load job requirements", err);
    }
  };

  useEffect(() => {
    fetchManagerJobs();
  }, []);

  const approveJob = async (id: number) => {
    try {
      const job = jobs.find((j) => j.requirementId === id);
      if (!job) return;

      const updated = await updateJobRequirement(id, {
        ...job,
        status: "Approved",
      });

      setJobs((prev) =>
        prev.map((j) => (j.requirementId === updated.requirementId ? updated : j))
      );
    } catch (err) {
      console.error("approveJob error", err);
    }
  };

  const addJob = async (job: Partial<JobRequirement>) => {
    try {
      await addJobRequirement(job);
      await fetchManagerJobs(); // Refresh after adding
      return null;
    } catch (err) {
      console.error("addJob error", err);
      return null;
    }
  };

  const updateJob = async (job: JobRequirement) => {
    try {
      const updated = await updateJobRequirement(job.requirementId, job);
      setJobs((prev) =>
        prev.map((j) => (j.requirementId === updated.requirementId ? updated : j))
      );
      return updated;
    } catch (err) {
      console.error("updateJob error", err);
      return null;
    }
  };

  const deleteJob = async (id: number) => {
    try {
      await deleteJobRequirement(id);
      setJobs((prev) => prev.filter((j) => j.requirementId !== id));
    } catch (err) {
      console.error("deleteJob error", err);
    }
  };

  return (
    <JobContext.Provider
      value={{ jobs, approveJob, addJob, updateJob, deleteJob }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error("useJobs must be used within a JobProvider");
  }
  return context;
};