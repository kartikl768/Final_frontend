// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { useHR } from "../../contexts/HRContext";
// import { Users, Clock, Briefcase, Search, Filter } from "lucide-react";

// const Jobs: React.FC = () => {
//   const { jobs, allJobRequirements, applications, loading } = useHR();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [sortBy, setSortBy] = useState("date"); // date, title, status

//   const totalApplicants = applications.length;

//   // Debug logging
//   console.log("Jobs.tsx: jobs:", jobs);
//   console.log("Jobs.tsx: jobs length:", jobs?.length);
//   if (jobs && jobs.length > 0) {
//     console.log("Jobs.tsx: First job object:", jobs[0]);
//     console.log("Jobs.tsx: First job object keys:", Object.keys(jobs[0]));
//     console.log("Jobs.tsx: First job jobTitle:", jobs[0].jobTitle);
//     console.log("Jobs.tsx: First job status:", jobs[0].status);
//   }

//   // Filter ACTIVE JOBS based on search term and status
//   let filteredJobs = (jobs || []).filter((job) => {
//     // Add null/undefined checks
//     if (!job) {
//       console.warn("Jobs.tsx: Job object is null/undefined:", job);
//       return false;
//     }
    
//     if (!job.jobTitle) {
//       console.warn("Jobs.tsx: Job object missing jobTitle:", job);
//       console.warn("Jobs.tsx: Job object keys:", Object.keys(job));
//       return false;
//     }
    
//     const matchesSearch = job.jobTitle
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === "All" || job.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   // Sort the filtered results
//   filteredJobs = filteredJobs.sort((a, b) => {
//     switch (sortBy) {
//       case "title":
//         return a.jobTitle.localeCompare(b.jobTitle);
//       case "status":
//         return a.status.localeCompare(b.status);
//       case "date":
//       default:
//         return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newest first
//     }
//   });

//   // Get pending and rejected job requirements to show at the end
//   const pendingRequirements = (allJobRequirements || []).filter(req => req.status === "Pending");
//   const rejectedRequirements = (allJobRequirements || []).filter(req => req.status === "Rejected");

//   const activeJobs = filteredJobs.filter((job) => job.status === "Active");

//   if (loading) {
//     return (
//       <div className="container-fluid py-4">
//         <div className="text-center">
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="mt-2 text-muted">Loading jobs...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container-fluid py-4">
//       <div className="text-center mb-5">
//         <h1 className="display-4 text-primary fw-bold">Jobs</h1>
//         <p className="lead text-muted">
//           View and manage all active jobs and their applications
//         </p>
//       </div>

//       {/* Search and Filter */}
//       <div className="row mb-4">
//         <div className="col-md-6">
//           <div className="input-group">
//             <span className="input-group-text">
//               <Search size={16} />
//             </span>
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Search by job title..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>
//         <div className="col-md-3">
//           <select
//             className="form-select"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//           >
//             <option value="All">All Status</option>
//             <option value="Active">Active</option>
//             <option value="Inactive">Inactive</option>
//             <option value="Closed">Closed</option>
//           </select>
//         </div>
//         <div className="col-md-2">
//           <select
//             className="form-select"
//             value={sortBy}
//             onChange={(e) => setSortBy(e.target.value)}
//           >
//             <option value="date">Sort by Date</option>
//             <option value="title">Sort by Title</option>
//             <option value="status">Sort by Status</option>
//           </select>
//         </div>
//         <div className="col-md-1">
//           <div className="d-flex align-items-center text-muted">
//             <Filter size={16} className="me-1" />
//             <small>{filteredJobs.length}</small>
//           </div>
//         </div>
//       </div>

//       <div className="row justify-content-center mb-4">
//         <div className="col-auto">
//           <span className="badge bg-success fs-6 d-flex flex-column align-items-center p-2">
//             <Briefcase size={16} className="mb-1" />
//             {activeJobs.length} Active Jobs
//           </span>
//         </div>
//         <div className="col-auto">
//           <span className="badge bg-warning text-dark fs-6 d-flex flex-column align-items-center p-2">
//             <Clock size={16} className="mb-1" />
//             {pendingRequirements.length} Pending Approval
//           </span>
//         </div>
//         <div className="col-auto">
//           <span className="badge bg-danger fs-6 d-flex flex-column align-items-center p-2">
//             <Filter size={16} className="mb-1" />
//             {rejectedRequirements.length} Rejected
//           </span>
//         </div>
//         <div className="col-auto">
//           <span className="badge bg-primary fs-6 d-flex flex-column align-items-center p-2">
//             <Users size={16} className="mb-1" />
//             {totalApplicants} Total Applicants
//           </span>
//         </div>
//       </div>

//       <div className="row justify-content-center">
//         <div className="col-lg-10">
//           {filteredJobs.length === 0 ? (
//             <div className="text-center text-muted py-5">
//               <h4>No jobs found</h4>
//               <p>Try adjusting your search or filter criteria.</p>
//             </div>
//           ) : (
//             filteredJobs.map((job) => {
//               const getStatusBadge = (status: string) => {
//                 switch (status) {
//                   case 'Active':
//                     return <span className="badge bg-success fs-6">Active</span>;
//                   case 'Inactive':
//                     return <span className="badge bg-secondary fs-6">Inactive</span>;
//                   case 'Closed':
//                     return <span className="badge bg-danger fs-6">Closed</span>;
//                   default:
//                     return <span className="badge bg-secondary fs-6">{status}</span>;
//                 }
//               };

//               return (
//                 <div key={job.jobId} className="card mb-4 shadow-sm border-0">
//                   <div className="card-body p-4">
//                     <div className="d-flex justify-content-between align-items-start mb-3">
//                       <h3 className="card-title h4 mb-0">{job.jobTitle}</h3>
//                       {getStatusBadge(job.status)}
//                     </div>

//                   <div className="row text-muted mb-3">
//                     <div className="col-auto">
//                       <Clock size={16} className="me-1" />
//                       {job.yearsExperience} years
//                     </div>
//                     <div className="col-auto">
//                       <Users size={16} className="me-1" />
//                       {job.numberOfOpenings} openings
//                     </div>
//                   </div>

//                   <p className="card-text text-muted mb-4">{job.jobDescription}</p>

//                   <div className="mb-4">
//                     <h6 className="text-muted mb-2">
//                       <span className="text-warning">🔧</span> Required Skills
//                     </h6>
//                     <div className="d-flex flex-wrap gap-2">
//                       {Array.isArray(job.requiredSkills) 
//                         ? job.requiredSkills.map((skill, index) => (
//                             <span key={index} className="badge bg-light text-dark border">
//                               {skill.trim()}
//                             </span>
//                           ))
//                         : job.requiredSkills.split(",").map((skill, index) => (
//                             <span key={index} className="badge bg-light text-dark border">
//                               {skill.trim()}
//                             </span>
//                           ))
//                       }
//                     </div>
//                   </div>

//                   <div className="d-flex justify-content-between align-items-center">
//                     <div className="text-muted">
//                       <span className="text-danger">🎯</span> {job.numberOfRounds} interview rounds
//                     </div>
//                     {job.status === "Active" ? (
//                       <Link
//                         to={`/hr/applicants/${job.jobId}`}
//                         className="btn btn-dark btn-lg px-4"
//                       >
//                         View Applicants →
//                       </Link>
//                     ) : (
//                       <span className="text-muted">
//                         {job.status === "Inactive" ? "Job Inactive" : "Not available"}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//               );
//             })
//           )}
//         </div>
//       </div>

//       {/* Pending Job Requirements Section */}
//       {pendingRequirements.length > 0 && (
//         <div className="row justify-content-center mt-5">
//           <div className="col-lg-10">
//             <div className="text-center mb-4">
//               <h2 className="h3 text-warning fw-bold">
//                 <Clock size={24} className="me-2" />
//                 Pending Job Requirements
//               </h2>
//               <p className="text-muted">Job requirements waiting for approval</p>
//             </div>
            
//             {pendingRequirements.map((req) => (
//               <div key={req.requirementId} className="card mb-3 shadow-sm border-warning">
//                 <div className="card-body p-4">
//                   <div className="d-flex justify-content-between align-items-start mb-3">
//                     <h4 className="card-title h5 mb-0">{req.jobTitle}</h4>
//                     <span className="badge bg-warning text-dark fs-6">Pending Approval</span>
//                   </div>
                  
//                   <div className="row text-muted mb-3">
//                     <div className="col-auto">
//                       <Clock size={16} className="me-1" />
//                       {req.yearsExperience} years
//                     </div>
//                     <div className="col-auto">
//                       <Users size={16} className="me-1" />
//                       {req.numberOfOpenings} openings
//                     </div>
//                   </div>

//                   <p className="card-text text-muted mb-3">{req.jobDescription}</p>

//                   <div className="d-flex justify-content-between align-items-center">
//                     <div className="text-muted">
//                       <span className="text-danger">🎯</span> {req.numberOfRounds} interview rounds
//                     </div>
//                     <Link
//                       to={`/hr/approvals`}
//                       className="btn btn-warning btn-lg px-4"
//                     >
//                       Review & Approve →
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Rejected Job Requirements Section */}
//       {rejectedRequirements.length > 0 && (
//         <div className="row justify-content-center mt-5">
//           <div className="col-lg-10">
//             <div className="text-center mb-4">
//               <h2 className="h3 text-danger fw-bold">
//                 <Filter size={24} className="me-2" />
//                 Rejected Job Requirements
//               </h2>
//               <p className="text-muted">Job requirements that were rejected</p>
//             </div>
            
//             {rejectedRequirements.map((req) => (
//               <div key={req.requirementId} className="card mb-3 shadow-sm border-danger">
//                 <div className="card-body p-4">
//                   <div className="d-flex justify-content-between align-items-start mb-3">
//                     <h4 className="card-title h5 mb-0">{req.jobTitle}</h4>
//                     <span className="badge bg-danger fs-6">Rejected</span>
//                   </div>
                  
//                   <div className="row text-muted mb-3">
//                     <div className="col-auto">
//                       <Clock size={16} className="me-1" />
//                       {req.yearsExperience} years
//                     </div>
//                     <div className="col-auto">
//                       <Users size={16} className="me-1" />
//                       {req.numberOfOpenings} openings
//                     </div>
//                   </div>

//                   <p className="card-text text-muted mb-3">{req.jobDescription}</p>

//                   <div className="d-flex justify-content-between align-items-center">
//                     <div className="text-muted">
//                       <span className="text-danger">🎯</span> {req.numberOfRounds} interview rounds
//                     </div>
//                     <span className="text-muted">Rejected</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Jobs;
