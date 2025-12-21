import React, { useState, useRef, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import Logo from '../assets/logo.png';

import { FaStar, FaSearch, FaArrowLeft, FaTimes } from 'react-icons/fa';

export default function MobileTopNav({ 
    categories = [], 
    onCategorySelect = () => { }, 
    onChoiceClick = () => { }, 
    onLogoClick = () => { },
    searchQuery = '',
    onSearchChange = () => {} 
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

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

  // Focus search input when opening
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
        setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [isSearchOpen]);

  const handleCategorySelect = (id) => {
    onCategorySelect(id);
    setDropdownOpen(false);
  };

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-[1000] bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-lg transition-all duration-300">
      {/* Navbar Container */}
      <div className="flex items-center justify-between px-4 py-3 h-16 relative">
        
        <AnimatePresence mode="wait">
            {isSearchOpen ? (
                /* Search Bar Mode */
                <m.div 
                    key="search-bar"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center px-4 gap-3 bg-black/95"
                >
                    <button 
                        onClick={() => {
                            setIsSearchOpen(false);
                            onSearchChange({ target: { value: '' } }); // Optional: clear search on close? Maybe not.
                        }}
                        className="p-2 -ml-2 text-gray-400 hover:text-white"
                    >
                        <FaArrowLeft />
                    </button>
                    <form 
                        className="flex-1 relative"
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (searchInputRef.current) searchInputRef.current.blur();
                        }}
                    >
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            enterKeyHint="search"
                            value={searchQuery}
                            onChange={onSearchChange}
                            placeholder="Search tools..."
                            className="w-full bg-white/10 border border-white/10 rounded-xl pl-9 pr-8 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B00]/50"
                        />
                        {searchQuery && (
                            <button 
                                type="button"
                                onClick={() => onSearchChange({ target: { value: '' } })}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500"
                            >
                                <FaTimes className="text-xs" />
                            </button>
                        )}
                    </form>
                </m.div>
            ) : (
                /* Standard Mode */
                <m.div 
                    key="standard-nav"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between w-full"
                >
                    {/* Left: Logo */}
                    <button onClick={onLogoClick} className="flex items-center gap-2 flex-shrink-0 group">
                    <img
                        src={Logo}
                        alt="AI Tools Hub"
                        className="w-10 h-10 rounded-lg group-hover:scale-105 transition-transform duration-200"
                    />
                    <span className="text-base font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        AI Tools
                    </span>
                    </button>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                        {/* Search Trigger */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="p-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <FaSearch />
                        </button>

                        {/* Categories Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <m.button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
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
                                className="absolute top-full mt-2 -right-2 w-64 bg-[#0F0F0F] backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-[2000] p-2"
                            >
                                <div className="max-h-[60vh] overflow-y-auto scrollbar-hide space-y-1">
                                {categories.map((cat) => (
                                    <button
                                    key={cat.id}
                                    onClick={() => handleCategorySelect(cat.id)}
                                    className="w-full text-left px-4 py-3 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white rounded-xl transition-all duration-200"
                                    >
                                    {cat.label}
                                    </button>
                                ))}
                                </div>
                            </m.div>
                            )}
                        </div>

                        {/* AI Picks Button - Hidden on very small screens if needed, but keeping for now */}
                        <m.button
                            onClick={onChoiceClick}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-[#FF6B00] border border-orange-500/30 hover:bg-[#ff8533] hover:border-orange-400/50 transition-all duration-200 shadow-lg shadow-orange-500/20"
                        >
                            <FaStar className="text-yellow-400 animate-pulse text-xs" />
                            {/* Shorten label or hide text on small screens if needed */}
                            <span className="hidden sm:inline">Picks</span>
                            <span className="sm:hidden">Top</span>
                        </m.button>
                    </div>
                </m.div>
            )}
        </AnimatePresence>
      </div>
    </header>
  );
}
