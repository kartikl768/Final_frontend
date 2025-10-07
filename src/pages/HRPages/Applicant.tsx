import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { getApplicantById, updateApplication } from '../../services/api/applications';
import InterviewScheduleModal from '../../components/HRComponents/InterviewScheduler';
import type { InterviewData } from '../../components/HRComponents/InterviewScheduler';
import { useHR } from '../../contexts/HRContext';
import { createInterviewForApplication, getFeedbackByApplicationId } from '../../services/api/interviews';

import {
  getFeedbackByInterview,
  type InterviewFeedback,
  serverResultToUi
} from '../../services/api/feedback';

import { getLatestInterviewForApplication } from '../../services/api/interviews'; // <-- ADD THIS
import { Application, Interview } from '../../data';

// ... your statusMap and interfaces stay the same ...

const statusMap: Record<number, string> = {
  0: 'Applied',
  1: 'UnderReview',
  2: 'InterviewScheduled',
  3: 'InProgress',
  4: 'Selected',
  5: 'Rejected',
};

const Applicant: React.FC = () => {
  const { applicantId } = useParams<{ applicantId: string }>();
  const [applicant, setApplicant] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [applicantStatus, setApplicantStatus] = useState('');
  const { applications, jobs, fetchApplications, users, fetchUsers, createInterviewForApplicant } = useHR();
  const [interviewList, setInterviewList] = useState<Interview[]>([]);
  const [interviewId, setInterviewId] = useState<number | null>(null);  
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [feedbackList, setFeedbackList] = useState<InterviewFeedback[]>([]);
  
  // 1) Load applicant
  useEffect(() => {
    const fetchApplicant = async () => {
      try {
        const data = await getApplicantById(Number(applicantId));
        setApplicant(data);
        setApplicantStatus(data.status);
      } catch (error) {
        console.error("Failed to fetch applicant", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicant();
  }, [applicantId]);

  // 2) Once we have the applicant, load the latest interviewId for this application
  useEffect(() => {
    let active = true;
    (async () => {
      if (!applicant?.applicationId) {
        setInterviewId(null);
        return;
      }
      try {
        console.log("printing the application ID", applicant.applicationId);
        const latest = await getLatestInterviewForApplication(applicant.applicationId);
        console.log("Printing the latest",latest);
        if (active) setInterviewId(latest?.interviewId ?? null);
      } catch (e) {
        console.warn("No interviews yet or failed to load latest interview:", e);
        if (active) setInterviewId(null);
      }
    })();
    return () => { active = false; };
  }, [applicant?.applicationId]);

console.log("printing the applicant ID", applicant?.applicationId);
  
// useEffect(() => {
//   let active = true;
//   (async () => {
//     if (!applicant?.applicationId) { setInterviewId(null); return; }
//     try {
//       const latest = await getLatestInterviewForApplication(applicant.applicationId);
//       if (active) setInterviewId(latest?.interviewId ?? null);
//     } catch {
//       if (active) setInterviewId(null);
//     }
//   })();
//   return () => { active = false; };
// }, [applicant?.applicationId]);

  

  

  useEffect(() => {
  let active = true;
  (async () => {
    if (!applicant?.applicationId) return;
    try {
      console.log("kantaraaaa");
      const data = await getFeedbackByApplicationId(applicant.applicationId);
      const filtered = data
        .filter((item: any) => item.feedback !== null);
        // .map((item: any) => item.feedback);
//       // const data = await getFeedbackByApplicationId(applicant.applicationId);
// const filtered = data.filter((item: any) => item.feedback !== null);
// setInterviewList(filtered);
      if (active) {setInterviewList(filtered);
       setFeedbackList(filtered.map((item: any) => item.feedback));
      }
    } catch (error) {
      console.error("Failed to fetch all feedbacks:", error);
    }
  })();
  return () => {
   active = false;
  };
}, [applicant?.applicationId]);



const handleOpenScheduleModal = async () => {
    await fetchUsers();
    setShowScheduleModal(true);
  };


  const handleScheduleInterview = async (interviewData: InterviewData) => {
    try {
      // If your backend returns the created interview with its ID, capture it:
      const created = await createInterviewForApplication(interviewData.applicationId, interviewData);
      // If created contains created.interviewId, set it; otherwise refetch latest.
      if ((created as any)?.interviewId) {
        setInterviewId((created as any).interviewId);
      } else {
        const latest = await getLatestInterviewForApplication(interviewData.applicationId);
        setInterviewId(latest?.interviewId ?? null);
      }
      setApplicantStatus('InterviewScheduled');
      alert(`Interview scheduled successfully for ${applicant?.firstName} ${applicant?.lastName}!`);
    } catch (error) {
      console.error("Failed to create interview for applicant", error);
      alert("Failed to schedule interview.");
    }
  };
  console.log("printing the interview ID", interviewId);

  const handleRejectApplicant = async () => {
    if (!applicant) return;
    if (!window.confirm(`Are you sure you want to reject ${applicant.firstName} ${applicant.lastName}?`)) return;
    try {
      await updateApplication(applicant.applicationId);
      alert(`${applicant.firstName} ${applicant.lastName} has been rejected.`);
      setApplicantStatus('Rejected');
    } catch (error) {
      console.error("Failed to reject applicant", error);
      alert("Failed to reject applicant. Please try again.");
    }
  };
// ??Fix 
  const handleSelectApplicant = async () => {
    if (!applicant) return;
    if (!window.confirm(`Are you sure you want to Select ${applicant.firstName} ${applicant.lastName}?`)) return;
    try {
      await updateApplication(applicant.applicationId);
      alert(`${applicant.firstName} ${applicant.lastName} has been Selected.`);
      setApplicantStatus('Selected');
    } catch (error) {
      console.error("Failed to select applicant", error);
      alert("Failed to select applicant. Please try again.");
    }
  };


  
  const getStatusBadge = (status?: string | number) => {
    const finalStatus = statusMap[Number(status)] || status || 'UnderReview';
    switch (finalStatus) {
      case 'InterviewScheduled':
        return <span className="badge bg-success">Interview Scheduled</span>;
      case 'InProgress':
        return <span className="badge bg-warning text-dark">In Progress</span>;
      case 'Applied':
        return <span className="badge bg-primary">Applied</span>;
      case 'Rejected':
        return <span className="badge bg-danger">Rejected</span>;
      case 'Selected':
        return <span className="badge bg-success">Selected</span>;
      default:
        return <span className="badge bg-secondary">{String(status ?? '')}</span>;
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!applicant) return <p>Applicant not found</p>;
console.log("Applicant:", applicant);
console.log("Jobs:", jobs);
const application = applications.find(app => app.applicationId === applicant?.applicationId);
const jobDetails = jobs.find(job => job.jobId === application?.jobId);
console.log("Application Deatils", application);
// const jobDetails = jobs.find(job => job.jobId === applicant?.job?.jobId);
console.log("Job Details:", jobDetails);

console.log("Hii printing Applicant", applicant);
  const job = applicant?.job;



  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <Link to={`/hr/dashboard`} className="btn btn-link text-decoration-none p-0 mb-3">
          <button className="btn btn-primary ">Back to Applicants</button>
        </Link>
      </div>

      <div className="row">
        {/* Main Content (left side) */}
        <div className="col-lg-8">
          {/* Applicant Header */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col">
                  <div className="d-flex align-items-center mb-3">
                    <h2 className="mb-0 me-3">{applicant.firstName} {applicant.lastName}</h2>
                    {getStatusBadge(applicantStatus)}
                  </div>
                  <div className="text-muted">
                    <div className="mb-1">{applicant.email}</div>
                    <div>{applicant.phone}</div>
                  </div>
                </div>
                <div className="col-auto text-end">
                  <small className="text-muted">ID: {applicant.applicationId}</small>
                </div>
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="row mb-4">
            <div className="col-md-12">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-3">Application Details</h5>
                  <div className="row mb-2">
                    <div className="col-sm-5 text-muted">Applied:</div>
                    <div className="col-sm-7">{new Date(applicant.createdAt).toLocaleDateString()}</div>
                  </div>
                  {/* <div className="row mb-2">
                    <div className="col-sm-5 text-muted">Last Updated:</div>
                    <div className="col-sm-7">{new Date(applicant.updatedAt).toLocaleDateString()}</div>
                  </div> */}
                  <div className="row mb-2">
                    <div className="col-sm-5 text-muted">Current Round:</div>
                    <div className="col-sm-7">{applicant.currentRound}</div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-sm-5 text-muted">Keyword Score:</div>
                    <div className="col-sm-7">
                      <span className={`fw-bold ${applicant.keywordScore >= 8 ? 'text-success' : applicant.keywordScore >= 6 ? 'text-warning' : 'text-danger'}`}>
                        {applicant.keywordScore}/100
                      </span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-5 text-muted">Resume :</div>
                      {applicant.resumePath ? (
                        <div className="col-sm-7">
                          <a href={applicant.resumePath} target="_blank" rel="noopener noreferrer" className="btn btn-link text-decoration-none p-0">
                            {applicant.firstName}'s Resume
                          </a>
                        </div>
                      ) : (
                        <p className="text-muted">No resume uploaded.</p>
                      )}
                  </div>
                </div>
              </div>
            </div>

          </div>

          

          {/* Interview History */}
          <div className="card border-0 shadow-sm">
  <div className="card-body">
    <h5 className="card-title fw-bold mb-3">Interview History</h5>
    {interviewList.length > 0 ? (
      interviewList.map((interview, index) => (
        <div key={index} className="card mb-3 p-3 border">
          <div><strong>Round:</strong> {interview.roundNumber}</div>
          <div><strong>Time:</strong> {new Date(interview.scheduledTime).toLocaleString()}</div>
          <div><strong>Interviewer:</strong> {interview.interviewerName}</div>
        </div>
      ))
    ) : (
      <p className="text-muted">No interviews scheduled yet.</p>
    )}
  </div>
</div>
        </div>

        {/* Actions Sidebar (right side) */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0">
              <h5 className="card-title fw-bold mb-0">Actions</h5>
            </div>
            <div className="card-body">
              <button
                className="btn btn-outline-primary btn-lg w-100 mb-3"
                onClick={handleOpenScheduleModal}
                disabled={applicantStatus === 'Rejected'}
              >
                Schedule Interview
              </button>
              <button
                className="btn btn-outline-success btn-lg w-100 mb-3"
                onClick={handleSelectApplicant}
                
                disabled={applicantStatus === 'Selected'}
              >
                Select Candidate
              </button>
              <button 
                className="btn btn-outline-danger btn-lg w-100"
                onClick={handleRejectApplicant}
                
                disabled={applicantStatus === 'Rejected'}
              >
                Reject Applicant
              </button>
            </div>
          </div>
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="card-title fw-bold mb-0">Interview Feedback</h5>
            </div>
            <div className="card-body">
              {feedbackList.length > 0 ? (
                feedbackList.map((fb, index) => (
                  <div key={index} className="card mb-3 p-3 border">
                    <div><strong>Comments:</strong> {fb.comments}</div>
                    <div><strong>Score:</strong> {fb.score}</div>
                    <div><strong>Result:</strong> {serverResultToUi(fb.result)}</div>
                  </div>
                ))
              ) : (
                <p className="text-muted">No feedback submitted yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showScheduleModal && (
        <InterviewScheduleModal
            show={showScheduleModal}
            onClose={() => setShowScheduleModal(false)}
            onSchedule={handleScheduleInterview}
            applicantName={`${applicant.firstName} ${applicant.lastName}`}
            interviewers={users.filter(user => user.role === 2)}
            applicationId={applicant.applicationId}
          />
      )}
    </div>
  );
};

export default Applicant;