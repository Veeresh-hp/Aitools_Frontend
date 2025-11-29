import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { motion as m, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaExternalLinkAlt, FaStar, FaBookmark, FaRegBookmark, FaCalendar, FaTag, FaChevronDown, FaChevronUp, FaInfoCircle, FaList, FaQuestionCircle, FaGlobe, FaDollarSign, FaDesktop } from 'react-icons/fa';
import toolsData from '../data/toolsData';
import { ToolDetailSkeleton } from './SkeletonLoader';
import Breadcrumb from './Breadcrumb';

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
  const history = useHistory();
  const [tool, setTool] = useState(null);
  const [saved, setSaved] = useState(false);
  const [relatedTools, setRelatedTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvedTools, setApprovedTools] = useState([]);

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

        const parsed = Date.parse(t.createdAt || t.updatedAt || '');
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
    } else {
      setTool(null);
      setRelatedTools([]);
    }

    setLoading(false);
  }, [category, toolSlug, mergedToolsData]);

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
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-8">
            <div className="text-8xl mb-4">🔍</div>
            <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
            <h2 className="text-3xl font-bold text-white mb-4">Tool Not Found</h2>
            <p className="text-gray-400 text-lg mb-2">The tool you're looking for doesn't exist or has been removed.</p>
            <p className="text-gray-500 text-sm mb-8">
              This could be because:
              <br />• The tool URL is incorrect
              <br />• The tool has been moved or deleted
              <br />• The tool is pending approval
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => history.push('/')}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              ← Back to Home
            </button>
            <button
              onClick={() => history.goBack()}
              className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold shadow-lg transition-all duration-200"
            >
              Go Back
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
      alert('Link copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy link');
    });
  };

  const faqs = generateFAQs(tool);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Breadcrumb */}
      <div className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb
            items={[
              { label: tool.category, link: `/#${tool.categoryId}` },
              { label: tool.name }
            ]}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tool Header Card */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-8 border border-gray-700 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Tool Image & Badges Column */}
            <div className="w-full lg:w-1/3 shrink-0 flex flex-col gap-4">
              <div className="rounded-xl overflow-hidden border border-gray-700 shadow-lg">
                {tool.image ? (
                  <img
                    src={tool.image}
                    alt={tool.name}
                    className="w-full h-auto block"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<div class="text-gray-500 text-4xl font-bold flex items-center justify-center w-full aspect-video bg-gray-900/50">${tool.name.charAt(0).toUpperCase()}</div>`;
                    }}
                  />
                ) : (
                  <div className="text-gray-500 text-4xl font-bold w-full aspect-video flex items-center justify-center bg-gray-900/50">
                    {tool.dateAdded && (
                      <span className="px-4 py-1.5 text-sm font-medium rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 flex items-center gap-1.5">
                        <FaCalendar className="text-xs" /> {new Date(tool.dateAdded).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Tool Info - Concise Top Section */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="mb-4">
                {tool.category && (
                  <Link
                    to={`/#${tool.categoryId || tool.category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-blue-400 text-sm font-medium mb-2 inline-block hover:underline"
                  >
                    {tool.category}
                  </Link>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-4xl font-bold text-white">{tool.name}</h1>
                  {tool.pricing && (
                    <Link
                      to={`/?pricing=${(tool.pricing || 'freemium').toLowerCase().replace(' ', '-')}`}
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${tool.pricing === 'Free' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        tool.pricing === 'Paid' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        } hover:scale-105 transition-transform`}
                    >
                      {tool.pricing}
                    </Link>
                  )}
                </div>
                <p className="text-gray-300 text-lg leading-relaxed line-clamp-2">
                  {tool.shortDescription || tool.description}
                </p>
              </div>



              <div className="flex gap-3 flex-wrap mt-auto">
                {tool.url && (
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all flex items-center gap-2"
                  >
                    Visit Site <FaExternalLinkAlt className="text-sm" />
                  </a>
                )}
                <button
                  onClick={toggleBookmark}
                  className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 border ${saved
                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50 hover:bg-yellow-500/30'
                    : 'bg-gray-700/50 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-500'
                    }`}
                >
                  {saved ? <FaBookmark /> : <FaRegBookmark />}
                  {saved ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={copyLink}
                  className="px-6 py-3 bg-gray-700/50 text-white rounded-xl font-bold border border-gray-600 hover:bg-gray-700 hover:border-gray-500 transition-all"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid: About (Left) & Info (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

          {/* Left Column: About & FAQ */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <FaInfoCircle className="text-2xl text-blue-400" />
                <h2 className="text-2xl font-bold text-white">About {tool.name}</h2>
              </div>
              <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-line">
                {tool.description || "No detailed description available."}
              </div>

              {/* Tags */}
              {(tool.hashtags && tool.hashtags.length > 0) && (
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FaTag className="text-blue-400" /> Features & Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tool.hashtags.map((tag, index) => (
                      <span key={index} className="px-3 py-1.5 bg-gray-700/50 text-blue-300 rounded-lg text-sm border border-gray-600 hover:bg-gray-700 transition-colors">
                        {tag.startsWith('#') ? tag : `#${tag}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* FAQ Section */}
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <FaQuestionCircle className="text-2xl text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Questions & Answers</h2>
              </div>
              <div className="flex flex-col">
                {faqs.map((faq, index) => (
                  <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Additional Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 sticky top-4">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FaList className="text-blue-400" /> Tool Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center gap-3 text-gray-400">
                    <FaGlobe />
                    <span>Category</span>
                  </div>
                  <span className="font-medium text-white capitalize">{tool.category}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center gap-3 text-gray-400">
                    <FaDollarSign />
                    <span>Pricing</span>
                  </div>
                  <Link
                    to={`/?pricing=${(tool.pricing || 'freemium').toLowerCase().replace(' ', '-')}`}
                    className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {tool.pricing || 'Unknown'}
                  </Link>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center gap-3 text-gray-400">
                    <FaCalendar />
                    <span>Added On</span>
                  </div>
                  <span className="font-medium text-white">
                    {new Date(tool.dateAdded).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center gap-3 text-gray-400">
                    <FaDesktop />
                    <span>Platform</span>
                  </div>
                  <span className="font-medium text-white">Web</span>
                </div>
              </div>

              {/* Call to Action in Sidebar */}
              {tool.url && (
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 w-full block text-center py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors"
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Related Tools Section */}
        {relatedTools.length > 0 && (
          <div className="mt-16 border-t border-gray-800 pt-12">
            <h2 className="text-3xl font-bold mb-8 text-center">More Tools Like This</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedTools.map((relatedTool) => {
                const relatedSlug = relatedTool.name.toLowerCase()
                  .replace(/[^a-z0-9\s-]/g, '')
                  .replace(/\s+/g, '-')
                  .replace(/-+/g, '-');

                return (
                  <Link
                    key={relatedTool.name}
                    to={`/tools/${tool.categoryId}/${relatedSlug}`}
                    className="group bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-900/20"
                  >
                    <div className="h-48 overflow-hidden bg-gray-900 flex items-center justify-center relative">
                      {relatedTool.image ? (
                        <img
                          src={relatedTool.image}
                          alt={relatedTool.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `<div class="text-gray-600 text-4xl font-bold">${relatedTool.name.charAt(0).toUpperCase()}</div>`;
                          }}
                        />
                      ) : (
                        <div className="text-gray-600 text-4xl font-bold">
                          {relatedTool.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">
                          {relatedTool.name}
                        </h3>
                        {relatedTool.pricing && (
                          <span className="px-2 py-1 text-xs font-bold rounded bg-gray-700 text-gray-300">
                            {relatedTool.pricing}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                        {relatedTool.shortDescription || relatedTool.description}
                      </p>
                      <div className="text-blue-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        View Details <FaArrowLeft className="rotate-180" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolDetail;
