// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Footer from './components/Footer';
import ComingSoonModal from './components/ComingSoonModal';
import Login from './components/Login';
import Signup from './components/Signup';
import About from './components/About';
import Contact from './components/Contact';
import HistoryPage from './components/HistoryPage';
import ResetPassword from './components/ResetPassword';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AdminDashboard from './components/AdminDashboard';
import './index.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="App min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Router>
        <Header openModal={openModal} />
        <main className="flex-grow">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/history" component={HistoryPage} />
            <Route path="/reset-password" component={ResetPassword} />
            <Route path="/admin/newsletter" component={AdminDashboard} />
          </Switch>
        </main>
        {isModalOpen && <ComingSoonModal closeModal={closeModal} />}
        <Footer />
      </Router>
    </div>
  );
}

export default App;