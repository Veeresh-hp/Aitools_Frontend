import React, { useState, useRef } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import {
  FaTwitter, FaLinkedin, FaGithub, FaDiscord, FaYoutube, FaTelegram, FaInstagram,
  FaEnvelope, FaHeart, FaArrowUp, FaTools, FaUsers, FaCode, FaLightbulb, FaShieldAlt,
  FaGlobe, FaBook, FaNewspaper, FaSpinner, FaChevronDown, FaChevronUp, FaRocket,
  FaStar, FaFire, FaChartLine
} from 'react-icons/fa';
import { motion as m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import Logo from '../assets/logo.png';
import toolsData from '../data/toolsData';

const Footer = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Pages where footer should be hidden
  const hiddenPages = ['/signup', '/login', '/history', '/sign-up', '/log-in'];
  
  const shouldHideFooter = hiddenPages.some(page => 
    location.pathname === page || location.pathname.startsWith(page + '/')
  );

  if (shouldHideFooter) {
    return null;
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    'Company': [
      { name: 'About Us', href: '/about', icon: FaGlobe },
      { name: 'Contact', href: '/contact', icon: FaEnvelope },
    ],
    'Legal': [
      { name: 'Privacy Policy', href: '/privacy', icon: FaShieldAlt },
      { name: 'Terms of Service', href: '/terms', icon: FaBook },
    ]
  };

  const socialLinks = [
    { icon: FaLinkedin, href: 'https://www.linkedin.com/in/veereshhp/', label: 'LinkedIn', color: 'hover:text-blue-600', bgColor: 'hover:bg-blue-600/20' },
    { icon: FaGithub, href: 'https://github.com/Veeresh-hp', label: 'GitHub', color: 'hover:text-gray-300', bgColor: 'hover:bg-gray-300/20' },
    { icon: FaYoutube, href: 'https://youtube.com/@veerthinks?si=vYqUUFQ2mg2utng3', label: 'YouTube', color: 'hover:text-red-500', bgColor: 'hover:bg-red-500/20' },
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

  const features = [
    {
      icon: FaRocket,
      title: "Lightning Fast",
      description: "Discover AI tools instantly with our optimized search"
    },
    {
      icon: FaStar,
      title: "Curated Collection",
      description: "Hand-picked premium AI tools for maximum productivity"
    },
    {
      icon: FaFire,
      title: "Always Updated",
      description: "Latest AI innovations added weekly to our platform"
    },
    {
      icon: FaChartLine,
      title: "Trending Tools",
      description: "Stay ahead with the most popular AI solutions"
    }
  ];

  return (
    <LazyMotion features={domAnimation}>
      <m.footer
        className="relative bg-gray-900 border-t border-gray-800 text-white"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0 }}
      >
        {/* Simplified Background */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />

        {/* Main Content - Compact */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Newsletter Subscription */}
          <div className="mb-10">
            <div className="relative rounded-2xl overflow-hidden p-8 sm:p-10 bg-gradient-to-r from-pink-600 via-red-500 to-orange-500 shadow-xl border border-white/10">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-black/10 rounded-full blur-3xl" />
              </div>
              <div className="relative z-10 text-center max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-3 text-white">Subscribe to our Newsletter</h3>
                <p className="text-sm text-white/90 mb-6 leading-relaxed">Stay informed with weekly updates on the latest AI tools. Get the newest insights, features, and offerings right in your inbox!</p>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setStatus({ state: 'idle', message: '' });
                    const trimmed = email.trim();
                    if (!trimmed) {
                      setStatus({ state: 'error', message: 'Please enter your email.' });
                      return;
                    }
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(trimmed)) {
                      setStatus({ state: 'error', message: 'Enter a valid email.' });
                      return;
                    }
                    setIsSubmitting(true);
                    try {
                      const res = await fetch(`${API_URL}/api/newsletter/subscribe`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: trimmed })
                      });
                      const json = await res.json();
                      if (res.ok) {
                        setStatus({ state: 'success', message: json.message || 'You are subscribed!' });
                        setEmail('');
                      } else {
                        setStatus({ state: 'error', message: json.error || 'Subscription failed.' });
                      }
                    } catch (err) {
                      setStatus({ state: 'error', message: 'Network error. Try again later.' });
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  className="flex flex-col sm:flex-row items-stretch gap-3 justify-center"
                >
                  <div className="flex-1 min-w-[240px] relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 rounded-lg bg-white/15 backdrop-blur-sm text-white placeholder-white/70 text-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white shadow-inner"
                      aria-label="Email address"
                      disabled={isSubmitting}
                    />
                    {status.state === 'error' && (
                      <span className="absolute -bottom-5 left-1 text-xs text-white/90 font-medium">{status.message}</span>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-3 rounded-lg bg-white text-sm font-semibold text-pink-600 hover:bg-pink-50 transition-all border border-white/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 shadow"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                          <path d="M4 12a8 8 0 018-8" strokeWidth="4" strokeLinecap="round" className="opacity-75" />
                        </svg>
                        <span>Subscribing...</span>
                      </>
                    ) : (
                      <>
                        <FaEnvelope className="text-pink-600" />
                        <span>Subscribe</span>
                      </>
                    )}
                  </button>
                </form>
                {status.state === 'success' && (
                  <div className="mt-4 text-sm font-medium text-white bg-white/20 rounded-md px-4 py-2 inline-flex items-center gap-2">
                    <span>✅ {status.message}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Brand Section - Compact */}
            <div className="text-center lg:text-left">
              <Link 
                to="/" 
                onClick={() => window.scrollTo({ top: 0 })} 
                className="inline-flex items-center text-xl font-bold mb-3 group"
              >
                <m.img 
                  src={Logo} 
                  alt="AI Tools Hub Logo" 
                  className="w-10 h-10 mr-2 rounded-lg shadow-lg group-hover:shadow-blue-500/30 transition-shadow duration-300" 
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  AI Tools Hub
                </span>
              </Link>
              
              <p className="text-gray-400 text-sm max-w-xs mx-auto lg:mx-0">
                Discover cutting-edge AI tools for productivity
              </p>
            </div>

            {/* Quick Links - Compact */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              {Object.entries(footerLinks).map(([category, links]) => (
                <div key={category} className="flex items-center gap-4">
                  {links.map((link) => (
                    <button
                      key={link.name}
                      onClick={() => handleFooterLinkClick(link.href)}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Social Links - Compact */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <m.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 text-gray-400 transition-all duration-200 ${social.color} ${social.bgColor} hover:border-white/30`}
                  title={social.label}
                >
                  <social.icon className="text-sm" />
                </m.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar - Compact */}
        <div className="border-t border-gray-800 bg-gray-900/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-gray-500 text-xs text-center sm:text-left">
                © {new Date().getFullYear()} AI Tools Hub. All rights reserved.
              </p>
              
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-xs flex items-center gap-1">
                  Made with <FaHeart className="text-red-500 text-[10px]" /> by myalltools
                </span>
                <m.button
                  onClick={scrollToTop} 
                  whileHover={{ y: -2 }} 
                  whileTap={{ scale: 0.95 }}
                  className="w-7 h-7 rounded-md flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all"
                  title="Back to top"
                >
                  <FaArrowUp className="text-[10px]" />
                </m.button>
              </div>
            </div>
          </div>
        </div>
      </m.footer>
    </LazyMotion>
  );
};

export default Footer;