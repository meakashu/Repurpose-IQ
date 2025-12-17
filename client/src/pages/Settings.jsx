import { useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';
import { 
  FaPalette, FaMoon, FaSun, FaAdjust, FaFlask, FaPaintBrush,
  FaUser, FaBell, FaShieldAlt, FaDatabase, FaCog, FaSave,
  FaCheckCircle, FaTimesCircle, FaInfoCircle
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../utils/api';

export default function Settings() {
  const { currentTheme, themes, setTheme } = useThemeStore();
  const { user } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });
  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: 'MM/DD/YYYY',
  });

  const handleThemeChange = (themeName) => {
    setTheme(themeName);
    toast.success(`Theme changed to ${themes[themeName].name}`);
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      // Save preferences to backend
      await api.post('/user/preferences', {
        notifications,
        preferences,
      });
      toast.success('Preferences saved successfully!');
    } catch (error) {
      toast.error('Failed to save preferences');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const themeIcons = {
    default: FaPaintBrush,
    dark: FaMoon,
    light: FaSun,
    medical: FaFlask,
    purple: FaPalette,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="medical-card">
        <div className="medical-card-header">
          <div className="flex items-center gap-3">
            <FaCog className="text-2xl" />
            <h1 className="text-2xl font-bold font-space-grotesk">Settings</h1>
          </div>
        </div>
        <div className="medical-card-body">
          <div className="flex items-center gap-4 p-4 bg-gray-50 border-2 border-black rounded-lg">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-yellow-400">
              <FaUser className="text-2xl" />
            </div>
            <div>
              <div className="font-bold text-lg text-black font-dm-sans">{user?.username || 'User'}</div>
              <div className="text-sm text-gray-700 capitalize font-inter">{user?.role || 'User'}</div>
              <div className="text-xs text-gray-500 font-inter mt-1">{user?.email || 'No email'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Selection */}
      <div className="medical-card">
        <div className="medical-card-header">
          <div className="flex items-center gap-3">
            <FaPalette className="text-xl" />
            <h2 className="text-xl font-bold font-space-grotesk">Theme Settings</h2>
          </div>
        </div>
        <div className="medical-card-body">
          <p className="text-sm text-gray-700 mb-6 font-inter">
            Choose your preferred color theme. Changes apply immediately.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(themes).map(([key, theme]) => {
              const Icon = themeIcons[key] || FaAdjust;
              const isActive = currentTheme === key;
              return (
                <motion.button
                  key={key}
                  onClick={() => handleThemeChange(key)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative p-6 border-2 rounded-xl transition-all ${
                    isActive
                      ? 'border-black bg-black text-yellow-400 shadow-lg'
                      : 'border-gray-300 bg-white text-black hover:border-black hover:shadow-md'
                  }`}
                >
                  {isActive && (
                    <div className="absolute top-2 right-2">
                      <FaCheckCircle className="text-yellow-400" />
                    </div>
                  )}
                  <div className="flex flex-col items-center gap-3">
                    <Icon className="text-3xl" />
                    <div className="font-semibold font-dm-sans">{theme.name}</div>
                    <div className="flex gap-2 mt-2">
                      <div
                        className="w-8 h-8 rounded border-2 border-gray-300"
                        style={{ backgroundColor: theme.primary }}
                      />
                      <div
                        className="w-8 h-8 rounded border-2 border-gray-300"
                        style={{ backgroundColor: theme.secondary }}
                      />
                      <div
                        className="w-8 h-8 rounded border-2 border-gray-300"
                        style={{ backgroundColor: theme.bg }}
                      />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="medical-card">
        <div className="medical-card-header">
          <div className="flex items-center gap-3">
            <FaBell className="text-xl" />
            <h2 className="text-xl font-bold font-space-grotesk">Notifications</h2>
          </div>
        </div>
        <div className="medical-card-body space-y-4">
          {[
            { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
            { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications' },
            { key: 'sms', label: 'SMS Notifications', desc: 'Text message alerts' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg">
              <div>
                <div className="font-semibold text-black font-dm-sans">{item.label}</div>
                <div className="text-sm text-gray-600 font-inter">{item.desc}</div>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  notifications[item.key] ? 'bg-black' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    notifications[item.key] ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="medical-card">
        <div className="medical-card-header">
          <div className="flex items-center gap-3">
            <FaUser className="text-xl" />
            <h2 className="text-xl font-bold font-space-grotesk">Preferences</h2>
          </div>
        </div>
        <div className="medical-card-body space-y-4">
          <div>
            <label className="block text-sm font-semibold text-black mb-2 font-dm-sans">Language</label>
            <select
              value={preferences.language}
              onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
              className="w-full p-3 border-2 border-black rounded-lg bg-white text-black font-inter"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-2 font-dm-sans">Timezone</label>
            <select
              value={preferences.timezone}
              onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
              className="w-full p-3 border-2 border-black rounded-lg bg-white text-black font-inter"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-black mb-2 font-dm-sans">Date Format</label>
            <select
              value={preferences.dateFormat}
              onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
              className="w-full p-3 border-2 border-black rounded-lg bg-white text-black font-inter"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security & Privacy */}
      <div className="medical-card">
        <div className="medical-card-header">
          <div className="flex items-center gap-3">
            <FaShieldAlt className="text-xl" />
            <h2 className="text-xl font-bold font-space-grotesk">Security & Privacy</h2>
          </div>
        </div>
        <div className="medical-card-body space-y-4">
          <div className="p-4 border-2 border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-black font-dm-sans">Two-Factor Authentication</div>
                <div className="text-sm text-gray-600 font-inter">Add an extra layer of security</div>
              </div>
              <button className="btn-medical-secondary px-4 py-2 text-sm">Enable</button>
            </div>
          </div>
          <div className="p-4 border-2 border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-black font-dm-sans">Data Export</div>
                <div className="text-sm text-gray-600 font-inter">Download your data</div>
              </div>
              <button className="btn-medical-secondary px-4 py-2 text-sm">Export</button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleSavePreferences}
          disabled={saving}
          className="btn-medical-primary px-8 py-3 flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="medical-spinner"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <FaSave />
              <span>Save Preferences</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

