import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaFire, FaStar, FaArrowRight, FaExternalLinkAlt } from 'react-icons/fa';

// Mock data for demonstration
const trendingTools = [
  {
    id: 1,
    name: "ChatGPT",
    description: "Advanced AI assistant for conversations, writing, and problem-solving",
    category: "AI Assistant",
    badge: "Most Popular",
    rating: 4.9,
    users: "100M+",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop&crop=center",
    gradient: "from-green-400 to-blue-500"
  },
  {
    id: 2,
    name: "Midjourney",
    description: "Create stunning AI-generated artwork and images from text prompts",
    category: "Image Generation",
    badge: "Trending",
    rating: 4.8,
    users: "50M+",
    image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop&crop=center",
    gradient: "from-purple-400 to-pink-500"
  },
  {
    id: 3,
    name: "Notion AI",
    description: "Smart workspace that learns and adapts to your workflow",
    category: "Productivity",
    badge: "Featured",
    rating: 4.7,
    users: "30M+",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop&crop=center",
    gradient: "from-blue-400 to-purple-500"
  },
  {
    id: 4,
    name: "Runway ML",
    description: "Professional video editing and generation powered by AI",
    category: "Video",
    badge: "New",
    rating: 4.6,
    users: "20M+",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop&crop=center",
    gradient: "from-orange-400 to-red-500"
  },
  {
    id: 5,
    name: "Stable Diffusion",
    description: "Open-source AI model for generating detailed images",
    category: "Image Generation",
    badge: "Popular",
    rating: 4.5,
    users: "15M+",
    image: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=400&h=300&fit=crop&crop=center",
    gradient: "from-teal-400 to-cyan-500"
  },
  {
    id: 6,
    name: "Claude",
    description: "Advanced AI assistant for analysis, writing, and creative tasks",
    category: "AI Assistant",
    badge: "Rising",
    rating: 4.8,
    users: "10M+",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop&crop=center",
    gradient: "from-indigo-400 to-purple-500"
  },
  {
    id: 7,
    name: "Luma AI",
    description: "Transform photos into stunning 3D models and scenes",
    category: "3D Generation",
    badge: "Innovative",
    rating: 4.4,
    users: "5M+",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop&crop=center",
    gradient: "from-pink-400 to-rose-500"
  },
  {
    id: 8,
    name: "Perplexity",
    description: "AI-powered search engine with real-time information",
    category: "Search",
    badge: "Fast Growing",
    rating: 4.6,
    users: "8M+",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop&crop=center",
    gradient: "from-cyan-400 to-blue-500"
  }
];

const TrendingToolsSection = () => {
  const scrollRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const autoScrollRef = useRef(null);

  // Card dimensions and spacing
  const cardWidth = 320;
  const cardGap = 24;
  const scrollDistance = cardWidth + cardGap;

  // Update scroll button states
  const updateScrollButtons = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
      setScrollPosition(scrollLeft);
    }
  }, []);

  // Smooth scroll function with easing
  const smoothScroll = useCallback((targetPosition) => {
    if (!scrollRef.current) return;

    const startPosition = scrollRef.current.scrollLeft;
    const distance = targetPosition - startPosition;
    const duration = 600;
    const startTime = performance.now();

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      
      const currentPosition = startPosition + (distance * easedProgress);
      scrollRef.current.scrollLeft = currentPosition;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }, []);

  // Scroll to specific direction
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

  // Auto-scroll functionality
  const startAutoScroll = useCallback(() => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    
    autoScrollRef.current = setInterval(() => {
      if (isHovered || isDragging) return;
      
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        
        if (scrollLeft >= maxScroll - 10) {
          // Reset to beginning with smooth animation
          smoothScroll(0);
        } else {
          // Scroll to next set of cards
          scrollToDirection('right');
        }
      }
    }, 4000);
  }, [isHovered, isDragging, scrollToDirection, smoothScroll]);

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Initialize auto-scroll and scroll listeners
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
      updateScrollButtons(); // Initial check
      return () => scrollElement.removeEventListener('scroll', updateScrollButtons);
    }
  }, [updateScrollButtons]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        scrollToDirection('left');
      } else if (e.key === 'ArrowRight') {
        scrollToDirection('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollToDirection]);

  const getBadgeColor = (badge) => {
    const colors = {
      "Most Popular": "bg-gradient-to-r from-red-500 to-orange-500",
      "Trending": "bg-gradient-to-r from-purple-500 to-pink-500",
      "Featured": "bg-gradient-to-r from-blue-500 to-indigo-500",
      "New": "bg-gradient-to-r from-green-500 to-teal-500",
      "Popular": "bg-gradient-to-r from-orange-500 to-red-500",
      "Rising": "bg-gradient-to-r from-indigo-500 to-purple-500",
      "Innovative": "bg-gradient-to-r from-pink-500 to-rose-500",
      "Fast Growing": "bg-gradient-to-r from-cyan-500 to-blue-500"
    };
    return colors[badge] || "bg-gradient-to-r from-gray-500 to-gray-600";
  };

  return (
    <div className="relative py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <FaFire className="text-4xl text-orange-500" />
              <m.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <h2 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
              Trending Tools
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover the most popular AI tools trusted by millions of users worldwide
          </p>
        </m.div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {trendingTools.length} trending tools
            </div>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Auto-scrolling every 4s
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <m.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToDirection('left')}
              disabled={!canScrollLeft}
              className={`group relative w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
                canScrollLeft
                  ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md hover:shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              <FaChevronLeft className="text-sm" />
              {canScrollLeft && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              )}
            </m.button>
            
            <m.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToDirection('right')}
              disabled={!canScrollRight}
              className={`group relative w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
                canScrollRight
                  ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md hover:shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              <FaChevronRight className="text-sm" />
              {canScrollRight && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              )}
            </m.button>
          </div>
        </div>

        {/* Scrollable Cards Container */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent dark:from-gray-900 dark:via-gray-900/80 z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent dark:from-gray-900 dark:via-gray-900/80 z-10 pointer-events-none" />
          
          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className={`flex gap-6 overflow-x-auto scrollbar-hide py-4 px-2 ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{ scrollBehavior: 'smooth' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {trendingTools.map((tool, index) => (
              <m.div
                key={tool.id}
                className="min-w-[320px] flex-shrink-0"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={() => setActiveCard(tool.id)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <m.div
                  className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-gray-700 ${
                    activeCard === tool.id ? 'transform scale-105' : ''
                  }`}
                  whileHover={{ y: -8 }}
                  layout
                >
                  {/* Card Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={tool.image}
                      alt={tool.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${tool.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                    
                    {/* Badge */}
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white ${getBadgeColor(tool.badge)} shadow-lg`}>
                      {tool.badge}
                    </div>
                    
                    {/* Rating */}
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-lg flex items-center gap-1">
                      <FaStar className="text-yellow-400 text-xs" />
                      <span className="text-xs font-semibold">{tool.rating}</span>
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {tool.name}
                      </h3>
                      <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {tool.users}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {tool.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                        {tool.category}
                      </span>
                      
                      <m.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors duration-300"
                      >
                        Try Now
                        <FaExternalLinkAlt className="text-xs" />
                      </m.button>
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <m.div
                    className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  />
                </m.div>
              </m.div>
            ))}
          </div>
        </div>
        
        {/* Progress Indicator */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.ceil(trendingTools.length / 3) }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  Math.floor(scrollPosition / scrollDistance) === i
                    ? 'bg-blue-500 w-8'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingToolsSection;