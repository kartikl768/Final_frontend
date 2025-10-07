import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Building2, LogOut, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavItems = () => {
    if (!user) return [];
    
    const role = user.Role;
    
    // Manager role (0 or 'Manager')
    if (role === 0 || role === 'Manager') {
      return [
        { name: 'Dashboard', path: '/manager', active: location.pathname === '/manager' },
        { name: 'Create Job', path: '/manager/create-job', active: location.pathname === '/manager/create-job' },
      ];
    }
    
    // HR role (1 or 'HR')
    if (role === 1 || role === 'HR') {
      return [
        { name: 'Dashboard', path: '/hr/dashboard', active: location.pathname === '/hr/dashboard' },
        { name: 'Approvals', path: '/hr/approvals', active: location.pathname === '/hr/approvals' },
        { name: 'Users', path: '/hr/users', active: location.pathname === '/hr/users' },
        { name: 'Interviews', path: '/hr/interviews', active: location.pathname === '/hr/interviews' },
        { name: 'Jobs', path: '/hr/jobs', active: location.pathname.startsWith('/hr/jobs') || location.pathname.includes('/applicants') },
      ];
    }
    
    // Interviewer role (2 or 'Interviewer')
    if (role === 2 || role === 'Interviewer') {
      return [
        { name: 'Dashboard', path: '/interviewer', active: location.pathname === '/interviewer' },
        { name: 'Interviews', path: '/interviewer/interviews', active: location.pathname === '/interviewer/interviews' }
      ];
    }
    
    // Candidate role (3 or 'Candidate')
    if (role === 3 || role === 'Candidate') {
      return [
        { name: 'Dashboard', path: '/candidate', active: location.pathname === '/candidate' },
        { name: 'Browse Jobs', path: '/candidate/jobs', active: location.pathname === '/candidate/jobs' },
        { name: 'My Applications', path: '/candidate/applications', active: location.pathname === '/candidate/applications' }
      ];
    }
    
    return [];
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#2c3e50' }}>
      <div className="container-fluid">
        <Link className="navbar-brand text-white d-flex align-items-center" to="/">
          <Building2 className="me-2" size={24} />
          Fidelity National Financial
        </Link>
        
        {user && (
          <>
            <div className="navbar-nav me-auto">
              {getNavItems().map((item) => (
                <Link
                  key={item.name}
                  className={`nav-link text-white ${item.active ? 'active fw-bold' : ''}`}
                  to={item.path}
                  style={{ 
                    borderBottom: item.active ? '2px solid #3498db' : 'none',
                    paddingBottom: '8px'
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            <div className="d-flex align-items-center">
              <div className="dropdown">
                <button 
                  className="btn btn-link text-white dropdown-toggle d-flex align-items-center text-decoration-none"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ border: 'none' }}
                >
                  <div 
                    className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-2 mb-3"
                    style={{ width: '32px', height: '32px' }}
                  >
                    <span className="text-white fw-bold">
                      {user.FirstName?.charAt(0)}{user.LastName?.charAt(0)}
                    </span>
                  </div>
                  <div className="text-start">
                    <div className="fw-bold">{user.FirstName} {user.LastName}</div>
                    <small className="text-white">
                      {user.Role === 0 ? 'Manager' : 
                       user.Role === 1 ? 'HR' : 
                       user.Role === 2 ? 'Interviewer' : 
                       user.Role === 3 ? 'Candidate' : user.Role}
                    </small>
                  </div>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/">
                      <User size={16} className="me-2" />
                      Home
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <LogOut size={16} className="me-2" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;