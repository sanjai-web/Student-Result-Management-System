import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Navbar from './Components/Navbar.jsx';
import StudentLogin from './Student/StudentLogin.jsx';
import StudentDashboard from './Student/StudentDashboard.jsx';
import StudentResult from './Student/StudentResult.jsx';
// Teachers functions
import TeacherLogin from './Teacher/TeacherLogin.jsx';
import TeacherDashboard from './Teacher/TeacherDashboard.jsx';
import TeacherResultPublish from './Teacher/TeacherResultPublish.jsx';
// Admin functions
import AdminDashboard from './Admin/AdminDashboard.jsx';
import AdminLogin from './Admin/AdminLogin.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/studentlogin" element={<StudentLogin />} />
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        <Route path="/student/result" element={<StudentResult />} />

        {/* Teacher Functions */}
        <Route path="/teacher/login" element={<TeacherLogin />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route 
          path="/teacher/result/publish/:studentId" 
          element={<TeacherResultPublish />} 
        />

        {/* Admin Functions */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);