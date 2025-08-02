import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { motion as m, LazyMotion, domAnimation } from 'framer-motion';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaTimes, FaSpinner, FaPaperPlane,} from 'react-icons/fa';
import { useLoading } from '../contexts/LoadingContext'; // Import the useLoading hook

// Floating/interactive shapes background component
const floatingShapesConfig = [
  { x: 100, y: 150, s: 40, c: 'bg-blue-400/40' },
  { x: 350, y: 100, s: 32, c: 'bg-purple-400/40' },
  { x: 220, y: 320, s: 30, c: 'bg-pink-300/30' },
  { x: 390, y: 290, s: 26, c: 'bg-white/20' },
  { x: 80, y: 330, s: 20, c: 'bg-yellow-400/30' },
];

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

// Shapes will float slowly back and forth, and can be dragged
const FloatingShapes = () => (
  <div className="pointer-events-none absolute inset-0 z-0">
    {floatingShapesConfig.map((shape, i) => (
      <m.div
        key={i}
        drag
        dragMomentum
        dragElastic={0.7}
        whileTap={{ scale: 1.15, boxShadow: '0 0 20px #fff7' }}
        animate={{
          y: [shape.y, shape.y + randomRange(-15, 20), shape.y], // up-down float
          x: [shape.x, shape.x + randomRange(-15, 30), shape.x], // left-right float
        }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
          duration: randomRange(4, 7),
        }}
        style={{
          width: shape.s,
          height: shape.s,
          left: shape.x,
          top: shape.y,
          zIndex: 1,
        }}
        className={`pointer-events-auto absolute rounded-full shadow-lg ${shape.c} cursor-grab backdrop-blur-[2px]`}
      />
    ))}
  </div>
);

const Login = () => {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetError, setResetError] = useState('');
  const history = useHistory();
  const { showLoader, hideLoader } = useLoading(); // Get the loader functions

  const API_URL = process.env.REACT_APP_API_URL || 'https://ai-tools-hub-backend-u2v6.onrender.com';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.identifier) newErrors.identifier = 'Username or email is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoader();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, formData);
      if (!response.data.user || !response.data.user.username) {
        throw new Error('Username not provided in response');
      }
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', response.data.user.email);
      localStorage.setItem('username', response.data.user.username);
      history.push('/');
      window.location.reload();
    } catch (error) {
      setErrors({
        general:
          error.response?.data?.error ||
          'Login failed. Please check your credentials.',
      });
    } finally {
      setIsLoading(false);
      hideLoader(); // Hide the loader after the request completes
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetMessage('');
    if (!resetEmail || !/\S+@\S+\.\S+/.test(resetEmail)) {
      setResetError('Please enter a valid email address.');
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/api/auth/forgot-password`, { email: resetEmail });
      setResetMessage(response.data.message);
      setResetEmail('');
    } catch (error) {
      setResetError(error.response?.data?.error || 'Failed to send reset email. Please try again.');
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center p-4">
        {/* --- Static gradients/background SVGs --- */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
        </div>
        {/* --- Interactive/Floating shapes --- */}
        <FloatingShapes />

        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl" />
          <div className="relative bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                AI Tools Hub
              </h1>
              <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
              <p className="text-gray-400 text-sm mt-2">Sign in to unlock your potential</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
                  {errors.general}
                </div>
              )}
              <div>
                <label htmlFor="identifier" className="block text-sm font-semibold text-gray-300 mb-2">
                  Username or Email
                </label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    id="identifier"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg text-base text-gray-100 bg-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${
                      errors.identifier ? 'border-red-500/50' : 'border-white/10'
                    }`}
                    placeholder="e.g., ai_explorer"
                  />
                </div>
                {errors.identifier && <p className="text-red-400 text-xs mt-1">{errors.identifier}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3 border rounded-lg text-base text-gray-100 bg-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${
                      errors.password ? 'border-red-500/50' : 'border-white/10'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-500 hover:text-white"
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-300">
                  <input type="checkbox" className="h-4 w-4 text-blue-500 border-gray-600 rounded bg-gray-700 focus:ring-blue-500 mr-2" />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  className="text-sm font-semibold text-blue-400 hover:text-purple-400 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <m.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/30 text-white font-bold py-3 rounded-lg text-base transition-all duration-300 disabled:from-blue-500/50 disabled:to-purple-500/50 disabled:shadow-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </m.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-400 hover:text-purple-400 font-semibold transition-colors">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </m.div>

        {showResetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <m.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full max-w-sm bg-gray-900/80 backdrop-blur-lg border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Reset Password</h3>
                <button onClick={() => setShowResetModal(false)} className="text-gray-500 hover:text-white">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleResetSubmit} className="space-y-4">
                {resetMessage && <p className="text-green-400 text-sm">{resetMessage}</p>}
                {resetError && <p className="text-red-400 text-sm">{resetError}</p>}
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-medium text-gray-300 mb-1">
                    Enter your account email
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-white/20 bg-white/5 text-gray-100 placeholder-gray-500"
                    placeholder="you@example.com"
                  />
                </div>
                <m.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold py-2.5 rounded-lg hover:shadow-md hover:shadow-blue-500/20 transition-shadow"
                >
                  Send Reset Link <FaPaperPlane />
                </m.button>
              </form>
            </m.div>
          </div>
        )}
      </div>
    </LazyMotion>
  );
};

export default Login;
