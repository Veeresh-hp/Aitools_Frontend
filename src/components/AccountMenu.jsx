import React from 'react';
import { useHistory } from 'react-router-dom';
import { motion as m, AnimatePresence } from 'framer-motion';
import { FaCrown, FaUser, FaQuestionCircle, FaSignOutAlt, FaHistory, FaArrowLeft } from 'react-icons/fa';

function getInitials(nameOrEmail) {
  if (!nameOrEmail) return 'U';
  const name = nameOrEmail.replace(/@.+$/, '');
  const parts = name.split(/\s+|\.|_/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const AccountMenu = ({ compact = false }) => {
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState(0);
  const [showAuthPrompt, setShowAuthPrompt] = React.useState(false);
  const ref = React.useRef(null);
  const triggerRef = React.useRef(null);
  const username = localStorage.getItem('username') || '';
  const email = localStorage.getItem('userEmail') || '';
  const [lastUsedKey, setLastUsedKey] = React.useState(() => {
    try { return localStorage.getItem('account_last_item') || 'profile'; } catch { return 'profile'; }
  });

  React.useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const setLastUsed = (key) => { try { localStorage.setItem('account_last_item', key); } catch {} setLastUsedKey(key); };
  const go = (path, key) => { setLastUsed(key); setOpen(false); history.push(path); };
  const logout = () => {
    setOpen(false);
    try { localStorage.clear(); } catch {}
    history.push('/');
    window.location.reload();
  };

  const displayName = username || email || 'User';
  const initials = getInitials(displayName);
  const isLoggedIn = !!(username || email);
  
  // Read avatar from saved profile (data URL) each render so changes reflect immediately after save
  const [avatarError, setAvatarError] = React.useState(false);
  const avatar = React.useMemo(() => {
    try {
      const raw = localStorage.getItem('userProfile');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && parsed.avatar ? parsed.avatar : null;
    } catch {
      return null;
    }
  }, []);

  // Reset error state if avatar changes
  React.useEffect(() => { setAvatarError(false); }, [avatar]);

  // Disable body scroll when auth modal is open
  React.useEffect(() => {
    if (showAuthPrompt) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showAuthPrompt]);

  // Menu items config
  const openAuthPrompt = () => {
    setOpen(false);
    setShowAuthPrompt(true);
  };

  const items = isLoggedIn ? [
    { key: 'history', label: 'History', icon: <FaHistory className="opacity-80" />, onClick: () => go('/history', 'history') },
    { key: 'upgrade', label: 'Upgrade plan', icon: <FaCrown className="opacity-80" />, onClick: () => go('/upgrade', 'upgrade') },
    { key: 'profile', label: 'Profile', icon: <FaUser className="opacity-80" />, onClick: () => go('/profile', 'profile') },
    { key: 'help', label: 'Help', icon: <FaQuestionCircle className="opacity-80" />, onClick: () => go('/help', 'help') },
    { key: 'logout', label: 'Log out', icon: <FaSignOutAlt />, onClick: logout, danger: true },
  ] : [
    { key: 'history', label: 'History', icon: <FaHistory className="opacity-80" />, onClick: openAuthPrompt },
    { key: 'upgrade', label: 'Upgrade plan', icon: <FaCrown className="opacity-80" />, onClick: openAuthPrompt },
    { key: 'help', label: 'Help', icon: <FaQuestionCircle className="opacity-80" />, onClick: () => { setOpen(false); history.push('/help'); } },
    { key: 'login', label: 'Login', icon: <FaUser className="opacity-80" />, onClick: () => { setOpen(false); history.push('/login'); } },
    { key: 'signup', label: 'Sign Up', icon: <FaCrown className="opacity-80" />, onClick: () => { setOpen(false); history.push('/signup'); } },
  ];

  React.useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const menuRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      // Focus first actionable item & shift focus to menu container for key events
      setFocusedIndex(0);
      requestAnimationFrame(() => {
        if (menuRef.current) {
          try { menuRef.current.focus(); } catch {}
        }
      });
    }
  }, [open]);

  const onKeyDown = (e) => {
    if (!open) return;
    if (['ArrowDown','ArrowUp','Home','End'].includes(e.key)) {
      e.preventDefault();
      setFocusedIndex((prev) => {
        if (e.key === 'Home') return 0;
        if (e.key === 'End') return items.length - 1;
        const delta = e.key === 'ArrowDown' ? 1 : -1;
        return (prev + delta + items.length) % items.length;
      });
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const item = items[focusedIndex];
      if (item) item.onClick();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      if (triggerRef.current) triggerRef.current.focus();
    }
  };

  return (
    <div 
      className={`relative ${compact ? '' : 'w-full'}`} 
      ref={ref}
      onMouseLeave={() => {
        if (!compact) setOpen(false);
      }}
    >
      {!isLoggedIn ? (
        <m.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          ref={triggerRef}
          className={`${compact ? 'w-12 h-12 mx-auto' : 'w-[92%] mx-auto'} flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors font-medium text-sm`}
          onClick={() => setOpen(o => !o)}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          {compact ? '👨‍💼' : '👨‍💼 Account'}
          <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
        </m.button>
      ) : compact ? (
        <button
          ref={triggerRef}
          className="w-12 h-12 mx-auto flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-colors"
          onClick={() => setOpen(o => !o)}
          aria-haspopup="menu"
          aria-expanded={open}
          title={displayName}
        >
          {avatar && !avatarError ? (
            <img
              src={avatar}
              alt={displayName}
              className={`w-7 h-7 rounded-full object-cover transition-all ${open ? 'ring-2 ring-indigo-400/70 ring-offset-2 ring-offset-black/40' : ''}`}
              onError={() => setAvatarError(true)}
            />
          ) : (
            <span className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold">
              {initials}
            </span>
          )}
        </button>
      ) : (
        <button
          ref={triggerRef}
          className="w-[92%] mx-auto flex items-center justify-between gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-2 rounded-xl transition-colors"
          onClick={() => setOpen(o => !o)}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <span className="flex items-center gap-3">
            {avatar && !avatarError ? (
              <img
                src={avatar}
                alt={displayName}
                className={`w-8 h-8 rounded-full object-cover transition-all ${open ? 'ring-2 ring-indigo-400/70 ring-offset-2 ring-offset-[#1a1d3a]' : ''}`}
                onError={() => setAvatarError(true)}
              />
            ) : (
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                {initials}
              </span>
            )}
            <span className="text-sm truncate max-w-[8rem]">{displayName}</span>
          </span>
          <span className={`transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
        </button>
      )}

      <AnimatePresence mode="wait">
        {open && (
          <m.div
            initial={{ opacity: 0, scale: 0.92, y: compact ? -8 : 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: compact ? -8 : 8 }}
            transition={{ duration: 0.08, ease: 'easeOut' }}
            onKeyDown={onKeyDown}
            ref={menuRef}
            tabIndex={0}
className={`${
  compact
    ? [
        'fixed',
        'bottom-24',
        'left-1/2',
        '-translate-x-1/2',
        'w-56',
        'max-h-[70vh]',
        'overflow-y-auto',
        'pointer-events-auto',
        'mr-3'
      ].join(' ')
    : [
        'absolute',
        'bottom-12',
        'left-3',
        'right-3',
        'pointer-events-auto'
      ].join(' ')
} 
bg-gradient-to-b
from-purple-900/60
via-indigo-900/50
to-slate-900/95
border border-indigo-400/30
rounded-lg
shadow-2xl
backdrop-blur-md
p-3
z-[200]`}
            role="menu"
          >
          {isLoggedIn && email && (
            <div className="px-3 py-2 text-xs text-gray-400 border-b border-white/5 mb-2 truncate font-medium">
              {email}
            </div>
          )}
          <div className={`space-y-1 ${isLoggedIn && email ? '' : ''}`}>
            {items.map((item, idx) => (
              <m.button
                key={item.key}
                role="menuitem"
                tabIndex={-1}
                data-idx={idx}
                onMouseEnter={() => setFocusedIndex(idx)}
                onClick={item.onClick}
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all relative group ${
                  item.danger ? 'text-red-400 hover:bg-red-500/15' : 'text-gray-100 hover:bg-white/10'
                } ${focusedIndex === idx ? 'bg-white/15' : ''}`}
              >
                <span className="text-lg opacity-70 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                <span className="font-medium flex-1">{item.label}</span>
                <div className="w-16 flex justify-end">
                  {lastUsedKey === item.key && isLoggedIn && (
                    <span className="text-xs bg-blue-500/40 px-2 py-1 rounded text-blue-200 whitespace-nowrap">Recent</span>
                  )}
                </div>
              </m.button>
            ))}
          </div>
        </m.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAuthPrompt && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowAuthPrompt(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-center justify-center p-4"
          >
            <m.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl border border-white/10 w-full max-w-[340px] sm:max-w-md p-8 sm:p-10 relative"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)'
              }}
            >
              <button
                onClick={() => setShowAuthPrompt(false)}
                className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                aria-label="Go back"
              >
                <FaArrowLeft className="text-lg" />
              </button>
              
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 text-center tracking-tight">
                Sign In Required
              </h3>
              <p className="text-gray-300/90 mb-8 text-center text-sm sm:text-base leading-relaxed">
                Please sign in or create an account to access this feature.
              </p>
              
              <div className="flex gap-3 w-full mb-5">
                <m.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setShowAuthPrompt(false); history.push('/login'); }}
                  className="flex-1 px-6 py-3.5 bg-white/5 hover:bg-white/10 border-2 border-white/20 hover:border-white/30 text-white rounded-xl font-semibold transition-all text-sm sm:text-base"
                >
                  Login
                </m.button>
                <m.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setShowAuthPrompt(false); history.push('/signup'); }}
                  className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all shadow-lg text-sm sm:text-base"
                >
                  Sign Up
                </m.button>
              </div>
              
              <button
                onClick={() => setShowAuthPrompt(false)}
                className="w-full text-center text-gray-400 hover:text-white transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccountMenu;
