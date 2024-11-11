import React from 'react';
import { motion } from 'framer-motion';

const MarketAlerts = ({ alerts }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mb-8"
    >
      <h2 className="text-2xl font-bold mb-4">Market Alerts</h2>
      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="alert-card"
          >
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full ${
                alert.type === 'PRICE_MOVE' 
                  ? (alert.severity === 'high' ? 'bg-red-400' : 'bg-yellow-400')
                  : 'bg-blue-400'
              } mr-3`} />
              <div>
                <p className="font-medium">{alert.message}</p>
                <p className="text-sm text-gray-400">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MarketAlerts;