import React, { useState } from 'react';
import { useHR } from '../../contexts/HRContext';
import { Link, useNavigate } from "react-router-dom"; // Import Link from react-router-dom
import { Users, Clock, Briefcase, Calendar, Search, Filter } from "lucide-react";
import { Bar, Pie, PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  ChartOptions,
  RadialLinearScale
} from "chart.js";
import { useEffect } from "react";
import { getWeeklyApplications } from "../../services/api/analytics";
import { getApplicationsByJobAnalytics } from '../../services/api/applications';
import { getInterviewAnalyticsByJobAndRound } from "../../services/api/interviews";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Tooltip,
  Legend
);

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// register core pieces for the pie/doughnut
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const { jobs, allJobRequirements, applications, interviews, loading } = useHR();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date");

    const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

  const [pieData, setPieData] = useState<any>(null);
  const [pieOptions, setPieOptions] = useState<any>(null);
  
  const [interviewChartData, setInterviewChartData] = useState<any>(null);
  const [interviewChartOptions, setInterviewChartOptions] = useState<any>(null);

  //Bar chart
  useEffect(() => {
    const fetchWeeklyData = async () => {
      const data = await getWeeklyApplications();
      setChartData({
        labels: data.map((d) => d.date),
        datasets: [
          {
            label: "Applications Received (Last 7 Days)",
            data: data.map((d) => d.count),
            backgroundColor: "rgba(255,255,255,0.85)",
            shadowColor: "rgba(0,0,0,0.3)",
            hoverBackgroundColor: "rgba(255,255,255,1)",
            borderRadius: 6,
            barThickness: 45,
          },
        ],
      });
    };

    fetchWeeklyData();
  }, [applications]);

  console.log("Dashboard rendered", { jobs, applications });

  //Pie Chart
  useEffect(() => {
    const fetchPieChartData = async () => {
      try {
        const data = await getApplicationsByJobAnalytics();
        if (!data || data.length === 0) {
          setPieData(null);
          return;
        }

        const labels = data.map(d => d.jobTitle);
        const values = data.map(d => d.applicantCount);

        const baseGreens = [
          "rgba(34,197,94,0.95)",
          "rgba(16,185,129,0.92)",
          "rgba(5,150,105,0.90)",
          "rgba(34,197,94,0.8)",
          "rgba(16,185,129,0.75)",
          "rgba(5,150,105,0.7)",
        ];

        setPieData({
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: labels.map((_, i) => baseGreens[i % baseGreens.length]),
              borderColor: "#052e16",
              borderWidth: 2,
              hoverOffset: 14,
            },
          ],
        });

        setPieOptions({
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: { color: "#d1fae5", font: { size: 14 } },
            },
            tooltip: {
              backgroundColor: "rgba(0,0,0,0.7)",
              bodyFont: { size: 14 },
              padding: 12,
            },
          },
        });
      } catch (err) {
        console.error("Error loading pie chart data", err);
        setPieData(null);
      }
    };

    fetchPieChartData();
  }, [applications]);

  //Polar Area chart
  useEffect(() => {
    const fetchInterviewAnalytics = async () => {
      try {
        const data = await getInterviewAnalyticsByJobAndRound();
        if (!data || data.length === 0) {
          setInterviewChartData(null);
          return;
        }

        // Labels and grouping
        const labels = data.map(
          d => `${d.jobTitle} (Round ${d.roundNumber})`
        );
        const values = data.map(d => d.interviewCount);

        // Futuristic yellow gradient shades
        const baseYellows = [
          "rgba(234,179,8,0.95)", // amber-500
          "rgba(250,204,21,0.9)", // yellow-400
          "rgba(253,224,71,0.85)", // yellow-300
          "rgba(202,138,4,0.8)", // amber-600
          "rgba(161,98,7,0.75)", // amber-700
        ];

        setInterviewChartData({
          labels,
          datasets: [
            {
              label: "Interviews Scheduled",
              data: values,
              backgroundColor: labels.map(
                (_, i) => baseYellows[i % baseYellows.length]
              ),
              borderColor: "#fef9c3", // pale yellow border
              borderWidth: 2,
              hoverOffset: 10,
            },
          ],
        });

        setInterviewChartOptions({
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: { color: "#fff", font: { size: 14 } },
            },
            tooltip: {
              backgroundColor: "rgba(0,0,0,0.8)",
              bodyFont: { size: 14 },
              padding: 10,
            },
          },
          scales: {
            r: {
              grid: { color: "rgba(255,255,255,0.2)" },
              ticks: { color: "#fff" },
            },
          },
        });
      } catch (err) {
        console.error("Error loading interview analytics:", err);
      }
    };

    fetchInterviewAnalytics();
  }, [applications, interviews]);



  const navigate = useNavigate();
  // Calculate active jobs from all job requirements (approved and pending)
  let filteredJobs = (jobs || []).filter((job) => {
    // Add null/undefined checks
    if (!job || !job.jobTitle) {
      console.warn("Jobs.tsx: Job object is invalid:", job);
      return false;
    }

    const matchesSearch = job.jobTitle
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  filteredJobs = filteredJobs.sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.jobTitle.localeCompare(b.jobTitle);
      case "status":
        return a.status.localeCompare(b.status);
      case "date":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newest first
    }
  });

  // Calculate metrics based on filtered and available data
  const activeJobsCount = filteredJobs.filter((job) => job.status === "Active").length;
  const totalApplications = applications.length;
  const pendingReviewCount = (applications || []).filter(a => a.status === "Applied" || a.status === "In Progress").length;
  const scheduledInterviewsCount = (interviews || []).filter(i => i.status === "Scheduled").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Applied':
        return <span className="badge bg-primary">Applied</span>;
      case 'Interview Scheduled':
        return <span className="badge bg-success">Interview Scheduled</span>;
      case 'In Progress':
        return <span className="badge bg-warning text-dark">In Progress</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };
  const getStatusBadge1 = (status: string) => {
                switch (status) {
                  case 'Active':
                    return <span className="badge bg-success fs-6">Active</span>;
                  case 'Inactive':
                    return <span className="badge bg-secondary fs-6">Inactive</span>;
                  case 'Closed':
                    return <span className="badge bg-danger fs-6">Closed</span>;
                  default:
                    return <span className="badge bg-secondary fs-6">{status}</span>;
                }
              };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        {/* <h1 className="h2 fw-bold">Welcome : {user.Email && user.Email.split('@')[0].charAt(0).toUpperCase()+user.Email.split('@')[0].slice(1)}</h1> */}
        <h1 className="h2 fw-bold">Welcome HR</h1>
        <p className="text-muted">Overview of recruitment activities and metrics</p>
      </div>

      {/* Analytics Section */}
      <div className="container-fluid mb-5">
        <div className="row g-3">
          
          {/* Bar Chart (Applications - Last 7 Days) */}
          <div className="col-md-4">
            <div
              className="card shadow-lg border-0 p-4 h-100"
              style={{
                background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                color: "white",
                borderRadius: "16px",
              }}
            >
              <h5 className="fw-bold mb-3 text-center">📊 Applications (Last 7 Days)</h5>
              {chartData ? (
                <div style={{ height: "300px", paddingTop: "30px" }}>
                  <Bar
                    data={chartData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: "rgba(0,0,0,0.7)",
                          titleFont: { size: 16 },
                          bodyFont: { size: 14 },
                          padding: 12,
                          borderWidth: 1,
                          borderColor: "#fff",
                        },
                      },
                      scales: {
                        x: {
                          grid: { color: "rgba(255,255,255,0.1)" },
                          ticks: { color: "#fff", font: { weight: 500 } },
                        },
                        y: {
                          grid: { color: "rgba(255,255,255,0.1)" },
                          ticks: { color: "#fff" },
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <p className="text-center text-light">Loading chart...</p>
              )}
            </div>
          </div>

          {/* Pie Chart (Applicants by Job) */}
          <div className="col-md-4">
            <div
              className="card shadow-lg border-0 p-4 h-100"
              style={{
                background: "linear-gradient(135deg, #064e3b 0%, #10b981 100%)",
                color: "white",
                borderRadius: "16px",
              }}
            >
              <h5 className="fw-bold mb-3 text-center">🧩 Applicants by Job Role</h5>
              {pieData ? (
                <div style={{ height: "300px", paddingTop: "30px" }}>
                  <Pie data={pieData} options={pieOptions} />
                </div>
              ) : (
                <p className="text-center text-light">No applicant data available</p>
              )}
            </div>
          </div>

          {/* Interview Analytics */}
          <div className="col-md-4">
            <div
              className="card shadow-lg border-0 p-4 h-100"
              style={{
                background: "linear-gradient(135deg, #facc15 0%, #fde68a 100%)",
                color: "#3b3b3b",
                borderRadius: "16px",
              }}
            >
              <h5 className="fw-bold mb-3 text-center">🧠 Interview Progress by Job</h5>
              {interviewChartData ? (
                <div style={{ height: "300px", paddingTop: "20px" }}>
                  <PolarArea data={interviewChartData} options={interviewChartOptions} />
                </div>
              ) : (
                <p className="text-center text-dark">No interview analytics available</p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Metrics Cards */}
      <div className="row mb-5">
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="card-title text-muted mb-0">Active Jobs</h6>
                <Briefcase className="text-primary" size={24} />
              </div>
              <h2 className="display-4 fw-bold text-primary mb-0">
                {activeJobsCount}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="card-title text-muted mb-0">Total Applications</h6>
                <Users className="text-success" size={24} />
              </div>
              <h2 className="display-4 fw-bold text-success mb-0">
                {totalApplications}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="card-title text-muted mb-0">Pending Review</h6>
                <Clock className="text-warning" size={24} />
              </div>
              <h2 className="display-4 fw-bold text-warning mb-0">
                {pendingReviewCount}
              </h2>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="card-title text-muted mb-0">Scheduled Interviews</h6>
                <Calendar className="text-info" size={24} />
              </div>
              <h2 className="display-4 fw-bold text-info mb-0">
                {scheduledInterviewsCount}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="row mb-4">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by job title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Sort by Date</option>
                  <option value="title">Sort by Title</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>
              
            </div>

      {/* Job Listings Section */}
      <div className="mb-4">
        <h2 className="h3 fw-bold">Active Job Listings</h2>
      </div>
      <div className="row">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div key={job.jobId} className="col-md-6 col-lg-4 mb-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h3 className="card-title h4 mb-0">{job.jobTitle}</h3>
                    {getStatusBadge1(job.status)}
                  </div>

                  <div className="row text-muted mb-3">
                    <div className="col-auto">
                      <Clock size={16} className="me-1" />
                      {job.yearsExperience} years
                    </div>
                    <div className="col-auto">
                      <Users size={16} className="me-1" />
                      {job.numberOfOpenings} openings
                    </div>
                  </div>

                  <p className="card-text text-muted mb-4">{job.jobDescription}</p>

                  <div className="mb-4">
                    <h6 className="text-muted mb-2">
                      <span className="text-warning">🔧</span> Required Skills
                    </h6>
                    <div className="d-flex flex-wrap gap-2">
                      {Array.isArray(job.requiredSkills)
                        ? job.requiredSkills.map((skill, index) => (
                          <span key={index} className="badge bg-light text-dark border">
                            {skill.trim()}
                          </span>
                        ))
                        : (job.requiredSkills || "").split(",").map((skill, index) => (
                          <span key={index} className="badge bg-light text-dark border">
                            {skill.trim()}
                          </span>
                        ))
                      }
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-muted">
                      <span className="text-danger">🎯</span> {job.numberOfRounds} interview rounds
                    </div>
                    
                    {job.status === "Active" ? (
                      <button
                        onClick={() => {
                          console.log("Navigating to jobId:", job.jobId); 
                          navigate(`/hr/applicants/${job.jobId }`);
                        }}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#007bff',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        View Applicants →
                      </button>
                    ) : (
                      job.status === "Inactive" ? "Job Inactive" : "Not available"
                    )}


                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center text-muted py-5">
            <p>No jobs found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
