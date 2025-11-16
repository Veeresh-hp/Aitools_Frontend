import React, { useState, useEffect } from 'react';
import { m, LazyMotion, domAnimation, LayoutGroup } from 'framer-motion';
import toolsData from '../data/toolsData';
import ToolCard from './ToolCard';

const ToolsSection = ({ openModal, searchQuery, setSearchQuery, activeFilter, setActiveFilter }) => {
  const [approvedTools, setApprovedTools] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Fetch approved tools from backend
  useEffect(() => {
    const fetchApprovedTools = async () => {
      try {
        console.log('🔍 Fetching approved tools from:', `${API_URL}/api/tools/approved`);
        const res = await fetch(`${API_URL}/api/tools/approved`);
        const json = await res.json();
        console.log('✅ Approved tools response:', json);
        if (res.ok) {
          setApprovedTools(json.tools || []);
          console.log('📦 Set approved tools count:', json.tools?.length || 0);
        }
      } catch (err) {
        console.error('❌ Failed to fetch approved tools:', err);
      }
    };
    fetchApprovedTools();
  }, [API_URL]);

  const handleSearch = () => setActiveFilter('all');

  const handleFilter = (category) => {
    setActiveFilter(category);
    setSearchQuery('');
  };

  // Convert approved tools from database to display format with NEW badge
  const convertedApprovedTools = approvedTools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    link: tool.url || '#',
    image: tool.snapshotUrl ? `${API_URL}${tool.snapshotUrl}` : null,
    isNew: true, // Mark as NEW
    category: tool.category || 'community-submitted', // Use category or default to 'community-submitted'
  }));

  console.log('🎯 Converted approved tools:', convertedApprovedTools);

  // Merge approved tools into their respective categories
  const allToolsData = toolsData.map(category => {
    // Find approved tools that belong to this category
    const categoryApprovedTools = convertedApprovedTools.filter(
      tool => tool.category === category.id
    );
    
    console.log(`🔍 Category "${category.id}" (${category.name}): Found ${categoryApprovedTools.length} approved tools`);
    if (categoryApprovedTools.length > 0) {
      console.log(`   ✅ Adding tools:`, categoryApprovedTools.map(t => t.name));
    }
    
    // If there are approved tools for this category, add them
    if (categoryApprovedTools.length > 0) {
      return {
        ...category,
        tools: [...category.tools, ...categoryApprovedTools]
      };
    }
    
    return category;
  });

  // Add new categories for approved tools that don't match existing categories
  const newCategories = {};
  convertedApprovedTools.forEach(tool => {
    const categoryExists = toolsData.some(cat => cat.id === tool.category);
    if (!categoryExists) {
      if (!newCategories[tool.category]) {
        newCategories[tool.category] = {
          id: tool.category,
          name: `🎉 ${tool.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`,
          tools: []
        };
      }
      newCategories[tool.category].tools.push(tool);
    }
  });

  // Add new categories to the end
  const finalToolsData = [...allToolsData, ...Object.values(newCategories)];

  const filteredTools = finalToolsData
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

  // Calculate total tools count including approved tools
  const totalToolsCount = finalToolsData.reduce((sum, category) => sum + category.tools.length, 0);
  console.log('📊 Total tools count:', totalToolsCount);

  const getCategoryIcon = (categoryId) => {
    const iconMap = {
      chatbots: 'fa-robot',
      'image-generators': 'fa-image',
      'music-generators': 'fa-music',
      'data-analysis': 'fa-chart-bar',
      'ai-diagrams': 'fa-project-diagram',
      'writing-tools': 'fa-pen',
      'email-assistance': 'fa-envelope',
      'data-visualization': 'fa-chart-bar',
      'ai-scheduling': 'fa-calendar-alt',
      'meeting-notes': 'fa-microphone',
      'spreadsheet-tools': 'fa-database',
      'ai-coding-assistants': 'fa-code',
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
      'text-humanizer-ai': 'text-purple-600',
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
      'ai-coding-assistants': 'text-blue-600',
      'writing-tools': 'text-blue-600',
      'email-assistance': 'text-green-600',
      'data-visualization': 'text-teal-600',
      'ai-scheduling': 'text-yellow-500',
      'meeting-notes': 'text-yellow-500',
      'spreadsheet-tools': 'text-emerald-600',
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
      'text-humanizer-ai': 'text-purple-600',
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
