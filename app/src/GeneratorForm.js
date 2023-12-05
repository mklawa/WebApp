import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GeneratorForm.css';
import Navbar from "./Navbar"; // Import the CSS file


const GeneratorForm = () => {
  const [formData, setFormData] = useState({
    fitnessLevel: '',
    focusArea: '',
    workoutDuration: '',
    routine_name: ''
  });

  const [errors, setErrors] = useState({});

  // instantiate navigation using react router dom
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Start with an empty errors object
    let newErrors = {};

    // If there are any errors, set them in the state and don't submit the form
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop the form submission
    }

    const userJson = localStorage.getItem('user');
    const userObj = JSON.parse(userJson);
    const userEmail = userObj.email;

    // If there are no errors, continue with form submission
    fetch('http://127.0.0.1:5000/generator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_email: userEmail,
        fitnessLevel: formData.fitnessLevel,
        workoutDuration: formData.workoutDuration,
        focusArea: formData.focusArea,
        routineName: formData.routine_name
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Generation failed');
      }
      return response.json();
    })
    .then(data => {
      if (data.message) {
        alert(data.message);
        navigate('/my_routines'); // Redirect to the login page on successful registration
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('No exercises found, please adjust options.');
    });
  };

  return (
    <div className="home-container">
      <Navbar />

    <div className="registration-form">
      <h1>Generation Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Current Fitness Level:</label>
          <select
            name="fitnessLevel"
            value={formData.fitnessLevel}
            onChange={handleChange}
            required
          >
            <option value="">Select your fitness level...</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
          </select>
        </div>

        <div className="form-group">
          <label>Focus Area:</label>
          <select
            name="focusArea"
            value={formData.focusArea}
            onChange={handleChange}
            required
          >
            <option value="">Select a focus area...</option>
            <option value="full_body">Full Body</option>
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
        </div>

        <div className="form-group">
          <label>Workout Duration (minutes):</label>
          <input
            type="Integer"
            name="workoutDuration"
            value={formData.workoutDuration}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Name Your Routine</label>
          <input
            name="routine_name"
            type="text"
            value={formData.routine_name}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Generate Routine</button>
      </form>
    </div>
  </div>
  );
};



export default GeneratorForm;