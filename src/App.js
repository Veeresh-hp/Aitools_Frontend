// App.js
import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// --- CONTEXT PROVIDER ---
import { LoadingProvider } from './contexts/LoadingContext'; // Make sure this path is correct

// --- STATIC COMPONENTS (Normal Imports) ---
import Header from './components/Header';
import Footer from './components/Footer';
import ComingSoonModal from './components/ComingSoonModal';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './index.css';

// --- LAZY-LOADED PAGE COMPONENTS ---
const Home = lazy(() => import('./components/Home'));
const Login = lazy(() => import('./components/Login'));
const Signup = lazy(() => import('./components/Signup'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));
const HistoryPage = lazy(() => import('./components/HistoryPage'));
const ResetPassword = lazy(() => import('./components/ResetPassword'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
// 1. LAZY-LOAD THE USERPROFILE COMPONENT
const UserProfile = lazy(() => import('./components/UserProfile'));


// --- LOADER COMPONENT ---
// This component will be shown while a lazy-loaded page is being fetched.
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
    {/* The path should be absolute from the 'public' folder */}
    <img src="/ailogo.gif" alt="Loading..." style={{ width: '150px' }}/>
  </div>
);

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="App min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Router>
        <LoadingProvider>
          <Header openModal={openModal} />
          <main className="flex-grow">
            {/* The <Suspense> component wraps your routes.
              It shows the 'fallback' UI (your PageLoader) whenever a component inside it is not yet loaded.
            */}
            <Suspense fallback={<PageLoader />}>
              <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/signup" component={Signup} />
                <Route path="/about" component={About} />
                <Route path="/contact" component={Contact} />
                <Route path="/history" component={HistoryPage} />
                <Route path="/reset-password" component={ResetPassword} />
                <Route path="/admin/newsletter" component={AdminDashboard} />

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
          {isModalOpen && <ComingSoonModal closeModal={closeModal} />}
          <Footer />
        </LoadingProvider>
      </Router>
    </div>
  );
}

export default App;
