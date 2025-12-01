import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion as m } from 'framer-motion';
import { useHistory } from 'react-router-dom';
import { FaHome, FaRegBookmark, FaPlusSquare, FaThLarge, FaInfoCircle, FaEnvelope, FaSignInAlt, FaUserPlus, FaUser, FaSignOutAlt, FaShieldAlt, FaStar } from 'react-icons/fa';
import SidebarNavButton from './SidebarNavButton';
import AccountMenu from './AccountMenu';
import Logo from '../assets/logo.png';

import { CATEGORY_IDS, formatCategoryLabel } from '../utils/categories';

const Sidebar = () => {
  const history = useHistory();
  const navRefs = useRef([]);
  const [activeNav, setActiveNav] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  // const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');
  // const [username, setUsername] = useState(() => localStorage.getItem('username') || 'User');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('User');
  const [email, setEmail] = useState('');

  // detect login/admin info from localStorage on mount
  useEffect(() => {
    const storedLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedUsername = localStorage.getItem('username') || 'User';
    const storedEmail = localStorage.getItem('email') || '';
    const adminFlag = localStorage.getItem('isAdmin') === 'true';
    const envAdmin = process.env.REACT_APP_ADMIN_EMAIL;

    setIsLoggedIn(storedLoggedIn);
    setUsername(storedUsername);
    setEmail(storedEmail);

    // 👇 put YOUR admin Gmail here
    const HARDCODED_ADMIN_EMAIL = 'veereshhp2004@gmail.com';

    const resolvedIsAdmin =
      adminFlag || // from backend/token
      (envAdmin && storedEmail === envAdmin) || // from .env
      storedEmail === HARDCODED_ADMIN_EMAIL;    // hardcoded fallback

    setIsAdmin(resolvedIsAdmin);
  }, []);

  const [showCategories, setShowCategories] = useState(false);
  const [dropdownFocusIndex, setDropdownFocusIndex] = useState(0);
  const dropdownRef = useRef(null);
  const allToolsBtnRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen for a global event so other components (like Home) can open the sidebar on mobile
  useEffect(() => {
    const openHandler = () => setIsSidebarOpen(true);
    window.addEventListener('ai-sidebar-open', openHandler);
    return () => window.removeEventListener('ai-sidebar-open', openHandler);
  }, []);

  // Debounced scroll to avoid rapid spamming causing layout thrash
  const scrollToCategory = useCallback((id) => {
    if (!id) return;
    if (scrollToCategory._t) clearTimeout(scrollToCategory._t);
    scrollToCategory._t = setTimeout(() => {
      // Route + hash syncing so it works from any page
      const targetPath = id === 'all' ? '/' : `/#${id}`;
      try {
        history.push(targetPath);
      } catch { }
      // Close dropdown; Home.jsx listens to location.hash and will perform smooth scroll
      setShowCategories(false);
      // Optionally close sidebar on mobile for better UX
      if (isMobile) setIsSidebarOpen(false);
    }, 80);
  }, [history, isMobile]);

  // Persist sidebar open state
  useEffect(() => {
    const stored = localStorage.getItem('sidebarOpen');
    if (stored === 'true') setIsSidebarOpen(true);
  }, []);
  useEffect(() => {
    localStorage.setItem('sidebarOpen', isSidebarOpen ? 'true' : 'false');
    // Broadcast sidebar state so other components (e.g., Home sticky nav) can adjust layout
    try {
      window.dispatchEvent(new CustomEvent('sidebar-state', { detail: { open: isSidebarOpen } }));
    } catch { }
  }, [isSidebarOpen]);

  // Keyboard navigation & focus trap for dropdown
  useEffect(() => {
    if (!showCategories) return;
    const handleKey = (e) => {
      if (!showCategories) return;
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
        setDropdownFocusIndex(prev => {
          let next = prev;
          if (e.key === 'ArrowDown') next = (prev + 1) % CATEGORY_IDS.length;
          else if (e.key === 'ArrowUp') next = (prev - 1 + CATEGORY_IDS.length) % CATEGORY_IDS.length;
          else if (e.key === 'Home') next = 0;
          else if (e.key === 'End') next = CATEGORY_IDS.length - 1;
          return next;
        });
      } else if (e.key === 'Escape') {
        setShowCategories(false);
        // Return focus to the trigger button
        if (allToolsBtnRef.current) {
          allToolsBtnRef.current.focus();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        scrollToCategory(CATEGORY_IDS[dropdownFocusIndex]);
      } else if (e.key === 'Tab') {
        // trap focus inside dropdown while open
        e.preventDefault();
        setDropdownFocusIndex(prev => (prev + (e.shiftKey ? -1 : 1) + CATEGORY_IDS.length) % CATEGORY_IDS.length);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showCategories, dropdownFocusIndex, scrollToCategory]);

  useEffect(() => {
    if (!showCategories) return;
    const buttons = dropdownRef.current?.querySelectorAll('button[data-cat]');
    if (buttons && buttons[dropdownFocusIndex]) {
      buttons[dropdownFocusIndex].focus();
    }
  }, [dropdownFocusIndex, showCategories]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsAdmin(false);
    history.push('/');
    window.location.reload();
  };

  const handleNavAction = (index, action) => {
    try {
      setActiveNav(index);
      if (typeof action === 'function') action();
      setTimeout(() => {
        const el = navRefs.current[index];
        if (el && typeof el.scrollIntoView === 'function') {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 80);
    } catch (err) {
      console.error('handleNavAction error', err);
    }
  };

  return (
    <>
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <div
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
        className="fixed left-0 top-0 h-full z-50"
        style={{ width: isSidebarOpen ? '16rem' : '4.5rem', transition: 'width 0.3s cubic-bezier(.4,0,.2,1)', background: 'transparent' }}
      >
        <m.aside
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ type: 'tween', duration: 0.3 }}
          className={`relative h-full flex flex-col items-center overflow-hidden border-r border-white/10`}
          style={{
            width: isSidebarOpen ? '16rem' : '4.5rem',
            minWidth: isSidebarOpen ? '16rem' : '4.5rem',
            boxShadow: 'none',
            borderRight: 'none',
            padding: 0,
            scrollBehavior: 'smooth',
            background: 'linear-gradient(180deg, #1a1d3a 0%, #202449 40%, #151833 100%)'
          }}
        >
          {/* Themed background overlays to match Home with collapse fade */}
          <m.div
            className="absolute inset-0 -z-10"
            initial={false}
            animate={{ opacity: isSidebarOpen ? 1 : 0.65 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Radial glows */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#2753ff1a_0%,transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_#7c3aed1a_0%,transparent_55%)]" />
            {/* Subtle grid */}
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.12) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.12) 1px,transparent 1px)', backgroundSize: '38px 38px' }} />
            {/* Soft orbs */}
            <div className="absolute -left-8 top-24 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute -right-10 bottom-24 w-36 h-36 bg-purple-500/10 rounded-full blur-3xl" />
          </m.div>
          <div className="flex flex-col items-center gap-3 py-6" style={{ width: '100%' }}>
            <img src={Logo} alt="AI Tools Hub Logo" className="w-12 h-12 rounded-lg" />
            {isSidebarOpen && (
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent text-center">
                AI Tools Hub
              </span>
            )}
          </div>

          <nav className={`relative flex-1 w-full overflow-y-auto scroll-smooth py-3 sidebar-scrollbar`} style={{ WebkitOverflowScrolling: 'touch' }}>
            {/* Primary items */}
            <SidebarNavButton
              ref={el => (navRefs.current[0] = el)}
              active={activeNav === 0}
              icon={<FaHome />}
              label={isSidebarOpen ? 'Home' : ''}
              aria-label="Home"
              onClick={() => handleNavAction(0, () => history.push('/'))}
            />
            <SidebarNavButton
              ref={el => (navRefs.current[1] = el)}
              active={activeNav === 1}
              icon={<FaRegBookmark />}
              label={isSidebarOpen ? 'Favorites' : ''}
              aria-label="Favorites"
              onClick={() => handleNavAction(1, () => history.push('/favorites'))}
            />
            <SidebarNavButton
              ref={el => (navRefs.current[2] = el)}
              active={activeNav === 2}
              icon={<FaPlusSquare />}
              label={isSidebarOpen ? 'Submit Tool' : ''}
              aria-label="Submit Tool"
              onClick={() => handleNavAction(2, () => history.push('/add-tool'))}
            />
            <SidebarNavButton
              ref={el => (navRefs.current[6] = el)}
              active={activeNav === 6}
              icon={<FaStar className="text-yellow-400" />}
              label={isSidebarOpen ? 'AI Tools Picks' : ''}
              aria-label="AI Tools Picks"
              onClick={() => handleNavAction(6, () => history.push('/#choice'))}
            />
            {/* All Tools with hover categories */}
            <div
              className="relative"
              onMouseEnter={() => { if (!isMobile) { setShowCategories(true); setDropdownFocusIndex(0); } }}
              onMouseLeave={() => { if (!isMobile) setShowCategories(false); }}
            >
              <SidebarNavButton
                ref={el => { navRefs.current[3] = el; allToolsBtnRef.current = el; }}
                active={activeNav === 3}
                icon={<FaThLarge />}
                label={isSidebarOpen ? 'All Tools' : ''}
                aria-label="All Tools"
                onClick={() => handleNavAction(3, () => {
                  if (isMobile) {
                    setShowCategories(v => !v);
                    setDropdownFocusIndex(0);
                  } else {
                    scrollToCategory('all');
                  }
                })}
                aria-haspopup="menu"
                aria-expanded={showCategories}
                aria-controls="sidebar-categories"
                onKeyDown={(e) => {
                  if (['Enter', ' '].includes(e.key)) {
                    e.preventDefault();
                    setShowCategories((v) => !v);
                    setDropdownFocusIndex(0);
                  } else if (e.key === 'ArrowRight') {
                    setShowCategories(true);
                    setDropdownFocusIndex(0);
                  }
                }}
              />
              {/* Dropdown */}
              {showCategories && (
                <m.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className={`${isMobile
                    ? 'absolute top-full left-2 right-2 mt-2 w-auto z-[60]'
                    : 'absolute top-0 left-full ml-2 w-64'
                    } max-h-[70vh] overflow-y-auto rounded-xl shadow-2xl backdrop-blur-md border border-white/10 p-3 flex flex-col gap-1 bg-gradient-to-br from-[#1a1d3a]/95 via-[#202449]/90 to-[#151833]/95`}
                  ref={dropdownRef}
                  role="menu"
                  aria-label="Tool categories"
                  id="sidebar-categories"
                >
                  <p className="text-xs uppercase tracking-wide text-gray-400 px-2">Categories</p>
                  {CATEGORY_IDS.map(cat => (
                    <button
                      key={cat}
                      data-cat={cat}
                      onClick={() => scrollToCategory(cat)}
                      className="group flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg bg-white/0 hover:bg-white/5 focus:bg-white/10 outline-none transition-colors text-sm text-gray-300 hover:text-white focus:text-white focus-visible:ring-2 focus-visible:ring-indigo-400/60"
                      tabIndex={dropdownFocusIndex === CATEGORY_IDS.indexOf(cat) ? 0 : -1}
                      role="menuitem"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 group-hover:scale-125 transition-transform" />
                      <span className="truncate">{formatCategoryLabel(cat)}</span>
                    </button>
                  ))}
                </m.div>
              )}
            </div>
            <SidebarNavButton
              ref={el => (navRefs.current[4] = el)}
              active={activeNav === 4}
              icon={<FaEnvelope />}
              label={isSidebarOpen ? 'Contact Us' : ''}
              aria-label="Contact Us"
              onClick={() => handleNavAction(4, () => history.push('/contact'))}
            />
            <SidebarNavButton
              ref={el => (navRefs.current[5] = el)}
              active={activeNav === 5}
              icon={<FaInfoCircle />}
              label={isSidebarOpen ? 'About' : ''}
              aria-label="About"
              onClick={() => handleNavAction(5, () => history.push('/about'))}
            />
          </nav>

          <div className={`pb-6 flex flex-col items-center gap-2 w-full`}>
            {isSidebarOpen ? (
              <AccountMenu />
            ) : (
              <AccountMenu compact />
            )}
            {isLoggedIn && isAdmin && isSidebarOpen && (
              <SidebarNavButton ref={el => (navRefs.current[9] = el)} active={activeNav === 9} icon={<FaShieldAlt />} label={'Admin Dashboard'} aria-label="Admin Dashboard" onClick={() => handleNavAction(9, () => history.push('/admin'))} />
            )}
          </div>
        </m.aside>
      </div>
    </>
  );
};

export default Sidebar;
