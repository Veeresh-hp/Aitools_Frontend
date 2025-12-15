import React, { useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import {
  FaLinkedin, FaGithub, FaYoutube,
  FaEnvelope, FaHeart, FaArrowUp, FaShieldAlt,
  FaGlobe, FaBook, FaChevronDown,
  FaStar, FaFire, FaChartLine
} from 'react-icons/fa';
import { motion as m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import Logo from '../assets/logo.png';
import SubscriptionSuccess from './SubscriptionSuccess';


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
            {/* Professional Newsletter Section */}
            {/* Professional Newsletter Section */}
            <div className="relative mb-12">
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl">
                {/* Subtle Gradient Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-blue-600/5 opacity-50" />
                
                <div className="relative px-6 py-8 sm:px-10 sm:py-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  
                  {/* Text Content */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-2 tracking-tight bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                      Stay ahead of the curve
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed max-w-md mx-auto md:mx-0 font-medium">
                      Join <span className="text-cyan-400 glow-text drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">10,000+ professionals</span> discovering the latest AI tools and trends weekly. No spam, just value.
                    </p>
                  </div>

                  {/* Form */}
                  <div className="w-full md:w-auto flex-shrink-0">
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setStatus({ state: 'idle', message: '' });
                        const trimmed = email.trim();
                        if (!trimmed) {
                          setStatus({ state: 'error', message: 'Email is required' });
                          return;
                        }
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(trimmed)) {
                          setStatus({ state: 'error', message: 'Invalid email address' });
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
                            setStatus({ state: 'success', message: 'Subscribed successfully' });
                            setEmail('');
                          } else {
                            setStatus({ state: 'error', message: json.error || 'Failed to subscribe' });
                          }
                        } catch (err) {
                          setStatus({ state: 'error', message: 'Connection error' });
                        } finally {
                          setIsSubmitting(false);
                        }
                      }}
                      className="relative w-full md:w-[400px]"
                    >
                      <div className="group flex items-center gap-2 p-1 bg-slate-800/80 rounded-xl border border-white/10 hover:border-violet-500/30 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all duration-300 shadow-lg hover:shadow-violet-500/10">
                        <FaEnvelope className="ml-3 text-slate-400 group-focus-within:text-violet-400 transition-colors" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your work email"
                          className="flex-1 bg-transparent px-3 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:placeholder-violet-400/50 transition-all"
                          disabled={isSubmitting || status.state === 'success'}
                        />
                        <m.button
                          type="submit"
                          disabled={isSubmitting || status.state === 'success'}
                          whileHover={{ scale: 1.02, backgroundImage: 'linear-gradient(to right, #7e22ce, #db2777)' }}
                          whileTap={{ scale: 0.98 }}
                          className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-sm font-bold shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/10 relative overflow-hidden"
                        >
                          {isSubmitting ? 'Joining...' : 'Subscribe'}
                        </m.button>
                      </div>

                      <AnimatePresence>
                        {status.state === 'error' && (
                          <m.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute -bottom-8 left-0 text-xs font-medium flex items-center gap-1.5 text-red-400"
                          >
                             <FaShieldAlt /> {status.message}
                          </m.div>
                        )}
                      </AnimatePresence>
                    </form>
                  </div>
                </div>

                {/* Success Overlay covering the entire card */}
                <AnimatePresence>
                  {status.state === 'success' && (
                    <SubscriptionSuccess />
                  )}
                </AnimatePresence>
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