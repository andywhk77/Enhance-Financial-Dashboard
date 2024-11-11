// src/components/ResultsPage.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ResultsPage = () => {
  const { state } = useLocation();
  const { symbol, prompt } = state || {}; // Destructure state with fallback in case it's null
  const [data, setData] = useState(null);
  const [aiText, setAiText] = useState('');
  const [stiData, setStiData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch stock data
  useEffect(() => {
    if (symbol) {
      fetch(`http://127.0.0.1:5000/api/financial_data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.error) {
            setError(result.error);
          } else {
            setData(result);
          }
        })
        .catch((error) => {
          console.error('Error fetching financial data:', error);
          setError('Failed to fetch financial data');
        });
    }
  }, [symbol]);

  // Fetch AI-generated text
  useEffect(() => {
    if (prompt) {
      fetch(`http://127.0.0.1:5000/api/generate_text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.error) {
            setError(result.error);
          } else {
            setAiText(result.generated_text);
          }
        })
        .catch((error) => {
          console.error('Error fetching AI analysis:', error);
          setError('Failed to fetch AI analysis');
        });
    }
  }, [prompt]);

  // Fetch STI data
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/sti_data`)
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          setError(result.error);
        } else {
          setStiData(result);
        }
      })
      .catch((error) => {
        console.error('Error fetching STI data:', error);
        setError('Failed to fetch STI data');
      });
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center">Results Page</h1>

      {/* STI Data Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">STI Data</h2>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          stiData && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <p>STI Index Value: <span className="font-bold">{stiData?.sti_value}</span></p>
              <p>STI Change: <span className={`font-bold ${stiData?.sti_change.includes('-') ? 'text-red-500' : 'text-green-500'}`}>{stiData?.sti_change}</span></p>
            </div>
          )
        )}
      </div>

      {/* Financial Data Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Financial Data for {symbol || 'N/A'}</h2>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          data && data.prices ? (
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg mb-2">Stock Prices:</h3>
              <ul className="list-disc ml-6">
                {data.prices.map((price, index) => (
                  <li key={index}>{data.dates[index]}: ${price.toFixed(2)}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p>Loading stock data...</p>
          )
        )}
      </div>

      {/* AI Analysis Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">AI Analysis</h2>
        <div className="bg-gray-800 p-4 rounded-lg">
          <p>{aiText || 'Loading AI analysis...'}</p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
          onClick={() => window.history.back()}
        >
          Back
        </button>
        <button
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default ResultsPage;
