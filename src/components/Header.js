import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
// At the top of Header.js with your other imports
import { faCode } from '@fortawesome/free-solid-svg-icons'; // Or the correct package
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'; // Or from whichever style you are using (e.g., free-regular-svg-icons)
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons'; // Or from whichever style you are using (e.g., free-regular-svg-icons)
import { faChartBar } from '@fortawesome/free-solid-svg-icons';
import {
  faBars,
  faTimes,
  faRocket,
  faCaretDown,
  faSearch,
  faUser,
  faHome,
  faRobot,
  faImage,
  faMusic,
  faPen,
  faInfoCircle,
  faPhone,
  faTools,
  faSignInAlt,
  faUserPlus,
  faHistory,
  faSignOutAlt,
  faCog,
  faShieldAlt,
  faBell,
  faBookmark,
  faChartLine,
  faGlobe,
  faDesktop,
  faVideo,
  faMicrophone,
  faGamepad,
  faDatabase,
  faPalette,
  faShareAlt,
  faBriefcase,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';
import { motion as m, LazyMotion, domAnimation, LayoutGroup, AnimatePresence } from 'framer-motion';
import Logo from '../assets/logo.png';
import PageWrapper from './PageWrapper';
import toolsData from '../data/toolsData'; // Import tools data for search

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileToolsDropdownOpen, setIsMobileToolsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredNavItem, setHoveredNavItem] = useState(null);

  const dropdownRef = useRef(null);
  const accountRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const hamburgerButtonRef = useRef(null);
  const searchRef = useRef(null);
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
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
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
        setIsSearchOpen(false);
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
    setIsMobileMenuOpen(false);
    setIsMobileToolsDropdownOpen(false);
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  // Enhanced search functionality - search through both categories and tools
  const getSearchResults = (query) => {
    if (!query.trim()) return { categories: [], tools: [] };

    const searchQuery = query.toLowerCase();
    
    // Search categories
    const matchedCategories = categories.filter(cat => 
      cat.name.toLowerCase().includes(searchQuery)
    );

    // Search tools
    const matchedTools = [];
    toolsData.forEach(category => {
      category.tools.forEach(tool => {
        if (
          tool.name.toLowerCase().includes(searchQuery) ||
          tool.description.toLowerCase().includes(searchQuery) ||
          (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(searchQuery)))
        ) {
          matchedTools.push({
            ...tool,
            categoryName: category.name,
            categoryId: category.id
          });
        }
      });
    });

    return {
      categories: matchedCategories,
      tools: matchedTools.slice(0, 10) // Limit to 10 tools for performance
    };
  };

  const handleToolClick = (tool) => {
    // Handle cases where link might be undefined or null
    const toolLink = tool.link || tool.url || '#';
    
    addToHistory(tool.name, toolLink);
    
    // Check if link exists and is a string before using startsWith
    if (toolLink && typeof toolLink === 'string' && toolLink.startsWith('http')) {
      window.open(toolLink, '_blank', 'noopener,noreferrer');
    } else if (toolLink && toolLink !== '#') {
      history.push(toolLink);
    }
    // If no valid link, just close the search (could also show a message)
    
    setIsSearchOpen(false);
    setSearchTerm('');
  };

  const categories = [
    { name: 'Faceless AI Video', id: 'faceless-video', icon: faVideo },
    { name: 'AI Video Generators', id: 'video-generators', icon: faVideo },
    { name: 'AI Coding Assistants', id: 'ai-coding-assistants', icon: faCode },
    { name: 'AI Writing Tools', id: 'writing-tools', icon: faPen },
    { name: 'AI Meeting Notes', id: 'meeting-notes', icon: faMicrophone},
    { name: 'AI Spreadsheet Tools', id: 'spreadsheet-tools', icon: faDatabase},
    { name: 'Email Assistance', id: 'email-assistance', icon: faEnvelope},
    { name: 'AI Scheduling', id: 'ai-scheduling', icon: faCalendarAlt},
    { name: 'AI Data Visualization', id: 'data-visualization', icon: faChartBar},
    { name: 'AI Presentation Tools', id: 'presentation-tools', icon: faDesktop },
    { name: 'AI Short Clippers', id: 'short-clippers', icon: faVideo },
    { name: 'AI Marketing Tools', id: 'marketing-tools', icon: faChartLine },
    { name: 'AI Voice Tools', id: 'voice-tools', icon: faMicrophone },
    { name: 'AI Website Builders', id: 'website-builders', icon: faGlobe },
    { name: 'AI Image Generators', id: 'image-generators', icon: faImage },
    { name: 'ChatGPT Alternatives', id: 'chatbots', icon: faRobot },
    { name: 'AI Music Tools', id: 'music-generators', icon: faMusic },
    { name: 'AI Data Tools', id: 'data-analysis', icon: faDatabase },
    { name: 'AI Diagrams', id: 'ai-diagrams', icon: faChartLine },
    { name: 'AI Gaming Tools', id: 'gaming-tools', icon: faGamepad },
    { name: 'Other AI Tools', id: 'other-tools', icon: faTools },
    { name: 'Utility Tools', id: 'utility-tools', icon: faCog },
    { name: 'Portfolio Tools', id: 'Portfolio', icon: faBriefcase },
    { name: 'Text Humanizer AI', id: 'text-humanizer-ai', icon: faRobot },
    { name: 'AI Prompts Tools', id: 'AI Prompts', icon: faPen },
    { name: 'AI Design Tools', id: 'AI Design', icon: faPalette },
    { name: 'AI Logo Generator', id: 'Logo Generators', icon: faPalette },
    { name: 'Social Media Tools', id: 'Social Media', icon: faShareAlt },
    { name: 'AI Productivity Tools', id: 'Productivity', icon: faBriefcase },
  ];

  const mainNavItems = [
    ['/', faHome, 'Home'],
    ['#chatbots', faRobot, 'Chatbots'],
    ['#image-generators', faImage, 'Images'],
    ['#music-generators', faMusic, 'Music'],
    ['#writing-tools', faPen, 'Text'],
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

  // Get search results for current search term
  const searchResults = getSearchResults(searchTerm);

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
          .action-btn { background: linear-gradient(135deg, #3b82f6, #8b5cf6); box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); }
          .action-btn:hover { box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4); transform: translateY(-2px); }
          .hamburger-modern { background: linear-gradient(135deg, #3b82f6, #8b5cf6); border: 1px solid rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); }
          .hamburger-modern:hover { box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4); transform: translateY(-2px) scale(1.05); }
          .hamburger-modern:active { transform: translateY(0px) scale(0.95); }
          .search-input { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); }
          .search-input:focus { background: rgba(255, 255, 255, 0.1); border-color: rgba(59, 130, 246, 0.5); box-shadow: 0 0 20px rgba(59, 130, 246, 0.2); }
          .search-overlay { background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(20px); }
          .tool-result-item { border-left: 3px solid rgba(59, 130, 246, 0.5); }
          .tool-result-item:hover { border-left-color: rgba(59, 130, 246, 1); background: rgba(59, 130, 246, 0.1); }
          @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
          @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); } 50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); } }
          .back-to-top-modern { background: linear-gradient(135deg, #ef4444, #f97316, #eab308); box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3); }
          .back-to-top-modern:hover { animation: float 2s ease-in-out infinite; box-shadow: 0 12px 35px rgba(239, 68, 68, 0.4); }
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .logo-bounce:active { animation: bounce 0.3s ease-in-out; }
          @keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-10px); } 60% { transform: translateY(-5px); } }
          .nav-separator { display: inline-block; width: 1px; height: 20px; background: rgba(255, 255, 255, 0.2); margin: 0 16px; }
        `}</style>

        <m.header
          className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 glass-header ${isScrolled ? 'scrolled' : ''}`}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <nav className="relative flex items-center justify-between h-20 w-full px-4 sm:px-6 lg:px-8">
            {/* Mobile Layout */}
            <div className="sm:hidden flex items-center justify-between w-full">
              <m.button ref={hamburgerButtonRef} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hamburger-modern w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all duration-300" aria-label="Open mobile menu">
                <m.div variants={hamburgerVariants} animate={isMobileMenuOpen ? "open" : "closed"} transition={{ duration: 0.3, ease: "easeInOut" }}>
                  <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="text-lg" />
                </m.div>
              </m.button>
              <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="logo-bounce">
                <Link to="/" onClick={handleLogoClick} className="flex items-center text-lg font-extrabold logo-glow transition-all duration-300">
                  <m.img src={Logo} alt="AI Tools Hub Logo" className="w-12 h-12 mr-2 rounded-lg" whileHover={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.5 }} />
                  <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">AI Tools Hub</span>
                </Link>
              </m.div>
              <div className="flex items-center space-x-2">
                <m.button onClick={handleSearchToggle} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="action-btn w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all duration-300" aria-label="Toggle Search">
                  <FontAwesomeIcon icon={faSearch} className="text-lg" />
                </m.button>
                <m.button onClick={() => history.push('/profile')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="action-btn w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all duration-300" aria-label="Profile">
                  <FontAwesomeIcon icon={faUser} className="text-lg" />
                </m.button>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center">
              <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="logo-bounce">
                <Link to="/" onClick={handleLogoClick} className="flex items-center text-xl font-extrabold logo-glow transition-all duration-300">
                  <m.img src={Logo} alt="AI Tools Hub Logo" className="w-12 h-12 mr-2 rounded-lg" whileHover={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.5 }} />
                  <span className="leading-tight bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">AI Tools Hub</span>
                </Link>
              </m.div>
            </div>

            {/* Updated Desktop Navigation - Only show Home and About on smaller screens */}
            <div className="hidden sm:flex justify-center absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none">
              <LayoutGroup>
                <ul className="flex items-center space-x-2 text-sm font-semibold pointer-events-auto" onMouseLeave={() => setHoveredNavItem(null)}>
                  {/* Home - Always visible */}
                  <li className="relative" onMouseEnter={() => setHoveredNavItem('/')}>
                    {hoveredNavItem === '/' && (<m.div layoutId="nav-highlighter" className="absolute inset-0 bg-white/10 rounded-lg -z-10" transition={{ type: 'spring', stiffness: 350, damping: 30 }} />)}
                    <m.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                      <Link to="/" onClick={() => addToHistory('Home', '/')} className="relative flex items-center gap-2 px-3 py-2 text-white transition-colors duration-300">
                        <FontAwesomeIcon icon={faHome} className="text-lg" />
                        <span>Home</span>
                      </Link>
                    </m.div>
                  </li>

                  {/* Other nav items - Hidden on medium screens, shown on large screens */}
                  {mainNavItems.slice(1).map(([link, icon, label]) => (
                    <li key={link} className="relative hidden lg:block" onMouseEnter={() => setHoveredNavItem(link)}>
                      {hoveredNavItem === link && (<m.div layoutId="nav-highlighter" className="absolute inset-0 bg-white/10 rounded-lg -z-10" transition={{ type: 'spring', stiffness: 350, damping: 30 }} />)}
                      <m.button onClick={(e) => handleCategoryClick(e, link.slice(1))} className="relative flex items-center gap-2 px-3 py-2 text-white transition-colors duration-300" whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                        <FontAwesomeIcon icon={icon} className="text-lg" />
                        <span>{label}</span>
                      </m.button>
                    </li>
                  ))}

                  {/* About - Always visible */}
                  <li className="relative" onMouseEnter={() => setHoveredNavItem('about')}>
                    {hoveredNavItem === 'about' && <m.div layoutId="nav-highlighter" className="absolute inset-0 bg-white/10 rounded-lg -z-10" transition={{ type: 'spring', stiffness: 350, damping: 30 }} />}
                    <m.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                      <Link to="/about" onClick={() => addToHistory('About', '/about')} className="relative flex items-center gap-2 px-3 py-2 text-white transition-colors duration-300">
                        <FontAwesomeIcon icon={faInfoCircle} className="text-lg" />
                        <span>About</span>
                      </Link>
                    </m.div>
                  </li>

                  {/* Contact - Hidden on medium screens, shown on large screens */}
                  <li className="relative hidden lg:block" onMouseEnter={() => setHoveredNavItem('contact')}>
                    {hoveredNavItem === 'contact' && <m.div layoutId="nav-highlighter" className="absolute inset-0 bg-white/10 rounded-lg -z-10" transition={{ type: 'spring', stiffness: 350, damping: 30 }} />}
                    <m.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                      <Link to="/contact" onClick={() => addToHistory('Contact', '/contact')} className="relative flex items-center gap-2 px-3 py-2 text-white transition-colors duration-300">
                        <FontAwesomeIcon icon={faPhone} className="text-lg" />
                        <span>Contact</span>
                      </Link>
                    </m.div>
                  </li>

                  {/* All Tools dropdown - Hidden on medium screens, shown on large screens */}
                  <li className="relative hidden lg:block" ref={dropdownRef} onMouseEnter={() => { openDropdown(); setHoveredNavItem('all-tools'); }} onMouseLeave={closeDropdown}>
                    {hoveredNavItem === 'all-tools' && <m.div layoutId="nav-highlighter" className="absolute inset-0 bg-white/10 rounded-lg -z-10" transition={{ type: 'spring', stiffness: 350, damping: 30 }} />}
                    <m.button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="relative flex items-center gap-2 px-3 py-2 text-white transition-colors duration-300" aria-haspopup="true" aria-expanded={isDropdownOpen} whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                      <FontAwesomeIcon icon={faTools} className="text-lg" />
                      <span>All Tools</span>
                      <m.div animate={{ rotate: isDropdownOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <FontAwesomeIcon icon={faCaretDown} className="ml-1 text-xs" />
                      </m.div>
                    </m.button>
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <m.ul initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2, ease: "easeOut" }} className="absolute left-0 mt-2 rounded-2xl py-4 min-w-[350px] max-h-[calc(100vh-100px)] overflow-y-auto z-50 text-sm dropdown-glass hide-scrollbar" role="menu">
                          <li className="px-4 pb-4"><input type="text" placeholder="Search tools..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-3 rounded-xl search-input text-white placeholder-gray-400 focus:outline-none transition-all duration-300" aria-label="Search categories" /></li>
                          <div className="grid grid-cols-1 gap-1 px-2">
                            {categories.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase())).map(cat => (<li key={cat.id} role="menuitem"><m.button onClick={(e) => handleCategoryClick(e, cat.id)} whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.1)' }} whileTap={{ scale: 0.98 }} className="block w-full text-left px-4 py-3 rounded-xl text-gray-300 hover:text-blue-300 transition-all duration-200 flex items-center gap-3"><FontAwesomeIcon icon={cat.icon} className="w-4 h-4 text-blue-400" />{cat.name}</m.button></li>))}
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
                  <m.button onMouseEnter={openAccountDropdown} onMouseLeave={closeAccountDropdownWithDelay} onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300" aria-haspopup="true" aria-expanded={isAccountDropdownOpen}>
                    <FontAwesomeIcon icon={faUser} /> Account <m.div animate={{ rotate: isAccountDropdownOpen ? 180 : 0 }} transition={{ duration: 0.3 }}><FontAwesomeIcon icon={faCaretDown} className="text-xs" /></m.div>
                  </m.button>
                  <AnimatePresence>
                    {isAccountDropdownOpen && (
                      <m.ul initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2, ease: "easeOut" }} className="absolute right-0 mt-2 rounded-2xl py-2 z-50 text-sm w-48 dropdown-glass" onMouseEnter={cancelCloseAccountDropdown} onMouseLeave={closeAccountDropdownWithDelay} role="menu">
                        <li role="menuitem"><Link to="/history" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-blue-300 hover:bg-white/10 rounded-xl mx-2 transition-all duration-200"><FontAwesomeIcon icon={faHistory} className="w-4 h-4" /> History</Link></li>
                        <li role="menuitem"><Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-blue-300 hover:bg-white/10 rounded-xl mx-2 transition-all duration-200"><FontAwesomeIcon icon={faUser} /> Profile</Link></li>
                        <li role="menuitem"><m.button onClick={handleLogout} className="flex items-center gap-3 w-full text-left px-4 py-3 text-gray-300 hover:text-red-300 hover:bg-white/10 rounded-xl mx-2 transition-all duration-200"><FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" /> Sign Out</m.button></li>
                      </m.ul>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <m.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}><Link to="/login" className="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300"><FontAwesomeIcon icon={faSignInAlt} className="w-4 h-4" /> Login</Link></m.div>
                  <m.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}><Link to="/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"><FontAwesomeIcon icon={faUserPlus} className="w-4 h-4" /> Sign up</Link></m.div>
                </>
              )}
              <m.button onClick={() => history.push('/profile')} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="action-btn w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all duration-300" aria-label="Profile">
                <FontAwesomeIcon icon={faUser} className="text-lg" />
              </m.button>
            </div>
          </nav>
        </m.header>

        {/* Enhanced Mobile Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <m.div ref={searchRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-50 search-overlay flex items-start justify-center pt-24" onClick={() => setIsSearchOpen(false)}>
              <m.div initial={{ y: -50, scale: 0.9 }} animate={{ y: 0, scale: 1 }} exit={{ y: -50, scale: 0.9 }} transition={{ duration: 0.3 }} className="w-full max-w-2xl mx-4" onClick={(e) => e.stopPropagation()}>
                <div className="dropdown-glass rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <FontAwesomeIcon icon={faSearch} className="text-blue-400 text-xl" />
                    <input 
                      type="text" 
                      placeholder="Search AI tools and categories..." 
                      autoFocus 
                      className="flex-1 bg-transparent text-white text-xl placeholder-gray-400 focus:outline-none" 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                    <m.button onClick={() => setIsSearchOpen(false)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-gray-400 hover:text-white transition-colors">
                      <FontAwesomeIcon icon={faTimes} className="text-xl" />
                    </m.button>
                  </div>
                  
                  {searchTerm && (
                    <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-h-96 overflow-y-auto hide-scrollbar">
                      {/* Tools Results */}
                      {searchResults.tools.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-gray-400 text-sm font-semibold mb-3 flex items-center gap-2">
                            <FontAwesomeIcon icon={faTools} className="w-4 h-4" />
                            AI Tools ({searchResults.tools.length})
                          </h3>
                          <div className="space-y-2">
                            {searchResults.tools.map((tool, index) => (
                              <m.button
                                key={`${tool.name}-${index}`}
                                onClick={() => handleToolClick(tool)}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className="block w-full text-left px-4 py-3 rounded-xl text-gray-300 hover:text-white transition-all duration-200 tool-result-item"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                      <span className="font-medium text-blue-300">{tool.name}</span>
                                      {tool.link && typeof tool.link === 'string' && tool.link.startsWith('http') && (
                                        <FontAwesomeIcon icon={faExternalLinkAlt} className="w-3 h-3 text-gray-500" />
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-400 line-clamp-2 mb-1">
                                      {tool.description}
                                    </p>
                                    <span className="text-xs text-purple-400">
                                      in {tool.categoryName}
                                    </span>
                                  </div>
                                </div>
                              </m.button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Categories Results */}
                      {searchResults.categories.length > 0 && (
                        <div>
                          <h3 className="text-gray-400 text-sm font-semibold mb-3 flex items-center gap-2">
                            <FontAwesomeIcon icon={faGlobe} className="w-4 h-4" />
                            Categories ({searchResults.categories.length})
                          </h3>
                          <div className="space-y-2">
                            {searchResults.categories.map((cat, index) => (
                              <m.button
                                key={cat.id}
                                onClick={(e) => { 
                                  handleCategoryClick(e, cat.id); 
                                  setIsSearchOpen(false); 
                                  setSearchTerm(''); 
                                }}
                                whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                                whileTap={{ scale: 0.98 }}
                                className="block w-full text-left px-4 py-3 rounded-xl text-gray-300 hover:text-blue-300 transition-all duration-200 flex items-center gap-3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: (searchResults.tools.length + index) * 0.05 }}
                              >
                                <FontAwesomeIcon icon={cat.icon} className="w-4 h-4 text-blue-400" />
                                {cat.name}
                              </m.button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* No Results */}
                      {searchResults.tools.length === 0 && searchResults.categories.length === 0 && (
                        <m.div 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          className="text-center py-8"
                        >
                          <FontAwesomeIcon icon={faSearch} className="text-gray-600 text-3xl mb-4" />
                          <p className="text-gray-400 text-lg mb-2">No results found</p>
                          <p className="text-gray-500 text-sm">
                            Try searching for tools like "ChatGPT", "Midjourney", or "Canva"
                          </p>
                        </m.div>
                      )}
                    </m.div>
                  )}
                  
                  {/* Default state when no search term */}
                  {!searchTerm && (
                    <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      <div className="text-center py-4">
                        <FontAwesomeIcon icon={faSearch} className="text-gray-600 text-3xl mb-4" />
                        <p className="text-gray-400 text-lg mb-2">Search AI Tools & Categories</p>
                        <p className="text-gray-500 text-sm">
                          Find specific tools like ChatGPT, Midjourney, or browse by category
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-gray-400 text-sm font-semibold mb-3">Popular Categories</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {categories.slice(0, 6).map((cat) => (
                            <m.button
                              key={cat.id}
                              onClick={(e) => { 
                                handleCategoryClick(e, cat.id); 
                                setIsSearchOpen(false); 
                              }}
                              whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                              whileTap={{ scale: 0.98 }}
                              className="text-left px-3 py-2 rounded-lg text-gray-300 hover:text-blue-300 transition-all duration-200 flex items-center gap-2 text-sm"
                            >
                              <FontAwesomeIcon icon={cat.icon} className="w-3 h-3 text-blue-400" />
                              <span className="truncate">{cat.name}</span>
                            </m.button>
                          ))}
                        </div>
                      </div>
                    </m.div>
                  )}
                </div>
              </m.div>
            </m.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <m.div variants={backdropVariants} initial="closed" animate="open" exit="closed" className="fixed inset-0 mobile-menu-backdrop z-40" onClick={() => setIsMobileMenuOpen(false)} aria-hidden="true" />
              <m.div ref={mobileMenuRef} variants={mobileMenuVariants} initial="closed" animate="open" exit="closed" className="fixed top-0 left-0 h-full w-[80%] max-w-sm z-50 mobile-drawer" role="dialog" aria-modal="true" aria-labelledby="mobile-menu-title">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <m.h2 id="mobile-menu-title" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>Menu</m.h2>
                  <m.button onClick={() => setIsMobileMenuOpen(false)} whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-xl text-white hover:bg-white/10 transition-all duration-300" aria-label="Close mobile menu" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} transition={{ delay: 0.1 }}><FontAwesomeIcon icon={faTimes} className="text-xl" /></m.button>
                </div>
                <ul className="flex flex-col px-4 py-6 space-y-2 text-sm font-medium overflow-y-auto max-h-[calc(100vh-8rem)]">
                  {mainNavItems.map(([link, icon, label], index) => (
                    <m.li key={label} role="menuitem" variants={menuItemVariants} initial="closed" animate="open" custom={index}>
                      {link.startsWith('#') ? (
                        <m.button
                          onClick={(e) => { handleCategoryClick(e, link.slice(1)); }}
                          whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-3 w-full text-left px-4 py-3 text-white rounded-xl hover:bg-white/10 transition-all duration-300"
                        >
                          <m.div whileHover={{ scale: 1.2, rotate: 10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                            <FontAwesomeIcon icon={icon} className="w-5 text-center" />
                          </m.div>
                          {label}
                        </m.button>
                      ) : (
                        <m.div whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.1)' }} whileTap={{ scale: 0.95 }}>
                          <Link
                            to={link}
                            onClick={() => { addToHistory(label, link); setIsMobileMenuOpen(false); }}
                            className="flex items-center gap-3 px-4 py-3 text-white rounded-xl hover:bg-white/10 transition-all duration-300"
                          >
                            <m.div whileHover={{ scale: 1.2, rotate: 10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                              <FontAwesomeIcon icon={icon} className="w-5 text-center" />
                            </m.div>
                            {label}
                          </Link>
                        </m.div>
                      )}
                    </m.li>
                  ))}

                  <m.li role="menuitem" variants={menuItemVariants} initial="closed" animate="open" custom={mainNavItems.length}>
                    <m.div whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.1)' }} whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/about"
                        onClick={() => { addToHistory('About', '/about'); setIsMobileMenuOpen(false); }}
                        className="flex items-center gap-3 px-4 py-3 text-white rounded-xl hover:bg-white/10 transition-all duration-300"
                      >
                        <m.div whileHover={{ scale: 1.2, rotate: 10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                          <FontAwesomeIcon icon={faInfoCircle} className="w-5 text-center" />
                        </m.div>
                        About
                      </Link>
                    </m.div>
                  </m.li>

                  <m.li role="menuitem" variants={menuItemVariants} initial="closed" animate="open" custom={mainNavItems.length + 1}>
                    <m.div whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.1)' }} whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/contact"
                        onClick={() => { addToHistory('Contact', '/contact'); setIsMobileMenuOpen(false); }}
                        className="flex items-center gap-3 px-4 py-3 text-white rounded-xl hover:bg-white/10 transition-all duration-300"
                      >
                        <m.div whileHover={{ scale: 1.2, rotate: 10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                          <FontAwesomeIcon icon={faPhone} className="w-5 text-center" />
                        </m.div>
                        Contact
                      </Link>
                    </m.div>
                  </m.li>

                  <m.li role="menuitem" variants={menuItemVariants} initial="closed" animate="open" custom={mainNavItems.length + 2}>
                    <m.button onClick={() => setIsMobileToolsDropdownOpen(!isMobileToolsDropdownOpen)} whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.1)' }} whileTap={{ scale: 0.95 }} className="flex items-center justify-between w-full px-4 py-3 text-white rounded-xl hover:bg-white/10 transition-all duration-300" aria-expanded={isMobileToolsDropdownOpen}>
                      <div className="flex items-center gap-3">
                        <m.div whileHover={{ scale: 1.2, rotate: 10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                          <FontAwesomeIcon icon={faTools} className="w-5 text-center" />
                        </m.div>
                        All Tools
                      </div>
                      <m.div animate={{ rotate: isMobileToolsDropdownOpen ? 180 : 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                        <FontAwesomeIcon icon={faCaretDown} className="text-sm" />
                      </m.div>
                    </m.button>
                    <AnimatePresence>
                      {isMobileToolsDropdownOpen && (
                        <m.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="pl-6 mt-2 space-y-2 overflow-hidden">
                          {categories.map((cat, index) => (
                            <m.li key={cat.id} role="menuitem" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: index * 0.03, duration: 0.3 }}>
                              <m.button onClick={(e) => { handleCategoryClick(e, cat.id); }} whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.05)' }} whileTap={{ scale: 0.95 }} className="block w-full text-left px-4 py-2 text-gray-300 hover:text-blue-300 rounded-xl hover:bg-white/10 transition-all duration-200 flex items-center gap-3">
                                <FontAwesomeIcon icon={cat.icon} className="w-4 h-4 text-blue-400" />
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
                        <m.li role="menuitem" variants={menuItemVariants} initial="closed" animate="open" custom={mainNavItems.length + 3}>
                          <m.div whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.1)' }} whileTap={{ scale: 0.95 }}>
                            <Link to="/history" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-white rounded-xl hover:bg-white/10 transition-all duration-300">
                              <m.div whileHover={{ scale: 1.2, rotate: 10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                                <FontAwesomeIcon icon={faHistory} className="w-5 text-center" />
                              </m.div>
                              History
                            </Link>
                          </m.div>
                        </m.li>
                        <m.li role="menuitem" variants={menuItemVariants} initial="closed" animate="open" custom={mainNavItems.length + 4}>
                          <m.div whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.1)' }} whileTap={{ scale: 0.95 }}>
                            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-white rounded-xl hover:bg-white/10 transition-all duration-300">
                              <m.div whileHover={{ scale: 1.2, rotate: 10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                                <FontAwesomeIcon icon={faUser} className="w-5 text-center" />
                              </m.div>
                               Profile
                            </Link>
                          </m.div>
                        </m.li>
                        <m.li role="menuitem" variants={menuItemVariants} initial="closed" animate="open" custom={mainNavItems.length + 5}>
                          <m.button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} whileHover={{ x: 4, backgroundColor: 'rgba(239, 68, 68, 0.1)' }} whileTap={{ scale: 0.95 }} className="flex items-center gap-3 w-full text-left px-4 py-3 text-white hover:text-red-300 rounded-xl hover:bg-white/10 transition-all duration-300">
                            <m.div whileHover={{ scale: 1.2, rotate: 10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                              <FontAwesomeIcon icon={faSignOutAlt} className="w-5 text-center" />
                            </m.div>
                            Sign Out
                          </m.button>
                        </m.li>
                      </>
                    ) : (
                      <>
                        <m.li role="menuitem" variants={menuItemVariants} initial="closed" animate="open" custom={mainNavItems.length + 3}>
                          <m.div whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.1)' }} whileTap={{ scale: 0.95 }}>
                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-white rounded-xl hover:bg-white/10 transition-all duration-300">
                              <m.div whileHover={{ scale: 1.2, rotate: 10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                                <FontAwesomeIcon icon={faSignInAlt} className="w-5 text-center" />
                              </m.div>
                              Login
                            </Link>
                          </m.div>
                        </m.li>
                        <m.li role="menuitem" variants={menuItemVariants} initial="closed" animate="open" custom={mainNavItems.length + 4}>
                          <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-2">
                            <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300">
                              <m.div whileHover={{ scale: 1.2, rotate: 10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                                <FontAwesomeIcon icon={faUserPlus} className="w-5 text-center" />
                              </m.div>
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
            <m.button initial={{ scale: 0, opacity: 0, rotate: -180 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: 0, opacity: 0, rotate: 180 }} whileHover={{ scale: 1.1, y: -5, rotate: 15 }} whileTap={{ scale: 0.9 }} onClick={handleBackToTop} className="fixed bottom-6 right-6 z-40 w-14 h-14 back-to-top-modern rounded-full flex items-center justify-center text-white font-bold transition-all duration-300 hover:shadow-xl" aria-label="Scroll back to top" transition={{ type: "spring", stiffness: 400, damping: 25 }}>
              <m.div animate={{ y: [0, -3, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
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