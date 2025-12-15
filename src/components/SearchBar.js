// components/SearchBar.js
import React, { useState, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import Fuse from 'fuse.js';

const SearchBar = ({ toolsData, setSearchQuery, setActiveFilter, setSuggestions, suggestions, searchQuery, isSearchFocused, setIsSearchFocused, activeSuggestionIndex, setActiveSuggestionIndex }) => {
  const debounceRef = useRef(null);

  const toolList = toolsData.flatMap(category =>
    category.tools.map(tool => ({ name: tool.name, category: category.id }))
  );

  const fuse = new Fuse(toolList, {
    keys: ['name'],
    threshold: 0.3,
  });

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim()) {
        const results = fuse.search(value).map(r => r.item);
        setSuggestions(results.slice(0, 5));
      } else {
        setSuggestions([]);
      }
    }, 250);
  };

  const handleSearch = () => {
    setActiveFilter('all');
    setSuggestions([]);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center mb-6 gap-2 sm:gap-0 relative w-full">
      <div className="relative w-full sm:w-[28rem]">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-500" />
        </div>
        <input
          type="text"
          id="search"
          placeholder="Search tools..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={searchQuery}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              setActiveSuggestionIndex((prev) =>
                prev < suggestions.length - 1 ? prev + 1 : 0
              );
            } else if (e.key === 'ArrowUp') {
              setActiveSuggestionIndex((prev) =>
                prev > 0 ? prev - 1 : suggestions.length - 1
              );
            } else if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
              const selected = suggestions[activeSuggestionIndex];
              setSearchQuery(selected.name);
              setActiveFilter(selected.category);
              setSuggestions([]);
              setActiveSuggestionIndex(-1);
            }
          }}
        />
      </div>
      <button
        className="mt-2 sm:mt-0 sm:ml-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
