import Navbar from './Components/Navbar';
import './styles/app.css';
import { FaUserGraduate, FaChalkboardTeacher, FaUserShield } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <header className="welcome-header">
          <h1>Welcome to EduTrack</h1>
          <p>Your comprehensive grade monitoring and academic management system</p>
        </header>
        <div className="dashboard">
          <div className="card student-card">
            <div className="card-icon">
              <FaUserGraduate />
            </div>
            <h2>Student Portal</h2>
            <p>Access your grades, track performance, and view attendance records.</p>
            <button className="card-btn" onClick={() => navigate('/studentlogin')}>Enter Portal</button>
          </div>

          <div className="card teacher-card">
            <div className="card-icon">
              <FaChalkboardTeacher />
            </div>  
            <h2>Teacher Portal</h2>
            <p>Upload marks, monitor student progress, and manage class records.</p>
            <button className="card-btn" onClick={() => navigate('/teacher/login')}>Enter Portal</button>
          </div>

          <div className="card admin-card">
            <div className="card-icon">
              <FaUserShield />
            </div>
            <h2>Admin Portal</h2>
            <p>Manage users, generate reports, and analyze institutional data.</p>
            <button className="card-btn" onClick={() => navigate('/admin/login')}>Enter Portal</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
