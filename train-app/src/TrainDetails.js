import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function TrainDetails() {
  const { trainNumber } = useParams();
  const [trainDetails, setTrainDetails] = useState(null);

  useEffect(() => {
    axios.get(`/train/trains/${trainNumber}`).then(response => {
      setTrainDetails(response.data);
    });
  }, [trainNumber]);

  if (!trainDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Train Details</h1>
      <p>Train Name: {trainDetails.trainName}</p>
      {/* Display other details */}
    </div>
  );
}

export default TrainDetails;
