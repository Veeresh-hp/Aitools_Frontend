import React from 'react';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import { FaExternalLinkAlt, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useHistory, Link } from 'react-router-dom';

const ToolCard = ({ tool, openModal }) => {
  const history = useHistory();

  // Helper to build a favicon URL when no image is available
  const getFaviconUrl = (url) => {
    try {
      if (!url) return null;
      const { hostname } = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
    } catch {
      return null;
    }
  };

  const handleClick = () => {
    if (!tool.comingSoon) {
      // Generate tool slug from name
      const toolSlug = tool.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      // Navigate to tool detail page with fallback for undefined category
      const categorySlug = tool.category || 'all';
      history.push(`/tools/${categorySlug}/${toolSlug}`);
    }
  };

  const handleGetToolClick = (e) => {
    e.stopPropagation();
  };

  // Bookmark (save) state: persist bookmarks in localStorage under 'ai_bookmarks'
  const getToolKey = () => tool.url || tool.name || tool.id;
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    try {
      const key = getToolKey();
      const raw = localStorage.getItem('ai_bookmarks');
      const arr = raw ? JSON.parse(raw) : [];
      setSaved(arr.includes(key));
    } catch (err) {
      // ignore
    }
  }, [tool.url, tool.name, tool.id]);

  const toggleBookmark = (e) => {
    e.stopPropagation();
    try {
      const key = getToolKey();
      const raw = localStorage.getItem('ai_bookmarks');
      let arr = raw ? JSON.parse(raw) : [];
      if (arr.includes(key)) {
        arr = arr.filter(x => x !== key);
        setSaved(false);
      } else {
        arr.push(key);
        setSaved(true);
      }
      localStorage.setItem('ai_bookmarks', JSON.stringify(arr));
    } catch (err) {
      console.error('bookmark error', err);
    }
  };

  const getCategoryGradient = (category) => {
    const gradients = {
      chatbots: 'from-violet-600/20 via-indigo-600/20 to-purple-600/20',
      'image-generators': 'from-rose-600/20 via-pink-600/20 to-fuchsia-600/20',
      'music-generators': 'from-green-600/20 via-teal-600/20 to-emerald-600/20',
      'data-analysis': 'from-teal-600/20 via-cyan-600/20 to-sky-600/20',
      'ai-diagrams': 'from-indigo-600/20 via-purple-600/20 to-violet-600/20',
      'ai-coding-assistants': 'from-blue-600/20 via-indigo-600/20 to-purple-600/20',
      'writing-tools': 'from-blue-600/20 via-sky-600/20 to-cyan-600/20',
      'email-assistance': 'from-green-600/20 via-teal-600/20 to-emerald-600/20',
      'spreadsheet-tools': 'from-emerald-600/20 via-green-600/20 to-lime-600/20',
      'ai-scheduling': 'from-yellow-600/20 via-amber-600/20 to-orange-600/20',
      'data-visualization': 'from-teal-600/20 via-cyan-600/20 to-sky-600/20',
      'meeting-notes': 'from-yellow-600/20 via-amber-600/20 to-orange-600/20',
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
      case 'Paid':
        return 'bg-red-500 text-white';
      case 'Free':
        return 'bg-green-500 text-white';
      case 'Freemium':
        return 'bg-orange-500 text-white';
      case 'Recommended':
        return 'bg-yellow-500 text-white';
      case 'Admin Choice':
        return 'bg-yellow-500 text-white font-bold border border-yellow-400 shadow-yellow-500/20';
      case 'New':
        return 'bg-blue-500 text-white';
      case 'Trending':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getIconColor = (category) => {
    const colors = {
      chatbots: 'text-violet-400',
      'image-generators': 'text-pink-400',
      'music-generators': 'text-green-400',
      'data-analysis': 'text-teal-400',
      'ai-diagrams': 'text-indigo-400',
      'ai-coding-assistants': 'text-blue-400',
      'writing-tools': 'text-blue-400',
      'meeting-notes': 'text-yellow-400',
      'data-visualization': 'text-teal-400',
      'ai-scheduling': 'text-yellow-400',
      'spreadsheet-tools': 'text-emerald-400',
      'email-assistance': 'text-green-400',
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
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0 }}
        className={`group relative rounded-2xl shadow-xl flex flex-col overflow-hidden transition-all duration-200 bg-gradient-to-br ${getCategoryGradient(tool.category)} backdrop-blur-xl border border-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2`}
      >
        {/* Tool Image - Full Width at Top */}
        <div
          className="relative w-full h-48 bg-black/30 overflow-hidden cursor-pointer group/image"
          onClick={handleClick}
        >
          {tool.image || tool.url ? (
            <>
              <img
                src={tool.image || getFaviconUrl(tool.url)}
                alt={tool.name}
                loading="lazy"
                decoding="async"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={e => {
                  try {
                    const imgEl = e.currentTarget;
                    const current = imgEl.getAttribute('src') || '';
                    // 1) Fix case-sensitive local assets
                    if (current.includes('/images/')) {
                      imgEl.onerror = null;
                      imgEl.src = getFaviconUrl(tool.url);
                      return;
                    }
                    // 2) Fallback to favicon
                    imgEl.onerror = null;
                    imgEl.src = getFaviconUrl(tool.url);
                  } catch (err) {
                    // ignore
                  }
                }}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm bg-black/20">
              No Image Available
            </div>
          )}

          {/* Badge - Top Left */}
          {(tool.badge || tool.isNew) && (
            <span className={`absolute top-3 left-3 px-3 py-1 rounded-md text-xs font-bold shadow-lg z-10 ${tool.isNew
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white animate-pulse'
              : getBadgeClass(tool.badge)
              }`}>
              {tool.isNew ? '🎉 NEW' : tool.badge}
            </span>
          )}

          {/* Bookmark (save) Icon - Top Right */}
          <button
            className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-lg ${saved ? 'bg-yellow-500 text-white' : 'bg-white/10 text-white'} backdrop-blur-md hover:scale-105 transition-all duration-150 z-30 border ${saved ? 'border-yellow-400' : 'border-white/20'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/70`}
            onClick={toggleBookmark}
            title={saved ? 'Saved' : 'Save'}
            aria-pressed={saved}
          >
            {saved ? <FaBookmark className="w-4 h-4" /> : <FaRegBookmark className="w-4 h-4" />}
          </button>

          {/* View Now Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
            <span className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-semibold text-sm transform translate-y-4 group-hover/image:translate-y-0 transition-transform duration-300">
              Click Here
            </span>
          </div>

          {/* Open Tool Button moved to bottom-right corner of the card */}
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col px-5 pt-4 pb-14 gap-3">
          {/* Tool Name */}
          <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors duration-200">
            {tool.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed group-hover:text-gray-200">
            {tool.shortDescription || tool.description}
          </p>
        </div>

        {/* Bottom Left Corner - Date and Category Tags */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 z-10">
          {/* Date Added */}
          {tool.dateAdded && (
            <div className="flex items-center gap-1.5 text-xs text-gray-300 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-sm">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {new Date(tool.dateAdded).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              {/* Pricing Badge */}
              {tool.pricing && (
                <Link
                  to={`/?pricing=${tool.pricing.toLowerCase().replace(' ', '-')}`}
                  onClick={(e) => e.stopPropagation()}
                  className={`px-3 py-1 text-xs font-medium rounded-full backdrop-blur-sm border shadow-sm transition-transform hover:scale-105 ${tool.pricing === 'Free' ? 'bg-green-500/20 text-green-200 border-green-500/30' :
                    tool.pricing === 'Paid' ? 'bg-red-500/20 text-red-200 border-red-500/30' :
                      tool.pricing === 'Open Source' ? 'bg-purple-500/20 text-purple-200 border-purple-500/30' :
                        tool.pricing === 'subscription' ? 'bg-indigo-500/20 text-indigo-200 border-indigo-500/30' :
                          'bg-yellow-500/20 text-yellow-100 border-yellow-500/30' // Freemium
                    }`}
                >
                  {tool.pricing}
                </Link>
              )}
            </div>
          )}
        </div>

        {tool.url && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              try {
                window.open(tool.url, '_blank', 'noopener,noreferrer');
              } catch (err) {
                window.location.href = tool.url;
              }
            }}
            className="absolute bottom-3 right-3 p-0 text-white hover:text-blue-300 transition-colors z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 rounded"
            title={`Open ${tool.name}`}
            aria-label={`Open ${tool.name}`}
          >
            <FaExternalLinkAlt className="w-4 h-4 opacity-90" />
          </button>
        )}
      </m.article>
    </LazyMotion>
  );
};

export default ToolCard;
