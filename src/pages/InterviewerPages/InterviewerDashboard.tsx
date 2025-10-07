import React, { useState, useEffect } from "react";

import { useAuth } from "../../contexts/AuthContext";

import { Calendar, Clock, CheckCircle, MessageSquare, Video } from "lucide-react";

import { getInterviewerInterviewById } from "../../services/api/interviews";

import FeedbackModal from "../../components/FeedbackComponent/FeedbackModal"; 

import { toast } from "react-toastify";

export default function InterviewerDashboard() {

  const { user } = useAuth();

  const [interviews, setInterviews] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [selectedInterview, setSelectedInterview] = useState<any | null>(null);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {

    fetchInterviewerData();

  }, []);

  // Fetch data

  const fetchInterviewerData = async () => {

    setLoading(true);

    try {

      const interviewsData = await getInterviewerInterviewById();

      const now = new Date();

      const interviewsWithStatus = (interviewsData || []).map((i: any) => {

        const scheduled = i?.scheduledTime ? new Date(i.scheduledTime) : null;

        let status = "Scheduled";

        if (scheduled && scheduled < now) status = "Completed";

        return { ...i, status };

      });

      setInterviews(interviewsWithStatus);

    } catch (error) {

      console.error("Failed to fetch interviewer data:", error);

      toast.error("Failed to load interviews. Please try again.");

    } finally {

      setLoading(false);

    }

  };

  // Utility: status badge colors

  const getStatusBadgeColor = (status: string) => {

    switch (status) {

      case "Scheduled":

        return "bg-primary";

      case "Completed":

        return "bg-success";

      case "Cancelled":

        return "bg-danger";

      case "In Progress":

        return "bg-warning text-dark";

      default:

        return "bg-secondary";

    }

  };

  // Filter upcoming interviews

  const getUpcomingInterviews = () => {

    const now = new Date();

    return (interviews || [])

      .filter((interview) => {

        const scheduled = new Date(interview.scheduledTime);

        return interview.status === "Scheduled" && scheduled > now;

      })

      .sort(

        (a, b) =>

          new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()

      )

      .slice(0, 5);

  };

  // Filter completed interviews

  const getCompletedInterviews = () => {

    return (interviews || [])

      .filter((i) => i.status === "Completed")

      .sort(

        (a, b) =>

          new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime()

      )

      .slice(0, 5);

  };

  // Open feedback modal

  const handleOpenFeedback = (item: any) => {

    const mapped = {

      interviewId: item.interviewId,

      applicationId: item.applicationId ?? item.ApplicationId,

      candidateName:

        item.ApplicantName ??

        item.applicantName ??

        item.candidateName ??

        `${item.firstName ?? ""} ${item.lastName ?? ""}`.trim(),

      candidateEmail: item.candidateEmail ?? item.ApplicantEmail ?? null,

      jobTitle: item.jobTitle ?? "Interview",

      scheduledTime: item.scheduledTime,

      roundNumber: item.roundNumber ?? 1,

      status: item.status ?? "Completed",

      teamsLink: item.teamsLink ?? "",

    };

    setSelectedInterview(mapped);

    setShowModal(true);

  };

  // Close modal

  const handleCloseFeedback = () => {

    setSelectedInterview(null);

    setShowModal(false);

  };

  // ✅ Remove candidate + show toast on success

  const handleFeedbackSuccess = () => {

    if (selectedInterview) {

      setInterviews((prev) =>

        prev.filter((i) => i.interviewId !== selectedInterview.interviewId)

      );

      toast.success(`Feedback submitted for ${selectedInterview.candidateName}! 🎉`);

    }

    setShowModal(false);

    setSelectedInterview(null);

  };

  // Loading view

  if (loading) {

    return (

      <div className="container-fluid py-4 text-center">

        <div className="spinner-border text-primary" role="status"></div>

        <p className="mt-3 text-muted">Loading your dashboard...</p>

      </div>

    );

  }

  // Stats computation

  const totalInterviews = interviews.length;

  const completed = interviews.filter((i) => i.status === "Completed").length;

  const pending = interviews.filter((i) => i.status === "Scheduled").length;

  return (

    <div className="container-fluid py-4">

      {/* Header */}

      <div className="mb-4">

        <h1 className="h2 fw-bold">Interviewer Dashboard</h1>

        <p className="text-muted">

          Welcome back, {user?.FirstName}! Manage your interviews and provide feedback.

        </p>

      </div>

      {/* Stats */}

      <div className="row mb-4">

        <div className="col-md-4">

          <div className="card border-0 shadow-sm">

            <div className="card-body d-flex align-items-center">

              <div className="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3">

                <Calendar size={20} />

              </div>

              <div>

                <h6>Total Interviews</h6>

                <h4>{totalInterviews}</h4>

              </div>

            </div>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card border-0 shadow-sm">

            <div className="card-body d-flex align-items-center">

              <div className="avatar-sm bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3">

                <CheckCircle size={20} />

              </div>

              <div>

                <h6>Completed</h6>

                <h4>{completed}</h4>

              </div>

            </div>

          </div>

        </div>

        <div className="col-md-4">

          <div className="card border-0 shadow-sm">

            <div className="card-body d-flex align-items-center">

              <div className="avatar-sm bg-warning text-white rounded-circle d-flex align-items-center justify-content-center me-3">

                <Clock size={20} />

              </div>

              <div>

                <h6>Pending</h6>

                <h4>{pending}</h4>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Upcoming & Completed */}

      <div className="row">

        {/* Upcoming Interviews */}

        <div className="col-lg-6 mb-4">

          <div className="card border-0 shadow-sm">

            <div className="card-header bg-white border-0">

              <h5 className="card-title mb-0">Upcoming Interviews</h5>

            </div>

            <hr />

            <div className="card-body">

              {getUpcomingInterviews().length === 0 ? (

                <div className="text-center py-4">

                  <Calendar size={48} className="text-muted mb-3" />

                  <h6 className="text-muted">No upcoming interviews</h6>

                </div>

              ) : (

                getUpcomingInterviews().map((interview) => (

                  <div key={interview.interviewId} className="card shadow-sm mb-3">

                    <div className="card-body d-flex justify-content-between align-items-start">

                      <div>

                        <h5 className="card-title">{interview.jobTitle ?? "Interview"}</h5>

                        <p className="mb-1">

                          <strong>Candidate:</strong>{" "}

                          {interview.ApplicantName ??

                            interview.applicantName ??

                            interview.candidateName}

                        </p>

                        <p className="mb-1 text-muted">

                          <Clock size={14} className="me-1" />

                          {new Date(interview.scheduledTime).toLocaleDateString()} at{" "}

                          {new Date(interview.scheduledTime).toLocaleTimeString()}

                        </p>

                        <span

                          className={`badge ${getStatusBadgeColor(

                            interview.status ?? "Scheduled"

                          )}`}

                        >

                          {interview.status ?? "Scheduled"}

                        </span>

                      </div>

                      {!!interview.teamsLink && (

                        <a

                          href={interview.teamsLink}

                          target="_blank"

                          rel="noopener noreferrer"

                          className="btn btn-sm btn-outline-primary"

                          title="Join Meeting"

                        >

                          <Video size={16} className="me-1" />

                          Join

                        </a>

                      )}

                    </div>

                  </div>

                ))

              )}

            </div>

          </div>

        </div>

        {/* Completed Interviews */}

        <div className="col-lg-6 mb-4">

          <div className="card border-0 shadow-sm">

            <div className="card-header bg-white border-0">

              <h5 className="card-title mb-0">Completed Interviews</h5>

            </div>

            <hr />

            <div className="card-body">

              {getCompletedInterviews().length === 0 ? (

                <div className="text-center py-4">

                  <CheckCircle size={48} className="text-muted mb-3" />

                  <h6 className="text-muted">No completed interviews</h6>

                </div>

              ) : (

                getCompletedInterviews().map((item) => (

                  <div key={item.interviewId} className="card shadow-sm mb-3">

                    <div className="card-body d-flex justify-content-between align-items-start">

                      <div>

                        <h6 className="card-title mb-1">

                          {item.ApplicantName ??

                            item.applicantName ??

                            item.candidateName}

                        </h6>

                        <small className="text-muted d-block mb-2">

                          {item.jobTitle ?? "Interview"} •{" "}

                          {new Date(item.scheduledTime).toLocaleDateString()}{" "}

                          {new Date(item.scheduledTime).toLocaleTimeString()}

                        </small>

                        <span

                          className={`badge ${getStatusBadgeColor(

                            item.status ?? "Completed"

                          )}`}

                        >

                          Completed

                        </span>

                      </div>

                      <button

                        className="btn btn-sm btn-outline-success"

                        onClick={() => handleOpenFeedback(item)}

                      >

                        <MessageSquare size={14} className="me-1" />

                        Feedback

                      </button>

                    </div>

                  </div>

                ))

              )}

            </div>

          </div>

        </div>

      </div>

      {/* Feedback Modal */}

      {showModal && selectedInterview && (

        <FeedbackModal

          interview={selectedInterview}

          onClose={handleCloseFeedback}
          onSuccess={handleFeedbackSuccess}
        />
      )}
    </div>
  );
}