import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { motion as m } from 'framer-motion';
import { Eye, EyeOff, Loader2, Rocket, Mail, User, Lock, Brain, Sparkles } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const history = useHistory();
  const API_URL = process.env.REACT_APP_API_URL || 'https://ai-tools-hub-backend-u2v6.onrender.com';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.username) newErrors.username = 'Username is required';
    else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/signup`, formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', formData.email);
      history.push('/');
      window.location.reload();
    } catch (error) {
      setErrors({
        general: error.response?.data?.error || 'Signup failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const glowVariants = {
    rest: { opacity: 0, scale: 1 },
    hover: { opacity: 0.8, scale: 1.03 },
    focus: { opacity: 1, scale: 1.03 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };
  
  const sideInfoVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        delay: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
      </div>

      {/* Floating Animation Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <m.div
            key={i}
            className="absolute w-20 h-20 rounded-full border border-white/10"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              rotate: 360,
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-16">
        <m.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16"
        >
          
          {/* LEFT COLUMN: Signup Card */}
          <div className="relative w-full max-w-md">
            {/* NEW: Outer glow effect from Login component */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-3xl blur-xl -z-10" />
            
            <m.div
              // UPDATED: Classes to match the darker theme
              className="relative bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-8"
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="relative z-10">
                {/* Header */}
                <m.div variants={itemVariants} className="text-center mb-8">
                  <m.div 
                    className="flex items-center justify-center space-x-3 mb-6"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="font-black text-2xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">AI</span>
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <Brain className="text-white w-5 h-5" />
                    </div>
                    <span className="font-black text-2xl bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">TOOLS</span>
                  </m.div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">Join the Future</h2>
                  <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                    Create your account and unlock powerful AI tools <Sparkles className="w-4 h-4 text-yellow-400" />
                  </p>
                </m.div>

                {/* General Error */}
                {errors.general && (
                  <m.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm mb-6"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      {errors.general}
                    </div>
                  </m.div>
                )}

                {/* Signup Form */}
                <form onSubmit={handleSignup} className="space-y-6">
                  {/* Email Field */}
                  <m.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <Mail className="text-blue-400 w-4 h-4" /> Email Address
                    </label>
                    <m.div initial="rest" whileHover="hover" whileFocus="focus" animate="rest" className="relative">
                      <m.div variants={glowVariants} transition={{ duration: 0.3 }} className="absolute inset-0 bg-gradient-to-r from-blue-500/80 to-purple-500/80 rounded-xl blur-md pointer-events-none" />
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className={`relative w-full px-4 py-3 bg-white/5 border rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-500 transition-all duration-300 backdrop-blur-sm outline-none ${ errors.email ? 'border-red-500/50' : 'border-white/10' }`} placeholder="Enter your email address" />
                      {errors.email && ( <m.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-2 flex items-center gap-1"> <div className="w-1 h-1 bg-red-400 rounded-full" /> {errors.email} </m.p> )}
                    </m.div>
                  </m.div>

                  {/* Username Field */}
                  <m.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <User className="text-green-400 w-4 h-4" /> Username
                    </label>
                    <m.div initial="rest" whileHover="hover" whileFocus="focus" animate="rest" className="relative">
                      <m.div variants={glowVariants} transition={{ duration: 0.3 }} className="absolute inset-0 bg-gradient-to-r from-green-500/80 to-teal-500/80 rounded-xl blur-md pointer-events-none" />
                      <input type="text" name="username" value={formData.username} onChange={handleChange} className={`relative w-full px-4 py-3 bg-white/5 border rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-white placeholder-gray-500 transition-all duration-300 backdrop-blur-sm outline-none ${ errors.username ? 'border-red-500/50' : 'border-white/10' }`} placeholder="Choose a unique username" />
                      {errors.username && ( <m.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-2 flex items-center gap-1"> <div className="w-1 h-1 bg-red-400 rounded-full" /> {errors.username} </m.p> )}
                    </m.div>
                  </m.div>

                  {/* Password Field */}
                  <m.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <Lock className="text-purple-400 w-4 h-4" /> Password
                    </label>
                    <m.div initial="rest" whileHover="hover" whileFocus="focus" animate="rest" className="relative">
                      <m.div variants={glowVariants} transition={{ duration: 0.3 }} className="absolute inset-0 bg-gradient-to-r from-purple-500/80 to-pink-500/80 rounded-xl blur-md pointer-events-none" />
                      <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} className={`relative w-full px-4 py-3 pr-12 bg-white/5 border rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-gray-500 transition-all duration-300 backdrop-blur-sm outline-none ${ errors.password ? 'border-red-500/50' : 'border-white/10' }`} placeholder="Create a secure password" />
                      <m.button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors z-10" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </m.button>
                      {errors.password && ( <m.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-2 flex items-center gap-1"> <div className="w-1 h-1 bg-red-400 rounded-full" /> {errors.password} </m.p> )}
                    </m.div>
                  </m.div>

                  {/* Confirm Password Field */}
                  <m.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <Lock className="text-pink-400 w-4 h-4" /> Confirm Password
                    </label>
                    <m.div initial="rest" whileHover="hover" whileFocus="focus" animate="rest" className="relative">
                      <m.div variants={glowVariants} transition={{ duration: 0.3 }} className="absolute inset-0 bg-gradient-to-r from-pink-500/80 to-red-500/80 rounded-xl blur-md pointer-events-none" />
                      <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={`relative w-full px-4 py-3 pr-12 bg-white/5 border rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 text-white placeholder-gray-500 transition-all duration-300 backdrop-blur-sm outline-none ${ errors.confirmPassword ? 'border-red-500/50' : 'border-white/10' }`} placeholder="Confirm your password" />
                      <m.button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors z-10" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </m.button>
                      {errors.confirmPassword && ( <m.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-2 flex items-center gap-1"> <div className="w-1 h-1 bg-red-400 rounded-full" /> {errors.confirmPassword} </m.p> )}
                    </m.div>
                  </m.div>

                  {/* Submit Button */}
                  <m.div variants={itemVariants}>
                    <m.button type="submit" disabled={isLoading} className="group relative w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed" whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -2 }} whileTap={{ scale: isLoading ? 1 : 0.98 }}>
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isLoading ? ( <> <Loader2 className="w-5 h-5 animate-spin" /> Creating Account... </> ) : ( <> <Rocket className="w-5 h-5" /> Create Account </> )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </m.button>
                  </m.div>
                </form>

                {/* Login Link */}
                <m.div variants={itemVariants} className="text-center mt-8">
                  <p className="text-gray-400 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-400 hover:text-purple-400 font-semibold transition-colors duration-200 hover:underline">
                      Sign in here
                    </Link>
                  </p>
                </m.div>
              </div>
            </m.div>
          </div>

          {/* RIGHT COLUMN: Extra Info */}
          <m.div 
            variants={sideInfoVariants}
            className="w-full max-w-md lg:max-w-sm text-center lg:text-left"
          >
            <div className="p-6 bg-black/20 rounded-2xl border border-white/10 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center lg:justify-start gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                What you'll get:
              </h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                  <span>Access to 50+ premium AI tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0" />
                  <span>Personalized tool recommendations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0" />
                  <span>Priority customer support</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-pink-400 rounded-full flex-shrink-0" />
                  <span>Early access to new features</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center lg:text-left mt-8">
              <p className="text-xs text-gray-500">
                By creating an account, you agree to our{' '}
                <button className="text-blue-400 hover:underline">Terms of Service</button>
                {' '}and{' '}
                <button className="text-blue-400 hover:underline">Privacy Policy</button>
              </p>
            </div>
          </m.div>

        </m.div>
      </div>
    </div>
  );
};

export default Signup;