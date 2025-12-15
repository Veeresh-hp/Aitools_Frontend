import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSync, FaExclamationTriangle, FaCheck, FaTimes, FaSpinner, FaEye, FaStar, FaEdit } from 'react-icons/fa';
import api from '../utils/api';

import { addRefToUrl } from '../utils/linkUtils';

const AdminDashboard = () => {

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [pendingTools, setPendingTools] = useState([]);
  const [pendingCategories, setPendingCategories] = useState([]);
  const [editingTool, setEditingTool] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editSnapshot, setEditSnapshot] = useState(null);

  const token = localStorage.getItem('token');

  const fetchPending = useCallback(async () => {
    try {
      setIsLoading(true);
      setMessage('');

      if (!token) {
        setMessage('⚠️ Not authenticated. Please login again.');
        setMessageType('error');
        return;
      }

      const res = await api.get('/api/tools/pending');
      const json = res.data;

      setPendingTools(json.tools || []);
      setMessage(
        json.tools.length > 0
          ? `✅ Loaded ${json.tools.length} pending tool(s)`
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

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchPending();
    fetchPendingCategories();
    fetchCategories();
  }, [fetchPending, fetchPendingCategories]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleApproveCategory = async (id) => {
    try {
      await api.post(`/api/categories/${id}/approve`);
      setPendingCategories(pendingCategories.filter(c => c._id !== id));
      setMessage('Category approved!');
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
  };

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
      setMessage('✅ Tool updated successfully');
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
      setMessage(`✅ Approved ${tool.name}`);
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

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Manage tool submissions and content</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { fetchPending(); fetchPendingCategories(); }}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-all flex items-center gap-2 text-sm font-medium"
            >
              <FaSync className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl border ${messageType === 'error'
              ? 'bg-red-500/10 border-red-500/20 text-red-400'
              : 'bg-green-500/10 border-green-500/20 text-green-400'
              } flex items-center gap-3`}
          >
            {messageType === 'error' ? <FaExclamationTriangle /> : <FaCheck />}
            {message}
          </motion.div>
        )}

        {/* Pending Categories Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-purple-500 rounded-full" />
            Pending Category Requests
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({pendingCategories.length})
            </span>
          </h2>

          {pendingCategories.length === 0 ? (
            <div className="bg-gray-800/50 rounded-2xl p-12 text-center border border-gray-700/50">
              <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheck className="text-2xl text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-300">All caught up!</h3>
              <p className="text-gray-500 mt-1">No pending category requests at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {pendingCategories.map((cat) => (
                  <motion.div
                    key={cat._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-purple-500/30 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">Slug: {cat.slug}</p>
                      </div>
                      <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full border border-yellow-500/20">
                        Pending
                      </span>
                    </div>

                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700/50">
                      <button
                        onClick={() => handleApproveCategory(cat._id)}
                        className="flex-1 px-3 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <FaCheck /> Approve
                      </button>
                      <button
                        onClick={() => handleRejectCategory(cat._id)}
                        className="flex-1 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <FaTimes /> Reject
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Pending Tools Section */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-blue-500 rounded-full" />
            Pending Tool Submissions
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({pendingTools.length})
            </span>
          </h2>

          {isLoading && pendingTools.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </div>
          ) : pendingTools.length === 0 ? (
            <div className="bg-gray-800/50 rounded-2xl p-12 text-center border border-gray-700/50">
              <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheck className="text-2xl text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-300">All caught up!</h3>
              <p className="text-gray-500 mt-1">No pending tool submissions at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              <AnimatePresence>
                {pendingTools.map((tool) => (
                  <motion.div
                    key={tool._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/30 transition-all"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Snapshot */}
                      <div className="w-full md:w-48 h-32 bg-gray-900 rounded-lg overflow-hidden flex-shrink-0 border border-gray-700">
                        {tool.snapshotUrl ? (
                          <img
                            src={tool.snapshotUrl}
                            alt={tool.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600">
                            <FaEye className="text-2xl" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">
                              {tool.name}
                            </h3>
                            <a
                              href={addRefToUrl(tool.url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 mb-3"
                            >
                              {tool.url} <FaEye className="text-xs" />
                            </a>
                          </div>
                          <button
                            onClick={() => handleToggleChoice(tool)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${tool.isAiToolsChoice
                              ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                              : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                              }`}
                          >
                            <FaStar className={tool.isAiToolsChoice ? 'fill-current' : ''} /> Choice
                          </button>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveTool(tool)}
                            className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                          >
                            <FaCheck /> Approve
                          </button>

                          <button
                            onClick={() => handleEditClick(tool)}
                            className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                          >
                            <FaEdit /> Edit
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
                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ml-auto"
                          >
                            <FaTimes /> Reject
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
      </div >

      {/* Edit Modal */}
      < AnimatePresence >
        {editingTool && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Edit Tool</h3>
                <button
                  onClick={() => setEditingTool(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleUpdateTool} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                  <input
                    name="name"
                    value={editForm.name || ''}
                    onChange={handleEditChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Short Description</label>
                  <input
                    name="shortDescription"
                    value={editForm.shortDescription || ''}
                    onChange={handleEditChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={editForm.description || ''}
                    onChange={handleEditChange}
                    rows={3}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">URL</label>
                    <input
                      name="url"
                      value={editForm.url || ''}
                      onChange={handleEditChange}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                    <select
                      name="category"
                      value={editForm.category || ''}
                      onChange={handleEditChange}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Hashtags (comma separated)</label>
                  <input
                    name="hashtags"
                    value={editForm.hashtags || ''}
                    onChange={handleEditChange}
                    placeholder="e.g. ai, video, generator"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Pricing</label>
                  <select
                    name="pricing"
                    value={editForm.pricing || 'Freemium'}
                    onChange={handleEditChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="Free">Free</option>
                    <option value="Freemium">Freemium</option>
                    <option value="Paid">Paid</option>
                    <option value="Open Source">Open Source</option>
                    <option value="Free Trial">Free Trial</option>
                    <option value="Contact">Contact</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Update Snapshot (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditFile}
                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600/20 file:text-blue-400 hover:file:bg-blue-600/30 cursor-pointer"
                  />
                </div>

                <div className="flex gap-3 pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setEditingTool(null)}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
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
    </div >
  );
};

export default AdminDashboard;
