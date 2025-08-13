import React, { useState, useEffect } from 'react';
import '../styles/TeacherDashboard.css';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

function TeacherDashboard() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch classrooms from backend API
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/classes', {
          credentials: 'include' // Include if using cookies/sessions
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch classrooms');
        }
        
        const data = await response.json();
        setClassrooms(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching classrooms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <FaSpinner className="spinner" />
        <p>Loading classrooms...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <h1>ClassRoom</h1>
      </div>

      {classrooms.length > 0 ? (
        classrooms.map((cls, index) => (
          <div key={index} className="info-cards-wrapper">
            <div
              className="info-card"
              onClick={() => toggleDropdown(index)}
            >
              <div className="card-content">
                <h3>Batch</h3>
                <p>{cls.batchYear}</p>
              </div>

              <div className="card-content">
                <h3>Department</h3>
                <p>{cls.department || 'N/A'}</p>
              </div>

              <div className="card-content">
                <h3>Semester</h3>
                <p>{cls.semester}</p>
              </div>

              <div className="card-content">
                <h3>Year</h3>
                <p>{cls.year}</p>
              </div>
            </div>

            {openIndex === index && (
              <div className="student-table-container">
                <table className="student-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Reg No</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cls.students && cls.students.length > 0 ? (
                      cls.students.map((student, i) => (
                        <tr key={i}>
                          <td>{student.name || 'N/A'}</td>
                          <td>{student.regno || 'N/A'}</td>
                          <td>
                            <button
                              className="publishres-btn"
                              onClick={() =>
                                navigate(`/teacher/result/publish/${student.id}`)
                              }
                            >
                              Publish Result
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="no-students">No students found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="no-classrooms">No classrooms available</p>
      )}
    </div>
  );
}

export default TeacherDashboard;