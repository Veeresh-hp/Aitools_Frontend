import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { motion as m } from 'framer-motion';
import { Eye, EyeOff, Loader2, Rocket, Mail, User, Lock, Brain, Sparkles } from 'lucide-react';

// This is a background animation component. No changes are needed here.
const InteractiveBackground = () => {
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const animationId = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const particleCount = 80;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.hue = Math.random() * 60 + 200;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        const dx = mousePos.current.x - this.x;
        const dy = mousePos.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const force = (100 - distance) / 100;
          this.vx += dx * force * 0.001;
          this.vy += dy * force * 0.001;
        }

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        this.vx *= 0.99;
        this.vy *= 0.99;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity * 0.1})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = (120 - distance) / 120 * 0.2;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(100, 150, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      drawConnections();
      animationId.current = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
};

// Main Signup component with Google Login integration
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
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  // Create a ref for the Google button container
  const googleButtonRef = useRef(null);

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
      localStorage.setItem('username', response.data.user.username);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', response.data.user.email);
      history.push('/');
      window.location.reload();
    } catch (error) {
      setErrors({
        general: error.response?.data?.error || 'Signup failed. Please try again.',
      });
      console.error('Signup error:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = useCallback(async (credentialResponse) => {
    //     // ADD THIS LINE to print the entire response object
    //   console.log("Google Success Response:", credentialResponse); 


    //  ---- these above and below code will display the google token in console ----


    // // ADD THIS LINE to print just the token string
    // console.log("Your Google ID Token:", credentialResponse.credential); 
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/google-login`, {
        token: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem('username', res.data.user.username);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', res.data.user.email);
      history.push('/');
      window.location.reload();

    } catch (err) {
      console.error("Google login failed:", err);
      setErrors({
        general: err.response?.data?.error || 'Google login failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, history]);

  const handleGoogleError = useCallback(() => {
    console.log("❌ Google Login Failed");
    setErrors({ general: 'Google login failed. Please try again.' });
  }, []);

  useEffect(() => {
    if (!googleClientId) {
      console.error("Google Client ID is missing. Please set REACT_APP_GOOGLE_CLIENT_ID in your .env file.");
      return;
    }

    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleSuccess
      });
      window.google.accounts.id.renderButton(
        googleButtonRef.current,
        { theme: "filled_black", shape: "pill", width: "300" }
      );
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google && googleButtonRef.current) {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleSuccess
          });
          window.google.accounts.id.renderButton(
            googleButtonRef.current,
            { theme: "filled_black", shape: "pill", width: "300" }
          );
        }
      };
      script.onerror = handleGoogleError;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [googleClientId, handleGoogleSuccess, handleGoogleError]);

  // --- Animation Variants (no changes needed) ---
  const glowVariants = {
    rest: { opacity: 0, scale: 1 },
    hover: { opacity: 0.8, scale: 1.03 },
    focus: { opacity: 1, scale: 1.03 }
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.15 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };
  const sideInfoVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden relative">
      <InteractiveBackground />
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-pink-900/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
        {[...Array(8)].map((_, i) => (
          <m.div
            key={i}
            className={`absolute ${i % 2 === 0 ? 'w-16 h-16 rounded-full' : 'w-12 h-12 rotate-45'} border border-white/10`}
            style={{
              background: i % 3 === 0
                ? 'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))'
                : i % 3 === 1
                  ? 'linear-gradient(45deg, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))'
                  : 'linear-gradient(45deg, rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1))'
            }}
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              scale: Math.random() * 0.5 + 0.5,
              rotate: Math.random() * 360,
            }}
            animate={{
              y: [0, -150, 0],
              x: [0, Math.random() * 200 - 100, 0],
              rotate: [0, 360],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 25 + Math.random() * 15,
              repeat: Infinity,
              ease: "easeInOut",
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
          <div className="relative w-full max-w-md">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/40 to-purple-500/40 rounded-3xl blur-xl animate-pulse -z-10" />
            <m.div
              className="relative bg-black/50 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-8"
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="relative z-10">
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

                <form onSubmit={handleSignup} className="space-y-6">
                  <m.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <Mail className="text-blue-400 w-4 h-4" /> Email Address
                    </label>
                    <m.div initial="rest" whileHover="hover" whileFocus="focus" animate="rest" className="relative">
                      <m.div variants={glowVariants} transition={{ duration: 0.3 }} className="absolute inset-0 bg-gradient-to-r from-blue-500/80 to-purple-500/80 rounded-xl blur-md pointer-events-none" />
                      <input type="email" name="email" value={formData.email} onChange={handleChange} autoComplete="email" className={`relative w-full px-4 py-3 bg-white/10 border rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-500 transition-all duration-300 backdrop-blur-sm outline-none ${errors.email ? 'border-red-500/50' : 'border-white/20'}`} placeholder="Enter your email address" />
                      {errors.email && (<m.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-2 flex items-center gap-1"> <div className="w-1 h-1 bg-red-400 rounded-full" /> {errors.email} </m.p>)}
                    </m.div>
                  </m.div>

                  <m.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <User className="text-green-400 w-4 h-4" /> Username
                    </label>
                    <m.div initial="rest" whileHover="hover" whileFocus="focus" animate="rest" className="relative">
                      <m.div variants={glowVariants} transition={{ duration: 0.3 }} className="absolute inset-0 bg-gradient-to-r from-green-500/80 to-teal-500/80 rounded-xl blur-md pointer-events-none" />
                      <input type="text" name="username" value={formData.username} onChange={handleChange} autoComplete="username" className={`relative w-full px-4 py-3 bg-white/10 border rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-white placeholder-gray-500 transition-all duration-300 backdrop-blur-sm outline-none ${errors.username ? 'border-red-500/50' : 'border-white/20'}`} placeholder="Choose a unique username" />
                      {errors.username && (<m.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-2 flex items-center gap-1"> <div className="w-1 h-1 bg-red-400 rounded-full" /> {errors.username} </m.p>)}
                    </m.div>
                  </m.div>

                  <m.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <Lock className="text-purple-400 w-4 h-4" /> Password
                    </label>
                    <m.div initial="rest" whileHover="hover" whileFocus="focus" animate="rest" className="relative">
                      <m.div variants={glowVariants} transition={{ duration: 0.3 }} className="absolute inset-0 bg-gradient-to-r from-purple-500/80 to-pink-500/80 rounded-xl blur-md pointer-events-none" />
                      <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} autoComplete="new-password" className={`relative w-full px-4 py-3 pr-12 bg-white/10 border rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-gray-500 transition-all duration-300 backdrop-blur-sm outline-none ${errors.password ? 'border-red-500/50' : 'border-white/20'}`} placeholder="Create a secure password" />
                      <m.button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors z-10" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </m.button>
                      {errors.password && (<m.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-2 flex items-center gap-1"> <div className="w-1 h-1 bg-red-400 rounded-full" /> {errors.password} </m.p>)}
                    </m.div>
                  </m.div>

                  <m.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                      <Lock className="text-pink-400 w-4 h-4" /> Confirm Password
                    </label>
                    <m.div initial="rest" whileHover="hover" whileFocus="focus" animate="rest" className="relative">
                      <m.div variants={glowVariants} transition={{ duration: 0.3 }} className="absolute inset-0 bg-gradient-to-r from-pink-500/80 to-red-500/80 rounded-xl blur-md pointer-events-none" />
                      <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} autoComplete="new-password" className={`relative w-full px-4 py-3 pr-12 bg-white/10 border rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 text-white placeholder-gray-500 transition-all duration-300 backdrop-blur-sm outline-none ${errors.confirmPassword ? 'border-red-500/50' : 'border-white/20'}`} placeholder="Confirm your password" />
                      <m.button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors z-10" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </m.button>
                      {errors.confirmPassword && (<m.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-2 flex items-center gap-1"> <div className="w-1 h-1 bg-red-400 rounded-full" /> {errors.confirmPassword} </m.p>)}
                    </m.div>
                  </m.div>
                  <m.div variants={itemVariants}>
                    <m.button type="submit" disabled={isLoading} className="group relative w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed" whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -2 }} whileTap={{ scale: isLoading ? 1 : 0.98 }}>
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isLoading ? (<> <Loader2 className="w-5 h-5 animate-spin" /> Creating Account... </>) : (<> <Rocket className="w-5 h-5" /> Create Account </>)}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </m.button>
                  </m.div>
                </form>

                <m.div variants={itemVariants} className="relative flex items-center my-6">
                  <div className="flex-grow border-t border-white/20"></div>
                  <span className="flex-shrink mx-4 text-gray-400 text-xs">OR</span>
                  <div className="flex-grow border-t border-white/20"></div>
                </m.div>

                {/* This div is now the target for the Google button */}
                <m.div variants={itemVariants} className="flex justify-center" ref={googleButtonRef}></m.div>

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

          <m.div
            variants={sideInfoVariants}
            className="w-full max-w-md lg:max-w-sm text-center lg:text-left"
          >
            <div className="p-6 bg-black/30 backdrop-blur-sm rounded-2xl border border-white/20 ">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center lg:justify-start gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                What you'll get:
              </h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                  <span>View Usage History</span>
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