import React from 'react';
import '../styles/navbar.css';
import { FaGraduationCap, FaHome, FaInfoCircle, FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
function Navbar() {
  const navigate = useNavigate(); 

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <FaGraduationCap className="navbar-icon" />
        <span className="navbar-logo">EduTrack</span>
      </div>
      <ul className="navbar-links">
        <li><a href="/"><FaHome className="nav-icon" /> Dashboard</a></li>
        <li><a href="#"><FaInfoCircle className="nav-icon" /> About</a></li>
        <li><a href="#"><FaEnvelope className="nav-icon" /> Contact</a></li>
        {/* <li><button className="login-btn" onClick={() => navigate('/studentlogin')}>Student Login</button></li> */}
      </ul>
    </nav>
  );
}

export default Navbar;