import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f6fb] to-[#f0eff7] flex items-center justify-center p-4">
      <div className="w-full max-w-md sm:max-w-lg px-4 sm:px-6 bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="font-black text-xl sm:text-2xl text-gray-900">AI</span>
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-600 rounded-full flex items-center justify-center">
              <i className="fas fa-brain text-white text-xs sm:text-sm"></i>
            </div>
            <span className="font-black text-xl sm:text-2xl text-gray-900">TOOLS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 text-xs sm:text-sm mt-2">Sign in to access your AI tools</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-xs sm:text-sm">
              {errors.general}
            </div>
          )}

          <div>
            <label htmlFor="identifier" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              Username or Email
              </label>
              <input
              type="text"
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              className={`w-full px-3 py-3 border rounded-md text-sm sm:text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.identifier ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter your username or email"
            />

            {errors.identifier && <p className="text-red-600 text-xs mt-1">{errors.identifier}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                 className={`w-full px-3 py-3 pr-10 border rounded-md text-sm sm:text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                 errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                 }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-900 focus:outline-none"
                aria-label="Toggle password visibility"
              >
                <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`}></i>
              </button>
            </div>
            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between mt-2">
            <label className="flex items-center mb-2 sm:mb-0 text-xs sm:text-sm text-gray-600">
              <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2" />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => setShowResetModal(true)}
              className="text-xs sm:text-sm text-blue-600 hover:underline"
            >
              Forgot password? <span aria-hidden="true">😅</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md text-sm sm:text-base disabled:bg-blue-400"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {showResetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:px-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-bold">Reset Password <span aria-hidden="true">🚀</span></h3>
                <button onClick={() => setShowResetModal(false)} className="text-gray-600 hover:text-gray-900">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleResetSubmit} className="space-y-4">
                {resetMessage && <p className="text-green-600 text-xs sm:text-sm">{resetMessage}</p>}
                {resetError && <p className="text-red-600 text-xs sm:text-sm">{resetError}</p>}
                <div>
                  <label htmlFor="reset-email" className="block text-xs sm:text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                   className="w-full px-3 py-2 text-xs sm:text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 text-gray-900 bg-white"
                    placeholder="Enter your email"
                  />ray-3
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white text-xs sm:text-sm font-semibold py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Send Reset Link <span aria-hidden="true">🪄</span>
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-600">
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
