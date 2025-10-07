import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import HomePage from '../pages/HomePage';
import ManagerDashboard from '../pages/ManagerPages/ManagerDashboard';
import CreateJob from '../pages/ManagerPages/CreateJob';
import EditJob from '../pages/ManagerPages/EditJob';
import InterviewerDashboard from '../pages/InterviewerPages/InterviewerDashboard';
import InterviewManagement from '../pages/InterviewerPages/InterviewManagement';
import Jobs from '../pages/HRPages/Jobs';
import Dashboard from '../pages/HRPages/Dashboard';
import Approvals from '../pages/HRPages/Approvals';
import UserManagement from '../pages/HRPages/UserManagement';
import InterviewScheduling from '../pages/HRPages/InterviewScheduling';
import Applicants from '../pages/HRPages/Applicants';
import Applicant from '../pages/HRPages/Applicant';
import Navbar from '../components/Navbar';
import AddEmployee from '../pages/HRPages/AddEmployee';
import CandidateDashboard from '../pages/CandidatePages/CandidateDashboard';
import JobBrowser from '../pages/CandidatePages/JobBrowser';
import ApplicationManagement from '../pages/CandidatePages/ApplicationManagement';

const AppRouter: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const getDashboardRoute = () => {
    if (!user) return '/';
    // Handle both integer and string role values
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
        <Route path="jobs" element={<Jobs />} />
        <Route path="createjob" element={<CreateJob />} />
        <Route path="addemployee" element={<AddEmployee formData={{
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          phone: '',
          role: ''
        }} handleInputChange={function (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void {
          throw new Error('Function not implemented.');
        } } handleSubmit={function (e: React.FormEvent<HTMLFormElement>): void {
          throw new Error('Function not implemented.');
        } } />} />
        <Route path="applicants/:jobId" element={<Applicants />} />
        <Route path="applicant/:applicantId" element={<Applicant />} />
      </Route>

      {/* Interviewer Routes */}
      <Route path="/interviewer/*" element={<InterviewerLayout />}>
        <Route index element={<InterviewerDashboard />} />
        <Route path="interviews" element={<InterviewManagement />} />
      </Route>

      {/* Candidate Routes */}
      <Route path="/candidate/*" element={<CandidateLayout />}>
        <Route index element={<CandidateDashboard />} />
        <Route path="jobs" element={<JobBrowser />} />
        <Route path="applications" element={<ApplicationManagement />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;