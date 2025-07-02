import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeContext } from './contexts/ThemeContext';// Import ThemeContext
import Header from './components/Header';
import Home from './components/Home'; // Updated to use Home.js
import Footer from './components/Footer';
import ComingSoonModal from './components/ComingSoonModal';
import Login from './components/Login';
import Signup from './components/Signup';
import About from './components/About';
import Contact from './components/Contact';
import HistoryPage from './components/HistoryPage';
import ResetPassword from './components/ResetPassword';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return (
      localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode: () => setIsDarkMode(!isDarkMode) }}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <Router>
          <Header />
          <Switch>
            <Route exact path="/">
              <Home openModal={openModal} />
            </Route>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/history" component={HistoryPage} />
            <Route path="/reset-password" component={ResetPassword} />
          </Switch>
          <Footer />
          {isModalOpen && <ComingSoonModal closeModal={closeModal} />}
        </Router>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;