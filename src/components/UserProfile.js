import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion as m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Globe,
  Camera,
  Edit3,
  Save,
  X,
  Shield,
  Bell,
  Eye,
  Lock,
  Trash2,
  Settings,
  Activity,
  Clock,
  TrendingUp,
  Award,
  Target,
  Heart,
  Key,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  LogOut,
  History,
  Palette,
  Database,
  Download,
  Upload,
  UserPlus,
  LogIn
} from 'lucide-react';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Default empty profile data - Memoized
  const defaultProfileData = useMemo(() => ({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    company: '',
    position: '',
    website: '',
    joinDate: new Date().toISOString().split('T')[0],
    avatar: null,
    preferences: {
      notifications: true,
      newsletter: true,
      publicProfile: false,
      dataSharing: false,
      darkMode: true,
      language: 'en',
      timezone: 'America/Los_Angeles'
    }
  }), []);

  // Profile data state
  const [profileData, setProfileData] = useState(defaultProfileData);

  const [stats] = useState({
    toolsUsed: 0,
    favoriteTools: 0,
    timesSaved: '0 hours',
    accountType: 'Free',
    streakDays: 0
  });

  const [recentActivity] = useState([]);

  const [editForm, setEditForm] = useState(profileData);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const isLoggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
      const username = localStorage.getItem('username');

      if (token && isLoggedInStatus && username) {
        setIsLoggedIn(true);
        loadUserProfile();
      } else {
        setIsLoggedIn(false);
        setProfileData(defaultProfileData);
        setEditForm(defaultProfileData);
      }
    };

    checkAuthStatus();
  }, [defaultProfileData]); // Removed loadUserProfile from deps to avoid circular dep, it's defined below

  const loadUserProfile = useCallback(() => {
    try {
      // Load from localStorage if user is logged in
      const savedProfile = localStorage.getItem('userProfile');
      const username = localStorage.getItem('username');
      const userEmail = localStorage.getItem('userEmail');

      let loadedProfile = defaultProfileData;

      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        loadedProfile = { ...defaultProfileData, ...parsed };
      }

      // Always use the stored username and email if available
      if (username) {
        loadedProfile.firstName = username;
      }
      if (userEmail) {
        loadedProfile.email = userEmail;
      }

      // Set join date if not already set
      if (!loadedProfile.joinDate) {
        loadedProfile.joinDate = new Date().toISOString().split('T')[0];
      }

      setProfileData(loadedProfile);
      setEditForm(loadedProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfileData(defaultProfileData);
      setEditForm(defaultProfileData);
    }
  }, [defaultProfileData]);

  const handleEdit = () => {
    if (!isLoggedIn) {
      return;
    }
    setIsEditing(true);
    setEditForm(profileData);
  };

  const handleSave = async () => {
    if (!isLoggedIn) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setProfileData(editForm);
      localStorage.setItem('userProfile', JSON.stringify(editForm));

      // Update username and email in localStorage if changed
      if (editForm.firstName) {
        localStorage.setItem('username', editForm.firstName);
      }
      if (editForm.email) {
        localStorage.setItem('userEmail', editForm.email);
      }

      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(profileData);
  };

  const handleInputChange = (field, value) => {
    if (!isLoggedIn) {
      return;
    }
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (preference) => {
    if (!isLoggedIn) {
      return;
    }
    const newPreferences = {
      ...editForm.preferences,
      [preference]: !editForm.preferences[preference]
    };
    setEditForm(prev => ({
      ...prev,
      preferences: newPreferences
    }));
  };

  const handleAvatarUpload = (event) => {
    if (!isLoggedIn) {
      return;
    }
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditForm(prev => ({
          ...prev,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validatePassword = () => {
    const errors = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = async () => {
    if (!isLoggedIn) {
      return;
    }

    if (!validatePassword()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordModal(false);
      setSuccessMessage('Password changed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setPasswordErrors({ general: 'Failed to change password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!isLoggedIn) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear all data
      localStorage.clear();
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.setItem('isLoggedIn', 'false');
    window.location.href = '/login';
  };

  const handleViewHistory = () => {
    if (!isLoggedIn) {
      return;
    }
    window.location.href = '/history';
  };

  const handleSignupRedirect = () => {
    window.location.href = '/signup';
  };

  const handleLoginRedirect = () => {
    window.location.href = '/login';
  };

  const displayValue = (value, placeholder = 'Not provided') => {
    return value && value.trim() !== '' ? value : placeholder;
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'preferences', label: 'Settings', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  // --- Render Helpers ---

  const renderProfileTab = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Personal Information</h2>
          <p className="text-gray-400 text-sm mt-1">Manage your personal details and public profile</p>
        </div>
        {!isEditing ? (
          <m.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleEdit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Edit3 size={16} /> Edit Profile
          </m.button>
        ) : (
          <div className="flex gap-3">
            <m.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors border border-gray-600"
            >
              Cancel
            </m.button>
            <m.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
              Save Changes
            </m.button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Avatar Section */}
        <div className="lg:col-span-2 flex items-center gap-6 p-6 rounded-xl bg-white/5 border border-white/10">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-700 border-2 border-white/20 shadow-xl">
              {(isEditing ? editForm.avatar : profileData.avatar) ? (
                <img src={isEditing ? editForm.avatar : profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-3xl">
                  {profileData.firstName?.[0]?.toUpperCase() || <User size={40} />}
                </div>
              )}
            </div>
            {isEditing && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                <Camera size={24} className="text-white" />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Profile Photo</h3>
            <p className="text-gray-400 text-sm max-w-sm mt-1">Recommended: Square JPG, PNG, or GIF, at least 1000x1000 pixels.</p>
          </div>
        </div>

        {/* Form Fields */}
        {[
          { label: 'First Name', key: 'firstName', type: 'text', placeholder: 'Jane' },
          { label: 'Last Name', key: 'lastName', type: 'text', placeholder: 'Doe' },
          { label: 'Email', key: 'email', type: 'email', icon: Mail },
          { label: 'Phone', key: 'phone', type: 'tel', icon: Phone },
          { label: 'Location', key: 'location', type: 'text', icon: MapPin },
          { label: 'Website', key: 'website', type: 'url', icon: Globe },
          { label: 'Company', key: 'company', type: 'text', icon: Briefcase },
          { label: 'Position', key: 'position', type: 'text', icon: User }
        ].map((field) => (
          <div key={field.key} className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">{field.label}</label>
            <div className="relative group">
              {field.icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors">
                  <field.icon size={16} />
                </div>
              )}
              {isEditing ? (
                <input
                  type={field.type}
                  value={editForm[field.key] || ''}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  className={`w-full bg-gray-900/50 border border-gray-700/50 rounded-lg py-2.5 ${field.icon ? 'pl-10' : 'pl-4'} pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-gray-600`}
                  placeholder={field.placeholder}
                />
              ) : (
                <div className={`w-full bg-gray-800/20 border border-white/5 rounded-lg py-2.5 ${field.icon ? 'pl-10' : 'pl-4'} pr-4 text-sm text-gray-300 min-h-[42px] flex items-center`}>
                  {field.key === 'website' && profileData[field.key] ? (
                    <a href={profileData[field.key]} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{profileData[field.key]}</a>
                  ) : (
                    profileData[field.key] || <span className="text-gray-600 italic">Not set</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="lg:col-span-2 space-y-1.5">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Bio</label>
          {isEditing ? (
            <textarea
              value={editForm.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={4}
              className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg p-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder-gray-600 resize-none"
              placeholder="Tell us a little about yourself..."
            />
          ) : (
            <div className="w-full bg-gray-800/20 border border-white/5 rounded-lg p-4 text-sm text-gray-300 min-h-[100px] whitespace-pre-wrap">
              {profileData.bio || <span className="text-gray-600 italic">No bio provided.</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderActivityTab = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Activity & Stats</h2>
        <p className="text-gray-400 text-sm mt-1">Overview of your usage and engagement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tools Used', value: stats.toolsUsed, icon: Target, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Favorites', value: stats.favoriteTools, icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/10' },
          { label: 'Time Saved', value: stats.timesSaved, icon: Clock, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Streak', value: `${stats.streakDays} Days`, icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-500/10' }
        ].map((stat, i) => (
          <div key={i} className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className="text-sm text-gray-400 font-medium">{stat.label}</span>
            </div>
            <div className="text-2xl font-bold text-white pl-1">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Placeholder for future activity graph or list */}
      <div className="p-8 rounded-xl bg-white/5 border border-white/10 text-center py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
          <Activity className="text-gray-500" size={32} />
        </div>
        <h3 className="text-lg font-medium text-white">Recent Activity</h3>
        <p className="text-gray-500 mt-2 max-w-sm mx-auto">Track your tool usage history and interactions here. Coming soon in the next update.</p>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Settings & Preferences</h2>
        <p className="text-gray-400 text-sm mt-1">Customize your experience</p>
      </div>

      <div className="grid gap-6">
        {/* Notifications */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Bell size={20} className="text-blue-400" /> Notifications
          </h3>
          <div className="space-y-4">
            {[
              { id: 'notifications', label: 'Push Notifications', desc: 'Receive updates about new tools and features' },
              { id: 'newsletter', label: 'Email Newsletter', desc: 'Get weekly summaries and AI trends' }
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <div className="text-base font-medium text-gray-200">{item.label}</div>
                  <div className="text-sm text-gray-500">{item.desc}</div>
                </div>
                <button
                  onClick={() => handlePreferenceChange(item.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${editForm.preferences[item.id] ? 'bg-blue-600' : 'bg-gray-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${editForm.preferences[item.id] ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Lock size={20} className="text-purple-400" /> Privacy
          </h3>
          <div className="space-y-4">
            {[
              { id: 'publicProfile', label: 'Public Profile', desc: 'Allow others to see your profile and collections' },
              { id: 'dataSharing', label: 'Data Sharing', desc: 'Share usage data to help us improve suggestions' }
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <div className="text-base font-medium text-gray-200">{item.label}</div>
                  <div className="text-sm text-gray-500">{item.desc}</div>
                </div>
                <button
                  onClick={() => handlePreferenceChange(item.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${editForm.preferences[item.id] ? 'bg-purple-600' : 'bg-gray-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${editForm.preferences[item.id] ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Security</h2>
        <p className="text-gray-400 text-sm mt-1">Manage your password and account security</p>
      </div>

      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-6">Change Password</h3>
        <div className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Current Password</label>
            <input
              type="password"
              className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">New Password</label>
            <input
              type="password"
              className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Confirm New Password</label>
            <input
              type="password"
              className="w-full bg-gray-900/50 border border-gray-700/50 rounded-lg py-2.5 px-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
              placeholder="Confirm new password"
            />
          </div>
          <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors mt-4">
            Update Password
          </button>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/10">
        <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
        <p className="text-gray-400 text-sm mb-6">Once you delete your account, there is no going back. Please be certain.</p>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Trash2 size={16} /> Delete Account
        </button>
      </div>
    </div>
  );

  // --- Main Render ---

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
        <m.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#111827] border border-gray-800 rounded-2xl p-8 text-center shadow-2xl"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <User size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Welcome to AI Tools Hub</h2>
          <p className="text-gray-400 mb-8">Please sign in to manage your profile and access exclusive features.</p>

          <div className="space-y-3">
            <button onClick={handleLoginRedirect} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-all">
              Sign In
            </button>
            <button onClick={handleSignupRedirect} className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition-all border border-gray-700">
              Create Account
            </button>
          </div>
        </m.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 font-sans selection:bg-blue-500/30">
      <style jsx>{`
          /* Custom scrollbar for the sidebar/content */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          ::-webkit-scrollbar-track {
            background: #111827; 
          }
          ::-webkit-scrollbar-thumb {
            background: #374151; 
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #4b5563; 
          }
       `}</style>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
        {/* Success Toast */}
        <AnimatePresence>
          {successMessage && (
            <m.div
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className="fixed top-6 left-1/2 z-50 bg-green-500/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium"
            >
              <CheckCircle size={18} /> {successMessage}
            </m.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 sticky top-24">

              {/* User Mini Profile */}
              <div className="text-center mb-8 pb-8 border-b border-gray-800">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-[2px]">
                  <div className="w-full h-full rounded-full bg-[#111827] flex items-center justify-center overflow-hidden">
                    {profileData.avatar ? (
                      <img src={profileData.avatar} alt={profileData.firstName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-white">{profileData.firstName?.[0]?.toUpperCase()}</span>
                    )}
                  </div>
                </div>
                <h2 className="text-lg font-bold text-white truncate">{profileData.firstName} {profileData.lastName}</h2>
                <p className="text-sm text-gray-500 truncate">{profileData.email}</p>
                {profileData.position && <p className="text-xs text-blue-400 mt-1">{profileData.position}</p>}
              </div>

              {/* Nav Links */}
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* Logout */}
              <div className="mt-8 pt-8 border-t border-gray-800">
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <m.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#111827] border border-gray-800 rounded-2xl p-6 lg:p-10 min-h-[600px]"
            >
              {activeTab === 'profile' && renderProfileTab()}
              {activeTab === 'activity' && renderActivityTab()}
              {activeTab === 'preferences' && renderSettingsTab()}
              {activeTab === 'security' && renderSecurityTab()}
            </m.div>
          </main>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1f2937] border border-gray-700 p-6 rounded-2xl max-w-sm w-full shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-2">Sign Out?</h3>
              <p className="text-gray-400 mb-6">Are you sure you want to sign out of your account?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1f2937] border border-gray-700 p-6 rounded-2xl max-w-sm w-full shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Account?</h3>
              <p className="text-gray-400 mb-6 text-sm">This action cannot be undone. All your data, saved tools, and preferences will be permanently removed.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Delete Info'}
                </button>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;