import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faMoon, faSun, faRocket, faCaretDown } from '@fortawesome/free-solid-svg-icons';
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
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const accountRef = useRef(null);
  const accountButtonRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const hamburgerButtonRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const accountCloseTimeoutRef = useRef(null);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && buttonRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        accountRef.current && accountButtonRef.current &&
        !accountRef.current.contains(e.target) &&
        !accountButtonRef.current.contains(e.target)
      ) {
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

  const openDropdown = () => {
    clearTimeout(closeTimeoutRef.current);
    setIsDropdownOpen(true);
  };

  const closeDropdownWithDelay = () => {
    closeTimeoutRef.current = setTimeout(() => setIsDropdownOpen(false), 300);
  };

  const cancelCloseDropdown = () => {
    clearTimeout(closeTimeoutRef.current);
  };

  const openAccountDropdown = () => {
    clearTimeout(accountCloseTimeoutRef.current);
    setIsAccountDropdownOpen(true);
  };

  const closeAccountDropdownWithDelay = () => {
    accountCloseTimeoutRef.current = setTimeout(() => setIsAccountDropdownOpen(false), 300);
  };

  const cancelCloseAccountDropdown = () => {
    clearTimeout(accountCloseTimeoutRef.current);
  };

  const categories = [
    { name: 'Faceless AI Video', id: 'faceless-video' },
    { name: 'AI Video Generators', id: 'video-generators' },
    { name: 'AI Writing Tools', id: 'writing-tools' },
    { name: 'AI Presentation Tools', id: 'presentation-tools' },
    { name: 'AI Short Clippers', id: 'short-clippers' },
    { name: 'AI Marketing Tools', id: 'marketing-tools' },
    { name: 'AI Voice Tools', id: 'voice-tools' },
    { name: 'AI Website Builders', id: 'website-builders' },
    { name: 'AI Image Generators', id: 'image-generators' },
    { name: 'ChatGPT Alternatives', id: 'chatbots' },
    { name: 'AI Music Tools', id: 'music-generators' },
    { name: 'AI Data Tools', id: 'data-analysis' },
    { name: 'AI Diagrams', id: 'ai-diagrams' },
    { name: 'AI Gaming Tools', id: 'gaming-tools' },
    { name: 'Other AI Tools', id: 'other-tools' },
    { name: 'Utility Tools', id: 'utility-tools' },
    { name: 'Portfolio Tools', id: 'Portfolio' },
    {name : 'text-humanizer-ai', id : 'text-humanizer-ai'},
  ];

  const mainNavItems = [
    ['/', '🏠', 'Home'],
    ['#chatbots', '🤖', 'Chatbots'],
    ['#image-generators', '🖼️', 'Images'],
    ['#music-generators', '🎵', 'Music'],
    ['#data-analysis', '📊', 'Data'],
    ['#ai-diagrams', '📈', 'Diagrams'],
    ['#writing-tools', '✍️', 'Text'],
    ['#video-generators', '🎬', 'Video']
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

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDarkModeToggle = () => {
    toggleDarkMode();
  };

  return (
    <PageWrapper>
      <style jsx>{`
        .spin-on-hover {
          display: inline-block;
          transition: transform 0.4s ease;
        }
        .spin-on-hover:hover {
          transform: rotate(360deg);
        }
        .logo-img {
          width: 64px;
          height: 64px;
          object-fit: contain;
          vertical-align: middle;
        }
        @media (max-width: 640px) {
          .logo-img {
            width: 48px;
            height: 48px;
          }
        }
        .hamburger-btn {
          position: relative;
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          backdrop-filter: blur(10px);
          overflow: hidden;
        }
        .dark .hamburger-btn {
          background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
          box-shadow: 0 4px 15px rgba(74, 85, 104, 0.4);
          border-color: rgba(255, 255, 255, 0.1);
        }
        .hamburger-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }
        .hamburger-btn:hover::before {
          left: 100%;
        }
        .hamburger-btn:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
          border-color: rgba(255, 255, 255, 0.3);
        }
        .dark .hamburger-btn:hover {
          box-shadow: 0 8px 25px rgba(74, 85, 104, 0.6);
        }
        .hamburger-btn:active {
          transform: translateY(0) scale(0.98);
        }
        .hamburger-btn.open {
          background: transparent;
          border-color: transparent;
          box-shadow: none;
        }
        .dark .hamburger-btn.open {
          background: transparent;
          border-color: transparent;
          box-shadow: none;
        }
        .hamburger-lines {
          position: relative;
          width: 20px;
          height: 16px;
          z-index: 1;
        }
        .hamburger-line {
          position: absolute;
          height: 2px;
          width: 100%;
          background: white;
          border-radius: 2px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        }
        .hamburger-line:nth-child(1) {
          top: 0;
          transform-origin: left center;
        }
        .hamburger-line:nth-child(2) {
          top: 50%;
          transform: translateY(-50%);
        }
        .hamburger-line:nth-child(3) {
          bottom: 0;
          transform-origin: left center;
        }
        .hamburger-btn.open .hamburger-line:nth-child(1) {
          transform: rotate(45deg);
          top: 7px;
        }
        .hamburger-btn.open .hamburger-line:nth-child(2) {
          opacity: 0;
          transform: translateY(-50%) translateX(20px);
        }
        .hamburger-btn.open .hamburger-line:nth-child(3) {
          transform: rotate(-45deg);
          bottom: 7px;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.75rem;
          border-radius: 0.375rem;
          transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out, transform 0.1s ease-in-out, box-shadow 0.2s ease-in-out;
          white-space: nowrap;
        }
        .dropdown-item:hover {
          transform: translateX(3px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .dropdown-item-light {
          color: #1a202c;
        }
        .dropdown-item-light:hover {
          background-color: #e0e7ff;
          color: #2563eb;
        }
        .dropdown-item-dark {
          color: #edf2f7;
        }
        .dropdown-item-dark:hover {
          background-color: #4a5568;
          color: #93c5fd;
        }
        .dropdown-panel {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          border-width: 1px;
          border-color: #e2e8f0;
          backdrop-filter: blur(10px);
          background-color: rgba(255, 255, 255, 0.85);
        }
        .dark .dropdown-panel {
          border-color: #4a5568;
          background-color: rgba(31, 41, 55, 0.85);
        }
        .mobile-drawer {
          transform: translateX(-100%);
          transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
          will-change: transform;
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
        }
        .dark .mobile-drawer {
          background: linear-gradient(180deg, #1a202c 0%, #2d3748 100%);
        }
        .mobile-drawer.open {
          transform: translateX(0);
        }
        .mobile-drawer-overlay {
          opacity: 0;
          transition: opacity 0.4s ease-in-out;
          background: radial-gradient(circle, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%);
        }
        .mobile-drawer-overlay.open {
          opacity: 1;
        }
        .navbar-link-hover {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .navbar-link-hover:hover {
          color: #2563eb !important;
          transform: translateY(-2px);
        }
        .dark .navbar-link-hover:hover {
          color: #93c5fd !important;
        }
        .navbar-link-hover::before {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #2563eb, #3b82f6);
          transition: width 0.3s ease;
        }
        .navbar-link-hover:hover::before {
          width: 100%;
        }
        .dark .navbar-link-hover::before {
          background: linear-gradient(90deg, #93c5fd, #60a5fa);
        }
        .nav-icon {
          font-size: 1.25rem;
          color: #4a5568;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
          transition: all 0.3s ease;
        }
        .dark .nav-icon {
          color: #e2e8f0;
          filter: drop-shadow(0 1px 2px rgba(255, 255, 255, 0.1));
        }
        .nav-icon:hover {
          transform: scale(1.1);
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }
        .dark .nav-icon:hover {
          filter: drop-shadow(0 2px 4px rgba(255, 255, 255, 0.2));
        }
        .button-effect {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .button-effect::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 5px;
          height: 5px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          opacity: 0;
          transform: scale(1);
          transition: all 0.3s ease-out;
        }
        .button-effect:active::after {
          transform: scale(100);
          opacity: 1;
        }
        .theme-toggle {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          border: 2px solid rgba(251, 191, 36, 0.3);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dark .theme-toggle {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          border-color: rgba(99, 102, 241, 0.3);
        }
        .theme-toggle:hover {
          transform: translateY(-2px) rotate(15deg);
          box-shadow: 0 8px 25px rgba(251, 191, 36, 0.4);
        }
        .dark .theme-toggle:hover {
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
        }
        .drawer-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }
        .dark .drawer-header {
          background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
        }
        .drawer-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }
        .drawer-header > * {
          position: relative;
          z-index: 1;
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
          /* Add to your global CSS or a <style> tag */
.back-to-top {
  transition: opacity 0.3s ease, transform 0.3s ease;
} 

        .animate-bounce {
          animation: bounce 1s infinite;
        }
      `}</style>
      <header className="fixed top-0 left-0 w-full backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 z-50 shadow-md">
        <nav className="flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-5 h-20">
          <div className="sm:hidden flex items-center justify-between w-full">
            <button
              ref={hamburgerButtonRef}
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsDropdownOpen(false);
                setIsAccountDropdownOpen(false);
              }}
              className={`hamburger-btn ${isMobileMenuOpen ? 'open' : ''}`}
              aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            >
              <div className="hamburger-lines">
                <div className="hamburger-line"></div>
                <div className="hamburger-line"></div>
                <div className="hamburger-line"></div>
              </div>
            </button>
            <Link
              to="/"
              className="flex items-center text-lg font-extrabold text-red-600 dark:text-red-400 hover:scale-105 transition-all duration-200"
              onClick={() => {
                window.scrollTo({ top: 0 });
                addToHistory('Home', '/');
              }}
            >
              <img src={Logo} alt="AI Tools Hub Logo" className="logo-img mr-2" />
              AI Tools Hub
            </Link>
            <button
              onClick={handleDarkModeToggle}
              className="theme-toggle"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Dark Mode"
            >
              <FontAwesomeIcon
                icon={isDarkMode ? faSun : faMoon}
                className="nav-icon text-white"
              />
            </button>
          </div>
          <Link to="/" className="hidden sm:flex items-center text-xl font-extrabold text-red-600 dark:text-red-400 hover:scale-105 transition-all duration-200" onClick={() => {
            window.scrollTo({ top: 0 });
            addToHistory('Home', '/');
          }}>
            <img src={Logo} alt="AI Tools Hub Logo" className="logo-img mr-2" /> AI Tools Hub
          </Link>
          <ul className="hidden sm:flex items-center space-x-6 text-sm font-semibold">
            {mainNavItems.map(([link, icon, label]) => (
              <li key={link}>
                {link.startsWith('#') ? (
                  <button
                    onClick={(e) => handleCategoryClick(e, link.slice(1))}
                    className="flex items-center gap-1 text-gray-800 dark:text-white navbar-link-hover"
                  >
                    <span className="spin-on-hover inline-block nav-icon">{icon}</span> {label}
                  </button>
                ) : (
                  <Link
                    to={link}
                    onClick={() => {
                      addToHistory(label, link);
                      window.scrollTo({ top: 0 });
                    }}
                    className="flex items-center gap-1 text-gray-800 dark:text-white navbar-link-hover"
                  >
                    <span className="spin-on-hover inline-block nav-icon">{icon}</span> {label}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <Link to="/about" onClick={() => addToHistory('About', '/about')} className="flex items-center gap-1 text-gray-800 dark:text-white navbar-link-hover">
                <span className="spin-on-hover inline-block nav-icon">ℹ️</span> About
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => addToHistory('Contact', '/contact')} className="flex items-center gap-1 text-gray-800 dark:text-white navbar-link-hover">
                <span className="spin-on-hover inline-block nav-icon">📞</span> Contact
              </Link>
            </li>
            <li className="relative" ref={dropdownRef}>
              <button
                ref={buttonRef}
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdownWithDelay}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="nav-item flex items-center gap-1 text-gray-800 dark:text-white navbar-link-hover"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
              >
                <span className="spin-on-hover inline-block nav-icon">🧰</span> All Tools
                <FontAwesomeIcon icon={faCaretDown} className="text-[10px] nav-icon" />
              </button>
              {isDropdownOpen && (
                <ul
                  className={`absolute left-0 mt-2 rounded-md py-2 min-w-[300px] max-h-[calc(100vh-100px)] overflow-y-auto z-50 text-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-2 dropdown-panel ${isDarkMode ? 'dark' : ''}`}
                  onMouseEnter={cancelCloseDropdown}
                  onMouseLeave={closeDropdownWithDelay}
                  role="menu"
                >
                  <li className="col-span-full px-2 pb-2">
                    <input
                      type="text"
                      placeholder="Search tools..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Search categories"
                    />
                  </li>
                  {categories.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase())).map(cat => (
                    <li key={cat.id} role="menuitem">
                      <button
                        onClick={(e) => handleCategoryClick(e, cat.id)}
                        className={`block w-full text-left px-3 py-2 rounded-md transition-colors duration-200 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-blue-300' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
          <div className="hidden sm:flex items-center space-x-4 text-xs font-semibold">
            <button
              onClick={handleDarkModeToggle}
              className="theme-toggle"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Dark Mode"
            >
              <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} className="nav-icon text-white" />
            </button>
            {isLoggedIn ? (
              <div className="relative" ref={accountRef}>
                <button
                  ref={accountButtonRef}
                  onMouseEnter={openAccountDropdown}
                  onMouseLeave={closeAccountDropdownWithDelay}
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  className="nav-item flex items-center gap-1 text-gray-800 dark:text-white navbar-link-hover"
                  aria-haspopup="true"
                  aria-expanded={isAccountDropdownOpen}
                >
                  Account <FontAwesomeIcon icon={faCaretDown} className="text-[10px] nav-icon" />
                </button>
                {isAccountDropdownOpen && (
                  <ul
                    className={`absolute right-0 mt-2 rounded-md py-2 z-50 text-sm w-32 dropdown-panel ${isDarkMode ? 'dark' : ''}`}
                    onMouseEnter={cancelCloseAccountDropdown}
                    onMouseLeave={closeAccountDropdownWithDelay}
                    role="menu"
                  >
                    <li role="menuitem">
                      <Link to="/history" className={`block dropdown-item ${isDarkMode ? 'dropdown-item-dark' : 'dropdown-item-light'}`}>
                        <span className="text-lg nav-icon">📜</span> History
                      </Link>
                    </li>
                    <li role="menuitem">
                      <button
                        onClick={handleLogout}
                        className={`block w-full text-left dropdown-item ${isDarkMode ? 'dropdown-item-dark' : 'dropdown-item-light'}`}
                      >
                        <span className="text-lg nav-icon">🚪</span> Sign Out
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-1 text-gray-800 dark:text-white navbar-link-hover">
                  <span className="spin-on-hover inline-block nav-icon">🔐</span> Login
                </Link>
                <Link to="/signup" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full flex items-center transition-all duration-300 transform hover:scale-105 shadow-lg button-effect">
                  <span className="spin-on-hover inline-block mr-2 nav-icon">📝</span> Sign up
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      {isMobileMenuOpen && (
        <>
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 mobile-drawer-overlay ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden={!isMobileMenuOpen}
          />
          <div
            ref={mobileMenuRef}
            className={`fixed top-0 left-0 h-full w-[75%] max-w-xs bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out mobile-drawer ${isMobileMenuOpen ? 'open' : ''} border-r border-gray-200 dark:border-gray-700`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 h-20">
              <h2 id="mobile-menu-title" className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200 button-effect"
                aria-label="Close mobile menu"
              >
                <FontAwesomeIcon icon={faTimes} className="text-2xl" />
              </button>
            </div>
            <ul className="flex flex-col px-4 py-6 space-y-2 text-sm font-medium overflow-y-auto max-h-[calc(100vh-9rem)]">
              {mainNavItems.map(([link, icon, label]) => (
                <li key={label} role="menuitem">
                  {link.startsWith('#') ? (
                    <button
                      onClick={(e) => handleCategoryClick(e, link.slice(1))}
                      className={`w-full text-left dropdown-item ${isDarkMode ? 'dropdown-item-dark' : 'dropdown-item-light'}`}
                    >
                      <span className="text-lg">{icon}</span>
                      <span>{label}</span>
                    </button>
                  ) : (
                    <Link
                      to={link}
                      onClick={() => {
                        addToHistory(label, link);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`dropdown-item ${isDarkMode ? 'dropdown-item-dark' : 'dropdown-item-light'}`}
                    >
                      <span className="text-lg">{icon}</span>
                      <span>{label}</span>
                    </Link>
                  )}
                </li>
              ))}
              <li role="menuitem">
                <Link
                  to="/about"
                  onClick={() => {
                    addToHistory('About', '/about');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`dropdown-item ${isDarkMode ? 'dropdown-item-dark' : 'dropdown-item-light'}`}
                >
                  <span className="text-lg">ℹ️</span>
                  <span className="font-medium">About</span>
                </Link>
              </li>
              <li role="menuitem">
                <Link
                  to="/contact"
                  onClick={() => {
                    addToHistory('Contact', '/contact');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`dropdown-item ${isDarkMode ? 'dropdown-item-dark' : 'dropdown-item-light'}`}
                >
                  <span className="text-lg">📞</span>
                  <span className="font-medium">Contact</span>
                </Link>
              </li>
              <li role="menuitem">
                <button
                  onClick={() => {
                    setIsMobileToolsDropdownOpen(!isMobileToolsDropdownOpen);
                  }}
                  className={`w-full text-left dropdown-item ${isDarkMode ? 'dropdown-item-dark' : 'dropdown-item-light'} flex justify-between items-center`}
                  aria-expanded={isMobileToolsDropdownOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🧰</span>
                    <span className="font-medium">All Tools</span>
                  </div>
                  <FontAwesomeIcon icon={faCaretDown} className={`text-[10px] transform transition-transform ${isMobileToolsDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                </button>
                {isMobileToolsDropdownOpen && (
                  <ul className="pl-6 pt-2 space-y-1">
                    <li className="col-span-full px-2 pb-2">
                      <input
                        type="text"
                        placeholder="Search tools..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Search categories"
                      />
                    </li>
                    {categories.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase())).map(cat => (
                      <li key={cat.id}>
                        <button
                          onClick={(e) => handleCategoryClick(e, cat.id)}
                          className={`block w-full text-left text-sm py-1 px-2 rounded-md transition-colors duration-200 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-blue-300' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
                        >
                          {cat.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              {isLoggedIn ? (
                <>
                  <li role="menuitem">
                    <Link
                      to="/history"
                      onClick={() => {
                        addToHistory('History', '/history');
                        setIsMobileMenuOpen(false);
                      }}
                      className={`dropdown-item ${isDarkMode ? 'dropdown-item-dark' : 'dropdown-item-light'}`}
                    >
                      <span className="text-lg">📜</span>
                      <span className="font-medium">History</span>
                    </Link>
                  </li>
                  <li role="menuitem">
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full text-left dropdown-item ${isDarkMode ? 'dropdown-item-dark' : 'dropdown-item-light'}`}
                    >
                      <span className="text-lg">🚪</span>
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li role="menuitem">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`dropdown-item ${isDarkMode ? 'dropdown-item-dark' : 'dropdown-item-light'}`}
                    >
                      <span className="text-lg">🔐</span>
                      <span className="font-medium">Login</span>
                    </Link>
                  </li>
                  <li role="menuitem">
                    <Link
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md flex items-center justify-center transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
                    >
                      <span className="text-lg mr-2">📝</span> Sign up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </>
      )}
    {showBackToTop && (
  <div className="group fixed bottom-6 right-6 flex flex-col items-center z-[999]">
    {/* Tooltip */}
    <div className="relative mb-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 transform group-hover:-translate-y-1 group-focus-within:-translate-y-1">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xs px-3 py-1 rounded shadow-md">
        Back to Top
      </div>
      <div className="absolute left-1/2 -bottom-1.5 transform -translate-x-1/2 w-2 h-2 rotate-45 bg-indigo-600"></div>
    </div>

    {/* Button with animated rocket, flame, trail */}
    <div className="relative">
      {/* Smoke Trail */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-6 bg-gradient-to-b from-gray-300/60 to-transparent animate-smoke rounded-full blur-sm opacity-0 group-hover:opacity-70 group-focus-within:opacity-70 pointer-events-none" />

      {/* Flame */}
      <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-3 h-3 bg-gradient-to-b from-yellow-300 via-orange-500 to-red-600 animate-pulse rounded-full blur-sm opacity-80 group-hover:scale-110 group-hover:opacity-100 group-focus-within:opacity-100 transition-all" />

      <button
        onClick={handleBackToTop}
        title="Back to Top 🚀"
        aria-label="Back to Top"
        className={`focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gradient-to-br from-red-500 via-pink-500 to-yellow-500 p-3 rounded-full shadow-xl transition-all duration-500 transform
        ${
          showBackToTop
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
        }
        hover:scale-110 active:scale-95`}
      >
        {/* Animated SVG Rocket */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="w-6 h-6 text-white transition-all duration-500 transform group-hover:-translate-y-1 group-hover:rotate-6 group-focus:-translate-y-1 group-focus:rotate-6"
          fill="currentColor"
        >
          <path d="M477.9 15.1c-2.8-2.8-7-3.5-10.6-1.9-36.6 16.4-78.2 43.6-117.5 82.9-32 32-56.2 65.2-72.3 93.6-15.5-3.3-31.7-5.1-48.2-5.1H160c-8.8 0-16 7.2-16 16v32H96c-8.8 0-16 7.2-16 16v69.3l-70.3 70.3c-6 6-6.2 15.6-.3 21.7l64 64c6.1 6.1 15.7 5.9 21.7-.3l70.3-70.3H192c8.8 0 16-7.2 16-16v-32h32c72.4 0 119.9-27.3 152.6-60.1 39.3-39.3 66.5-80.9 82.9-117.5 1.6-3.6.9-7.8-1.9-10.6L477.9 15.1zM160 272h32v32h-32v-32z" />
        </svg>
      </button>
    </div>
  </div>
)}

    </PageWrapper>
  );
};

export default Header;  
