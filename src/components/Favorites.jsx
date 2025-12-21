import React from 'react';
import { motion as m } from 'framer-motion';
import toolsData from '../data/toolsData';
import ToolCard from './ToolCard';
import api, { API_URL } from '../utils/api';
import SavedBackground from '../assets/Saved-1.png';

// Favorites page: shows user's saved tools with sorting and drag reordering (custom mode only)
export default function Favorites() {
  const [favoriteKeys, setFavoriteKeys] = React.useState([]); // raw keys
  const [favoriteTools, setFavoriteTools] = React.useState([]); // materialized tool objects / placeholders
  const [sortMode, setSortMode] = React.useState(() => localStorage.getItem('favorites_sort') || 'custom'); // 'custom' | 'name' | 'date'
  const [draggingIndex, setDraggingIndex] = React.useState(null);

  // Initial load from localStorage
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('ai_bookmarks');
      const keys = raw ? JSON.parse(raw) : [];
      setFavoriteKeys(Array.isArray(keys) ? keys : []);
    } catch {
      setFavoriteKeys([]);
    }
  }, []);

  // Fetch server favorites and merge
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    (async () => {
      try {
        const res = await api.get('/api/auth/favorites');
        const serverFavs = Array.isArray(res.data?.favorites) ? res.data.favorites : [];
        if (serverFavs.length) {
          const rawLocal = localStorage.getItem('ai_bookmarks');
          const localArr = rawLocal ? JSON.parse(rawLocal) : [];
          const merged = [...serverFavs, ...localArr.filter(k => !serverFavs.includes(k))];
          setFavoriteKeys(merged);
          localStorage.setItem('ai_bookmarks', JSON.stringify(merged));
        }
      } catch {
        // silent
      }
    })();
  }, []);

  // Sync to backend (debounced)
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const t = setTimeout(() => {
      (async () => {
        try {
          await api.post('/api/auth/favorites/sync', { favorites: favoriteKeys });
        } catch {}
      })();
    }, 500);
    return () => clearTimeout(t);
  }, [favoriteKeys]);

  // Materialize keys into tool objects
  React.useEffect(() => {
    const all = (toolsData || []).flatMap(cat => (cat?.tools || []).map(t => ({ ...t, category: t.category || cat.id })));
    const found = [];
    const missing = [];
    favoriteKeys.forEach(key => {
      const match = all.find(t => t.url === key || t.name === key || t.id === key);
      if (match) found.push(match); else missing.push(key);
    });
    const placeholders = missing.map(k => {
      const isUrl = /^https?:\/\//.test(k);
      let name = k;
      let image = undefined;
      
      if (isUrl) {
        try {
          const urlObj = new URL(k);
          const host = urlObj.hostname.replace('www.', '');
          name = host.split('.')[0];
          name = name.charAt(0).toUpperCase() + name.slice(1);
          // Use thum.io for a website screenshot as the card image
          image = `https://image.thum.io/get/width/600/crop/600/noanimate/${k}`;
        } catch {}
      }

      return { 
        name: name, 
        description: 'Saved item', 
        url: isUrl ? k : undefined, 
        image: image,
        category: 'utility-tools' 
      };
    });
    try {
      const rawOrder = localStorage.getItem('ai_bookmarks_order');
      if (rawOrder) {
        const order = JSON.parse(rawOrder);
        const ordered = [...found, ...placeholders].sort((a,b) => order.indexOf(a.url || a.name || a.id) - order.indexOf(b.url || b.name || b.id));
        setFavoriteTools(ordered);
        return;
      }
    } catch {}
    setFavoriteTools([...found, ...placeholders]);
  }, [favoriteKeys]);

  // Persist sort mode selection
  React.useEffect(() => { localStorage.setItem('favorites_sort', sortMode); }, [sortMode]);

  const persistOrder = (items) => {
    try {
      const orderKeys = items.map(t => t.url || t.name || t.id).filter(Boolean);
      localStorage.setItem('ai_bookmarks_order', JSON.stringify(orderKeys));
    } catch {}
  };

  const onDragStart = (index) => setDraggingIndex(index);
  const onDragEnter = (index) => {
    if (draggingIndex === null || draggingIndex === index) return;
    if (sortMode !== 'custom') return;
    setFavoriteTools(prev => {
      const copy = [...prev];
      const [moved] = copy.splice(draggingIndex, 1);
      copy.splice(index, 0, moved);
      persistOrder(copy);
      setDraggingIndex(index);
      return copy;
    });
  };
  const onDragEnd = () => setDraggingIndex(null);

  const clearAll = () => {
    setFavoriteKeys([]);
    setFavoriteTools([]);
    localStorage.removeItem('ai_bookmarks');
    localStorage.removeItem('ai_bookmarks_order');
  };

  // Array for display based on sort
  const displayedTools = React.useMemo(() => {
    if (sortMode === 'name') return [...favoriteTools].sort((a,b) => (a.name || '').localeCompare(b.name || ''));
    if (sortMode === 'date') return [...favoriteTools].sort((a,b) => (b.dateAdded || 0) - (a.dateAdded || 0));
    return favoriteTools; // custom order
  }, [favoriteTools, sortMode]);

  // Themed dropdown matching Home style
  const SortDropdown = ({ value, onChange }) => {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef(null);
    const options = React.useMemo(() => ([
      { value: 'custom', label: 'Custom (Drag)' },
      { value: 'date', label: 'Newest First' },
      { value: 'name', label: 'Name (A–Z)' }
    ]), []);

    const selected = options.find(o => o.value === value) || options[0];

    React.useEffect(() => {
      const onDoc = (e) => {
        if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      };
      document.addEventListener('mousedown', onDoc);
      return () => document.removeEventListener('mousedown', onDoc);
    }, []);

    return (
      <div className="relative" ref={ref}>
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-[#0A0A0A] text-white border border-white/10 hover:border-[#FF6B00]/50 hover:shadow-[0_0_15px_rgba(255,107,0,0.15)] transition-all duration-200 flex items-center gap-2 min-w-[170px] justify-between shadow-lg"
        >
          <span>{selected.label}</span>
          <span className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▼</span>
        </button>
        {open && (
          <div role="listbox" className="absolute right-0 top-full mt-2 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 py-2 min-w-[220px] z-[60]">
            {options.map(opt => (
              <button
                key={opt.value}
                role="option"
                aria-selected={value === opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full px-4 py-3 text-left text-sm flex items-center justify-between hover:bg-white/10 transition-colors ${value === opt.value ? 'bg-blue-500/15 text-white' : 'text-white/90'}`}
              >
                <span>{opt.label}</span>
                {value === opt.value && <span className="text-xs opacity-70">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden pb-24">
      {/* Global background to match Home */}
      {/* Global background to match Home */}
      <div className="fixed inset-0 z-0">
         <img 
           src={SavedBackground} 
           alt="Background" 
           className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80 pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {/* Header */}
        <div className="relative mb-8 p-6 rounded-3xl border border-white/10 bg-[#0A0A0A] shadow-2xl overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
           <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF6B00]" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center border border-[#FF6B00]/20">
               <span className="text-2xl">⭐</span>
            </div>
            <div>
                 <h1 className="text-3xl font-bold text-white tracking-tight">Your Favorites</h1>
                 <p className="text-gray-400 text-sm">Manage your saved AI tools collection</p>
            </div>
          </div>
        </div>

        {displayedTools.length === 0 ? (
          <m.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-3xl border border-white/10 bg-[#0A0A0A] max-w-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50" />
            <div className="flex items-start gap-6 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(255,107,0,0.1)]">⭐</div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">No favorites yet</h3>
                <p className="text-gray-400 leading-relaxed">
                    Start building your personal AI toolkit. Browse our collection and click the star icon on any tool to save it here for quick access.
                </p>
                <button onClick={() => window.location.href = '/'} className="mt-6 px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors">
                    Browse Tools
                </button>
              </div>
            </div>
          </m.div>
        ) : (
          <>
            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <p className="text-gray-300 text-sm">Saved: <span className="font-semibold text-white">{displayedTools.length}</span></p>
              <div className="flex items-center gap-3">
                <SortDropdown value={sortMode} onChange={setSortMode} />
                {sortMode !== 'custom' && <span className="hidden sm:inline text-xs text-gray-500 italic">Drag disabled in sorted mode</span>}
                <button onClick={clearAll} className="px-3 py-2 text-sm rounded-lg bg-[#0A0A0A] border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all">Clear all</button>
              </div>
            </div>

            {/* Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayedTools.map((tool, idx) => {
                const keyValue = tool.url || tool.name || tool.id || `tool-${idx}`;
                return (
                  <div
                    key={keyValue}
                    draggable={sortMode === 'custom'}
                    onDragStart={() => onDragStart(idx)}
                    onDragEnter={() => onDragEnter(idx)}
                    onDragEnd={onDragEnd}
                    className={(draggingIndex === idx ? 'opacity-50 ' : '') + (sortMode === 'custom' ? 'cursor-grab active:cursor-grabbing' : '')}
                  >
                    <div className="relative">
                      <ToolCard tool={tool} />
                      <button
                        onClick={() => {
                          const key = tool.url || tool.name || tool.id;
                          setFavoriteKeys(prev => prev.filter(k => k !== key));
                          try {
                            const raw = localStorage.getItem('ai_bookmarks');
                            let arr = raw ? JSON.parse(raw) : [];
                            arr = arr.filter(k => k !== key);
                            localStorage.setItem('ai_bookmarks', JSON.stringify(arr));
                            const orderRaw = localStorage.getItem('ai_bookmarks_order');
                            if (orderRaw) {
                              let orderArr = JSON.parse(orderRaw);
                              orderArr = orderArr.filter(k => k !== key);
                              localStorage.setItem('ai_bookmarks_order', JSON.stringify(orderArr));
                            }
                          } catch {}
                        }}
                        className="absolute top-2 right-2 text-xs px-2 py-1 rounded-md bg-red-600/80 hover:bg-red-600 text-white shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70"
                        aria-label={`Remove ${tool.name} from favorites`}
                      >
                        Remove
                      </button>
                      {sortMode === 'custom' && (
                        <div className="absolute top-2 left-2 bg-black/30 border border-white/10 rounded px-1.5 py-0.5 select-none text-gray-300/80" aria-hidden="true" title="Drag to reorder">
                          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="block">
                            <circle cx="6" cy="6" r="1.6" fill="currentColor"/>
                            <circle cx="10" cy="6" r="1.6" fill="currentColor"/>
                            <circle cx="14" cy="6" r="1.6" fill="currentColor"/>
                            <circle cx="6" cy="10" r="1.6" fill="currentColor"/>
                            <circle cx="10" cy="10" r="1.6" fill="currentColor"/>
                            <circle cx="14" cy="10" r="1.6" fill="currentColor"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
