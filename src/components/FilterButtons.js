// components/FilterButtons.js
import React from 'react';

const FilterButtons = ({ activeFilter, handleFilter }) => {
  const filters = [
    'all', 'faceless-video', 'video-generators', 'writing-tools', 'presentation-tools',
    'short-clippers', 'marketing-tools', 'voice-tools', 'website-builders', 'image-generators',
    'chatbots', 'music-generators', 'data-analysis', 'gaming-tools', 'ai-diagrams',
    'utility-tools', 'Portfolio','text-humanizer-ai',
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8" role="group" aria-label="Filter tools by category">
      {filters.map((id) => (
        <button
          key={id}
          onClick={() => handleFilter(id)}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
            activeFilter === id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          aria-pressed={activeFilter === id}
        >
          {id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
