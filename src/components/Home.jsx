import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion as m, LazyMotion, domAnimation, LayoutGroup } from 'framer-motion';
import toolsData from '../data/toolsData';
import ToolCard from './ToolCard';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Fuse from 'fuse.js';
import { Player } from '@lottiefiles/react-lottie-player';
import fireAnim from '../assets/fire.json';
import newAnim from '../assets/fire.json'; // Use correct animation if available

// --- Carousel Component ---
const CARD_WIDTH = 240;

function ProCarousel({
  items,
  cardClassName,
  renderCard,
  label,
  iconAnim,
  labelClass,
  progressColor,
}) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);

  // Drag-to-scroll
  useEffect(() => {
    let isDragging = false, startX = 0, scrollLeft = 0;
    const el = ref.current;
    if (!el) return;

    const onMouseDown = (e) => {
      isDragging = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
      el.classList.add("cursor-grabbing");
    };
    const onMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5;
      el.scrollLeft = scrollLeft - walk;
    };
    const onMouseUp = () => {
      isDragging = false;
      el.classList.remove("cursor-grabbing");
    };

    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseUp);
    el.addEventListener("mouseup", onMouseUp);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseUp);
      el.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (!ref.current || isHovered) return;
    const el = ref.current;
    const interval = setInterval(() => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      let next = el.scrollLeft + CARD_WIDTH;
      if (next > maxScroll + 10) next = 0;
      el.scrollTo({ left: next, behavior: "smooth" });
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered]);

  // Progress bar
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => setScrollPos(el.scrollLeft);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const handleArrow = (dir) => {
    if (!ref.current) return;
    const el = ref.current;
    let next = el.scrollLeft + (dir === "left" ? -CARD_WIDTH : CARD_WIDTH);
    el.scrollTo({ left: next, behavior: "smooth" });
  };

  const progress =
    ref.current && ref.current.scrollWidth > ref.current.clientWidth
      ? scrollPos / (ref.current.scrollWidth - ref.current.clientWidth)
      : 0;

  return (
    <m.section
      className="mb-10 relative px-4 sm:px-6"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-center items-center gap-2 mb-6">
        <div className="w-6 h-6">
          <Player autoplay loop src={iconAnim} style={{ height: "100%", width: "100%" }} />
        </div>
        <h3 className={`text-xl font-bold ${labelClass}`}>{label}</h3>
      </div>
      <div className="relative group">
        {/* Left Arrow */}
        <button
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-gray-800/80 rounded-full p-2 shadow hover:bg-white dark:hover:bg-gray-700"
          onClick={() => handleArrow("left")}
          aria-label="Scroll left"
          tabIndex={0}
        >
          <FaChevronLeft size={18} />
        </button>
        {/* Right Arrow */}
        <button
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-gray-800/80 rounded-full p-2 shadow hover:bg-white dark:hover:bg-gray-700"
          onClick={() => handleArrow("right")}
          aria-label="Scroll right"
          tabIndex={0}
        >
          <FaChevronRight size={18} />
        </button>
        {/* Cards */}
        <div
          ref={ref}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-1 py-2 cursor-grab"
          style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
          onWheel={(e) => {
            if (isHovered) {
              e.preventDefault();
              const direction = e.deltaY > 0 ? "right" : "left";
              handleArrow(direction);
            }
          }}
        >
          {items.map((tool, idx) => (
            <m.div
              key={tool.id || tool.name || idx}
              className={`min-w-[220px] max-w-[240px] snap-center ${cardClassName}`}
              initial={{ rotateY: 90, opacity: 0 }}
              whileInView={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              {renderCard(tool, idx)}
            </m.div>
          ))}
        </div>
        {/* Progress Bar */}
        <div className="absolute left-0 right-0 bottom-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${progressColor}`}
            style={{ width: `${Math.max(10, progress * 100)}%` }}
          />
        </div>
      </div>
    </m.section>
  );
}

// --- Main Home Component ---
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

  const formatName = (name) => (name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Guest');
  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : 'G');
  const displayName = formatName(username);

  const toolList = toolsData.flatMap((category) =>
    category.tools.map((tool) => ({ name: tool.name, category: category.id }))
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
        const results = fuse.search(value).map((r) => r.item);
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
        setDisplayedPlaceholder((prev) => {
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
        else
          setTimeout(() => {
            const retryEl = document.querySelector(`[data-category="${id}"]`);
            if (retryEl) retryEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 500);
      }
    };
    scrollToCategory();
  }, [location.hash]);

  const trendingTools = toolsData.flatMap((c) =>
    c.tools.filter((t) => t.badge === 'Recommended').map((t) => ({ ...t, category: c.id }))
  );
  const newTools = toolsData.flatMap((c) =>
    c.tools.filter((t) => t.isNew).map((t) => ({ ...t, category: c.id }))
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
          <ProCarousel
            items={trendingTools}
            cardClassName="trending-card-border"
            renderCard={(tool) => <ToolCard tool={tool} openModal={openModal} />}
            label="Trending Tools"
            iconAnim={fireAnim}
            labelClass="text-yellow-600 dark:text-yellow-400"
            progressColor="bg-gradient-to-r from-yellow-400 via-pink-400 to-orange-400"
          />
        )}

        {/* 🆕 New Tools */}
        {newTools.length > 0 && (
          <ProCarousel
            items={newTools}
            cardClassName="new-tools-card-border"
            renderCard={(tool) => <ToolCard tool={tool} openModal={openModal} />}
            label="New Tools"
            iconAnim={newAnim}
            labelClass="text-green-600 dark:text-green-400"
            progressColor="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"
          />
        )}

        {/* 🔍 Search, Filter, and Grid */}
        <section id="tools" className="relative z-10 px-4 sm:px-6 py-10">
          {/* SEARCH INPUT */}
          <div className="relative flex justify-center mb-6">
            <m.div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0 relative w-full sm:w-auto">
              <div
                className={`relative transition-all duration-500 ease-in-out rounded-full w-full animated-border-search ${
                  isSearchFocused || isHovered || searchQuery.length > 0 ? 'sm:w-[32rem]' : 'sm:w-[20rem]'
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="search-inner-container">
                  <m.div
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
                    animate={{ 
                      scale: isSearchFocused || searchQuery.length > 0 ? 1.1 : 1,
                      color: isSearchFocused ? '#3b82f6' : '#6b7280'
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaSearch className="text-gray-400 dark:text-gray-500 pointer-events-none" />
                  </m.div>
                  <input
                    type="text"
                    id="search"
                    placeholder={displayedPlaceholder || "Search tools..."}
                    className="search-input w-full pl-12 pr-4 py-3 text-base border-0 rounded-full 
                      bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm
                      text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50
                      transition-all duration-300 shadow-lg hover:shadow-xl
                      focus:bg-white dark:focus:bg-gray-800"
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
                        setActiveSuggestionIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
                      } else if (e.key === 'ArrowUp') {
                        setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
                      } else if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
                        const selected = suggestions[activeSuggestionIndex];
                        setSearchQuery(selected.name);
                        setActiveFilter(selected.category);
                        setSuggestions([]);
                        setActiveSuggestionIndex(-1);
                      }
                    }}
                  />
                </div>
              </div>
              <m.button
                className="mt-3 sm:mt-0 sm:ml-3 px-6 py-3 text-base font-semibold text-white 
                  bg-gradient-to-r from-blue-600 to-purple-600 rounded-full 
                  hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl
                  transition-all duration-300 transform hover:scale-105"
                onClick={handleSearch}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Search
              </m.button>
            </m.div>

            {/* SUGGESTIONS */}
            {isSearchFocused && suggestions.length > 0 && (
              <m.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full mt-2 w-full sm:w-[32rem] max-h-60 overflow-y-auto 
                  bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm
                  border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg text-base z-20 
                  overflow-hidden"
              >
                {suggestions.map((s, index) => (
                  <li
                    key={index}
                    className={`px-4 py-3 cursor-pointer transition-all duration-200
                      hover:bg-gray-100 dark:hover:bg-gray-700 
                      text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 last:border-b-0
                      ${index === activeSuggestionIndex 
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                        : ''
                      }`}
                    onMouseDown={() => {
                      setSearchQuery(s.name);
                      setActiveFilter(s.category);
                      setSuggestions([]);
                      setActiveSuggestionIndex(-1);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <FaSearch className="text-gray-400 text-sm" />
                      <span className="font-medium">{s.name}</span>
                    </div>
                  </li>
                ))}
              </m.ul>
            )}
          </div>

          {/* FILTER BUTTONS */}
          <m.div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              'all',
              'faceless-video',
              'video-generators',
              'writing-tools',
              'presentation-tools',
              'short-clippers',
              'marketing-tools',
              'voice-tools',
              'website-builders',
              'image-generators',
              'chatbots',
              'music-generators',
              'data-analysis',
              'gaming-tools',
              'ai-diagrams',
              'utility-tools',
              'Portfolio',
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
                {id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
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
                    <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400">{category.name}</h2>
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
        </section>

        {/* Enhanced Styles */}
        <style>{`
          @keyframes shimmer {
            0% { background-position: -100% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes borderRotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes newToolsGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes trendingCardGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-shimmer {
            background: linear-gradient(120deg, transparent 0%, #ffffff33 50%, transparent 100%);
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
          }
          .trending-card-border {
            position: relative;
            padding: 2px;
            background: linear-gradient(
              45deg,
              #ff6b6b,
              #ffd93d,
              #6bcf7f,
              #4ecdc4,
              #45b7d1,
              #96ceb4,
              #feca57,
              #ff9ff3,
              #ff6b6b
            );
            background-size: 400% 400%;
            animation: trendingCardGradient 4s ease-in-out infinite;
            border-radius: 1rem;
          }
          .trending-card-border > div {
            background: white;
            border-radius: calc(1rem - 2px);
            overflow: hidden;
          }
          .dark .trending-card-border > div {
            background: #1f2937;
          }
          .new-tools-card-border {
            position: relative;
            padding: 2px;
            background: linear-gradient(
              45deg,
              #00d4aa,
              #00b4d8,
              #0077b6,
              #023e8a,
              #7209b7,
              #a663cc,
              #4cc9f0,
              #7209b7,
              #00d4aa
            );
            background-size: 400% 400%;
            animation: newToolsGradient 3.5s ease-in-out infinite;
            border-radius: 1rem;
          }
          .new-tools-card-border > div {
            background: white;
            border-radius: calc(1rem - 2px);
            overflow: hidden;
          }
          .dark .new-tools-card-border > div {
            background: #1f2937;
          }
          .animated-border-search {
            position: relative;
            padding: 3px;
            background: linear-gradient(
              45deg,
              #3b82f6,
              #8b5cf6,
              #ec4899,
              #f59e0b,
              #10b981,
              #06b6d4,
              #6366f1,
              #3b82f6
            );
            background-size: 400% 400%;
            animation: gradientShift 4s ease-in-out infinite;
            border-radius: 9999px;
          }
          .search-inner-container {
            position: relative;
            background: white;
            border-radius: 9999px;
            overflow: hidden;
          }
          .dark .search-inner-container {
            background: #1f2937;
          }
          .search-input {
            position: relative;
            z-index: 10;
          }
          .search-input::placeholder {
            transition: all 0.3s ease;
          }
          .search-input:focus::placeholder {
            opacity: 0.7;
            transform: translateX(5px);
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .snap-x {
            scroll-snap-type: x mandatory;
          }
          .snap-center {
            scroll-snap-align: center;
          }
          .cursor-grab {
            cursor: grab;
          }
          .cursor-grabbing {
            cursor: grabbing;
          }
        `}</style>
      </div>
    </LazyMotion>
  );
};

export default Home;
