import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext'; // Adjust the path as needed
import './Home.css'; // Importing the CSS file for styles


function Home() {

  const { user } = useContext(AuthContext); // Access the user from AuthContext
  const navigate = useNavigate(); // Hook from React Router for navigation

  // Check if user is authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="home-container">
      <header className="header">
        <h1 className="welcome-text">InfiniFit</h1>
        {/* Other header elements like menu if needed */}
      </header>
      <div>
        <Link to="/register" className="sign-up-button">Register</Link>
      </div>
      <div>
        <Link to="/login" className="sign-up-button">Log In</Link>
      </div>
    </div>
  );
}

export default Home;
