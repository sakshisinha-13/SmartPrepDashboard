import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrepLandingPage from './pages/PrepLandingPage';
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PrepLandingPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Router>
  );
}

export default App;
