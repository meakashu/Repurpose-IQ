import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FaArrowRight, FaBrain, FaChartLine, FaLaptopMedical, FaLightbulb, FaComments, FaTachometerAlt, FaHeartbeat, FaProjectDiagram, FaBalanceScale, FaCogs, FaSmile } from 'react-icons/fa';

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // Handle navigation with auth check
  const handleNavigation = (path) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      navigate(`/login?redirect=${encodeURIComponent(path)}`);
    }
  };

  const features = [
    {
      icon: <FaBrain className="w-10 h-10 text-yellow-400" />,
      title: 'AI Chat Assistant',
      desc: 'Interact with 9 specialized AI agents for pharmaceutical intelligence and research queries',
      link: '/chat'
    },
    {
      icon: <FaHeartbeat className="w-10 h-10 text-yellow-400" />,
      title: 'Real-time Monitoring',
      desc: 'Live market insights, patent monitoring, and clinical trial tracking',
      link: '/monitoring'
    },
    {
      icon: <FaChartLine className="w-10 h-10 text-yellow-400" />,
      title: 'Analytics Dashboard',
      desc: 'Comprehensive data analytics and performance metrics in seconds',
      link: '/analytics'
    },
    {
      icon: <FaLightbulb className="w-10 h-10 text-yellow-400" />,
      title: 'Smart Insights',
      desc: 'AI-powered recommendations, predictions, and drug repurposing opportunities',
      link: '/dashboard'
    },
  ];

  const quickActions = [
    { icon: <FaComments className="w-8 h-8 text-black" />, label: 'Chat Assistant', path: '/chat' },
    { icon: <FaChartLine className="w-8 h-8 text-black" />, label: 'Analytics', path: '/analytics' },
    { icon: <FaTachometerAlt className="w-8 h-8 text-black" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FaHeartbeat className="w-8 h-8 text-black" />, label: 'Monitoring', path: '/monitoring' },
    { icon: <FaProjectDiagram className="w-8 h-8 text-black" />, label: 'Knowledge Graph', path: '/knowledge-graph' },
    { icon: <FaBalanceScale className="w-8 h-8 text-black" />, label: 'Compare', path: '/compare' },
    { icon: <FaCogs className="w-8 h-8 text-black" />, label: 'Workflows', path: '/workflows' },
    { icon: <FaSmile className="w-8 h-8 text-black" />, label: 'Sentiment', path: '/sentiment' },
  ];

  return (
    <div className="min-h-screen bg-yellow-400">
      {/* Hero Section */}
      <section className="border-b-2 border-black bg-yellow-400 relative overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'url(/images/hero-molecular-pattern.png)',
            backgroundSize: '400px',
            backgroundRepeat: 'repeat'
          }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Bold Headline */}
            <div>
              <h1 className="text-5xl lg:text-7xl font-bold text-black mb-6 font-space-grotesk leading-tight">
                ACCELERATE DRUG REPURPOSING WITH AI
              </h1>
              <p className="text-xl lg:text-2xl text-black mb-8 font-inter leading-relaxed">
                Discover hidden opportunities in pharmaceutical research. Our AI-powered platform analyzes markets, patents, and clinical trials to identify drug repurposing candidates faster than ever.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleNavigation('/chat')}
                  className="btn-medical-primary px-8 py-4 text-lg flex items-center justify-center gap-3"
                >
                  Get Started <FaArrowRight />
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="btn-medical-secondary px-8 py-4 text-lg"
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Right Side - Key Features */}
            <div className="medical-card p-8 lg:p-12 bg-white relative">
              <h3 className="text-2xl font-bold text-black mb-6 font-space-grotesk">
                Platform Capabilities
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center flex-shrink-0 p-2">
                    {/* <img src="/images/icon-ai-brain.png" alt="AI" className="w-full h-full object-contain" /> */}
                    <FaBrain className="w-8 h-8 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-black mb-2 font-space-grotesk text-lg">9 AI Agents</h4>
                    <p className="text-black text-sm font-inter">
                      Multi-agent system analyzing market, clinical, patent, and competitive data
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center flex-shrink-0 p-2">
                    {/* <img src="/images/icon-monitoring.png" alt="Monitoring" className="w-full h-full object-contain" /> */}
                    <FaHeartbeat className="w-8 h-8 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-black mb-2 font-space-grotesk text-lg">Real-Time Analysis</h4>
                    <p className="text-black text-sm font-inter">
                      Live monitoring of clinical trials, patents, and market trends
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center flex-shrink-0 p-2">
                    {/* <img src="/images/icon-analytics.png" alt="Data" className="w-full h-full object-contain" /> */}
                    <FaChartLine className="w-8 h-8 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-black mb-2 font-space-grotesk text-lg">Comprehensive Data</h4>
                    <p className="text-black text-sm font-inter">
                      Integration with pharmaceutical databases and research sources
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b-2 border-black bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4 font-space-grotesk">
              Powered by Intelligent AI Agents
            </h2>
            <p className="text-xl text-black font-inter max-w-3xl mx-auto">
              Our platform uses 9 specialized AI agents working together to provide comprehensive pharmaceutical intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              return (
                <div
                  key={idx}
                  onClick={() => handleNavigation(feature.link)}
                  className="medical-card p-6 cursor-pointer hover:-translate-y-2 transition-all group"
                >
                  <div className="w-20 h-20 bg-black rounded-lg flex items-center justify-center mb-6 mx-auto p-3 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-center text-black mb-3 font-space-grotesk">
                    {feature.title}
                  </h3>
                  <p className="text-black font-inter text-sm leading-relaxed mb-4 text-center">
                    {feature.desc}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-black font-semibold text-sm">
                    Explore <FaArrowRight />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="border-b-2 border-black bg-yellow-400">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4 font-space-grotesk">
              Everything You Need for Drug Repurposing
            </h2>
            <p className="text-xl text-black font-inter">
              Access all our tools in one integrated platform
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {quickActions.map((action, idx) => {
              return (
                <button
                  key={idx}
                  onClick={() => handleNavigation(action.path)}
                  className="medical-card p-6 text-center hover:-translate-y-2 transition-all group"
                >
                  <div className="w-16 h-16 mx-auto mb-4 p-2 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                    {action.icon}
                  </div>
                  <span className="text-black font-semibold font-inter text-sm md:text-base block">
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-yellow-400">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 font-space-grotesk">
            Experience AI-Powered Drug Repurposing
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto font-inter text-white">
            Explore our platform and discover how multi-agent AI can transform pharmaceutical intelligence and research workflows.
          </p>
          <button
            onClick={() => handleNavigation('/chat')}
            className="bg-yellow-400 text-black px-8 py-4 rounded-full text-lg font-bold hover:bg-white transition-all border-2 border-yellow-400 font-space-grotesk"
          >
            Try the Platform
          </button>
        </div>
      </section>
    </div>
  );
}
