import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/register`, form);
      alert('✅ Registered successfully!');
      navigate('/login-page');
    } catch (err) {
      alert('❌ Registration failed');
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
    <div className="container my-5" style={{ maxWidth: '400px' }}>
      <h2 className="text-center mb-4">Register</h2>
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-3" name="name" type="text" placeholder="Name" required value={form.name} onChange={handleChange} />
        <input className="form-control mb-3" name="email" type="email" placeholder="Email" required value={form.email} onChange={handleChange} />
        <input className="form-control mb-3" name="password" type="password" placeholder="Password" required value={form.password} onChange={handleChange} />
        <button className="btn btn-primary w-100" type="submit">Register</button>
        <p className="mt-3 text-center">
          Already have an account? <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => navigate('/login-page')}>Login</span>
        </p>
      </form>
    </div>
   
    </div>
  );
};

export default RegisterPage;
