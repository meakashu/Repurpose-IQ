import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook for Swup-like page transitions
 * Provides transition state and utilities
 */
export function usePageTransition() {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevPath, setPrevPath] = useState(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPath) {
      setIsTransitioning(true);
      const newPath = location.pathname;
      setPrevPath(newPath);
      
      // Reset transition state after animation completes
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 400); // Match transition duration

      return () => clearTimeout(timer);
    }
  }, [location.pathname, prevPath]);

  const getTransitionDirection = () => {
    // Simple heuristic: determine direction based on route depth
    const currentDepth = location.pathname.split('/').filter(Boolean).length;
    const prevDepth = prevPath.split('/').filter(Boolean).length;
    
    if (currentDepth > prevDepth) return 'forward';
    if (currentDepth < prevDepth) return 'backward';
    return 'none';
  };

  return {
    isTransitioning,
    location,
    direction: getTransitionDirection()
  };
}
