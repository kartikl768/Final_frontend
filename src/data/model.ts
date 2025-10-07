import type { User, JobRequirement, Job, Application, Applicant, Interview, DashboardMetrics } from '../data';
export type { User, JobRequirement, Job, Application, Applicant, Interview, DashboardMetrics };


// export const users: User[] = [
//   {
//     user_id: 1,
//     email: "manager1@example.com",
//     password: "password123",
//     first_name: "Ravi",
//     last_name: "Kumar",
//     phone: "+91-9876543210",
//     role: "Manager",
//     session_token: "abc123token",
//     last_login: "2025-09-20T10:00:00Z",
//     created_at: "2025-09-01T08:30:00Z",
//     updated_at: "2025-09-20T10:00:00Z",
//     is_active: true,
//   },
//   {
//     user_id: 2,
//     email: "hr1@example.com",
//     password: "password123",
//     first_name: "Sneha",
//     last_name: "Patel",
//     phone: "+91-9876543211",
//     role: "HR",
//     session_token: "def456token",
//     last_login: "2025-09-21T09:15:00Z",
//     created_at: "2025-09-05T10:00:00Z",
//     updated_at: "2025-09-21T09:15:00Z",
//     is_active: true,
//   },
//   {
//     user_id: 3,
//     email: "interviewer1@example.com",
//     password: "password123",
//     first_name: "Arjun",
//     last_name: "Mehta",
//     phone: "+91-9876543212",
//     role: "Interviewer",
//     session_token: "ghi789token",
//     last_login: "2025-09-19T14:20:00Z",
//     created_at: "2025-09-07T11:30:00Z",
//     updated_at: "2025-09-19T14:20:00Z",
//     is_active: true,
//   },
//   {
//     user_id: 4,
//     email: "candidate1@example.com",
//     password: "password123",
//     first_name: "Priya",
//     last_name: "Sharma",
//     phone: "+91-9876543213",
//     role: "Candidate",
//     session_token: "jkl012token",
//     last_login: "2025-09-22T15:45:00Z",
//     created_at: "2025-09-10T09:00:00Z",
//     updated_at: "2025-09-22T15:45:00Z",
//     is_active: true,
//   },
// ];

// export const jobRequirements: JobRequirement[] = [
//   {
//     requirement_id: 1,
//     manager_id: 1,
//     job_title: ".NET Developer",
//     job_description:
//       "We are looking for a skilled .NET developer with experience in C#, ASP.NET Core, and Entity Framework.",
//     years_experience: 3,
//     required_skills: "C#, ASP.NET Core, Entity Framework, SQL Server, REST API",
//     number_of_openings: 5,
//     number_of_rounds: 3,
//     status: "Approved",
//     created_at: "2025-09-15T08:00:00Z",
//     updated_at: "2025-09-20T09:30:00Z",
//   },
//   {
//     requirement_id: 2,
//     manager_id: 1,
//     job_title: "Java Developer",
//     job_description:
//       "Looking for a Java developer with strong expertise in Spring Boot and microservices.",
//     years_experience: 4,
//     required_skills: "Java, Spring Boot, Microservices, MySQL, REST API",
//     number_of_openings: 3,
//     number_of_rounds: 3,
//     status: "Pending",
//     created_at: "2025-09-16T09:00:00Z",
//     updated_at: "2025-09-19T12:00:00Z",
//   },
//   {
//     requirement_id: 3,
//     manager_id: 2,
//     job_title: "Frontend Developer",
//     job_description:
//       "Seeking a Frontend Developer with React, TypeScript, and Tailwind CSS experience.",
//     years_experience: 2,
//     required_skills: "React, TypeScript, Tailwind CSS, Redux, HTML, CSS",
//     number_of_openings: 4,
//     number_of_rounds: 2,
//     status: "Approved",
//     created_at: "2025-09-18T07:30:00Z",
//     updated_at: "2025-09-21T10:15:00Z",
//   },
// ];

// export const applications: Application[] = [
//   {
//     application_id: 1,
//     job_id: 1,
//     candidate_id: 5,
//     first_name: "Alex",
//     last_name: "Davis",
//     email: "alex.candidate@gmail.com",
//     phone: "+1-555-0105",
//     resume_path: "/uploads/resumes/alex_davis_resume.pdf",
//     keyword_score: 8,
//     status: "In Progress",
//     current_round: 2,
//     created_at: "2024-02-01T14:00:00Z",
//     updated_at: "2024-02-05T16:00:00Z",
//   },
//   {
//     application_id: 2,
//     job_id: 1,
//     candidate_id: 6,
//     first_name: "Emma",
//     last_name: "Taylor",
//     email: "emma.candidate@gmail.com",
//     phone: "+1-555-0106",
//     resume_path: "/uploads/resumes/emma_taylor_resume.pdf",
//     keyword_score: 6,
//     status: "Interview Scheduled",
//     current_round: 1,
//     created_at: "2024-02-02T10:00:00Z",
//     updated_at: "2024-02-03T11:00:00Z",
//   },
// ];



export const jobs: Job[] = [
  {
    JobId: 1,
    JobTitle: '.NET Developer',
    YearsExperience: 3,
    NumberOfOpenings: 5,
    Status: 'Active',
    JobDescription: 'We are looking for a skilled .NET developer to join our team. The candidate should have experience with C#, ASP.NET Core, and Entity Framework.',
    RequiredSkills: ['C#', 'ASP.NET Core', 'Entity Framework', 'SQL Server', 'REST API', 'MVC', 'Git'],
    NumberOfRounds: 3
  },
  {
    JobId: 2,
    JobTitle: 'Java Developer',
    YearsExperience: 4,
    NumberOfOpenings: 3,
    Status: 'Active',
    JobDescription: 'Looking for a Java developer with experience in Spring Boot and microservices architecture.',
    RequiredSkills: ['Java', 'Spring Boot', 'Microservices', 'MySQL', 'REST API', 'Maven', 'Docker'],
    NumberOfRounds: 3
  },
  {
    JobId: 3,
    JobTitle: 'Frontend Developer',
    YearsExperience: 2,
    NumberOfOpenings: 4,
    Status: 'Active',
    JobDescription: 'Looking for a Frontend Developer skilled in React, TypeScript, and Tailwind CSS to build responsive web applications.',
    RequiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'HTML', 'CSS', 'Redux'],
    NumberOfRounds: 2
  }
];

export const applicants: Applicant[] = [
  {
    id: 1,
    name: 'Emma Taylor',
    email: 'emma.candidate@gmail.com',
    phone: '+1-555-0106',
    jobId: 1,
    score: 6,
    appliedDate: '2/2/2024',
    lastUpdated: '2/3/2024',
    currentRound: 1,
    status: 'Interview Scheduled',
    resumeUrl: '/uploads/resumes/emma_taylor_resume.pdf'
  },
  {
    id: 2,
    name: 'Alex Davis',
    email: 'alex.candidate@gmail.com',
    phone: '+1-555-0105',
    jobId: 1,
    score: 8,
    appliedDate: '2/1/2024',
    lastUpdated: '2/3/2024',
    currentRound: 2,
    status: 'In Progress',
    resumeUrl: '/uploads/resumes/alex_davis_resume.pdf'
  },
  {
    id: 3,
    name: 'Michael Chen',
    email: 'michael.chen@gmail.com',
    phone: '+1-555-0107',
    jobId: 2,
    score: 9,
    appliedDate: '2/3/2024',
    lastUpdated: '2/3/2024',
    currentRound: 1,
    status: 'Applied',
    resumeUrl: '/uploads/resumes/michael_chen_resume.pdf'
  }
];

export const interviews: Interview[] = [
  {
    id: 1,
    applicantId: 1,
    applicantName: 'Alex Davis',
    date: '2/5/2024',
    time: '8:30:00 PM',
    duration: 60,
    interviewer: 'John Smith',
    round: 2,
    status: 'Scheduled'
  }
];

export const dashboardMetrics: DashboardMetrics = {
  activeJobs: 2,
  totalApplications: 3,
  pendingReview: 1,
  scheduledInterviews: 1
};

export const interviewers = [
  'John Smith',
  'Sarah Wilson',
  'Mike Johnson',
  'Emily Davis',
  'David Brown'
];