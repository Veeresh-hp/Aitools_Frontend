import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { m, AnimatePresence } from 'framer-motion';
import { FaExternalLinkAlt, FaBookmark, FaRegBookmark, FaTimes, FaStar, FaChartLine, FaDollarSign, FaTag, FaUsers, FaGlobe, FaLink, FaCopy, FaCheck } from 'react-icons/fa';
import { addRefToUrl } from '../utils/linkUtils';

const ToolDetailModal = ({ tool, onClose }) => {
  const getToolKey = () => (tool && (tool.url || tool.name || tool.id)) || null;
  const [saved, setSaved] = useState(false);
  const [saveCount, setSaveCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!tool) return;
    try {
      const raw = localStorage.getItem('ai_bookmarks');
      const arr = raw ? JSON.parse(raw) : [];
      const key = getToolKey();
      setSaved(arr.includes(key));
      setSaveCount(arr.includes(key) ? 1 : 0);
    } catch (err) {
      // ignore
    }
  }, [tool]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose && onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (tool) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [tool]);

  const toggleBookmark = (e) => {
    e && e.stopPropagation();
    try {
      const key = getToolKey();
      const raw = localStorage.getItem('ai_bookmarks');
      let arr = raw ? JSON.parse(raw) : [];
      if (arr.includes(key)) {
        arr = arr.filter(x => x !== key);
        setSaved(false);
      } else {
        arr.push(key);
        setSaved(true);
      }
      localStorage.setItem('ai_bookmarks', JSON.stringify(arr));
      setSaveCount(arr.includes(key) ? 1 : 0);
    } catch (err) {
      console.error('bookmark error', err);
    }
  };

  const copyToClipboard = () => {
    if (tool.url || tool.link) {
      navigator.clipboard.writeText(tool.url || tool.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  console.log('🎯 ToolDetailModal rendering, tool:', tool);

  if (!tool) {
    console.log('⚠️ Tool is null, not rendering modal');
    return null;
  }

  console.log('✅ Rendering modal for tool:', tool.name);

  // Extract or generate metadata
  const pricing = tool.pricing || 'Free';
  const category = tool.category ? tool.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'General';
  const tags = tool.tags || ['AI Tool', 'Productivity'];
  const rating = tool.rating || 4.5;
  const users = tool.users || '10K+';

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center px-4 bg-black/90 backdrop-blur-md overflow-y-auto py-8 scrollbar-hide"
      style={{ zIndex: 99999 }}
      onClick={onClose}
    >
      <div className="relative max-w-5xl w-full">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-xl opacity-30" />

        {/* Modal content */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-purple-500/30 overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-hide"
          role="dialog"
          aria-modal="true"
          style={{
            scrollbarWidth: 'none', /* Firefox */
            msOverflowStyle: 'none', /* IE and Edge */
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-6 right-6 z-10 p-3 rounded-full bg-gray-800/90 backdrop-blur-md text-white hover:bg-red-600 hover:rotate-90 transition-all duration-300 border border-gray-700 hover:border-red-500 shadow-lg"
          >
            <FaTimes className="w-5 h-5" />
          </button>

          {/* Hero Section with Image */}
          <div className="relative h-72 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 overflow-hidden">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 animate-gradient-x" />

            {tool.image ? (
              <img
                src={tool.image}
                alt={tool.name}
                className="w-full h-full object-cover opacity-90"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                  e.target.parentElement.innerHTML = `<div class="text-6xl text-white/50">${tool.name.charAt(0)}</div>`;
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-8xl text-white/30 font-bold">{tool.name.charAt(0)}</div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

            {/* Tool Name Overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">{tool.name}</h2>
                  <div className="flex items-center gap-3">
                    {tool.badge && (
                      <span className="px-3 py-1 rounded-full bg-yellow-500 text-black text-xs font-bold">
                        {tool.badge}
                      </span>
                    )}
                    {tool.isNew && (
                      <span className="px-3 py-1 rounded-full bg-green-500 text-white text-xs font-bold animate-pulse">
                        🎉 NEW
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
                      {category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={toggleBookmark}
                  className={`p-3 rounded-full backdrop-blur-md transition-all ${saved
                      ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/50'
                      : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                >
                  {saved ? <FaBookmark className="w-5 h-5" /> : <FaRegBookmark className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full" />
                    About {tool.name}
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {tool.description}
                  </p>
                </div>

                {/* Key Features */}
                <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-purple-500/20">
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FaStar className="text-yellow-500" />
                    Key Features
                  </h4>
                  <ul className="space-y-3">
                    {(tool.features || [
                      'AI-powered capabilities',
                      'User-friendly interface',
                      'Fast processing speed',
                      'Reliable and secure'
                    ]).map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-300">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Use Cases */}
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-6 border border-cyan-500/20">
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <FaChartLine className="text-cyan-500" />
                    Use Cases
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {(tool.useCases || [
                      'Content Creation',
                      'Business Automation',
                      'Creative Projects',
                      'Professional Use'
                    ]).map((useCase, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 text-sm font-medium border border-cyan-500/30"
                      >
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Sidebar Info */}
              <div className="space-y-4">
                {/* Quick Stats */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-white/10">
                  <h4 className="text-white font-bold mb-4">Quick Info</h4>
                  <div className="space-y-4">
                    {/* Pricing */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-400">
                        <FaDollarSign className="text-green-500" />
                        <span>Pricing</span>
                      </div>
                      <span className="text-white font-semibold px-3 py-1 rounded-lg bg-green-500/20 text-green-400">
                        {pricing}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-400">
                        <FaStar className="text-yellow-500" />
                        <span>Rating</span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                        {rating} <FaStar className="w-3 h-3" />
                      </div>
                    </div>

                    {/* Users */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-400">
                        <FaUsers className="text-blue-500" />
                        <span>Users</span>
                      </div>
                      <span className="text-white font-semibold">{users}</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-white/10">
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <FaTag className="text-pink-500" />
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-sm border border-pink-500/30"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Related Tools */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-white/10">
                  <h4 className="text-white font-bold mb-4">Related Tools</h4>
                  <div className="space-y-2 text-sm">
                    <a href="#" className="block text-purple-400 hover:text-purple-300 transition-colors">
                      → Similar Tool 1
                    </a>
                    <a href="#" className="block text-purple-400 hover:text-purple-300 transition-colors">
                      → Similar Tool 2
                    </a>
                    <a href="#" className="block text-purple-400 hover:text-purple-300 transition-colors">
                      → Similar Tool 3
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={addRefToUrl(tool.url || tool.link)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-500/50 transition-all hover:scale-105"
              >
                <FaExternalLinkAlt />
                Visit {tool.name}
              </a>

              <button
                onClick={copyToClipboard}
                className="px-6 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-xl font-semibold border border-white/20 transition-all flex items-center gap-2"
              >
                {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>

              <button
                onClick={toggleBookmark}
                className={`px-6 py-4 rounded-xl font-semibold transition-all flex items-center gap-2 ${saved
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}
              >
                {saved ? <FaBookmark /> : <FaRegBookmark />}
                {saved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
          {/* Close Modal content div */}
        </div>
        {/* Close wrapper div */}
      </div>
      {/* Close outer div */}
    </div>,
    document.body
  );
};

export default ToolDetailModal;
