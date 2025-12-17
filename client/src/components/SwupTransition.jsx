import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Swup-like transition wrapper for React Router
export default function SwupTransition({ children, className = '' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const containerRef = useRef(null);

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const transitionVariants = {
    initial: {
      opacity: 0,
      y: 20,
      filter: 'blur(10px)'
    },
    animate: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      filter: 'blur(10px)',
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        ref={containerRef}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={transitionVariants}
        className={`swup-transition ${className}`}
        onAnimationStart={() => setIsTransitioning(true)}
        onAnimationComplete={() => setIsTransitioning(false)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Hook to programmatically navigate with transition
export function useSwupNavigate() {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const swupNavigate = (to, options = {}) => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate(to, options);
      setTimeout(() => setIsTransitioning(false), 500);
    }, 100);
  };

  return { swupNavigate, isTransitioning };
}
