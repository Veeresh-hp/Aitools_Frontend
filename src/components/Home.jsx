import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion as m, LazyMotion, domAnimation, LayoutGroup } from 'framer-motion';
import toolsData from '../data/toolsData';
import ToolCard from './ToolCard';
import { FaSearch } from 'react-icons/fa';
import Fuse from 'fuse.js';
import { Player } from '@lottiefiles/react-lottie-player';
import fireAnim from '../assets/fire.json';

const Home = ({ openModal }) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');
  const debounceRef = useRef(null);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const rawUsername = localStorage.getItem('username');
  const username = rawUsername && rawUsername.trim() !== '' ? rawUsername : null;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatName = (name) => name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Guest';
  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : 'G';
  const displayName = formatName(username);

  const toolList = toolsData.flatMap(category =>
    category.tools.map(tool => ({ name: tool.name, category: category.id }))
  );

  const fuse = new Fuse(toolList, {
    keys: ['name'],
    threshold: 0.3,
  });

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim()) {
        const results = fuse.search(value).map(r => r.item);
        setSuggestions(results.slice(0, 5));
      } else {
        setSuggestions([]);
      }
    }, 250);
  };

  const handleSearch = () => {
    setActiveFilter('all');
    setSuggestions([]);
  };

  const handleFilter = (category) => {
    setActiveFilter(category);
    setSearchQuery('');
    setSuggestions([]);
  };

  const filteredTools = toolsData
    .map((category) => ({
      ...category,
      tools: category.tools.filter((tool) => {
        const matchesSearch = searchQuery
          ? tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
        const matchesFilter = activeFilter === 'all' || category.id === activeFilter;
        return matchesSearch && matchesFilter;
      }),
    }))
    .filter((category) => category.tools.length > 0);

  useEffect(() => {
    if (window.innerWidth < 480) setDisplayedPlaceholder('Search tools...');
    else {
      const fullText = 'Search tools...';
      let currentIndex = 0;
      const interval = setInterval(() => {
        setDisplayedPlaceholder(prev => {
          if (currentIndex < fullText.length) {
            const next = prev + fullText[currentIndex];
            currentIndex++;
            return next;
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    const scrollToCategory = () => {
      const id = location.hash?.replace('#', '');
      if (id) {
        const el = document.querySelector(`[data-category="${id}"]`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else setTimeout(() => {
          const retryEl = document.querySelector(`[data-category="${id}"]`);
          if (retryEl) retryEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
      }
    };
    scrollToCategory();
  }, [location.hash]);

  const trendingTools = toolsData.flatMap(c =>
    c.tools.filter(t => t.badge === 'Recommended').map(t => ({ ...t, category: c.id }))
  );
  const newTools = toolsData.flatMap(c =>
    c.tools.filter(t => t.isNew).map(t => ({ ...t, category: c.id }))
  );

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative overflow-hidden bg-gradient-to-br from-pink-100 via-blue-100 to-emerald-100 dark:from-gray-800 dark:via-gray-900 dark:to-black">
        
        {/* Floating Emoji Particles */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <m.span
              key={i}
              className="absolute text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ y: ['0%', '-100%'], opacity: [1, 0] }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: 'easeInOut',
              }}
            >
              {['🔥', '✨', '💡', '🎯', '🧠'][i % 5]}
            </m.span>
          ))}
        </div>

        {/* Hero Section */}
        <section className="text-center px-4 sm:px-6 py-20 relative z-10">
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 text-gray-900 dark:text-white">
            Welcome to <span className="text-red-600">AI Tools Hub</span>
          </h1>
          {isLoggedIn && (
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-600 text-white font-bold flex items-center justify-center">
                {getInitial(username)}
              </div>
              <p className="text-xl text-gray-700 dark:text-gray-300">
                {getGreeting()}, <span className="font-semibold">{displayName}</span>!
              </p>
            </div>
          )}
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
            Discover powerful, curated AI tools to boost your productivity and creativity.
          </p>
          <m.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="relative bg-red-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-red-700 transition duration-300 overflow-hidden"
            onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="relative z-10">🚀 Explore Tools</span>
            <span className="absolute top-0 left-0 w-full h-full bg-white opacity-10 animate-shimmer" />
          </m.button>
        </section>

        {/* 🔥 Trending Tools */}
        {trendingTools.length > 0 && (
          <m.section
            className="mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center items-center gap-2 mb-4">
              <div className="w-6 h-6">
                <Player autoplay loop src={fireAnim} style={{ height: '100%', width: '100%' }} />
              </div>
              <h3 className="text-xl font-bold text-yellow-600 dark:text-yellow-400">Trending Tools</h3>
            </div>
            <div className="overflow-hidden">
              <div className="flex gap-4 animate-marquee whitespace-nowrap px-4 py-2">
                {trendingTools.map((tool, index) => (
                  <div key={index} className="min-w-[220px] max-w-[240px]">
                    <ToolCard tool={tool} openModal={openModal} />
                  </div>
                ))}
              </div>
            </div>
          </m.section>
        )}

        {/* 🆕 New Tools */}
        {newTools.length > 0 && (
          <m.section
            className="mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center items-center gap-2 mb-4">
              <m.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-green-600 dark:text-green-400 text-xl"
              >
                🆕
              </m.span>
              <h3 className="text-xl font-bold text-green-600 dark:text-green-400">New Tools</h3>
            </div>
            <div className="overflow-hidden">
              <div className="flex gap-4 animate-marquee whitespace-nowrap px-4 py-2">
                {newTools.map((tool, index) => (
                  <div key={index} className="min-w-[220px] max-w-[240px]">
                    <ToolCard tool={tool} openModal={openModal} />
                  </div>
                ))}
              </div>
            </div>
          </m.section>
        )}
        {/* 🔍 Search, Filter, and Grid */}
        <section id="tools" className="relative z-10 px-4 sm:px-6 py-10">
          {/* SEARCH INPUT */}
         <m.div className="flex flex-col sm:flex-row items-center justify-center mb-6 gap-2 sm:gap-0 relative w-full sm:w-auto">
  <div
    className={`relative transition-all duration-300 ease-in-out rounded-full w-full rotating-border ${
      isSearchFocused || isHovered || searchQuery.length > 0
        ? 'sm:w-[28rem]'
        : 'sm:w-[18rem]'
    }`}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    <FaSearch className="absolute left-3 top-3 text-gray-400 pointer-events-none z-10" />
    <input
      type="text"
      id="search"
      placeholder="Search tools..."
      className={`w-full pl-10 pr-10 py-2 text-sm border rounded-full bg-white dark:bg-gray-800 relative z-10
        text-gray-900 dark:text-white focus:outline-none transition-all duration-300
        ${isSearchFocused ? 'ring-2 ring-blue-500 shadow-lg' : 'border-gray-300 dark:border-gray-700'}
      `}
      value={searchQuery}
      onFocus={() => setIsSearchFocused(true)}
      onBlur={() => {
        setTimeout(() => {
          if (!isHovered && searchQuery.trim() === '') setIsSearchFocused(false);
        }, 150);
      }}
      onChange={handleInputChange}
      onKeyDown={(e) => {
        if (e.key === 'ArrowDown') {
          setActiveSuggestionIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
        } else if (e.key === 'ArrowUp') {
          setActiveSuggestionIndex((prev) =>
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
        } else if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
          const selected = suggestions[activeSuggestionIndex];
          setSearchQuery(selected.name);
          setActiveFilter(selected.category);
          setSuggestions([]);
          setActiveSuggestionIndex(-1);
        }
      }}
    />
    {/* animated border */}
    <span className="absolute inset-0 rounded-full p-[2px] z-0 rotating-border-overlay" aria-hidden="true"></span>
  </div>

  <m.button
    className="mt-2 sm:mt-0 sm:ml-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700"
    onClick={handleSearch}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    Search
  </m.button>
</m.div>

            {isSearchFocused && suggestions.length > 0 && (
              <ul className="absolute top-full mt-1 w-full sm:w-[28rem] max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-md text-sm z-20 overflow-hidden">
                {suggestions.map((s, index) => (
                  <li
  key={index}
  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white ${
    index === activeSuggestionIndex ? 'bg-gray-200 dark:bg-gray-700' : ''
  }`}
  onMouseDown={() => {
    setSearchQuery(s.name);
    setActiveFilter(s.category);
    setSuggestions([]);
    setActiveSuggestionIndex(-1);
  }}
>
  {s.name}
</li>

                ))}
              </ul>
            )}
</section>

          {/* FILTER BUTTONS */}
          <m.div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              'all', 'faceless-video', 'video-generators', 'writing-tools', 'presentation-tools',
              'short-clippers', 'marketing-tools', 'voice-tools', 'website-builders', 'image-generators',
              'chatbots', 'music-generators', 'data-analysis', 'gaming-tools', 'ai-diagrams',
              'utility-tools', 'Portfolio',
            ].map((id) => (
              <m.button
                key={id}
                onClick={() => handleFilter(id)}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeFilter === id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </m.button>
            ))}
          </m.div>

          {/* NO TOOLS MATCH */}
          {filteredTools.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-10 text-sm">
              No tools found matching your search.
            </div>
          )}

          {/* TOOLS GRID */}
          <LayoutGroup>
            {filteredTools.map((category) => (
              <m.div key={category.id} layout className="mb-10" data-category={category.id}>
                <m.div layout className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center gap-2 mb-4">
                    <i className="fas fa-box text-lg text-blue-500" />
                    <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                      {category.name}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {category.tools.map((tool) => (
                      <m.div key={tool.name} layout className="cursor-pointer">
                        <ToolCard tool={tool} openModal={openModal} />
                      </m.div>
                    ))}
                  </div>
                </m.div>
              </m.div>
            ))}
          </LayoutGroup>
       <style>{`
          @keyframes shimmer {
            0% { background-position: -100% 0; }
            100% { background-position: 200% 0; }
          }
          .animate-shimmer {
            background: linear-gradient(120deg, transparent 0%, #ffffff33 50%, transparent 100%);
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
          }
        `}</style>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            display: flex;
            animation: marquee 40s linear infinite;
          }
        `}</style>
      </div>
    </LazyMotion>
  );
};

export default Home;