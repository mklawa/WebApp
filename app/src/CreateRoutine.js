import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import './CreateRoutine.css';

const CreateRoutine = () => {
  const [csvData, setCsvData] = useState([]);
  const [selectedFocusArea, setSelectedFocusArea] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [routineName, setRoutineName] = useState(''); // State to hold the editable routine name
  const [exercises, setExercises] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('megaGymDataset.csv')
      .then(response => response.text())
      .then(data => {
        const rows = data.split('\n');
        const parsedData = rows.map(row => row.split(','));
        setCsvData(parsedData.slice(1));
      });
  }, []);

  const handleFocusAreaChange = (event) => {
    setSelectedFocusArea(event.target.value);
    setSelectedExercise('');
  };

  const handleExerciseChange = (event) => {
    const exercise = event.target.value;
    setSelectedExercise(exercise);
    const detailRow = csvData.find(row => row[0] === exercise);
    if (detailRow) {
      const newExercise = {
        exercise: exercise,
        sets: detailRow[5],
        reps: detailRow[6]
      };
      setExercises([...exercises, newExercise]);
    }
  };

const userJson = localStorage.getItem('user');
const userObj = JSON.parse(userJson);
const userEmail = userObj.email;
const handleContinue = () => {
  if (!routineName) {
    alert('Please enter a routine name.');
    return;
  }

  const postUrl = 'http://127.0.0.1:5000/add_routine'; // Replace with your actual backend endpoint

  fetch(postUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      routineName: routineName,
      exercises: exercises,
      userEmail: userEmail // Replace with actual user email
    }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Routine saved:', data);
    navigate(`/${userEmail}${routineName}/edit`);
  })
  .catch(error => console.error('Error:', error));
};


  const uniqueFocusAreas = Array.from(new Set(csvData.map(row => row[2]))).filter(Boolean);

  return (
    <div className="create-routine-page">
      <Navbar />
      <div className="routine-creator">
        <h2>New Routine</h2>
        <input
          className="routine-name-input" // Apply the new class here
          type="text"
          value={routineName}
          onChange={(e) => setRoutineName(e.target.value)}
          placeholder="Edit Routine Name"
          required // Make this field required
        />
        <div className="dropdown-menus">
          <select
            className="dropdown-menu"
            value={selectedFocusArea}
            onChange={handleFocusAreaChange}
          >
            <option value="">Focus Area</option>
            {uniqueFocusAreas.map((focusArea, index) => (
              <option key={index} value={focusArea}>{focusArea}</option>
            ))}
          </select>
          <select
            className="dropdown-menu"
            value={selectedExercise}
            onChange={handleExerciseChange}
          >
            <option value="">Exercises</option>
            {csvData.filter(row => row[2] === selectedFocusArea).map((row, index) => (
              <option key={index} value={row[0]}>{row[0]}</option>
            ))}
          </select>
        </div>
        <div className="exercises-list">
          {exercises.map((exercise, index) => (
            <div key={index} className="exercise-item">
              {exercise.exercise} - Sets: {exercise.sets}, Reps: {exercise.reps}
            </div>
          ))}
        </div>
        <button onClick={handleContinue} className="continue-button">Continue</button>
      </div>
    </div>
  );
};

export default CreateRoutine;
