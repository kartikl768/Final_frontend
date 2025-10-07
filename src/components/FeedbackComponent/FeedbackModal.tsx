import React from "react";
import { InterviewFeedbackRequest, updateFeedback } from "../../services/api/interviews";
import { toast } from "react-toastify";

function FeedbackModal({ interview, onClose, onSuccess }: any) {
  const [feedback, setFeedback] = React.useState({
    overallRating: 0,
    comments: "",
    recommendation: "" as "Accepted" | "Rejected",
  });
  const [loading, setLoading] = React.useState(false);

  const mapToServerPayload = (): InterviewFeedbackRequest => {
    const score = feedback.overallRating;
    const resultMap: Record<typeof feedback.recommendation, number> = {
      Accepted: 1,
      Rejected: -1,
    };
    return {
      comments: feedback.comments,
      score,
      result: resultMap[feedback.recommendation] ?? 0,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = mapToServerPayload();
      await updateFeedback(interview.interviewId, payload);
      onSuccess();
      toast.success("Feedback submitted successfully");
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      alert("Failed to submit feedback. Try again.");
      toast.error("Failed to submit feedback. Try again")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content border-0 rounded shadow-lg">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Interview Feedback</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-4">
                <h5 className="fw-bold">{interview.candidateName || "Candidate Name"}</h5>
                <p className="text-muted">
                  Round {interview.roundNumber} |{" "}
                  {new Date(interview.scheduledTime).toLocaleDateString()}
                </p>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Score: {feedback.overallRating}</label>
                <input
                  type="range"
                  className="form-range"
                  min="1"
                  max="10"
                  value={feedback.overallRating}
                  onChange={(e) =>
                    setFeedback({ ...feedback, overallRating: Number(e.target.value) })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Recommendation</label>
                <select
                  className="form-select"
                  value={feedback.recommendation}
                  onChange={(e) =>
                    setFeedback({ ...feedback, recommendation: e.target.value as "Accepted" | "Rejected" })
                  }
                  required
                >
                  <option value="">Select recommendation</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Comments</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={feedback.comments}
                  onChange={(e) =>
                    setFeedback({ ...feedback, comments: e.target.value })
                  }
                  placeholder="Provide detailed feedback about the candidate..."
                  required
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className={`btn btn-primary ${loading ? "disabled" : ""}`}>
                {loading ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FeedbackModal;