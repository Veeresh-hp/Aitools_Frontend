import React, { useState } from 'react';
import { FaNewspaper, FaPaperPlane, FaSpinner, FaTools } from 'react-icons/fa';
import { motion as m } from 'framer-motion';

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [pendingTools, setPendingTools] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
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

      const res = await fetch(`${API_URL}/api/tools/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      
      if (res.ok) {
        setPendingTools(json.tools || []);
        setMessage(json.tools.length > 0 ? `✅ Loaded ${json.tools.length} pending tool(s)` : 'No pending tools');
        setMessageType('success');
      } else {
        setMessage(`❌ Failed: ${json.error || res.statusText}. Status: ${res.status}`);
        setMessageType('error');
      }
    } catch (err) {
      console.error('Fetch pending tools error:', err);
      setMessage(`❌ Network error: ${err.message}. Check if backend is running on ${API_URL}`);
      setMessageType('error');
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(''), 8000);
    }
  };

  React.useEffect(() => { fetchPending(); }, []);


  // Send newsletter for new tool
  const sendNewToolNewsletter = async (toolData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/newsletter/send-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolData: {
            name: toolData.name,
            category: toolData.category,
            description: toolData.description,
            url: toolData.url || process.env.REACT_APP_FRONTEND_URL
          }
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setMessage(`✅ Newsletter sent successfully: ${result.message}`);
        setMessageType('success');
      } else {
        setMessage(`❌ Failed to send newsletter: ${result.error}`);
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
      const response = await fetch(`${API_URL}/api/newsletter/send-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: subject,
          content: htmlContent
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setMessage(`✅ Custom newsletter sent: ${result.message}`);
        setMessageType('success');
      } else {
        setMessage(`❌ Failed to send newsletter: ${result.error}`);
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

  return (
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
            <h3 className="text-xl font-semibold text-blue-400">🛠 Pending Tool Submissions</h3>
            <m.button
              onClick={fetchPending}
              disabled={isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : '🔄'} Refresh
            </m.button>
          </div>
          {isLoading && <p className="text-gray-300">Loading...</p>}
          {!isLoading && pendingTools.length === 0 && <p className="text-gray-400">No pending tools</p>}
          <div className="space-y-4">
            {pendingTools.map((tool) => (
              <div key={tool._id} className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-white">{tool.name}</h4>
                  <p className="text-gray-300 text-sm">{tool.description}</p>
                  {tool.url && <p className="text-xs text-blue-400 mt-1">URL: {tool.url}</p>}
                  <p className="text-xs text-gray-400 mt-1">
                    Submitted by: {tool.submittedBy ? `${tool.submittedBy.username} (${tool.submittedBy.email})` : 'Anonymous user'}
                  </p>
                  {tool.snapshotUrl && (
                    <p className="text-xs text-gray-400">
                      <a href={`${API_URL}${tool.snapshotUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        View snapshot
                      </a>
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={async () => {
                    try {
                      setIsLoading(true);
                      const res = await fetch(`${API_URL}/api/tools/${tool._id}/approve`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
                      const json = await res.json();
                      if (res.ok) { setMessage('Tool approved'); fetchPending(); }
                      else setMessage(json.error || 'Failed to approve');
                    } catch (err) { console.error(err); setMessage('Network error'); }
                    finally { setIsLoading(false); setTimeout(() => setMessage(''), 4000); }
                  }} className="px-3 py-2 bg-green-600 rounded text-sm">Approve</button>

                  <button onClick={async () => {
                    try {
                      setIsLoading(true);
                      const res = await fetch(`${API_URL}/api/tools/${tool._id}/reject`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
                      const json = await res.json();
                      if (res.ok) { setMessage('Tool rejected'); fetchPending(); }
                      else setMessage(json.error || 'Failed to reject');
                    } catch (err) { console.error(err); setMessage('Network error'); }
                    finally { setIsLoading(false); setTimeout(() => setMessage(''), 4000); }
                  }} className="px-3 py-2 bg-red-600 rounded text-sm">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 p-6 bg-gray-800/50 border border-gray-700 rounded-xl">
          <h3 className="text-lg font-semibold mb-4 text-blue-400">📋 How to Use:</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>• <strong>New Tool Newsletter:</strong> Use this when you add a new AI tool to send notifications to all subscribers</li>
            <li>• <strong>Custom Newsletter:</strong> Send custom content, announcements, or updates to all subscribers</li>
            <li>• Make sure your backend is running and the API URL is configured correctly</li>
            <li>• All emails will be sent to current newsletter subscribers automatically</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Component for sending new tool newsletters
const NewToolCard = ({ onSend, isLoading }) => {
  const [toolData, setToolData] = useState({
    name: '',
    category: '',
    description: '',
    url: ''
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
          onChange={(e) => setToolData({...toolData, name: e.target.value})}
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
          disabled={isLoading}
        />
        
        <input
          type="text"
          placeholder="Category (e.g., AI Writing Tools)"
          value={toolData.category}
          onChange={(e) => setToolData({...toolData, category: e.target.value})}
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
          disabled={isLoading}
        />
        
        <textarea
          placeholder="Tool Description (what it does, key features)"
          value={toolData.description}
          onChange={(e) => setToolData({...toolData, description: e.target.value})}
          rows="3"
          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          required
          disabled={isLoading}
        />
        
        <input
          type="url"
          placeholder="Tool URL (optional)"
          value={toolData.url}
          onChange={(e) => setToolData({...toolData, url: e.target.value})}
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

export default AdminDashboard;