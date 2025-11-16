import React, { useState, useRef, useEffect } from 'react';
import { motion as m } from 'framer-motion';
import Logo from '../assets/logo.png';

export default function MobileTopNav({ categories = [], onCategorySelect = () => {}, onPicksClick = () => {} }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);

  const handleCategorySelect = (id) => {
    onCategorySelect(id);
    setDropdownOpen(false);
  };

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#1a1d3a]/98 to-[#252847]/98 backdrop-blur-xl border-b border-white/10 shadow-lg">
      {/* Navbar Container */}
      <div className="flex items-center justify-between px-4 py-3 h-16">
        {/* Left: Logo */}
        <a href="/" className="flex items-center gap-2 flex-shrink-0 group">
          <img
            src={Logo}
            alt="AI Tools Hub"
            className="w-10 h-10 rounded-lg group-hover:scale-105 transition-transform duration-200"
          />
          <span className="text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            AI Tools
          </span>
        </a>

        {/* Right: Categories Dropdown + Picks Button */}
        <div className="flex items-center gap-2">
          {/* Categories Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <m.button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
            >
              <span>Categories</span>
              <m.span
                animate={{ rotate: dropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                ▼
              </m.span>
            </m.button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <m.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full mt-2 -right-2 w-56 bg-[#1a1d3a]/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 overflow-hidden z-[100]"
              >
                <div className="max-h-72 overflow-y-auto scrollbar-hide">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-white/10 hover:text-white transition-colors duration-150 border-b border-white/5 last:border-b-0"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </m.div>
            )}
          </div>

          {/* AI Tools Picks Button */}
          <m.button
            onClick={onPicksClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600/40 to-purple-600/40 border border-blue-500/30 hover:from-blue-600/60 hover:to-purple-600/60 hover:border-blue-500/50 transition-all duration-200"
          >
            <span>⭐</span>
            <span>Picks</span>
          </m.button>
        </div>
      </div>
    </div>
  );
}
