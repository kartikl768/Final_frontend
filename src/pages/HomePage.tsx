import React, { useState } from 'react';

import { useAuth } from '../contexts/AuthContext';

import { useNavigate } from 'react-router-dom';

import { Lock, Mail, LogIn, Users, Briefcase, Target, Award } from 'lucide-react';

const HomePage: React.FC = () => {

  const [formData, setFormData] = useState({

    email: '',

    password: '',

  });

  const [error, setError] = useState('');

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setError('');

    const success = await login(formData.email, formData.password);

    if (success) {

      navigate("/dashboard");

    } else {

      setError('Invalid credentials');

    }

  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value

    });

  };

  return (

    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>

      {/* Hero Section */}

      <div className="hero-section text-white py-5" style={{ backgroundColor: '#1e3a8a', background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }}>

        <div className="container">

          <div className="row align-items-center">

            <div className="col-lg-6">

              <h1 className="display-4 fw-bold mb-4">Welcome to Fidelity National Financial</h1>

              <p className="lead mb-4">Your trusted partner in comprehensive HR management solutions. Streamline your hiring process with our advanced recruitment platform.</p>

              <div className="d-flex gap-3 mb-4">

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

            <div className="col-lg-6">

              <div className="card shadow-lg">

                <div className="card-header bg-white text-center">

                  <h5 className="mb-0">Sign In</h5>

                </div>

                <div className="card-body">

                  <form onSubmit={handleSubmit}>

                    {error && (

                      <div className="alert alert-danger" role="alert">

                        {error}

                      </div>

                    )}

                    <div className="mb-3">

                      <label className="form-label">Email</label>

                      <div className="input-group">

                        <span className="input-group-text"><Mail size={16} /></span>

                        <input

                          type="email"

                          className="form-control"

                          name="email"

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

                          className="form-control"

                          name="password"

                          value={formData.password}

                          onChange={handleInputChange}

                          required

                        />

                      </div>

                    </div>

                    <button type="submit" className="btn btn-primary w-100">

                      <LogIn size={16} className="me-1" />

                      Sign In

                    </button>

                  </form>

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

              <p className="mb-0 small">

                Delivering comprehensive HR management solutions to streamline

                hiring, empower teams, and optimize workforce performance.

              </p>

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

