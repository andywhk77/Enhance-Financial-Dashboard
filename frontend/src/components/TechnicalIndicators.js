import React from 'react';
import { motion } from 'framer-motion';

const TechnicalIndicators = ({ data }) => {
  const indicators = [
    { name: '20-Day MA', value: data.ma20, color: 'text-green-400' },
    { name: '50-Day MA', value: data.ma50, color: 'text-red-400' },
    { name: 'RSI', value: data.rsi.toFixed(2), color: 'text-blue-400' },
    { name: 'MACD', value: data.macd.toFixed(2), color: 'text-purple-400' },
    { name: 'Signal Line', value: data.signalLine.toFixed(2), color: 'text-yellow-400' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {indicators.map((indicator, index) => (
        <motion.div
          key={indicator.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-800 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-gray-400">{indicator.name}</h3>
          <p className={`text-2xl font-bold mt-2 ${indicator.color}`}>
            {indicator.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default TechnicalIndicators;