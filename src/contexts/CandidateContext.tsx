import React, { createContext, useContext, useState, useEffect } from "react";
import type { Job, Application } from "../data";
import * as jobsApi from "../services/api/jobs";
import * as applicationsApi from "../services/api/applications";
import { useAuth } from "./AuthContext";

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

  const { user, isAuthenticated } = useAuth();
    useEffect(() => {
      const intervalId = setInterval(() => {
        fetchApplications();
      }, 500000);

      return () => clearInterval(intervalId);
    }, []);
  // Jobs
  const fetchJobs = async () => {
    setJobsLoading(true);
    try {
      console.log("CandidateContext: Fetching jobs for candidate...");
      const data = await jobsApi.getJobs();
      console.log("CandidateContext: Raw jobs data:", data);
      setJobs(Array.isArray(data) ? data : []);
      console.log("CandidateContext: Set jobs in state:", Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("CandidateContext: Failed to fetch jobs", error);
    } finally {
      setJobsLoading(false);
    }
  };

  // Applications
  const fetchApplications = async () => {
    setApplicationsLoading(true);
    try {
      const data = await applicationsApi.getMyApplications();
      const enriched = data.map((app: any) => {
      const job = jobs.find(j => j.jobId === app.jobId);
      return {
        ...app,
        jobTitle: job?.jobTitle || 'Unknown',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: user?.phone || '',
      };
    });
    console.log("application data", data  );
    console.log("User info:", user);
      setApplications(enriched);
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

  const isCandidate = (role: any) => {
    return role === 3 || role === "Candidate" || role === "3";
  };

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        await fetchJobs(); // ensure jobs are loaded first
        await fetchApplications(); // then fetch applications
      } catch (error) {
        console.error("Failed to fetch initial candidate data", error);
      } finally {
        setLoading(false);
      }
    };

    console.log("CandidateContext useEffect - isAuthenticated:", isAuthenticated, "user:", user);
    
    if (isAuthenticated && user) {
      console.log("CandidateContext useEffect - user role:", user.Role);
      if (isCandidate(user.Role)) {
        console.log("CandidateContext - fetching data for Candidate");
        fetchInitialData();
      } else {
        console.log("CandidateContext - not Candidate, setting loading to false");
        setLoading(false);
        // Clear data if not Candidate
        setJobs([]);
        setApplications([]);
      }
    } else {
      console.log("CandidateContext - no user, setting loading to false");
      setLoading(false);
      // Clear data if no user
      setJobs([]);
      setApplications([]);
    }
  }, [isAuthenticated, user]);
  useEffect(() => {
  if (jobs.length > 0 && applications.length > 0) {
    const enriched = applications.map(app => {
      const job = jobs.find(j => j.jobId === app.jobId);
      return {
        ...app,
        jobTitle: job?.jobTitle ?? 'Unknown',
      };
    });
    setApplications(enriched);
  }
}, [jobs]);
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
