import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { motion as m } from 'framer-motion';
import { FaArrowLeft, FaExternalLinkAlt, FaStar, FaBookmark, FaRegBookmark, FaCalendar, FaTag } from 'react-icons/fa';
import toolsData from '../data/toolsData';
import { ToolDetailSkeleton } from './SkeletonLoader';
import Breadcrumb from './Breadcrumb';

const ToolDetail = () => {
  const { category, toolSlug } = useParams();
  const history = useHistory();
  const [tool, setTool] = useState(null);
  const [saved, setSaved] = useState(false);
  const [relatedTools, setRelatedTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvedTools, setApprovedTools] = useState([]);
  // Robust API base: env var first, then detect Vercel, else localhost
  const API_URL = useMemo(() => {
    const envUrl = process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.trim();
    if (envUrl) return envUrl;
    try {
      const host = typeof window !== 'undefined' ? window.location.hostname : '';
      const isVercel = /vercel\.app$/.test(host);
      if (isVercel) return 'https://ai-tools-hub-backend-u2v6.onrender.com';
    } catch {}
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
          description: t.description || '',
          link: t.url || '#',
          url: t.url || '#',
          image: snapshot || fallback || null,
          isNew: true,
          category: slugCategory,
          dateAdded: safeTime,
        };
      });
  }, [approvedTools, buildSnapshotUrl, getFaviconUrl, toSlug]);

  // Merge approved tools into toolsData
  const mergedToolsData = useMemo(() => {
    if (!Array.isArray(toolsData)) return [];
    
    const dataWithApproved = toolsData.map(categoryData => {
      if (!categoryData || !Array.isArray(categoryData.tools)) return categoryData;
      
      const categoryApprovedTools = convertedApprovedTools.filter(
        tool => tool && tool.category === categoryData.id
      );
      
      if (categoryApprovedTools.length > 0) {
        return {
          ...categoryData,
          tools: [...categoryData.tools, ...categoryApprovedTools]
        };
      }
      return categoryData;
    });
    return dataWithApproved;
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
        <div className="bg-gray-800 rounded-2xl p-8 mb-8 border border-gray-700">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Tool Image */}
            <div className="w-full lg:w-48 h-48 rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 flex-shrink-0 flex items-center justify-center border border-gray-700">
              {tool.image ? (
                <img
                  src={tool.image}
                  alt={tool.name}
                  className="w-full h-full object-cover"
                  onLoad={() => console.log(`✅ Image loaded: ${tool.image}`)}
                  onError={(e) => {
                    console.error(`❌ Image failed to load: ${tool.image}`);
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'text-gray-500 text-4xl font-bold flex items-center justify-center w-full h-full';
                    fallback.textContent = tool.name.charAt(0).toUpperCase();
                    e.target.parentElement.appendChild(fallback);
                  }}
                />
              ) : (
                <div className="text-gray-500 text-4xl font-bold">
                  {tool.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Tool Info */}
            <div className="flex-1">
              {tool.category && tool.categoryId && (
                <Link
                  to={`/#${tool.categoryId}`}
                  className="inline-block text-sm text-blue-400 hover:text-blue-300 mb-2 transition-colors"
                >
                  {tool.category}
                </Link>
              )}
              
              <h1 className="text-3xl font-bold mb-3">{tool.name || 'Unnamed Tool'}</h1>
              
              <p className="text-gray-300 text-base leading-relaxed mb-4 whitespace-pre-line">
                {tool.description || 'No description available for this tool.'}
              </p>

              <div className="flex items-center gap-3 mb-6 flex-wrap">
                {tool.pricing && (
                  <span className="px-4 py-1.5 text-sm font-medium rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                    {tool.pricing}
                  </span>
                )}
                {tool.badge === 'Recommended' && (
                  <span className="px-4 py-1.5 text-sm font-medium rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center gap-1.5">
                    <FaStar className="text-xs" /> Recommended
                  </span>
                )}
              </div>

              <div className="flex gap-3 flex-wrap">
                {tool.url && (
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:scale-105 transition-transform flex items-center gap-2"
                  >
                    Visit Site <FaExternalLinkAlt className="text-sm" />
                  </a>
                )}
                <button
                  onClick={toggleBookmark}
                  className={`px-6 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                    saved
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {saved ? <FaBookmark /> : <FaRegBookmark />}
                  {saved ? 'Bookmarked' : 'Bookmark'}
                </button>
                <button
                  onClick={copyLink}
                  className="px-6 py-2.5 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* What is [Tool Name]? Section */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">What is {tool.name}?</h2>
          <p className="text-gray-300 leading-relaxed">
            {tool.description}
            {tool.description && tool.description.length < 200 && (
              <span> {tool.name} is a powerful AI tool designed to enhance productivity and streamline workflows. It leverages advanced artificial intelligence to deliver exceptional results, making it an invaluable resource for professionals and businesses alike.</span>
            )}
          </p>
        </div>

        {/* Metadata Section */}
        {tool.dateAdded && (
          <div className="bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-gray-400">
                <FaCalendar className="text-blue-400" />
                <div>
                  <p className="text-sm text-gray-500">Last Update</p>
                  <p className="text-white font-medium">
                    {new Date(tool.dateAdded).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Related Tools Section */}
        {relatedTools.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Related {tool.category} Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedTools.map((relatedTool) => {
                const relatedSlug = relatedTool.name.toLowerCase()
                  .replace(/[^a-z0-9\s-]/g, '')
                  .replace(/\s+/g, '-')
                  .replace(/-+/g, '-');
                
                return (
                  <Link
                    key={relatedTool.name}
                    to={`/tools/${tool.categoryId}/${relatedSlug}`}
                    className="group bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-all hover:scale-105"
                  >
                    <div className="h-40 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                      {relatedTool.image ? (
                        <img
                          src={relatedTool.image}
                          alt={relatedTool.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `<div class="text-gray-600 text-3xl font-bold">${relatedTool.name.charAt(0).toUpperCase()}</div>`;
                          }}
                        />
                      ) : (
                        <div className="text-gray-600 text-3xl font-bold">
                          {relatedTool.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors">
                        {relatedTool.name}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                        {relatedTool.description}
                      </p>
                      {relatedTool.pricing && (
                        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                          {relatedTool.pricing}
                        </span>
                      )}
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
