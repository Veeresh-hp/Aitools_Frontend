// App.js
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// --- CONTEXT PROVIDER ---
import { LoadingProvider } from './contexts/LoadingContext'; // Make sure this path is correct
import { ThemeProvider } from './contexts/ThemeContext';

// --- STATIC COMPONENTS (Normal Imports) ---
import Footer from './components/Footer';
import ComingSoonModal from './components/ComingSoonModal';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.css';
import Sidebar from './components/Sidebar';
import MobileBottomNav from './components/MobileBottomNav';
import Favorites from './components/Favorites';
import NewsletterPopup from './components/NewsletterPopup';

import CinematicLoader from './components/CinematicLoader';

// --- LAZY-LOADED PAGE COMPONENTS ---
const Home = lazy(() => import('./components/Home'));
const Login = lazy(() => import('./components/Login'));
const Signup = lazy(() => import('./components/Signup'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));
const HistoryPage = lazy(() => import('./components/HistoryPage'));
const ResetPassword = lazy(() => import('./components/ResetPassword'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const AddTool = lazy(() => import('./components/AddTool'));
// 1. LAZY-LOAD THE USERPROFILE COMPONENT
const UserProfile = lazy(() => import('./components/UserProfile'));
const ToolDetail = lazy(() => import('./components/ToolDetail'));
const ShowcasePage = lazy(() => import('./components/ShowcasePage'));
const Upgrade = lazy(() => import('./components/Upgrade'));
const Help = lazy(() => import('./components/Help'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));


// --- LOADER COMPONENT ---
// This component will be shown while a lazy-loaded page is being fetched.
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
    {/* The path should be absolute from the 'public' folder */}
    <img src="/ailogo.gif" alt="Loading..." style={{ width: '150px' }} />
  </div>
);

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const closeModal = () => setIsModalOpen(false);

  return (
    <ThemeProvider>
      <div className="App min-h-screen flex flex-col bg-black text-white transition-colors duration-300">
        {initialLoad && <CinematicLoader onComplete={() => setInitialLoad(false)} />}
        <Router>
          <LoadingProvider>
            {!isMobile && <Sidebar />}
            <NewsletterPopup />
            <main className="flex-grow pb-24 md:pb-0">
              {/* The <Suspense> component wraps your routes.
              It shows the 'fallback' UI (your PageLoader) whenever a component inside it is not yet loaded.
            */}
              <Suspense fallback={<PageLoader />}>
                <Switch>
                  {/* Tool Detail Route - Must be before "/" route */}
                  <Route path="/tools/:category/:toolSlug" component={ToolDetail} />

                  <Route path="/" exact component={Home} />
                  <Route path="/login" component={Login} />
                  <Route path="/signup" component={Signup} />
                  <Route path="/about" component={About} />
                  <Route path="/favorites" component={Favorites} />
                  <Route path="/contact" component={Contact} />
                  <Route path="/history" component={HistoryPage} />
                  <Route path="/showcase" component={ShowcasePage} />
                  <Route path="/reset-password" component={ResetPassword} />
                  <Route path="/admin/newsletter" component={AdminDashboard} />
                  <Route path="/admin" component={AdminDashboard} />
                  <Route path="/add-tool" component={AddTool} />
                  <Route path="/upgrade" component={Upgrade} />
                  <Route path="/help" component={Help} />
                  <Route path="/privacy" component={PrivacyPolicy} />
                  <Route path="/terms" component={TermsOfService} />

                  {/* 2. CORRECTED THE ROUTE FOR THE PROFILE PAGE
                  - The path is now "/profile" to match your Header links.
                  - It now correctly points to the UserProfile component.
                */}
                  <Route path="/profile" component={UserProfile} />

                  {/* This was the old, incorrect route which I've removed: */}
                  {/* <Route path="/UserProfile" component={AdminDashboard} /> */}

                </Switch>
              </Suspense>
            </main>
            <MobileBottomNav />
            {isModalOpen && <ComingSoonModal closeModal={closeModal} />}
            <Footer />
          </LoadingProvider>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
