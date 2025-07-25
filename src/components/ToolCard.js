import React, { useRef } from 'react';
import { m, LazyMotion, domAnimation, useMotionValue } from 'framer-motion';

const ToolCard = ({ tool, openModal }) => {
  const cardRef = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateAmountX = -(y - centerY) / 20;
    const rotateAmountY = (x - centerX) / 20;

    rotateX.set(rotateAmountX);
    rotateY.set(rotateAmountY);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const handleClick = (e) => {
    if (tool.comingSoon) return;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = `${e.nativeEvent.offsetX}px`;
    ripple.style.top = `${e.nativeEvent.offsetY}px`;
    cardRef.current.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    if (typeof openModal === 'function') {
      openModal(tool);
    } else {
      console.warn("openModal is not a function", openModal);
    }
  };

  const handleGetToolClick = (e) => {
    e.stopPropagation();
    if (!tool.url) {
      e.preventDefault();
      return;
    }

    const historyItem = {
      name: tool.name,
      url: tool.url,
      icon: tool.icon,
      timestamp: new Date().toISOString(),
    };

    const existingHistory = JSON.parse(localStorage.getItem("toolClickHistory") || "[]");
    const updatedHistory = [historyItem, ...existingHistory.slice(0, 9)];
    localStorage.setItem("toolClickHistory", JSON.stringify(updatedHistory));
  };

  const getCategoryGradient = (category) => {
    const gradients = {
      chatbots: 'from-violet-600/20 via-indigo-600/20 to-purple-600/20',
      'image-generators': 'from-rose-600/20 via-pink-600/20 to-fuchsia-600/20',
      'music-generators': 'from-green-600/20 via-teal-600/20 to-emerald-600/20',
      'data-analysis': 'from-teal-600/20 via-cyan-600/20 to-sky-600/20',
      'ai-diagrams': 'from-indigo-600/20 via-purple-600/20 to-violet-600/20',
      'writing-tools': 'from-blue-600/20 via-sky-600/20 to-cyan-600/20',
      'video-generators': 'from-red-600/20 via-rose-600/20 to-orange-600/20',
      'utility-tools': 'from-gray-600/20 via-slate-600/20 to-zinc-600/20',
      'marketing-tools': 'from-orange-600/20 via-yellow-600/20 to-amber-600/20',
      'voice-tools': 'from-yellow-600/20 via-amber-600/20 to-orange-600/20',
      'presentation-tools': 'from-cyan-600/20 via-sky-600/20 to-indigo-600/20',
      'website-builders': 'from-emerald-600/20 via-green-600/20 to-lime-600/20',
      'gaming-tools': 'from-fuchsia-600/20 via-pink-600/20 to-purple-600/20',
      'short-clippers': 'from-rose-600/20 via-red-600/20 to-orange-600/20',
      'faceless-video': 'from-zinc-600/20 via-gray-600/20 to-slate-600/20',
      'portfolio-tools': 'from-amber-600/20 via-yellow-600/20 to-orange-600/20',
      'text-humanizer-ai': 'from-indigo-600/20 via-purple-600/20 to-pink-600/20',
    };
    return gradients[tool.category] || 'from-blue-600/20 via-purple-600/20 to-indigo-600/20';
  };

  const getBadgeClass = (badge) => {
    switch (badge) {
      case 'Recommended':
        return 'text-yellow-300 border-yellow-400/50 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm shadow-lg shadow-yellow-500/20 animate-pulse';
      case 'New':
        return 'text-green-300 border-green-400/50 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm';
      case 'Free':
        return 'text-emerald-300 border-emerald-400/50 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm';
      case 'Trending':
        return 'text-red-300 border-red-400/50 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm shadow-lg shadow-red-500/20';
      default:
        return 'text-blue-300 border-blue-400/50 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-sm';
    }
  };

  const getIconColor = (category) => {
    const colors = {
      chatbots: 'text-violet-400',
      'image-generators': 'text-pink-400',
      'music-generators': 'text-green-400',
      'data-analysis': 'text-teal-400',
      'ai-diagrams': 'text-indigo-400',
      'writing-tools': 'text-blue-400',
      'video-generators': 'text-red-400',
      'utility-tools': 'text-gray-400',
      'marketing-tools': 'text-orange-400',
      'voice-tools': 'text-yellow-400',
      'presentation-tools': 'text-cyan-400',
      'website-builders': 'text-emerald-400',
      'gaming-tools': 'text-fuchsia-400',
      'short-clippers': 'text-rose-400',
      'faceless-video': 'text-zinc-400',
      'portfolio-tools': 'text-amber-400',
      'text-humanizer-ai': 'text-purple-400',
    };
    return colors[tool.category] || 'text-blue-400';
  };

  return (
    <LazyMotion features={domAnimation}>
      <m.article
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1000,
        }}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !tool.comingSoon && typeof openModal === 'function') {
            openModal(tool);
          }
        }}
        aria-disabled={tool.comingSoon}
        aria-label={`${tool.name} tool card${tool.comingSoon ? ', coming soon' : ''}`}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={!tool.comingSoon ? { 
          scale: 1.05, 
          y: -5,
          transition: { duration: 0.3, ease: "easeOut" }
        } : {}}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`
          group relative overflow-hidden rounded-2xl p-6 flex flex-col gap-4 h-full
          bg-gradient-to-br ${getCategoryGradient(tool.category)} 
          backdrop-blur-xl border border-white/10
          text-white shadow-lg hover:shadow-2xl hover:shadow-blue-500/10
          transition-all duration-300 ease-out
          ${!tool.comingSoon ? 'cursor-pointer hover:border-white/20' : 'cursor-not-allowed opacity-60'}
        `}
      >
        {/* Animated background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Subtle animated border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-purple-500/20 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
             style={{ background: 'linear-gradient(45deg, transparent, rgba(99, 102, 241, 0.1), transparent)' }} />

        {tool.comingSoon && (
          <m.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-3 right-3 text-xs font-semibold text-yellow-300 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-400/30 px-3 py-1 rounded-full shadow-lg z-20"
          >
            Coming Soon
          </m.span>
        )}

        <style>{`
          .ripple {
            position: absolute;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            transform: translate(-50%, -50%);
            animation: ripple-animation 0.6s ease-out;
            z-index: 10;
          }

          @keyframes ripple-animation {
            from { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            to { transform: translate(-50%, -50%) scale(3); opacity: 0; }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }

          @keyframes glow {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
          }

          .icon-hover {
            transition: all 0.3s ease;
          }

          .group:hover .icon-hover {
            animation: float 2s ease-in-out infinite;
            filter: drop-shadow(0 0 8px currentColor);
          }
        `}</style>

        {/* Icon and Title Section */}
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
              <i className={`${tool.icon} text-xl ${getIconColor(tool.category)} icon-hover`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-white truncate group-hover:text-blue-200 transition-colors duration-300">
                {tool.name}
              </h3>
              {tool.badge && (
                <m.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`inline-block text-xs font-medium border rounded-full px-2 py-1 mt-1 ${getBadgeClass(tool.badge)}`}
                >
                  {tool.badge}
                </m.span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 leading-relaxed flex-1 group-hover:text-gray-200 transition-colors duration-300">
          {tool.description}
        </p>

        {/* Action Button */}
        <div className="relative z-10 mt-auto pt-2">
          {!tool.comingSoon ? (
            <m.a
              href={tool.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleGetToolClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group/btn relative inline-flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Tool
                <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            </m.a>
          ) : (
            <button
              disabled
              className="w-full px-4 py-3 text-sm font-medium text-gray-500 bg-gray-800/50 rounded-xl cursor-not-allowed border border-gray-700/50"
              onClick={(e) => e.stopPropagation()}
            >
              Coming Soon
            </button>
          )}
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </m.article>
    </LazyMotion>
  );
};

export default ToolCard;