import { motion } from 'framer-motion';
import { FaRocket, FaBrain, FaChartLine, FaLightbulb } from 'react-icons/fa';

export default function WelcomeScreen({ onGetStarted }) {
  const features = [
    { icon: FaBrain, title: '9 AI Agents', desc: 'Specialized intelligence for every need' },
    { icon: FaChartLine, title: 'Real-time Data', desc: 'Live market and patent insights' },
    { icon: FaRocket, title: 'Fast Analysis', desc: 'Get answers in seconds' },
    { icon: FaLightbulb, title: 'Smart Insights', desc: 'AI-powered recommendations' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-12"
    >
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-poppins font-bold gradient-text mb-4 neon-glow"
      >
        Welcome to RepurposeIQ
      </motion.h2>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-white/80 text-lg mb-8 max-w-2xl mx-auto"
      >
        Your intelligent assistant for drug repurposing, pharmaceutical strategy, and market intelligence.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-card-strong p-6 rounded-2xl"
            >
              <Icon className="text-4xl text-white mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-white/70 text-sm">{feature.desc}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onGetStarted}
        className="btn-primary px-8 py-4 text-lg flex items-center gap-2 mx-auto"
      >
        <FaRocket /> Get Started
      </motion.button>
    </motion.div>
  );
}

