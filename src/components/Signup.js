import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { motion as m, AnimatePresence } from 'framer-motion';
import { FaEye, FaEyeSlash, FaTimes, FaSpinner, FaRocket } from 'react-icons/fa';
import { useLoading } from '../contexts/LoadingContext';
import SignupArt from '../assets/signup_art.png'; // Generated Art
import TermsOfService from './TermsOfService';
import PrivacyPolicy from './PrivacyPolicy';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);

    const history = useHistory();
    const { startLoading, stopLoading } = useLoading();
    const API_URL = process.env.REACT_APP_API_URL || 'https://ai-tools-hub-backend-u2v6.onrender.com';
    const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const googleButtonRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = "Username is required";
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 6) newErrors.password = "Min 6 characters required";
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        startLoading();

        try {
            const response = await axios.post(`${API_URL}/api/auth/signup`, formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.user.username);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', response.data.user.email);
            
            // Artificial delay for smooth transition
            setTimeout(() => {
                stopLoading();
                history.push('/');
                window.location.reload();
            }, 800);
        } catch (error) {
            stopLoading();
            setIsLoading(false);
            setErrors({ general: error.response?.data?.error || 'Signup failed. Please try again.' });
        }
    };

    // --- Google Auth Logic (Reused) ---
    const handleGoogleSuccess = useCallback(async (credentialResponse) => {
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
            setErrors({ general: 'Google login failed.' });
        } finally {
            setIsLoading(false);
        }
    }, [API_URL, history]);

    useEffect(() => {
        if (!googleClientId) return;
        const initializeGoogle = () => {
            if (window.google && googleButtonRef.current) {
                window.google.accounts.id.initialize({
                    client_id: googleClientId,
                    callback: handleGoogleSuccess
                });
                window.google.accounts.id.renderButton(
                    googleButtonRef.current,
                    { theme: "filled_black", shape: "pill", width: "100%", size: "large", logo_alignment: "left" }
                );
            }
        };

        if (window.google) {
            initializeGoogle();
        } else {
            const script = document.createElement("script");
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            script.onload = initializeGoogle;
            document.body.appendChild(script);
            return () => document.body.removeChild(script);
        }
    }, [googleClientId, handleGoogleSuccess]);


    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">
            <div className="flex min-h-screen">
                
                {/* Left Side - Form Section */}
                <m.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full lg:w-1/2 flex flex-col px-8 sm:px-12 lg:px-20 xl:px-32 relative z-10"
                >
                    <div className="max-w-md w-full mx-auto my-auto py-12">
                        
                        {/* Header */}
                        <div className="mb-4 mt-2">
                            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2">
                                Join the <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Hub.</span>
                            </h1>
                            <p className="text-gray-400 text-lg">Start your AI journey today.</p>
                        </div>

                        {/* Error Message */}
                        <AnimatePresence>
                            {errors.general && (
                                <m.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2"
                                >
                                    <FaTimes className="shrink-0" />
                                    {errors.general}
                                </m.div>
                            )}
                        </AnimatePresence>

                        {/* Form */}
                        <form onSubmit={handleSignup} className="space-y-4">
                            
                            {/* Username Input */}
                            <div className="group">
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 ml-1">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="e.g. Neo Anderson"
                                    className={`w-full bg-[#111] border ${errors.username ? 'border-red-500/50' : 'border-neutral-800'} rounded-2xl px-5 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300`}
                                />
                                {errors.username && <p className="text-red-500 text-xs mt-1 ml-1">{errors.username}</p>}
                            </div>

                            {/* Email Input */}
                            <div className="group">
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 ml-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@example.com"
                                    className={`w-full bg-[#111] border ${errors.email ? 'border-red-500/50' : 'border-neutral-800'} rounded-2xl px-5 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300`}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                            </div>

                            {/* Password Fields Row */}
                            <div className="space-y-4">
                                <div className="group relative">
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 ml-1">Password</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className={`w-full bg-[#111] border ${errors.password ? 'border-red-500/50' : 'border-neutral-800'} rounded-2xl px-5 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300 pr-12`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-[34px] text-gray-500 hover:text-white transition-colors p-1"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                    {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
                                </div>

                                <div className="group relative">
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 ml-1">Confirm Password</label>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className={`w-full bg-[#111] border ${errors.confirmPassword ? 'border-red-500/50' : 'border-neutral-800'} rounded-2xl px-5 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300 pr-12`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-[34px] text-gray-500 hover:text-white transition-colors p-1"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-white text-black font-bold text-lg rounded-2xl py-3 mt-3 hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                            >
                                {isLoading ? (
                                    <FaSpinner className="animate-spin text-xl" />
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <FaRocket className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-[#050505] text-gray-500">Or join with</span>
                            </div>
                        </div>

                        {/* Google Button */}
                        <div ref={googleButtonRef} className="h-[44px] mb-6 w-full flex justify-center"></div>

                        {/* Footer */}
                        <div className="text-center">
                            <p className="text-gray-500 text-sm mb-4">
                                Already have an account? <Link to="/login" className="text-white font-semibold hover:underline decoration-purple-500 underline-offset-4">Sign in</Link>
                            </p>
                            <p className="text-[10px] text-gray-600 leading-relaxed max-w-xs mx-auto">
                                By joining, you agree to our <button onClick={() => setShowTerms(true)} className="underline cursor-pointer hover:text-gray-400">Terms of Service</button> and <button onClick={() => setShowPrivacy(true)} className="underline cursor-pointer hover:text-gray-400">Privacy Policy</button>.
                            </p>
                        </div>
                    </div>
                </m.div>

                {/* Right Side - Art Section */}
                <m.div 
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="hidden lg:block lg:w-1/2 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#050505] z-10 w-32" />
                    <img 
                        src={SignupArt} 
                        alt="Signup Art" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-32 left-12 z-20 max-w-lg">
                        <m.h2 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="text-4xl font-bold text-white mb-4 leading-tight"
                        >
                            "Discover the Universe of AI."
                        </m.h2>
                        <m.p 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.6 }}
                            className="text-gray-300 text-lg"
                        >
                             Explore thousands of tools, track your favorites, and stay ahead of the curve.
                        </m.p>
                    </div>
                    {/* Overlay Gradient for Text Readability */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent z-10" />
                </m.div>

            </div>

             {/* Terms Modal */}
             <AnimatePresence>
                {showTerms && (
                    <m.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[60] flex items-center justify-center p-4 sm:p-6"
                    >
                        <m.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#0a0a0a]/95 backdrop-blur-md border border-white/10 w-full max-w-4xl h-[85vh] rounded-3xl relative overflow-hidden flex flex-col shadow-[0_0_50px_-12px_rgba(255,255,255,0.05)]"
                        >
                            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" />
                            <button 
                                onClick={() => setShowTerms(false)} 
                                className="absolute top-4 right-4 z-50 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all backdrop-blur-sm border border-white/5"
                            >
                                <FaTimes size={18} />
                            </button>
                            <div className="flex-1 overflow-y-auto custom-modal-scrollbar p-2">
                                <TermsOfService isModal={true} />
                            </div>
                        </m.div>
                    </m.div>
                )}
            </AnimatePresence>

            {/* Privacy Modal */}
            <AnimatePresence>
                {showPrivacy && (
                    <m.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[60] flex items-center justify-center p-4 sm:p-6"
                    >
                        <m.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#0a0a0a]/95 backdrop-blur-md border border-white/10 w-full max-w-4xl h-[85vh] rounded-3xl relative overflow-hidden flex flex-col shadow-[0_0_50px_-12px_rgba(255,255,255,0.05)]"
                        >
                            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none" />
                            <button 
                                onClick={() => setShowPrivacy(false)} 
                                className="absolute top-4 right-4 z-50 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all backdrop-blur-sm border border-white/5"
                            >
                                <FaTimes size={18} />
                            </button>
                            <div className="flex-1 overflow-y-auto custom-modal-scrollbar p-2">
                                <PrivacyPolicy isModal={true} />
                            </div>
                        </m.div>
                    </m.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Signup;