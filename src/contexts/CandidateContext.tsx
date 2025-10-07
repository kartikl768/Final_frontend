import React, { createContext, useContext, useState, useEffect } from "react";
import type { Job, Application } from "../data";
import * as jobsApi from "../services/api/jobs";
import * as applicationsApi from "../services/api/applications";

interface CandidateContextType {
  // Jobs
  jobs: Job[];
  fetchJobs: () => Promise<void>;
  
  // Applications
  applications: Application[];
  fetchApplications: () => Promise<void>;
  createApplication: (data: any) => Promise<void>;
  
  // Loading states
  loading: boolean;
  jobsLoading: boolean;
  applicationsLoading: boolean;
}

export const CandidateContext = createContext<CandidateContextType | undefined>(undefined);

export const CandidateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [applicationsLoading, setApplicationsLoading] = useState(false);

  // Jobs
  const fetchJobs = async () => {
    setJobsLoading(true);
    try {
      const data = await jobsApi.getJobs();
      setJobs(data);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    } finally {
      setJobsLoading(false);
    }
  };

  // Applications
  const fetchApplications = async () => {
    setApplicationsLoading(true);
    try {
      const data = await applicationsApi.getMyApplications();
      setApplications(data);
    } catch (error) {
      console.error("Failed to fetch applications", error);
    } finally {
      setApplicationsLoading(false);
    }
  };

  const createApplication = async (data: any) => {
    try {
      await applicationsApi.createApplication(data);
      await fetchApplications();
    } catch (error) {
      console.error("Failed to create application", error);
      throw error;
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchJobs(),
          fetchApplications(),
        ]);
      } catch (error) {
        console.error("Failed to fetch initial candidate data", error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch data if user is Candidate
    const userRole = sessionStorage.getItem("rms_user");
    if (userRole) {
      const user = JSON.parse(userRole);
      if (user.Role === 3 || user.Role === "Candidate") {
        fetchInitialData();
      } else {
        // If not Candidate, just set loading to false
        setLoading(false);
      }
    } else {
      // If no user, set loading to false
      setLoading(false);
    }
  }, []);

  return (
    <CandidateContext.Provider
      value={{
        jobs,
        fetchJobs,
        applications,
        fetchApplications,
        createApplication,
        loading,
        jobsLoading,
        applicationsLoading,
      }}
    >
      {children}
    </CandidateContext.Provider>
  );
};

export const useCandidate = () => {
  const context = useContext(CandidateContext);
  if (!context) throw new Error("useCandidate must be used within a CandidateProvider");
  return context;
};
