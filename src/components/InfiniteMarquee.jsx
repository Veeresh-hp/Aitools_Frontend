import React from 'react';
import { motion as m } from 'framer-motion';

const InfiniteMarquee = ({ items, speed = 30, direction = 'left' }) => {
    // Duplicate items to ensure seamless loop
    const marqueeItems = [...items, ...items, ...items];

    return (
        <div className="w-full py-10 overflow-hidden relative group">
            
            {/* Gradient Masks for Fade Effect */}
            <div className="absolute top-0 left-0 w-32 h-full z-10 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-full z-10 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none" />

            {/* Scrolling Container */}
            <div 
                className="flex gap-10 w-max animate-scroll hover:[animation-play-state:paused]"
                style={{ 
                    animationDuration: `${speed}s`,
                    animationDirection: direction === 'right' ? 'reverse' : 'normal'
                }}
            >
                {marqueeItems.map((item, idx) => (
                    <div 
                        key={`${item.name}-${idx}`} 
                        className="flex flex-col items-center justify-center gap-3 opacity-50 hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-pointer group/item"
                        onClick={() => item.url && window.open(item.url, '_blank')}
                    >
                        {/* Logo Container with Glassmorphism */}
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 group-hover/item:border-[#FF6B00]/50 group-hover/item:bg-[#FF6B00]/10 flex items-center justify-center p-3 backdrop-blur-sm transition-all shadow-lg group-hover/item:shadow-orange-900/20">
                            {item.image ? (
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-full h-full object-contain rounded-lg filter grayscale group-hover/item:grayscale-0 transition-all duration-300"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            <div 
                                className="hidden w-full h-full items-center justify-center text-2xl font-bold text-gray-600 group-hover/item:text-[#FF6B00]"
                                style={{ display: !item.image ? 'flex' : 'none' }}
                            >
                                {item.name.charAt(0)}
                            </div>
                        </div>
                        
                        {/* Tool Name */}
                        <span className="text-xs font-semibold text-gray-500 group-hover/item:text-white transition-colors tracking-wide uppercase">
                            {item.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InfiniteMarquee;
