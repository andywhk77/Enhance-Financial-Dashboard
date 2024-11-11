// src/FinancialForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FinancialForm = () => {
  const [symbol, setSymbol] = useState('');
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!symbol) {
      alert('Please enter a stock symbol.');
      return;
    }
    navigate('/results', { state: { symbol, prompt } });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-purple-900 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Financial Analysis Form</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Stock Symbol (e.g., AAPL)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 mb-4"
          />
          <textarea
            placeholder="Enter a prompt for AI analysis"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 mb-4"
          />
          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default FinancialForm;
