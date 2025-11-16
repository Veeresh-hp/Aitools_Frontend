import React, { useState, useCallback, useEffect, useRef } from 'react';
import { FaHome, FaSearch, FaPlus, FaUser, FaHeart, FaEnvelope, FaInfoCircle, FaHistory, FaCheck, FaChevronDown } from 'react-icons/fa';
import { useHistory, useLocation } from 'react-router-dom';
import { motion as m } from 'framer-motion';
import AccountMenu from './AccountMenu';

// Mobile bottom navigation bar styled per provided design reference.
// Appears only on screens < 768px.
// Central action button (Add) elevated with purple theme.

const QUICK_KEY = 'mobileQuickSlot';
const QUICK_OPTIONS = {
  favorites: { key: 'favorites', label: 'Favorites', to: '/favorites', icon: <FaHeart /> },
  contact:   { key: 'contact',   label: 'Contact',   to: '/contact',   icon: <FaEnvelope /> },
  about:     { key: 'about',     label: 'About',     to: '/about',     icon: <FaInfoCircle /> },
  history:   { key: 'history',   label: 'History',   to: '/history',   icon: <FaHistory /> },
};

const baseItems = [
  { key: 'home', label: 'Home', icon: <FaHome />, to: '/' },
  { key: 'search', label: 'Search', icon: <FaSearch />, action: 'search' }, // custom action
  { key: 'add', label: 'Add', icon: <FaPlus />, to: '/add-tool', center: true },
  // slot replaced by dynamic quick action
  { key: 'quick' },
  { key: 'profile', label: 'Profile', icon: <FaUser />, to: '/profile' }
];

export default function MobileBottomNav() {
  const history = useHistory();
  const location = useLocation();
  const [showQuickSheet, setShowQuickSheet] = useState(false);
  const firstOptionRef = useRef(null);
  const optionRefs = useRef([]);
  const quickBtnRef = useRef(null);
  const navigatingRef = useRef(false);
  const [quickKey, setQuickKey] = useState(() => {
    try {
      return localStorage.getItem(QUICK_KEY) || 'favorites';
    } catch { return 'favorites'; }
  });
  const activePath = location.pathname;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const quick = QUICK_OPTIONS[quickKey] || QUICK_OPTIONS.favorites;

  const navigateTo = useCallback((to) => {
    try {
      history.push(to);
    } catch {}
    // Fallback: if route didn't change soon, force navigation
    setTimeout(() => {
      try {
        if (window.location.pathname !== to) {
          window.location.assign(to);
        }
      } catch {}
    }, 150);
  }, [history]);

  const selectQuickAndNavigate = useCallback((opt) => {
    if (!opt) return;
    if (navigatingRef.current) return;
    navigatingRef.current = true;
    setQuickKey(opt.key);
    try { localStorage.setItem(QUICK_KEY, opt.key); } catch {}
    // Close first for better mobile UX, then navigate on next tick
    setShowQuickSheet(false);
    setTimeout(() => {
      navigateTo(opt.to);
      navigatingRef.current = false;
    }, 120);
  }, [navigateTo]);

  const handleSearch = useCallback(() => {
    // Navigate to home first if not already there
    if (location.pathname !== '/') {
      history.push('/');
      // Wait for navigation, then scroll to search bar
      setTimeout(() => {
        const searchInput = document.getElementById('hero-search-input');
        if (searchInput) {
          searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => searchInput.focus(), 300);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 200);
    } else {
      // Already on home page, just scroll to search
      const searchInput = document.getElementById('hero-search-input');
      if (searchInput) {
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => searchInput.focus(), 300);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [location.pathname, history]);

  const handleExploreTools = useCallback(() => {
    // Navigate to home and scroll to explore section
    history.push('/');
    setTimeout(() => {
      const el = document.querySelector('[data-category="all"]') || document.querySelector('[class*="Browse"]');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
  }, [history]);

  // Close menu if route changed by any means
  useEffect(() => {
    if (showQuickSheet) setShowQuickSheet(false);
  }, [location.pathname, showQuickSheet]);

  // Body scroll lock when popover open
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (showQuickSheet) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = prev || '';
    return () => { document.body.style.overflow = prev || ''; };
  }, [showQuickSheet]);

  // Focus first option on open
  useEffect(() => {
    if (showQuickSheet && firstOptionRef.current) {
      firstOptionRef.current.focus();
    }
  }, [showQuickSheet]);

  // keyboard navigation inside menu
  const onMenuKeyDown = (e) => {
    if (!showQuickSheet) return;
    const refs = optionRefs.current.filter(Boolean);
    const idx = refs.findIndex((r) => r === document.activeElement);
    if (e.key === 'Escape') {
      e.preventDefault();
      setShowQuickSheet(false);
      if (quickBtnRef.current) quickBtnRef.current.focus();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = refs[(idx + 1 + refs.length) % refs.length];
      next && next.focus();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = refs[(idx - 1 + refs.length) % refs.length];
      prev && prev.focus();
    }
    if (e.key === 'Home') {
      e.preventDefault();
      refs[0] && refs[0].focus();
    }
    if (e.key === 'End') {
      e.preventDefault();
      refs[refs.length - 1] && refs[refs.length - 1].focus();
    }
  };

  // Only render UI on mobile; hooks above must run unconditionally for all renders
  if (!isMobile) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-3 pointer-events-none">
      <nav
        className="relative w-[94%] max-w-xl rounded-3xl bg-white/90 dark:bg-white/10 backdrop-blur-xl shadow-lg flex items-center justify-between px-4 py-2 pointer-events-auto border border-gray-300/40 dark:border-white/10"
        role="navigation"
        aria-label="Mobile bottom navigation"
      >
        {baseItems.map(item => {
          // build dynamic quick item
          if (item.key === 'quick') {
            const isActive = activePath.startsWith(quick.to);
            const baseClasses = 'flex flex-col items-center justify-center flex-1 text-xs font-medium select-none';
            const activeClasses = isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-300';
            return (
              <div key="quick" className="flex-1 flex items-center justify-center relative">
                <button
                  ref={quickBtnRef}
                  onClick={() => navigateTo(quick.to)}
                  onTouchStart={() => navigateTo(quick.to)}
                  aria-label={`Open ${quick.label}`}
                  className={`${baseClasses} ${activeClasses} h-full py-2 transition-colors`}
                >
                  <span className={`text-xl mb-1 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-300'}`}>{quick.icon}</span>
                  <span>{quick.label}</span>
                  {isActive && (
                    <span className="mt-1 h-1 w-10 rounded-full bg-gray-300 dark:bg-white/20" />
                  )}
                </button>
                {/* Removed quick-action dropdown trigger per request */}
              </div>
            );
          }
          const isActive = item.action 
            ? false // Custom actions don't have an "active" state
            : (item.to === '/'
              ? activePath === '/'
              : activePath.startsWith(item.to));
          const baseClasses = 'flex flex-col items-center justify-center flex-1 text-xs font-medium select-none';
          const activeClasses = isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-300';

          if (item.center) {
            return (
              <div key={item.key} className="flex-1 flex items-center justify-center relative">
                <m.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => history.push(item.to)}
                  aria-label={item.label}
                  className="relative -mt-10 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-xl flex items-center justify-center ring-4 ring-white dark:ring-[#1a1d3a]"
                >
                  <span className="text-2xl">{item.icon}</span>
                </m.button>
              </div>
            );
          }

          // Use AccountMenu for profile item
          if (item.key === 'profile') {
            return (
              <div key={item.key} className="flex-1 flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center py-2">
                  <AccountMenu compact={true} />
                </div>
              </div>
            );
          }

          return (
            <button
              key={item.key}
              onClick={() => {
                if (item.action === 'search') {
                  handleSearch();
                } else if (item.to) {
                  history.push(item.to);
                }
              }}
              aria-label={item.label}
              className={`${baseClasses} ${activeClasses} h-full py-2 transition-colors`}
            >
              <span className={`text-xl mb-1 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-300'}`}>{item.icon}</span>
              <span>{item.label}</span>
              {isActive && (
                <span className="mt-1 h-1 w-10 rounded-full bg-gray-300 dark:bg-white/20" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick selection popover removed per request */}
    </div>
  );
}
