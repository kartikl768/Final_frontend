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
    jobId: number;
    requirementId: number;
    hrId: number;
    jobTitle: string;
    jobDescription: string;
    yearsExperience: number;
    requiredSkills: string[];
    numberOfOpenings: number;
    numberOfRounds: number;
    status: 'Active' | 'Inactive' | 'Closed';
    createdAt: string;
    updatedAt: string;
  }
  export interface JobCreateDTO {
  requirementId: number;
  jobTitle: string;
  jobDescription: string;
  yearsExperience: number;
  requiredSkills: string[];
  numberOfOpenings: number;
  numberOfRounds: number;
}
  
  export interface Application {
    applicationId: number;
    job: {
      jobId: number;
      jobTitle: string;
      yearsExperience: string;
      numberOfRounds: number;
      numberOfOpenings: number;
      requiredSkills: string[];
    }
    candidateId: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    resumePath: string;
    keywordScore: number;
    status: 'Applied' | 'UnderReview' | 'InterviewScheduled' | 'InProgress' | 'Selected' | 'Rejected';
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

  export interface Applicants {
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
