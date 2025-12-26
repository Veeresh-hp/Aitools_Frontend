import React, { useState, useEffect, useMemo } from 'react';
import { m, LazyMotion, domAnimation, LayoutGroup } from 'framer-motion';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import toolsData from '../data/toolsData';
import ToolCard from './ToolCard';
import VanishingInput from './VanishingInput';
import { FaTimes } from 'react-icons/fa';

// Utility functions
const getCategoryIcon = (categoryId) => {
  const iconMap = {
    chatbots: 'fa-robot',
    'image-generators': 'fa-image',
    'music-generators': 'fa-music',
    'data-analysis': 'fa-chart-bar',
    'ai-diagrams': 'fa-project-diagram',
    'ai-coding-assistants': 'fa-code',
    'writing-tools': 'fa-pen',
    'spreadsheet-tools': 'fa-database',
    'meeting-notes': 'fa-microphone',
    'email-assistance': 'fa-envelope',
    'ai-scheduling': 'fa-calendar-alt',
    'data-visualization': 'fa-chart-bar',
    'video-generators': 'fa-video',
    'utility-tools': 'fa-tools',
    'marketing-tools': 'fa-bullhorn',
    'voice-tools': 'fa-microphone',
    'presentation-tools': 'fa-chalkboard',
    'website-builders': 'fa-globe',
    'gaming-tools': 'fa-gamepad',
    'short-clippers': 'fa-cut',
    'faceless-video': 'fa-user-secret',
    'Portfolio': 'fa-briefcase',
    'text-humanizer-ai': 'text-purple-600',
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
    'ai-coding-assistants': 'text-blue-600',
    'writing-tools': 'text-blue-600',
    'spreadsheet-tools': 'text-emerald-600',
    'meeting-notes': 'text-yellow-500',
    'email-assistance': 'text-green-600',
    'ai-scheduling': 'text-yellow-500',
    'data-visualization': 'text-teal-600',
    'video-generators': 'text-red-600',
    'utility-tools': 'text-gray-700 dark:text-gray-300',
    'marketing-tools': 'text-orange-500',
    'voice-tools': 'text-yellow-500',
    'presentation-tools': 'text-cyan-600',
    'website-builders': 'text-emerald-600',
    'gaming-tools': 'text-fuchsia-600',
    'short-clippers': 'text-rose-500',
    'faceless-video': 'text-zinc-600',
    'Portfolio': 'text-amber-600',
    'text-humanizer-ai': 'text-purple-600',
  };
  return colorMap[categoryId] || 'text-gray-500 dark:text-gray-400';
};

const Hero = ({ openModal }) => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesOptions = useMemo(
    () => ({
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "grab", // Changed to grab for connecting lines
          },
          resize: true,
        },
        modes: {
          push: {
            quantity: 4,
          },
          grab: {
            distance: 200,
            line_linked: {
              opacity: 0.5,
            },
          },
        },
      },
      particles: {
        color: {
          value: "#ffffff",
        },
        links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.3,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: true, // More organic movement
          speed: 2, // Slightly faster
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 100, // Increased density
        },
        opacity: {
          value: { min: 0.1, max: 0.5 }, // Twinkling effect
          animation: {
            enable: true,
            speed: 1,
            minimumValue: 0.1,
            sync: false
          }
        },
        shape: {
          type: ["circle", "triangle"], // Mixed shapes
        },
        size: {
          value: { min: 1, max: 4 },
        },
      },
      detectRetina: true,
    }),
    [],
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

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

  const handleSearch = () => setActiveFilter('all');
  const handleFilter = (category) => {
    setActiveFilter(category);
    setSearchQuery('');
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

  const filterButtons = [
    { name: 'All', id: 'all' },
    { name: 'Faceless Video', id: 'faceless-video' },
    { name: 'Video Generators', id: 'video-generators' },
    { name: 'AI Coding Assistants', id: 'ai-coding-assistants' },
    { name: 'Writing Tools', id: 'writing-tools' },
    { name: 'AI Scheduling', id: 'ai-scheduling' },
    { name: 'Data Visualization', id: 'data-visualization' },
    { name: 'Email Assistance', id: 'email-assistance' },
    { name: 'Spreadsheet Tools', id: 'spreadsheet-tools' },
    { name: 'Meeting Notes', id: 'meeting-notes' },
    { name: 'Presentation Tools', id: 'presentation-tools' },
    { name: 'Short Clippers', id: 'short-clippers' },
    { name: 'Marketing Tools', id: 'marketing-tools' },
    { name: 'Voice Tools', id: 'voice-tools' },
    { name: 'Website Builders', id: 'website-builders' },
    { name: 'Image Generators', id: 'image-generators' },
    { name: 'Chatbots', id: 'chatbots' },
    { name: 'AI Music Generators', id: 'music-generators' },
    { name: 'AI Prompts Tools', id: 'AI Prompts' },
    { name: 'AI Design Tools', id: 'AI Design' },
    { name: 'AI Data Analysis Tools', id: 'data-analysis' },
    { name: 'AI Gaming Tools', id: 'gaming-tools' },
    { name: 'UML, ER, Use Case Diagrams', id: 'ai-diagrams' },
    { name: 'Other Tools', id: 'other-tools' },
    { name: 'Utility Tools', id: 'utility-tools' },
    { name: 'Ai Portfolio', id: 'Portfolio' },
    { name: 'Text Humanizer AI Tools', id: 'text-humanizer-ai' },
    { name: 'AI Logo Generators', id: 'Logo Generators' },
    { name: 'AI Productivity Tools', id: 'Productivity' },
    { name: 'Social Media Tools', id: 'Social Media' },
  ];

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative overflow-hidden bg-gradient-to-br from-pink-100 via-blue-100 to-emerald-100 dark:from-gray-800 dark:via-gray-900 dark:to-black min-h-screen">
        {/* Particles Background */}
        {init && (
          <Particles
            id="tsparticles"
            options={particlesOptions}
            className="absolute inset-0 z-0 pointer-events-none"
          />
        )}

        {/* Moving Perspective Grid */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: 'perspective(500px) rotateX(20deg) scale(1.5)',
            transformOrigin: 'top center',
            animation: 'gridMove 20s linear infinite' // Needs global CSS for keyframes or inline
          }}
        />
        <style>{`
          @keyframes gridMove {
            0% { background-position: 0 0; }
            100% { background-position: 0 60px; }
          }
        `}</style>

        {/* Floating Backgrounds with Hue Rotation and Color Shift */}
        <m.div
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -30, 30, 0],
            scale: [1, 1.2, 0.9, 1],
            filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          className="absolute -top-10 -left-10 w-72 h-72 bg-pink-300 opacity-30 rounded-full blur-3xl z-0"
        />
        <m.div
          animate={{
            x: [0, -40, 40, 0],
            y: [0, 40, -40, 0],
            scale: [1, 1.1, 0.9, 1],
            filter: ["hue-rotate(0deg)", "hue-rotate(-90deg)", "hue-rotate(0deg)"],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-20 -right-20 w-96 h-96 bg-blue-300 opacity-30 rounded-full blur-3xl z-0"
        />
        <m.div
          animate={{
            x: [0, 60, -20, 0],
            y: [0, -20, 50, 0],
            scale: [1, 0.9, 1.1, 1],
            filter: ["hue-rotate(0deg)", "hue-rotate(60deg)", "hue-rotate(0deg)"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-0 left-1/3 w-96 h-96 bg-emerald-300 opacity-30 rounded-full blur-3xl z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0 dark:from-white/5 dark:to-sky-700/5 backdrop-blur-sm pointer-events-none z-0" />

        {/* Hero Section */}
        <section className="relative z-10 px-4 sm:px-6 md:px-10 lg:px-16 py-20 text-center">
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

        {/* Tools Section */}
        <section id="tools" className="relative z-10 px-4 sm:px-6 py-10">
          <h2 className="text-4xl font-bold mb-6 text-center text-gray-900 dark:text-white">Explore AI Tools</h2>

          {/* Search */}
          <m.div
            className="flex flex-col sm:flex-row items-center justify-center mb-6 gap-2 sm:gap-0"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}  // Reduced from 0.4
          >
            <div className="relative w-full sm:w-72">
              <VanishingInput
                placeholders={[
                  "Search AI tools...",
                  "Find a chatbot...",
                  "Create a logo...",
                  "Write an article...",
                  "Automate workflows...",
                  "Debug code...",
                  "Generate video..."
                ]}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSubmit={handleSearch}
                inputClassName="w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 placeholder-transparent"
              />
              {searchQuery && (
                <FaTimes
                  className="absolute top-3 right-3 text-gray-500 cursor-pointer hover:text-red-500"
                  onClick={() => setSearchQuery('')}
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
          </m.div>

          {/* Filters */}
          <m.div
            className="flex flex-wrap justify-center gap-2 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}  // Removed delay
          >
            {filterButtons.map((btn) => (
              <m.button
                key={btn.id}
                onClick={() => handleFilter(btn.id)}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${activeFilter === btn.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                {btn.name}
              </m.button>
            ))}
          </m.div>

          {/* No Results */}
          {filteredTools.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-10 text-sm">
              No tools found matching your search.
            </div>
          )}

          {/* Tool Cards */}
          <LayoutGroup>
            {filteredTools.map((category) => (
              <m.div key={category.id} layout className="mb-10">
                <m.div
                  layout
                  className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}  // Reduced from 0.5
                >
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
    </LazyMotion>
  );
};

export default Hero;