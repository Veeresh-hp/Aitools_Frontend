import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaFire, 
  FaStar, 
  FaExternalLinkAlt, 
  FaUsers,
  FaPlay,
  FaPause,
  FaHeart,
  FaBookmark,
  FaFilter,
  FaSort
} from 'react-icons/fa'; // Corrected import path

// Enhanced mock data with more detailed information
const trendingTools = [
  {
    id: 1,
    name: "ChatGPT",
    description: "Revolutionary conversational AI that understands context, generates human-like text, and assists with complex problem-solving across multiple domains",
    category: "AI Assistant",
    subcategory: "Conversational AI",
    badge: "Most Popular",
    rating: 4.9,
    reviewCount: 2847,
    users: "100M+",
    monthlyGrowth: "+15%",
    priceRange: "Free - $20/mo",
    features: ["Natural Language", "Code Generation", "Creative Writing", "Analysis"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop&crop=center",
    gradient: "from-emerald-400 via-teal-500 to-blue-600",
    company: "OpenAI",
    launchYear: 2022,
    trending: true
  },
  {
    id: 2,
    name: "Midjourney",
    description: "State-of-the-art AI image generator that transforms imaginative prompts into breathtaking visual masterpieces with unprecedented artistic quality",
    category: "Image Generation",
    subcategory: "AI Art",
    badge: "Trending",
    rating: 4.8,
    reviewCount: 1923,
    users: "50M+",
    monthlyGrowth: "+22%",
    priceRange: "$10 - $60/mo",
    features: ["Photorealistic", "Artistic Styles", "High Resolution", "Style Transfer"],
    image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop&crop=center",
    gradient: "from-purple-400 via-pink-500 to-rose-600",
    company: "Midjourney Inc.",
    launchYear: 2022,
    trending: true
  },
  {
    id: 3,
    name: "Notion AI",
    description: "Intelligent workspace companion that seamlessly integrates AI-powered writing, summarization, and organization into your productivity workflow",
    category: "Productivity",
    subcategory: "Workspace",
    badge: "Featured",
    rating: 4.7,
    reviewCount: 1567,
    users: "30M+",
    monthlyGrowth: "+18%",
    priceRange: "$8 - $15/mo",
    features: ["Smart Writing", "Auto-Summary", "Data Analysis", "Templates"],
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop&crop=center",
    gradient: "from-blue-400 via-indigo-500 to-purple-600",
    company: "Notion Labs",
    launchYear: 2021,
    trending: false
  },
  {
    id: 4,
    name: "Runway ML",
    description: "Professional-grade AI video platform offering cutting-edge tools for video generation, editing, and motion graphics with Hollywood-quality results",
    category: "Video",
    subcategory: "Video Generation",
    badge: "New",
    rating: 4.6,
    reviewCount: 892,
    users: "20M+",
    monthlyGrowth: "+35%",
    priceRange: "$12 - $76/mo",
    features: ["Video Generation", "Motion Tracking", "Green Screen", "Style Transfer"],
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop&crop=center",
    gradient: "from-orange-400 via-red-500 to-pink-600",
    company: "Runway AI",
    launchYear: 2023,
    trending: true
  },
  {
    id: 5,
    name: "Stable Diffusion",
    description: "Open-source powerhouse for AI image generation, offering unprecedented control and customization for artists and developers worldwide",
    category: "Image Generation",
    subcategory: "Open Source",
    badge: "Popular",
    rating: 4.5,
    reviewCount: 1334,
    users: "15M+",
    monthlyGrowth: "+12%",
    priceRange: "Free - $10/mo",
    features: ["Open Source", "Custom Models", "Local Generation", "API Access"],
    image: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=400&h=300&fit=crop&crop=center",
    gradient: "from-teal-400 via-cyan-500 to-blue-600",
    company: "Stability AI",
    launchYear: 2022,
    trending: false
  },
  {
    id: 6,
    name: "Claude",
    description: "Sophisticated AI assistant engineered for complex reasoning, ethical decision-making, and nuanced understanding of context and human values",
    category: "AI Assistant",
    subcategory: "Reasoning AI",
    badge: "Rising",
    rating: 4.8,
    reviewCount: 756,
    users: "10M+",
    monthlyGrowth: "+28%",
    priceRange: "Free - $20/mo",
    features: ["Advanced Reasoning", "Code Analysis", "Research", "Ethical AI"],
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop&crop=center",
    gradient: "from-indigo-400 via-purple-500 to-pink-600",
    company: "Anthropic",
    launchYear: 2023,
    trending: true
  },
  {
    id: 7,
    name: "Luma AI",
    description: "Revolutionary 3D capture technology that transforms ordinary photos into immersive, interactive 3D models with photorealistic detail",
    category: "3D Generation",
    subcategory: "3D Modeling",
    badge: "Innovative",
    rating: 4.4,
    reviewCount: 445,
    users: "5M+",
    monthlyGrowth: "+42%",
    priceRange: "$29 - $99/mo",
    features: ["3D Capture", "Neural Rendering", "Mobile App", "AR Export"],
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop&crop=center",
    gradient: "from-pink-400 via-rose-500 to-orange-600",
    company: "Luma AI",
    launchYear: 2023,
    trending: true
  },
  {
    id: 8,
    name: "Perplexity",
    description: "Next-generation AI search engine that combines real-time web data with advanced reasoning to deliver accurate, cited, and comprehensive answers",
    category: "Search",
    subcategory: "AI Search",
    badge: "Fast Growing",
    rating: 4.6,
    reviewCount: 1021,
    users: "8M+",
    monthlyGrowth: "+31%",
    priceRange: "Free - $20/mo",
    features: ["Real-time Search", "Source Citations", "Follow-up Questions", "Mobile App"],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop&crop=center",
    gradient: "from-cyan-400 via-blue-500 to-indigo-600",
    company: "Perplexity AI",
    launchYear: 2023,
    trending: true
  }
];

const TrendingToolsSection = () => {
  // State management
  const scrollRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popularity');
  const [likedTools, setLikedTools] = useState(new Set());
  const [bookmarkedTools, setBookmarkedTools] = useState(new Set());
  const autoScrollRef = useRef(null);

  // Configuration
  const cardWidth = 350;
  const cardGap = 24;
  const scrollDistance = cardWidth + cardGap;

  // Memoized filtered and sorted tools
  const filteredAndSortedTools = useMemo(() => {
    let filtered = trendingTools;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'users':
          return parseInt(b.users.replace(/\D/g, '')) - parseInt(a.users.replace(/\D/g, ''));
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return b.launchYear - a.launchYear;
        default: // popularity
          return b.rating * parseInt(b.users.replace(/\D/g, '')) - a.rating * parseInt(a.users.replace(/\D/g, ''));
      }
    });
  }, [selectedCategory, sortBy]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(trendingTools.map(tool => tool.category))];
    return cats;
  }, []);

  // Update scroll button states
  const updateScrollButtons = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
      setScrollPosition(scrollLeft);
    }
  }, []);

  // Enhanced smooth scroll with better easing
  const smoothScroll = useCallback((targetPosition) => {
    if (!scrollRef.current) return;

    const startPosition = scrollRef.current.scrollLeft;
    const distance = targetPosition - startPosition;
    const duration = 800;
    const startTime = performance.now();

    const easeInOutQuart = (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutQuart(progress);
      
      const currentPosition = startPosition + (distance * easedProgress);
      scrollRef.current.scrollLeft = currentPosition;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }, []);

  // Enhanced scroll direction handling
  const scrollToDirection = useCallback((direction) => {
    if (!scrollRef.current) return;

    const currentScroll = scrollRef.current.scrollLeft;
    const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
    
    let targetScroll;
    if (direction === 'left') {
      targetScroll = Math.max(0, currentScroll - scrollDistance);
    } else {
      targetScroll = Math.min(maxScroll, currentScroll + scrollDistance);
    }

    smoothScroll(targetScroll);
  }, [scrollDistance, smoothScroll]);

  // Enhanced auto-scroll with play/pause
  const startAutoScroll = useCallback(() => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    
    if (!isAutoPlaying) return;
    
    autoScrollRef.current = setInterval(() => {
      if (isHovered || isDragging || !isAutoPlaying) return;
      
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        
        if (scrollLeft >= maxScroll - 10) {
          smoothScroll(0);
        } else {
          scrollToDirection('right');
        }
      }
    }, 5000);
  }, [isHovered, isDragging, isAutoPlaying, scrollToDirection, smoothScroll]);

  // Interaction handlers
  const handleLike = (toolId) => {
    setLikedTools(prev => {
      const newSet = new Set(prev);
      if (newSet.has(toolId)) {
        newSet.delete(toolId);
      } else {
        newSet.add(toolId);
      }
      return newSet;
    });
  };

  const handleBookmark = (toolId) => {
    setBookmarkedTools(prev => {
      const newSet = new Set(prev);
      if (newSet.has(toolId)) {
        newSet.delete(toolId);
      } else {
        newSet.add(toolId);
      }
      return newSet;
    });
  };

  // Mouse and touch handlers (enhanced)
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    scrollRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
    }
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Effects
  useEffect(() => {
    startAutoScroll();
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [startAutoScroll]);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', updateScrollButtons);
      updateScrollButtons();
      return () => scrollElement.removeEventListener('scroll', updateScrollButtons);
    }
  }, [updateScrollButtons]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          scrollToDirection('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          scrollToDirection('right');
          break;
        case ' ':
          e.preventDefault();
          setIsAutoPlaying(!isAutoPlaying);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollToDirection, isAutoPlaying]);

  // Utility functions
  const getBadgeColor = (badge) => {
    const colors = {
      "Most Popular": "from-red-500 to-orange-500",
      "Trending": "from-purple-500 to-pink-500",
      "Featured": "from-blue-500 to-indigo-500",
      "New": "from-green-500 to-teal-500",
      "Popular": "from-orange-500 to-red-500",
      "Rising": "from-indigo-500 to-purple-500",
      "Innovative": "from-pink-500 to-rose-500",
      "Fast Growing": "from-cyan-500 to-blue-500"
    };
    return `bg-gradient-to-r ${colors[badge] || "from-gray-500 to-gray-600"}`;
  };

  const getGrowthColor = (growth) => {
    const value = parseInt(growth.replace(/\D/g, ''));
    if (value >= 30) return "text-green-600 dark:text-green-400";
    if (value >= 20) return "text-blue-600 dark:text-blue-400";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <div className="relative py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Enhanced Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <FaFire className="text-5xl text-orange-500 drop-shadow-lg" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-ping" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full" />
            </div>
            <h2 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
              Trending AI Tools
            </h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover the most innovative AI tools reshaping industries and empowering creators worldwide. 
            Join millions of users who are already transforming their workflow with these cutting-edge solutions.
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <FaUsers className="text-blue-500" />
              <span>250M+ Active Users</span>
            </div>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
            <div className="flex items-center gap-2">
              <FaStar className="text-yellow-500" />
              <span>4.7 Average Rating</span>
            </div>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
            <div className="flex items-center gap-2">
              <FaFire className="text-orange-500" />
              <span>Updated Daily</span>
            </div>
          </div>
        </div>

        {/* Enhanced Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-500 dark:text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <FaSort className="text-gray-500 dark:text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="popularity">Popularity</option>
                <option value="rating">Rating</option>
                <option value="users">Users</option>
                <option value="newest">Newest</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Auto-play Control */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isAutoPlaying
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              {isAutoPlaying ? <FaPause /> : <FaPlay />}
              {isAutoPlaying ? 'Pause' : 'Play'}
            </button>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollToDirection('left')}
                disabled={!canScrollLeft}
                className={`group relative w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
                  canScrollLeft
                    ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                <FaChevronLeft className="text-sm" />
                {canScrollLeft && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                )}
              </button>
              
              <button
                onClick={() => scrollToDirection('right')}
                disabled={!canScrollRight}
                className={`group relative w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
                  canScrollRight
                    ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                <FaChevronRight className="text-sm" />
                {canScrollRight && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Scrollable Cards Container */}
        <div className="relative">
          {/* Enhanced Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent dark:from-gray-900 dark:via-gray-900/90 z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-50 via-slate-50/90 to-transparent dark:from-gray-900 dark:via-gray-900/90 z-10 pointer-events-none" />
          
          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide py-6 px-3 cursor-grab select-none"
            style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              setIsHovered(false);
              handleMouseUp();
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {filteredAndSortedTools.map((tool, index) => (
              <div
                key={tool.id}
                className="min-w-[350px] flex-shrink-0"
                onMouseEnter={() => setActiveCard(tool.id)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div
                  className={`group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200/50 dark:border-gray-700/50 ${
                    activeCard === tool.id ? 'transform scale-105 shadow-2xl' : ''
                  }`}
                >
                  {/* Enhanced Card Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={tool.image}
                      alt={tool.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${tool.gradient} opacity-20 group-hover:opacity-40 transition-all duration-500`} />
                    
                    {/* Enhanced Badge */}
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white ${getBadgeColor(tool.badge)} shadow-lg backdrop-blur-sm`}>
                      {tool.badge}
                    </div>
                    
                    {/* Trending Indicator */}
                    {tool.trending && (
                      <div className="absolute top-4 right-16 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg backdrop-blur-sm">
                        <FaFire className="text-xs animate-bounce" />
                        <span className="text-xs font-semibold">Hot</span>
                      </div>
                    )}
                    
                    {/* Enhanced Rating */}
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-lg flex items-center gap-1">
                      <FaStar className="text-yellow-400 text-xs" />
                      <span className="text-xs font-semibold">{tool.rating}</span>
                      <span className="text-xs text-gray-300">({tool.reviewCount})</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(tool.id);
                        }}
                        className={`w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
                          likedTools.has(tool.id)
                            ? 'bg-red-500 text-white shadow-lg'
                            : 'bg-white/80 text-gray-700 hover:bg-red-500 hover:text-white'
                        }`}
                      >
                        <FaHeart className="text-xs" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmark(tool.id);
                        }}
                        className={`w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
                          bookmarkedTools.has(tool.id)
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'bg-white/80 text-gray-700 hover:bg-blue-500 hover:text-white'
                        }`}
                      >
                        <FaBookmark className="text-xs" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Enhanced Card Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-1">
                          {tool.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>{tool.company}</span>
                          <span>•</span>
                          <span>{tool.launchYear}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          {tool.users}
                        </div>
                        <div className={`text-xs font-medium ${getGrowthColor(tool.monthlyGrowth)}`}>
                          {tool.monthlyGrowth}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {tool.description}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {tool.features.slice(0, 3).map((feature, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                      {tool.features.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                          +{tool.features.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                            {tool.category}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          {tool.priceRange}
                        </div>
                      </div>
                      
                      <button
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        Try Now
                        <FaExternalLinkAlt className="text-xs" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Enhanced Hover Overlay */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-blue-600/5 via-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  />

                  {/* Spotlight Effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, ${tool.gradient.replace('from-', '').replace('to-', '').split(' via-')[0]} 0%, transparent 70%)`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Enhanced Progress Indicator */}
        <div className="flex justify-center mt-10">
          <div className="flex items-center gap-3">
            {Array.from({ length: Math.ceil(filteredAndSortedTools.length / 3) }).map((_, i) => {
              const isActive = Math.floor(scrollPosition / scrollDistance) === i;
              return (
                <button
                  key={i}
                  onClick={() => smoothScroll(i * scrollDistance)}
                  className={`transition-all duration-300 rounded-full ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 w-10 h-3'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 w-3 h-3'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Enhanced Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Tools', value: filteredAndSortedTools.length, icon: FaFire, color: 'from-orange-500 to-red-500' },
            { label: 'Avg Rating', value: (filteredAndSortedTools.reduce((acc, tool) => acc + tool.rating, 0) / filteredAndSortedTools.length).toFixed(1), icon: FaStar, color: 'from-yellow-500 to-orange-500' },
            { label: 'Total Users', value: `${Math.floor(filteredAndSortedTools.reduce((acc, tool) => acc + parseInt(tool.users.replace(/\D/g, '')), 0) / 1000000)}M+`, icon: FaUsers, color: 'from-blue-500 to-purple-500' },
            { label: 'Categories', value: categories.length - 1, icon: FaFilter, color: 'from-purple-500 to-pink-500' }
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className="text-white text-xl" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Transform Your Workflow?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join millions of professionals who are already using AI to boost their productivity, 
              creativity, and achieve breakthrough results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Explore All Tools
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
                Get Recommendations
              </button>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Info */}
        <div className="mt-8 text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 space-x-4">
            <span>← → Navigate</span>
            <span>Space Play/Pause</span>
            <span>Drag to scroll</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingToolsSection;
