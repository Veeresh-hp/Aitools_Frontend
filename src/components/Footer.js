import React, { useState, useRef } from 'react';
// 1. Import useLocation along with other hooks
import { Link, useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import {
  FaTwitter, FaLinkedin, FaGithub, FaDiscord, FaYoutube, FaTelegram, FaInstagram,
  FaEnvelope, FaHeart, FaArrowUp, FaTools, FaUsers, FaCode, FaLightbulb, FaShieldAlt,
  FaGlobe, FaBook, FaNewspaper, FaCheckCircle, FaSpinner
} from 'react-icons/fa';
import { motion as m, LazyMotion, domAnimation } from 'framer-motion';
import Logo from '../assets/logo.png';
import toolsData from '../data/toolsData'; // Using the same data source as Home.jsx
import 'react-toastify/dist/ReactToastify.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState('idle'); // idle, loading, success, error
  const history = useHistory();
  
  // 2. Get the current location object
  const location = useLocation();

  // 3. Define the paths where the footer should be hidden
  const noFooterPaths = ['/login', '/signup', '/history'];

  // 4. If the current path is in our list, render nothing (null)
  if (noFooterPaths.includes(location.pathname)) {
    return null;
  }

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      setSubscriptionStatus('loading');

      const apiUrl = (process.env.REACT_APP_API_URL?.trim() || 'http://localhost:5000') + '/api/newsletter/subscribe';
      
      const response = await axios.post(apiUrl, { email }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000 // 10 second timeout
      });

      if (response.data.success) {
        setIsSubscribed(true);
        setSubscriptionStatus('success');
        setEmail('');
        
        toast.success(response.data.message || 'Successfully subscribed! Check your email for confirmation. 🎉', {
          icon: '🚀'
        });
        
        // Reset status after 5 seconds
        setTimeout(() => {
          setIsSubscribed(false);
          setSubscriptionStatus('idle');
        }, 5000);
      } else {
        throw new Error(response.data.error || 'Subscription failed');
      }
      
    } catch (error) {
      setSubscriptionStatus('error');
      
      let errorMessage = 'Failed to subscribe. Please try again later.';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please check your connection and try again.';
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      toast.error(errorMessage, {
        icon: '❌'
      });
      
      // Reset error status after 3 seconds
      setTimeout(() => {
        setSubscriptionStatus('idle');
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const aiToolLinks = toolsData.slice(0, 6).map(category => ({
    name: category.name,
    href: `#${category.id}`
  }));

  const footerLinks = {
    'AI Tools': aiToolLinks,
    'Company': [
      { name: 'About Us', href: '/about', icon: FaGlobe },
      { name: 'Contact', href: '/contact', icon: FaEnvelope },
      { name: 'Blog', href: '/blog', icon: FaNewspaper },
    ],
    'Legal': [
      { name: 'Privacy Policy', href: '/privacy', icon: FaShieldAlt },
      { name: 'Terms of Service', href: '/terms', icon: FaBook },
    ]
  };

  const socialLinks = [
    { icon: FaTwitter, href: 'https://twitter.com/aitoolshub', label: 'Twitter', color: 'hover:text-blue-400' },
    { icon: FaLinkedin, href: 'https://linkedin.com/company/aitoolshub', label: 'LinkedIn', color: 'hover:text-blue-600' },
    { icon: FaGithub, href: 'https://github.com/aitoolshub', label: 'GitHub', color: 'hover:text-gray-300' },
    { icon: FaDiscord, href: 'https://discord.gg/aitoolshub', label: 'Discord', color: 'hover:text-indigo-400' },
    { icon: FaYoutube, href: 'https://youtube.com', label: 'YouTube', color: 'hover:text-red-500' },
    { icon: FaInstagram, href: 'https://instagram.com/aitoolshub', label: 'Instagram', color: 'hover:text-pink-400' },
  ];

  const handleFooterLinkClick = (href) => {
    if (href.startsWith('#')) {
      history.push(`/${href}`);
      const id = href.substring(1);
      setTimeout(() => {
        const element = document.querySelector(`[data-category="${id}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      history.push(href);
      window.scrollTo({ top: 0 });
    }
  };

  const FooterLink = ({ href, name }) => (
    <button
      onClick={() => handleFooterLinkClick(href)}
      className="group text-gray-400 hover:text-white text-sm transition-all duration-300 relative"
    >
      <span>{name}</span>
      <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full" />
    </button>
  );

  // Get button content based on subscription status
  const getButtonContent = () => {
    switch (subscriptionStatus) {
      case 'loading':
        return (
          <>
            <FaSpinner className="animate-spin" />
            <span>Subscribing...</span>
          </>
        );
      case 'success':
        return (
          <>
            <FaCheckCircle className="text-green-400" />
            <span>Subscribed!</span>
          </>
        );
      case 'error':
        return (
          <>
            <FaNewspaper />
            <span>Try Again</span>
          </>
        );
      default:
        return (
          <>
            <FaNewspaper />
            <span>Subscribe</span>
          </>
        );
    }
  };

  // The rest of your component remains the same
  return (
    <LazyMotion features={domAnimation}>
      <m.footer
        className="relative bg-gray-900/80 backdrop-blur-xl border-t border-white/10 text-white overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 w-48 h-48 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Brand Section */}
            <div className="md:col-span-2 lg:col-span-1">
              <Link to="/" onClick={() => window.scrollTo({ top: 0 })} className="flex items-center text-2xl font-extrabold mb-4">
                <img src={Logo} alt="AI Tools Hub Logo" className="w-10 h-10 mr-3 rounded-lg" />
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">AI Tools Hub</span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Discover cutting-edge AI tools to supercharge your productivity and innovation.
              </p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => (
                  <m.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3, scale: 1.1 }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-gray-400 transition-colors ${social.color}`}
                    title={social.label}
                  >
                    <social.icon />
                  </m.a>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-bold text-lg mb-6 text-white flex items-center gap-2">
                  {category}
                </h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <FooterLink href={link.href} name={link.name} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Enhanced Newsletter Section */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-16 pt-12 border-t border-white/10"
          >
            <div className="max-w-xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                <FaNewspaper className="text-blue-400" />
                Stay Updated
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Get weekly updates on the newest AI tools and industry insights. Join {process.env.REACT_APP_SUBSCRIBER_COUNT || '10,000+'} professionals staying ahead!
              </p>
              
              {/* Success Message */}
              {subscriptionStatus === 'success' && (
                <m.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-300 text-sm"
                >
                  <div className="flex items-center justify-center gap-2">
                    <FaCheckCircle className="text-green-400" />
                    <span>🎉 Welcome to the AI Tools Hub community! Check your email for confirmation.</span>
                  </div>
                </m.div>
              )}
              
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <div className="relative flex-1">
                  <input
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email" 
                    required
                    disabled={isLoading}
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      subscriptionStatus === 'error' ? 'border-red-500/50 focus:ring-red-500' : ''
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                  {subscriptionStatus === 'success' && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <FaCheckCircle className="text-green-400" />
                    </div>
                  )}
                </div>
                <m.button
                  type="submit" 
                  disabled={isLoading || subscriptionStatus === 'success'}
                  whileHover={{ scale: isLoading ? 1 : 1.05 }} 
                  whileTap={{ scale: isLoading ? 1 : 0.95 }}
                  className={`px-6 py-3 rounded-xl font-semibold shadow-lg transition-all flex items-center gap-2 min-w-[140px] justify-center ${
                    subscriptionStatus === 'success' 
                      ? 'bg-green-600/80 text-white shadow-green-500/20' 
                      : subscriptionStatus === 'error'
                      ? 'bg-red-600/80 text-white shadow-red-500/20 hover:bg-red-600'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/20 hover:shadow-blue-500/30'
                  } ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {getButtonContent()}
                </m.button>
              </form>
              
              {/* Additional Info */}
              <div className="mt-4 text-xs text-gray-500">
                <p>✨ No spam, unsubscribe anytime. We respect your privacy.</p>
              </div>
            </div>
          </m.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center sm:text-left">
              © {new Date().getFullYear()} AI Tools Hub. All Rights Reserved. Made with <FaHeart className="inline text-red-500" /> by myalltools.
            </p>
            <m.button
              onClick={scrollToTop} 
              whileHover={{ y: -3, scale: 1.1 }} 
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-blue-500/25 transition-shadow"
              title="Back to top"
            >
              <FaArrowUp />
            </m.button>
          </div>
        </div>
        
        {/* Toast Container */}
        <ToastContainer 
          position="bottom-right" 
          autoClose={5000} 
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastStyle={{
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            color: 'white'
          }}
        />
      </m.footer>
    </LazyMotion>
  );
};

export default Footer;