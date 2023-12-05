import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext'; // Adjust the path as needed
import './Dashboard.css';
import Navbar from './Navbar'; // Import the Navbar component

const Dashboard = () => {
  const navigate = useNavigate(); // Hook to enable programmatic navigation

  // Function to handle clicking on 'Select Routine'
  const handleSelectRoutineClick = () => {
    navigate('/bprselection'); // Route to BPRSelection page
  };
  const handleChooseRoutineClick = () => {
    navigate('/my_routines');
  };
  const handleCreateRoutineClick = () => {
    navigate('/create_routine');
  };

  const handleGenerateRoutineClick = () => {
    navigate('/generator');
  };

  return (
    <div className="landing-page">
      <Navbar />

      <section className="hero">
        <div className="hero-content">
          <h2>Maximize Your Fitness Journey</h2>
          <p>Discover personalized workouts and achieve your goals.</p>
        </div>
      </section>

      <section className="info">

        <div className="info-block">
          <h3>Load a Saved Routine</h3>
          <button className="green-button" onClick={handleChooseRoutineClick}>Choose Routine</button>
        </div>

        <div className="info-block">
          <h3>Create a Custom Routine</h3>
          <button className="green-button" onClick={handleCreateRoutineClick}>Create Routine</button>
        </div>

        <div className="info-block">
          <h3>Choose a Boilerplate Routine</h3>
          <button className="green-button" onClick={handleSelectRoutineClick}>Select Routine</button>
        </div>

        <div className="info-block">
          <h3>Generate Workout Routine</h3>
          <button className="green-button" onClick={handleGenerateRoutineClick}>Generate Routine</button>
        </div>

      </section>

      <footer className="footer">
        <p>&copy; 2023 InfiniFit</p>
      </footer>
    </div>
  );
};

export default Dashboard;
