import { motion } from 'framer-motion';
import { usePageTransition } from '../hooks/usePageTransition';

export default function TransitionLoader() {
  const { isTransitioning } = usePageTransition();

  if (!isTransitioning) return null;

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: '100%' }}
      exit={{ width: 0 }}
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 z-[9999]"
      style={{
        boxShadow: '0 0 10px rgba(0, 102, 204, 0.5)'
      }}
    />
  );
}
