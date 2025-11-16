// components/FilterButtons.js
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CATEGORY_IDS, formatCategoryLabel } from '../utils/categories';
import { FaChevronDown, FaLayerGroup, FaArrowLeft, FaBolt, FaCube, FaDollarSign } from 'react-icons/fa';

const FilterButtons = ({ 
  activeFilter, 
  handleFilter, 
  activePricing, 
  handlePricing, 
  sortBy, 
  handleSort 
}) => {
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Centralized categories list (keeps UI in sync); includes 'all' as first element
  const filters = CATEGORY_IDS;

  const pricingOptions = [
    { value: 'all', label: 'All Resources', icon: <FaLayerGroup className="w-4 h-4 text-blue-500" /> },
    { value: 'free', label: 'Free', icon: <FaArrowLeft className="w-4 h-4 text-cyan-500" /> },
    { value: 'freemium', label: 'Freemium', icon: <FaBolt className="w-4 h-4 text-yellow-500" /> },
    { value: 'open-source', label: 'Open Source', icon: <FaCube className="w-4 h-4 text-purple-500" /> },
    { value: 'paid', label: 'Paid', icon: <FaDollarSign className="w-4 h-4 text-green-500" /> }
  ];

  const sortOptions = [
    { value: 'date-added', label: 'Date Added' },
    { value: 'name', label: 'Name' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsPricingOpen(false);
      }
    };

    if (isPricingOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isPricingOpen]);

  // Close dropdown on scroll in mobile
  useEffect(() => {
    if (!isPricingOpen) return;

    const handleScroll = () => {
      setIsPricingOpen(false);
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, [isPricingOpen]);

  const getSelectedPricingLabel = () => {
    const selected = pricingOptions.find(opt => opt.value === activePricing);
    return selected ? selected.label : 'All Resources';
  };

  const handleOptionClick = (value) => {
    handlePricing(value);
    setIsPricingOpen(false);
  };

  return (
    <div className="space-y-4 relative">
      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter tools by category">
        {filters.map((id) => (
          <button
            key={id}
            onClick={() => handleFilter(id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 ${
              activeFilter === id
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700'
            }`}
            aria-pressed={activeFilter === id}
            aria-label={`Filter by ${formatCategoryLabel(id)}`}
            tabIndex={0}
          >
            {formatCategoryLabel(id)}
          </button>
        ))}
      </div>

      {/* Pricing Dropdown & Sort Filters Row */}
      <div className="flex flex-wrap justify-center items-start gap-4 relative z-50">
        {/* Pricing Dropdown */}
        <div ref={dropdownRef}>
          <button
            ref={buttonRef}
            onClick={() => setIsPricingOpen(!isPricingOpen)}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-white text-gray-800 border border-orange-400 hover:bg-orange-50 transition-all duration-200 flex items-center gap-2 min-w-[150px] justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60"
            type="button"
          >
            <span>{getSelectedPricingLabel()}</span>
            <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${isPricingOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu - Rendered via Portal at document root */}
          {isPricingOpen && createPortal(
            <>
              {/* Overlay to catch outside clicks and prevent interaction with background */}
              <div 
                className="fixed inset-0 z-[99997] bg-transparent"
                onClick={() => setIsPricingOpen(false)}
                style={{ pointerEvents: 'auto' }}
              />
              
              {/* Dropdown */}
              <div 
                className="fixed bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 min-w-[220px] z-[99999] overflow-y-auto overflow-x-hidden pointer-events-auto"
                style={{
                  maxHeight: '400px',
                  maxWidth: '90vw',
                  top: buttonRef.current ? `${buttonRef.current.getBoundingClientRect().bottom + window.scrollY + 8}px` : '0',
                  left: buttonRef.current ? `${Math.max(10, buttonRef.current.getBoundingClientRect().left)}px` : '0',
                  pointerEvents: 'auto'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {pricingOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleOptionClick(option.value)}
                    onTouchEnd={() => handleOptionClick(option.value)}
                    onMouseDown={() => handleOptionClick(option.value)}
                    type="button"
                    className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-150 first:rounded-t-xl last:rounded-b-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 pointer-events-auto cursor-pointer ${
                      activePricing === option.value ? 'bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500' : ''
                    }`}
                    style={{ pointerEvents: 'auto' }}
                  >
                    <div className="flex-shrink-0 pointer-events-none">
                      {option.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-800 dark:text-white whitespace-nowrap pointer-events-none">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </>,
            document.body
          )}
          
          <style jsx>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSort(option.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/60 ${
                sortBy === option.value
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700'
              }`}
              aria-pressed={sortBy === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterButtons;
