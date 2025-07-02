import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faMoon, faSun, faRocket, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import Logo from '../assets/logo.png';
import './Header.css';
import PageWrapper from './PageWrapper';

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const accountRef = useRef(null);
  const accountButtonRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const closeTimeoutRef = useRef(null);
  const accountCloseTimeoutRef = useRef(null);
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && buttonRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) setIsDropdownOpen(false);

      if (
        accountRef.current && accountButtonRef.current &&
        !accountRef.current.contains(e.target) &&
        !accountButtonRef.current.contains(e.target)
      ) setIsAccountDropdownOpen(false);

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target)
      ) setIsMobileMenuOpen(false);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
  const cancelCloseDropdown = () => clearTimeout(closeTimeoutRef.current);

  const openAccountDropdown = () => {
    clearTimeout(accountCloseTimeoutRef.current);
    setIsAccountDropdownOpen(true);
  };
  const closeAccountDropdownWithDelay = () => {
    accountCloseTimeoutRef.current = setTimeout(() => setIsAccountDropdownOpen(false), 300);
  };
  const cancelCloseAccountDropdown = () => clearTimeout(accountCloseTimeoutRef.current);

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
  ];

  const scrollToSection = (id) => {
    console.log(`Attempting to scroll to section: ${id}`);
    const el = document.querySelector(`[data-category="${id}"]`);
    if (el) {
      console.log(`Found element for ${id}:`, el);
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.error(`Section with data-category="${id}" not found`);
      // Store in sessionStorage to retry after navigation
      sessionStorage.setItem('scrollToCategory', id);
    }
  };

  const handleCategoryClick = (e, id) => {
    e.preventDefault();
    console.log(`handleCategoryClick called with id: ${id}, current path: ${location.pathname}`);
    addToHistory(`Category: ${id}`, `#${id}`);
    if (location.pathname !== '/') {
      console.log(`Navigating to /#${id}`);
      history.push(`/#${id}`);
      setTimeout(() => scrollToSection(id), 500); // Increased delay for DOM rendering
    } else {
      console.log(`Already on homepage, scrolling to ${id}`);
      scrollToSection(id);
    }
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleBackToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <PageWrapper>
      <style>
        {`
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
        `}
      </style>
      <header className="fixed top-0 left-0 w-full backdrop-blur-md border-b border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 z-50">
        <nav className="flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-5 h-20">
          <Link to="/" className="flex items-center text-xl font-extrabold text-red-600 dark:text-red-400 hover:scale-105 transition-all duration-200" onClick={() => {
            window.scrollTo({ top: 0 });
            addToHistory('Home', '/');
          }}>
            <img src={Logo} alt="AI Tools Hub Logo" className="logo-img mr-2" /> AI Tools Hub
          </Link>

          {/* Mobile Hamburger */}
          <div className="sm:hidden">
            <button 
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsDropdownOpen(false);
              }} 
              className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
            >
              <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="text-xl spin-on-hover" />
            </button>
          </div>

          {/* Desktop Nav */}
          <ul className="hidden sm:flex items-center space-x-6 text-sm font-semibold">
            {[
              ['/', '🏠', 'Home'],
              ['#chatbots', '🤖', 'Chatbots'],
              ['#image-generators', '🖼️', 'Images'],
              ['#music-generators', '🎵', 'Music'],
              ['#data-analysis', '📊', 'Data'],
              ['#ai-diagrams', '📈', 'Diagrams'],
              ['#writing-tools', '✍️', 'Text'],
              ['#video-generators', '🎬', 'Video']
            ].map(([link, icon, label]) => (
              <li key={link}>
                {link.startsWith('#') ? (
                  <button 
                    onClick={(e) => handleCategoryClick(e, link.slice(1))} 
                    className="nav-item text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <span className="spin-on-hover inline-block">{icon}</span> {label}
                  </button>
                ) : (
                  <Link 
                    to={link} 
                    onClick={() => {
                      addToHistory(label, link);
                      window.scrollTo({ top: 0 });
                    }} 
                    className="nav-item text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <span className="spin-on-hover inline-block">{icon}</span> {label}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <Link to="/about" onClick={() => addToHistory('About', '/about')} className="nav-item text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                <span className="spin-on-hover inline-block">ℹ️</span> About
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => addToHistory('Contact', '/contact')} className="nav-item text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                <span className="spin-on-hover inline-block">📞</span> Contact
              </Link>
            </li>
            <li className="relative" ref={dropdownRef}>
              <button
                ref={buttonRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onMouseEnter={cancelCloseDropdown}
                onMouseLeave={closeDropdownWithDelay}
                className="nav-item flex items-center gap-1 text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
              >
                <span className="spin-on-hover inline-block">🧰</span> All Tools 
                <FontAwesomeIcon icon={faCaretDown} className="text-[10px] spin-on-hover" />
              </button>
              {isDropdownOpen && (
                <ul
                  className="absolute left-0 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 min-w-[300px] max-h-[calc(100vh-100px)] overflow-y-auto z-50 text-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-2"
                  onMouseEnter={cancelCloseDropdown}
                  onMouseLeave={closeDropdownWithDelay}
                >
                  <li className="col-span-full px-2 pb-2">
                    <input
                      type="text"
                      placeholder="Search tools..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-white"
                    />
                  </li>
                  {categories.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase())).map(cat => (
                    <li key={cat.id}>
                      <button
                        onClick={(e) => handleCategoryClick(e, cat.id)}
                        className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded"
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>

          {/* Right Side Icons */}
          <div className="hidden sm:flex items-center space-x-4 text-xs font-semibold">
            <button 
              onClick={toggleDarkMode} 
              className="text-yellow-400 dark:text-gray-200 hover:scale-110 transition-transform duration-200" 
              title="Toggle Dark Mode"
            >
              <FontAwesomeIcon icon={isDarkMode ? faMoon : faSun} className="spin-on-hover" />
            </button>
            {isLoggedIn ? (
              <div className="relative" ref={accountRef}>
                <button
                  ref={accountButtonRef}
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  onMouseEnter={cancelCloseAccountDropdown}
                  onMouseLeave={closeAccountDropdownWithDelay}
                  className="nav-item flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Account <FontAwesomeIcon icon={faCaretDown} className="text-[10px] spin-on-hover" />
                </button>
                {isAccountDropdownOpen && (
                  <ul
                    className="absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 z-50 text-sm w-32"
                    onMouseEnter={cancelCloseAccountDropdown}
                    onMouseLeave={closeAccountDropdownWithDelay}
                  >
                    <li>
                      <Link to="/history" className="block px-3 py-2 rounded-md text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                        <span className="spin-on-hover inline-block">📜</span> History
                      </Link>
                    </li>
                    <li>
                      <button 
                        onClick={handleLogout} 
                        className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <span className="spin-on-hover inline-block">🚪</span> Sign Out
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="nav-item flex items-center gap-1 text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                  <span className="spin-on-hover inline-block">🔐</span> Login
                </Link>
                <Link to="/signup" className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md flex items-center">
                  <span className="spin-on-hover inline-block">📝</span> Sign up
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Drawer with Overlay */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40" onClick={() => setIsMobileMenuOpen(false)} />
         <div
  ref={mobileMenuRef}
  className="fixed top-0 left-0 h-full w-[75%] max-w-xs bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 ease-in-out translate-x-0 overflow-y-auto max-h-screen invisible-scrollbar"
>
            <ul className="flex flex-col px-4 py-6 space-y-4 text-sm font-medium pt-20 pb-10">
              {[
                ['/', '🏠', 'Home'],
                ['#chatbots', '🤖', 'Chatbots'],
                ['#image-generators', '🖼️', 'Images'],
                ['#music-generators', '🎵', 'Music'],
                ['#data-analysis', '📊', 'Data'],
                ['#ai-diagrams', '📈', 'Diagrams'],
                ['#writing-tools', '✍️', 'Text'],
                ['#video-generators', '🎬', 'Video']
              ].map(([link, icon, label]) => (
                <li key={label}>
                  {link.startsWith('#') ? (
                    <button
                      onClick={(e) => handleCategoryClick(e, link.slice(1))}
                      className="w-full text-left flex items-center gap-2 text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <span className="spin-on-hover inline-block">{icon}</span>
                      <span>{label}</span>
                    </button>
                  ) : (
                    <Link
                      to={link}
                      onClick={() => {
                        addToHistory(label, link);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <span className="spin-on-hover inline-block">{icon}</span>
                      <span>{label}</span>
                    </Link>
                  )}
                </li>
              ))}
                            <li>
                <Link 
                  to="/about" 
                  onClick={() => { 
                    addToHistory('About', '/about'); 
                    setIsMobileMenuOpen(false); 
                  }} 
                  className="flex items-center gap-2 p-2 rounded-md text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                >
                  <span className="spin-on-hover inline-block">ℹ️</span>
                  <span className="font-medium">About</span>
                </Link>
              </li>
                            <li>
                <Link 
                  to="/contact" 
                  onClick={() => { 
                    addToHistory('Contact', '/contact'); 
                    setIsMobileMenuOpen(false); 
                  }} 
                  className="flex items-center gap-2 p-2 rounded-md text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                >
                  <span className="spin-on-hover inline-block">📞</span>
                  <span className="font-medium">Contact</span>
                </Link>
              </li>
              {isLoggedIn ? (
                <>
                  <li>
                <Link 
                  to="/history" 
                  onClick={() => { 
                    addToHistory('History', '/history'); 
                    setIsMobileMenuOpen(false); 
                  }} 
                  className="flex items-center gap-2 p-2 rounded-md text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                >
                  <span className="text-lg spin-on-hover">📜</span>
                  <span className="font-medium">History</span>
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => { 
                    handleLogout(); 
                    setIsMobileMenuOpen(false); 
                  }} 
                  className="flex items-center gap-2 w-full text-left p-2 rounded-md text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                >
                  <span className="text-lg spin-on-hover">🚪</span>
                  <span className="font-medium">Sign Out</span>
                </button>
              </li>
                </>
              ) : (
                <>
                  <li>
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="flex items-center gap-2 p-2 rounded-md text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                >
                  <span className="spin-on-hover inline-block">🔐</span>
                  <span className="font-medium">Login</span>
                </Link>
              </li>
                  <li>
                    <Link 
                      to="/signup" 
                      onClick={() => setIsMobileMenuOpen(false)} 
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md flex items-center justify-center"
                    >
                      <span className="spin-on-hover inline-block">📝</span> Sign up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </>
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={handleBackToTop}
          className="fixed bottom-6 right-6 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-all duration-200 hover:scale-110 animate-bounce z-50"
          title="Back to Top 🚀"
        >
          <FontAwesomeIcon icon={faRocket} className="text-lg spin-on-hover" />
        </button>
      )}
    </PageWrapper>
  );
};

export default Header;