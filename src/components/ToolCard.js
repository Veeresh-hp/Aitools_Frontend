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

    const rotateAmountX = -(y - centerY) / 15;
    const rotateAmountY = (x - centerX) / 15;

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

// ✅ Safe check before calling
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
      chatbots: 'from-violet-100 via-indigo-100 to-indigo-200',
      'image-generators': 'from-rose-100 via-pink-100 to-pink-200',
      'music-generators': 'from-green-100 via-teal-100 to-teal-200',
      'data-analysis': 'from-teal-100 via-cyan-100 to-sky-200',
      'ai-diagrams': 'from-indigo-100 via-purple-100 to-purple-200',
      'writing-tools': 'from-blue-100 via-sky-100 to-blue-200',
      'video-generators': 'from-red-100 via-rose-100 to-orange-200',
      'utility-tools': 'from-gray-100 via-slate-100 to-zinc-200',
      'marketing-tools': 'from-orange-100 via-yellow-100 to-amber-200',
      'voice-tools': 'from-yellow-100 via-amber-100 to-orange-200',
      'presentation-tools': 'from-cyan-100 via-sky-100 to-indigo-200',
      'website-builders': 'from-emerald-100 via-green-100 to-lime-200',
      'gaming-tools': 'from-fuchsia-100 via-pink-100 to-purple-200',
      'short-clippers': 'from-rose-100 via-red-100 to-orange-100',
      'faceless-video': 'from-zinc-100 via-gray-100 to-slate-200',
      'portfolio-tools': 'from-amber-100 via-yellow-100 to-orange-200',
    };
    return gradients[tool.category] || 'from-white via-blue-50 to-sky-100';
  };

  const getBadgeClass = (badge) => {
    switch (badge) {
      case 'Recommended':
        return 'text-yellow-400 border-yellow-400 bg-yellow-100 dark:bg-yellow-900 shadow-md shadow-yellow-300/30 animate-[shimmer_1.5s_linear_infinite] bg-[length:200%_auto] bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-100';
      case 'New':
        return 'text-green-400 border-green-400 bg-green-100 dark:bg-green-900';
      case 'Free':
        return 'text-emerald-500 border-emerald-500 bg-emerald-50 dark:bg-emerald-900';
      case 'Trending':
        return 'text-red-500 border-red-500 bg-red-100 dark:bg-red-900 shadow shadow-red-400/30';
      default:
        return 'text-blue-400 border-blue-400 bg-blue-100 dark:bg-blue-900';
    }
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
        whileHover={!tool.comingSoon ? { scale: 1.03 } : {}}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`
          relative overflow-hidden rounded-xl p-4 flex flex-col gap-2
          bg-gradient-to-tr ${getCategoryGradient(tool.category)} dark:from-gray-700 dark:via-gray-800 dark:to-gray-900
          text-gray-900 dark:text-white shadow-md hover:shadow-lg hover:shadow-blue-200 dark:hover:shadow-sky-700/30
          transition-all duration-150 ease-out
          ${!tool.comingSoon ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}
        `}
      >
        <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-br from-transparent to-white/10 dark:to-sky-700/5" />

        {tool.comingSoon && (
          <span className="absolute top-2 right-2 text-[10px] font-semibold text-yellow-800 bg-yellow-400 px-2 py-1 rounded shadow-sm select-none">
            /*Coming soon */
          </span>
        )}

        <style>{`
          .ripple {
            position: absolute;
            width: 80px;
            height: 80px;
            background: rgba(0, 255, 255, 0.3);
            border-radius: 9999px;
            pointer-events: none;
            transform: translate(-50%, -50%);
            animation: ripple-animation 0.6s ease-out;
            z-index: 0;
          }

          @keyframes ripple-animation {
            from { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            to { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
          }

          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }

          @keyframes pulseIcon {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.9; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>

        <div className="relative z-10">
          <div className="tooltip group w-max" aria-label={tool.name}>
            <i className={`${tool.icon} text-lg text-blue-500 group-hover:animate-[pulseIcon_1s_infinite]`} />
            <span className="tooltip-text group-hover:opacity-100">{tool.name}</span>
          </div>
        </div>

        <h3 className="font-semibold text-sm flex items-center gap-2 z-10">
          {tool.badge && (
            <span className={`text-[10px] font-semibold border rounded px-1 py-[1px] select-none ${getBadgeClass(tool.badge)}`}>
              {tool.badge}
            </span>
          )}
        </h3>

        <p className="text-xs text-gray-600 dark:text-gray-300 leading-tight z-10">
          {tool.description}
        </p>

        {!tool.comingSoon ? (
          <a
            href={tool.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs z-10 mt-auto text-blue-500 hover:underline hover:scale-105 transition-transform duration-200 relative group`}
            onClick={handleGetToolClick}
          >
            Get Tool
            <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Visit external link
            </span>
          </a>
        ) : (
          <button
            disabled
            className="text-xs z-10 text-gray-500 mt-auto cursor-not-allowed"
            onClick={(e) => e.stopPropagation()}
          >
            Get Tool
          </button>
        )}
      </m.article>
    </LazyMotion>
  );
};

export default ToolCard;
