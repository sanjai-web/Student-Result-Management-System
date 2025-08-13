import React, { useState, useEffect } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import '../styles/StudentResult.css';
import { useNavigate } from 'react-router-dom';

// PDF Document Component
const TranscriptPDF = ({ student, results, gpa }) => {
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontFamily: 'Helvetica'
    },
    header: {
      marginBottom: 20,
      textAlign: 'center',
      borderBottom: '1px solid #000',
      paddingBottom: 10
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10
    },
    subtitle: {
      fontSize: 16,
      marginBottom: 20
    },
    studentInfo: {
      marginBottom: 20,
      lineHeight: 1.5
    },
    section: {
      marginBottom: 10
    },
    table: {
      display: "table",
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
      marginBottom: 20
    },
    tableRow: { 
      flexDirection: "row" 
    },
    tableColHeader: {
      width: "20%",
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      backgroundColor: '#f0f0f0',
      padding: 5
    },
    tableCol: {
      width: "20%",
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
      padding: 5
    },
    headerText: {
      fontWeight: 'bold',
      textAlign: 'center'
    },
    summary: {
      marginTop: 20,
      padding: 10,
      backgroundColor: '#f9f9f9',
      border: '1px solid #ddd',
      borderRadius: 5
    }
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>OFFICIAL ACADEMIC TRANSCRIPT</Text>
          <Text style={styles.subtitle}>{student?.university || 'K S Rangasamy College of Technology (Autonomous)'}</Text>
        </View>

        <View style={styles.studentInfo}>
          <Text>Student Name: {student?.name || 'N/A'}</Text>
          <Text>Student ID: {student?.id || 'N/A'}</Text>
          <Text>Program: {student?.program || 'N/A'}</Text>
          <Text>Department: {student?.department || 'N/A'}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <View style={styles.tableColHeader}>
                <Text style={styles.headerText}>Semester</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.headerText}>Course Code</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.headerText}>Course Name</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.headerText}>Credits</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.headerText}>Grade</Text>
              </View>
            </View>
            
            {/* Table Rows */}
            {results
              .sort((a, b) => a.semester.localeCompare(b.semester))
              .map((row, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableCol}>
                  <Text>Semester {row.semester}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{row.subject?.code || 'N/A'}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{row.subject?.name || 'N/A'}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{row.subject?.credits || 'N/A'}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>{row.grade || 'N/A'}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.summary}>
          <Text>Total Courses Completed: {results.length}</Text>
          <Text>Cumulative GPA: {gpa}</Text>
        </View>
        
        <View style={{ marginTop: 30, textAlign: 'right', fontSize: 12 }}>
          <Text>Date Issued: {new Date().toLocaleDateString()}</Text>
          <Text style={{ marginTop: 20 }}>Registrar's Signature: _________________________</Text>
        </View>
      </Page>
    </Document>
  );
};

function StudentResult() {
  const [results, setResults] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const savedStudent = localStorage.getItem('student');
        if (!savedStudent) {
          navigate('/studentlogin');
          return;
        }

        const studentData = JSON.parse(savedStudent);
        setStudent(studentData);
        
        const response = await fetch(`http://localhost:8080/api/results/student/${studentData.id}`);
        if (!response.ok) throw new Error('Failed to fetch results');
        
        const data = await response.json();
        if (data.length > 0) {
          const allItems = data.flatMap(result => 
            result.items.map(item => ({
              ...item,
              semester: result.semester || 'N/A'
            }))
          );
          setResults(allItems);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [navigate]);

  const calculateGPA = () => {
    const gradePoints = {
      'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 
      'B': 6, 'C': 5, 'P': 4, 'F': 0
    };
    
    let totalCredits = 0;
    let totalPoints = 0;
    
    results.forEach(course => {
      if (course.grade && course.subject?.credits) {
        totalPoints += gradePoints[course.grade] * course.subject.credits;
        totalCredits += course.subject.credits;
      }
    });
    
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="student-result-container">
      <div className="result-header">
        <h2>Academic Results</h2>
        <div className="performance-stats">
          <div className="stat-card">
            <span className="stat-value">{calculateGPA()}</span>
            <span className="stat-label">Current GPA</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{results.length}</span>
            <span className="stat-label">Courses Completed</span>
          </div>
        </div>
      </div>
      
      <div className="result-table-container">
        <table className="result-table">
          <thead>
            <tr>
              <th>Semester</th>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Credits</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {results.length > 0 ? (
              results
                .sort((a, b) => a.semester.localeCompare(b.semester))
                .map((row, index) => (
                  <tr key={index}>
                    <td>Semester {row.semester}</td>
                    <td>{row.subject?.code || 'N/A'}</td>
                    <td>{row.subject?.name || 'N/A'}</td>
                    <td>{row.subject?.credits || 'N/A'}</td>
                    <td className={`grade-cell grade-${row.grade?.replace('+', 'plus') || 'na'}`}>
                      {row.grade || 'N/A'}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="5" className="no-results">No results found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="result-actions">
        {student && (
          <PDFDownloadLink 
            document={<TranscriptPDF 
              student={student} 
              results={results} 
              gpa={calculateGPA()} 
            />}
            fileName={`${student.name}_transcript.pdf`}
            className="download-btn"
          >
            {({ loading }) => (
              loading ? 'Preparing transcript...' : 'Download Transcript'
            )}
          </PDFDownloadLink>
        )}
        {/* <button className="print-btn" onClick={() => window.print()}>Print Results</button> */}
      </div>
    </div>
  );
}

export default StudentResult;