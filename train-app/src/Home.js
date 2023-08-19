import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [trains, setTrains] = useState([]);

  useEffect(() => {
    axios.get('/train/trains').then(response => {
      setTrains(response.data);
    });
  }, []);

  return (
    <div>
      <h1>All Trains</h1>
      <ul>
        {trains.map(train => (
          <li key={train.trainNumber}>
            <a href={`/train/${train.trainNumber}`}>{train.trainName}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
