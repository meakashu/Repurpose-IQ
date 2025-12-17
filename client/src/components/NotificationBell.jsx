import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell } from 'react-icons/fa';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasNew, setHasNew] = useState(false);

  useEffect(() => {
    // Simulate notifications
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setNotifications(prev => [{
          id: Date.now(),
          message: 'New market data available',
          time: 'Just now',
          read: false
        }, ...prev]);
        setHasNew(true);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => {
          setShowDropdown(!showDropdown);
          setHasNew(false);
        }}
        className="relative p-3 rounded-xl bg-white/10 backdrop-blur-lg hover:bg-white/20 transition-all"
      >
        <FaBell className="text-white text-xl" />
        {hasNew && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
          />
        )}
      </button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 glass-card-strong p-4 rounded-2xl z-50"
          >
            <h3 className="text-white font-semibold mb-3">Notifications</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-white/60 text-sm">No notifications</p>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <p className="text-white text-sm">{notif.message}</p>
                    <p className="text-white/40 text-xs mt-1">{notif.time}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

