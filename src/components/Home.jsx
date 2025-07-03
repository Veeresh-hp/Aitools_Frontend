import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { m, LazyMotion, domAnimation, LayoutGroup } from 'framer-motion';
import toolsData from '../data/toolsData';
import ToolCard from './ToolCard';
import { FaTimes, FaSearch } from 'react-icons/fa';
import Fuse from 'fuse.js';

const getCategoryIcon = (categoryId) => {
  const iconMap = {
    chatbots: 'fa-robot',
    'image-generators': 'fa-image',
    'music-generators': 'fa-music',
    'data-analysis': 'fa-chart-bar',
    'ai-diagrams': 'fa-project-diagram',
    'writing-tools': 'fa-pen',
    'video-generators': 'fa-video',
    'utility-tools': 'fa-tools',
    'marketing-tools': 'fa-bullhorn',
    'voice-tools': 'fa-microphone',
    'presentation-tools': 'fa-chalkboard',
    'website-builders': 'fa-globe',
    'gaming-tools': 'fa-gamepad',
    'short-clippers': 'fa-cut',
    'faceless-video': 'fa-user-secret',
    'portfolio-tools': 'fa-briefcase',
  };
  return iconMap[categoryId] || 'fa-box';
};

const getColorClass = (categoryId) => {
  const colorMap = {
    chatbots: 'text-purple-600',
    'image-generators': 'text-pink-600',
    'music-generators': 'text-green-600',
    'data-analysis': 'text-teal-600',
    'ai-diagrams': 'text-indigo-600',
    'writing-tools': 'text-blue-600',
    'video-generators': 'text-red-600',
    'utility-tools': 'text-gray-700 dark:text-gray-300',
    'marketing-tools': 'text-orange-500',
    'voice-tools': 'text-yellow-500',
    'presentation-tools': 'text-cyan-600',
    'website-builders': 'text-emerald-600',
    'gaming-tools': 'text-fuchsia-600',
    'short-clippers': 'text-rose-500',
    'faceless-video': 'text-zinc-600',
    'portfolio-tools': 'text-amber-600',
  };
  return colorMap[categoryId] || 'text-gray-500 dark:text-gray-400';
};

const Home = ({ openModal }) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isHovered, setIsHovered] = useState(false);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');

  useEffect(() => {
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
  }, 100); // Typing speed

  return () => clearInterval(interval);
}, []);


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
    if (value.trim() !== '') {
      const results = fuse.search(value).map(r => r.item);
      setSuggestions(results.slice(0, 5));
    } else {
      setSuggestions([]);
    }
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
    const scrollToCategory = () => {
      const id = location.hash?.replace('#', '');
      if (id) {
        const el = document.querySelector(`[data-category="${id}"]`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          setTimeout(() => {
            const retryEl = document.querySelector(`[data-category="${id}"]`);
            if (retryEl) retryEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 500);
        }
      }
    };
    scrollToCategory();
  }, [location.hash]);

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative overflow-hidden bg-gradient-to-br from-pink-100 via-blue-100 to-emerald-100 dark:from-gray-800 dark:via-gray-900 dark:to-black">
        {/* Gradient blobs and overlays */}
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-pink-300 opacity-20 rounded-full blur-3xl z-0 animate-pulse" />
        <div className="absolute top-20 -right-20 w-96 h-96 bg-blue-300 opacity-20 rounded-full blur-3xl z-0 animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-emerald-300 opacity-20 rounded-full blur-3xl z-0 animate-pulse delay-2000" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0 dark:from-white/5 dark:to-sky-700/5 backdrop-blur-sm pointer-events-none z-0" />

        <div className="relative z-10">
          {/* HERO SECTION */}
          <section className="px-4 sm:px-6 md:px-10 lg:px-16 py-20 text-center">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight drop-shadow-md">
              Welcome to <span className="text-red-600">AI Tools Hub</span>
            </h1>
            {isLoggedIn && (
              <div className="flex justify-center items-center gap-4 mb-4">
                <div className="w-10 h-10 flex items-center justify-center bg-red-600 text-white font-bold rounded-full text-lg shadow-md">
                  {getInitial(username)}
                </div>
                <p className="text-xl text-gray-700 dark:text-gray-300">
                  {getGreeting()}, <span className="font-semibold">{displayName}</span>! Explore our curated AI tools below.
                </p>
              </div>
            )}
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
              Discover powerful, curated AI tools to boost your productivity and creativity.
            </p>
            <button
              onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-red-300 dark:hover:shadow-red-900"
            >
              🚀 Explore Tools
            </button>
          </section>

          {/* TOOLS SECTION */}
          <section id="tools" className="relative z-10 px-4 sm:px-6 py-10">
            <h2 className="text-4xl font-bold mb-6 text-center text-gray-900 dark:text-white">Explore AI Tools</h2>

            {/* 🔍 Search Input */}
            <m.div className="flex flex-col sm:flex-row items-center justify-center mb-6 gap-2 sm:gap-0 relative">
  <div
  className={`glowing-border relative transition-all duration-300 ease-in-out ${
    isSearchFocused || isHovered || searchQuery.length > 0
      ? 'w-full sm:w-[28rem]'
      : 'w-full sm:w-[18rem]'
  }`}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>
    <FaSearch className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
    <input
      type="text"
      id="search"
      className={`w-full pl-10 pr-10 py-2 text-sm border rounded-md bg-white dark:bg-gray-800
        text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300
        ${isSearchFocused ? 'ring-2 ring-blue-500 shadow-lg' : 'border-gray-300 dark:border-gray-700'}
      `}
      value={searchQuery}
      onFocus={() => setIsSearchFocused(true)}
      onBlur={() => {
        setTimeout(() => {
          // Only collapse if not hovered AND input is empty
          if (!isHovered && searchQuery.trim() === '') {
            setIsSearchFocused(false);
          }
        }, 150);
      }}
      onChange={handleInputChange}
      onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
    />
    <label
      htmlFor="search"
      className={`absolute left-10 text-gray-500 dark:text-gray-400 transition-all duration-200 pointer-events-none
        ${isSearchFocused || searchQuery ? 'top-[-0.6rem] text-xs bg-white dark:bg-gray-800 px-1' : 'top-2.5 text-sm'}
      `}
    >
      Search tools...
    </label>
    {searchQuery && (
      <FaTimes
      className="absolute right-3 top-3 text-gray-500 cursor-pointer hover:text-red-500 z-10"
        onClick={() => {
          setSearchQuery('');
          setSuggestions([]);
        }}
      />
    )}
  </div>

  <m.button
    className="mt-2 sm:mt-0 sm:ml-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
    onClick={handleSearch}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    Search
  </m.button>

  {isSearchFocused && suggestions.length > 0 && (
    <ul className="absolute top-full mt-1 w-full sm:w-[28rem] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-md text-sm z-20">
      {suggestions.map((s, index) => (
        <li
          key={index}
          className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
          onMouseDown={() => {
            setSearchQuery(s.name);
            setActiveFilter(s.category);
            setSuggestions([]);
          }}
        >
          {s.name}
        </li>
      ))}
    </ul>
  )}
</m.div>


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
                'portfolio-tools',
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
                      <i className={`fas ${getCategoryIcon(category.id)} text-lg ${getColorClass(category.id)}`} />
                      <h2 className={`text-xl font-semibold ${getColorClass(category.id)} leading-tight`}>
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
          </section>
        </div>
      </div>
    </LazyMotion>
  );
};

export default Home;
