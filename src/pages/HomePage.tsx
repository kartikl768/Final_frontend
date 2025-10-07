import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, LogIn, Users, Briefcase, Target, Award, Phone } from 'lucide-react';

const HomePage: React.FC = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignUp) {
        const success = await signup(formData);
        if (success) navigate('/dashboard');
        else setError('Failed to create account.');
      } else {
        const success = await login(formData.email, formData.password);
        if (success) navigate('/dashboard');
        else setError('Invalid credentials.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Hero Section */}
      <div className="hero-section text-white py-5" style={{ backgroundColor: '#1e3a8a', background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }}>
        <div className="container">
          <div className="row align-items-center">
            {/* Left Hero Text */}
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-4">Welcome to Fidelity National Financial</h1>
              <p className="lead mb-4">Your trusted partner in comprehensive HR management solutions. Streamline your hiring process with our advanced recruitment platform.</p>
              <div className="d-flex gap-3 mb-4 flex-wrap">
                <div className="d-flex align-items-center">
                  <Users className="me-2" size={24} />
                  <span>Multi-Role Access</span>
                </div>
                <div className="d-flex align-items-center">
                  <Briefcase className="me-2" size={24} />
                  <span>Job Management</span>
                </div>
                <div className="d-flex align-items-center">
                  <Target className="me-2" size={24} />
                  <span>Interview Tracking</span>
                </div>
              </div>
            </div>

            {/* Right Sign In / Sign Up Card */}
            <div className="col-lg-6">
              <div className="card shadow-lg">
                <div className="card-body">
                  <h2 className="text-center fw-bold mb-4">
                    {isSignUp ? 'Create Your Account' : 'Sign In'}
                  </h2>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <form onSubmit={handleSubmit}>
                    {isSignUp && (
                      <>
                        <div className="mb-3">
                          <label className="form-label">First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            className="form-control"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            className="form-control"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Phone</label>
                          <div className="input-group">
                            <span className="input-group-text"><Phone size={16} /></span>
                            <input
                              type="tel"
                              name="phone"
                              className="form-control"
                              value={formData.phone}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <div className="input-group">
                        <span className="input-group-text"><Mail size={16} /></span>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <div className="input-group">
                        <span className="input-group-text"><Lock size={16} /></span>
                        <input
                          type="password"
                          name="password"
                          className="form-control"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 mb-2">
                      {isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>
                  </form>

                  <p className="text-center mt-2 small">
                    {isSignUp ? 'Already have an account? ' : 'New user? '}
                    <span
                      className="text-primary"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setIsSignUp(!isSignUp)}
                    >
                      {isSignUp ? 'Sign In' : 'Sign Up'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-5">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-lg-8 mx-auto">
              <h2 className="display-5 fw-bold mb-3" style={{ color: '#1e3a8a' }}>Comprehensive HR Solutions</h2>
              <p className="lead text-muted">Empower your organization with tools designed for modern workforce management</p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <Briefcase size={32} className="text-white" />
                  </div>
                  <h4 className="card-title">Job Management</h4>
                  <p className="card-text text-muted">Create, manage, and track job postings with our intuitive manager dashboard. Streamline your recruitment process from start to finish.</p>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <Users size={32} className="text-white" />
                  </div>
                  <h4 className="card-title">Interview Coordination</h4>
                  <p className="card-text text-muted">Schedule interviews, provide feedback, and coordinate with HR seamlessly. Make informed hiring decisions with comprehensive candidate evaluations.</p>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                    <Award size={32} className="text-white" />
                  </div>
                  <h4 className="card-title">Performance Analytics</h4>
                  <p className="card-text text-muted">Track recruitment metrics, candidate scores, and hiring success rates. Make data-driven decisions to optimize your talent acquisition strategy.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-primary text-white mt-5">
        <div className="container py-4">
          <div className="row">
            <div className="col-md-6 mb-3">
              <h5 className="fw-bold">Fidelity National Financial</h5>
              <p className="mb-0 small">Delivering comprehensive HR management solutions to streamline hiring, empower teams, and optimize workforce performance.</p>
            </div>
            <div className="col-md-3 mb-3">
              <h6 className="fw-semibold">Solutions</h6>
              <ul className="list-unstyled small">
                <li>Job Management</li>
                <li>Interview Coordination</li>
                <li>Performance Analytics</li>
              </ul>
            </div>
            <div className="col-md-3 mb-3">
              <h6 className="fw-semibold">Contact</h6>
              <ul className="list-unstyled small">
                <li>Email: hr-support@fidelity.com</li>
                <li>Phone: +1 (800) 555-1234</li>
              </ul>
            </div>
          </div>
          <hr className="border-light opacity-25" />
          <div className="text-center">
            <small>© 2025 Fidelity National Financial. All Rights Reserved.</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
