import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AddJobForm from './components/AddJobForm';
import JobList from './components/JobList';
import LoginPage from './components/LoginPage';       // ✅ Add this
import RegisterPage from './components/RegisterPage'; // ✅ Add this
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
  const navigate = useNavigate();    
  const user = JSON.parse(localStorage.getItem('user')); // ✅ Check login status
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
            
<div>
  {!user ? (
    <>
     <button
  className="btn btn-outline-light me-2"
  onClick={() => navigate('/register-page')}
>
  Register
</button>

<button
  className="btn btn-outline-light"
  onClick={() => navigate('/login-page')}
>
  Login
</button>

    </>
  ) : (
    <button
      className="btn btn-link text-white"
      onClick={() => {
        localStorage.removeItem('user'); // ✅ Clear login
        navigate('/login-page');
      }}
    >
      Logout
    </button>
  )}
</div>

          </nav>
    
          {/* Welcome Section */}
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ flex: 1 }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                padding: '40px',
                borderRadius: '15px',
                maxWidth: '700px',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              }}
            >
              <h1 style={{ color: 'purple', fontWeight: 'bold' }}>
                Welcome to Student Job Tracker
              </h1>
              <p style={{ color: 'purple', fontSize: '18px' }}>
                Your job tracking app is just a few clicks away. Please log in or register to start.
              </p>
            </div>
          </div>
        </div>
      );
    };    

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login-page" element={<LoginPage />} />
      <Route path="/register-page" element={<RegisterPage />} />
      <Route path="/add-job" element={<AddJobForm />} />
      <Route path="/job-list" element={<JobList />} />
    </Routes>
  );
}

export default App;
