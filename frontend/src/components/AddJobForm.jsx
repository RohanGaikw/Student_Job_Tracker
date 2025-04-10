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

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
  
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user._id) {
      alert('User not found. Please login again.');
      navigate('/login-page');
      return;
    }
  
    try {
      const jobData = {
        ...form,
        createdBy: user._id // 👈 send logged-in user ID
      };
  
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/jobs`, jobData);
      alert('✅ Job added!');
      setForm({ company: '', role: '', status: 'Applied', appliedDate: '', link: '' });
      navigate('/job-list');
    } catch (err) {
      alert('❌ Error adding job');
    }
  };
  
  
  return (
    <div
    style={{
      height: '100vh',
      background: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)',
      display: 'flex',
      flexDirection: 'column',
      width:'220vh'
    }}
  >
    {/* Navbar */}
    <nav
      style={{
        backgroundColor: '#1e1e1e',
        color: 'white',
        padding: '20px 50px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
       <h4 onClick={() => navigate('/')} style={{ margin: 0, cursor: 'pointer' }}>
  Student Job Tracker
</h4>
      </nav>
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-success">➕ Add Job Application</h2>
        {/* Job List Button */}
        <button
          className="btn btn-outline-info"
          onClick={() => navigate('/job-list')}
          style={{ fontSize: '1.2rem' }}
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

        <div className="col-12 mt-3">
          <button type="submit" className="btn btn-primary me-2">
            ✅ Add Job
          </button>
          <button
    onClick={() => {
      localStorage.removeItem('user');
      navigate('/'); // Redirect to home page after logout
    }}
    style={{
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '1rem'
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
