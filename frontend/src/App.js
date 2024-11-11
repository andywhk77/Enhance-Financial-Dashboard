import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardHero from './DashboardHero';
import FinancialForm from './FinancialForm';
import ResultsPage from './ResultsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardHero />} />
        <Route path="/form" element={<FinancialForm />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
