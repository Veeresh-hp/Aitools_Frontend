import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AddTool = ({ historyProp }) => {
  const [form, setForm] = useState({
    name: '',
    shortDescription: '',
    description: '',
    url: '',
    category: '',
    pricing: 'free',
    hashtags: ''
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [customCategory, setCustomCategory] = useState('');

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/categories');
        const fetchedCategories = res.data.map(c => ({ id: c.slug, name: c.name }));
        setCategories([
          ...fetchedCategories,
          { id: 'custom', name: '➕ Add New Category' }
        ]);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      let snapshotUrl = '';
      if (file) {
        const formData = new FormData();
        formData.append('snapshot', file);
        const uploadRes = await api.post('/api/tools/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        snapshotUrl = uploadRes.data.url;
      }

      let finalCategory = form.category;
      if (form.category === 'custom') {
        const catRes = await api.post('/api/categories/request', { name: customCategory });
        finalCategory = catRes.data.category.slug;
      }

      const toolData = {
        ...form,
        category: finalCategory,
        snapshotUrl,
        hashtags: form.hashtags ? form.hashtags.split(/[\s,]+/).filter(tag => tag.trim() !== '') : []
      };

      await api.post('/api/tools/submit', toolData);
      setMessage('✅ Tool submitted successfully! It will be reviewed by an admin.');
      setForm({ name: '', shortDescription: '', description: '', url: '', category: '', pricing: 'free', hashtags: '' });
      setFile(null);
      setCustomCategory('');
    } catch (err) {
      console.error('Submit error:', err);
      setMessage(err.response?.data?.error || err.message || 'Failed to submit tool');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background gradient and effects */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1d3a] via-[#252847] to-[#1a1d3a]" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-40"
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL || ''}/Images/home-bg.jpg)`,
            backgroundBlendMode: 'soft-light',
            animation: 'subtle-zoom 30s ease-in-out infinite'
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-cyan-600/15 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
          backgroundSize: '50px 50px'
        }} />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-float-medium" style={{ animationDelay: '1s' }} />
        <div className="absolute top-2/3 left-2/3 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl animate-float-fast" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-pink-600/8 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-orange-600/8 rounded-full blur-3xl animate-pulse-glow-slow" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Content container */}
      <div className="w-full max-w-2xl relative z-10">
        <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">
          <div className="mb-2">
            <div className="absolute left-8 top-8 w-1 h-14 bg-gradient-to-b from-blue-500 via-purple-500 to-transparent rounded-full" />
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">Submit a New AI Tool</h2>
          </div>

          <p className="text-gray-300 text-sm mb-6">
            {isLoggedIn
              ? "🚀 Share your favorite AI tool with the community!"
              : "🚀 Anyone can submit! Share your favorite AI tool with the community (no login required)"}
          </p>

          {message && (
            <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${message.includes('successfully') ? 'bg-green-500/20 border border-green-500/50 text-green-300' : 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-300'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Tool name (e.g., ChatGPT, Midjourney)" className="w-full px-4 py-3 rounded-lg bg-gray-700/40 border border-white/20 text-white placeholder-gray-400 focus:bg-gray-700/60 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all" />

            <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} required placeholder="Short description (for tool card - max 150 chars)" rows={2} maxLength={150} className="w-full px-4 py-3 rounded-lg bg-gray-700/40 border border-white/20 text-white placeholder-gray-400 focus:bg-gray-700/60 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all" />

            <textarea name="description" value={form.description} onChange={handleChange} required placeholder="Long description (detailed explanation for tool page)" rows={5} className="w-full px-4 py-3 rounded-lg bg-gray-700/40 border border-white/20 text-white placeholder-gray-400 focus:bg-gray-700/60 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all" />

            <input name="url" value={form.url} onChange={handleChange} required placeholder="Tool URL (required, e.g., https://example.com)" className="w-full px-4 py-3 rounded-lg bg-gray-700/40 border border-white/20 text-white placeholder-gray-400 focus:bg-gray-700/60 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all" />

            <div>
              <label className="text-sm font-semibold text-gray-300 mb-2 block">Hashtags (optional)</label>
              <input
                name="hashtags"
                value={form.hashtags}
                onChange={handleChange}
                placeholder="Add hashtags (e.g., #AI #Design)"
                className="w-full px-4 py-3 rounded-lg bg-gray-700/40 border border-white/20 text-white placeholder-gray-400 focus:bg-gray-700/60 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {['#AI', '#Productivity', '#Design', '#Coding', '#Writing', '#Marketing', '#Video', '#Audio'].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, hashtags: prev.hashtags ? `${prev.hashtags} ${tag}` : tag }))}
                    className="px-3 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-300 mb-2 block">Select Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-700/40 border border-white/20 text-white focus:bg-gray-700/60 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="">-- Choose a category --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-300 mb-2 block">Pricing Model *</label>
              <select
                name="pricing"
                value={form.pricing}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-700/40 border border-white/20 text-white focus:bg-gray-700/60 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="free">Free</option>
                <option value="freemium">Freemium</option>
                <option value="paid">Paid</option>
                <option value="free-trial">Free Trial</option>
                <option value="contact">Contact for Pricing</option>
              </select>
            </div>

            {form.category === 'custom' && (
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <label className="text-sm font-semibold text-blue-300 mb-2 block">New Category Name *</label>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  required
                  placeholder="Enter new category name"
                  className="w-full px-4 py-3 rounded-lg bg-gray-700/40 border border-white/20 text-white placeholder-gray-400 focus:border-blue-500/50 transition-all"
                />
                <p className="text-xs text-blue-300/70 mt-2">✨ This will create a new category section</p>
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-gray-300 mb-2 block">Application screenshot (required)</label>
              <div className="relative">
                <input type="file" accept="image/*" onChange={handleFile} required className="w-full mt-2 text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600/30 file:text-blue-300 hover:file:bg-blue-600/40 transition-all cursor-pointer" />
              </div>
              <p className="text-xs text-gray-400 mt-2">📸 PNG, JPG, or GIF (max 5MB)</p>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95">
              {isSubmitting ? '⏳ Submitting...' : '✨ Submit Tool for Review'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-gray-400 text-center">
              ✅ Your submission will be reviewed by admins before appearing publicly
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes subtle-zoom {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-30px) translateX(15px); }
          66% { transform: translateY(20px) translateX(-15px); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-25px) translateX(-20px); }
          75% { transform: translateY(25px) translateX(20px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-35px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
        @keyframes pulse-glow-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.15); }
        }
        @keyframes slide-right {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(40px); }
        }
        @keyframes slide-left {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(-40px); }
        }
        @keyframes float-particle {
          0% { transform: translateY(0px) translateX(0px); opacity: 1; }
          50% { transform: translateY(-60px) translateX(30px); opacity: 0.7; }
          100% { transform: translateY(-120px) translateX(60px); opacity: 0; }
        }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 10s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 6s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }
        .animate-pulse-glow-slow { animation: pulse-glow-slow 5s ease-in-out infinite; }
        .animate-float-particle { animation: float-particle 6s ease-out infinite; }
      `}</style>
    </div>
  );
};

export default AddTool;