import React from "react";
import { User, Mail, Lock, Phone, UserPlus } from "lucide-react";

interface AddEmployeeProps {
  formData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const AddEmployee: React.FC<AddEmployeeProps> = ({ formData, handleInputChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">First Name</label>
          <div className="input-group">
            <span className="input-group-text"><User size={16} /></span>
            <input
              type="text"
              className="form-control"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="col-md-6">
          <label className="form-label">Last Name</label>
          <div className="input-group">
            <span className="input-group-text"><User size={16} /></span>
            <input
              type="text"
              className="form-control"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      </div>

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

      <div className="mb-3">
        <label className="form-label">Phone</label>
        <div className="input-group">
          <span className="input-group-text"><Phone size={16} /></span>
          <input
            type="tel"
            className="form-control"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Role</label>
        <select
          className="form-select"
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          required
        >
          <option value="Manager">Manager</option>
          <option value="HR">HR</option>
          <option value="Interviewer">Interviewer</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary w-100">
        <UserPlus size={16} className="me-1" />
        Sign Up
      </button>
    </form>
  );
};

export default AddEmployee;