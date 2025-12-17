import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Compare from './pages/Compare';
import Analytics from './pages/Analytics';
import Monitoring from './pages/Monitoring';
import KnowledgeGraph from './pages/KnowledgeGraph';
import Visualizations from './pages/Visualizations';
import Workflows from './pages/Workflows';
import Sentiment from './pages/Sentiment';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import PublicHeader from './components/PublicHeader';
import Footer from './components/Footer';
import { SpeechRecognitionProvider } from './components/SpeechRecognitionProvider';
import PageTransition from './components/PageTransition';
import TransitionLoader from './components/TransitionLoader';
// Static pages
import AboutUs from './pages/AboutUs';
import Disclaimer from './pages/Disclaimer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import ApiDocs from './pages/ApiDocs';
import Team from './pages/Team';
import Careers from './pages/Careers';
import CookiePolicy from './pages/CookiePolicy';
import CaseStudies from './pages/CaseStudies';

// Public page wrapper with header and footer
function PublicPageWrapper({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuthStore();

  const createLoginRedirect = (path) => `/login?redirect=${encodeURIComponent(path)}`;

  return (
    <Routes>
      {/* Login Page */}
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/chat" />} />

      {/* Public Routes - No authentication required */}
      <Route path="/" element={<PublicPageWrapper><Home /></PublicPageWrapper>} />
      <Route path="/about" element={<PublicPageWrapper><AboutUs /></PublicPageWrapper>} />
      <Route path="/disclaimer" element={<PublicPageWrapper><Disclaimer /></PublicPageWrapper>} />
      <Route path="/privacy" element={<PublicPageWrapper><PrivacyPolicy /></PublicPageWrapper>} />
      <Route path="/terms" element={<PublicPageWrapper><TermsOfService /></PublicPageWrapper>} />
      <Route path="/cookies" element={<PublicPageWrapper><CookiePolicy /></PublicPageWrapper>} />
      <Route path="/contact" element={<PublicPageWrapper><Contact /></PublicPageWrapper>} />
      <Route path="/blog" element={<PublicPageWrapper><Blog /></PublicPageWrapper>} />
      <Route path="/blog/:slug" element={<PublicPageWrapper><BlogPost /></PublicPageWrapper>} />
      <Route path="/features" element={<PublicPageWrapper><Features /></PublicPageWrapper>} />
      <Route path="/pricing" element={<PublicPageWrapper><Pricing /></PublicPageWrapper>} />
      <Route path="/api-docs" element={<PublicPageWrapper><ApiDocs /></PublicPageWrapper>} />
      <Route path="/team" element={<PublicPageWrapper><Team /></PublicPageWrapper>} />
      <Route path="/careers" element={<PublicPageWrapper><Careers /></PublicPageWrapper>} />
      <Route path="/case-studies" element={<PublicPageWrapper><CaseStudies /></PublicPageWrapper>} />

      {/* Protected Routes - Authentication required */}
      <Route path="/chat" element={isAuthenticated ? <Layout><Chat /></Layout> : <Navigate to={createLoginRedirect('/chat')} />} />
      <Route path="/dashboard" element={isAuthenticated ? <Layout><Dashboard /></Layout> : <Navigate to={createLoginRedirect('/dashboard')} />} />
      <Route path="/compare" element={isAuthenticated ? <Layout><Compare /></Layout> : <Navigate to={createLoginRedirect('/compare')} />} />
      <Route path="/analytics" element={isAuthenticated ? <Layout><Analytics /></Layout> : <Navigate to={createLoginRedirect('/analytics')} />} />
      <Route path="/monitoring" element={isAuthenticated ? <Layout><Monitoring /></Layout> : <Navigate to={createLoginRedirect('/monitoring')} />} />
      <Route path="/knowledge-graph" element={isAuthenticated ? <Layout><KnowledgeGraph /></Layout> : <Navigate to={createLoginRedirect('/knowledge-graph')} />} />
      <Route path="/visualizations" element={isAuthenticated ? <Layout><Visualizations /></Layout> : <Navigate to={createLoginRedirect('/visualizations')} />} />
      <Route path="/workflows" element={isAuthenticated ? <Layout><Workflows /></Layout> : <Navigate to={createLoginRedirect('/workflows')} />} />
      <Route path="/sentiment" element={isAuthenticated ? <Layout><Sentiment /></Layout> : <Navigate to={createLoginRedirect('/sentiment')} />} />
      <Route path="/settings" element={isAuthenticated ? <Layout><Settings /></Layout> : <Navigate to={createLoginRedirect('/settings')} />} />
    </Routes>
  );
}

function App() {
  return (
    <SpeechRecognitionProvider>
      <div className="relative z-10">
        <Router>
          <TransitionLoader />
          <PageTransition mode="fade">
            <AppRoutes />
          </PageTransition>
        </Router>
      </div>
    </SpeechRecognitionProvider>
  );
}

export default App;

