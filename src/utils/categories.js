// Centralized category list & helpers (shared by Sidebar dropdown, filters, etc.)
// Keep this in sync with toolsData category ids and UI filters
// NOTE: Keep in sync with ids inside toolsData.js
// Removed 'Portfolio' (unused/inconsistent casing) and ordered to roughly match appearance in the dataset.
export const CATEGORY_IDS = [
  'all',
  'chatbots',
  'text-humanizer-ai',
  'ai-coding-assistants',
  'faceless-video',
  'email-assistance',
  'spreadsheet-tools',
  'meeting-notes',
  'writing-tools',
  'video-generators',
  'presentation-tools',
  // The following exist later in toolsData or planned but ensure slug form; add only if present
  // 'short-clippers', 'marketing-tools', 'voice-tools', 'website-builders', 'image-generators',
  // 'data-analysis', 'gaming-tools', 'ai-diagrams', 'ai-scheduling', 'data-visualization',
  // 'utility-tools', 'other-tools'
];

export const formatCategoryLabel = (id) => id
  .replace(/-/g, ' ')
  .replace(/\b(ai)\b/gi, 'AI')
  .replace(/\b\w/g, c => c.toUpperCase());

// Utility: verify a category id exists in CATEGORY_IDS (ignores 'all')
export const isKnownCategory = (id) => id === 'all' || CATEGORY_IDS.includes(id);
