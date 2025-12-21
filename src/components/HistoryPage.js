// HistoryPage.js
import React, { useEffect, useState, useMemo } from 'react';
import { motion as m, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';
import { addRefToUrl } from '../utils/linkUtils';
import DashboardBackground from './DashboardBackground';
import { 
  Clock, 
  Search, 
  Trash2, 
  Calendar, 
  Filter, 
  ExternalLink, 
  Star, 
  TrendingUp, 
  Activity,
  Zap,
  MoreVertical
} from 'lucide-react';

// Helper for electric/glass border effect
const GlassCard = ({ children, className = "", hoverEffect = true }) => (
  <div className={`relative group ${className}`}>
    {hoverEffect && (
      <div className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none blur-sm" />
    )}
    <div className="bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 rounded-2xl relative overflow-hidden h-full transition-all duration-300 group-hover:bg-[#0a0a0a]/80 group-hover:border-white/20">
      {children}
    </div>
  </div>
);

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, trend, color = "blue" }) => (
  <GlassCard className="flex-1 min-w-[200px]">
    <div className="p-6 flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
      </div>
      <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 flex items-center justify-center border border-${color}-500/20`}>
        <Icon size={20} className={`text-${color}-500`} />
      </div>
    </div>
    {trend && (
      <div className="px-6 pb-4">
        <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-lg w-fit">
          <TrendingUp size={12} />
          {trend}
        </div>
      </div>
    )}
  </GlassCard>
);

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, favorites

  useEffect(() => {
    try {
      const storedHistory = JSON.parse(localStorage.getItem('toolClickHistory') || '[]');
      setHistory(storedHistory);
      const storedFavorites = JSON.parse(localStorage.getItem('ai_bookmarks') || '[]');
      setFavorites(storedFavorites);
    } catch (error) {
      console.error("Error reading from localStorage", error);
      setHistory([]);
      setFavorites([]);
    }
  }, []);

  const handleClear = () => {
    localStorage.removeItem('toolClickHistory');
    setHistory([]);
    setShowClearConfirm(false);
  };

  const getToolKey = (tool) => tool.url || tool.name || tool.id;

  const toggleFavorite = (tool, e) => {
    e?.stopPropagation();
    const key = getToolKey(tool);
    // Use set to ensure uniqueness
    const favSet = new Set(favorites);
    if (favSet.has(key)) {
      favSet.delete(key);
    } else {
      favSet.add(key);
    }
    const updatedFavorites = Array.from(favSet);
    setFavorites(updatedFavorites);
    localStorage.setItem('ai_bookmarks', JSON.stringify(updatedFavorites));
  };

  // Filter & Search Logic
  const filteredHistory = useMemo(() => {
    let filtered = history;
    
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name?.toLowerCase().includes(q) || 
        item.description?.toLowerCase().includes(q)
      );
    }

    // Filter by Favorites
    if (filterType === 'favorites') {
      filtered = filtered.filter(item => favorites.includes(getToolKey(item)));
    }

    return filtered;
  }, [history, searchQuery, filterType, favorites]);

  // Grouping logic (re-implemented with useMemo)
  const groupedHistory = useMemo(() => {
    const groups = {};
    filteredHistory.forEach((item) => {
      if (item.timestamp) {
        const date = new Date(item.timestamp).toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        if (!groups[date]) groups[date] = [];
        groups[date].push(item);
      }
    });
    return groups;
  }, [filteredHistory]);

  const totalVisits = history.length;
  const uniqueFavoritesCount = favorites.length;

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
        <DashboardBackground />
        
        {/* Background Ambient Glows */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-600/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-600/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-12">
          
          {/* Header & Stats */}
          <div className="space-y-8 mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-2">
                  Mission Log
                </h1>
                <p className="text-gray-400 text-lg">
                  Track your exploration history and rediscovery timeline
                </p>
              </div>
              
               <div className="flex gap-3">
                 {/* Only show Clear button if there is history */}
                 {history.length > 0 && (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all text-sm font-medium"
                  >
                    <Trash2 size={16} />
                    Clear Log
                  </button>
                 )}
               </div>
            </div>

            {/* Stats Grid HUD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard 
                icon={Activity} 
                label="Total Ops" 
                value={totalVisits} 
                color="blue"
              />
               <StatCard 
                icon={Star} 
                label="Marked Targets" 
                value={uniqueFavoritesCount} 
                color="yellow"
              />
               <StatCard 
                icon={Clock} 
                label="Active Cycles" 
                value={Object.keys(groupedHistory).length} 
                color="purple"
              />
            </div>
          </div>

          {/* Controls Bar */}
          <div className="sticky top-24 z-30 mb-8">
            <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex flex-col sm:flex-row gap-2 shadow-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text"
                  placeholder="Search mission logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-transparent rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 transition-all"
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${filterType === 'all' ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  All
                </button>
                 <button 
                  onClick={() => setFilterType('favorites')}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${filterType === 'favorites' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <Star size={16} className={filterType === 'favorites' ? 'fill-yellow-400' : ''} />
                  Favorites
                </button>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative min-h-[400px]">
            {/* Vertical Line */}
            <div className="absolute left-0 md:left-[180px] top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-purple-500/20 to-transparent hidden md:block" />

            {Object.entries(groupedHistory).length > 0 ? (
              <div className="space-y-12">
                {Object.entries(groupedHistory).map(([date, items], groupIndex) => (
                  <m.div 
                    key={date}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: groupIndex * 0.1 }}
                    className="relative md:pl-[220px]"
                  >
                    {/* Date Marker (Desktop) */}
                    <div className="hidden md:flex flex-col items-end absolute left-0 top-0 w-[160px] pr-8 text-right pt-2">
                      <span className="text-xl font-bold text-white">{date.split(',')[0]}</span>
                      <span className="text-sm text-gray-500">{date.split(',').slice(1).join(',')}</span>
                      <div className="absolute right-0 top-4 w-3 h-3 rounded-full bg-[#050505] border-2 border-blue-500 translate-x-[50%] z-10 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    </div>

                    {/* Date Marker (Mobile) */}
                    <div className="md:hidden mb-4 flex items-center gap-4">
                      <div className="h-px flex-1 bg-white/10" />
                      <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">{date}</span>
                      <div className="h-px flex-1 bg-white/10" />
                    </div>

                    {/* Items Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {items.map((item, index) => (
                        <m.div
                          key={`${item.timestamp}-${index}`}
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <GlassCard className="h-full">
                            <div className="p-5 flex gap-4 h-full">
                              {/* Icon Box */}
                              <div className="w-16 h-16 rounded-xl bg-[#111] border border-white/5 flex items-center justify-center flex-shrink-0 relative overflow-hidden group-hover:border-blue-500/30 transition-colors">
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                  <Zap size={24} className="text-blue-500" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0 flex flex-col justify-between">
                                <div>
                                  <div className="flex items-start justify-between gap-2">
                                    <h3 className="text-lg font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                                      {item.name}
                                    </h3>
                                    <button 
                                      onClick={(e) => toggleFavorite(item, e)}
                                      className="text-gray-600 hover:text-yellow-400 transition-colors"
                                    >
                                      <Star size={18} className={favorites.includes(getToolKey(item)) ? "fill-yellow-400 text-yellow-400" : ""} />
                                    </button>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                    <Clock size={12} />
                                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                  <span className="text-[10px] uppercase tracking-widest text-gray-600 font-semibold">Accessed</span>
                                  <a 
                                    href={addRefToUrl(item.url)}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                                  >
                                    Revisit
                                    <ExternalLink size={12} />
                                  </a>
                                </div>
                              </div>
                            </div>
                          </GlassCard>
                        </m.div>
                      ))}
                    </div>
                  </m.div>
                ))}
              </div>
            ) : (
             <div className="flex flex-col items-center justify-center py-20 text-center">
               <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 animate-pulse">
                 <Search size={48} className="text-gray-600" />
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">No logs found</h3>
               <p className="text-gray-400 max-w-md">
                 {searchQuery ? "No mission logs match your search parameters." : "Your exploration history is empty. Start discovering tools to populate your mission log."}
               </p>
               {searchQuery && (
                 <button 
                  onClick={() => setSearchQuery('')}
                  className="mt-6 text-blue-400 hover:text-blue-300 text-sm font-medium"
                 >
                   Clear Search Filters
                 </button>
               )}
             </div>
            )}
          </div>

        </div>

        {/* Clear Confirmation Modal */}
        <AnimatePresence>
          {showClearConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <m.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl max-w-sm w-full shadow-2xl relative overflow-hidden"
              >
                {/* Decorative background effects */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-6 border border-red-500/20">
                  <Trash2 size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Clear Mission Log?</h3>
                <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                  This will permanently wipe all history data from your local storage. This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors border border-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClear}
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-red-600/20"
                  >
                    Confirm Wipe
                  </button>
                </div>
              </m.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
};

export default HistoryPage;