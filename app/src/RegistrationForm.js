import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistrationForm.css'; // Import the CSS file

const securityQuestions = {
  1: "What city were you born in?",
  2: "What was the name of your first pet?",
  3: "What's your mother's maiden name?",
  4: "What high school did you attend?",
  5: "What year did you enter college?"
};


const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: '',
    fitnessLevel: '',
    workoutDuration: '', 
    focusArea: '' 
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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simplified regex for example purposes
    if (!emailRegex.test(formData.email)) {
      // Set an error state for email
      newErrors.email = 'Please enter a valid email address.';
    }

        // Password match validation
    if (formData.password !== formData.confirmPassword) {
      // Set an error state for password confirmation
      newErrors.confirmPassword = 'Password and confirmation do not match.';
    }

    // If there are any errors, set them in the state and don't submit the form
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop the form submission
    }


    // If there are no errors, continue with form submission
    fetch('http://127.0.0.1:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        securityQuestion: formData.securityQuestion,
        securityAnswer: formData.securityAnswer,
        fitnessLevel: formData.fitnessLevel,
        workoutDuration: formData.workoutDuration,
        focusArea: formData.focusArea
      }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      return response.json();
    })
    .then(data => {
      if (data.message) {
        alert(data.message);
        navigate('/login'); // Redirect to the login page on successful registration
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to register. Please try again.');
    });
  };

  return (
    <div className="home-container">
      <header className="header">
        <a href="/" style={{ textDecoration: 'none' }}>
         <h1 className="welcome-text">InfiniFit</h1>
        </a>
        {/* Other header elements like menu if needed */}
      </header>
    <div className="registration-form">
      <h1>Registration Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address:</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
        </div>
        <div className="form-group">
          <label>Security Question:</label>
          <select
            name="securityQuestion"
            value={formData.securityQuestion}
            onChange={handleChange}
            required
          >
            <option value="">Select a question...</option>
            {Object.entries(securityQuestions).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Answer To Security Question:</label>
          <input
            type="text"
            name="securityAnswer"
            value={formData.securityAnswer}
            onChange={handleChange}
            required
          />
        </div>


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
        <button type="submit">Register</button>
      </form>
    </div>
  </div>
  );
};



export default RegistrationForm;