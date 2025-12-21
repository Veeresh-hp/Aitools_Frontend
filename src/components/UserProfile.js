import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Globe,
  Camera,
  Edit3,
  Save,
  Shield,
  Bell,
  Trash2,
  Settings,
  Activity,
  Clock,
  TrendingUp,
  Heart,
  AlertTriangle,
  CheckCircle,
  LogOut,
  Lock,
  Target,
  Linkedin,
  Twitter,
  Github
} from 'lucide-react';
import DashboardBackground from './DashboardBackground';

const ProfileSkeleton = () => (
  <div className="min-h-screen bg-[#050505] text-gray-100 font-sans p-4 lg:p-12">
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Sidebar Skeleton */}
      <div className="w-full lg:w-80 flex-shrink-0">
         <div className="bg-[#0a0a0a]/80 border border-white/5 rounded-3xl p-6 h-[400px] animate-pulse">
            <div className="flex flex-col items-center border-b border-white/5 pb-8 mb-8">
               <div className="w-24 h-24 rounded-full bg-white/5 mb-4"></div>
               <div className="h-6 w-32 bg-white/5 rounded mb-2"></div>
               <div className="h-4 w-40 bg-white/5 rounded"></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-12 w-full bg-white/5 rounded-xl"></div>
              ))}
            </div>
         </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 bg-[#0a0a0a]/80 border border-white/5 rounded-3xl p-6 lg:p-10 min-h-[600px] animate-pulse">
         <div className="flex justify-between items-center mb-10">
            <div>
               <div className="h-8 w-64 bg-white/5 rounded mb-2"></div>
               <div className="h-4 w-48 bg-white/5 rounded"></div>
            </div>
            <div className="h-10 w-28 bg-white/5 rounded-xl"></div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2 h-32 bg-white/5 rounded-2xl mb-2"></div>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="space-y-2">
                 <div className="h-3 w-20 bg-white/5 rounded"></div>
                 <div className="h-12 w-full bg-white/5 rounded-xl"></div>
              </div>
            ))}
         </div>
      </div>
    </div>
  </div>
);

const UserProfile = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
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
    skills: '',
    social: {
      linkedin: '',
      twitter: '',
      github: ''
    },
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

  const [editForm, setEditForm] = useState(profileData);

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

  // Check authentication status on mount
  useEffect(() => {
    setIsPageLoading(true);
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
      
      // Simulate loading delay for skeleton
      setTimeout(() => {
         setIsPageLoading(false);
      }, 1000); // 1 second delay
    };

    checkAuthStatus();
  }, [defaultProfileData, loadUserProfile]);

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

  const handleSocialChange = (platform, value) => {
    if (!isLoggedIn) return;
    setEditForm(prev => ({
      ...prev,
      social: {
        ...prev.social,
        [platform]: value
      }
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
      // Simulate API call - Replace with actual API call in future
      await new Promise(resolve => setTimeout(resolve, 1500));

      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
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
    // Clear all auth and profile data
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userProfile');
    
    // Or just clear everything to be safe:
    // localStorage.clear(); 
    
    window.location.href = '/login';
  };

  const handleSignupRedirect = () => {
    window.location.href = '/signup';
  };

  const handleLoginRedirect = () => {
    window.location.href = '/login';
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'preferences', label: 'Settings', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield }
  ];

// ... (renderSecurityTab update below)


  // --- Render Helpers ---

  const renderProfileTab = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Personal Information</h2>
          <p className="text-gray-400 text-sm mt-1">Manage your personal details and public profile</p>
        </div>
        {!isEditing ? (
          <m.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleEdit}
            className="px-5 py-2.5 bg-white text-black hover:bg-gray-200 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
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
              className="px-5 py-2.5 bg-transparent hover:bg-white/5 text-white rounded-xl text-sm font-medium transition-colors border border-white/20"
            >
              Cancel
            </m.button>
            <m.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={isLoading}
              className="px-5 py-2.5 bg-white text-black hover:bg-gray-200 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
              {isLoading ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Save size={16} />}
              Save Changes
            </m.button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Avatar Section */}
        <div className="lg:col-span-2 flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-[#111] border border-white/20 shadow-xl">
              {(isEditing ? editForm.avatar : profileData.avatar) ? (
                <img src={isEditing ? editForm.avatar : profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-3xl">
                  {profileData.firstName?.[0]?.toUpperCase() || <User size={40} />}
                </div>
              )}
            </div>
            {isEditing && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full backdrop-blur-sm">
                <Camera size={24} className="text-white drop-shadow-md" />
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Profile Photo</h3>
            <p className="text-gray-400 text-sm max-w-sm mt-1 leading-relaxed">Recommended: Square JPG, PNG, or GIF, at least 1000x1000 pixels.</p>
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
          <div key={field.key} className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">{field.label}</label>
            <div className="relative group">
              {field.icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors">
                  <field.icon size={18} />
                </div>
              )}
              {isEditing ? (
                <input
                  type={field.type}
                  value={editForm[field.key] || ''}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  className={`w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-3.5 ${field.icon ? 'pl-11' : 'pl-4'} pr-4 text-sm text-white focus:outline-none focus:border-white/30 focus:bg-[#222] transition-all placeholder-gray-700`}
                  placeholder={field.placeholder}
                />
              ) : (
                <div className={`w-full bg-white/5 border border-white/5 rounded-xl py-3.5 ${field.icon ? 'pl-11' : 'pl-4'} pr-4 text-sm text-gray-300 min-h-[46px] flex items-center`}>
                  {field.key === 'website' && profileData[field.key] ? (
                    <a href={profileData[field.key]} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 hover:underline decoration-white/20 underline-offset-4 transition-colors">{profileData[field.key]}</a>
                  ) : (
                    profileData[field.key] || <span className="text-gray-600 italic">Not set</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="lg:col-span-2 space-y-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Bio</label>
          {isEditing ? (
            <textarea
              value={editForm.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={4}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/30 focus:bg-[#222] transition-all placeholder-gray-700 resize-none"
              placeholder="Tell us a little about yourself..."
            />
          ) : (
            <div className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-sm text-gray-300 min-h-[100px] whitespace-pre-wrap leading-relaxed">
              {profileData.bio || <span className="text-gray-600 italic">No bio provided.</span>}
            </div>
          )}
        </div>

        {/* Skills Section */}
        <div className="lg:col-span-2 space-y-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Skills & Expertise</label>
          {isEditing ? (
            <textarea
              value={editForm.skills || ''}
              onChange={(e) => handleInputChange('skills', e.target.value)}
              rows={2}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-white/30 focus:bg-[#222] transition-all placeholder-gray-700 resize-none"
              placeholder="e.g. Python, Machine Learning, React, UI/UX Design (comma separated)"
            />
          ) : (
             <div className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-sm text-gray-300 min-h-[60px] flex flex-wrap gap-2">
              {profileData.skills ? (
                profileData.skills.split(',').map((skill, index) => (
                  <span key={index} className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium">
                    {skill.trim()}
                  </span>
                ))
              ) : (
                <span className="text-gray-600 italic">No skills listed.</span>
              )}
            </div>
          )}
        </div>

        {/* Social Links Section */}
         <div className="lg:col-span-2 space-y-4 pt-4 border-t border-white/5">
            <h3 className="text-lg font-bold text-white">Social Profiles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'linkedin.com/in/username' },
                { key: 'twitter', label: 'Twitter', icon: Twitter, placeholder: '@username' },
                { key: 'github', label: 'GitHub', icon: Github, placeholder: 'github.com/username' }
              ].map((social) => (
                <div key={social.key} className="space-y-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">{social.label}</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors">
                      <social.icon size={18} />
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.social?.[social.key] || ''}
                        onChange={(e) => handleSocialChange(social.key, e.target.value)}
                         className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-white/30 focus:bg-[#222] transition-all placeholder-gray-700"
                        placeholder={social.placeholder}
                      />
                    ) : (
                       <div className="w-full bg-white/5 border border-white/5 rounded-xl py-3.5 pl-11 pr-4 text-sm text-gray-300 min-h-[46px] flex items-center overflow-hidden">
                        {profileData.social?.[social.key] ? (
                           <a href={profileData.social[social.key].startsWith('http') ? profileData.social[social.key] : `https://${profileData.social[social.key]}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 truncate transition-colors">
                            {profileData.social[social.key]}
                          </a>
                        ) : (
                          <span className="text-gray-600 italic">Not connected</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
         </div>
      </div>
    </div>
  );

  const renderActivityTab = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Activity & Stats</h2>
        <p className="text-gray-400 text-sm mt-1">Overview of your usage and engagement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tools Used', value: stats.toolsUsed, icon: Target, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Favorites', value: stats.favoriteTools, icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/10' },
          { label: 'Time Saved', value: stats.timesSaved, icon: Clock, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Streak', value: `${stats.streakDays} Days`, icon: TrendingUp, color: 'text-orange-400', bg: 'bg-orange-500/10' }
        ].map((stat, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className="text-sm text-gray-400 font-bold uppercase tracking-wider">{stat.label}</span>
            </div>
            <div className="text-3xl font-black text-white pl-1">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Placeholder for future activity graph or list */}
      <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center py-20 dashed-border relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#1A1A1A] mb-4 border border-white/10 shadow-xl">
          <Activity className="text-gray-500" size={36} />
        </div>
        <h3 className="text-xl font-bold text-white">Recent Activity</h3>
        <p className="text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">Track your tool usage history and interactions here. Coming soon in the next update.</p>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Settings & Preferences</h2>
        <p className="text-gray-400 text-sm mt-1">Customize your experience</p>
      </div>

      <div className="grid gap-6">
        {/* Notifications */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Bell size={20} className="text-white" /> Notifications
          </h3>
          <div className="space-y-4">
            {[
              { id: 'notifications', label: 'Push Notifications', desc: 'Receive updates about new tools and features' },
              { id: 'newsletter', label: 'Email Newsletter', desc: 'Get weekly summaries and AI trends' }
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between group p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div>
                  <div className="text-base font-medium text-gray-200">{item.label}</div>
                  <div className="text-sm text-gray-500">{item.desc}</div>
                </div>
                <button
                  onClick={() => handlePreferenceChange(item.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${editForm.preferences[item.id] ? 'bg-white' : 'bg-[#333]'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${editForm.preferences[item.id] ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Lock size={20} className="text-white" /> Privacy
          </h3>
          <div className="space-y-4">
            {[
              { id: 'publicProfile', label: 'Public Profile', desc: 'Allow others to see your profile and collections' },
              { id: 'dataSharing', label: 'Data Sharing', desc: 'Share usage data to help us improve suggestions' }
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between group p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div>
                  <div className="text-base font-medium text-gray-200">{item.label}</div>
                  <div className="text-sm text-gray-500">{item.desc}</div>
                </div>
                <button
                  onClick={() => handlePreferenceChange(item.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${editForm.preferences[item.id] ? 'bg-purple-600' : 'bg-[#333]'}`}
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
        <h2 className="text-3xl font-bold text-white tracking-tight">Security</h2>
        <p className="text-gray-400 text-sm mt-1">Manage your password and account security</p>
      </div>

      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <h3 className="text-lg font-bold text-white mb-6">Change Password</h3>
        {passwordErrors.general && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle size={16} /> {passwordErrors.general}
          </div>
        )}
        <div className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 pl-1">Current Password</label>
            <input
              type="password"
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-white/30 focus:bg-[#222] transition-colors"
              placeholder="Enter current password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 pl-1">New Password</label>
            <input
              type="password"
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-white/30 focus:bg-[#222] transition-colors"
              placeholder="Enter new password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 pl-1">Confirm New Password</label>
            <input
              type="password"
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-white/30 focus:bg-[#222] transition-colors"
              placeholder="Confirm new password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            />
          </div>
          <button
            onClick={handlePasswordChange}
            className="px-6 py-3 bg-white text-black hover:bg-gray-200 rounded-xl text-sm font-bold transition-all mt-4 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            Update Password
          </button>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
        <h3 className="text-lg font-bold text-red-500 mb-2">Danger Zone</h3>
        <p className="text-gray-400 text-sm mb-6 max-w-lg">Once you delete your account, there is no going back. Please be certain. All your data, including favorite tools and usage history, will be permanently deleted.</p>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
        >
          <Trash2 size={16} /> Delete Account
        </button>
      </div>
    </div>
  );

  // --- Main Render ---

  if (isPageLoading) {
    return <ProfileSkeleton />;
  }

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
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-purple-500/30">
      <DashboardBackground />

      {/* Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-[#FF6B00]/5 rounded-full blur-[150px] pointer-events-none" />

      <style jsx>{`
          ::-webkit-scrollbar { width: 8px; height: 8px; }
          ::-webkit-scrollbar-track { background: #050505; }
          ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
          ::-webkit-scrollbar-thumb:hover { background: #444; }
       `}</style>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12 relative z-10 origin-top" style={{ transform: 'scale(0.9)' }}>
        {/* Success Toast */}
        <AnimatePresence>
          {successMessage && (
            <m.div
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className="fixed top-24 left-1/2 z-50 bg-green-500/20 backdrop-blur-md border border-green-500/30 text-green-400 px-6 py-3 rounded-full shadow-[0_0_20px_rgba(0,255,0,0.1)] flex items-center gap-2 text-sm font-medium"
            >
              <CheckCircle size={18} /> {successMessage}
            </m.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 sticky top-28 h-fit z-20 shadow-2xl">

              {/* User Mini Profile */}
              <div className="text-center mb-8 pb-8 border-b border-white/5">
                <div className="w-24 h-24 mx-auto mb-4 p-[2px] rounded-full bg-gradient-to-br from-white/20 to-transparent">
                  <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center overflow-hidden border border-black">
                    {profileData.avatar ? (
                      <img src={profileData.avatar} alt={profileData.firstName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-bold text-white">{profileData.firstName?.[0]?.toUpperCase()}</span>
                    )}
                  </div>
                </div>
                <h2 className="text-xl font-bold text-white truncate">{profileData.firstName} {profileData.lastName}</h2>
                <p className="text-sm text-gray-500 truncate mt-1">{profileData.email}</p>
                {profileData.position && <span className="inline-block mt-3 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs border border-purple-500/20">{profileData.position}</span>}
              </div>

              {/* Nav Links */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === tab.id
                        ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* Logout */}
              <div className="mt-8 pt-8 border-t border-white/5">
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors group"
                >
                  <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                  Sign Out
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <m.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-[#0a0a0a]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 lg:p-10 min-h-[600px] shadow-2xl"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl max-w-sm w-full shadow-2xl relative overflow-hidden"
            >
              {/* Decorative background effects */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

              <h3 className="text-xl font-bold text-white mb-2">Sign Out?</h3>
              <p className="text-gray-400 mb-8 leading-relaxed text-sm">Are you sure you want to sign out of your account?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors border border-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-red-600/20"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl max-w-sm w-full shadow-2xl relative overflow-hidden"
            >
               {/* Decorative background effects */}
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
               <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-6 border border-red-500/20">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Account?</h3>
              <p className="text-gray-400 mb-8 text-sm leading-relaxed">This action cannot be undone. All your data, saved tools, and preferences will be permanently removed.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors border border-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium transition-colors flex items-center justify-center shadow-lg shadow-red-600/20"
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