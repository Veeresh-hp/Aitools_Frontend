import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const LinkPreview = ({ 
  children, 
  url, 
  className = "", 
  width = 300, 
  height = 160,
  quality = "medium"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      setPosition({
        top: rect.top + scrollY, // Top of the trigger
        left: rect.left + rect.width / 2, // Center of the trigger
      });
      setIsOpen(true);
    }
  };

  if (!isMounted) return <span className={className}>{children}</span>;

  // Thum.io URL construction
  const getThumbnailUrl = (targetUrl) => {
    if (!targetUrl) return '';
    return `https://image.thum.io/get/width/${width * 2}/crop/${height * 2}/noanimate/${targetUrl}`;
  };

  const previewImage = getThumbnailUrl(url);

  return (
    <>
      <div 
        ref={triggerRef}
        className={`relative inline-block ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsOpen(false)}
      >
        <a 
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="contents" // Use contents to avoid layout issues, or just wrap children
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </a>
      </div>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="absolute z-[9999] pointer-events-none"
              style={{ 
                top: position.top - 12, // slightly above the trigger
                left: position.left,
                transform: 'translateX(-50%) translateY(-100%)' // Center horizontally, move above
              }}
            >
                {/* 
                   We need to offset via CSS translate because 'left' is centered. 
                   And 'top' is at the trigger's top, so translateY(-100%) moves it up.
                */}
               <div 
                  className="bg-[#12121A] rounded-xl overflow-hidden border border-white/10 shadow-2xl p-2 origin-bottom -translate-x-1/2 -translate-y-full"
                  style={{ width }}
               >
                <div 
                  className="bg-black/50 rounded-lg overflow-hidden relative"
                  style={{ height }}
                >
                    {/* Loading / Placeholder State */}
                     <div className="absolute inset-0 flex items-center justify-center bg-white/5 animate-pulse">
                        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/80 animate-spin"/>
                     </div>
                     
                     {/* Actual Image */}
                     <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="w-full h-full object-cover relative z-10"
                        onLoad={(e) => e.target.parentElement.classList.remove('animate-pulse')}
                     />
                     
                     {/* Gradient Overlay */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-20" />
                     
                     {/* URL Label */}
                     <div className="absolute bottom-2 left-2 right-2 z-30">
                        <p className="text-[10px] text-gray-300 truncate bg-black/50 backdrop-blur-md px-2 py-1 rounded border border-white/10 inline-block font-mono">
                            {url.replace(/^https?:\/\//, '').split('/')[0]}
                        </p>
                     </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default LinkPreview;
