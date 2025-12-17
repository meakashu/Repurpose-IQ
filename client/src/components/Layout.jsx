import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import {
  FaHome, FaComments, FaChartBar, FaBell, FaNetworkWired,
  FaBalanceScale, FaChartLine, FaCog, FaSignOutAlt, FaBars,
  FaTimes, FaLightbulb, FaCogs, FaHospital
} from 'react-icons/fa';
import Footer from './Footer';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: FaHome, label: 'Home' },
    { path: '/chat', icon: FaComments, label: 'Chat' },
    { path: '/dashboard', icon: FaChartBar, label: 'Dashboard' },
    { path: '/analytics', icon: FaChartLine, label: 'Analytics' },
    { path: '/monitoring', icon: FaBell, label: 'Monitoring' },
    { path: '/knowledge-graph', icon: FaNetworkWired, label: 'Knowledge Graph' },
    { path: '/compare', icon: FaBalanceScale, label: 'Compare' },
    { path: '/visualizations', icon: FaLightbulb, label: 'Visualizations' },
    { path: '/workflows', icon: FaCogs, label: 'Workflows' },
    { path: '/sentiment', icon: FaLightbulb, label: 'Sentiment' },
    { path: '/settings', icon: FaCog, label: 'Settings' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-yellow-400">
      {/* Mobile Header */}
      <div className="lg:hidden border-b-2 border-black bg-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <FaHospital className="text-yellow-400 text-sm" />
          </div>
          <span className="font-bold text-black font-space-grotesk">RepurposeIQ</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-black hover:bg-yellow-400 rounded-lg transition-colors"
        >
          {sidebarOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
        </button>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 medical-sidebar transition-transform duration-300 ease-in-out bg-white`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b-2 border-black hidden lg:block">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <FaHospital className="text-yellow-400 text-lg" />
                </div>
                <div>
                  <h1 className="font-bold text-black font-space-grotesk">RepurposeIQ</h1>
                  <p className="text-xs text-black opacity-70 font-dm-sans">AI Platform</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`medical-nav-item ${isActive ? 'active' : ''}`}
                      >
                        <Icon className="text-lg" />
                        <span className="font-inter">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t-2 border-black">
              <button
                onClick={handleLogout}
                className="medical-nav-item w-full text-left hover:bg-red-50"
              >
                <FaSignOutAlt className="text-lg" />
                <span className="font-inter">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-auto">
          <div className="flex-1 p-6 lg:p-8">
            {children}
          </div>

          {/* Footer */}
          <Footer />
        </main>
      </div>
    </div>
  );
}
