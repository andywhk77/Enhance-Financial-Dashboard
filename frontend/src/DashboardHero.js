import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const DashboardHero = () => (
  <div className="relative h-screen flex items-center justify-center bg-black">
    <div className="absolute inset-0 bg-gradient-to-r from-purple-800 via-violet-900 to-purple-800 opacity-50" />
    <div className="relative z-10 text-center space-y-8">
      <motion.h1 className="text-6xl font-bold text-white">Your Financial Future Reimagined</motion.h1>
      <motion.div className="flex justify-center space-x-4">
        <Link to="/form">
          <button className="px-8 py-3 bg-white rounded-full">Get Started</button>
        </Link>
        <Link to="/results">
          <button className="px-8 py-3 bg-white bg-opacity-20 rounded-full">View Results</button>
        </Link>
      </motion.div>
    </div>
  </div>
);

export default DashboardHero;
