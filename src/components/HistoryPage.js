import React, { useEffect, useState, useRef } from 'react';
import { motion as m, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';
import {
  Trash2,
  Clock,
  Star,
  Calendar,
  ExternalLink,
  Sparkles,
  TrendingUp
} from 'lucide-react';

// A dynamic, interactive particle background component
const InteractiveBackground = () => {
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const animationId = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const particleCount = 60;
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.hue = Math.random() * 60 + 200;
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        const dx = mousePos.current.x - this.x;
        const dy = mousePos.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 80) {
          const force = (80 - distance) / 80;
          this.vx += dx * force * 0.0008;
          this.vy += dy * force * 0.0008;
        }
        
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
        
        this.vx *= 0.99;
        this.vy *= 0.99;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity})`;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity * 0.1})`;
        ctx.fill();
      }
    }
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const opacity = (100 - distance) / 100 * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(100, 150, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      drawConnections();
      
      animationId.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    const handleMouseMove = (e) => {
      mousePos.current = {
        x: e.clientX,
        y: e.clientY
      };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
};

// Groups history items by date
const groupByDate = (history) => {
  const groups = {};
  history.forEach((item) => {
    const date = new Date(item.timestamp).toLocaleDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
  });
  return groups;
};

// Mock data for demonstration if localStorage is empty
const getMockHistory = () => [
  { name: "ChatGPT", url: "https://chat.openai.com", timestamp: Date.now() - 1000 * 60 * 30, icon: "🤖" },
  { name: "Midjourney", url: "https://midjourney.com", timestamp: Date.now() - 1000 * 60 * 60, icon: "🎨" },
  { name: "Claude AI", url: "https://claude.ai", timestamp: Date.now() - 1000 * 60 * 90, icon: "💭" },
  { name: "Stable Diffusion", url: "https://stablediffusion.com", timestamp: Date.now() - 1000 * 60 * 120, icon: "🖼️" },
  { name: "GitHub Copilot", url: "https://github.com/copilot", timestamp: Date.now() - 1000 * 60 * 60 * 24, icon: "💻" }
];

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Load history and favorites from localStorage on initial render
  useEffect(() => {
    try {
      const storedHistory = JSON.parse(localStorage.getItem('toolClickHistory'));
      if (storedHistory && Array.isArray(storedHistory) && storedHistory.length > 0) {
        setHistory(storedHistory);
      } else {
        setHistory(getMockHistory()); // Use mock data if nothing is stored or it's empty
      }

      const storedFavorites = JSON.parse(localStorage.getItem('toolFavorites'));
      if (storedFavorites && Array.isArray(storedFavorites)) {
        setFavorites(storedFavorites);
      }
    } catch (error) {
      console.error("Error reading from localStorage", error);
      setHistory(getMockHistory()); // Fallback to mock data on error
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
        localStorage.setItem('toolClickHistory', JSON.stringify(history));
    } catch (error) {
        console.error("Error writing history to localStorage", error);
    }
  }, [history]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
        localStorage.setItem('toolFavorites', JSON.stringify(favorites));
    } catch (error) {
        console.error("Error writing favorites to localStorage", error);
    }
  }, [favorites]);

  const handleClear = () => {
    setHistory([]);
    setFavorites([]);
    setShowClearConfirm(false);
  };

  const toggleFavorite = (timestamp) => {
    const updatedFavorites = favorites.includes(timestamp)
      ? favorites.filter(fav => fav !== timestamp)
      : [...favorites, timestamp];
    setFavorites(updatedFavorites);
  };

  const groupedHistory = groupByDate(history);
  const favoriteItems = history.filter(item => favorites.includes(item.timestamp));

  // Animation variants for staggered loading
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden relative">
        <InteractiveBackground />
        
        <div className="relative z-10 min-h-screen flex flex-col">
          <m.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 px-4 sm:px-6 lg:px-8 pt-24 pb-8"
          >
            <div className="max-w-6xl mx-auto">
              {/* Header Section */}
              <m.div
                variants={itemVariants}
                className="text-center mb-8"
              >
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Tool History
                  </h1>
                </div>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Track your AI tool exploration journey and revisit your favorite discoveries
                </p>
              </m.div>

              {/* Stats Bar */}
              {history.length > 0 && (
                <m.div
                  variants={itemVariants}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
                >
                  <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">{history.length}</div>
                    <div className="text-gray-400 text-sm font-medium flex items-center justify-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Total Visits
                    </div>
                  </div>
                  <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400 mb-1">{favoriteItems.length}</div>
                    <div className="text-gray-400 text-sm font-medium flex items-center justify-center gap-1">
                      <Star className="w-3 h-3" />
                      Favorites
                    </div>
                  </div>
                  <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">{Object.keys(groupedHistory).length}</div>
                    <div className="text-gray-400 text-sm font-medium flex items-center justify-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Active Days
                    </div>
                  </div>
                </m.div>
              )}

              {/* Action Buttons */}
              {history.length > 0 && (
                <m.div
                  variants={itemVariants}
                  className="flex flex-wrap justify-center gap-3 mb-8"
                >
                  <m.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowClearConfirm(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-xl font-semibold shadow-lg shadow-red-500/25 transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear History
                  </m.button>
                  
                  {favoriteItems.length > 0 && (
                    <m.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        const favSection = document.getElementById('favorites');
                        if (favSection) {
                          favSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="flex items-center gap-2 bg-black/30 hover:bg-black/50 text-white px-4 py-2 rounded-xl font-semibold backdrop-blur-sm border border-white/20 transition-all duration-300"
                    >
                      <Star className="w-4 h-4 text-yellow-400" />
                      View Favorites ({favoriteItems.length})
                    </m.button>
                  )}
                </m.div>
              )}

              {/* Main Content Container */}
              <div className="bg-black/20 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
                {history.length > 0 ? (
                  <>
                    {/* Favorites Section */}
                    {favoriteItems.length > 0 && (
                      <m.section
                        id="favorites"
                        variants={itemVariants}
                        className="mb-12"
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-1 h-6 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full" />
                          <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                            <Star className="w-5 h-5" />
                            Favorite Tools
                          </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {favoriteItems.slice(0, 6).map((item, idx) => (
                            <m.div
                              key={`fav-${item.timestamp}-${idx}`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: idx * 0.1 }}
                              whileHover={{ y: -3, scale: 1.02 }}
                              className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="relative z-10">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-lg">
                                    {item.icon || '🔧'}
                                  </div>
                                  <m.button
                                    whileHover={{ scale: 1.1, rotate: 10 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleFavorite(item.timestamp);
                                    }}
                                    className="text-yellow-400 hover:text-yellow-300 transition-colors"
                                  >
                                    <Star className="w-4 h-4 fill-current" />
                                  </m.button>
                                </div>
                                <h3 className="font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                                  {item.name}
                                </h3>
                                <p className="text-xs text-gray-400 mb-3">
                                  {new Date(item.timestamp).toLocaleString()}
                                </p>
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                  Visit Tool <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </m.div>
                          ))}
                        </div>
                      </m.section>
                    )}

                    {/* History Timeline */}
                    <m.section variants={itemVariants}>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                        <h2 className="text-xl font-bold text-gray-200 flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          Timeline
                        </h2>
                      </div>
                      
                      <div className="space-y-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                        <AnimatePresence>
                          {Object.entries(groupedHistory).map(([date, items], index) => (
                            <m.div
                              key={date}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.4, delay: index * 0.1 }}
                              className="relative"
                            >
                              <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-lg px-3 py-2 mb-4">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-white text-sm">{date}</span>
                                  <span className="text-xs text-gray-400">{items.length} visits</span>
                                </div>
                              </div>

                              <div className="space-y-3 ml-4 border-l border-white/10 pl-4">
                                {items.map((item, idx) => (
                                  <m.div
                                    key={`${item.timestamp}-${idx}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                                    whileHover={{ scale: 1.02, x: 3 }}
                                    className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                                  >
                                    <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-gray-900" />
                                    
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-sm flex-shrink-0">
                                        {item.icon || '🔧'}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                          <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-medium text-white hover:text-blue-300 transition-colors inline-flex items-center gap-1 group-hover:underline text-sm"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            {item.name}
                                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                          </a>
                                          <m.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              toggleFavorite(item.timestamp);
                                            }}
                                            className={`p-1 rounded transition-all duration-200 ${
                                              favorites.includes(item.timestamp)
                                                ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-yellow-400'
                                            }`}
                                          >
                                            <Star className={`w-3 h-3 ${favorites.includes(item.timestamp) ? 'fill-current' : ''}`} />
                                          </m.button>
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
                                          {new Date(item.timestamp).toLocaleTimeString()}
                                        </div>
                                      </div>
                                    </div>
                                  </m.div>
                                ))}
                              </div>
                            </m.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </m.section>
                  </>
                ) : (
                  <m.div
                    variants={itemVariants}
                    className="text-center py-16"
                  >
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center">
                      <Clock className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">No History Yet</h3>
                    <p className="text-lg text-gray-400 mb-6 max-w-md mx-auto">
                      Start exploring AI tools and your journey will be tracked here
                    </p>
                    <m.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.history.back()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 inline-flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      Start Exploring
                    </m.button>
                  </m.div>
                )}
              </div>
            </div>
          </m.div>
        </div>

        {/* Clear Confirmation Modal */}
        <AnimatePresence>
          {showClearConfirm && (
            <>
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={() => setShowClearConfirm(false)}
              />
              <m.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-md w-full">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                      <Trash2 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Clear History?</h3>
                    <p className="text-gray-400 mb-6 text-sm">
                      This will permanently remove all your tool visit history. This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                      <m.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowClearConfirm(false)}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                      >
                        Cancel
                      </m.button>
                      <m.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleClear}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                      >
                        Clear All
                      </m.button>
                    </div>
                  </div>
                </div>
              </m.div>
            </>
          )}
        </AnimatePresence>

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #2563eb, #7c3aed);
          }
        `}</style>
      </div>
    </LazyMotion>
  );
};

export default HistoryPage;