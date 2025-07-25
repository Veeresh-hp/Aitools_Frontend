import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faMoon, faSun, faRocket, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { motion as m, LazyMotion, domAnimation, LayoutGroup, AnimatePresence } from 'framer-motion';
import Logo from '../assets/logo.png';
import PageWrapper from './PageWrapper';

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileToolsDropdownOpen, setIsMobileToolsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredNavItem, setHoveredNavItem] = useState(null);

  const dropdownRef = useRef(null);
  const accountRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const hamburgerButtonRef = useRef(null);
  const accountCloseTimeoutRef = useRef(null);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowBackToTop(scrollY > 300);
      setIsScrolled(scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setIsAccountDropdownOpen(false);
      }
      if (
        isMobileMenuOpen && mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        !(hamburgerButtonRef.current && hamburgerButtonRef.current.contains(e.target))
      ) {
        setIsMobileMenuOpen(false);
        setIsMobileToolsDropdownOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(false);
        setIsAccountDropdownOpen(false);
        setIsMobileToolsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const addToHistory = (label, link) => {
    const historyData = JSON.parse(localStorage.getItem('clickHistory')) || [];
    const timestamp = new Date().toISOString();
    const newEntry = { label, link, timestamp };
    const updated = [newEntry, ...historyData.filter(item => item.link !== link)].slice(0, 10);
    localStorage.setItem('clickHistory', JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.location.reload();
  };

  const openDropdown = () => setIsDropdownOpen(true);
  const closeDropdown = () => setIsDropdownOpen(false);

  const openAccountDropdown = () => { clearTimeout(accountCloseTimeoutRef.current); setIsAccountDropdownOpen(true); };
  const closeAccountDropdownWithDelay = () => { accountCloseTimeoutRef.current = setTimeout(() => setIsAccountDropdownOpen(false), 300); };
  const cancelCloseAccountDropdown = () => { clearTimeout(accountCloseTimeoutRef.current); };

  const handleLogoClick = () => {
    addToHistory('Home', '/');
    setIsMobileMenuOpen(false); // Close mobile menu if open
    setIsMobileToolsDropdownOpen(false);
  };

  const categories = [
    { name: 'Faceless AI Video', id: 'faceless-video' }, { name: 'AI Video Generators', id: 'video-generators' },
    { name: 'AI Writing Tools', id: 'writing-tools' }, { name: 'AI Presentation Tools', id: 'presentation-tools' },
    { name: 'AI Short Clippers', id: 'short-clippers' }, { name: 'AI Marketing Tools', id: 'marketing-tools' },
    { name: 'AI Voice Tools', id: 'voice-tools' }, { name: 'AI Website Builders', id: 'website-builders' },
    { name: 'AI Image Generators', id: 'image-generators' }, { name: 'ChatGPT Alternatives', id: 'chatbots' },
    { name: 'AI Music Tools', id: 'music-generators' }, { name: 'AI Data Tools', id: 'data-analysis' },
    { name: 'AI Diagrams', id: 'ai-diagrams' }, { name: 'AI Gaming Tools', id: 'gaming-tools' },
    { name: 'Other AI Tools', id: 'other-tools' }, { name: 'Utility Tools', id: 'utility-tools' },
    { name: 'Portfolio Tools', id: 'Portfolio' }, { name: 'Text Humanizer AI', id: 'text-humanizer-ai' },
  ];

  const mainNavItems = [
    ['/', '🏠', 'Home'], ['#chatbots', '🤖', 'Chatbots'],
    ['#image-generators', '🖼️', 'Images'], ['#music-generators', '🎵', 'Music'],
    ['#writing-tools', '✍️', 'Text'],
  ];

  const scrollToSection = (id) => {
    const el = document.querySelector(`[data-category="${id}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      sessionStorage.setItem('scrollToCategory', id);
    }
  };

  const handleCategoryClick = (e, id) => {
    e.preventDefault();
    addToHistory(`Category: ${id}`, `#${id}`);
    if (location.pathname !== '/') {
      history.push(`/#${id}`);
      setTimeout(() => scrollToSection(id), 100);
    } else {
      scrollToSection(id);
    }
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setIsMobileToolsDropdownOpen(false);
  };

  const handleBackToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleDarkModeToggle = () => { toggleDarkMode(); };

  // Enhanced animation variants
  const mobileMenuVariants = {
    closed: { 
      x: '-100%',
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 30,
        duration: 0.3
      }
    },
    open: { 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 30,
        duration: 0.3
      }
    }
  };

  const backdropVariants = {
    closed: { 
      opacity: 0,
      transition: { duration: 0.2 }
    },
    open: { 
      opacity: 1,
      transition: { duration: 0.2 }
    }
  };

  const hamburgerVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180 }
  };

  const menuItemVariants = {
    closed: { x: -20, opacity: 0 },
    open: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  return (
    <LazyMotion features={domAnimation}>
      <PageWrapper>
        <style jsx>{`
          .glass-header { background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); }
          .glass-header.scrolled { background: rgba(15, 23, 42, 0.95); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5); }
          .logo-glow:hover { filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.5)); transform: scale(1.02); }
          .mobile-menu-backdrop { background: radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%); }
          .mobile-drawer { background: linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%); backdrop-filter: blur(20px); border-right: 1px solid rgba(255, 255, 255, 0.1); }
          .dropdown-glass { background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); }
          .theme-toggle-btn { background: linear-gradient(135deg, #3b82f6, #8b5cf6); box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); }
          .theme-toggle-btn:hover { box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4); transform: translateY(-2px) rotate(15deg); }
          .hamburger-modern { background: linear-gradient(135deg, #3b82f6, #8b5cf6); border: 1px solid rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); }
          .hamburger-modern:hover { box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4); transform: translateY(-2px) scale(1.05); }
          .hamburger-modern:active { transform: translateY(0px) scale(0.95); }
          .search-input { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); }
          .search-input:focus { background: rgba(255, 255, 255, 0.1); border-color: rgba(59, 130, 246, 0.5); box-shadow: 0 0 20px rgba(59, 130, 246, 0.2); }
          @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
          @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); } 50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); } }
          .back-to-top-modern { background: linear-gradient(135deg, #ef4444, #f97316, #eab308); box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3); }
          .back-to-top-modern:hover { animation: float 2s ease-in-out infinite; box-shadow: 0 12px 35px rgba(239, 68, 68, 0.4); }
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .logo-bounce:active { animation: bounce 0.3s ease-in-out; }
          @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-10px); } 60% { transform: translateY(-5px); } }
        `}</style>

        <m.header
          className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 glass-header ${isScrolled ? 'scrolled' : ''}`}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <nav className="relative flex items-center justify-between h-20 w-full px-4 sm:px-6 lg:px-8">
            {/* Mobile Layout */}
            <div className="sm:hidden flex items-center justify-between w-full">
              <m.button 
                ref={hamburgerButtonRef} 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                className="hamburger-modern w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all duration-300" 
                aria-label="Open mobile menu"
              >
                <m.div 
                  variants={hamburgerVariants}
                  animate={isMobileMenuOpen ? "open" : "closed"}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="text-lg" />
                </m.div>
              </m.button>
              
              <m.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="logo-bounce"
              >
                <Link 
                  to="/" 
                  onClick={handleLogoClick}
                  className="flex items-center text-lg font-extrabold logo-glow transition-all duration-300"
                >
                  <m.img 
                    src={Logo} 
                    alt="AI Tools Hub Logo" 
                    className="w-12 h-12 mr-2 rounded-lg"
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    AI Tools Hub
                  </span>
                </Link>
              </m.div>
              
              <m.button 
                onClick={handleDarkModeToggle} 
                whileHover={{ scale: 1.05, rotate: 15 }} 
                whileTap={{ scale: 0.95 }} 
                className="theme-toggle-btn w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all duration-300" 
                aria-label="Toggle Dark Mode"
              >
                <m.div
                  key={isDarkMode ? 'sun' : 'moon'}
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} className="text-lg" />
                </m.div>
              </m.button>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center">
              <m.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="logo-bounce"
              >
                <Link 
                  to="/" 
                  onClick={handleLogoClick}
                  className="flex items-center text-xl font-extrabold logo-glow transition-all duration-300"
                >
                  <m.img 
                    src={Logo} 
                    alt="AI Tools Hub Logo" 
                    className="w-12 h-12 mr-2 rounded-lg"
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="leading-tight bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    AI Tools Hub
                  </span>
                </Link>
              </m.div>
            </div>
            
            <div className="hidden sm:flex justify-center absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none">
              <LayoutGroup>
                <ul 
                  className="flex items-center space-x-2 text-sm font-semibold pointer-events-auto"
                  onMouseLeave={() => setHoveredNavItem(null)}
                >
                  {mainNavItems.map(([link, icon, label]) => (
                    <li key={link} className="relative" onMouseEnter={() => setHoveredNavItem(link)}>
                      {hoveredNavItem === link && (
                        <m.div 
                          layoutId="nav-highlighter" 
                          className="absolute inset-0 bg-white/10 rounded-lg -z-10" 
                          transition={{type: 'spring', stiffness: 350, damping: 30}} 
                        />
                      )}
                      {link.startsWith('#') ? (
                        <m.button 
                          onClick={(e) => handleCategoryClick(e, link.slice(1))} 
                          className="relative flex items-center gap-2 px-3 py-2 text-white transition-colors duration-300"
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="text-lg">{icon}</span><span>{label}</span>
                        </m.button>
                      ) : (
                        <m.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                          <Link 
                            to={link} 
                            onClick={() => addToHistory(label, link)} 
                            className="relative flex items-center gap-2 px-3 py-2 text-white transition-colors duration-300"
                          >
                            <span className="text-lg">{icon}</span><span>{label}</span>
                          </Link>
                        </m.div>
                      )}
                    </li>
                  ))}
                  <li className="relative" onMouseEnter={() => setHoveredNavItem('about')}>
                    {hoveredNavItem === 'about' && (
                      <m.div layoutId="nav-highlighter" className="absolute inset-0 bg-white/10 rounded-lg -z-10" transition={{type: 'spring', stiffness: 350, damping: 30}} />
                    )}
                    <m.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                      <Link to="/about" onClick={() => addToHistory('About', '/about')} className="relative flex items-center gap-2 px-3 py-2 text-white transition-colors duration-300">
                        <span className="text-lg">ℹ️</span><span>About</span>
                      </Link>
                    </m.div>
                  </li>
                  <li className="relative" onMouseEnter={() => setHoveredNavItem('contact')}>
                    {hoveredNavItem === 'contact' && (
                      <m.div layoutId="nav-highlighter" className="absolute inset-0 bg-white/10 rounded-lg -z-10" transition={{type: 'spring', stiffness: 350, damping: 30}} />
                    )}
                    <m.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                      <Link to="/contact" onClick={() => addToHistory('Contact', '/contact')} className="relative flex items-center gap-2 px-3 py-2 text-white transition-colors duration-300">
                        <span className="text-lg">📞</span><span>Contact</span>
                      </Link>
                    </m.div>
                  </li>
                  <li className="relative" ref={dropdownRef} onMouseEnter={() => { openDropdown(); setHoveredNavItem('all-tools'); }} onMouseLeave={closeDropdown}>
                    {hoveredNavItem === 'all-tools' && (
                      <m.div layoutId="nav-highlighter" className="absolute inset-0 bg-white/10 rounded-lg -z-10" transition={{type: 'spring', stiffness: 350, damping: 30}} />
                    )}
                    <m.button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                      className="relative flex items-center gap-2 px-3 py-2 text-white transition-colors duration-300" 
                      aria-haspopup="true" 
                      aria-expanded={isDropdownOpen}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-lg">🧰</span><span>All Tools</span>
                      <m.div
                        animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FontAwesomeIcon icon={faCaretDown} className="ml-1 text-xs" />
                      </m.div>
                    </m.button>
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <m.ul 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                          animate={{ opacity: 1, y: 0, scale: 1 }} 
                          exit={{ opacity: 0, y: 10, scale: 0.95 }} 
                          transition={{ duration: 0.2, ease: "easeOut" }} 
                          className="absolute left-0 mt-2 rounded-2xl py-4 min-w-[350px] max-h-[calc(100vh-100px)] overflow-y-auto z-50 text-sm dropdown-glass hide-scrollbar" 
                          role="menu"
                        >
                          <li className="px-4 pb-4">
                            <input 
                              type="text" 
                              placeholder="Search tools..." 
                              value={searchTerm} 
                              onChange={(e) => setSearchTerm(e.target.value)} 
                              className="w-full px-4 py-3 rounded-xl search-input text-white placeholder-gray-400 focus:outline-none transition-all duration-300" 
                              aria-label="Search categories" 
                            />
                          </li>
                          <div className="grid grid-cols-1 gap-1 px-2">
                            {categories.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase())).map(cat => (
                                <li key={cat.id} role="menuitem">
                                  <m.button 
                                    onClick={(e) => handleCategoryClick(e, cat.id)} 
                                    whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.1)' }} 
                                    whileTap={{ scale: 0.98 }}
                                    className="block w-full text-left px-4 py-3 rounded-xl text-gray-300 hover:text-blue-300 transition-all duration-200"
                                  >
                                    {cat.name}
                                  </m.button>
                                </li>
                              ))}
                          </div>
                        </m.ul>
                      )}
                    </AnimatePresence>
                  </li>
                </ul>
              </LayoutGroup>
            </div>

            <div className="hidden sm:flex items-center space-x-2">
              {isLoggedIn ? (
                <div className="relative" ref={accountRef}>
                  <m.button 
                    onMouseEnter={openAccountDropdown} 
                    onMouseLeave={closeAccountDropdownWithDelay} 
                    onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)} 
                    whileHover={{ scale: 1.05, y: -2 }} 
                    whileTap={{ scale: 0.95 }} 
                    className="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300" 
                    aria-haspopup="true" 
                    aria-expanded={isAccountDropdownOpen}
                  >
                    Account 
                    <m.div
                      animate={{ rotate: isAccountDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FontAwesomeIcon icon={faCaretDown} className="text-xs" />
                    </m.div>
                  </m.button>
                  <AnimatePresence>
                    {isAccountDropdownOpen && (
                      <m.ul 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                        animate={{ opacity: 1, y: 0, scale: 1 }} 
                        exit={{ opacity: 0, y: 10, scale: 0.95 }} 
                        transition={{ duration: 0.2, ease: "easeOut" }} 
                        className="absolute right-0 mt-2 rounded-2xl py-2 z-50 text-sm w-40 dropdown-glass" 
                        onMouseEnter={cancelCloseAccountDropdown} 
                        onMouseLeave={closeAccountDropdownWithDelay} 
                        role="menu"
                      >
                        <li role="menuitem">
                          <Link to="/history" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-blue-300 hover:bg-white/10 rounded-xl mx-2 transition-all duration-200">
                            <span className="text-lg">📜</span> History
                          </Link>
                        </li>
                        <li role="menuitem">
                          <m.button 
                            onClick={handleLogout} 
                            className="flex items-center gap-3 w-full text-left px-4 py-3 text-gray-300 hover:text-red-300 hover:bg-white/10 rounded-xl mx-2 transition-all duration-200"
                          >
                            <span className="text-lg">🚪</span> Sign Out
                          </m.button>
                        </li>
                      </m.ul>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <m.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/login" className="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300">
                      <span className="text-lg">🔐</span> Login
                    </Link>
                  </m.div>
                  <m.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40">
                      <span className="text-lg">📝</span> Sign up
                    </Link>
                  </m.div>
                </>
              )}
              <m.button 
                onClick={handleDarkModeToggle} 
                whileHover={{ scale: 1.05, rotate: 15 }} 
                whileTap={{ scale: 0.95 }} 
                className="theme-toggle-btn w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all duration-300" 
                aria-label="Toggle Dark Mode"
              >
                <m.div
                  key={isDarkMode ? 'sun' : 'moon'}
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} className="text-lg" />
                </m.div>
              </m.button>
            </div>
          </nav>
        </m.header>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <m.div 
                variants={backdropVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="fixed inset-0 mobile-menu-backdrop z-40" 
                onClick={() => setIsMobileMenuOpen(false)} 
                aria-hidden="true" 
              />
              <m.div 
                ref={mobileMenuRef} 
                variants={mobileMenuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="fixed top-0 left-0 h-full w-[80%] max-w-sm z-50 mobile-drawer" 
                role="dialog" 
                aria-modal="true" 
                aria-labelledby="mobile-menu-title"
              >
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <m.h2 
                    id="mobile-menu-title" 
                    className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Menu
                  </m.h2>
                  <m.button 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    whileHover={{ scale: 1.1, rotate: 90 }} 
                    whileTap={{ scale: 0.9 }} 
                    className="p-2 rounded-xl text-white hover:bg-white/10 transition-all duration-300" 
                    aria-label="Close mobile menu"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <FontAwesomeIcon icon={faTimes} className="text-xl" />
                  </m.button>
                </div>
                
                <ul className="flex flex-col px-4 py-6 space-y-2 text-sm font-medium overflow-y-auto max-h-[calc(100vh-8rem)]">
                  {mainNavItems.map(([link, icon, label], index) => (
                    <m.li 
                      key={label} 
                      role="menuitem"
                      variants={menuItemVariants}
                      initial="closed"
                      animate="open"
                      custom={index}
                    >
                      {link.startsWith('#') ? (
                        <m.button 
                          onClick={(e) => { handleCategoryClick(e, link.slice(1)); }} 
                          whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.1)' }} 
                          whileTap={{ scale: 0.95 }} 
                          className="flex items-center gap-3 w-full text-left px-4 py-3 text-white rounded-xl hover:bg-white/10 transition-all duration-300"
                        >
                          <m.span 
                            className="text-xl"
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            {icon}
                          </m.span> 
                          {label}
                        </m.button>
                      ) : (
                        <m.div whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.1)' }} whileTap={{ scale: 0.95 }}>
                          <Link 
                            to={link} 
                            onClick={() => { addToHistory(label, link); setIsMobileMenuOpen(false); }} 
                            className="flex items-center gap-3 px-4 py-3 text-white rounded-xl hover:bg-white/10 transition-all duration-300"
                          >
                            <m.span 
                              className="text-xl"
                              whileHover={{ scale: 1.2, rotate: 10 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              {icon}
                            </m.span> 
                            {label}
                          </Link>
                        </m.div>
                      )}
                    </m.li>
                  ))}
                  
                  <m.li 
                    role="menuitem"
                    variants={menuItemVariants}
                    initial="closed"
                    animate="open"
                    custom={mainNavItems.length}
                  >
                    <m.div whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.1)' }} whileTap={{ scale: 0.95 }}>
                      <Link 
                        to="/about" 
                        onClick={() => { addToHistory('About', '/about'); setIsMobileMenuOpen(false); }} 
                        className="flex items-center gap-3 px-4 py-3 text-white rounded-xl hover:bg-white/10 transition-all duration-300"
                      >
                        <m.span 
                          className="text-xl"
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          ℹ️
                        </m.span> 
                        About
                      </Link>
                    </m.div>
                  </m.li>
                  
                  <m.li 
                    role="menuitem"
                    variants={menuItemVariants}
                    initial="closed"
                    animate="open"
                    custom={mainNavItems.length + 1}
                  >
                    <m.div whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.1)' }} whileTap={{ scale: 0.95 }}>
                      <Link 
                        to="/contact" 
                        onClick={() => { addToHistory('Contact', '/contact'); setIsMobileMenuOpen(false); }} 
                        className="flex items-center gap-3 px-4 py-3 text-white rounded-xl hover:bg-white/10 transition-all duration-300"
                      >
                        <m.span 
                          className="text-xl"
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          📞
                        </m.span> 
                        Contact
                      </Link>
                    </m.div>
                  </m.li>
                  
                  <m.li 
                    role="menuitem"
                    variants={menuItemVariants}
                    initial="closed"
                    animate="open"
                    custom={mainNavItems.length + 2}
                  >
                    <m.button 
                      onClick={() => setIsMobileToolsDropdownOpen(!isMobileToolsDropdownOpen)} 
                      whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.1)' }} 
                      whileTap={{ scale: 0.95 }} 
                      className="flex items-center justify-between w-full px-4 py-3 text-white rounded-xl hover:bg-white/10 transition-all duration-300" 
                      aria-expanded={isMobileToolsDropdownOpen}
                    >
                      <div className="flex items-center gap-3">
                        <m.span 
                          className="text-xl"
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          🧰
                        </m.span> 
                        All Tools
                      </div>
                      <m.div 
                        animate={{ rotate: isMobileToolsDropdownOpen ? 180 : 0 }} 
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <FontAwesomeIcon icon={faCaretDown} className="text-sm" />
                      </m.div>
                    </m.button>
                    
                    <AnimatePresence>
                      {isMobileToolsDropdownOpen && (
                        <m.ul 
                          initial={{ height: 0, opacity: 0 }} 
                          animate={{ height: 'auto', opacity: 1 }} 
                          exit={{ height: 0, opacity: 0 }} 
                          transition={{ duration: 0.3, ease: "easeInOut" }} 
                          className="pl-6 mt-2 space-y-2 overflow-hidden"
                        >
                          {categories.map((cat, index) => (
                            <m.li 
                              key={cat.id} 
                              role="menuitem"
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: index * 0.03, duration: 0.3 }}
                            >
                              <m.button 
                                onClick={(e) => { handleCategoryClick(e, cat.id); }} 
                                whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.05)' }} 
                                whileTap={{ scale: 0.95 }} 
                                className="block w-full text-left px-4 py-2 text-gray-300 hover:text-blue-300 rounded-xl hover:bg-white/10 transition-all duration-200"
                              >
                                {cat.name}
                              </m.button>
                            </m.li>
                          ))}
                        </m.ul>
                      )}
                    </AnimatePresence>
                  </m.li>
                  
                  <div className="mt-6 pt-6 border-t border-white/10">
                    {isLoggedIn ? (
                      <>
                        <m.li 
                          role="menuitem"
                          variants={menuItemVariants}
                          initial="closed"
                          animate="open"
                          custom={mainNavItems.length + 3}
                        >
                          <m.div whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.1)' }} whileTap={{ scale: 0.95 }}>
                            <Link 
                              to="/history" 
                              onClick={() => setIsMobileMenuOpen(false)} 
                              className="flex items-center gap-3 px-4 py-3 text-white rounded-xl hover:bg-white/10 transition-all duration-300"
                            >
                              <m.span 
                                className="text-xl"
                                whileHover={{ scale: 1.2, rotate: 10 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              >
                                📜
                              </m.span> 
                              History
                            </Link>
                          </m.div>
                        </m.li>
                        <m.li 
                          role="menuitem"
                          variants={menuItemVariants}
                          initial="closed"
                          animate="open"
                          custom={mainNavItems.length + 4}
                        >
                          <m.button 
                            onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} 
                            whileHover={{ x: 4, backgroundColor: 'rgba(239, 68, 68, 0.1)' }} 
                            whileTap={{ scale: 0.95 }} 
                            className="flex items-center gap-3 w-full text-left px-4 py-3 text-white hover:text-red-300 rounded-xl hover:bg-white/10 transition-all duration-300"
                          >
                            <m.span 
                              className="text-xl"
                              whileHover={{ scale: 1.2, rotate: 10 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              🚪
                            </m.span> 
                            Sign Out
                          </m.button>
                        </m.li>
                      </>
                    ) : (
                      <>
                        <m.li 
                          role="menuitem"
                          variants={menuItemVariants}
                          initial="closed"
                          animate="open"
                          custom={mainNavItems.length + 3}
                        >
                          <m.div whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.1)' }} whileTap={{ scale: 0.95 }}>
                            <Link 
                              to="/login" 
                              onClick={() => setIsMobileMenuOpen(false)} 
                              className="flex items-center gap-3 px-4 py-3 text-white rounded-xl hover:bg-white/10 transition-all duration-300"
                            >
                              <m.span 
                                className="text-xl"
                                whileHover={{ scale: 1.2, rotate: 10 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              >
                                🔐
                              </m.span> 
                              Login
                            </Link>
                          </m.div>
                        </m.li>
                        <m.li 
                          role="menuitem"
                          variants={menuItemVariants}
                          initial="closed"
                          animate="open"
                          custom={mainNavItems.length + 4}
                        >
                          <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-2">
                            <Link 
                              to="/signup" 
                              onClick={() => setIsMobileMenuOpen(false)} 
                              className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
                            >
                              <m.span 
                                className="text-xl"
                                whileHover={{ scale: 1.2, rotate: 10 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              >
                                📝
                              </m.span> 
                              Sign up
                            </Link>
                          </m.div>
                        </m.li>
                      </>
                    )}
                  </div>
                </ul>
              </m.div>
            </>
          )}
        </AnimatePresence>

        {/* Back to Top Button */}
        <AnimatePresence>
          {showBackToTop && (
            <m.button 
              initial={{ scale: 0, opacity: 0, rotate: -180 }} 
              animate={{ scale: 1, opacity: 1, rotate: 0 }} 
              exit={{ scale: 0, opacity: 0, rotate: 180 }} 
              whileHover={{ scale: 1.1, y: -5, rotate: 15 }} 
              whileTap={{ scale: 0.9 }} 
              onClick={handleBackToTop} 
              className="fixed bottom-6 right-6 z-40 w-14 h-14 back-to-top-modern rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 hover:shadow-xl" 
              aria-label="Scroll back to top"
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <m.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <FontAwesomeIcon icon={faRocket} className="text-xl" />
              </m.div>
            </m.button>
          )}
        </AnimatePresence>
      </PageWrapper>
    </LazyMotion>
  );
};

export default Header;