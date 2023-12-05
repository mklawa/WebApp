import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import './MyRoutines.css';
import {useNavigate} from "react-router-dom";

const MyRoutines = () => {
  const [routines, setRoutines] = useState({});

useEffect(() => {
  const userJson = localStorage.getItem('user');
  const userEmail = userJson ? JSON.parse(userJson).email : null;

  if (userEmail) {
  fetch(`http://localhost:5000/api/routines?userEmail=${userEmail}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const routinesMap = {};
        data.forEach(routine => {
          routinesMap[routine.id] = { name: routine.name };
        });
        setRoutines(routinesMap);
      })
      .catch(error => {
        console.error('Error fetching routines:', error);
      });
  } else {
    console.error('User email not found in local storage');
  }
}, []);



const navigate = useNavigate();
const selectRoutine = (routineId) => {
  // Assuming routineId is the routine name
  const userEmail = JSON.parse(localStorage.getItem('user')).email;
  const routineIdentifier = userEmail + routineId;
  navigate(`/${routineIdentifier}/edit`);
};

  return (
    <div className="my-routines-page">
      <Navbar />
      <section className="routines-content">
        <h2>My Routines</h2>
        <p>View and launch saved routines here.</p>
      </section>
        <section className="info">
          {Object.keys(routines).map(routineId => (
            <button key={routineId} className="routine-button" onClick={() => selectRoutine(routineId)}>
              {routines[routineId].name}
            </button>
          ))}
        </section>
    </div>
  );
};

export default MyRoutines;
