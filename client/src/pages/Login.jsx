import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { FaUser, FaLock, FaEnvelope, FaHospital, FaStethoscope } from 'react-icons/fa';

export default function Login() {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get redirect path from URL params
  const redirectPath = searchParams.get('redirect') || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath);
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Remove /api prefix since baseURL already includes it
      const endpoint = activeTab === 'login' ? '/auth/login' : '/auth/register';

      if (activeTab === 'register' && formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        setLoading(false);
        return;
      }

      const payload = activeTab === 'login'
        ? { username: formData.username, password: formData.password }
        : { username: formData.username, email: formData.email, password: formData.password };

      const response = await api.post(endpoint, payload);

      login(response.data.user, response.data.token);
      toast.success(activeTab === 'login' ? 'Welcome back!' : 'Account created successfully!');
      // Navigate to intended destination or home
      navigate(redirectPath);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (username, password) => {
    setLoading(true);
    try {
      // Remove /api prefix since baseURL already includes it
      const response = await api.post('/auth/login', { username, password });
      login(response.data.user, response.data.token);
      toast.success('Demo login successful!');
      // Navigate to intended destination or home
      navigate(redirectPath);
    } catch (error) {
      console.error('Demo login error:', error);
      toast.error(error.response?.data?.error || 'Demo login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 min-h-[600px] border-2 border-black">

        {/* Left Side - Illustration */}
        <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-black text-yellow-400 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none"
            style={{ backgroundImage: 'url(/images/hero-molecular-pattern.png)', backgroundSize: '300px' }}>
          </div>

          <div className="relative z-10 text-center">
            <img src="/images/login-illustration.png" alt="RepurposeIQ Scientist" className="w-full max-w-sm mb-8 mx-auto object-contain" />
            <h2 className="text-3xl font-bold font-space-grotesk mb-4">Pharmaceutical Intelligence Reimagined</h2>
            <p className="font-inter text-white/90 leading-relaxed">
              Accelerate your drug repurposing research with our multi-agent AI system.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center bg-white relative">

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <span className="text-yellow-400 text-xl font-bold">R</span>
              </div>
              <h1 className="text-2xl font-bold font-space-grotesk text-black">RepurposeIQ</h1>
            </div>
            <p className="text-gray-500 font-inter text-sm">Sign in to access the platform</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-lg">
            {['login', 'register', 'demo'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-md font-semibold text-sm transition-all ${activeTab === tab
                    ? 'bg-black text-yellow-400 shadow-sm'
                    : 'text-gray-500 hover:text-black'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Forms Container */}
          <div className="space-y-6">

            {/* Login Form */}
            {activeTab === 'login' && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black flex items-center gap-2">
                    <FaUser className="text-yellow-500" /> Username
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none focus:ring-0 transition-colors font-inter"
                    placeholder="Enter your username"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black flex items-center gap-2">
                    <FaLock className="text-yellow-500" /> Password
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none focus:ring-0 transition-colors font-inter"
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-yellow-400 font-bold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? 'Signing in...' : 'Sign In'} <FaStethoscope />
                </button>
              </motion.form>
            )}

            {/* Register Form */}
            {activeTab === 'register' && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black flex items-center gap-2">
                    <FaUser className="text-yellow-500" /> Username
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none focus:ring-0 transition-colors font-inter"
                    placeholder="Choose a username"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black flex items-center gap-2">
                    <FaEnvelope className="text-yellow-500" /> Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none focus:ring-0 transition-colors font-inter"
                    placeholder="your.email@example.com"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black flex items-center gap-2">
                    <FaLock className="text-yellow-500" /> Password
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none focus:ring-0 transition-colors font-inter"
                    placeholder="Create a password"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-black flex items-center gap-2">
                    <FaLock className="text-yellow-500" /> Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full p-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none focus:ring-0 transition-colors font-inter"
                    placeholder="Confirm your password"
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-yellow-400 font-bold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? 'Creating Account...' : 'Create Account'} <FaStethoscope />
                </button>
              </motion.form>
            )}

            {/* Demo Accounts */}
            {activeTab === 'demo' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3"
              >
                {[
                  { username: 'demo', password: 'demo', role: 'Demo User', icon: '👤' },
                  { username: 'analyst', password: 'analyst123', role: 'Research Analyst', icon: '🔬' },
                  { username: 'manager', password: 'manager123', role: 'Project Manager', icon: '📊' },
                ].map((account) => (
                  <button
                    key={account.username}
                    onClick={() => handleDemoLogin(account.username, account.password)}
                    disabled={loading}
                    className="w-full text-left p-4 bg-gray-50 border-2 border-gray-200 rounded-xl hover:border-black hover:bg-yellow-50 transition-all flex items-center gap-4 group"
                  >
                    <span className="text-2xl">{account.icon}</span>
                    <div>
                      <div className="font-bold text-black group-hover:text-black">{account.role}</div>
                      <div className="text-xs text-gray-500">Username: {account.username}</div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          <div className="mt-8 text-center text-xs text-gray-400 font-inter">
            © 2024 RepurposeIQ. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
