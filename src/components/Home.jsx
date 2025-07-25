  import React, { useState, useEffect, useRef, useMemo } from 'react';
  import { useLocation } from 'react-router-dom';
  import { motion as m, LazyMotion, domAnimation, LayoutGroup } from 'framer-motion';
  import toolsData from '../data/toolsData';
  import ToolCard from './ToolCard';
  import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
  import Fuse from 'fuse.js';
  import { Player } from '@lottiefiles/react-lottie-player';
  import fireAnim from '../assets/fire.json';
  import newAnim from '../assets/fire.json'; // FIX: Ensure this is a different animation for new tools.

  // --- Enhanced Carousel Component ---
  const CARD_WIDTH = 280;
  const CARD_GAP = 24;

  function ProCarousel({
    items,
    cardClassName,
    renderCard,
    label,
    iconAnim,
    labelClass,
    progressColor,
    description
  }) {
    const ref = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [scrollPos, setScrollPos] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Drag-to-scroll with momentum
    useEffect(() => {
      let isDragging = false, startX = 0, scrollLeft = 0, velocity = 0, lastX = 0, lastTime = 0;
      const el = ref.current;
      if (!el) return;

      const onMouseDown = (e) => {
        isDragging = true;
        startX = e.pageX - el.offsetLeft;
        scrollLeft = el.scrollLeft;
        lastX = e.pageX;
        lastTime = Date.now();
        velocity = 0;
        el.style.cursor = 'grabbing';
        el.style.userSelect = 'none';
      };

      const onMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - el.offsetLeft;
        const walk = (x - startX) * 2;
        el.scrollLeft = scrollLeft - walk;
        
        const currentTime = Date.now();
        const timeDelta = currentTime - lastTime;
        if (timeDelta > 0) {
          velocity = (e.pageX - lastX) / timeDelta;
        }
        lastX = e.pageX;
        lastTime = currentTime;
      };

      const onMouseUp = () => {
        isDragging = false;
        el.style.cursor = 'grab';
        el.style.userSelect = 'auto';
        
        if (Math.abs(velocity) > 0.5) {
          const momentum = velocity * 100;
          el.scrollTo({
            left: el.scrollLeft - momentum,
            behavior: 'smooth'
          });
        }
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

    // Auto-scroll with pause on hover
    useEffect(() => {
      if (!ref.current || isHovered || items.length <= 3) return;
      const el = ref.current;
      
      const interval = setInterval(() => {
        const maxScroll = el.scrollWidth - el.clientWidth;
        const currentScroll = el.scrollLeft;
        
        if (currentScroll >= maxScroll - 10) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollTo({ 
            left: currentScroll + CARD_WIDTH + CARD_GAP, 
            behavior: 'smooth' 
          });
        }
      }, 4000);
      
      return () => clearInterval(interval);
    }, [isHovered, items.length]);

    // Scroll tracking
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      
      const onScroll = () => {
        const scrollLeft = el.scrollLeft;
        const maxScroll = el.scrollWidth - el.clientWidth;
        
        setScrollPos(scrollLeft);
        setCanScrollLeft(scrollLeft > 5);
        setCanScrollRight(scrollLeft < maxScroll - 5);
      };
      
      el.addEventListener("scroll", onScroll);
      onScroll();
      
      return () => el.removeEventListener("scroll", onScroll);
    }, []);

    const handleArrow = (dir) => {
      if (!ref.current) return;
      const el = ref.current;
      const scrollAmount = (CARD_WIDTH + CARD_GAP) * 2;
      const newScrollLeft = dir === "left" 
        ? Math.max(0, el.scrollLeft - scrollAmount)
        : Math.min(el.scrollWidth - el.clientWidth, el.scrollLeft + scrollAmount);
      
      el.scrollTo({ left: newScrollLeft, behavior: "smooth" });
    };

    const progress = ref.current && ref.current.scrollWidth > ref.current.clientWidth
      ? Math.min(1, Math.max(0.1, scrollPos / (ref.current.scrollWidth - ref.current.clientWidth)))
      : 0;

    if (items.length === 0) return null;

    return (
      <m.section
        className="mb-16 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        viewport={{ once: true }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <Player 
                  autoplay loop src={iconAnim} 
                  style={{ height: "100%", width: "100%" }}
                  rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
                />
              </div>
              <div>
                <h2 className={`text-3xl font-bold ${labelClass}`}>{label}</h2>
                {description && (
                  <p className="text-gray-400 text-sm mt-1">{description}</p>
                )}
              </div>
            </div>
            
            {items.length > 3 && (
              <div className="flex items-center gap-2">
                <button
                  className={`p-2 rounded-full transition-all duration-300 ${ canScrollLeft ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-800/30 text-gray-600 cursor-not-allowed'}`}
                  onClick={() => handleArrow("left")} disabled={!canScrollLeft} aria-label="Scroll left"
                >
                  <FaChevronLeft size={16} />
                </button>
                <button
                  className={`p-2 rounded-full transition-all duration-300 ${ canScrollRight ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-800/30 text-gray-600 cursor-not-allowed'}`}
                  onClick={() => handleArrow("right")} disabled={!canScrollRight} aria-label="Scroll right"
                >
                  <FaChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="relative">
          <div
            ref={ref}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4"
            style={{ 
              scrollSnapType: "x mandatory", 
              WebkitOverflowScrolling: "touch",
              cursor: 'grab'
            }}
          >
            {items.map((tool, idx) => (
              <m.div
                key={tool.id || tool.name || idx}
                className={`flex-shrink-0 w-[280px] snap-center ${cardClassName}`}
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 0.1
                }}
                viewport={{ once: true }}
              >
                {renderCard(tool, idx)}
              </m.div>
            ))}
          </div>
          {items.length > 3 && (
            <div className="mx-4 sm:mx-6 lg:mx-8 mt-4">
              <div className="h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                <m.div
                  className={`h-full transition-all duration-300 ${progressColor} rounded-full`}
                  initial={{ width: "10%" }}
                  animate={{ width: `${Math.max(10, progress * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </m.section>
    );
  }

  // --- Filter Button Component ---
  const FilterButton = ({ id, label, isActive, onClick, count }) => (
    <m.button
      onClick={() => onClick(id)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 border backdrop-blur-sm ${isActive ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-500/50 shadow-lg shadow-blue-500/25' : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-white'}`}
    >
      <span className="relative z-10 flex items-center gap-2">
        {label}
        {count > 0 && (
          <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-gray-700 text-gray-300 group-hover:bg-gray-600'}`}>
            {count}
          </span>
        )}
      </span>
      {isActive && (
        <m.div
          layoutId="activeFilter"
          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl"
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.2 }}
        />
      )}
    </m.button>
  );

  // Typewriter Effect Hook
  const useTypewriter = (text, speed = 100, startDelay = 1000) => {
    const [displayText, setDisplayText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [hasTyped, setHasTyped] = useState(false);

    useEffect(() => {
      // Only run the typewriter effect once
      if (hasTyped) return;

      let timeout;
      let interval;

      const startTyping = () => {
        setIsTyping(true);
        let i = 0;
        
        interval = setInterval(() => {
          if (i < text.length) {
            setDisplayText(text.slice(0, i + 1));
            i++;
          } else {
            clearInterval(interval);
            setIsTyping(false);
            setHasTyped(true); // Mark as completed
          }
        }, speed);
      };

      timeout = setTimeout(startTyping, startDelay);

      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    }, [text, speed, startDelay, hasTyped]); // Added hasTyped to dependencies

    return { displayText, isTyping };
  };

  // --- Main Home Component ---
  const Home = ({ openModal }) => {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const debounceRef = useRef(null);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
    const [isMobile, setIsMobile] = useState(false);

    // Typewriter effect for placeholder
    const placeholderText = useMemo(() => 
      window.innerWidth < 640 
        ? 'Search AI tools...' 
        : 'Search for AI tools to boost your productivity...', 
      []
    );
    
    const { displayText: typewriterPlaceholder, isTyping } = useTypewriter(placeholderText, 80, 500);

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
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
    
    const toolList = useMemo(() => 
      toolsData.flatMap((category) =>
        category.tools.map((tool) => ({ ...tool, category: category.id }))
      ), []);

    const fuse = useMemo(() => new Fuse(toolList, {
      keys: ['name', 'description'],
      threshold: 0.4,
    }), [toolList]);

    const handleInputChange = (e) => {
      const value = e.target.value;
      setSearchQuery(value);
      setActiveSuggestionIndex(-1);
      
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (value.trim()) {
          const results = fuse.search(value).map((r) => r.item);
          setSuggestions(results.slice(0, 5));
        } else {
          setSuggestions([]);
        }
      }, 150); // Reduced debounce time
    };

    const handleFilter = (category) => {
      setActiveFilter(category);
      setSearchQuery('');
      setSuggestions([]);
      setActiveSuggestionIndex(-1);
    };

    const getCategoryCount = (categoryId) => {
      if (categoryId === 'all') return toolList.length;
      const category = toolsData.find(cat => cat.id === categoryId);
      return category ? category.tools.length : 0;
    };

    const filteredTools = useMemo(() => {
      return toolsData
        .map((category) => ({
          ...category,
          tools: category.tools.filter((tool) => {
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = searchQuery
              ? tool.name.toLowerCase().includes(searchLower) ||
                tool.description.toLowerCase().includes(searchLower)
              : true;
            const matchesFilter = activeFilter === 'all' || category.id === activeFilter;
            return matchesSearch && matchesFilter;
          }),
        }))
        .filter((category) => category.tools.length > 0);
    }, [searchQuery, activeFilter]);

    useEffect(() => {
      const scrollToCategory = () => {
        const id = location.hash?.replace('#', '');
        if (id) {
          setTimeout(() => {
            const el = document.querySelector(`[data-category="${id}"]`);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 50); // Reduced timeout
        }
      };
      scrollToCategory();
    }, [location.hash]);

    const trendingTools = useMemo(() => toolList.filter((t) => t.badge === 'Recommended'), [toolList]);
    const newTools = useMemo(() => toolList.filter((t) => t.isNew), [toolList]);
    const categories = useMemo(() => [{ id: 'all', name: 'All Tools' }, ...toolsData].map(cat => ({
      id: cat.id,
      label: cat.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    })), []);

    return (
      <LazyMotion features={domAnimation}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
          {/* Animated Background */}
          <div className="fixed inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
          </div>

          <div className="relative z-10">
            {/* Enhanced Hero Section */}
            <section className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-24">
              <div className="max-w-6xl mx-auto text-center">
                <m.div
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.1 }}
                  className="mb-8"
                >
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6">
                    <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      AI Tools Hub
                    </span>
                  </h1>
                  
                  {isLoggedIn && (
                    <m.div 
                      className="flex justify-center items-center gap-3 mb-6"
                      initial={{ opacity: 1, scale: 1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.1 }}
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold flex items-center justify-center text-lg shadow-lg">
                        {getInitial(username)}
                      </div>
                      <p className="text-xl text-gray-300">
                        {getGreeting()}, <span className="font-semibold text-white">{displayName}</span>!
                      </p>
                    </m.div>
                  )}
                  
                  <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
                    Discover and explore cutting-edge AI tools to supercharge your creativity, 
                    productivity, and innovation in the digital age.
                  </p>
                </m.div>

                <m.div
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.1 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                  <m.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-200 overflow-hidden"
                    onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      🚀 Explore Tools
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </m.button>
                  
                  <m.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-2xl hover:bg-white/5 transition-all duration-200 backdrop-blur-sm"
                    onClick={() => document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    View Trending
                  </m.button>
                </m.div>
              </div>
            </section>

            {/* Trending Tools Section */}
            {trendingTools.length > 0 && (
              <div id="trending">
                <ProCarousel
                  items={trendingTools}
                  renderCard={(tool) => <ToolCard tool={tool} openModal={openModal} />}
                  label="🔥 Trending Tools"
                  iconAnim={fireAnim}
                  labelClass="text-orange-400"
                  progressColor="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"
                  description="Most popular AI tools used by professionals"
                />
              </div>
            )}

            {/* New Tools Section */}
            {newTools.length > 0 && (
              <div id="new">
                <ProCarousel
                  items={newTools}
                  renderCard={(tool) => <ToolCard tool={tool} openModal={openModal} />}
                  label="✨ Latest Additions"
                  iconAnim={newAnim}
                  labelClass="text-green-400"
                  progressColor="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"
                  description="Newest AI tools added to our collection"
                />
              </div>
            )}

            {/* Search & Filter Section */}
            <section id="tools" className="relative px-4 sm:px-6 lg:px-8 py-16">
              <div className="max-w-6xl mx-auto">
                {/* Search Input */}
                <div className="relative mb-12">
                  <m.div 
                    className="flex justify-center"
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="relative w-full max-w-2xl">
                      <div
                        className={`relative transition-all duration-300 ease-out ${isSearchFocused || isHovered || searchQuery.length > 0 ? 'transform scale-105' : ''}`}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl" />
                        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden">
                          <div className="absolute left-5 top-1/2 transform -translate-y-1/2 z-10">
                            <m.div
                              animate={{ scale: isSearchFocused || searchQuery.length > 0 ? 1.1 : 1, color: isSearchFocused ? '#3b82f6' : '#9ca3af' }}
                              transition={{ duration: 0.2 }}
                            >
                              <FaSearch className="text-gray-400" />
                            </m.div>
                          </div>
                          <input
                            type="text"
                            placeholder={typewriterPlaceholder + (isTyping ? '|' : '')}
                            className="w-full pl-14 pr-6 py-5 text-lg bg-transparent text-white placeholder-gray-400 border-0 focus:outline-none focus:ring-0"
                            style={{ caretColor: 'white' }}
                            value={searchQuery}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setTimeout(() => setIsSearchFocused(false), 150)}
                            onChange={handleInputChange}
                            onKeyDown={(e) => {
                              if (e.key === 'ArrowDown' && suggestions.length > 0) {
                                e.preventDefault();
                                setActiveSuggestionIndex(prev => prev < suggestions.length - 1 ? prev + 1 : 0);
                              } else if (e.key === 'ArrowUp' && suggestions.length > 0) {
                                e.preventDefault();
                                setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : suggestions.length - 1);
                              } else if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
                                e.preventDefault();
                                const selected = suggestions[activeSuggestionIndex];
                                setSearchQuery(selected.name);
                                setActiveFilter(selected.category);
                                setSuggestions([]);
                                setActiveSuggestionIndex(-1);
                              } else if (e.key === 'Escape') {
                                setSuggestions([]);
                                setActiveSuggestionIndex(-1);
                                e.target.blur();
                              }
                            }}
                          />
                        </div>
                      </div>
                      {/* Suggestions */}
                      {isSearchFocused && suggestions.length > 0 && (
                        <m.div
                          initial={{ opacity: 0, y: -10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          transition={{ duration: 0.15 }}
                          className="absolute top-full mt-2 w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50"
                        >
                          {suggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              className={`px-6 py-4 cursor-pointer transition-all duration-150 border-b border-white/10 last:border-b-0 ${index === activeSuggestionIndex ? 'bg-blue-500/20 text-blue-300' : 'hover:bg-white/5 text-gray-300'}`}
                              onMouseDown={() => {
                                setSearchQuery(suggestion.name);
                                setActiveFilter(suggestion.category);
                                setSuggestions([]);
                                setActiveSuggestionIndex(-1);
                              }}
                              onMouseEnter={() => setActiveSuggestionIndex(index)}
                            >
                              <div className="flex items-center gap-3">
                                <FaSearch className="text-gray-500 text-sm" />
                                <span className="font-medium">{suggestion.name}</span>
                                <span className="text-xs text-gray-500 ml-auto capitalize">{suggestion.category.replace(/-/g, ' ')}</span>
                              </div>
                            </div>
                          ))}
                        </m.div>
                      )}
                    </div>
                  </m.div>
                </div>

                {/* Filter Buttons Section */}
                <div className="flex justify-center mb-16">
                    <LayoutGroup>
                        <div className="flex flex-wrap justify-center gap-3">
                            {(() => {
                                const mobileVisibleFilterIds = [
                                    'all',
                                    'chatbots',
                                    'other-tools',
                                    'text-humanizer-ai',
                                    'Portfolio'
                                ];

                                const displayedCategories = isMobile
                                    ? categories.filter(cat => mobileVisibleFilterIds.includes(cat.id))
                                    : categories;

                                return displayedCategories.map((cat) => (
                                    <FilterButton
                                        key={cat.id}
                                        id={cat.id}
                                        label={cat.label}
                                        isActive={activeFilter === cat.id}
                                        onClick={handleFilter}
                                        count={getCategoryCount(cat.id)}
                                    />
                                ));
                            })()}
                        </div>
                    </LayoutGroup>
                </div>

                {/* Tools Grid */}
                <LayoutGroup>
                  {filteredTools.length > 0 ? (
                    filteredTools.map((category) => (
                      <m.div
                        key={category.id} layout
                        initial={{ opacity: 1 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="mb-16"
                        data-category={category.id}
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                          <h2 className="text-2xl font-bold text-gray-200">{category.name}</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {category.tools.map((tool) => (
                            <m.div key={tool.name} layout>
                              <ToolCard tool={tool} openModal={openModal} />
                            </m.div>
                          ))}
                        </div>
                      </m.div>
                    ))
                  ) : (
                    <m.div
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-center py-20"
                    >
                      <Player
                        autoplay loop
                        src="https://assets4.lottiefiles.com/packages/lf20_pNx6yH.json"
                        style={{ height: '150px', width: '150px', margin: '0 auto' }}
                      />
                      <h3 className="text-2xl font-semibold text-white mt-4">No Tools Found</h3>
                      <p className="text-gray-400 mt-2">Try adjusting your search or filter to find what you're looking for.</p>
                    </m.div>
                  )}
                </LayoutGroup>
              </div>
            </section>
          </div>
        </div>
      </LazyMotion>
    );
  };

  export default Home;