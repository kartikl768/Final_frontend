import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import Navbar from '../components/Navbar';

// Lazy-loading the pages for better performance
const HomePage = lazy(() => import('../pages/HomePage'));
const ManagerDashboard = lazy(() => import('../pages/ManagerPages/ManagerDashboard'));
const CreateJob = lazy(() => import('../pages/ManagerPages/CreateJob'));
const EditJob = lazy(() => import('../pages/ManagerPages/EditJob'));
const InterviewerDashboard = lazy(() => import('../pages/InterviewerPages/InterviewerDashboard'));
const InterviewManagement = lazy(() => import('../pages/InterviewerPages/InterviewManagement'));
const Dashboard = lazy(() => import('../pages/HRPages/Dashboard'));
const Approvals = lazy(() => import('../pages/HRPages/Approvals'));
const UserManagement = lazy(() => import('../pages/HRPages/UserManagement'));
const InterviewScheduling = lazy(() => import('../pages/HRPages/Interview'));
const Applicants = lazy(() => import('../pages/HRPages/Applicants'));
const Applicant = lazy(() => import('../pages/HRPages/Applicant'));
const AddEmployee = lazy(() => import('../pages/HRPages/AddEmployee'));
const CandidateDashboard = lazy(() => import('../pages/CandidatePages/CandidateDashboard'));
const JobBrowser = lazy(() => import('../pages/CandidatePages/JobBrowser'));
const ApplicationManagement = lazy(() => import('../pages/CandidatePages/ApplicationManagement'));
const InterviewFeedback = lazy(() => import('../pages/InterviewerPages/InterviewFeedback'));

const AppRouter: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  const getDashboardRoute = () => {
    if (!user) return '/';
    const role = user.Role;
    if (role === 0 || role === 'Manager') return '/manager';
    if (role === 1 || role === 'HR') return '/hr/dashboard';
    if (role === 2 || role === 'Interviewer') return '/interviewer';
    if (role === 3 || role === 'Candidate') return '/candidate';
    return '/';
  };

  const HRLayout: React.FC = () => (
    <ProtectedRoute allowedRoles={['HR']}>
      <>
        <Navbar />
        <Outlet />
      </>
    </ProtectedRoute>
  );

  const ManagerLayout: React.FC = () => (
    <ProtectedRoute allowedRoles={['Manager']}>
      <>
        <Navbar />
        <Outlet />
      </>
    </ProtectedRoute>
  );

  const InterviewerLayout: React.FC = () => (
    <ProtectedRoute allowedRoles={['Interviewer']}>
      <>
        <Navbar />
        <Outlet />
      </>
    </ProtectedRoute>
  );

  const CandidateLayout: React.FC = () => (
    <ProtectedRoute allowedRoles={['Candidate']}>
      <>
        <Navbar />
        <Outlet />
      </>
    </ProtectedRoute>
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to={getDashboardRoute()} replace /> : <HomePage />
          }
        />

        {/* Manager Routes */}
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<ManagerDashboard />} />
          <Route path="create-job" element={<CreateJob />} />
          <Route path="edit-job/:id" element={<EditJob />} />
        </Route>

        {/* HR Routes */}
        <Route path="/hr/*" element={<HRLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="interviews" element={<InterviewScheduling />} />
          <Route path="createjob" element={<CreateJob />} />
          <Route path="addemployee" element={
            <AddEmployee
              formData={{
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                phone: '',
                role: ''
              }}
              handleInputChange={() => {}}
              handleSubmit={() => {}}
            />
          } />
          <Route path="applicants/:jobId" element={<Applicants />} />
          <Route path="applicant/:applicantId" element={<Applicant />} />
        </Route>

        {/* Interviewer Routes */}
        <Route path="/interviewer/*" element={<InterviewerLayout />}>
          <Route index element={<InterviewerDashboard />} />
          <Route path="interviews" element={<InterviewManagement />} />
        </Route>
        {/* <Route path="/interviews/feedback/:id" element={<InterviewFeedback />} />
        <Route path="/interviews/feedback" element={<InterviewFeedback />} /> */}

        {/* Candidate Routes */}
        <Route path="/candidate/*" element={<CandidateLayout />}>
          <Route index element={<CandidateDashboard />} />
          <Route path="jobs" element={<JobBrowser />} />
          <Route path="applications" element={<ApplicationManagement />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;