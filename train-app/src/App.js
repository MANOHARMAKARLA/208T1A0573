import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import TrainDetails from './TrainDetails';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/train/:trainNumber" component={TrainDetails} />
      </Switch>
    </Router>
  );
}

export default App;
