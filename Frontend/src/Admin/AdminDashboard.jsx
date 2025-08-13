import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaChalkboardTeacher, FaUsers, FaBook, FaChevronDown, FaChevronUp, FaSpinner, FaTimes } from 'react-icons/fa';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const [activeForm, setActiveForm] = useState(null);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [editType, setEditType] = useState(null);
  const [expandedClass, setExpandedClass] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [classForm, setClassForm] = useState({
    batchYear: '',
    year: '',
    semester: '',
     department: '',
    students: [{
        name: '',
        regno: '',
        email: '',
        mobile: '',
        department: '',
        studentBatchYear: '',
        dob: ''
    }]
});

  const [teacherForm, setTeacherForm] = useState({
    name: '',
    dept: '',
    password: '',
    staffId: '',
    email: '',
    mobile: ''
  });

 
const [subjectForm, setSubjectForm] = useState({
  code: '',
  name: '',
  department: ''
});
  // Fetch data on component mount
  useEffect(() => {
    fetchTeachers();
    fetchClasses();
    fetchSubjects();
  }, []);

  const fetchTeachers = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch("http://localhost:8080/api/teachers");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setTeachers(data);
  } catch (err) {
    setError(`Failed to fetch teachers: ${err.message}`);
    console.error("Error fetching teachers:", err);
  } finally {
    setLoading(false);
  }
};

  const fetchClasses = async () => {
  setLoading(true);
  try {
    const response = await fetch("http://localhost:8080/api/classes", {
      credentials: 'include' // Add this line if using cookies/sessions
    });
    if (!response.ok) throw new Error('Failed to fetch classes');
    const data = await response.json();
    setClasses(data);
  } catch (err) {
    setError(err.message);
    console.error("Error fetching classes:", err);
  } finally {
    setLoading(false);
  }
};

  const fetchSubjects = async () => {
  setLoading(true);
  try {
    const response = await fetch("http://localhost:8080/api/subjects", {
      credentials: 'include' // Add this if using sessions
    });
    if (!response.ok) throw new Error('Failed to fetch subjects');
    const data = await response.json();
    setSubjects(data);
  } catch (err) {
    setError(err.message);
    console.error("Error fetching subjects:", err);
  } finally {
    setLoading(false);
  }
};
  // Handlers
const handleClassChange = (e) => {
  const { name, value } = e.target;
  const updatedForm = { ...classForm, [name]: value };
  
  // If batchYear, department, or semester changes, update all students
  if (name === 'batchYear' || name === 'department' || name === 'semester') {
    updatedForm.students = updatedForm.students.map(student => ({
      ...student,
      studentBatchYear: name === 'batchYear' ? value : student.studentBatchYear,
      department: name === 'department' ? value : student.department,
      semester: name === 'semester' ? value : student.semester
    }));
  }
  
  setClassForm(updatedForm);
};

  const handleTeacherChange = (e) => {
    const { name, value } = e.target;
    setTeacherForm({ ...teacherForm, [name]: value });

     if (name === 'batchYear') {
    updatedForm.students = updatedForm.students.map(student => ({
      ...student,
      studentBatchYear: value
    }));
  }
  
  setClassForm(updatedForm);
  };

  const handleSubjectChange = (e) => {
  const { name, value } = e.target;
  setSubjectForm({ ...subjectForm, [name]: value });
};




  const handleStudentChange = (index, field, value) => {
     if (field === 'studentBatchYear') return;
    const newStudents = [...classForm.students];
    newStudents[index][field] = value;
    setClassForm({ ...classForm, students: newStudents });
};

  const addStudent = () => {
  setClassForm({
    ...classForm,
    students: [
      ...classForm.students,
      {
        name: '',
        regno: '',
        email: '',
        mobile: '',
        department: classForm.department || '',
        studentBatchYear: classForm.batchYear || '',
        semester: classForm.semester || '', // Add semester from class
        dob: ''
      }
    ]
  });
};

  const removeStudent = (index) => {
    const newStudents = [...classForm.students];
    newStudents.splice(index, 1);
    setClassForm({ ...classForm, students: newStudents });
  };

  const submitClass = async () => {
  setLoading(true);
  setError(null);
  try {
    // Ensure all students have the class's batch year and department
   const studentsWithClassData = classForm.students.map(student => ({
      ...student,
      studentBatchYear: classForm.batchYear,
      department: classForm.department,
      semester: classForm.semester // Add this line
    }));

    const response = await fetch("http://localhost:8080/api/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...classForm,
        students: studentsWithClassData
      }),
    });
    
    if (!response.ok) throw new Error('Failed to save class');
    
    await fetchClasses();
    resetClassForm();
    setActiveForm(null);
  } catch (err) {
    setError(err.message);
    console.error("Error saving class:", err);
  } finally {
    setLoading(false);
  }
};

  const resetClassForm = () => {
    setClassForm({
      batchYear: '',
      year: '',
      semester: '',
      department: '',
      students: [{
        name: '',
        regno: '',
        email: '',
        mobile: '',
        department: '',
        studentBatchYear: '',
        dob: ''
      }]
    });
  };

  const submitTeacher = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8080/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teacherForm),
      });
      
      if (!response.ok) throw new Error('Failed to save teacher');
      
      await fetchTeachers();
      setTeacherForm({
        name: '',
        dept: '',
        password: '',
        staffId: '',
        email: '',
        mobile: ''
      });
      setActiveForm(null);
    } catch (err) {
      setError(err.message);
      console.error("Error saving teacher:", err);
    } finally {
      setLoading(false);
    }
  };

  const submitSubject = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch("http://localhost:8080/api/subjects", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        
      },
      body: JSON.stringify(subjectForm),
    });
    
    if (!response.ok) throw new Error('Failed to save subject');
    
    await fetchSubjects();
    setSubjectForm({
      code: '',
      name: '',
      department: ''
    });
    setActiveForm(null);
  } catch (err) {
    setError(err.message);
    console.error("Error saving subject:", err);
  } finally {
    setLoading(false);
  }
};

  const editClass = (index) => {
    const classToEdit = classes[index];
    setEditItem(classToEdit);
    setEditType('class');
    setClassForm({
      ...classToEdit,
      students: classToEdit.students && classToEdit.students.length > 0 
        ? classToEdit.students 
        : [{
            name: '',
            regno: '',
            email: '',
            mobile: '',
            department: '',
            studentBatchYear: '',
            dob: ''
          }]
    });
    setActiveForm('createClass');
  };

  const editTeacher = (index) => {
    const teacherToEdit = teachers[index];
    setEditItem(teacherToEdit);
    setEditType('teacher');
    setTeacherForm({
      name: teacherToEdit.name,
      dept: teacherToEdit.dept,
      password: '',
      staffId: teacherToEdit.staffId,
      email: teacherToEdit.email,
      mobile: teacherToEdit.mobile
    });
    setActiveForm('addTeacher');
  };

  const editSubject = (index) => {
    const subjectToEdit = subjects[index];
    setEditItem(subjectToEdit);
    setEditType('subject');
    setSubjectForm({
      code: subjectToEdit.code,
      name: subjectToEdit.name,
      department: subjectToEdit.department
    });
    setActiveForm('addSubject');
  };

const updateClass = async () => {
  if (!editItem || !editItem.id) {
    setError('No class selected for editing');
    return;
  }

  setLoading(true);
  setError(null);
  try {
    // Ensure all students have the class's batch year and department
    const studentsWithClassData = classForm.students.map(student => ({
      ...student,
      studentBatchYear: classForm.batchYear,
      department: classForm.department,
      semester: classForm.semester // Add this line
    }));

    const response = await fetch(`http://localhost:8080/api/classes/${editItem.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...classForm,
        students: studentsWithClassData
      }),
    });

    if (!response.ok) throw new Error('Failed to update class');
    
    await fetchClasses();
    setEditItem(null);
    setEditType(null);
    setActiveForm(null);
  } catch (err) {
    setError(err.message);
    console.error("Error updating class:", err);
  } finally {
    setLoading(false);
  }
};

const deleteClass = async (id) => {
  if (!window.confirm('Are you sure you want to delete this class?')) return;
  
  setLoading(true);
  try {
    const response = await fetch(`http://localhost:8080/api/classes/${id}`, {
      method: "DELETE",
      credentials: 'include', // Include credentials if using sessions
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Failed to delete class');
    
    await fetchClasses();
  } catch (err) {
    setError(err.message);
    console.error("Error deleting class:", err);
  } finally {
    setLoading(false);
  }
};

  const updateTeacher = async () => {
    if (!editItem || !editItem.id) {
      setError('No teacher selected for editing');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/api/teachers/${editItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teacherForm),
      });

      if (!response.ok) throw new Error('Failed to update teacher');

      await fetchTeachers();
      setEditItem(null);
      setEditType(null);
      setActiveForm(null);
    } catch (err) {
      setError(err.message);
      console.error("Error updating teacher:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateSubject = async () => {
    if (!editItem || !editItem.id) {
      setError('No subject selected for editing');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/api/subjects/${editItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subjectForm),
      });

      if (!response.ok) throw new Error('Failed to update subject');

      await fetchSubjects();
      setEditItem(null);
      setEditType(null);
      setActiveForm(null);
    } catch (err) {
      setError(err.message);
      console.error("Error updating subject:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/subjects/${id}`, {
        method: "DELETE"
      });
      
      if (!response.ok) throw new Error('Failed to delete subject');
      
      await fetchSubjects();
    } catch (err) {
      setError(err.message);
      console.error("Error deleting subject:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleClassExpand = (index) => {
    setExpandedClass(expandedClass === index ? null : index);
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users, view reports, and configure settings.</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="error-close">
            <FaTimes />
          </button>
        </div>
      )}

      <div className="action-buttons">
        <button 
          className={`action-btn ${activeForm === 'createClass' ? 'active' : ''}`}
          onClick={() => {
            setActiveForm(activeForm === 'createClass' ? null : 'createClass');
            if (activeForm !== 'createClass') {
              resetClassForm();
              setEditItem(null);
              setEditType(null);
            }
          }}
          disabled={loading}
        >
          <FaChalkboardTeacher className="btn-icon" />
          {editType === 'class' ? 'Edit Class' : 'Create Class'}
        </button>
        
        <button 
          className={`action-btn ${activeForm === 'addTeacher' ? 'active' : ''}`}
          onClick={() => {
            setActiveForm(activeForm === 'addTeacher' ? null : 'addTeacher');
            if (activeForm !== 'addTeacher') {
              setTeacherForm({
                name: '',
                dept: '',
                password: '',
                staffId: '',
                email: '',
                mobile: ''
              });
              setEditItem(null);
              setEditType(null);
            }
          }}
          disabled={loading}
        >
          <FaUsers className="btn-icon" />
          {editType === 'teacher' ? 'Edit Teacher' : 'Add Teacher'}
        </button>

        <button 
          className={`action-btn ${activeForm === 'addSubject' ? 'active' : ''}`}
          onClick={() => {
            setActiveForm(activeForm === 'addSubject' ? null : 'addSubject');
            if (activeForm !== 'addSubject') {
              setSubjectForm({
                code: '',
                name: '',
                department: ''
              });
              setEditItem(null);
              setEditType(null);
            }
          }}
          disabled={loading}
        >
          <FaBook className="btn-icon" />
          {editType === 'subject' ? 'Edit Subject' : 'Add Subject'}
        </button>
      </div>

      {activeForm === 'createClass' && (
        <div className="form-container">
          <h2>{editType === 'class' ? 'Edit Class' : 'Create New Class'}</h2>
          
          <div className="form-group">
            <label>Batch Year</label>
            <input 
              type="text" 
              name="batchYear" 
              value={classForm.batchYear} 
              onChange={handleClassChange} 
              placeholder="e.g. 2025-2029"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label>Year</label>
            <input 
              type="text" 
              name="year" 
              value={classForm.year} 
              onChange={handleClassChange} 
              placeholder="e.g. 1"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label>Semester</label>
            <input 
              type="text" 
              name="semester" 
              value={classForm.semester} 
              onChange={handleClassChange} 
              placeholder="e.g. 1"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label>Department</label>
            <input 
              type="text" 
              name="department" 
              value={classForm.department} 
              onChange={handleClassChange} 
              placeholder="e.g. CSBS"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label>Students (Name and Registration Number only required)</label>
            {classForm.students.map((student, index) => (
                <div key={index} className="student-input-group">
                    <div className="student-input-row">
                        <input
                            type="text"
                            placeholder="Name*"
                            value={student.name}
                            onChange={(e) => handleStudentChange(index, 'name', e.target.value)}
                            disabled={loading}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Registration Number*"
                            value={student.regno}
                            onChange={(e) => handleStudentChange(index, 'regno', e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>
                    {/* <div className="student-input-row">
                        <input
                            type="email"
                            placeholder="Email (optional)"
                            value={student.email}
                            onChange={(e) => handleStudentChange(index, 'email', e.target.value)}
                            disabled={loading}
                        />
                        <input
                            type="tel"
                            placeholder="Mobile (optional)"
                            value={student.mobile}
                            onChange={(e) => handleStudentChange(index, 'mobile', e.target.value)}
                            disabled={loading}
                        />
                    </div> */}
                    {/* <div className="student-input-row">
                        <input
                            type="text"
                            placeholder="Department*"
                            value={student.department}
                            onChange={(e) => handleStudentChange(index, 'department', e.target.value)}
                            disabled={loading}
                        />
                        <input
                            type="text"
                            placeholder="Batch Year (optional)"
                            value={student.studentBatchYear}
                            onChange={(e) => handleStudentChange(index, 'studentBatchYear', e.target.value)}
                            disabled={loading}
                        />
                    </div> */}
                    <div className="student-input-row">
                        {/* <input
                            type="date"
                            placeholder="Date of Birth (optional)"
                            value={student.dob}
                            onChange={(e) => handleStudentChange(index, 'dob', e.target.value)}
                            disabled={loading}
                        /> */}
                        {classForm.students.length > 1 && (
                            <button 
                                type="button" 
                                className="remove-btn"
                                onClick={() => removeStudent(index)}
                                disabled={loading}
                            >
                                Remove Student
                            </button>
                        )}
                    </div>
                </div>
            ))}
            <button 
                type="button" 
                className="add-more" 
                onClick={addStudent}
                disabled={loading}
            >
                <FaPlus /> Add Student
            </button>
        </div>

          <button 
            className="submit-btn"
            onClick={editType === 'class' ? updateClass : submitClass}
            disabled={loading}
          >
            {loading ? (
              <FaSpinner className="spinner" />
            ) : editType === 'class' ? (
              'Update Class'
            ) : (
              'Create Class'
            )}
          </button>
        </div>
      )}

      {activeForm === 'addTeacher' && (
        <div className="form-container">
          <h2>{editType === 'teacher' ? 'Edit Teacher' : 'Add New Teacher'}</h2>
          
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              name="name" 
              value={teacherForm.name} 
              onChange={handleTeacherChange} 
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label>Department</label>
            <input 
              type="text" 
              name="dept" 
              value={teacherForm.dept} 
              onChange={handleTeacherChange} 
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              value={teacherForm.password} 
              onChange={handleTeacherChange} 
              disabled={loading}
              placeholder={editType === 'teacher' ? 'Leave empty to keep current password' : ''}
              required={editType !== 'teacher'}
            />
          </div>

          <div className="form-group">
            <label>Staff ID</label>
            <input 
              type="text" 
              name="staffId" 
              value={teacherForm.staffId} 
              onChange={handleTeacherChange} 
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              value={teacherForm.email} 
              onChange={handleTeacherChange} 
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label>Mobile No</label>
            <input 
              type="tel" 
              name="mobile" 
              value={teacherForm.mobile} 
              onChange={handleTeacherChange} 
              disabled={loading}
              required
            />
          </div>

          <button 
            className="submit-btn"
            onClick={editType === 'teacher' ? updateTeacher : submitTeacher}
            disabled={loading}
          >
            {loading ? (
              <FaSpinner className="spinner" />
            ) : editType === 'teacher' ? (
              'Update Teacher'
            ) : (
              'Add Teacher'
            )}
          </button>
        </div>
      )}

      {activeForm === 'addSubject' && (
        <div className="form-container">
          <h2>{editType === 'subject' ? 'Edit Subject' : 'Add New Subject'}</h2>
          
          <div className="form-group">
            <label>Subject Code</label>
            <input 
              type="text" 
              name="code" 
              value={subjectForm.code} 
              onChange={handleSubjectChange} 
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label>Subject Name</label>
            <input 
              type="text" 
              name="name" 
              value={subjectForm.name} 
              onChange={handleSubjectChange} 
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label>Department</label>
            <input 
              type="text" 
              name="department" 
              value={subjectForm.department} 
              onChange={handleSubjectChange} 
              disabled={loading}
              required
            />
          </div>

          <button 
            className="submit-btn"
            onClick={editType === 'subject' ? updateSubject : submitSubject}
            disabled={loading}
          >
            {loading ? (
              <FaSpinner className="spinner" />
            ) : editType === 'subject' ? (
              'Update Subject'
            ) : (
              'Add Subject'
            )}
          </button>
        </div>
      )}

      <div className="data-display">
        <div className="classes-container">
          <h2>Classes</h2>
          {loading && classes.length === 0 ? (
            <div className="loading-spinner">
              <FaSpinner className="spinner" />
            </div>
          ) : classes.length > 0 ? (
            classes.map((cls, index) => (
              <div key={index} className="class-card">
                <div 
                  className="class-summary" 
                  onClick={() => toggleClassExpand(index)}
                >
                  <span>Batch: {cls.batchYear} | Year: {cls.year} | Semester: {cls.semester} | Department: {cls.department}</span>
                  <div>
                    <button 
                      className="edit-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        editClass(index);
                      }}
                      disabled={loading}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteClass(cls.id);
                      }}
                      disabled={loading}
                    >
                      Delete
                    </button>
                    {expandedClass === index ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </div>
                
                {expandedClass === index && (
    <div className="students-list">
        <h4>Students ({cls.students ? cls.students.length : 0}):</h4>
        <div className="student-table-container">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Reg No</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Department</th>
                        <th>Semester</th>
                        <th>Batch</th>
                        <th>DOB</th>
                    </tr>
                </thead>
                <tbody>
  {cls.students && cls.students.length > 0 ? (
    cls.students.map((student, i) => (
      <tr key={i}>
        <td>{student.name}</td>
        <td>{student.regno}</td>
        <td>{student.email || 'Not provided'}</td>
        <td>{student.mobile || 'Not provided'}</td>
        <td>{cls.department || student.department || 'Not provided'}</td>
        <td>{student.semester || cls.semester || 'Not provided'}</td>
        <td>{cls.batchYear || student.studentBatchYear || 'Not provided'}</td>
        <td>{student.dob || 'Not provided'}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" className="no-data">No students added</td>
    </tr>
  )}
</tbody>
            </table>
        </div>
    </div>
)}
              </div>
            ))
          ) : (
            <p className="no-data">No classes created yet</p>
          )}
        </div>

        <div className="teachers-container">
          <h2>Teachers</h2>
          {loading && teachers.length === 0 ? (
            <div className="loading-spinner">
              <FaSpinner className="spinner" />
            </div>
          ) : teachers.length > 0 ? (
            teachers.map((teacher, index) => (
              <div key={index} className="teacher-card">
                <div className="teacher-info">
                  <h3>{teacher.name}</h3>
                  <p><strong>Department:</strong> {teacher.dept}</p>
                  <p><strong>Staff ID:</strong> {teacher.staffId}</p>
                  <p><strong>Email:</strong> {teacher.email}</p>
                  <p><strong>Mobile:</strong> {teacher.mobile}</p>
                </div>
                <button 
                  className="edit-btn" 
                  onClick={() => editTeacher(index)}
                  disabled={loading}
                >
                  <FaEdit /> Edit
                </button>
              </div>
            ))
          ) : (
            <p className="no-data">No teachers added yet</p>
          )}
        </div>

        <div className="subjects-container">
  <h2>Subjects</h2>
  {loading && subjects.length === 0 ? (
    <div className="loading-spinner">
      <FaSpinner className="spinner" />
    </div>
  ) : subjects.length > 0 ? (
    <div className="subject-table-container">
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject, index) => (
            <tr key={index}>
              <td>{subject.code}</td>
              <td>{subject.name}</td>
              <td>{subject.department}</td>
              <td>
                <button 
                  className="edit-btn" 
                  onClick={() => editSubject(index)}
                  disabled={loading}
                >
                  <FaEdit />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteSubject(subject.id)}
                  disabled={loading}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <p className="no-data">No subjects added yet</p>
  )}
</div>
      </div>
    </div>
  );
}

export default AdminDashboard;