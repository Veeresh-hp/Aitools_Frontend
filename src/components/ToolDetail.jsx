import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion as m, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaExternalLinkAlt, FaStar, FaBookmark, FaRegBookmark, FaCalendar, FaTag, FaChevronDown, FaChevronUp, FaInfoCircle, FaList, FaQuestionCircle, FaGlobe, FaDollarSign, FaDesktop, FaArrowUp } from 'react-icons/fa';
import toolsData from '../data/toolsData';
import { ToolDetailSkeleton } from './SkeletonLoader';
import Breadcrumb from './Breadcrumb';
import ReviewSection from './ReviewSection';
import { addRefToUrl } from '../utils/linkUtils';
import { addToHistory } from '../utils/historyUtils';

const AccordionItem = ({ title, icon, children, isOpen, onClick }) => {
  return (
    <div className="border border-gray-700 rounded-xl overflow-hidden mb-4 bg-gray-800/50">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-5 text-left bg-gray-800 hover:bg-gray-750 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-blue-400">{icon}</span>}
          <span className="font-bold text-lg text-white">{title}</span>
        </div>
        {isOpen ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="p-6 border-t border-gray-700 text-gray-300 leading-relaxed">
              {children}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-700 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-800/50 transition-colors rounded-lg px-2"
      >
        <span className="font-medium text-white">{question}</span>
        {isOpen ? <FaChevronUp className="text-sm text-gray-400 ml-4 shrink-0" /> : <FaChevronDown className="text-sm text-gray-400 ml-4 shrink-0" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="pb-4 px-2 text-gray-400 text-sm leading-relaxed">
              {answer}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ToolDetail = () => {
  const { category, toolSlug } = useParams();
  const { t } = useLanguage();
  const history = useHistory();

  // Scroll to top on mount and when slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category, toolSlug]);

  const [tool, setTool] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Toggle Scroll Button Visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [saved, setSaved] = useState(false);
  const [relatedTools, setRelatedTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvedTools, setApprovedTools] = useState([]);

  const [initialFetchDone, setInitialFetchDone] = useState(false);

  // Accordion state (only for FAQ now)
  const [openSection, setOpenSection] = useState('faq');

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Robust API base: env var first, then detect Vercel, else localhost
  const API_URL = useMemo(() => {
    const envUrl = process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.trim();
    if (envUrl) return envUrl;
    try {
      const host = typeof window !== 'undefined' ? window.location.hostname : '';
      const isVercel = /vercel\.app$/.test(host);
      if (isVercel) return 'https://ai-tools-hub-backend-u2v6.onrender.com';
    } catch { }
    return 'http://localhost:5000';
  }, []);

  const toSlug = useCallback((val) => {
    try {
      return String(val || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    } catch {
      return '';
    }
  }, []);

  const getFaviconUrl = useCallback((url) => {
    try {
      if (!url) return null;
      const { hostname } = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
    } catch {
      return null;
    }
  }, []);

  const buildSnapshotUrl = useCallback((snap) => {
    if (!snap) return null;
    try {
      // If it's already a full URL (http/https), use it directly (Cloudinary URLs)
      if (/^https?:\/\//i.test(snap)) return snap;

      // If it's a relative path (local storage), prefix with API_URL
      const withLeading = snap.startsWith('/') ? snap : `/${snap}`;
      return `${API_URL}${withLeading}`;
    } catch {
      return null;
    }
  }, [API_URL]);

  // Fetch approved tools from backend with cache-busting
  useEffect(() => {
    const fetchApprovedTools = async () => {
      const tick = Math.floor(Date.now() / 60000);
      const base = `${API_URL}/api/tools/approved`;
      const url = `${base}?t=${tick}`;
      try {
        let res = await fetch(url, {
          priority: 'low',
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        });
        let json = await res.json();
        if (!(res.ok && json.tools && Array.isArray(json.tools))) {
          const url2 = `${base}?t=${Date.now()}`;
          res = await fetch(url2, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } });
          json = await res.json();
        }
        if (res.ok && json.tools && Array.isArray(json.tools)) {
          const validTools = json.tools.filter(t => t && t.name);
          setApprovedTools(validTools);
        } else {
          setApprovedTools([]);
        }
      } catch (err) {
        console.error('Failed to fetch approved tools:', err);
        setApprovedTools([]);
      } finally {
        setInitialFetchDone(true);
      }
    };
    fetchApprovedTools();
  }, [API_URL]);

  // Convert approved tools to display format
  const convertedApprovedTools = useMemo(() => {
    if (!approvedTools || !Array.isArray(approvedTools)) return [];

    return approvedTools
      .filter(t => t && t.name && typeof t.name === 'string')
      .map((t) => {
        const snapshot = buildSnapshotUrl(t.snapshotUrl);
        const fallback = !snapshot ? getFaviconUrl(t.url) : null;

        const rawCategory = t.category || 'voice-tools';
        const slugCategory = toSlug(rawCategory);

        // Prioritize approvedAt for "New" badge and sorting
        const parsed = Date.parse(t.approvedAt || t.createdAt || t.updatedAt || '');
        const safeTime = isNaN(parsed) ? Date.now() : parsed;

        return {
          _id: t._id,
          name: t.name,
          shortDescription: t.shortDescription || '',
          description: t.description || '',
          link: t.url || '#',
          url: t.url || '#',
          image: snapshot || fallback || null,
          isNew: true,
          pricing: t.pricing || 'Freemium',
          category: slugCategory,
          dateAdded: safeTime,
          hashtags: t.hashtags || []
        };
      });
  }, [approvedTools, buildSnapshotUrl, getFaviconUrl, toSlug]);

  // Merge approved tools into toolsData
  const mergedToolsData = useMemo(() => {
    const staticCategoriesMap = new Map(
      toolsData.map(cat => [cat.id, { ...cat, tools: [...cat.tools] }])
    );
    const newCategoriesMap = new Map();

    convertedApprovedTools.forEach(tool => {
      if (staticCategoriesMap.has(tool.category)) {
        staticCategoriesMap.get(tool.category).tools.push(tool);
      } else {
        if (!newCategoriesMap.has(tool.category)) {
          const displayName = tool.category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          newCategoriesMap.set(tool.category, {
            id: tool.category,
            name: displayName,
            description: `Tools for ${displayName}`,
            tools: []
          });
        }
        newCategoriesMap.get(tool.category).tools.push(tool);
      }
    });
    return [...staticCategoriesMap.values(), ...newCategoriesMap.values()];
  }, [convertedApprovedTools]);

  // Find the tool based on category and slug
  useEffect(() => {
    setLoading(true);

    let foundTool = null;
    let foundCategory = null;

    // Normalize category - handle "undefined" string, "all", or missing category
    const normalizedCategory = (category && category !== 'undefined' && category !== 'all') ? category : null;

    // Search through all categories if category is invalid or not found
    if (normalizedCategory) {
      foundCategory = mergedToolsData.find(cat => cat.id === normalizedCategory);
    }

    // If category not specified or not found, search all categories
    if (!foundCategory) {
      for (const cat of mergedToolsData) {
        if (!cat || !Array.isArray(cat.tools)) continue;

        const tool = cat.tools.find(t => {
          if (!t || !t.name || typeof t.name !== 'string') return false;
          const toolSlugGenerated = toSlug(t.name);
          return toolSlugGenerated === toolSlug;
        });

        if (tool) {
          foundTool = tool;
          foundCategory = cat;
          break;
        }
      }
    } else {
      // Search in specific category
      if (foundCategory.tools && Array.isArray(foundCategory.tools)) {
        foundTool = foundCategory.tools.find(t => {
          if (!t || !t.name || typeof t.name !== 'string') return false;
          const toolSlugGenerated = toSlug(t.name);
          return toolSlugGenerated === toolSlug;
        });
      }
    }

    // FALLBACK: If tool not found in specific category (or category wasn't found), search EVERYWHERE
    if (!foundTool) {
       for (const cat of mergedToolsData) {
        if (!cat || !Array.isArray(cat.tools)) continue;
        const tool = cat.tools.find(t => {
          if (!t || !t.name || typeof t.name !== 'string') return false;
          return toSlug(t.name) === toolSlug;
        });
        if (tool) {
          foundTool = tool;
          foundCategory = cat; // Update category to the correct one
          break;
        }
      }
    }

    if (foundTool && foundCategory) {
      setTool({
        ...foundTool,
        category: foundCategory.name || 'Unknown',
        categoryId: foundCategory.id || 'unknown'
      });

      // Get related tools from same category
      if (foundCategory.tools && Array.isArray(foundCategory.tools)) {
        const related = foundCategory.tools
          .filter(t => t && t.name && t.name !== foundTool.name)
          .slice(0, 6);
        setRelatedTools(related);
      } else {
        setRelatedTools([]);
      }

      // Check if bookmarked
      try {
        const bookmarks = JSON.parse(localStorage.getItem('ai_bookmarks') || '[]');
        const toolKey = foundTool.url || foundTool.name;
        setSaved(bookmarks.includes(toolKey));
      } catch (err) {
        console.error('Error checking bookmark:', err);
      }
      setLoading(false);
      setLoading(false);
    } else {
      // Fallback: Check if it's a locally saved bookmark that isn't in the database
      // This handles "placeholder" tools created in Favorites.jsx
      if (initialFetchDone) {
        let bookmarkTool = null;
        try {
            const rawBookmarks = localStorage.getItem('ai_bookmarks');
            const bookmarks = rawBookmarks ? JSON.parse(rawBookmarks) : [];
            
            for (const key of bookmarks) {
                // Logic must match Favorites.jsx placeholder generation
                const isUrl = /^https?:\/\//.test(key);
                let name = key;
                let image = undefined;
                
                if (isUrl) {
                    try {
                        const urlObj = new URL(key);
                        const host = urlObj.hostname.replace('www.', '');
                        let hostName = host.split('.')[0];
                        hostName = hostName.charAt(0).toUpperCase() + hostName.slice(1);
                        
                        // Check if this bookmark's derived slug matches the requested toolSlug
                        if (toSlug(hostName) === toolSlug) {
                             name = hostName;
                             image = `https://image.thum.io/get/width/600/crop/600/noanimate/${key}`;
                             
                             bookmarkTool = {
                                 name: name,
                                 description: 'Saved item from your bookmarks.',
                                 shortDescription: 'Saved bookmark',
                                 url: key,
                                 image: image,
                                 category: 'utility-tools',
                                 pricing: 'Unknown',
                                 dateAdded: Date.now(),
                                 hashtags: ['bookmark']
                             };
                             break;
                        }
                    } catch {}
                } else {
                    // Handle non-URL keys (names)
                    if (toSlug(key) === toolSlug) {
                        bookmarkTool = {
                            name: key,
                             description: 'Saved item from your bookmarks.',
                             shortDescription: 'Saved bookmark',
                             url: '#', // No URL known
                             category: 'utility-tools',
                             pricing: 'Unknown',
                             dateAdded: Date.now(),
                             hashtags: ['bookmark']
                        };
                        break;
                    }
                }
            }
        } catch (err) {
            console.error("Error searching bookmarks fallback:", err);
        }

        if (bookmarkTool) {
             setTool({
                ...bookmarkTool,
                category: 'Utility Tools',
                categoryId: 'utility-tools'
            });
            setSaved(true); // It's strictly from bookmarks, so it is saved
            setLoading(false);
        } else {
            setTool(null);
            setRelatedTools([]);
            setLoading(false);
        }
      }
    }
  }, [category, toolSlug, mergedToolsData, initialFetchDone, toSlug]);

  const toggleBookmark = () => {
    try {
      const toolKey = tool.url || tool.name;
      const bookmarks = JSON.parse(localStorage.getItem('ai_bookmarks') || '[]');

      if (bookmarks.includes(toolKey)) {
        const updated = bookmarks.filter(k => k !== toolKey);
        localStorage.setItem('ai_bookmarks', JSON.stringify(updated));
        setSaved(false);
      } else {
        bookmarks.push(toolKey);
        localStorage.setItem('ai_bookmarks', JSON.stringify(bookmarks));
        setSaved(true);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  // Generate FAQs dynamically
  const generateFAQs = (tool) => {
    if (!tool) return [];

    const faqs = [
      {
        question: `What is ${tool.name}?`,
        answer: `${tool.name} is a ${tool.category || 'AI'} tool designed to help users with ${tool.shortDescription ? tool.shortDescription.toLowerCase() : 'various tasks'}. It leverages artificial intelligence to streamline workflows and enhance productivity.`
      },
      {
        question: `Is ${tool.name} free to use?`,
        answer: `This tool is listed as "${tool.pricing || 'Freemium'}". You can visit the official website to check their latest pricing plans and free tier availability.`
      },
      {
        question: `How do I start using ${tool.name}?`,
        answer: `You can start using ${tool.name} by visiting their official website via the "Visit Site" button above. Most tools require a simple sign-up to get started.`
      },
      {
        question: `Can I use ${tool.name} on mobile?`,
        answer: `Most web-based AI tools like ${tool.name} are responsive and can be used on mobile browsers, but for the best experience, a desktop or laptop is often recommended.`
      },
      {
        question: `What are the key features of ${tool.name}?`,
        answer: tool.description ? `Key features include: ${tool.description.substring(0, 150)}... and more. Check the "About" section for full details.` : `Please refer to the official website for a detailed list of features.`
      }
    ];

    return faqs;
  };

  if (loading) {
    return <ToolDetailSkeleton />;
  }

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
        {/* Cinematic Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF6B00] blur-[150px] opacity-10 rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none" />

        <div className="relative z-10 text-center max-w-lg mx-auto px-6">
          <m.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            {/* Animated Icon Container */}
            <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                 <div className="absolute inset-0 bg-[#FF6B00]/20 blur-xl rounded-full animate-pulse" />
                 <div className="relative w-full h-full bg-[#12121A] border border-white/10 rounded-full flex items-center justify-center shadow-2xl">
                    <span className="text-4xl">🔍</span>
                 </div>
            </div>

            <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 mb-2 tracking-tighter">404</h1>
            <h2 className="text-3xl font-bold text-white mb-6">{t('tool_not_found')}</h2>
            
            <p className="text-gray-400 text-lg mb-8 leading-relaxed font-light">
              {t('tool_not_found_desc')}
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left backdrop-blur-md">
                <p className="text-gray-400 text-sm font-medium mb-3 uppercase tracking-wider">Possible Reasons:</p>
                <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" /> URL might be incorrect
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" /> Tool was removed or deprecated
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" /> It is pending approval
                    </li>
                </ul>
            </div>
          </m.div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => history.push('/')}
              className="px-8 py-3.5 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg shadow-white/10 flex items-center gap-2"
            >
              <FaArrowLeft /> {t('back_home')}
            </button>
            <button
              onClick={() => history.goBack()}
              className="px-8 py-3.5 bg-white/10 text-white border border-white/10 rounded-full font-bold hover:bg-white/20 transition-all backdrop-blur-md"
            >
              {t('go_back')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Copy link function
  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert(t('tool_share_alert'));
    }).catch(() => {
      alert('Failed to copy link');
    });
  };

  const faqs = generateFAQs(tool);

  return (
    <div className="min-h-screen bg-black text-white relative selection:bg-orange-500/30">
        
      {/* Cinematic Background Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#FF6B00] blur-[180px] opacity-10 rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-900 blur-[150px] opacity-10 rounded-full pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none z-0" />

      {/* Navbar Placeholder space (if needed) */}
      <div className="h-20" />

      {/* Breadcrumb Area */}
      <div className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb
            items={[
              { label: tool.category, link: `/#${tool.categoryId || 'all'}` },
              { label: tool.name }
            ]}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* --- Header Card --- */}
        <div className="bg-[#12121A] rounded-3xl p-6 md:p-8 mb-10 border border-white/10 shadow-2xl relative overflow-hidden group">
          {/* Subtle sheen effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row gap-8 relative z-10">
            {/* Left: Image */}
            <div className="w-full md:w-1/3 shrink-0">
               <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-black/50 aspect-video relative group/image">
                 {tool.image ? (
                   <img
                     src={tool.image}
                     alt={tool.name}
                     className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-105"
                     onError={(e) => {
                       e.target.style.display = 'none';
                       e.target.nextSibling.style.display = 'flex';
                     }}
                   />
                 ) : null}
                 <div className="hidden absolute inset-0 text-white/20 text-5xl font-bold items-center justify-center bg-[#1A1A24]" style={{ display: tool.image ? 'none' : 'flex' }}>
                    {tool.name.charAt(0).toUpperCase()}
                 </div>
               </div>
            </div>

            {/* Right: Info & Actions */}
            <div className="flex-1 flex flex-col">
               <div className="flex items-center gap-3 mb-4">
                  <span className="text-[#FF6B00] text-sm font-bold tracking-wider uppercase">{tool.category}</span>
                  {tool.pricing && (
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full border ${
                        tool.pricing === 'Free' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 
                        tool.pricing === 'Paid' ? 'text-rose-400 border-rose-500/30 bg-rose-500/10' : 
                        'text-amber-400 border-amber-500/30 bg-amber-500/10'
                    }`}>
                        {tool.pricing}
                    </span>
                  )}
               </div>

               <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">{tool.name}</h1>
               <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-2xl">
                 {tool.shortDescription || tool.description}
               </p>

               <div className="mt-auto flex flex-wrap gap-4">
                 {tool.url && (
                   <a
                     href={addRefToUrl(tool.url)}
                     target="_blank"
                     rel="noopener noreferrer"
                     onClick={() => addToHistory(tool)}
                     className="px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-transform active:scale-95 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                   >
                     Visit Site <FaExternalLinkAlt className="text-sm" />
                   </a>
                 )}
                 <button
                    onClick={toggleBookmark}
                    className={`px-6 py-3 rounded-full font-bold transition-all border flex items-center gap-2 ${saved 
                        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/50' 
                        : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}
                 >
                    {saved ? <FaBookmark /> : <FaRegBookmark />}
                    {saved ? 'Saved' : 'Save'}
                 </button>
                 <button
                   onClick={copyLink}
                   className="px-6 py-3 bg-white/5 text-white border border-white/10 rounded-full font-bold hover:bg-white/10 transition-all"
                 >
                   {t('tool_share')}
                 </button>
               </div>
            </div>
          </div>
        </div>

        {/* --- Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: About & FAQ */}
            <div className="lg:col-span-2 space-y-8">
                {/* About Card */}
                <div className="bg-[#12121A] rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-8 opacity-5">
                        <FaInfoCircle className="text-9xl text-white" />
                     </div>
                     <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <FaInfoCircle className="text-[#FF6B00]" /> {t('tool_about')} {tool.name}
                     </h3>
                     <div className="prose prose-invert max-w-none text-gray-300 leading-7 font-light">
                        {tool.description || tool.shortDescription || "No detailed description available."}
                     </div>
                     
                     {/* Tags */}
                      {(tool.hashtags && tool.hashtags.length > 0) && (
                        <div className="mt-8 pt-6 border-t border-white/5">
                            <div className="flex flex-wrap gap-2">
                                {tool.hashtags.map((tag, i) => (
                                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-sm text-gray-400">#{tag.replace('#','')}</span>
                                ))}
                            </div>
                        </div>
                      )}
                </div>

                {/* FAQ Card */}
                <div className="bg-[#12121A] rounded-3xl p-8 border border-white/10">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <FaQuestionCircle className="text-[#FF6B00]" /> {t('tool_faq')}
                    </h3>
                    <div className="space-y-1">
                        {faqs.map((faq, idx) => (
                            <FAQItem key={idx} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </div>
                
                {/* Review Section */}
                {tool._id && <ReviewSection toolId={tool._id} />}
            </div>

            {/* Right Column: Sidebar Meta */}
            <div className="lg:col-span-1">
                <div className="bg-[#12121A] rounded-3xl p-6 border border-white/10 sticky top-24">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <FaList className="text-[#FF6B00]" /> {t('tool_info')}
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-gray-400 flex items-center gap-2"><FaGlobe className="text-xs" /> {t('label_category')}</span>
                            <span className="text-white font-medium capitalize">{tool.category}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-gray-400 flex items-center gap-2"><FaDollarSign className="text-xs" /> {t('label_pricing')}</span>
                            <span className={`font-medium ${
                                tool.pricing === 'Free' ? 'text-emerald-400' : 
                                tool.pricing === 'Paid' ? 'text-rose-400' : 'text-amber-400'
                            }`}>{tool.pricing || 'Unknown'}</span>
                        </div>
                         <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-gray-400 flex items-center gap-2"><FaCalendar className="text-xs" /> {t('label_added')}</span>
                            <span className="text-white font-medium">{new Date(tool.dateAdded).toLocaleDateString()}</span>
                        </div>
                         <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                            <span className="text-gray-400 flex items-center gap-2"><FaDesktop className="text-xs" /> {t('label_platform')}</span>
                            <span className="text-white font-medium">Web</span>
                        </div>
                    </div>

                    {tool.url && (
                        <a
                           href={addRefToUrl(tool.url)}
                           target="_blank"
                           rel="noopener noreferrer"
                           onClick={() => addToHistory(tool)}
                           className="mt-8 block w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-center rounded-xl transition-colors shadow-lg shadow-blue-900/20"
                        >
                            Visit Website
                        </a>
                    )}
                </div>
            </div>
        </div>

        {/* --- Related Tools --- */}
        {relatedTools.length > 0 && (
             <div className="mt-20">
                <div className="flex items-center gap-4 mb-10">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                    <h2 className="text-3xl font-bold text-white">{t('tool_more_like')}</h2>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedTools.map((t) => {
                         const tSlug = t.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
                         return (
                            <Link 
                                key={t.name}
                                to={`/tools/${tool.categoryId}/${tSlug}`}
                                onClick={() => window.scrollTo(0, 0)}
                                className="group bg-[#12121A] rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1 block"
                            >
                                <div className="aspect-video bg-black/50 relative overflow-hidden">
                                     {t.image ? (
                                        <img src={t.image} alt={t.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                                     ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white/20">{t.name[0]}</div>
                                     )}
                                     <div className="absolute inset-0 bg-gradient-to-t from-[#12121A] to-transparent opacity-80" />
                                </div>
                                <div className="p-4 relative">
                                    <h4 className="text-white font-bold text-lg mb-1 truncate group-hover:text-blue-400 transition-colors">{t.name}</h4>
                                    <p className="text-gray-500 text-xs line-clamp-2">{t.shortDescription}</p>
                                </div>
                            </Link>
                         );
                    })}
                </div>
             </div>
        )}

      </div>

      {/* Scroll to Top Button (Mobile Optimized) */}
      <AnimatePresence>
        {showScrollTop && (
            <m.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                onClick={scrollToTop}
                className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-50 p-3 bg-[#FF6B00] hover:bg-[#ff8533] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
                aria-label="Scroll to top"
            >
                <FaArrowUp className="text-xl" />
            </m.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ToolDetail;
