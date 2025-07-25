import React, { useEffect, useState } from 'react';
import PageWrapper from './PageWrapper';
import { motion as m, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';
import confetti from 'canvas-confetti';
import { FaTrash, FaClock, FaStar, FaRegStar, FaCalendarAlt, FaExternalLinkAlt } from 'react-icons/fa';

const groupByDate = (history) => {
  const groups = {};
  history.forEach((item) => {
    const date = new Date(item.timestamp).toLocaleDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
  });
  return groups;
};

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites') || '[]'));
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('toolClickHistory') || '[]');
    setHistory(stored);

    if (stored.length === 1) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  }, []);

  const handleClear = () => {
    localStorage.removeItem('toolClickHistory');
    setHistory([]);
    setShowClearConfirm(false);
    
    // Celebratory confetti when clearing
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#ef4444', '#f97316', '#eab308']
    });
  };

  const toggleFavorite = (timestamp) => {
    const updatedFavorites = favorites.includes(timestamp)
      ? favorites.filter(fav => fav !== timestamp)
      : [...favorites, timestamp];
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    
    // Small confetti burst when favoriting
    if (!favorites.includes(timestamp)) {
      confetti({
        particleCount: 20,
        spread: 45,
        origin: { y: 0.8 },
        startVelocity: 25,
        colors: ['#fbbf24', '#f59e0b']
      });
    }
  };

  const groupedHistory = groupByDate(history);
  const favoriteItems = history.filter(item => favorites.includes(item.timestamp));

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
        </div>

        <PageWrapper>
          <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-24 pb-16">
            <div className="max-w-6xl mx-auto">
              {/* Header Section */}
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <FaClock className="text-2xl text-white" />
                  </div>
                  <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Tool History
                  </h1>
                </div>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  Track your AI tool exploration journey and revisit your favorite discoveries
                </p>
              </m.div>

              {/* Stats Bar */}
              {history.length > 0 && (
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
                >
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">{history.length}</div>
                    <div className="text-gray-400 text-sm font-medium">Total Visits</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-2">{favoriteItems.length}</div>
                    <div className="text-gray-400 text-sm font-medium">Favorites</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">{Object.keys(groupedHistory).length}</div>
                    <div className="text-gray-400 text-sm font-medium">Active Days</div>
                  </div>
                </m.div>
              )}

              {/* Action Buttons */}
              {history.length > 0 && (
                <m.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex flex-wrap justify-center gap-4 mb-12"
                >
                  <m.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowClearConfirm(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-red-500/25 transition-all duration-300"
                  >
                    <FaTrash className="text-sm" />
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
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold backdrop-blur-sm border border-white/20 transition-all duration-300"
                    >
                      <FaStar className="text-sm text-yellow-400" />
                      View Favorites ({favoriteItems.length})
                    </m.button>
                  )}
                </m.div>
              )}

              {/* Main Content */}
              <div className="relative">
                {history.length > 0 ? (
                  <>
                    {/* Favorites Section */}
                    {favoriteItems.length > 0 && (
                      <m.section
                        id="favorites"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mb-16"
                      >
                        <div className="flex items-center gap-3 mb-8">
                          <div className="w-2 h-8 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full" />
                          <h2 className="text-2xl font-bold text-yellow-400">⭐ Favorite Tools</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {favoriteItems.slice(0, 6).map((item, idx) => (
                            <m.div
                              key={`fav-${item.timestamp}-${idx}`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: idx * 0.1 }}
                              whileHover={{ y: -5, scale: 1.02 }}
                              className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="relative z-10">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-2xl">
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
                                    <FaStar className="text-lg" />
                                  </m.button>
                                </div>
                                <h3 className="font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                                  {item.name}
                                </h3>
                                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                                  Last visited: {new Date(item.timestamp).toLocaleString()}
                                </p>
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                  Visit Tool <FaExternalLinkAlt className="text-xs" />
                                </a>
                              </div>
                            </m.div>
                          ))}
                        </div>
                      </m.section>
                    )}

                    {/* History Timeline */}
                    <m.section
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                        <h2 className="text-2xl font-bold text-gray-200">📅 Timeline</h2>
                      </div>
                      
                      <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
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
                              {/* Date Header */}
                              <div className="sticky top-0 z-20 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 mb-6 shadow-lg">
                                <div className="flex items-center gap-3">
                                  <FaCalendarAlt className="text-blue-400" />
                                  <span className="font-semibold text-white">{date}</span>
                                  <span className="text-sm text-gray-400 ml-auto">{items.length} visits</span>
                                </div>
                              </div>

                              {/* Items for this date */}
                              <div className="space-y-4 ml-4 border-l-2 border-white/10 pl-6">
                                {items.map((item, idx) => (
                                  <m.div
                                    key={`${item.timestamp}-${idx}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                                    onClick={(e) => {
                                      // Ripple effect
                                      const ripple = document.createElement('div');
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      const size = Math.max(rect.width, rect.height);
                                      const x = e.clientX - rect.left - size / 2;
                                      const y = e.clientY - rect.top - size / 2;
                                      
                                      ripple.style.cssText = `
                                        position: absolute;
                                        left: ${x}px;
                                        top: ${y}px;
                                        width: ${size}px;
                                        height: ${size}px;
                                        border-radius: 50%;
                                        background: rgba(59, 130, 246, 0.3);
                                        transform: scale(0);
                                        animation: ripple 600ms ease-out;
                                        pointer-events: none;
                                        z-index: 10;
                                      `;
                                      
                                      e.currentTarget.appendChild(ripple);
                                      setTimeout(() => ripple.remove(), 600);
                                    }}
                                  >
                                    <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-gray-900" />
                                    
                                    <div className="flex items-start gap-4">
                                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-lg flex-shrink-0">
                                        {item.icon || '🔧'}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                          <div className="flex-1">
                                            <a
                                              href={item.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="font-medium text-white hover:text-blue-300 transition-colors inline-flex items-center gap-2 group-hover:underline"
                                              onClick={(e) => e.stopPropagation()}
                                            >
                                              {item.name}
                                              <FaExternalLinkAlt className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </a>
                                            <div className="text-sm text-gray-400 mt-1">
                                              {new Date(item.timestamp).toLocaleTimeString()}
                                            </div>
                                          </div>
                                          <m.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              toggleFavorite(item.timestamp);
                                            }}
                                            className={`p-2 rounded-lg transition-all duration-200 ${
                                              favorites.includes(item.timestamp)
                                                ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-yellow-400'
                                            }`}
                                          >
                                            {favorites.includes(item.timestamp) ? (
                                              <FaStar className="text-sm" />
                                            ) : (
                                              <FaRegStar className="text-sm" />
                                            )}
                                          </m.button>
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
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-center py-20"
                  >
                    <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center">
                      <FaClock className="text-5xl text-gray-400" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">No History Yet</h3>
                    <p className="text-xl text-gray-400 mb-8 max-w-md mx-auto">
                      Start exploring AI tools and your journey will be tracked here
                    </p>
                    <m.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.history.back()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
                    >
                      🚀 Start Exploring
                    </m.button>
                  </m.div>
                )}
              </div>
            </div>
          </div>
        </PageWrapper>

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
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md w-full">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                      <FaTrash className="text-2xl text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Clear History?</h3>
                    <p className="text-gray-400 mb-8">
                      This will permanently remove all your tool visit history. This action cannot be undone.
                    </p>
                    <div className="flex gap-4">
                      <m.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowClearConfirm(false)}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                      >
                        Cancel
                      </m.button>
                      <m.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleClear}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
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
          @keyframes ripple {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
          
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
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
          
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
    </LazyMotion>
  );
};

export default HistoryPage;