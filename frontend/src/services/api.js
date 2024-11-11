import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const api = {
  getMarketData: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/market_data`);
      return response.data;
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  },

  getStockAnalysis: async (symbol) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/stock_analysis`, { symbol });
      return response.data;
    } catch (error) {
      console.error('Error fetching stock analysis:', error);
      throw error;
    }
  }
};