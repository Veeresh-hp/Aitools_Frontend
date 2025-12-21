import React, { useRef, useEffect, useState } from 'react';

// Mobile sticky category tabs - simple, clean design
export default function MobileCategoryTabs({ categories = [], activeId = 'all', onSelect = () => {} }) {
  const listRef = useRef(null);
  const activeRef = useRef(null);

  // Auto-scroll active tab into view
  useEffect(() => {
    const el = activeRef.current;
    const list = listRef.current;
    if (!el || !list) return;
    const elRect = el.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    if (elRect.left < listRect.left || elRect.right > listRect.right) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeId]);

  if (!categories || categories.length === 0) return null;

  return (
    <div 
      className="md:hidden block w-full sticky z-40 backdrop-blur-md bg-black border-b border-white/5" 
      style={{ top: '64px' }}
    >
      <nav
        id="mobile-category-tabs"
        role="tablist"
        aria-label="Browse categories"
      >
        <div className="px-3 py-2 overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div
            ref={listRef}
            className="flex items-center gap-2"
            style={{ scrollBehavior: 'smooth' }}
          >
            {categories.map((c) => {
              const isActive = c.id === activeId;
              return (
                <button
                  key={c.id}
                  ref={isActive ? activeRef : null}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onSelect(c.id)}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 border ${
                    isActive
                      ? 'bg-[#FF6B00] text-white border-orange-500 shadow-lg shadow-orange-500/20'
                      : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
        {/* Fade Indicator */}
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#0a0e27] to-transparent pointer-events-none" />
      </nav>
    </div>
  );
}
