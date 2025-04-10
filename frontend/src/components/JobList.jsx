import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    company: '',
    role: '',
    link: '',
    appliedDate: '',
    status: ''
  });

  const fetchJobs = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user._id) return;
  
      const queryParams = new URLSearchParams();
      queryParams.append('createdBy', user._id); // ✅ filter by user
      if (statusFilter) queryParams.append('status', statusFilter); // ✅ optional filter
  
      const url = `${import.meta.env.VITE_BACKEND_URL}/jobs?${queryParams.toString()}`;
      const res = await axios.get(url);
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('❌ Error fetching jobs:', err);
      setJobs([]);
    }
  };
  

  useEffect(() => {
    fetchJobs();
  }, [statusFilter]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/jobs/${id}`, { status: newStatus });
      setJobs((prev) =>
        prev.map((job) => (job._id === id ? { ...job, status: newStatus } : job))
      );
    } catch (err) {
      console.error('❌ Error updating status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this job?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/jobs/${id}`);
        setJobs((prev) => prev.filter((job) => job._id !== id));
      } catch (err) {
        console.error('❌ Error deleting job:', err);
      }
    }
  };

  const startEdit = (job) => {
    setEditId(job._id);
    setEditData({
      company: job.company,
      role: job.role,
      link: job.link,
      appliedDate: job.appliedDate?.substring(0, 10) || '',
      status: job.status
    });
  };

  const saveEdit = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/jobs/${editId}`, editData);
      setJobs((prev) =>
        prev.map((job) => (job._id === editId ? { ...job, ...editData } : job))
      );
      setEditId(null);
    } catch (err) {
      console.error('❌ Error saving edit:', err);
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
      <h2 className="text-primary mb-3">📋 All Job Applications</h2>

      <div className="mb-3">
        <label htmlFor="statusFilter" className="form-label">Filter by Status:</label>
        <select
          id="statusFilter"
          className="form-select w-auto"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {jobs.length === 0 ? (
        <p className="text-muted">No job applications found.</p>
      ) : (
        <div className="row g-3">
        {jobs.map((job) => (
          <div className="col-md-12 col-lg-6" key={job._id}> {/* 👈 Wider card */}
         <div className="card h-150 shadow-sm" style={{ minWidth: '400px'}}>
              <div className="card-body">
                {editId === job._id ? (
                  <>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Company"
                      value={editData.company}
                      onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Role"
                      value={editData.role}
                      onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                    />
                    <input
                      type="url"
                      className="form-control mb-2"
                      placeholder="Link"
                      value={editData.link}
                      onChange={(e) => setEditData({ ...editData, link: e.target.value })}
                    />
                    <input
                      type="date"
                      className="form-control mb-2"
                      value={editData.appliedDate}
                      onChange={(e) => setEditData({ ...editData, appliedDate: e.target.value })}
                    />
                    <select
                      className="form-select mb-2"
                      value={editData.status}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <div className="d-flex justify-content-between">
                      <button className="btn btn-success btn-sm" onClick={saveEdit}>💾 Save</button>
                      <button className="btn btn-outline-secondary btn-sm" onClick={() => setEditId(null)}>❌ Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <h5 className="card-title">{job.company}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{job.role}</h6>
                    <p>
                      <a href={job.link} target="_blank" rel="noopener noreferrer" className="card-link">🔗 View Job</a>
                    </p>
                    <p className="mb-1">📅 {job.appliedDate?.substring(0, 10)}</p>
                    <p className="mb-2">Status: <strong>{job.status}</strong></p>
                    <div className="d-flex justify-content-between">
                      <button className="btn btn-outline-primary btn-sm" onClick={() => startEdit(job)}>✏️ Edit</button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(job._id)}>❌ Delete</button>
                    </div>
                  
                  </>
                )}
              </div>
            </div>
          </div>
          
        ))}
      </div>
      
      )}
    </div>
    </div>
  );
};

export default JobList;
