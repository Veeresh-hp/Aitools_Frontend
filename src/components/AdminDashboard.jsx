import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSync, FaExclamationTriangle, FaCheck, FaTimes, FaSpinner, FaEye, FaStar, FaEdit } from 'react-icons/fa';
import api from '../utils/api';
import adminBg from '../assets/admin_bg_person.png'; // New generated background

import { addRefToUrl } from '../utils/linkUtils';

const AdminDashboard = () => {

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [pendingTools, setPendingTools] = useState([]);
  const [pendingCategories, setPendingCategories] = useState([]);
  const [editingTool, setEditingTool] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editSnapshot, setEditSnapshot] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [viewingImage, setViewingImage] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null); // { id, name }
  const [editPreviewUrl, setEditPreviewUrl] = useState(null);

  const token = localStorage.getItem('token');

  const fetchPending = useCallback(async () => {
    try {
      setIsLoading(true);
      setMessage('');

      if (!token) {
        setMessage('Not authenticated');
        setMessageType('error');
        return;
      }

      const res = await api.get('/api/tools/pending');
      const json = res.data;

      setPendingTools(json.tools || []);
      setMessage(
        json.tools.length > 0
          ? `Loaded ${json.tools.length} pending tool(s)`
          : 'No pending tools'
      );
      setMessageType('success');
    } catch (err) {
      console.error(err);
      setMessage('Network error');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchPendingCategories = useCallback(async () => {
    try {
      const res = await api.get('/api/categories/pending');
      setPendingCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch pending categories', err);
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  useEffect(() => {
    fetchPending();
    fetchPendingCategories();
    fetchCategories();
  }, [fetchPending, fetchPendingCategories]);


  const handleApproveCategory = async (id) => {
    try {
      await api.post(`/api/categories/${id}/approve`);
      setPendingCategories(pendingCategories.filter(c => c._id !== id));
      setMessage('Category approved');
      setMessageType('success');
    } catch (err) {
      console.error(err);
      setMessage('Failed to approve category');
      setMessageType('error');
    }
  };

  const handleRejectCategory = async (id) => {
    try {
      await api.post(`/api/categories/${id}/reject`);
      setPendingCategories(pendingCategories.filter(c => c._id !== id));
      setMessage('Category rejected');
      setMessageType('success');
    } catch (err) {
      console.error(err);
      setMessage('Failed to reject category');
      setMessageType('error');
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
        setIsLoading(true);
        const res = await api.put(`/api/categories/${editingCategory._id}`, { name: editingCategory.name });
        
        // Update local state
        setPendingCategories(pendingCategories.map(c => c._id === editingCategory._id ? res.data.category : c));
        setMessage('Category updated');
        setMessageType('success');
        setEditingCategory(null);
    } catch (err) {
        console.error(err);
        setMessage(err.response?.data?.error || 'Failed to update category');
        setMessageType('error');
    } finally {
        setIsLoading(false);
    }
  };

  const handleEditClick = (tool) => {
    setEditingTool(tool);
    setEditForm({
      name: tool.name,
      shortDescription: tool.shortDescription,
      description: tool.description,
      url: tool.url,
      category: tool.category,
      pricing: tool.pricing,
      hashtags: Array.isArray(tool.hashtags) ? tool.hashtags.join(', ') : tool.hashtags,
      isAiToolsChoice: tool.isAiToolsChoice
    });

    setEditSnapshot(null);
    setEditPreviewUrl(null);
  };

  // Preview Effect for Edit Snapshot
  useEffect(() => {
    if (!editSnapshot) {
      setEditPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(editSnapshot);
    setEditPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [editSnapshot]);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditFile = (e) => {
    setEditSnapshot(e.target.files[0]);
  };

  const handleUpdateTool = async (e) => {
    e.preventDefault();
    if (!editingTool) return;

    try {
      setIsLoading(true);
      let snapshotUrl = editingTool.snapshotUrl;

      if (editSnapshot) {
        const formData = new FormData();
        formData.append('snapshot', editSnapshot);
        const uploadRes = await api.post('/api/tools/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        snapshotUrl = uploadRes.data.url;
      }

      const updatedData = { ...editForm, snapshotUrl };
      await api.put(`/api/tools/${editingTool._id}/edit`, updatedData);

      setPendingTools(
        pendingTools.map((t) =>
          t._id === editingTool._id ? { ...t, ...updatedData } : t
        )
      );
      setEditingTool(null);
      setMessage('Tool updated successfully');
      setMessageType('success');
    } catch (err) {
      console.error(err);
      setMessage('Failed to update tool');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveTool = async (tool) => {
    if (!window.confirm(`Are you sure you want to approve ${tool.name}?`)) return;
    try {
      setIsLoading(true);
      await api.post(`/api/tools/${tool._id}/approve`);
      setPendingTools(pendingTools.filter((t) => t._id !== tool._id));
      setMessage(`Approved ${tool.name}`);
      setMessageType('success');
    } catch (err) {
      console.error(err);
      setMessage('Failed to approve tool');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleChoice = async (tool) => {
    try {
      setIsLoading(true);
      const res = await api.put(`/api/tools/${tool._id}/toggle-choice`);
      const updatedTool = res.data.tool;

      setPendingTools(
        pendingTools.map((t) =>
          t._id === tool._id ? { ...t, isAiToolsChoice: updatedTool.isAiToolsChoice } : t
        )
      );
      setMessage(`Choice status updated for ${tool.name}`);
      setMessageType('success');
    } catch (err) {
      console.error(err);
      setMessage('Failed to toggle choice status');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Dark Minimal Theme Styles ---
  // Background: Rich Black (#050505)
  // Accent: Orange (#FF4D00)
  // Framing: Corner Squares + Lines
  // Decoration: Side Image (Person)

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden font-sans selection:bg-[#FF4D00] selection:text-white">
        
        {/* Background Elements */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            {/* Gradient Overlay for atmosphere */}
            <div className="absolute inset-0 bg-radial-gradient(circle at 50% 50%, #1a1a1a 0%, #050505 100%) opacity-50"></div>
            
            {/* The Person Image - Positioned "Beside" / Bottom Right like the rock in reference */}
            <motion.div 
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute bottom-0 right-0 w-[500px] h-[600px] z-0 mix-blend-screen opacity-90"
            >
                 <motion.img 
                    src={adminBg} 
                    alt="Atmospheric Figure" 
                    className="w-full h-full object-contain object-bottom grayscale brightness-125 contrast-125"
                    animate={{ 
                        filter: ["brightness(1.2) contrast(1.2)", "brightness(1.4) contrast(1.1)", "brightness(1.2) contrast(1.2)"]
                    }}
                    transition={{ 
                        duration: 8, 
                        repeat: Infinity, 
                        repeatType: "mirror",
                        ease: "easeInOut" 
                    }}
                />
                {/* Fade the image into the background at the bottom/left */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#050505]/20"></div>
            </motion.div>
        </div>

      {/* Main Content Container with "Framing" effect */}
      <div className="relative z-10 max-w-7xl mx-auto p-8 lg:p-12 min-h-screen flex flex-col">
        
        {/* Top Navigation / Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 relative">
             {/* Text "Simplicity Never Looked This Rich" vibe */}
             <div className="absolute -top-6 left-0 text-[10px] text-gray-500 tracking-[0.3em] uppercase hidden md:block">
                Simplicity Never Looked This Rich
             </div>

            <div className="z-10">
                <h1 className="text-7xl md:text-8xl font-black text-white tracking-tighter leading-[0.8]">
                ADMIN
                <span className="text-[#FF4D00]">.</span>
                </h1>
                <p className="text-gray-500 font-bold tracking-widest uppercase text-xs mt-2 ml-1">Management Dashboard</p>
            </div>

            <div className="flex gap-4 mt-8 md:mt-0 z-10">
                <button
                onClick={() => { fetchPending(); fetchPendingCategories(); }}
                className="px-8 py-4 bg-[#FF4D00] hover:bg-white hover:text-black text-white font-bold uppercase tracking-widest text-xs transition-all duration-300 flex items-center gap-3 relative overflow-hidden group"
                >
                <span className="relative z-10 flex items-center gap-2">
                    <FaSync className={`group-hover:rotate-180 transition-transform duration-500 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh Data
                </span>
                </button>
            </div>
        </div>

        {/* Message Alert */}
        <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`mb-12 p-4 border-l-2 font-bold uppercase tracking-wider text-xs flex items-center gap-4 bg-[#0A0A0A] max-w-md ${messageType === 'error'
              ? 'border-red-500 text-red-500'
              : 'border-[#FF4D00] text-[#FF4D00]'
              }`}
          >
            {messageType === 'error' ? <FaExclamationTriangle /> : <FaCheck />}
            <span className="text-gray-300">{message}</span>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Framing Layout for Main Content */}
        <div className="relative border-l border-t border-white/10 p-8 md:p-12 flex-1">
             {/* Decoration: Corner Squares (The Reference Look) */}
             {/* Top Left - handled by border connection, adding square */}
             <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#FF4D00]"></div>
             
             {/* Top Right */}
             <div className="absolute top-0 right-0 w-full h-[1px] bg-white/10"></div>
             <div className="absolute -top-1.5 right-0 w-3 h-3 bg-[#FF4D00]"></div>

             {/* Bottom Left */}
             <div className="absolute bottom-0 left-0 w-[1px] h-full bg-white/10"></div>
             <div className="absolute bottom-0 -left-1.5 w-3 h-3 bg-[#FF4D00]"></div>

             {/* Bottom Right (Open or closed? Reference usually creates a box. Let's make it a box) */}
             <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#FF4D00]"></div>
             <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10"></div>
             <div className="absolute top-0 right-0 w-[1px] h-full bg-white/10"></div>
            
             {/* Content Inside Frame */}
            
            {/* Pending Categories Section */}
            <div className="mb-20 relative z-10">
            <div className="flex items-end gap-4 mb-8">
                <h2 className="text-4xl font-bold text-white tracking-tighter leading-none">
                CATEGORIES
                </h2>
                <span className="text-sm font-bold text-[#FF4D00] mb-1">
                ({pendingCategories.length})
                </span>
            </div>

            {pendingCategories.length === 0 ? (
                <div className="bg-[#080808] p-12 border border-white/5 text-center max-w-lg">
                <p className="text-gray-600 uppercase tracking-widest text-xs font-bold">No Pending Items</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {pendingCategories.map((cat) => (
                    <motion.div
                        key={cat._id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="bg-[#0A0A0A] border border-white/5 p-6 group hover:bg-[#0f0f0f] transition-colors relative"
                    >
                        <div className="absolute top-0 right-0 w-0 h-0 border-t-[6px] border-r-[6px] border-transparent group-hover:border-[#FF4D00] transition-all duration-300"></div>

                        <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">
                            {cat.name}
                            </h3>
                            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">slug: {cat.slug}</p>
                        </div>
                        </div>

                        <div className="flex gap-4">
                        <button
                            onClick={() => handleApproveCategory(cat._id)}
                            className="text-[10px] font-bold uppercase tracking-widest text-white hover:text-[#FF4D00] transition-colors"
                        >
                            Approve
                        </button>
                        <span className="text-gray-700">|</span>
                        <button
                            onClick={() => setEditingCategory(cat)}
                            className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                        >
                            Edit
                        </button>
                        <span className="text-gray-700">|</span>
                        <button
                            onClick={() => handleRejectCategory(cat._id)}
                            className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-red-500 transition-colors"
                        >
                            Reject
                        </button>
                        </div>
                    </motion.div>
                    ))}
                </AnimatePresence>
                </div>
            )}
            </div>

            {/* Pending Tools Section */}
            <div className="relative z-10">
            <div className="flex items-end gap-4 mb-8">
                <h2 className="text-4xl font-bold text-white tracking-tighter leading-none">
                TOOLS
                </h2>
                 <span className="text-sm font-bold text-[#FF4D00] mb-1">
                ({pendingTools.length})
                </span>
            </div>

            {isLoading && pendingTools.length === 0 ? (
                <div className="py-20 flex">
                 <FaSpinner className="animate-spin text-[#FF4D00] text-2xl" />
                </div>
            ) : pendingTools.length === 0 ? (
                 <div className="bg-[#080808] p-12 border border-white/5 text-center max-w-lg">
                <p className="text-gray-600 uppercase tracking-widest text-xs font-bold">No Pending Tools</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 max-w-4xl">
                <AnimatePresence>
                    {pendingTools.map((tool) => (
                    <motion.div
                        key={tool._id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-[#0A0A0A] border border-white/5 p-8 relative group hover:border-white/10 transition-colors"
                    >
                         <div className="absolute top-0 left-0 w-[2px] h-0 bg-[#FF4D00] group-hover:h-full transition-all duration-500"></div>

                        <div className="flex flex-col md:flex-row gap-8">
                        {/* Snapshot */}
                        <div 
                            className="w-full md:w-48 aspect-video bg-black relative grayscale hover:grayscale-0 transition-all duration-500 cursor-zoom-in overflow-hidden"
                            onClick={() => tool.snapshotUrl && setViewingImage(tool.snapshotUrl)}
                        >
                            {tool.snapshotUrl ? (
                            <img
                                src={tool.snapshotUrl}
                                alt={tool.name}
                                className="w-full h-full object-cover"
                            />
                            ) : (
                            <div className="w-full h-full flex items-center justify-center border border-white/10">
                                <div className="w-2 h-2 bg-white/20"></div>
                            </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-white tracking-tight uppercase">
                                    {tool.name}
                                    </h3>
                                    <a
                                    href={addRefToUrl(tool.url)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#FF4D00] text-xs font-mono mt-1 block hover:underline truncate max-w-md"
                                    >
                                    {tool.url}
                                    </a>
                                </div>
                                 <button
                                    onClick={() => handleToggleChoice(tool)}
                                    className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${tool.isAiToolsChoice
                                    ? 'text-yellow-500'
                                    : 'text-gray-600 hover:text-white'
                                    }`}
                                >
                                    <FaStar className={tool.isAiToolsChoice ? 'fill-current' : ''} /> 
                                    {tool.isAiToolsChoice ? 'Editor\'s Choice' : 'Mark as Choice'}
                                </button>
                            </div>

                            <p className="text-gray-400 mb-6 text-sm leading-relaxed max-w-2xl border-l border-white/10 pl-4 py-1">
                                {tool.shortDescription || tool.description}
                            </p>
                            </div>

                            <div className="flex flex-wrap gap-8 items-center border-t border-white/5 pt-6 mt-2">
                            <button
                                onClick={() => handleApproveTool(tool)}
                                className="text-xs font-bold uppercase tracking-widest text-white hover:text-[#FF4D00] transition-colors flex items-center gap-2"
                            >
                                <span className="w-2 h-2 bg-[#FF4D00] rounded-sm"></span> Approve
                            </button>

                            <button
                                onClick={() => handleEditClick(tool)}
                                className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors flex items-center gap-2"
                            >
                                Edit
                            </button>

                            <button
                                onClick={async () => {
                                if (
                                    !window.confirm(
                                    `Are you sure you want to reject ${tool.name}?`
                                    )
                                )
                                    return;
                                try {
                                    setIsLoading(true);
                                    await api.post(
                                    `/api/tools/${tool._id}/reject`
                                    );
                                    setPendingTools(
                                    pendingTools.filter((t) => t._id !== tool._id)
                                    );
                                    setMessage(`Rejected ${tool.name}`);
                                    setMessageType('success');
                                } catch (err) {
                                    console.error(err);
                                    setMessage('Failed to reject');
                                    setMessageType('error');
                                } finally {
                                    setIsLoading(false);
                                }
                                }}
                                className="text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-red-500 transition-all flex items-center gap-2 ml-auto"
                            >
                                Reject
                            </button>
                            </div>
                        </div>
                        </div>
                    </motion.div>
                    ))}
                </AnimatePresence>
                </div>
            )}
            </div>
        </div>

      </div >

      {/* Edit Modal - Minimalist */}
      < AnimatePresence >
        {editingTool && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#050505] border border-white/10 w-full max-w-2xl shadow-2xl relative"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center bg-[#050505]">
                <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                   <span className="w-1.5 h-6 bg-[#FF4D00]"></span> EDIT TOOL
                </h3>
                <button
                  onClick={() => setEditingTool(null)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateTool} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar bg-[#050505]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Name</label>
                        <input
                            name="name"
                            value={editForm.name || ''}
                            onChange={handleEditChange}
                            className="w-full bg-[#111] border border-white/10 focus:border-[#FF4D00] rounded-none px-4 py-3 text-white outline-none transition-colors placeholder-gray-700"
                            placeholder="Tool Name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Short Description</label>
                        <input
                            name="shortDescription"
                            value={editForm.shortDescription || ''}
                            onChange={handleEditChange}
                            className="w-full bg-[#111] border border-white/10 focus:border-[#FF4D00] rounded-none px-4 py-3 text-white outline-none transition-colors placeholder-gray-700"
                            placeholder="Brief summary"
                        />
                    </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                  <textarea
                    name="description"
                    value={editForm.description || ''}
                    onChange={handleEditChange}
                    rows={6}
                    className="w-full bg-[#111] border border-white/10 focus:border-[#FF4D00] rounded-none px-4 py-3 text-white outline-none transition-colors placeholder-gray-700 resize-none"
                    placeholder="Full description..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">URL</label>
                    <input
                      name="url"
                      value={editForm.url || ''}
                      onChange={handleEditChange}
                      className="w-full bg-[#111] border border-white/10 focus:border-[#FF4D00] rounded-none px-4 py-3 text-white outline-none transition-colors placeholder-gray-700"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                    <div className="relative">
                        <select
                        name="category"
                        value={editForm.category || ''}
                        onChange={handleEditChange}
                        className="w-full bg-[#111] border border-white/10 focus:border-[#FF4D00] rounded-none px-4 py-3 text-white outline-none transition-colors appearance-none cursor-pointer"
                        >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat.slug} className="bg-[#111]">
                            {cat.name}
                            </option>
                        ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hashtags</label>
                  <input
                    name="hashtags"
                    value={editForm.hashtags || ''}
                    onChange={handleEditChange}
                    placeholder="e.g. ai, video, generator"
                    className="w-full bg-[#111] border border-white/10 focus:border-[#FF4D00] rounded-none px-4 py-3 text-white outline-none transition-colors placeholder-gray-700"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pricing</label>
                        <div className="relative">
                            <select
                                name="pricing"
                                value={editForm.pricing || 'Freemium'}
                                onChange={handleEditChange}
                                className="w-full bg-[#111] border border-white/10 focus:border-[#FF4D00] rounded-none px-4 py-3 text-white outline-none transition-colors appearance-none cursor-pointer"
                            >
                                <option value="Free" className="bg-[#111]">Free</option>
                                <option value="Freemium" className="bg-[#111]">Freemium</option>
                                <option value="Paid" className="bg-[#111]">Paid</option>
                                <option value="Open Source" className="bg-[#111]">Open Source</option>
                                <option value="Free Trial" className="bg-[#111]">Free Trial</option>
                                <option value="Contact" className="bg-[#111]">Contact</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Update Snapshot</label>
                        
                        {/* Image Preview */}
                        <div 
                            className="w-full aspect-video bg-black/50 border border-white/10 mb-2 flex items-center justify-center overflow-hidden relative cursor-zoom-in hover:border-[#FF4D00]/50 transition-colors"
                            onClick={() => {
                                if (editPreviewUrl) {
                                    setViewingImage(editPreviewUrl);
                                } else if (editingTool.snapshotUrl) {
                                    setViewingImage(editingTool.snapshotUrl);
                                }
                            }}
                        >
                            {editSnapshot && editPreviewUrl ? (
                                <div className="relative w-full h-full group">
                                     <img 
                                        src={editPreviewUrl} 
                                        alt="New Snapshot" 
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-xs text-[#FF4D00] font-bold uppercase tracking-widest">New Image Selected</p>
                                    </div>
                                </div>
                            ) : editingTool.snapshotUrl ? (
                                <img 
                                    src={editingTool.snapshotUrl} 
                                    alt="Current Snapshot" 
                                    className="w-full h-full object-cover opacity-80"
                                />
                            ) : (
                                <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">No Image</p>
                            )}
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleEditFile}
                            className="w-full text-xs text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-none file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-white/5 file:text-gray-300 hover:file:bg-[#FF4D00] hover:file:text-white cursor-pointer border border-white/10 bg-[#111]"
                        />
                    </div>
                </div>

                <div className="flex gap-4 pt-8 mt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setEditingTool(null)}
                    className="flex-1 px-6 py-4 bg-transparent hover:bg-white/5 text-gray-400 border border-white/10 hover:border-white/20 text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-6 py-4 bg-[#FF4D00] hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence >

      {/* Full Screen Image Viewer */}
      <AnimatePresence>
        {viewingImage && (
            <div 
                className="fixed inset-0 z-[150] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
                onClick={() => setViewingImage(null)}
            >
                <motion.img
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    src={viewingImage}
                    alt="Full View"
                    className="max-w-full max-h-full object-contain"
                />
                <button 
                    className="absolute top-8 right-8 text-white/50 hover:text-white"
                    onClick={() => setViewingImage(null)}
                >
                    <FaTimes size={32} />
                </button>
            </div>
        )}
      </AnimatePresence>



      {/* Edit Category Modal */}
      <AnimatePresence>
        {editingCategory && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#050505] border border-white/10 w-full max-w-md shadow-2xl relative p-8"
                >
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <FaEdit className="text-[#FF4D00]" /> Edit Category
                    </h3>
                    
                    <form onSubmit={handleUpdateCategory} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category Name</label>
                            <input
                                value={editingCategory.name}
                                onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                                className="w-full bg-[#111] border border-white/10 focus:border-[#FF4D00] px-4 py-3 text-white outline-none"
                                autoFocus
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setEditingCategory(null)}
                                className="flex-1 py-3 border border-white/10 hover:bg-white/5 text-gray-400 text-xs font-bold uppercase"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || !editingCategory.name.trim()}
                                className="flex-1 py-3 bg-[#FF4D00] hover:bg-white hover:text-black text-white text-xs font-bold uppercase transition-colors"
                            >
                                {isLoading ? 'Saving...' : 'Save Update'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

    </div >
  );
};

export default AdminDashboard;
