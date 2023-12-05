import React, { useState } from 'react';
import Navbar from './Navbar';
import './Settings.css';
import {useNavigate} from "react-router-dom";


const Settings = () => {
  // States to manage display and edit modes
  const [editMode, setEditMode] = useState({
    fitnessLevel: false,
    focusArea: false,
    workoutDuration: false
  });
  const userJson = localStorage.getItem('user');
  const userObj = JSON.parse(userJson);
  const userEmail = userObj.email;
  // Placeholder state for user settings
  const [userSettings, setUserSettings] = useState({
    userEmail: userEmail,
    fitnessLevel: '(current fitness level)',
    focusArea: '(current focus area)',
    workoutDuration: '(current workout duration)'
  });
  const navigate = useNavigate();

  // Handle edit mode toggle
  const toggleEdit = (field) => {
    setEditMode({ ...editMode, [field]: !editMode[field] });
  };
  // Error for negative workoutDuration
  const [errorMessages, setErrorMessages] = useState({
    workoutDuration: ''
  });
  

  // Handle changes in the edit form and exit edit mode
  const handleChange = (e) => {
    if (e.target.name === 'workoutDuration') {
      const value = e.target.value;
      if (!/^\d*$/.test(value)) {
        // Set error message and prevent state update
        setErrorMessages({ ...errorMessages, workoutDuration: 'Please enter a positive number.' });
        return;
      } else {
        // Clear error message when valid input is entered
        setErrorMessages({ ...errorMessages, workoutDuration: '' });
      }
    }
    setUserSettings({ ...userSettings, [e.target.name]: e.target.value });
  };

  // Handle exiting edit mode when clicking outside
  const handleBlur = (e) => {
    toggleEdit(e.target.name);
  };
  const handleUpdateSettings = () => {
    const updateUrl = 'http://127.0.0.1:5000/update_settings';

    fetch(updateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userSettings),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Settings updated:', data);
      // Additional actions after successful update (e.g., notification to user)
      navigate('/'); // Navigate to home page after successful update

    })
    .catch(error => console.error('Error:', error));
  };

  return (
    <div className="landing-page">
      <Navbar />

      <section className="settings-content">
        <h2>Fitness Settings</h2>

        {/* Fitness Level */}
        <div className="setting-item">
          {editMode.fitnessLevel ? (
            <select
              name="fitnessLevel"
              value={userSettings.fitnessLevel}
              onChange={handleChange}
              onBlur={handleBlur}
              autoFocus
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
            </select>
          ) : (
            <p onClick={() => toggleEdit('fitnessLevel')}>{userSettings.fitnessLevel}</p>
          )}
        </div>

        {/* Focus Area */}
        <div className="setting-item">
          {editMode.focusArea ? (
            <select
              name="focusArea"
              value={userSettings.focusArea}
              onChange={handleChange}
              onBlur={handleBlur}
              autoFocus
            >
              <option value="full body">Full Body</option>
              <option value="abductors">Abductors</option>
              <option value="adductors">Adductors</option>
              <option value="biceps">Biceps</option>
              <option value="calves">Calves</option>
              <option value="chest">Chest</option>
              <option value="core">Core</option>
              <option value="glutes">Glutes</option>
              <option value="hamstrings">Hamstrings</option>
              <option value="lats">Lats</option>
              <option value="lower back">Lower Back</option>
              <option value="middle back">Middle Back</option>
              <option value="neck">Neck</option>
              <option value="quadriceps">Quadriceps</option>
              <option value="shoulders">Shoulders</option>
              <option value="triceps">Triceps</option>
            </select>
          ) : (
            <p onClick={() => toggleEdit('focusArea')}>{userSettings.focusArea}</p>
          )}
        </div>

        {/* Workout Time */}
        <div className="setting-item">
          {editMode.workoutDuration ? (
            <>
            <input
              type="number"
              name="workoutDuration"
              value={userSettings.workoutDuration}
              onChange={handleChange}
              onBlur={handleBlur}
              autoFocus
              min = "0"
            />
            {errorMessages.workoutDuration && <div className="error-message">{errorMessages.workoutDuration}</div>}
            </>
          ) : (
            <p onClick={() => toggleEdit('workoutDuration')}>{userSettings.workoutDuration}</p>
          )}
        </div>

      </section>
    <button onClick={handleUpdateSettings} className="save-settings-button">
      Save Changes
    </button>

    </div>
  );
};

export default Settings;
