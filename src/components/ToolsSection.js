import React from 'react';
import { m, LazyMotion, domAnimation, LayoutGroup } from 'framer-motion';
import toolsData from '../data/toolsData';
import ToolCard from './ToolCard';

const ToolsSection = ({ openModal, searchQuery, setSearchQuery, activeFilter, setActiveFilter }) => {
  const handleSearch = () => setActiveFilter('all');

  const handleFilter = (category) => {
    setActiveFilter(category);
    setSearchQuery('');
  };

  const filteredTools = toolsData
    .map((category) => ({
      ...category,
      tools: category.tools.filter((tool) => {
        const matchesSearch = searchQuery
          ? tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchQuery.toLowerCase())
          : true;
        const matchesFilter = activeFilter === 'all' || category.id === activeFilter;
        return matchesSearch && matchesFilter;
      }),
    }))
    .filter((category) => category.tools.length > 0);

  const getCategoryIcon = (categoryId) => {
    const iconMap = {
      chatbots: 'fa-robot',
      'image-generators': 'fa-image',
      'music-generators': 'fa-music',
      'data-analysis': 'fa-chart-bar',
      'ai-diagrams': 'fa-project-diagram',
      'writing-tools': 'fa-pen',
      'video-generators': 'fa-video',
      'utility-tools': 'fa-tools',
      'marketing-tools': 'fa-bullhorn',
      'voice-tools': 'fa-microphone',
      'presentation-tools': 'fa-chalkboard',
      'website-builders': 'fa-globe',
      'gaming-tools': 'fa-gamepad',
      'short-clippers': 'fa-cut',
      'faceless-video': 'fa-user-secret',
      'Portfolio': 'fa-briefcase',

    };
    return iconMap[categoryId] || 'fa-box';
  };

  const getColorClass = (categoryId) => {
    const colorMap = {
      chatbots: 'text-purple-600',
      'image-generators': 'text-pink-600',
      'music-generators': 'text-green-600',
      'data-analysis': 'text-teal-600',
      'ai-diagrams': 'text-indigo-600',
      'writing-tools': 'text-blue-600',
      'video-generators': 'text-red-600',
      'utility-tools': 'text-gray-700 dark:text-gray-300',
      'marketing-tools': 'text-orange-500',
      'voice-tools': 'text-yellow-500',
      'presentation-tools': 'text-cyan-600',
      'website-builders': 'text-emerald-600',
      'gaming-tools': 'text-fuchsia-600',
      'short-clippers': 'text-rose-500',
      'faceless-video': 'text-zinc-600',
      'Portfolio': 'text-amber-600',
    };
    return colorMap[categoryId] || 'text-gray-500 dark:text-gray-400';
  };

  return (
    <LazyMotion features={domAnimation}>
      <LayoutGroup>
        {filteredTools.map((category) => (
          <m.div key={category.id} layout className="mb-10">
            <m.div
              layout
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <i className={`fas ${getCategoryIcon(category.id)} text-lg ${getColorClass(category.id)}`} />
                <h2 className={`text-xl font-semibold ${getColorClass(category.id)} leading-tight`}>
                  {category.name}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {category.tools.map((tool) => (
                  <m.div key={tool.name} layout className="cursor-pointer">
                    <ToolCard tool={tool} openModal={openModal} />
                  </m.div>
                ))}
              </div>
            </m.div>
          </m.div>
        ))}
      </LayoutGroup>
    </LazyMotion>   
  );
};

export default ToolsSection;
