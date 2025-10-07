import React, { createContext, useContext, useState, useEffect } from "react";
import type { JobRequirement } from "../data";
import * as reqApi from "../services/api/requirements";
import { useAuth } from "./AuthContext";

interface JobContextType {
  jobs: JobRequirement[];
  fetchJobs: () => Promise<void>;
  addJob: (job: Partial<JobRequirement>) => Promise<JobRequirement | null>;
  updateJob: (job: JobRequirement) => Promise<JobRequirement | null>;
  deleteJob: (id: number) => Promise<void>;
  approveJob: (id: number) => Promise<void>;
  loading: boolean;
}

export const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<JobRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  const isManager = (role: any) => {
    return role === 0 || role === "Manager" || role === "0";
  };

  const fetchJobs = async () => {
    try {
      console.log("JobContext: Starting to fetch jobs...");
      const jobs = await reqApi.getJobRequirements();
      console.log("JobContext: Raw API response:", jobs);
      setJobs(Array.isArray(jobs) ? jobs : []);
      console.log("JobContext: Set jobs in state:", Array.isArray(jobs) ? jobs : []);
    } catch (error) {
      console.error("JobContext: Failed to fetch jobs", error);
    } finally {
      setLoading(false);
    }
  };

  const addJob = async (job: Partial<JobRequirement>) => {
    try {
      console.log("JobContext: Creating new job with data:", job);
      const newJob = await reqApi.createJobRequirement({
        jobTitle: job.jobTitle || "",
        jobDescription: job.jobDescription || "",
        yearsExperience: job.yearsExperience || 0,
        requiredSkills: job.requiredSkills || "",
        numberOfOpenings: job.numberOfOpenings || 1,
        numberOfRounds: job.numberOfRounds || 3,
      });
      console.log("JobContext: Created job successfully:", newJob);
      setJobs((prev) => {
        const updated = [...prev, newJob];
        console.log("JobContext: Updated jobs array:", updated);
        return updated;
      });
      return newJob;
    } catch (err) {
      console.error("JobContext: Failed to add job", err);
      return null;
    }
  };

  const updateJob = async (job: JobRequirement) => {
    try {
      if (!job || !job.requirementId) {
        console.error("Invalid job data for update:", job);
        return null;
      }
      
      const updated = await reqApi.updateJobRequirement(job.requirementId, job);
      setJobs((prev) =>
        prev.map((j) => (j.requirementId === updated.requirementId ? updated : j))
      );
      return updated;
    } catch (err) {
      console.error("Failed to update job", err);
      return null;
    }
  };

  const deleteJob = async (id: number) => {
    try {
      await reqApi.deleteJobRequirement(id);
      setJobs((prev) => prev.filter((j) => j.requirementId !== id));
    } catch (err) {
      console.error("Failed to delete job", err);
      throw err;
    }
  };

  const approveJob = async (id: number) => {
    try {
      await reqApi.updateJobRequirement(id, { status: "Approved" });
      await fetchJobs();
    } catch (err) {
      console.error("Failed to approve job", err);
      throw err;
    }
  };

  useEffect(() => {
    console.log("JobContext useEffect - isAuthenticated:", isAuthenticated, "user:", user);
    
    if (isAuthenticated && user) {
      console.log("JobContext useEffect - user role:", user.Role);
      if (isManager(user.Role)) {
        console.log("JobContext - fetching jobs for Manager");
        fetchJobs();
      } else {
        // If not Manager, just set loading to false
        console.log("JobContext - not Manager, setting loading to false");
        setLoading(false);
      }
    } else {
      // If no user, set loading to false
      console.log("JobContext - no user, setting loading to false");
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  return (
    <JobContext.Provider
      value={{ jobs, fetchJobs, addJob, updateJob, deleteJob, approveJob, loading }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) throw new Error("useJobs must be used within a JobProvider");
  return context;
};