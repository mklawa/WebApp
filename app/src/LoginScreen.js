import React, {useContext, useState} from 'react';
import './RegistrationForm.css';
import {useNavigate} from "react-router-dom";
import AuthContext from "./AuthContext";
import Navbar from "./Navbar"; // Import the CSS file


const LoginScreen = () => {

  // Initialize the form data state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loginSuccess, setSuccessMessage] = useState('');

  const { setUser } = useContext(AuthContext);

  // instantiate navigation using react router dom
  const navigate = useNavigate();


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      // Make a POST request to your Flask backend
      const response = await fetch('http://127.0.0.1:5000/login', { // Replace '/login' with your Flask login route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Handle response data
      if (response.ok) {
        // Login was successful
        console.log('Login successful:', data);
        setSuccessMessage('Login Successful!');

        // Use the email from the formData as the user identifier
        const userData = {
          email: formData.email
          // Add other user details here if your backend sends them
        };

        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData); // Update the global user state
        console.log('set successful:', userData);
        navigate('/dashboard');

      } else {
        // Handle errors (e.g., user not found, wrong password, etc.)
        console.error('Login failed:', data.message);
        // You might want to show an error message to the user
        setSuccessMessage('Login failed. Please check your email and password.');
      }
    } catch (error) {
      // Handle network errors
      console.error('Network error:', error);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (

    <div className="home-container">
      <Navbar />

    <div className="registration-form">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address:</label>
          <input
            type="email" // Use email input type for better validation
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
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
          <button type="submit" className="submit-button">
            Login
          </button>
        </div>
      </form>
      {loginSuccess && <p className="error-message">{loginSuccess}</p>}
    </div>
   </div>
  );
};

export default LoginScreen;
