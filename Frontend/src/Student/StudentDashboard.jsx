import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaEdit, FaSave } from 'react-icons/fa';
import '../styles/StudentDashboard.css';
import { useNavigate } from 'react-router-dom';

function StudentDashboard() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Get student data from localStorage or API
        const savedStudent = localStorage.getItem('student');
        if (savedStudent) {
          setProfile(JSON.parse(savedStudent));
        } else {
          // If no saved data, redirect to login
          navigate('/studentlogin');
        }
      } catch (err) {
        setError('Failed to load student data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

const handleSave = async () => {
  try {
    setLoading(true);
    setError(null);
    
    // Validate inputs
    if (!profile.email) {
      throw new Error('Email is required');
    }

    const response = await fetch(`http://localhost:8080/api/students/${profile.id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // If using auth
      },
      body: JSON.stringify({
        email: profile.email,
        mobile: profile.mobile,
        dob: profile.dob
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }

    // Update both state and localStorage
    setProfile(data);
    localStorage.setItem('student', JSON.stringify(data));
    setIsEditing(false);
    
    console.log('Profile updated successfully:', data);
  } catch (err) {
    console.error('Update error:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading student data...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="error-container">
        <p>No student data found. Please login again.</p>
        <button onClick={() => navigate('/studentlogin')}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      <div className="dashboard-container">
        <div className="profile-section">
          <div className="profile-header">
            <div className="profile-icon">
              <FaUserCircle size={100} /> 
            </div>
            <div className="profile-info-grid">
              <div className="info-item">
                <span className="info-label">Name:</span>
                <span className="info-value">{profile?.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Reg No:</span>
                <span className="info-value">{profile?.regno}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Department:</span>
                <span className="info-value">{profile?.department}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Batch Year:</span>
                <span className="info-value">{profile?.studentBatchYear}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="profile-form">
            <div className="form-edit-icon" onClick={isEditing ? handleSave : () => setIsEditing(true)}>
              {isEditing ? <FaSave size={24} /> : <FaEdit size={24} />}
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Email Address</label>
                {isEditing ? (
                  <input 
                    type="email" 
                    name="email" 
                    value={profile.email || ''} 
                    onChange={handleChange} 
                  />
                ) : (
                  <div className="form-value">{profile.email || 'Not provided'}</div>
                )}
              </div>

              <div className="form-group">
                <label>Mobile Number</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    name="mobile" 
                    value={profile.mobile || ''} 
                    onChange={handleChange} 
                  />
                ) : (
                  <div className="form-value">{profile.mobile || 'Not provided'}</div>
                )}
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                {isEditing ? (
                  <input 
                    type="date" 
                    name="dob" 
                    value={profile.dob || ''} 
                    onChange={handleChange} 
                  />
                ) : (
                  <div className="form-value">{profile.dob || 'Not provided'}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="result-button-container">
        <button className="result-btn" onClick={() => navigate('/student/result')}>View Result</button>
      </div>
    </div>
  );
}

export default StudentDashboard;