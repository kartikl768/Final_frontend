
import React, { useState } from 'react';
import { User } from '../../data/index';

export interface InterviewData {
  applicationId: number;
  interviewerId: number;
  scheduledTime: string;
  teamsLink: string;
  meetingDetails: string;
}

interface InterviewScheduleModalProps {
  show: boolean;
  onClose: () => void;
  onSchedule: (interviewData: InterviewData) => void;
  applicantName: string;
  interviewers: User[];
  applicationId: number;
}

const InterviewScheduleModal: React.FC<InterviewScheduleModalProps> = ({
  show,
  onClose,
  onSchedule,
  applicantName,
  interviewers,
  applicationId,
}) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: 60,
    interviewer: '',
    teamsLink: '',
    meetingDetails: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.date && formData.time && formData.interviewer) {
      const scheduledTime = `${formData.date}T${formData.time}`;
      const selectedInterviewer = interviewers.find(
        (u) => u.userId === Number(formData.interviewer)
      );
      // const scheduledTime = new Date(`${formData.date}T${formData.time}`).toISOString();

      const interviewPayload: InterviewData = {
        applicationId,
        interviewerId: Number(formData.interviewer),
        scheduledTime,
        teamsLink: formData.teamsLink,
        meetingDetails: formData.meetingDetails,
      };
console.log("Scheduling interview for applicationId:", applicationId);

      onSchedule(interviewPayload);
      setFormData({
        date: '',
        time: '',
        duration: 60,
        interviewer: '',
        teamsLink: '',
        meetingDetails: '',
      });
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Schedule Interview</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-bold">Applicant</label>
                <input type="text" className="form-control" value={applicantName} readOnly />
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Interview Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Interview Time</label>
                  <input
                    type="time"
                    className="form-control"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Duration (minutes)</label>
                  <select
                    className="form-select"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                  >
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Select Interviewer</label>
                  <select
                    className="form-select"
                    name="interviewer"
                    value={formData.interviewer}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose interviewer...</option>
                    {interviewers.map((user) => (
                      <option key={user.userId} value={user.userId}>
                        {user.firstName} {user.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  {/* Complete this code */}
                  <label className="form-label">Teams Link</label>
                  <input
                    type="url"
                    className="form-control"
                    name="teamsLink"
                    value={formData.teamsLink}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Meeting Details</label>
                  <textarea
                    className="form-control"
                    name="meetingDetails"
                    value={formData.meetingDetails}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Schedule Interview
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InterviewScheduleModal;