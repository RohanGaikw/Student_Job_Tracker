import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddJobForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    company: '',
    role: '',
    status: 'Applied',
    appliedDate: '',
    link: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user._id) {
      alert('User not found. Please login again.');
      navigate('/login-page');
      return;
    }

    try {
      const jobData = { ...form, createdBy: user._id };
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/jobs`, jobData);
      alert('✅ Job added!');
      setForm({ company: '', role: '', status: 'Applied', appliedDate: '', link: '' });
      navigate('/job-list');
    } catch (err) {
      alert('❌ Error adding job');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* Navbar */}
      <nav className="navbar navbar-expand-md navbar-dark bg-dark px-4">
        <div className="container-fluid">
          <span className="navbar-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            Student Job Tracker
          </span>
        </div>
      </nav>

      {/* Form Section */}
      <div className="container my-4 px-3 px-md-0">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <h2 className="text-success mb-3 mb-md-0">➕ Add Job Application</h2>
          <button
            className="btn btn-outline-info"
            onClick={() => navigate('/job-list')}
          >
            📋 View Applied Jobs
          </button>
        </div>

        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Company</label>
            <input
              name="company"
              type="text"
              className="form-control"
              placeholder="e.g. Google"
              value={form.company}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Role</label>
            <input
              name="role"
              type="text"
              className="form-control"
              placeholder="e.g. Frontend Developer"
              value={form.role}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Status</label>
            <select name="status" className="form-select" value={form.status} onChange={handleChange}>
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Date Applied</label>
            <input
              type="date"
              name="appliedDate"
              className="form-control"
              value={form.appliedDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Job Link (optional)</label>
            <input
              name="link"
              type="url"
              className="form-control"
              placeholder="https://example.com"
              value={form.link}
              onChange={handleChange}
            />
          </div>

          <div className="col-12 mt-3 d-grid gap-2 d-md-flex justify-content-md-start">
            <button type="submit" className="btn btn-primary">
              ✅ Add Job
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                localStorage.removeItem('user');
                navigate('/');
              }}
            >
              🔓 Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobForm;
