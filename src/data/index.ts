export interface User {
    UserId: number;
    Email: string;
    Password?: string;
    FirstName?: string;
    LastName?: string;
    Phone?: string;
    Role: string;
    session_token?: string;
    last_login?: string;
    CreatedAt?: string;
    UpdatedAt?: string;
    IsActive?: boolean;
  }
  
  export interface JobRequirement {
    requirementId: number;
    managerId: number;
    jobTitle: string;
    jobDescription: string;
    yearsExperience: number;
    requiredSkills: string;
    numberOfOpenings: number;
    numberOfRounds: number;
    status: '0' | '1' | '2';
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Job {
    JobId: number;
    JobTitle: string;
    JobDescription: string;
    YearsExperience: number;
    RequiredSkills: string[]
    NumberOfOpenings: number;
    NumberOfRounds: number;
    Status: 'Active' | 'Inactive' | 'Closed' | 'Approved';
  }
  
  export interface Application {
    applicationId: number;
    jobId: number;
    candidateId: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    resumePath: string;
    keywordScore: number;
    status: 'Applied' | 'Interview Scheduled' | 'In Progress' | 'Rejected' | 'Selected';
    currentRound: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface InterviewFeedback {
    feedbackId: number;
    interviewId: number;
    interviewerId: number;
    comments: string;
    score: number;
    result: 'Accepted' | 'Rejected' | 'Pending';
    createdAt: string;
    updatedAt: string;
  }

  export interface Applicant {
    id: number;
    name: string;
    email: string;
    phone: string;
    jobId: number;
    score: number;
    appliedDate: string;
    lastUpdated: string;
    currentRound: number;
    status: 'Applied' | 'Interview Scheduled' | 'In Progress' | 'Rejected';
    resumeUrl: string;
  }
  
  export interface Interview {
    interviewId: number;
    applicationId: number;
    interviewerId: number;
    hrId: number;
    roundNumber: number;
    scheduledTime: string;
    teamsLink: string;
    meetingDetails: string;
    status: 'Scheduled' | 'Completed' | 'Cancelled' | 'In Progress';
    createdAt: string;
    updatedAt: string;
  }
  
  export interface DashboardMetrics {
    activeJobs: number;
    totalApplications: number;
    pendingReview: number;
    scheduledInterviews: number;
  }
