import React, { useState, useEffect } from 'react';
import { FaNewspaper, FaPaperPlane, FaSpinner, FaTools } from 'react-icons/fa';
import { motion as m } from 'framer-motion';
import api, { API_URL } from '../utils/api';

// Component for sending new-tool newsletters
const NewToolCard = ({ onSend, isLoading }) => {
  const [toolData, setToolData] = useState({
    name: '',
    category: '',
    description: '',
    url: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (toolData.name && toolData.category && toolData.description) {
      onSend(toolData);
      setToolData({ name: '', category: '', description: '', url: '' });
    }
  };

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6"
    >
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FaTools className="text-purple-400" />
        New Tool Newsletter
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Tool Name (e.g., ChatGPT-4)"
          value={toolData.name}
          onChange={(e) =>
            setToolData({ ...toolData, name: e.target.value })
          }
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
          disabled={isLoading}
        />

        <input
          type="text"
          placeholder="Category (e.g., AI Writing Tools)"
          value={toolData.category}
          onChange={(e) =>
            setToolData({ ...toolData, category: e.target.value })
          }
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
          disabled={isLoading}
        />

        <textarea
          placeholder="Tool Description (what it does, key features)"
          value={toolData.description}
          onChange={(e) =>
            setToolData({ ...toolData, description: e.target.value })
          }
          rows="3"
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          required
          disabled={isLoading}
        />

        <input
          type="url"
          placeholder="Tool URL (optional)"
          value={toolData.url}
          onChange={(e) =>
            setToolData({ ...toolData, url: e.target.value })
          }
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={isLoading}
        />

        <m.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin" />
              Sending Newsletter...
            </>
          ) : (
            <>
              <FaPaperPlane />
              Send Tool Newsletter
            </>
          )}
        </m.button>
      </form>
    </m.div>
  );
};

// Component for sending custom newsletters
const CustomNewsletterCard = ({ onSend, isLoading }) => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (subject && content) {
      onSend(subject, content);
      setSubject('');
      setContent('');
    }
  };

  const exampleContent = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #333;">🚀 Weekly AI Tools Update</h2>
  <p>Hi there! Here's what's new this week in the AI world...</p>
  <ul>
    <li>New feature released</li>
    <li>Tool improvements</li>
    <li>Industry insights</li>
  </ul>
  <p>Best regards,<br>AI Tools Hub Team</p>
</div>`;

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-xl p-6"
    >
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FaNewspaper className="text-blue-400" />
        Custom Newsletter
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Newsletter Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={isLoading}
        />

        <div className="relative">
          <textarea
            placeholder="Newsletter Content (HTML supported)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="8"
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            required
            disabled={isLoading}
          />

          {!content && (
            <button
              type="button"
              onClick={() => setContent(exampleContent)}
              className="absolute bottom-2 right-2 px-3 py-1 bg-blue-600/80 text-white text-xs rounded hover:bg-blue-600"
              disabled={isLoading}
            >
              Use Example
            </button>
          )}
        </div>

        <m.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin" />
              Sending Newsletter...
            </>
          ) : (
            <>
              <FaPaperPlane />
              Send Custom Newsletter
            </>
          )}
        </m.button>
      </form>
    </m.div>
  );
};

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [pendingTools, setPendingTools] = useState([]);
  const [editingTool, setEditingTool] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editSnapshot, setEditSnapshot] = useState(null);

  const token = localStorage.getItem('token');

  // Fetch pending tools for admin approval
  const fetchPending = async () => {
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
      console.error('Fetch pending tools error:', err);
      setMessage(
        `❌ Network error: ${err.message}. Check if backend is running on ${API_URL}`
      );
      setMessageType('error');
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(''), 8000);
    }
  };

  useEffect(() => {
    fetchPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Edit pending tool handler
  const handleEditTool = async () => {
    if (!editingTool) return;
    try {
      setIsLoading(true);
      const formData = new FormData();
      Object.keys(editForm).forEach((key) => {
        if (editForm[key] !== undefined && editForm[key] !== null) {
          formData.append(key, editForm[key]);
        }
      });
      if (editSnapshot) {
        formData.append('snapshot', editSnapshot);
      }

      const res = await api.put(
        `/api/tools/${editingTool._id}/edit`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      setMessage('✅ Tool updated successfully');
      setMessageType('success');
      setEditingTool(null);
      setEditForm({});
      setEditSnapshot(null);
      fetchPending();
    } catch (err) {
      console.error(err);
      setMessage('Network error');
      setMessageType('error');
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  // Send newsletter for new tool
  const sendNewToolNewsletter = async (toolData) => {
    setIsLoading(true);
    try {
      const response = await api.post(
        '/api/newsletter/send-update',
        {
          toolData: {
            name: toolData.name,
            category: toolData.category,
            description: toolData.description,
            url:
              toolData.url || process.env.REACT_APP_FRONTEND_URL,
          },
        }
      );

      const result = response.data;

      if (response.ok) {
        setMessage(`✅ Newsletter sent successfully: ${result.message}`);
        setMessageType('success');
      } else {
        setMessage(
          `❌ Failed to send newsletter: ${result.error}`
        );
        setMessageType('error');
      }
    } catch (error) {
      console.error('Newsletter error:', error);
      setMessage('❌ Network error sending newsletter');
      setMessageType('error');
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  // Send custom newsletter
  const sendCustomNewsletter = async (subject, htmlContent) => {
    setIsLoading(true);
    try {
      const response = await api.post(
        '/api/newsletter/send-update',
        {
          subject: subject,
          content: htmlContent,
        }
      );

      const result = response.data;

      setMessage(
        `✅ Custom newsletter sent: ${result.message}`
      );
      setMessageType('success');
    } catch (error) {
      console.error('Newsletter error:', error);
      setMessage('❌ Network error sending newsletter');
      setMessageType('error');
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-8 flex items-center gap-3">
            <FaTools className="text-blue-400" />
            Admin Dashboard
          </h1>

          {/* Message Display */}
          {message && (
            <m.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg ${
                messageType === 'success'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            >
              {message}
            </m.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* New Tool Newsletter */}
            <NewToolCard
              onSend={sendNewToolNewsletter}
              isLoading={isLoading}
            />

            {/* Custom Newsletter */}
            <CustomNewsletterCard
              onSend={sendCustomNewsletter}
              isLoading={isLoading}
            />
          </div>

          {/* Pending Tools for Approval */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-blue-400">
                🛠 Pending Tool Submissions
              </h3>
              <m.button
                onClick={fetchPending}
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  '🔄'
                )}{' '}
                Refresh
              </m.button>
            </div>
            {isLoading && (
              <p className="text-gray-300">Loading...</p>
            )}
            {!isLoading && pendingTools.length === 0 && (
              <p className="text-gray-400">No pending tools</p>
            )}
            <div className="space-y-4">
              {pendingTools.map((tool) => (
                <div
                  key={tool._id}
                  className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg flex items-start justify-between gap-4"
                >
                  <div className="flex-1">
                    <h4 className="font-bold text-white">
                      {tool.name}
                    </h4>
                    <p className="text-gray-300 text-sm">
                      {tool.description}
                    </p>
                    {tool.url && (
                      <p className="text-xs text-blue-400 mt-1">
                        URL: {tool.url}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Submitted by:{' '}
                      {tool.submittedBy
                        ? `${tool.submittedBy.username} (${tool.submittedBy.email})`
                        : 'Anonymous user'}
                    </p>
                    {tool.snapshotUrl && (
                      <p className="text-xs text-gray-400 mt-1">
                        <a
                          href={`${API_URL}${tool.snapshotUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          View snapshot
                        </a>
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <button
                      onClick={() => {
                        setEditingTool(tool);
                        setEditForm({
                          name: tool.name,
                          description: tool.description,
                          url: tool.url,
                          category: tool.category,
                          pricing: tool.pricing || 'free',
                          badge: tool.badge || '',
                          isNew: tool.isNew || false,
                        });
                      }}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={async () => {
                        try {
                          setIsLoading(true);
                          const res = await api.post(
                            `/api/tools/${tool._id}/approve`
                          );
                          setMessage('Tool approved');
                          setMessageType('success');
                          fetchPending();
                        } catch (err) {
                          console.error(err);
                          setMessage('Network error');
                          setMessageType('error');
                        } finally {
                          setIsLoading(false);
                          setTimeout(
                            () => setMessage(''),
                            4000
                          );
                        }
                      }}
                      className="px-3 py-2 bg-green-600 rounded text-sm"
                    >
                      Approve
                    </button>

                    <button
                      onClick={async () => {
                        try {
                          setIsLoading(true);
                          const res = await api.post(
                            `/api/tools/${tool._id}/reject`
                          );
                          setMessage('Tool rejected');
                          setMessageType('success');
                          fetchPending();
                        } catch (err) {
                          console.error(err);
                          setMessage('Network error');
                          setMessageType('error');
                        } finally {
                          setIsLoading(false);
                          setTimeout(
                            () => setMessage(''),
                            4000
                          );
                        }
                      }}
                      className="px-3 py-2 bg-red-600 rounded text-sm"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-12 p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
            <h3 className="text-lg font-semibold mb-4 text-blue-400">
              📋 How to Use:
            </h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                • <strong>New Tool Newsletter:</strong> Use this when
                you add a new AI tool to send notifications to all
                subscribers
              </li>
              <li>
                • <strong>Custom Newsletter:</strong> Send custom
                content, announcements, or updates to all subscribers
              </li>
              <li>
                • Make sure your backend is running and the API URL is
                configured correctly
              </li>
              <li>
                • All emails will be sent to current newsletter
                subscribers automatically
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Edit Tool Modal */}
      {editingTool && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Edit Tool: {editingTool.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={editForm.description || ''}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      description: e.target.value,
                    })
                  }
                  rows="3"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  URL
                </label>
                <input
                  type="url"
                  value={editForm.url || ''}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      url: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={editForm.category || ''}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      category: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                >
                  <option value="">Select Category</option>
                  <option value="chatbots">Chatbots</option>
                  <option value="image-generators">Image Generators</option>
                  <option value="music-generators">Music Generators</option>
                  <option value="video-generators">Video Generators</option>
                  <option value="writing-tools">Writing Tools</option>
                  <option value="ai-coding-assistants">AI Coding Assistants</option>
                  <option value="voice-tools">Voice/Audio Tools</option>
                  <option value="data-analysis">Data Analysis</option>
                  <option value="marketing-tools">Marketing Tools</option>
                  <option value="email-assistance">Email Assistance</option>
                  <option value="presentation-tools">Presentation Tools</option>
                  <option value="website-builders">Website Builders</option>
                  <option value="ai-diagrams">AI Diagrams</option>
                  <option value="data-visualization">Data Visualization</option>
                  <option value="ai-scheduling">AI Scheduling</option>
                  <option value="meeting-notes">Meeting Notes</option>
                  <option value="spreadsheet-tools">Spreadsheet Tools</option>
                  <option value="utility-tools">Utility Tools</option>
                  <option value="gaming-tools">Gaming Tools</option>
                  <option value="short-clippers">Short Clippers</option>
                  <option value="text-humanizer-ai">Text Humanizer AI</option>
                  <option value="faceless-video">Faceless Video</option>
                  <option value="portfolio">Portfolio</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pricing
                </label>
                <select
                  value={editForm.pricing || 'free'}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      pricing: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                >
                  <option value="free">Free</option>
                  <option value="freemium">Freemium</option>
                  <option value="paid">Paid</option>
                  <option value="open-source">Open Source</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Badge (optional)
                </label>
                <select
                  value={editForm.badge || ''}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      badge: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                >
                  <option value="">No Badge</option>
                  <option value="Recommended">Recommended</option>
                  <option value="Trending">Trending</option>
                  <option value="Popular">Popular</option>
                  <option value="Editor's Choice">Editor's Choice</option>
                  <option value="Featured">Featured</option>
                  <option value="New">New</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editForm.isNew || false}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      isNew: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-300">
                  Mark as New
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Update Snapshot Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setEditSnapshot(e.target.files[0])
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                />
                {editingTool.snapshotUrl && (
                  <p className="text-xs text-gray-400 mt-2">
                    Current:{' '}
                    <a
                      href={`${API_URL}${editingTool.snapshotUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      View snapshot
                    </a>
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleEditTool}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setEditingTool(null);
                  setEditForm({});
                  setEditSnapshot(null);
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
              >
                Cancel
              </button>
            </div>
          </m.div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
