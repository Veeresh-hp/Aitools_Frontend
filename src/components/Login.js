import React, { useState, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

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
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', response.data.email);
      localStorage.setItem('username', response.data.username);
      history.push('/');
      window.location.reload();
    } catch (error) {
      setErrors({ general: error.response?.data?.error || 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!resetEmail || !/\S+@\S+\.\S+/.test(resetEmail)) {
      setResetError('Please enter a valid email');
      return;
    }
    setResetError('');
    setResetMessage('');
    try {
      const response = await axios.post(`${API_URL}/api/auth/forgot-password`, { email: resetEmail });
      setResetMessage(response.data.message);
      setResetEmail('');
    } catch (error) {
      setResetError(error.response?.data?.error || 'Failed to send reset email');
    }
  };

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f7f6fb] to-[#f0eff7] dark:from-gray-800 dark:to-black flex items-center justify-center p-4">
      {/* Animated Background Particles */}
      <Particles
        id="tsparticles-login"
        init={particlesInit}
        className="absolute inset-0 z-0"
        options={{
          background: { color: { value: 'transparent' } },
          fpsLimit: 60,
          particles: {
            number: { value: 40, density: { enable: true, area: 800 } },
            color: { value: ['#f43f5e', '#3b82f6', '#22c55e'] },
            shape: {
              type: ['star', 'polygon'],
              polygon: { nb_sides: 6 },
            },
            opacity: { value: 0.15 },
            size: {
              value: { min: 10, max: 20 },
              animation: { enable: true, speed: 2, minimumValue: 5, sync: false },
            },
            move: {
              enable: true,
              speed: 1,
              direction: 'none',
              random: true,
              straight: false,
              outModes: { default: 'bounce' },
            },
          },
          detectRetina: true,
        }}
      />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md sm:max-w-lg px-4 sm:px-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="font-black text-xl sm:text-2xl text-gray-900 dark:text-white">AI</span>
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-600 rounded-full flex items-center justify-center">
              <i className="fas fa-brain text-white text-xs sm:text-sm"></i>
            </div>
            <span className="font-black text-xl sm:text-2xl text-gray-900 dark:text-white">TOOLS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
          <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mt-2">Sign in to access your AI tools</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-xs sm:text-sm">
              {errors.general}
            </div>
          )}

          {/* Identifier */}
          <div>
            <label htmlFor="identifier" className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              Username or Email
            </label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              className={`w-full px-3 py-3 border rounded-md text-sm sm:text-base text-gray-900 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.identifier ? 'border-red-300 bg-red-50' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Enter your username or email"
            />
            {errors.identifier && <p className="text-red-600 text-xs mt-1">{errors.identifier}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-3 pr-10 border rounded-md text-sm sm:text-base text-gray-900 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-900"
              >
                <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`} />
              </button>
            </div>
            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Options */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-2">
            <label className="flex items-center mb-2 sm:mb-0 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2" />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="text-xs sm:text-sm text-blue-600 hover:underline"
            >
              Forgot password? 😅
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md text-sm sm:text-base disabled:bg-blue-400"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <i className="fas fa-spinner fa-spin mr-2" />
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Password Reset Modal */}
        {showResetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:px-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-sm space-y-4 shadow-2xl transition-all duration-300">
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  Reset Password 🚀
                </h3>
                <button onClick={() => setShowResetModal(false)} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  <i className="fas fa-times" />
                </button>
              </div>
              <form onSubmit={handleResetSubmit} className="space-y-4">
                {resetMessage && <p className="text-green-600 text-xs sm:text-sm">{resetMessage}</p>}
                {resetError && <p className="text-red-600 text-xs sm:text-sm">{resetError}</p>}
                <div>
                  <label htmlFor="reset-email" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    placeholder="Enter your email"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white text-xs sm:text-sm font-semibold py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Send Reset Link 🪄
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Signup Link */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline font-semibold">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
