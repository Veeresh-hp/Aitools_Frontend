import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExternalLinkAlt, FaStar, FaPlay } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';

const MotionCarousel = ({ tools = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const history = useHistory();

  // Auto-center / Infinite scroll feel (auto-advance)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % tools.length);
    }, 5000); // Auto-advance every 5s
    return () => clearInterval(interval);
  }, [tools.length]);

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % tools.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + tools.length) % tools.length);

  // Helper to get relative index for circular display
  const getDisplayIndex = (index) => {
    const diff = (index - activeIndex + tools.length) % tools.length;
    // Map to -2, -1, 0, 1, 2 logic
    if (diff === 0) return 0;
    if (diff === 1) return 1;
    if (diff === 2) return 2;
    if (diff === tools.length - 1) return -1;
    if (diff === tools.length - 2) return -2;
    return 999; // Hidden
  };

  const getFaviconUrl = (url) => {
    try {
      if (!url) return null;
      const { hostname } = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
    } catch {
      return null;
    }
  };

  // Mock Data generation for "Movie" feel if missing
  const getToolMeta = (tool) => {
    return {
      title: tool.name,
      year: tool.dateAdded ? new Date(tool.dateAdded).getFullYear() : '2025',
      duration: tool.pricing || 'Free',
      rating: (Math.random() * (9.8 - 7.5) + 7.5).toFixed(1), // Mock rating
      platform: tool.category ? tool.category.split('-')[0].toUpperCase() : 'AI',
      image: tool.image || getFaviconUrl(tool.url)
    };
  };

  return (
    <div className="relative w-full h-[60vh] min-h-[500px] bg-black overflow-hidden flex flex-col justify-center items-center py-10 my-10 border-y border-white/5">
      {/* Background Orange Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#FF6B00] blur-[120px] opacity-20 rounded-full pointer-events-none" />
      
      {/* Section Title - Cinematic Style */}
      <div className="absolute top-6 left-0 right-0 z-20 flex justify-center items-center">
         <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white flex items-center gap-3 drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]">
            <span className="text-2xl">🆕</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/70">
              Latest Additions
            </span>
         </h2>
      </div>

      <div className="relative w-full max-w-[1400px] h-[400px] flex justify-center items-center perspective-1000">
        <AnimatePresence>
          {tools.map((tool, index) => {
            const position = getDisplayIndex(index);
            if (position === 999) return null; // Hide far cards

            const meta = getToolMeta(tool);
            const isActive = position === 0;
            
            // Layout Variants
            const variants = {
              center: { 
                x: 0, 
                z: 100, 
                scale: 1.15, 
                zIndex: 50, 
                opacity: 1,
                rotateY: 0,
                filter: 'brightness(1.1) contrast(1.1)' 
              },
              left1: { 
                x: '-60%', 
                z: -50, 
                scale: 0.85, 
                zIndex: 40, 
                opacity: 0.7,
                rotateY: 15, // Slight tilt inward
                filter: 'brightness(0.6) blur(2px)' 
              },
              right1: { 
                x: '60%', 
                z: -50, 
                scale: 0.85, 
                zIndex: 40, 
                opacity: 0.7,
                rotateY: -15, // Slight tilt inward
                filter: 'brightness(0.6) blur(2px)' 
              },
               left2: { 
                x: '-110%', 
                z: -150, 
                scale: 0.7, 
                zIndex: 30, 
                opacity: 0.4,
                rotateY: 25, 
                filter: 'brightness(0.4) blur(4px)' 
              },
              right2: { 
                x: '110%', 
                z: -150, 
                scale: 0.7, 
                zIndex: 30, 
                opacity: 0.4,
                rotateY: -25, 
                filter: 'brightness(0.4) blur(4px)' 
              }
            };

            let variant = 'center';
            if (position === -1) variant = 'left1';
            if (position === 1) variant = 'right1';
            if (position === -2) variant = 'left2';
            if (position === 2) variant = 'right2';

            return (
              <motion.div
                key={tool.name}
                initial={false}
                animate={variants[variant]}
                transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }} // smooth cubic-bezier
                className="absolute w-[280px] md:w-[320px] aspect-[2/3] rounded-[24px] overflow-hidden bg-gray-900 shadow-2xl shadow-black/80 cursor-pointer group"
                onClick={() => {
                  if (isActive) {
                    // Navigate
                    const toolSlug = tool.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
                    const categorySlug = tool.category || 'all';
                    history.push(`/tools/${categorySlug}/${toolSlug}`);
                  } else {
                    // Center the clicked card
                    setActiveIndex(index);
                  }
                }}
              >
                {/* Poster Image */}
                <div className="absolute inset-0 bg-black">
                    {meta.image ? (
                        <img src={meta.image} alt={tool.name} className="w-full h-full object-cover" />
                    ) : (
                         <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-gray-700">No Preview</div>
                    )}
                </div>

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent opacity-60" />
                
                {/* Active Glow border (simulated) */}
                {isActive && (
                    <div className="absolute inset-0 border border-white/20 rounded-[24px]" />
                )}

                {/* -- Content -- */}
                
                {/* Top Left: Platform Badge */}
                <div className="absolute top-4 left-4">
                    <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                         {/* Mock Platform Icon */}
                         <span className="text-[10px] font-bold text-white">{meta.platform.slice(0,1)}</span>
                    </div>
                </div>

                {/* Top Right: Rating */}
                <div className="absolute top-4 right-4 flex items-center gap-1">
                    <FaStar className="text-yellow-500 w-3 h-3" />
                    <span className="text-white font-bold text-sm tracking-wide">{meta.rating}</span>
                </div>

                {/* Bottom: Info */}
                <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-white text-xl font-semibold mb-1 leading-tight line-clamp-2 drop-shadow-lg">{meta.title}</h3>
                    <div className="flex items-center gap-3 text-[13px] font-medium text-gray-300/80">
                        <span>{meta.year}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-500" />
                        <span>{meta.duration}</span>
                    </div>
                </div>
                
                {/* Hover Play Icon (Desktop Center Only) */}
                {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center pl-1 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                            <FaPlay className="text-white w-6 h-6" />
                        </div>
                    </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button 
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-4 md:left-10 z-50 w-12 h-12 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/5 hover:border-white/20 group"
        >
             <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button 
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-4 md:right-10 z-50 w-12 h-12 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/5 hover:border-white/20 group"
        >
             <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

      </div>
    </div>
  );
};

export default MotionCarousel;
