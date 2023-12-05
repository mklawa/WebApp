import React, { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const dropdownRef = useRef(null); // Initialize the ref with null

  const toggleDropdown = (event) => {
    // Stop click event from propagating to the document
    event.stopPropagation();

    const content = dropdownRef.current;
    if (content) {
      content.style.display = content.style.display === 'block' ? 'none' : 'block';
    }
  };

  const closeDropdown = () => {
    if (dropdownRef.current) {
      dropdownRef.current.style.display = 'none'; // Safely set the display to 'none'
    }
  };

  // Handle clicking outside the dropdown
  useEffect(() => {
  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !event.target.matches('.dropbtn, .dropbtn *')) {
      closeDropdown();
    }
  };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      // Clean up the event listener when the component unmounts
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // Navigation functions
  const handleLogoutClick = () => {
    closeDropdown();
    logout();
    navigate('/');
  };

  const handleSettingsClick = () => {
    closeDropdown();
    navigate('/settings');
  };

  const handleDashboardClick = () => {
    closeDropdown();
    navigate('/dashboard');
  };

  return (
    <header className="header">
      <h1>InfiniFit</h1>
      <div className="dropdown">
        <button className="dropbtn" onClick={toggleDropdown}>
          <div className="hamburger-icon">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </button>
        <div className="dropdown-content" ref={dropdownRef}>
          <button className="btn dashboardbtn" onClick={handleDashboardClick}>Dashboard</button>
          <button className="btn settingbtn" onClick={handleSettingsClick}>Settings</button>
          <button className="btn logoutbtn" onClick={handleLogoutClick}>Logout</button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
