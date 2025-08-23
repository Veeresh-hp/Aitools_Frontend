export const getCategoryIcon = (categoryId) => {
  const iconMap = {
    chatbots: 'fa-robot',
    'image-generators': 'fa-image',
    'music-generators': 'fa-music',
    'data-analysis': 'fa-chart-bar',
    'ai-diagrams': 'fa-project-diagram',
    'ai-coding-assistants': 'fa-code',
    'writing-tools': 'fa-pen',
    'email-assistance': 'fa-envelope',
    'data-visualization': 'fa-chart-bar',
    'ai-scheduling': 'fa-calendar-alt',
    'meeting-notes': 'fa-microphone',
    'spreadsheet-tools': 'fa-database',
    'video-generators': 'fa-video',
    'utility-tools': 'fa-tools',
    'marketing-tools': 'fa-bullhorn',
    'voice-tools': 'fa-microphone',
    'presentation-tools': 'fa-chalkboard',
    'website-builders': 'fa-globe',
    'gaming-tools': 'fa-gamepad',
    'short-clippers': 'fa-cut',
    'faceless-video': 'fa-user-secret',
  };
  return iconMap[categoryId] || 'fa-box';
};

export const getColorClass = (categoryId) => {
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
  };
  return colorMap[categoryId] || 'text-gray-500 dark:text-gray-400';
};