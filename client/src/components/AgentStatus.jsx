import { motion } from 'framer-motion';
import { FaRobot, FaCheckCircle } from 'react-icons/fa';

export default function AgentStatus({ agents = [] }) {
  const allAgents = [
    { name: 'Market', icon: '📊', status: 'active' },
    { name: 'Patent', icon: '📜', status: 'active' },
    { name: 'Clinical', icon: '🔬', status: 'active' },
    { name: 'Social', icon: '💬', status: 'active' },
    { name: 'Competitor', icon: '⚔️', status: 'active' },
    { name: 'Web', icon: '🌐', status: 'active' },
    { name: 'EXIM', icon: '🚢', status: 'active' },
    { name: 'Internal', icon: '📁', status: 'active' },
    { name: 'AI', icon: '🤖', status: 'active' },
  ];

  return (
    <div className="glass-card-strong p-4 rounded-2xl">
      <div className="flex items-center gap-2 mb-3">
        <FaRobot className="text-white text-lg" />
        <h3 className="text-white font-semibold">Agent Status</h3>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {allAgents.map((agent, idx) => (
          <motion.div
            key={agent.name}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-center gap-2 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
          >
            <span>{agent.icon}</span>
            <span className="text-xs text-white/80">{agent.name}</span>
            <FaCheckCircle className="text-green-400 text-xs ml-auto" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

