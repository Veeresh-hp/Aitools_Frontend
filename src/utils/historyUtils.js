export const addToHistory = (tool) => {
  try {
    const historyData = JSON.parse(localStorage.getItem('toolClickHistory')) || [];
    const timestamp = new Date().toISOString();
    
    // Create a rich entry with all necessary display data
    // Ensure we capture all fields HistoryPage might need
    const newEntry = { 
      ...tool,
      timestamp,
      label: tool.name, 
      link: tool.link || tool.url || '#',
      image: tool.image,
      icon: tool.icon
    };
    
    // Remove duplicates based on tool name/url to keep history clean/unique
    // This allows re-adding the same tool to bump it to the top
    const filtered = historyData.filter(item => {
        const itemKey = item.url || item.name;
        const toolKey = tool.url || tool.name;
        return itemKey !== toolKey;
    });
    
    const updated = [newEntry, ...filtered].slice(0, 50); // Keep last 50
    localStorage.setItem('toolClickHistory', JSON.stringify(updated));
  } catch (error) {
    console.error('Error adding to history:', error);
  }
};
