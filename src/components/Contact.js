import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { motion as m } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Send,
  Mail,
  User,
  MessageSquare,

  Sparkles,
  Rocket,
  Github,
  Twitter,
  Loader2,
  Heart,
  Zap,
  Star
} from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981']
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      setShowSuccess(false);

      const apiUrl =
        (process.env.REACT_APP_API_URL?.trim() || 'http://localhost:5000') + '/api/contact';

      const res = await axios.post(apiUrl, form, {
        headers: { 'Content-Type': 'application/json' }
      });

      toast.success(res.data.message || 'Message sent successfully! 🚀');
      setForm({ name: '', email: '', message: '' });
      setShowSuccess(true);
      launchConfetti();
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Server error');
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
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Multiple gradient layers for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
        <div className="absolute inset-0 bg-gradient-to-tl from-emerald-900/10 via-transparent to-indigo-900/15" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.1),transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />

        {/* Animated mesh gradient overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
        </div>
      </div>

      {/* Enhanced Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Geometric shapes */}
        {[...Array(12)].map((_, i) => (
          <m.div
            key={`circle-${i}`}
            className={`absolute rounded-full border ${i % 3 === 0 ? 'border-blue-400/20' :
                i % 3 === 1 ? 'border-purple-400/20' : 'border-pink-400/20'
              }`}
            style={{
              width: `${Math.random() * 80 + 40}px`,
              height: `${Math.random() * 80 + 40}px`,
            }}
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              rotate: 360,
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 20 + Math.random() * 15,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
          />
        ))}

        {/* Floating icons/symbols */}
        {[...Array(6)].map((_, i) => (
          <m.div
            key={`icon-${i}`}
            className="absolute text-white/10"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            }}
            animate={{
              y: [0, -200, 0],
              rotate: [0, 180, 360],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 25 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 8
            }}
          >
            {i % 2 === 0 ? <Sparkles size={24} /> : <Star size={20} />}
          </m.div>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-16">
        <m.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16"
        >

          {/* LEFT COLUMN: Contact Form Card */}
          <div className="relative w-full max-w-md">
            {/* Enhanced outer glow with pulsing effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl animate-pulse -z-10" />
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/40 to-purple-600/40 rounded-3xl blur-xl -z-10" />

            <m.div
              className="relative backdrop-blur-3xl border border-white/20 rounded-3xl shadow-2xl p-8 group overflow-hidden"
              whileHover={{
                y: -8,
                rotateX: 2,
                transition: { duration: 0.4, ease: "easeOut" }
              }}
              style={{
                transformStyle: "preserve-3d",
                backgroundImage: "url('/home-bg.JPG')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Dark overlay for readability over image */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#0d0e1b]/85 via-[#1b1430]/75 to-[#140d25]/85" />
              {/* Premium shine effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                {/* Enhanced Header */}
                <m.div variants={itemVariants} className="text-center mb-10">
                  <m.div
                    className="flex items-center justify-center space-x-4 mb-8"
                    whileHover={{ scale: 1.08, rotateY: 5 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <span className="font-black text-3xl bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent tracking-wider">GET IN</span>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-md animate-pulse" />
                      <div className="relative w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <MessageSquare className="text-white w-6 h-6" />
                      </div>
                    </div>
                    <span className="font-black text-3xl bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent tracking-wider">TOUCH</span>
                  </m.div>

                  <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent mb-3 tracking-tight">Let's Connect</h2>
                  <p className="text-gray-400 text-base flex items-center justify-center gap-2 leading-relaxed">
                    Share your thoughts and we'll get back to you
                    <Heart className="w-5 h-5 text-red-400 animate-pulse" />
                  </p>

                  {/* Decorative line */}
                  <div className="flex items-center justify-center mt-6">
                    <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent w-32" />
                    <Sparkles className="w-4 h-4 text-yellow-400 mx-4" />
                    <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent w-32" />
                  </div>
                </m.div>

                {/* Enhanced Success Message */}
                {showSuccess && (
                  <m.div
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 text-green-300 px-6 py-4 rounded-2xl text-sm mb-8 overflow-hidden"
                  >
                    {/* Success shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
                    <div className="relative flex items-center gap-3">
                      <div className="p-2 bg-green-500/20 rounded-full">
                        <Rocket className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold">Message sent successfully!</div>
                        <div className="text-xs text-green-400/80 mt-1">We'll be in touch within 24 hours</div>
                      </div>
                    </div>
                  </m.div>
                )}

                {/* Enhanced Contact Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Name Field */}
                  <m.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                      <User className="text-emerald-400 w-5 h-5" /> Your Name
                    </label>
                    <m.div initial="rest" whileHover="hover" whileFocus="focus" animate="rest" className="relative group">
                      <m.div
                        variants={glowVariants}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 bg-gradient-to-r from-emerald-500/60 to-teal-500/60 rounded-2xl blur-lg pointer-events-none"
                      />
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="relative w-full px-5 py-4 bg-white/5 border border-white/20 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-white placeholder-gray-400 transition-all duration-300 backdrop-blur-sm outline-none group-hover:bg-white/10 font-medium"
                        placeholder="Enter your full name"
                        required
                      />
                      {/* Input shine effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </m.div>
                  </m.div>

                  {/* Email Field */}
                  <m.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                      <Mail className="text-blue-400 w-5 h-5" /> Email Address
                    </label>
                    <m.div initial="rest" whileHover="hover" whileFocus="focus" animate="rest" className="relative group">
                      <m.div
                        variants={glowVariants}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/60 to-purple-500/60 rounded-2xl blur-lg pointer-events-none"
                      />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="relative w-full px-5 py-4 bg-white/5 border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-300 backdrop-blur-sm outline-none group-hover:bg-white/10 font-medium"
                        placeholder="your.email@example.com"
                        required
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </m.div>
                  </m.div>

                  {/* Message Field */}
                  <m.div variants={itemVariants}>
                    <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                      <MessageSquare className="text-purple-400 w-5 h-5" /> Your Message
                    </label>
                    <m.div initial="rest" whileHover="hover" whileFocus="focus" animate="rest" className="relative group">
                      <m.div
                        variants={glowVariants}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 bg-gradient-to-r from-purple-500/60 to-pink-500/60 rounded-2xl blur-lg pointer-events-none"
                      />
                      <textarea
                        name="message"
                        rows="5"
                        value={form.message}
                        onChange={handleChange}
                        className="relative w-full px-5 py-4 bg-white/5 border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-gray-400 transition-all duration-300 backdrop-blur-sm outline-none resize-none group-hover:bg-white/10 font-medium leading-relaxed"
                        placeholder="Tell us what's on your mind..."
                        required
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </m.div>
                  </m.div>

                  {/* Enhanced Submit Button */}
                  <m.div variants={itemVariants}>
                    <m.button
                      type="submit"
                      disabled={isLoading}
                      className="group relative w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold py-5 rounded-2xl shadow-2xl hover:shadow-blue-500/40 transition-all duration-500 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed transform-gpu"
                      whileHover={{
                        scale: isLoading ? 1 : 1.02,
                        y: isLoading ? 0 : -3,
                        rotateX: isLoading ? 0 : 2
                      }}
                      whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    >
                      {/* Button background animation */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-all duration-500" />

                      {/* Button shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                      <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                        {isLoading ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span>Sending Message...</span>
                          </>
                        ) : showSuccess ? (
                          <>
                            <Rocket className="w-6 h-6" />
                            <span>Message Sent!</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                            <span>Send Message</span>
                          </>
                        )}
                      </span>
                    </m.button>
                  </m.div>
                </form>

                {/* Social Links */}
                <m.div variants={itemVariants} className="text-center mt-8">
                  <p className="text-gray-400 text-sm mb-4">Or reach out on social media</p>
                  <div className="flex justify-center gap-4">
                    <m.a
                      href="#"
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-white/10 transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Twitter className="w-4 h-4" />
                      <span className="text-xs">Twitter</span>
                    </m.a>
                    <m.a
                      href="#"
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Github className="w-4 h-4" />
                      <span className="text-xs">GitHub</span>
                    </m.a>
                  </div>
                </m.div>
              </div>
            </m.div>
          </div>

          {/* RIGHT COLUMN: Extra Info */}
          <m.div
            variants={sideInfoVariants}
            className="w-full max-w-md lg:max-w-sm text-center lg:text-left"
          >
            {/* Main Info Card */}
            <div className="p-6 bg-black/20 rounded-2xl border border-white/10 backdrop-blur-sm mb-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center lg:justify-start gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Why Contact Us?
              </h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                  <span>Quick response within 24 hours</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0" />
                  <span>Personalized support and solutions</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0" />
                  <span>Feature requests welcome</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-pink-400 rounded-full flex-shrink-0" />
                  <span>Technical guidance available</span>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="p-6 bg-black/20 rounded-2xl border border-white/10 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center lg:justify-start gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Community Stats
              </h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-400">50K+</div>
                  <div className="text-xs text-gray-400">Active Users</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-400">99%</div>
                  <div className="text-xs text-gray-400">Satisfaction</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-400">24/7</div>
                  <div className="text-xs text-gray-400">Support</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-2xl font-bold text-pink-400">100+</div>
                  <div className="text-xs text-gray-400">AI Tools</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center lg:text-left mt-8">
              <p className="text-xs text-gray-500">
                We respect your privacy and will never share your information with third parties.
              </p>
            </div>
          </m.div>

        </m.div>
      </div>

      {/* Custom Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          color: 'white'
        }}
      />
    </div>
  );
};

export default Contact;