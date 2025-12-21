import React, { useState, useEffect } from 'react';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import { FaExternalLinkAlt, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { addRefToUrl } from '../utils/linkUtils';
import { addToHistory } from '../utils/historyUtils';

const ToolCard = ({ tool, className = '', style = {} }) => {
  const history = useHistory();
  const [imageError, setImageError] = useState(false);

  // Helper to build a favicon URL when no image is available
  const getFaviconUrl = (url) => {
    try {
      if (!url) return null;
      const { hostname } = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=256`;
    } catch {
      return null;
    }
  };

  const handleClick = () => {
    if (!tool.comingSoon) {
      const toolSlug = tool.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      const categorySlug = tool.category || 'all';
      history.push(`/tools/${categorySlug}/${toolSlug}`);
    }
  };

  const getToolKey = React.useCallback(() => tool.url || tool.name || tool.id, [tool.url, tool.name, tool.id]);
  const [saved, setSaved] = React.useState(false);

  useEffect(() => {
    try {
      const key = getToolKey();
      const raw = localStorage.getItem('ai_bookmarks');
      const arr = raw ? JSON.parse(raw) : [];
      setSaved(arr.includes(key));
    } catch (err) {
      // ignore
    }
  }, [getToolKey]);

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

  const primaryImage = tool.image;
  const fallbackImage = getFaviconUrl(tool.url);
  const displayImage = !imageError ? (primaryImage || fallbackImage) : fallbackImage;

  return (
    <LazyMotion features={domAnimation}>
      <m.article
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        onClick={handleClick}
        className={`group relative overflow-hidden rounded-[2rem] bg-[#12121A] border border-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 ${className}`}
        style={style}
      >
        {/* --- Background Image Layer --- */}
        <div className="absolute inset-0 z-0 bg-[#0A0A0A]">
          {displayImage ? (
            <img 
              src={displayImage}
              alt={tool.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
              onError={() => setImageError(true)}
            />
          ) : (
            // Abstract Gradient Fallback
            <div className={`w-full h-full bg-gradient-to-br ${
               tool.pricing === 'Free' ? 'from-green-900/40 to-black' : 
               tool.pricing === 'Paid' ? 'from-red-900/40 to-black' : 
               'from-indigo-900/40 to-black'
            } group-hover:scale-110 transition-transform duration-700`} />
          )}
          
          {/* Default Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80" />
        </div>

        {/* --- Floating Actions (Top Right) --- */}
        <div className="absolute top-4 right-4 z-30 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
             {tool.url && (
                <a
                    href={addRefToUrl(tool.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => { e.stopPropagation(); addToHistory(tool); }}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors border border-white/10"
                    title="Visit Website"
                >
                    <FaExternalLinkAlt className="w-3.5 h-3.5" />
                </a>
            )}
             <button
                className={`w-9 h-9 flex items-center justify-center rounded-full backdrop-blur-md transition-all border border-white/10 ${saved ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-white/10 text-white hover:bg-white/20'}`}
                onClick={toggleBookmark}
                title={saved ? 'Saved' : 'Save'}
            >
                {saved ? <FaBookmark className="w-3.5 h-3.5" /> : <FaRegBookmark className="w-3.5 h-3.5" />}
            </button>
        </div>
        
        {/* --- Top Left Badges --- */}
        <div className="absolute top-4 left-4 z-30 flex flex-col items-start gap-2">
           {(tool.isAiToolsChoice || tool.badge || tool.isNew) && (
             <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full backdrop-blur-md shadow-lg ${
                tool.isAiToolsChoice ? 'bg-gradient-to-r from-amber-400/80 to-orange-500/80 text-white' :
                tool.isNew ? 'bg-gradient-to-r from-blue-500/80 to-purple-500/80 text-white' :
                'bg-white/10 border border-white/10 text-gray-200'
             }`}>
                {tool.isAiToolsChoice ? 'Choice' : (tool.isNew ? 'New' : tool.badge)}
             </span>
           )}
        </div>


        {/* --- Main Content (Bottom) --- */}
        <div className="relative z-20 h-full flex flex-col justify-end p-6">
          <div className="transform transition-transform duration-300 group-hover:translate-y-[-5px]">
            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-purple-300 transition-colors">
              {tool.name}
            </h3>
            
            {/* Description - Semi-transparent, becomes clearer on hover */}
            <p className="text-sm text-gray-300/80 leading-relaxed line-clamp-2 mb-3 group-hover:text-gray-200 transition-colors">
              {tool.shortDescription || tool.description}
            </p>

            {/* Footer Metadata */}
            <div className="flex items-center gap-3 mt-1">
                 {/* Pricing Pill */}
                 {tool.pricing && (
                    <span className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg border backdrop-blur-sm ${
                        tool.pricing === 'Free' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' :
                        tool.pricing === 'Paid' ? 'bg-rose-500/20 border-rose-500/30 text-rose-300' :
                        'bg-blue-500/20 border-blue-500/30 text-blue-300'
                    }`}>
                        {tool.pricing}
                    </span>
                 )}
                 
                 {/* Date - Only show if space permits (optional) */}
                 {tool.dateAdded && (
                    <span className="text-[10px] text-gray-500/80 opacity-0 group-hover:opacity-100 transition-opacity">
                        {new Date(tool.dateAdded).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                 )}
            </div>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      </m.article>
    </LazyMotion>
  );
};

export default ToolCard;
