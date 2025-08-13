import React, { useState, useEffect } from 'react';
import '../styles/TeacherResultPublish.css';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

function TeacherResultPublish() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([{ subjectId: '', grade: '' }]);
  const [student, setStudent] = useState(null);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const gradeOptions = ['O', 'A+', 'A', 'B+', 'B', 'C', 'F'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch student details
        const studentRes = await fetch(`http://localhost:8080/api/students/${studentId}`);
        if (!studentRes.ok) throw new Error('Failed to fetch student data');
        const studentData = await studentRes.json();
        
        // Debug logging
        console.log('Full student data:', studentData);
        console.log('Student name:', studentData.name);
        console.log('Student semester:', studentData.semester);
        console.log('Semester type:', typeof studentData.semester);
        console.log('All student properties:', Object.keys(studentData));
        
        setStudent(studentData);

        // Fetch available subjects
        const subjectsRes = await fetch('http://localhost:8080/api/subjects');
        if (!subjectsRes.ok) throw new Error('Failed to fetch subjects');
        const subjectsData = await subjectsRes.json();
        setAvailableSubjects(subjectsData);

        // Fetch existing results if any
        const resultsRes = await fetch(`http://localhost:8080/api/results/student/${studentId}`);
        if (resultsRes.ok) {
          const resultsData = await resultsRes.json();
          if (resultsData.length > 0) {
            setSubjects(resultsData[0].items.map(item => ({
              subjectId: item.subject.id.toString(),
              grade: item.grade
            })));
          }
        }

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  const handleChange = (index, field, value) => {
    const updated = [...subjects];
    updated[index][field] = value;
    setSubjects(updated);
  };

  const addSubjectRow = () => {
    setSubjects([...subjects, { subjectId: '', grade: '' }]);
  };

  const removeSubjectRow = (index) => {
    const updated = [...subjects];
    updated.splice(index, 1);
    setSubjects(updated);
  };

  const publishResult = async () => {
    try {
        const teacherId = 1; // Get from auth context in real implementation
        
        const resultData = {
            studentId: parseInt(studentId),
            teacherId: teacherId,
            semester: student.semester || '1', // Add semester from student data
            items: subjects
                .filter(item => item.subjectId && item.grade)
                .map(item => ({
                    subjectId: parseInt(item.subjectId),
                    grade: item.grade
                }))
        };

      if (resultData.items.length === 0) {
        throw new Error('Please add at least one subject with grade');
      }

      const response = await fetch('http://localhost:8080/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to publish results');
      }
      
      alert('Results Published Successfully');
      navigate('/teacher/dashboard');
    } catch (err) {
      console.error('Error publishing results:', err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <FaSpinner className="spinner" />
        <p>Loading student data...</p>
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
    <div className="publish-container">
      <h2>Publish Result for Student</h2>

      {student && (
        <div className="student-details">
          <p><strong>Name:</strong> {student.name || 'N/A'}</p>
          <p><strong>Registration No:</strong> {student.regno || 'N/A'}</p>
          <p><strong>Batch:</strong> {student.studentBatchYear || 'N/A'}</p>
          <p><strong>Department:</strong> {student.department || 'N/A'}</p>
          <p><strong>Semester:</strong> {student.semester || 'Not Assigned'}</p>
          
      
         
        </div>
      )}

      <div className="subject-grade-section">
        <h3>Subject Grades</h3>
        {subjects.map((row, index) => (
          <div key={index} className="subject-grade-row">
            <select
              value={row.subjectId}
              onChange={(e) => handleChange(index, 'subjectId', e.target.value)}
              required
            >
              <option value="">Select Subject</option>
              {availableSubjects.map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
              ))}
            </select>

            <select
              value={row.grade}
              onChange={(e) => handleChange(index, 'grade', e.target.value)}
              required
            >
              <option value="">Select Grade</option>
              {gradeOptions.map((g, i) => (
                <option key={i} value={g}>{g}</option>
              ))}
            </select>

            {subjects.length > 1 && (
              <button 
                type="button" 
                className="remove-btn"
                onClick={() => removeSubjectRow(index)}
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button 
          type="button" 
          className="add-btn" 
          onClick={addSubjectRow}
        >
          + Add Subject
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="action-buttons">
        <button 
          type="button" 
          className="cancel-btn"
          onClick={() => navigate('/teacher/dashboard')}
        >
          Cancel
        </button>
        <button 
          type="button" 
          className="publish-btn"
          onClick={publishResult}
        >
          Publish Results
        </button>
      </div>
    </div>
  );
}

export default TeacherResultPublish;