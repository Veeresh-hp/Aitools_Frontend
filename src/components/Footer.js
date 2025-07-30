import React, { useState, useRef } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import {
  FaTwitter, FaLinkedin, FaGithub, FaDiscord, FaYoutube, FaTelegram, FaInstagram,
  FaEnvelope, FaHeart, FaArrowUp, FaTools, FaUsers, FaCode, FaLightbulb, FaShieldAlt,
  FaGlobe, FaBook, FaNewspaper, FaSpinner, FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import { motion as m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import Logo from '../assets/logo.png';
import toolsData from '../data/toolsData';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [expandedSections, setExpandedSections] = useState({});
  const history = useHistory();
  const location = useLocation();

  // Pages where footer should be hidden
  const hiddenPages = ['/signup', '/login', '/history', '/sign-up', '/log-in'];
  
  const shouldHideFooter = hiddenPages.some(page => 
    location.pathname === page || location.pathname.startsWith(page + '/')
  );

  if (shouldHideFooter) {
    return null;
  }

  const API_URL = process.env.REACT_APP_API_URL || 'https://your-backend-url.com';

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage('Please enter your email address');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address');
      setMessageType('error');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubscribed(true);
        setMessage(data.message || 'Successfully subscribed! Check your email.');
        setMessageType('success');
        setEmail('');
        setTimeout(() => {
          setIsSubscribed(false);
          setMessage('');
        }, 5000);
      } else {
        setMessage(data.error || 'Failed to subscribe. Please try again.');
        setMessageType('error');
        setTimeout(() => setMessage(''), 4000);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setMessage('Network error. Please check your connection and try again.');
      setMessageType('error');
      setTimeout(() => setMessage(''), 4000);
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
    { icon: FaTwitter, label: 'Twitter', color: 'hover:text-blue-400', bgColor: 'hover:bg-blue-400/20' },
    { icon: FaLinkedin, href: 'https://www.linkedin.com/in/veereshhp/', label: 'LinkedIn', color: 'hover:text-blue-600', bgColor: 'hover:bg-blue-600/20' },
    { icon: FaGithub, href: 'https://github.com/Veeresh-hp', label: 'GitHub', color: 'hover:text-gray-300', bgColor: 'hover:bg-gray-300/20' },
    { icon: FaDiscord, href: 'https://discord.gg/veer_thinks_53322', label: 'Discord', color: 'hover:text-indigo-400', bgColor: 'hover:bg-indigo-400/20' },
    { icon: FaYoutube, href: 'https://youtube.com/@veerthinks?si=vYqUUFQ2mg2utng3', label: 'YouTube', color: 'hover:text-red-500', bgColor: 'hover:bg-red-500/20' },
    { icon: FaInstagram, label: 'Instagram', color: 'hover:text-pink-400', bgColor: 'hover:bg-pink-400/20' },
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
    <m.button
      onClick={() => handleFooterLinkClick(href)}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      className="group text-gray-400 hover:text-white text-sm transition-all duration-300 relative py-2 w-full text-left"
    >
      <span className="relative z-10">{name}</span>
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-r-lg transition-all duration-300 group-hover:w-full -z-0" />
      <span className="absolute left-0 bottom-1 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-6" />
    </m.button>
  );

  const CollapsibleSection = ({ title, children, sectionKey }) => (
    <div className="lg:block">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="lg:pointer-events-none lg:cursor-default flex items-center justify-between w-full font-bold text-lg mb-4 text-white py-2 lg:py-0"
      >
        <span className="flex items-center gap-2">{title}</span>
        <m.div
          animate={{ rotate: expandedSections[sectionKey] ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden"
        >
          <FaChevronDown className="text-sm" />
        </m.div>
      </button>
      
      <AnimatePresence>
        {(expandedSections[sectionKey] || window.innerWidth >= 1024) && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden lg:!h-auto lg:!opacity-100"
          >
            <ul className="space-y-2 pb-4 lg:pb-0">
              {children}
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <LazyMotion features={domAnimation}>
      <m.footer
        className="relative bg-gradient-to-br from-gray-900 via-gray-900/95 to-gray-800/90 backdrop-blur-xl border-t border-white/20 text-white overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        {/* Enhanced Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500" />
        <div className="absolute -top-32 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -top-20 right-1/4 w-48 h-48 bg-gradient-to-r from-pink-500/8 to-orange-500/8 rounded-full blur-2xl" />
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          
          {/* Mobile-First Brand Section */}
          <div className="text-center lg:text-left mb-12 lg:mb-0">
            <Link 
              to="/" 
              onClick={() => window.scrollTo({ top: 0 })} 
              className="inline-flex items-center text-2xl lg:text-3xl font-extrabold mb-6 group"
            >
              <m.img 
                src={Logo} 
                alt="AI Tools Hub Logo" 
                className="w-12 h-12 lg:w-14 lg:h-14 mr-3 rounded-xl shadow-lg group-hover:shadow-blue-500/30 transition-shadow duration-300" 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                AI Tools Hub
              </span>
            </Link>
            
            <p className="text-gray-300 text-base lg:text-lg leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
              Discover cutting-edge AI tools to supercharge your productivity and innovation in the digital age.
            </p>
            
            {/* Enhanced Social Links */}
            <div className="flex justify-center lg:justify-start flex-wrap gap-3 mb-12 lg:mb-0">
              {socialLinks.map((social, index) => (
                <m.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center bg-white/5 backdrop-blur-sm border border-white/20 text-gray-400 transition-all duration-300 ${social.color} ${social.bgColor} hover:border-white/40 hover:shadow-lg relative overflow-hidden group`}
                  title={social.label}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <social.icon className="text-lg lg:text-xl relative z-10" />
                </m.a>
              ))}
            </div>
          </div>

          {/* Mobile-Optimized Links Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-16">
            {Object.entries(footerLinks).map(([category, links]) => (
              <CollapsibleSection 
                key={category} 
                title={category} 
                sectionKey={category}
              >
                {links.map((link) => (
                  <li key={link.name}>
                    <FooterLink href={link.href} name={link.name} />
                  </li>
                ))}
              </CollapsibleSection>
            ))}
          </div>

          {/* Enhanced Newsletter Section */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 lg:p-12"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
            
            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <m.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <FaNewspaper className="text-2xl text-white" />
              </m.div>
              
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Stay Updated
              </h3>
              <p className="text-gray-300 text-base lg:text-lg mb-8 leading-relaxed">
                Get weekly updates on the newest AI tools, industry insights, and exclusive content delivered to your inbox.
              </p>
              
              {/* Message Display */}
              <AnimatePresence>
                {message && (
                  <m.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className={`mb-6 p-4 rounded-2xl text-sm lg:text-base font-medium ${
                      messageType === 'success' 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/40' 
                        : 'bg-red-500/20 text-red-300 border border-red-500/40'
                    }`}
                  >
                    {message}
                  </m.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <div className="relative flex-1">
                  <input
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address" 
                    required
                    disabled={isLoading}
                    className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 text-base"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 focus-within:opacity-100 transition-opacity pointer-events-none" />
                </div>
                
                <m.button
                  type="submit" 
                  whileHover={{ scale: isLoading ? 1 : 1.05 }} 
                  whileTap={{ scale: isLoading ? 1 : 0.95 }}
                  disabled={isLoading}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-semibold shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group min-w-[140px]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 flex items-center gap-2">
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Subscribing...
                      </>
                    ) : isSubscribed ? (
                      <>
                        <FaHeart className="text-red-400" />
                        Subscribed!
                      </>
                    ) : (
                      'Subscribe'
                    )}
                  </span>
                </m.button>
              </form>
            </div>
          </m.div>
        </div>

        {/* Enhanced Bottom Bar */}
        <div className="relative z-10 border-t border-white/20 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-sm text-center sm:text-left flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                © {new Date().getFullYear()} AI Tools Hub. All Rights Reserved. 
                <span className="flex items-center gap-1">
                  Made with <FaHeart className="text-red-500 animate-pulse" /> by 
                  <span className="font-semibold text-white">myalltools</span>
                </span>
              </p>
              
              <m.button
                onClick={scrollToTop} 
                whileHover={{ y: -4, scale: 1.1 }} 
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-blue-500/30 transition-all relative overflow-hidden group"
                title="Back to top"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <FaArrowUp className="relative z-10" />
              </m.button>
            </div>
          </div>
        </div>
      </m.footer>
    </LazyMotion>
  );
};

export default Footer;