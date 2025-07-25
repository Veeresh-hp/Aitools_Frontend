import React, { useState, useMemo, useEffect } from 'react';
// --- UPDATED: Using useHistory from React Router v5 ---
import { useHistory, useLocation } from 'react-router-dom';
import { motion as m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import ParallaxTilt from 'react-parallax-tilt';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // --- UPDATED: Using useHistory ---
  const history = useHistory();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  const [init, setInit] = useState(false);
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const passwordStrength = useMemo(() => {
    const password = formData.password;
    let strength = 0;
    if (password.length > 5) strength++;
    if (password.length > 7) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  }, [formData.password]);

  const strengthColor = useMemo(() => {
    switch (passwordStrength) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-blue-500';
      case 5: return 'bg-green-500';
      default: return 'bg-gray-700';
    }
  }, [passwordStrength]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage('');
    setErrors({});
    
    try {
      const response = await axios.post(`${API_URL}/api/auth/reset-password`, {
        token,
        password: formData.password,
      });
      setMessage(response.data.message);
      // --- UPDATED: Using history.push for v5 ---
      setTimeout(() => history.push('/login'), 3000);
    } catch (error) {
      setErrors({
        general: error.response?.data?.error || 'Failed to reset password. The link may have expired.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const particleOptions = useMemo(() => ({
    background: { color: { value: 'transparent' } },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'repulse' },
      },
      modes: {
        repulse: { distance: 80, duration: 0.4 },
      },
    },
    particles: {
      color: { value: '#ffffff' },
      links: { color: '#ffffff', distance: 150, enable: true, opacity: 0.1, width: 1 },
      move: {
        direction: 'none',
        enable: true,
        outModes: { default: 'bounce' },
        random: false,
        speed: 1,
        straight: false,
      },
      number: { density: { enable: true, area: 800 }, value: 50 },
      opacity: { value: 0.2 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  }), []);

  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden flex items-center justify-center px-4">
        {init && <Particles id="tsparticles" options={particleOptions} />}

        <ParallaxTilt
          tiltMaxAngleX={5}
          tiltMaxAngleY={5}
          glareEnable={true}
          glareMaxOpacity={0.1}
          glareColor="#ffffff"
          glarePosition="all"
          className="relative z-10 w-full max-w-md"
        >
          <m.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl" />
              <div className="relative bg-black/30 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-full mb-6 shadow-lg">
                    <span className="text-3xl">🪄</span>
                  </div>
                  <h2 className="text-4xl font-extrabold mb-3">
                    <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      Reset Password
                    </span>
                  </h2>
                  <p className="text-gray-400">Create a new, secure password for your account.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <AnimatePresence>
                    {message && (
                      <m.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div className="bg-green-500/10 border border-green-400/30 text-green-300 px-4 py-3 rounded-xl text-sm flex items-center gap-3">
                          <span className="text-xl">🎉</span>
                          <span className="font-medium">{message}</span>
                        </div>
                      </m.div>
                    )}
                    {errors.general && (
                       <m.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div className="bg-red-500/10 border border-red-400/30 text-red-300 px-4 py-3 rounded-xl text-sm flex items-center gap-3">
                          <span className="text-xl">❌</span>
                          <span className="font-medium">{errors.general}</span>
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="relative">
                    <label htmlFor="password" className="block text-sm font-bold text-white mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-white/5 backdrop-blur-xl border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${errors.password ? 'border-red-400/50 focus:ring-red-500/50' : 'border-white/10 focus:border-blue-500/50 focus:ring-blue-500/50'}`}
                        placeholder="••••••••"
                      />
                       <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xl">{showPassword ? '🙉' : '🙈'}</button>
                    </div>
                    {formData.password.length > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                <m.div className={`h-full ${strengthColor}`} initial={{width: 0}} animate={{width: `${passwordStrength * 20}%`}} transition={{duration: 0.3}} />
                            </div>
                            <span className="text-xs text-gray-400 w-16 text-right">{['', 'Weak', 'Fair', 'Good', 'Strong', 'Secure'][passwordStrength]}</span>
                        </div>
                    )}
                    <AnimatePresence>
                      {errors.password && <m.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-2">⚠️ {errors.password}</m.p>}
                    </AnimatePresence>
                  </div>
                  
                   <div className="relative">
                    <label htmlFor="confirm-password" className="block text-sm font-bold text-white mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-white/5 backdrop-blur-xl border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${errors.confirmPassword ? 'border-red-400/50 focus:ring-red-500/50' : 'border-white/10 focus:border-purple-500/50 focus:ring-purple-500/50'}`}
                        placeholder="••••••••"
                      />
                       <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xl">{showConfirmPassword ? '🙉' : '🙈'}</button>
                    </div>
                     <AnimatePresence>
                        {errors.confirmPassword && <m.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-2">⚠️ {errors.confirmPassword}</m.p>}
                    </AnimatePresence>
                  </div>

                  <m.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }} whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300 disabled:opacity-60"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <m.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 mr-2 border-2 border-white/30 border-t-white rounded-full"/>
                        Resetting...
                      </span>
                    ) : "Reset Password"}
                  </m.button>

                  <m.button
                      type="button"
                      // --- UPDATED: Using history.push for v5 ---
                      onClick={() => history.push('/login')}
                      className="text-center text-gray-400 hover:text-white text-sm transition-colors w-full mt-4"
                  >
                      Back to Login
                  </m.button>
                </form>
              </div>
          </m.div>
        </ParallaxTilt>
      </div>
    </LazyMotion>
  );
};

export default ResetPassword;