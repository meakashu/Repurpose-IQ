import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

export default function StatsCard({ icon, label, value, delta, trend = 'up', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay }}
      className="kpi-card animated-card"
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-3xl">{icon}</span>
          {trend === 'up' ? (
            <FaArrowUp className="text-green-400" />
          ) : (
            <FaArrowDown className="text-red-400" />
          )}
        </div>
        <div className="text-sm text-white/70 font-medium mb-2">{label}</div>
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        <div className={`text-sm flex items-center gap-1 ${
          trend === 'up' ? 'text-green-300' : 'text-red-300'
        }`}>
          {trend === 'up' ? '↑' : '↓'} {delta}
        </div>
      </div>
    </motion.div>
  );
}

