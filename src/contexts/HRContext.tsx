import React, { createContext, useContext, useState, useEffect } from "react";
import type { Application, Interview, JobRequirement, User } from "../data";
import * as applicationsApi from "../services/api/applications";
import * as interviewsApi from "../services/api/interviews";
import * as approvalsApi from "../services/api/approvals";
import * as usersApi from "../services/api/users";
import * as hrReqApi from "../services/api/hrRequirements";
import { useAuth } from "./AuthContext";

interface HRContextType {
  // Applications
  applications: Application[];
  fetchApplications: () => Promise<void>;
  updateApplication: (id: number, data: any) => Promise<void>;
  
  // Interviews
  interviews: Interview[];
  fetchInterviews: () => Promise<void>;
  createInterview: (data: any) => Promise<void>;
  updateInterview: (id: number, data: any) => Promise<void>;
  
  // Approvals
  pendingApprovals: JobRequirement[];
  fetchPendingApprovals: () => Promise<void>;
  approveJobRequirement: (id: number, comments?: string) => Promise<void>;
  rejectJobRequirement: (id: number, comments?: string) => Promise<void>;
  
  // All Job Requirements
  allJobRequirements: JobRequirement[];
  fetchAllJobRequirements: () => Promise<void>;
  
  // Users
  users: User[];
  fetchUsers: () => Promise<void>;
  createUser: (data: any) => Promise<void>;
  updateUser: (id: number, data: any) => Promise<void>;
  // Loading states
  loading: boolean;
  applicationsLoading: boolean;
  interviewsLoading: boolean;
  approvalsLoading: boolean;
  jobRequirementsLoading: boolean;
}

export const HRContext = createContext<HRContextType | undefined>(undefined);

export const HRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<JobRequirement[]>([]);
  const [allJobRequirements, setAllJobRequirements] = useState<JobRequirement[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [interviewsLoading, setInterviewsLoading] = useState(false);
  const [approvalsLoading, setApprovalsLoading] = useState(false);
  const [jobRequirementsLoading, setJobRequirementsLoading] = useState(false);
  
  const { user, isAuthenticated } = useAuth();

  const isHR = (role: any) => {
    return role === 1 || role === "HR" || role === "1";
  };

  // Applications
  const fetchApplications = async () => {
    setApplicationsLoading(true);
    try {
      const data = await applicationsApi.getAllApplications();
      setApplications(data);
    } catch (error) {
      console.error("Failed to fetch applications", error);
    } finally {
      setApplicationsLoading(false);
    }
  };

  const updateApplication = async (id: number, data: any) => {
    try {
      await applicationsApi.updateApplication(id, data);
      await fetchApplications();
    } catch (error) {
      console.error("Failed to update application", error);
      throw error;
    }
  };

  // Interviews
  const fetchInterviews = async () => {
    setInterviewsLoading(true);
    try {
      const data = await interviewsApi.getAllInterviews();
      setInterviews(data);
    } catch (error) {
      console.error("Failed to fetch interviews", error);
    } finally {
      setInterviewsLoading(false);
    }
  };

  const createInterview = async (data: any) => {
    try {
      await interviewsApi.createInterview(data);
      await fetchInterviews();
    } catch (error) {
      console.error("Failed to create interview", error);
      throw error;
    }
  };

  const updateInterview = async (id: number, data: any) => {
    try {
      await interviewsApi.updateInterview(id, data);
      await fetchInterviews();
    } catch (error) {
      console.error("Failed to update interview", error);
      throw error;
    }
  };

  // Approvals
  const fetchPendingApprovals = async () => {
    setApprovalsLoading(true);
    try {
      console.log("HRContext: Starting to fetch pending approvals...");
      const data = await approvalsApi.getPendingApprovals();
      console.log("HRContext: Raw pending approvals data:", data);
      setPendingApprovals(data);
      console.log("HRContext: Set pending approvals in state:", data);
    } catch (error) {
      console.error("HRContext: Failed to fetch pending approvals", error);
    } finally {
      setApprovalsLoading(false);
    }
  };

  const fetchAllJobRequirements = async () => {
    setJobRequirementsLoading(true);
    try {
      console.log("HRContext: Starting to fetch all job requirements...");
      const data = await hrReqApi.getAllJobRequirements();
      console.log("HRContext: Raw all job requirements data:", data);
      setAllJobRequirements(data);
      console.log("HRContext: Set all job requirements in state:", data);
    } catch (error) {
      console.error("HRContext: Failed to fetch all job requirements", error);
    } finally {
      setJobRequirementsLoading(false);
    }
  };

  const approveJobRequirement = async (id: number, comments?: string) => {
    try {
      console.log("HRContext: Approving job requirement", id, "with comments:", comments);
      await approvalsApi.approveJobRequirement(id, { status: "1", comments });
      // Refresh both pending approvals and all job requirements
      await Promise.all([fetchPendingApprovals(), fetchAllJobRequirements()]);
      console.log("HRContext: Job requirement approved and data refreshed");
    } catch (error) {
      console.error("Failed to approve job requirement", error);
      throw error;
    }
  };

  const rejectJobRequirement = async (id: number, comments?: string) => {
    try {
      console.log("HRContext: Rejecting job requirement", id, "with comments:", comments);
      await approvalsApi.rejectJobRequirement(id, { status: "2", comments });
      // Refresh both pending approvals and all job requirements
      await Promise.all([fetchPendingApprovals(), fetchAllJobRequirements()]);
      console.log("HRContext: Job requirement rejected and data refreshed");
    } catch (error) {
      console.error("Failed to reject job requirement", error);
      throw error;
    }
  };

  // Users
  const fetchUsers = async () => {
    try {
      const data = await usersApi.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const createUser = async (data: any) => {
    try {
      await usersApi.createUser(data);
      await fetchUsers();
    } catch (error) {
      console.error("Failed to create user", error);
      throw error;
    }
  };

  const updateUser = async (id: number, data: any) => {
    try {
      await usersApi.updateUser(id, data);
      await fetchUsers();
    } catch (error) {
      console.error("Failed to update user", error);
      throw error;
    }
  };
  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchApplications(),
          fetchInterviews(),
          fetchPendingApprovals(),
          fetchAllJobRequirements(),
          fetchUsers(),
        ]);
      } catch (error) {
        console.error("Failed to fetch initial HR data", error);
      } finally {
        setLoading(false);
      }
    };

    console.log("HRContext useEffect - isAuthenticated:", isAuthenticated, "user:", user);
    
    if (isAuthenticated && user) {
      console.log("HRContext useEffect - user role:", user.Role);
      if (isHR(user.Role)) {
        console.log("HRContext - fetching data for HR");
        fetchInitialData();
      } else {
        // If not HR, just set loading to false
        console.log("HRContext - not HR, setting loading to false");
        setLoading(false);
      }
    } else {
      // If no user, set loading to false
      console.log("HRContext - no user, setting loading to false");
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  return (
    <HRContext.Provider
      value={{
        applications,
        fetchApplications,
        updateApplication,
        interviews,
        fetchInterviews,
        createInterview,
        updateInterview,
        pendingApprovals,
        fetchPendingApprovals,
        approveJobRequirement,
        rejectJobRequirement,
        allJobRequirements,
        fetchAllJobRequirements,
        users,
        fetchUsers,
        createUser,
        loading,
        applicationsLoading,
        interviewsLoading,
        approvalsLoading,
        jobRequirementsLoading,
      }}
    >
      {children}
    </HRContext.Provider>
  );
};

export const useHR = () => {
  const context = useContext(HRContext);
  if (!context) throw new Error("useHR must be used within an HRProvider");
  return context;
};
