import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const HeroHeading = () => {
  const { t } = useLanguage();

  // Get username from localStorage
  const username = localStorage.getItem('username') || localStorage.getItem('userEmail') || '';
  const isLoggedIn = !!username;

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getPhrases = () => {
      const p = t('hero_phrases');
      return Array.isArray(p) ? p : [
        'Coding Assistants', 'AI Chatbots', 'Video Generators', 'Writing Tools'
      ];
  };

  const phrases = getPhrases();

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % phrases.length);
    }, 2800); // Change every 2.8 seconds

    return () => clearInterval(interval);
  }, [phrases.length]);

  const fadeVariants = {
    enter: { opacity: 0, y: 8 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  };

  const slideVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-6 gap-4">
      {/* Greeting Message */}
      {isLoggedIn && (
        <m.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-lg sm:text-xl md:text-2xl text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text font-semibold">
            {getGreeting()}, {username.split('@')[0]}! 👋
          </p>
        </m.div>
      )}

      {/* Mobile Layout */}
      <div className="block md:hidden w-full">
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-white text-center">
          {t('hero_title_prefix')}
          <span className="block mt-3 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {phrases[currentIndex]}
          </span>
        </h1>
      </div>

      {/* Desktop Layout */}
      <h1 className="hidden md:block text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white text-center px-6">
        {t('hero_title_prefix')}{' '}
        <span className="inline-block w-72 lg:w-80 h-[1.2em] relative align-top">
          <AnimatePresence mode="wait">
            <m.span
              key={currentIndex}
              variants={fadeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="absolute left-0 top-0 inline-block bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap"
            >
              {phrases[currentIndex]}
            </m.span>
          </AnimatePresence>
        </span>
      </h1>
    </div>
  );
};

export default HeroHeading;
