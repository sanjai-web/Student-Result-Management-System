import React, { useState } from 'react';
import '../styles/StudentLogin.css';
import { useNavigate } from 'react-router-dom';

function StudentLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    regno: '',
    confirmRegno: '' // Changed from password to confirmRegno for clarity
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Client-side validation
    if (credentials.regno !== credentials.confirmRegno) {
      setError('Registration numbers must match');
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8080/api/students/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          regno: credentials.regno.trim(),
          password: credentials.regno.trim() // Still sending as password for API consistency
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Login failed - please check your registration number');
      }

      const studentData = await response.json();
      localStorage.setItem('student', JSON.stringify(studentData));
      navigate('/studentdashboard');
      
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="student-login">
        <h2>Student Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="regno">Registration Number</label>
            <input 
              type="text" 
              id="regno" 
              name="regno"
              value={credentials.regno}
              onChange={handleChange}
              required 
              placeholder="Registration number"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmRegno">Password</label>
            <input 
              type="text" 
              id="confirmRegno" 
              name="confirmRegno"
              value={credentials.confirmRegno}
              onChange={handleChange}
              required 
              placeholder="Password"
            />
          </div>
          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default StudentLogin;
