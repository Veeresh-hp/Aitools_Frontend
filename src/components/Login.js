import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { motion as m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import { FaEye, FaEyeSlash, FaTimes, FaSpinner, FaArrowRight } from 'react-icons/fa';
import { useLoading } from '../contexts/LoadingContext';
import LoginArt from '../assets/login_art.png'; // Generated Art
import TermsOfService from './TermsOfService';
import PrivacyPolicy from './PrivacyPolicy';

const Login = () => {
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetMessage, setResetMessage] = useState('');
    const [resetError, setResetError] = useState('');
    const history = useHistory();
    const { showLoader, hideLoader } = useLoading();

    const API_URL = process.env.REACT_APP_API_URL || 'https://ai-tools-hub-backend-u2v6.onrender.com';
    const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const googleButtonRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
        if (errors.general) setErrors((prev) => ({ ...prev, general: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.identifier) newErrors.identifier = 'Required';
        if (!formData.password) newErrors.password = 'Required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        showLoader();
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, formData);
            if (!response.data.user || !response.data.user.username) throw new Error('Invalid response');
            
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', response.data.user.email);
            localStorage.setItem('username', response.data.user.username);
            localStorage.setItem('isAdmin', response.data.user.role === 'admin' ? 'true' : 'false');
            
            history.push('/');
            window.location.reload();
        } catch (error) {
            setErrors({ general: error.response?.data?.error || 'Invalid credentials.' });
        } finally {
            setIsLoading(false);
            hideLoader();
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        setResetError('');
        setResetMessage('');
        try {
             await axios.post(`${API_URL}/api/auth/forgot-password`, { email: resetEmail });
             setResetMessage('Reset link sent!');
             setResetEmail('');
        } catch (error) {
             setResetError('Failed to send link.');
        }
    };

    // Google Auth Logic (Preserved)
    const handleGoogleSuccess = useCallback(async (credentialResponse) => {
        setIsLoading(true);
        showLoader();
        try {
            const res = await axios.post(`${API_URL}/api/auth/google-login`, { token: credentialResponse.credential });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem('username', res.data.user.username);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', res.data.user.email);
            localStorage.setItem('isAdmin', res.data.user.role === 'admin' ? 'true' : 'false');
            history.push('/');
            window.location.reload();
        } catch (err) {
            setErrors({ general: 'Google login failed.' });
        } finally {
            setIsLoading(false);
            hideLoader();
        }
    }, [API_URL, history, showLoader, hideLoader]);

     useEffect(() => {
        if (!googleClientId) return;
        if (window.google && window.google.accounts) {
            window.google.accounts.id.initialize({ 
                client_id: googleClientId, 
                callback: handleGoogleSuccess,
                auto_select: true, // Attempt to automatically sign in returning users
                cancel_on_tap_outside: false // Optional: keeps popup open unless explicitly closed
            });
            if (googleButtonRef.current) {
                window.google.accounts.id.renderButton(googleButtonRef.current, { theme: "filled_black", shape: "pill", width: "100%" });
            }
            // Display the One Tap prompt
            window.google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    // console.log("One Tap not displayed:", notification.getNotDisplayedReason());
                }
            });
        }
    }, [googleClientId, handleGoogleSuccess]);


    return (
        <LazyMotion features={domAnimation}>
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 md:p-8 font-sans overflow-x-hidden relative">
                
                {/* Background Glows */}
                <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none" />
                <div className="fixed bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-[#FF6B00]/5 rounded-full blur-[150px] pointer-events-none" />

                <div className="bg-[#0f0f0f] w-full max-w-[1200px] min-h-[600px] rounded-[30px] shadow-2xl overflow-hidden grid lg:grid-cols-2 border border-white/5 relative z-10">
                    
                    {/* Left Side - Image/Art */}
                    <m.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative hidden lg:block h-full w-full p-4"
                    >
                        <div className="h-full w-full rounded-2xl overflow-hidden relative group">
                            <img 
                                src={LoginArt} 
                                alt="Dreamy Clouds" 
                                className="h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-10 left-10 p-4">
                                <h3 className="text-3xl font-bold text-white mb-2">Gen AI</h3>
                                <p className="text-gray-200 opacity-90 text-sm">Create beyond imagination.</p>
                            </div>
                        </div>
                    </m.div>

                    {/* Right Side - Form */}
                    <div className="flex flex-col justify-center p-6 md:p-10 lg:p-12 relative">
                        {/* Mobile Back Button / Header area if needed */}
                        
                        <m.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                                Log in to <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Unleash Your Dreams</span>
                            </h1>

                            <div className="flex items-center gap-2 mb-6 text-sm">
                                <span className="text-gray-500">Don't have an account?</span>
                                <Link to="/signup" className="text-white font-medium border-b border-white pb-0.5 hover:text-gray-300 transition-colors">
                                    Sign Up
                                </Link>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {errors.general && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                                        {errors.general}
                                    </div>
                                )}
                                
                                <div className="space-y-1">
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            name="identifier"
                                            value={formData.identifier}
                                            onChange={handleChange}
                                            placeholder="Username or Email"
                                            className={`w-full bg-[#1A1A1A] border ${errors.identifier ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 focus:bg-[#222] transition-all`}
                                        />
                                    </div>
                                    {errors.identifier && <span className="text-xs text-red-500 ml-2">{errors.identifier}</span>}
                                </div>

                                <div className="space-y-1">
                                    <div className="relative group">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Password"
                                            className={`w-full bg-[#1A1A1A] border ${errors.password ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 focus:bg-[#222] transition-all pr-12`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {errors.password && <span className="text-xs text-red-500 ml-2">{errors.password}</span>}
                                </div>

                                <div className="flex justify-end">
                                    <button 
                                        type="button"
                                        onClick={() => setShowResetModal(true)}
                                        className="text-xs text-gray-500 hover:text-white transition-colors"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-white text-black font-bold text-lg py-3 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                                >
                                    {isLoading ? <FaSpinner className="animate-spin" /> : 'Start Creating'}
                                    {!isLoading && <FaArrowRight className="group-hover:translate-x-1 transition-transform" />}
                                </button>
                            </form>

                             <div className="mt-8">
                                <div className="relative flex justify-center text-sm mb-6">
                                    <span className="px-2 bg-[#0f0f0f] text-gray-600">Or continue with</span>
                                    <div className="absolute inset-0 flex items-center -z-10">
                                        <div className="w-full border-t border-white/5"></div>
                                    </div>
                                </div>
                                <div ref={googleButtonRef} className="h-[44px]"></div>
                            </div>

                            <div className="mt-8 text-[10px] text-gray-600 text-center max-w-xs mx-auto">
                                By signing in, you agree to our <button onClick={() => setShowTerms(true)} className="underline cursor-pointer hover:text-gray-400">Terms of Service</button> and <button onClick={() => setShowPrivacy(true)} className="underline cursor-pointer hover:text-gray-400">Privacy Policy</button>.
                            </div>
                        </m.div>

                    </div>
                </div>

                {/* Reset Modal - Keeping functionality but styling it minimal */}
                {showResetModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                        <m.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-[#111] border border-white/10 p-8 rounded-2xl w-full max-w-md relative"
                        >
                            <button onClick={() => setShowResetModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><FaTimes/></button>
                            <h3 className="text-xl font-bold mb-4">Reset Password</h3>
                            <p className="text-gray-400 text-sm mb-6">Enter your email to receive recovery instructions.</p>
                            <form onSubmit={handleResetSubmit} className="space-y-4">
                                <input
                                    type="email"
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    placeholder="email@example.com"
                                    className="w-full bg-[#222] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30"
                                />
                                {resetMessage && <p className="text-green-500 text-sm">{resetMessage}</p>}
                                {resetError && <p className="text-red-500 text-sm">{resetError}</p>}
                                <button type="submit" className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200">Send Link</button>
                            </form>
                        </m.div>
                    </div>
                )}

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
        </LazyMotion>
    );
};

export default Login;