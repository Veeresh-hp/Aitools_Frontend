import React, { useRef, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CARD_WIDTH = 240; // px

export default function Carousel({
  items = [],
  renderItem,
  autoScroll = true,
  autoScrollInterval = 3000,
  className = "",
  cardClassName = "",
}) {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);

  // Drag-to-scroll logic
  useEffect(() => {
    let isDragging = false, startX = 0, scrollLeft = 0;
    const el = ref.current;
    if (!el) return;

    const onMouseDown = (e) => {
      isDragging = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
      el.classList.add("cursor-grabbing");
    };
    const onMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5;
      el.scrollLeft = scrollLeft - walk;
    };
    const onMouseUp = () => {
      isDragging = false;
      el.classList.remove("cursor-grabbing");
    };

    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseUp);
    el.addEventListener("mouseup", onMouseUp);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseUp);
      el.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (!autoScroll || isHovered || !ref.current) return;
    const el = ref.current;
    const interval = setInterval(() => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      let next = el.scrollLeft + CARD_WIDTH;
      if (next > maxScroll + 10) next = 0;
      el.scrollTo({ left: next, behavior: "smooth" });
    }, autoScrollInterval);
    return () => clearInterval(interval);
  }, [isHovered, autoScroll, autoScrollInterval]);

  // Update scroll position for indicator
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => setScrollPos(el.scrollLeft);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // Manual scroll
  const handleArrow = (dir) => {
    if (!ref.current) return;
    const el = ref.current;
    let next = el.scrollLeft + (dir === "left" ? -CARD_WIDTH : CARD_WIDTH);
    el.scrollTo({ left: next, behavior: "smooth" });
  };

  // Progress indicator
  const progress =
    ref.current && ref.current.scrollWidth > ref.current.clientWidth
      ? scrollPos / (ref.current.scrollWidth - ref.current.clientWidth)
      : 0;

  return (
    <div
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Arrows */}
      <button
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-gray-800/80 rounded-full p-2 shadow hover:bg-white dark:hover:bg-gray-700"
        onClick={() => handleArrow("left")}
        aria-label="Scroll left"
        tabIndex={0}
      >
        <FaChevronLeft size={18} />
      </button>
      <button
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-gray-800/80 rounded-full p-2 shadow hover:bg-white dark:hover:bg-gray-700"
        onClick={() => handleArrow("right")}
        aria-label="Scroll right"
        tabIndex={0}
      >
        <FaChevronRight size={18} />
      </button>
      {/* Cards */}
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-1 py-2"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch", cursor: "grab" }}
      >
        {items.map((item, idx) => (
          <div
            key={item.id || idx}
            className={`min-w-[220px] max-w-[240px] snap-center ${cardClassName}`}
          >
            {renderItem(item, idx)}
          </div>
        ))}
      </div>
      {/* Progress Bar */}
      <div className="absolute left-0 right-0 bottom-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 via-pink-400 to-orange-400 transition-all"
          style={{ width: `${Math.max(10, progress * 100)}%` }}
        />
      </div>
    </div>
  );
}
