import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './BoilerplateEditor.css';

const BoilerplateEditor = () => {
  const [exercises, setExercises] = useState([]);
  const [routineName, setRoutineName] = useState(''); // State to hold the editable routine name
  const { routineName: routeRoutineName } = useParams(); // This will match the dynamic segment of the URL
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const routineUrl = `${apiUrl}/${encodeURIComponent(routeRoutineName)}`;
    fetch(routineUrl)
      .then(response => response.json())
      .then(data => {
        setExercises(data);
      })
      .catch(error => console.error('Error:', error));
  }, [apiUrl, routeRoutineName]);

  const handleSetRepsChange = (index, type, delta) => {
    // Function to increment or decrement sets or reps
    setExercises(exercises.map((exercise, i) => {
      if (i === index) {
        return { ...exercise, [type]: exercise[type] + delta };
      }
      return exercise;
    }));
  };

const handleSaveRoutine = (callback = () => {}) => {
  const updateUrl = `${apiUrl}/update_routine/${encodeURIComponent(routeRoutineName)}`;

  fetch(updateUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ exercises }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Routine updated:', data);
    callback(); // Invoke the callback function
  })
  .catch(error => console.error('Error:', error));
};


const handleLaunchRoutine = () => {
  handleSaveRoutine(() => {
    navigate(`/${routeRoutineName}`);
  });
};

const userJson = localStorage.getItem('user');
const userObj = JSON.parse(userJson);
const userEmail = userObj.email; // 'test@test.com'
const newRoutineName = routeRoutineName.replace(userEmail, '');

  return (
    <div className="landing-page">
      <Navbar />

      <div className="routine-name-editor">
        <h2>Customize and Save</h2>
        <h3>{newRoutineName}</h3>
      </div>

      <div className="exercise-container">
        {exercises.map((exercise, index) => (
          <div key={index} className="exercise">
            <div className='exercise-header'>
              {exercise.exercise}
            </div>
            <div className="sets-reps-editor">
              <div className="sets-editor">
                <span> Sets: {exercise.sets} </span>
                <div className="buttons-vertical">
                  <button 
                    className="set-button" 
                    onClick={() => handleSetRepsChange(index, 'sets', 1)}
                  >
                    +
                  </button>
                  <button 
                    className="set-button" 
                    onClick={() => handleSetRepsChange(index, 'sets', -1)}
                  >
                    -
                  </button>
                </div>
              </div>
              <div className="reps-editor">
                <span> Reps: {exercise.reps} </span>
                <div className="buttons-vertical">
                  <button 
                    className="set-button" 
                    onClick={() => handleSetRepsChange(index, 'reps', 1)}
                  >
                    +
                  </button>
                  <button 
                    className="set-button" 
                    onClick={() => handleSetRepsChange(index, 'reps', -1)}
                  >
                    -
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
        <button className="save-button" onClick={() => handleSaveRoutine(() => navigate('/my_routines'))}>
          Save
        </button>
        <div></div>
      <button className="save-button" onClick={handleLaunchRoutine}>
        Launch and Save
      </button>
    </div>

  );
};

export default BoilerplateEditor;
