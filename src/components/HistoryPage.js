import React, { useEffect, useState } from 'react';
import PageWrapper from './PageWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

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
  };

  const toggleFavorite = (timestamp) => {
    const updatedFavorites = favorites.includes(timestamp)
      ? favorites.filter(fav => fav !== timestamp)
      : [...favorites, timestamp];
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const groupedHistory = groupByDate(history);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7f6fb] to-[#f0eff7] dark:from-gray-900 dark:to-gray-800 transition-all duration-500 px-4 py-16">
      <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-gray-900 shadow-2xl p-6 sm:p-10 space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            📜 Tool Click History
          </h2>
          {history.length > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm rounded-md shadow transition-all"
            >
              🧹 Clear History
            </button>
          )}
        </div>

        {/* Scrollable content inside the card */}
        <div className="relative max-h-[50vh] overflow-y-auto pr-2 space-y-6">
          {history.length ? (
            <AnimatePresence>
              {Object.entries(groupedHistory).map(([date, items], index) => (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {/* Floating Date Label */}
                  <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200 w-fit">
                    📅 {date}
                  </div>

                  <ul className="space-y-3">
                    {items.map((item, idx) => (
                      <motion.li
                        key={item.timestamp + idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="group relative border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm flex items-start gap-4 overflow-hidden cursor-pointer"
                        onClick={(e) => {
                          const ripple = document.createElement('span');
                          ripple.className = 'absolute top-0 left-0 w-full h-full bg-blue-100 opacity-20 animate-ping z-0';
                          e.currentTarget.appendChild(ripple);
                          setTimeout(() => ripple.remove(), 300);
                        }}
                      >
                        <i className={`${item.icon} text-2xl text-blue-600`} />
                        <div className="flex-1 z-10">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm sm:text-base font-medium"
                          >
                            {item.name}
                          </a>
                          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(item.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item.timestamp);
                          }}
                          className={`z-10 ml-2 text-sm px-2 py-1 rounded-full transition-colors ${favorites.includes(item.timestamp)
                            ? 'bg-yellow-400 text-black'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-yellow-300'}`}
                        >
                          {favorites.includes(item.timestamp) ? '⭐ Pinned' : '📌 Pin'}
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center mt-10 text-gray-500 dark:text-gray-400"
            >
              <p className="text-lg sm:text-xl mb-2">No history found. 🫥</p>
              <p className="text-sm">Start exploring tools and your visits will show up here.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
