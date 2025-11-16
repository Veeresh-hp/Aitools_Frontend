import React, { useRef, useEffect, useState } from 'react';

// Mobile sticky category tabs - simple, clean design
export default function MobileCategoryTabs({ categories = [], activeId = 'all', onSelect = () => {} }) {
  const listRef = useRef(null);
  const activeRef = useRef(null);

  const [headerOffset, setHeaderOffset] = useState(80);

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

  // Measure header height for proper offset
  useEffect(() => {
    const computeHeader = () => {
      const header = document.querySelector('header');
      const h = header ? Math.round(header.getBoundingClientRect().height) : 80;
      setHeaderOffset(h);
    };
    computeHeader();
    window.addEventListener('resize', computeHeader);
    return () => window.removeEventListener('resize', computeHeader);
  }, []);

  if (!categories || categories.length === 0) return null;

  return (
    <div className="md:hidden block w-full">
      <nav
        id="mobile-category-tabs"
        className="sticky z-40 backdrop-blur-md bg-gradient-to-b from-[#0a0e27]/60 to-[#0a0e27]/40 border-b border-white/5"
        role="tablist"
        aria-label="Browse categories"
        style={{ top: headerOffset }}
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
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors duration-150 border ${
                    isActive
                      ? 'bg-blue-600/40 text-white border-blue-500/50'
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
      </nav>
    </div>
  );
}
