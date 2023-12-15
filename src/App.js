import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from './LoginPage';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" exact element={<LoginPage />} />
          <Route path="/HomePage" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
