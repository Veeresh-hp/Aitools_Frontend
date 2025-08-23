import React, { useState, useEffect } from 'react';
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
  Star,
  TrendingUp,
  Award,
  Target,
  Heart,
  Bookmark,
  Key,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  LogOut,
  History,
  Palette,
  Moon,
  Sun,
  Languages,
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
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
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

  // Default empty profile data
  const defaultProfileData = {
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
  };

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
  }, []);

  const loadUserProfile = () => {
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
  };

  const handleEdit = () => {
    if (!isLoggedIn) {
      setShowSignupPrompt(true);
      return;
    }
    setIsEditing(true);
    setEditForm(profileData);
  };

  const handleSave = async () => {
    if (!isLoggedIn) {
      setShowSignupPrompt(true);
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
      setShowSignupPrompt(true);
      return;
    }
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (preference) => {
    if (!isLoggedIn) {
      setShowSignupPrompt(true);
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
      setShowSignupPrompt(true);
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
      setShowSignupPrompt(true);
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
      setShowSignupPrompt(true);
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
      setShowSignupPrompt(true);
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // If not logged in, show signup prompt immediately
  if (!isLoggedIn) {
    return (
      <LazyMotion features={domAnimation}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Access Your Profile</h2>
            <p className="text-gray-400 mb-8">
              You need to sign up or log in to access your profile and manage your account settings.
            </p>
            <div className="flex gap-4">
              <m.button
                onClick={handleSignupRedirect}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <UserPlus size={18} />
                Sign Up
              </m.button>
              <m.button
                onClick={handleLoginRedirect}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <LogIn size={18} />
                Log In
              </m.button>
            </div>
          </m.div>
        </div>
      </LazyMotion>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <style jsx>{`
          .glass-card { 
            background: rgba(15, 23, 42, 0.8); 
            backdrop-filter: blur(20px); 
            border: 1px solid rgba(255, 255, 255, 0.1); 
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); 
          }
          .glass-input { 
            background: rgba(255, 255, 255, 0.05); 
            border: 1px solid rgba(255, 255, 255, 0.1); 
            backdrop-filter: blur(10px); 
          }
          .glass-input:focus { 
            background: rgba(255, 255, 255, 0.1); 
            border-color: rgba(59, 130, 246, 0.5); 
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.2); 
            outline: none;
          }
          .gradient-text { 
            background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899); 
            -webkit-background-clip: text; 
            -webkit-text-fill-color: transparent; 
            background-clip: text; 
          }
          .stat-card:hover { 
            transform: translateY(-4px); 
            box-shadow: 0 12px 40px rgba(59, 130, 246, 0.2); 
          }
          .tab-active { 
            background: linear-gradient(135deg, #3b82f6, #8b5cf6); 
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3); 
          }
          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
          }
          .scrollbar-thin::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
            border-radius: 3px;
          }
        `}</style>

        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <m.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Success Message */}
            <AnimatePresence>
              {successMessage && (
                <m.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
                >
                  <CheckCircle size={20} />
                  {successMessage}
                </m.div>
              )}
            </AnimatePresence>

            {/* Profile Header Card */}
            <m.div variants={itemVariants} className="glass-card rounded-2xl p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
                <div className="relative">
                  <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1">
                    <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
                      {(isEditing ? editForm.avatar : profileData.avatar) ? (
                        <img 
                          src={isEditing ? editForm.avatar : profileData.avatar} 
                          alt="Profile" 
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <User size={48} className="text-gray-400" />
                      )}
                    </div>
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                      <Camera size={16} />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="flex-1 text-center lg:text-left">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <h2 className="text-3xl lg:text-4xl font-bold">
                        {displayValue(profileData.firstName, 'User')} {displayValue(profileData.lastName, '')}
                      </h2>
                      <p className="text-blue-400 text-lg lg:text-xl">{displayValue(profileData.position, 'No position set')}</p>
                      <p className="text-gray-400">{displayValue(profileData.company, 'No company set')}</p>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center lg:justify-end">
                      {!isEditing ? (
                        <>
                          <m.button
                            onClick={handleEdit}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl flex items-center gap-2 transition-colors"
                          >
                            <Edit3 size={18} />
                            Edit Profile
                          </m.button>
                          <m.button
                            onClick={handleViewHistory}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl flex items-center gap-2 transition-colors"
                          >
                            <History size={18} />
                            View History
                          </m.button>
                        </>
                      ) : (
                        <div className="flex gap-2">
                          <m.button
                            onClick={handleSave}
                            disabled={isLoading}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-green-600 hover:bg-green-700 px-4 py-3 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
                          >
                            {isLoading ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Save size={18} />
                            )}
                            {isLoading ? 'Saving...' : 'Save'}
                          </m.button>
                          <m.button
                            onClick={handleCancel}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gray-600 hover:bg-gray-700 px-4 py-3 rounded-xl flex items-center gap-2 transition-colors"
                          >
                            <X size={18} />
                            Cancel
                          </m.button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </m.div>
            
            {/* Header */}
            <m.div variants={itemVariants} className="text-center mt-8">
              <h1 className="text-4xl lg:text-5xl font-bold gradient-text mb-2">User Profile</h1>
              <p className="text-gray-400 text-lg">Manage your account and preferences</p>
            </m.div>

            {/* Stats Cards */}
            <m.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: 'Tools Used', value: stats.toolsUsed, icon: Target, color: 'from-blue-500 to-cyan-500' },
                { label: 'Favorites', value: stats.favoriteTools, icon: Heart, color: 'from-pink-500 to-rose-500' },
                { label: 'Time Saved', value: stats.timesSaved, icon: Clock, color: 'from-green-500 to-emerald-500' },
                { label: 'Account', value: stats.accountType, icon: Award, color: 'from-purple-500 to-indigo-500' },
                { label: 'Streak', value: `${stats.streakDays} days`, icon: TrendingUp, color: 'from-orange-500 to-yellow-500' }
              ].map((stat, index) => (
                <m.div
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className={`stat-card glass-card rounded-xl p-4 transition-all duration-300 cursor-pointer`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center mb-3`}>
                    <stat.icon size={20} className="text-white" />
                  </div>
                  <div className="text-xl lg:text-2xl font-bold">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </m.div>
              ))}
            </m.div>

            {/* Tab Navigation */}
            <m.div variants={itemVariants} className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {tabs.map((tab) => (
                <m.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 ${
                    activeTab === tab.id 
                      ? 'tab-active text-white' 
                      : 'glass-card hover:bg-white/10 text-gray-300'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </m.button>
              ))}
            </m.div>

            {/* Tab Content */}
            <m.div variants={itemVariants} className="glass-card rounded-2xl p-6 lg:p-8 min-h-[600px]">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <User size={24} />
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl glass-input text-white transition-all"
                          placeholder="Enter your first name"
                        />
                      ) : (
                        <div className="px-4 py-3 rounded-xl glass-input">
                          {displayValue(profileData.firstName, 'Not provided')}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl glass-input text-white transition-all"
                          placeholder="Enter your last name"
                        />
                      ) : (
                        <div className="px-4 py-3 rounded-xl glass-input">
                          {displayValue(profileData.lastName, 'Not provided')}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Mail size={16} />
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl glass-input text-white transition-all"
                          placeholder="Enter your email address"
                        />
                      ) : (
                        <div className="px-4 py-3 rounded-xl glass-input">
                          {displayValue(profileData.email, 'Not provided')}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Phone size={16} />
                        Phone
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl glass-input text-white transition-all"
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <div className="px-4 py-3 rounded-xl glass-input">
                          {displayValue(profileData.phone, 'Not provided')}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <MapPin size={16} />
                        Location
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl glass-input text-white transition-all"
                          placeholder="Enter your location"
                        />
                      ) : (
                        <div className="px-4 py-3 rounded-xl glass-input">
                          {displayValue(profileData.location, 'Not provided')}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Globe size={16} />
                        Website
                      </label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={editForm.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl glass-input text-white transition-all"
                          placeholder="Enter your website URL"
                        />
                      ) : (
                        <div className="px-4 py-3 rounded-xl glass-input">
                          {profileData.website && profileData.website.trim() !== '' ? (
                            <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                              {profileData.website}
                            </a>
                          ) : (
                            'Not provided'
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Briefcase size={16} />
                        Company
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl glass-input text-white transition-all"
                          placeholder="Enter your company"
                        />
                      ) : (
                        <div className="px-4 py-3 rounded-xl glass-input">
                          {displayValue(profileData.company, 'Not provided')}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Position</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.position}
                          onChange={(e) => handleInputChange('position', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl glass-input text-white transition-all"
                          placeholder="Enter your job position"
                        />
                      ) : (
                        <div className="px-4 py-3 rounded-xl glass-input">
                          {displayValue(profileData.position, 'Not provided')}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    {isEditing ? (
                      <textarea
                        value={editForm.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl glass-input text-white transition-all resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <div className="px-4 py-3 rounded-xl glass-input min-h-[100px]">
                        {displayValue(profileData.bio, 'No bio provided')}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      Member since {profileData.joinDate ? new Date(profileData.joinDate).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Activity size={24} />
                    Recent Activity
                  </h3>
                  
                  {recentActivity.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-4 p-4 rounded-xl glass-input hover:bg-white/10 transition-all">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <Activity size={18} />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{activity.action}</div>
                            <div className="text-sm text-gray-400">{activity.category}</div>
                          </div>
                          <div className="text-sm text-gray-400">{activity.time}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center">
                        <Activity size={32} className="text-gray-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">No Activity Yet</h4>
                      <p className="text-gray-400 mb-4">Start using AI tools to see your activity here</p>
                    </div>
                  )}
                  
                  <m.button
                    onClick={handleViewHistory}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                  >
                    <History size={18} />
                    View Full History
                  </m.button>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Settings size={24} />
                    Preferences & Settings
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { key: 'notifications', label: 'Email Notifications', description: 'Receive updates about new tools and features', icon: Bell },
                      { key: 'newsletter', label: 'Newsletter Subscription', description: 'Weekly digest of AI tools and trends', icon: Mail },
                      { key: 'publicProfile', label: 'Public Profile', description: 'Make your profile visible to other users', icon: Eye },
                      { key: 'dataSharing', label: 'Data Sharing', description: 'Share anonymous usage data to improve our service', icon: Database }
                    ].map((pref) => (
                      <div key={pref.key} className="flex items-center justify-between p-4 rounded-xl glass-input hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <pref.icon size={18} />
                          </div>
                          <div>
                            <div className="font-medium">{pref.label}</div>
                            <div className="text-sm text-gray-400">{pref.description}</div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isEditing ? editForm.preferences[pref.key] : profileData.preferences[pref.key]}
                            onChange={() => isEditing && handlePreferenceChange(pref.key)}
                            className="sr-only peer"
                            disabled={!isEditing}
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Palette size={20} />
                      Theme & Language
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Language</label>
                        <select 
                          value={editForm.preferences.language}
                          onChange={(e) => isEditing && setEditForm(prev => ({...prev, preferences: {...prev.preferences, language: e.target.value}}))}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 rounded-xl glass-input text-white transition-all"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="zh">Chinese</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Timezone</label>
                        <select 
                          value={editForm.preferences.timezone}
                          onChange={(e) => isEditing && setEditForm(prev => ({...prev, preferences: {...prev.preferences, timezone: e.target.value}}))}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 rounded-xl glass-input text-white transition-all"
                        >
                          <option value="America/Los_Angeles">Pacific Time</option>
                          <option value="America/Denver">Mountain Time</option>
                          <option value="America/Chicago">Central Time</option>
                          <option value="America/New_York">Eastern Time</option>
                          <option value="Europe/London">GMT</option>
                          <option value="Europe/Paris">CET</option>
                          <option value="Asia/Tokyo">JST</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <m.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-2"
                    >
                      <Download size={18} />
                      Export Data
                    </m.button>
                    <m.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2"
                    >
                      <Upload size={18} />
                      Import Data
                    </m.button>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Shield size={24} />
                    Security Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <m.button
                      onClick={() => setShowPasswordModal(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-between p-4 rounded-xl glass-input hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
                          <Lock size={18} />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Change Password</div>
                          <div className="text-sm text-gray-400">Update your account password</div>
                        </div>
                      </div>
                      <div className="text-gray-400">→</div>
                    </m.button>

                    <m.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-between p-4 rounded-xl glass-input hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <Shield size={18} />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Two-Factor Authentication</div>
                          <div className="text-sm text-gray-400">Add an extra layer of security</div>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-green-600 text-xs rounded-full">Enabled</div>
                    </m.button>

                    <m.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-between p-4 rounded-xl glass-input hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                          <Key size={18} />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Login Sessions</div>
                          <div className="text-sm text-gray-400">Manage your active sessions</div>
                        </div>
                      </div>
                      <div className="text-gray-400">→</div>
                    </m.button>

                    <m.button
                      onClick={() => setShowLogoutConfirm(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-between p-4 rounded-xl glass-input hover:bg-yellow-900/20 transition-all text-yellow-400"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center">
                          <LogOut size={18} />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Logout</div>
                          <div className="text-sm text-gray-400">Sign out of your account</div>
                        </div>
                      </div>
                      <div className="text-gray-400">→</div>
                    </m.button>

                    <m.button
                      onClick={() => setShowDeleteConfirm(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-between p-4 rounded-xl glass-input hover:bg-red-900/20 transition-all text-red-400"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                          <Trash2 size={18} />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Delete Account</div>
                          <div className="text-sm text-gray-400">Permanently delete your account and data</div>
                        </div>
                      </div>
                      <div className="text-gray-400">→</div>
                    </m.button>
                  </div>
                </div>
              )}
            </m.div>
          </m.div>
        </div>

        {/* Password Change Modal */}
        <AnimatePresence>
          {showPasswordModal && (
            <>
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={() => setShowPasswordModal(false)}
              />
              <m.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-md w-full">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Lock size={20} />
                      Change Password
                    </h3>
                    <button
                      onClick={() => setShowPasswordModal(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {passwordErrors.general && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm mb-4">
                      {passwordErrors.general}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm(prev => ({...prev, currentPassword: e.target.value}))}
                          className="w-full px-4 py-3 pr-12 rounded-xl glass-input text-white transition-all"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({...prev, current: !prev.current}))}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {passwordErrors.currentPassword && (
                        <p className="text-red-400 text-xs mt-1">{passwordErrors.currentPassword}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm(prev => ({...prev, newPassword: e.target.value}))}
                          className="w-full px-4 py-3 pr-12 rounded-xl glass-input text-white transition-all"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({...prev, new: !prev.new}))}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {passwordErrors.newPassword && (
                        <p className="text-red-400 text-xs mt-1">{passwordErrors.newPassword}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm(prev => ({...prev, confirmPassword: e.target.value}))}
                          className="w-full px-4 py-3 pr-12 rounded-xl glass-input text-white transition-all"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(prev => ({...prev, confirm: !prev.confirm}))}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {passwordErrors.confirmPassword && (
                        <p className="text-red-400 text-xs mt-1">{passwordErrors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <m.button
                      onClick={() => setShowPasswordModal(false)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-xl transition-all"
                    >
                      Cancel
                    </m.button>
                    <m.button
                      onClick={handlePasswordChange}
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Changing...
                        </>
                      ) : (
                        'Change Password'
                      )}
                    </m.button>
                  </div>
                </div>
              </m.div>
            </>
          )}
        </AnimatePresence>

        {/* Delete Account Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <>
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={() => setShowDeleteConfirm(false)}
              />
              <m.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-md w-full">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                      <AlertTriangle size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Delete Account?</h3>
                    <p className="text-gray-400 mb-6 text-sm">
                      This action is permanent and cannot be undone. All your data, history, and preferences will be permanently deleted.
                    </p>
                    <div className="flex gap-3">
                      <m.button
                        onClick={() => setShowDeleteConfirm(false)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-xl transition-all"
                      >
                        Cancel
                      </m.button>
                      <m.button
                        onClick={handleDeleteAccount}
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          'Delete Account'
                        )}
                      </m.button>
                    </div>
                  </div>
                </div>
              </m.div>
            </>
          )}
        </AnimatePresence>

        {/* Logout Confirmation Modal */}
        <AnimatePresence>
          {showLogoutConfirm && (
            <>
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                onClick={() => setShowLogoutConfirm(false)}
              />
              <m.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-md w-full">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center">
                      <LogOut size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Logout?</h3>
                    <p className="text-gray-400 mb-6 text-sm">
                      Are you sure you want to sign out of your account?
                    </p>
                    <div className="flex gap-3">
                      <m.button
                        onClick={() => setShowLogoutConfirm(false)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-xl transition-all"
                      >
                        Cancel
                      </m.button>
                      <m.button
                        onClick={handleLogout}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-700 hover:from-yellow-700 hover:to-orange-800 text-white font-semibold py-3 px-4 rounded-xl transition-all"
                      >
                        Logout
                      </m.button>
                    </div>
                  </div>
                </div>
              </m.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
};

export default UserProfile;