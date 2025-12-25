import React, { useState, useRef, useEffect } from 'react';
import { motion as m } from 'framer-motion';
import { useHistory, useLocation } from 'react-router-dom';
import { FaHome, FaRegBookmark, FaPlusSquare, FaInfoCircle, FaEnvelope, FaShieldAlt, FaStar, FaNewspaper } from 'react-icons/fa';
import SidebarNavButton from './SidebarNavButton';
import AccountMenu from './AccountMenu';
import Logo from '../assets/logo.png';
import { useLanguage } from '../context/LanguageContext';

const Sidebar = () => {
  const { t } = useLanguage();
  const history = useHistory();
  const location = useLocation();
  const navRefs = useRef([]);
  const [activeNav, setActiveNav] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  // const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');
  // const [username, setUsername] = useState(() => localStorage.getItem('username') || 'User');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);


  // detect login/admin info from localStorage on mount
  useEffect(() => {
    const storedLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    const storedEmail = localStorage.getItem('email') || '';
    const adminFlag = localStorage.getItem('isAdmin') === 'true';
    const envAdmin = process.env.REACT_APP_ADMIN_EMAIL;

    setIsLoggedIn(storedLoggedIn);

    // 👇 put YOUR admin Gmail here
    const resolvedIsAdmin =
      adminFlag || // from backend/token
      (envAdmin && storedEmail === envAdmin); // from .env

    setIsAdmin(resolvedIsAdmin);
  }, []);



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



  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const effectiveOpen = isSidebarOpen || isAccountOpen;

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
        className="fixed left-0 top-0 h-full z-[100]"
        style={{ width: effectiveOpen ? '14rem' : '4.5rem', transition: 'width 0.3s cubic-bezier(.4,0,.2,1)', background: 'transparent' }}
      >
        <m.aside
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ type: 'tween', duration: 0.3 }}
          className={`relative h-full flex flex-col items-center overflow-hidden border-r border-white/10`}
          style={{
            width: effectiveOpen ? '14rem' : '4.5rem',
            minWidth: effectiveOpen ? '14rem' : '4.5rem',
            boxShadow: 'none',
            background: '#000000',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          {/* Themed background overlays to match Home with collapse fade */}
          <m.div
            className="absolute inset-0 -z-10"
            initial={false}
            animate={{ opacity: effectiveOpen ? 1 : 0.65 }}
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
          <div className="flex items-center h-16 w-full pl-4 overflow-hidden">
            <img src={Logo} alt="AI Tools Hub Logo" className="w-10 h-10 rounded-lg flex-shrink-0" />
            <m.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: effectiveOpen ? 1 : 0, x: effectiveOpen ? 12 : -10 }}
              className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent whitespace-nowrap"
            >
              AI Tools Hub
            </m.span>
          </div>

          <nav className={`relative flex-1 w-full overflow-y-auto scroll-smooth py-3 sidebar-scrollbar`} style={{ WebkitOverflowScrolling: 'touch' }}>
            {/* Primary items */}
            <SidebarNavButton
              ref={el => (navRefs.current[0] = el)}
              active={activeNav === 0}
              icon={<FaHome />}
              label={effectiveOpen ? t('nav_home') : ''}
              aria-label="Home"
              onClick={() => handleNavAction(0, () => history.push('/'))}
            />
            <SidebarNavButton
              ref={el => (navRefs.current[1] = el)}
              active={activeNav === 1}
              icon={<FaRegBookmark />}
              label={effectiveOpen ? t('nav_favorites') : ''}
              aria-label="Favorites"
              onClick={() => handleNavAction(1, () => history.push('/favorites'))}
            />

            <SidebarNavButton
              ref={el => (navRefs.current[2] = el)}
              active={activeNav === 2}
              icon={<FaPlusSquare />}
              label={effectiveOpen ? t('nav_submit') : ''}
              aria-label="Submit Tool"
              onClick={() => handleNavAction(2, () => history.push('/add-tool'))}
            />
            <SidebarNavButton
              ref={el => (navRefs.current[6] = el)}
              active={activeNav === 6}
              icon={<FaStar className="text-yellow-400" />}
              label={effectiveOpen ? t('nav_picks') : ''}
              aria-label="AI Tools Picks"
              onClick={() => handleNavAction(6, () => history.push('/#choice'))}
            />

            <SidebarNavButton
              icon={<FaNewspaper />}
              label={effectiveOpen ? t('nav_blog') : ''}
              active={location.pathname === '/blog'}
              onClick={() => {
                  history.push('/blog');
                  if (isMobile) setIsSidebarOpen(false);
              }}
            />

            <SidebarNavButton
              ref={el => (navRefs.current[4] = el)}
              active={activeNav === 4}
              icon={<FaEnvelope />}
              label={effectiveOpen ? t('nav_contact') : ''}
              aria-label="Contact Us"
              onClick={() => handleNavAction(4, () => {
                history.push('/contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              })}
            />
            <SidebarNavButton
              ref={el => (navRefs.current[5] = el)}
              active={activeNav === 5}
              icon={<FaInfoCircle />}
              label={effectiveOpen ? t('nav_about') : ''}
              aria-label="About"
              onClick={() => handleNavAction(5, () => {
                history.push('/about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              })}
            />
          </nav>

          <div className={`pb-6 flex flex-col items-center gap-2 w-full`}>
            {/* Use effectiveOpen to control compact mode but always render the same component instance to preserve state */}
            <AccountMenu 
              compact={!effectiveOpen} 
              fromSidebar={!effectiveOpen} 
              onOpenChange={setIsAccountOpen}
            />
            {isLoggedIn && isAdmin && effectiveOpen && (
              <SidebarNavButton ref={el => (navRefs.current[9] = el)} active={activeNav === 9} icon={<FaShieldAlt />} label={t('nav_admin')} aria-label="Admin Dashboard" onClick={() => handleNavAction(9, () => history.push('/admin'))} />
            )}
          </div>
        </m.aside>
      </div>
    </>
  );
};

export default Sidebar;
