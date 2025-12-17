import { motion } from 'framer-motion';
import { FaLightbulb, FaRocket, FaSearch, FaChartBar } from 'react-icons/fa';

const quickActions = [
  { icon: FaSearch, label: 'Whitespace Analysis', query: 'Which respiratory diseases show low competition?' },
  { icon: FaChartBar, label: 'Patent Check', query: 'Check patent expiry for Sitagliptin' },
  { icon: FaRocket, label: 'Repurposing', query: 'Find repurposing opportunities for Pembrolizumab' },
  { icon: FaLightbulb, label: 'Patient Voice', query: 'What are patients saying about injectables?' },
];

export default function QuickActions({ onSelect }) {
  return (
    <div className="glass-card-strong p-4 rounded-2xl mb-4">
      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
        <FaLightbulb /> Quick Actions
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {quickActions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(action.query)}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm transition-all flex flex-col items-center gap-2"
            >
              <Icon />
              <span className="text-xs">{action.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

