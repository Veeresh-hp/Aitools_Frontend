import React, { useState, useEffect } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { FaTimes, FaEnvelope, FaCheck } from 'react-icons/fa';

const NewsletterPopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ state: 'idle', message: '' });
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    useEffect(() => {
        // Check if user has already seen/subscribed
        const seen = localStorage.getItem('newsletter_popup_seen');
        if (!seen) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 5000); // Show after 5 seconds
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        // Set seen flag so it doesn't show again immediately (e.g., expiry could be added for advanced logic)
        localStorage.setItem('newsletter_popup_seen', 'true');
    };

    const handleSubscribe = async (e) => {
        e.preventDefault();
        const trimmed = email.trim();
        if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
            setStatus({ state: 'error', message: 'Please enter a valid email.' });
            return;
        }

        setStatus({ state: 'loading', message: '' });
        
        try {
            const res = await fetch(`${API_URL}/api/newsletter/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: trimmed })
            });
            const json = await res.json();
            
            if (res.ok) {
                setStatus({ state: 'success', message: 'Signed up!' });
                setTimeout(() => {
                    handleClose();
                }, 2000);
            } else {
                setStatus({ state: 'error', message: json.error || 'Failed to subscribe.' });
            }
        } catch (err) {
            setStatus({ state: 'error', message: 'Something went wrong.' });
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[99999] flex items-end justify-center sm:items-center p-0 sm:p-4 pointer-events-none">
                    
                    {/* Backdrop */}
                    <m.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <m.div
                        initial={{ y: 100, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 100, opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full sm:max-w-lg bg-[#0A0A0A]/90 border-t sm:border border-white/10 rounded-t-[2rem] sm:rounded-3xl shadow-2xl p-8 sm:p-10 pointer-events-auto overflow-hidden group"
                    >
                         {/* Ambient Glows */}
                         <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-orange-500/15 transition-colors duration-700" />
                         <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-blue-500/15 transition-colors duration-700" />

                        <button 
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors z-10"
                        >
                            <FaTimes />
                        </button>

                        <div className="relative z-10 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 mb-6 text-orange-400">
                                <FaEnvelope size={20} />
                            </div>
                            
                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
                                Get Daily AI Tool Updates
                            </h2>
                            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8 max-w-sm mx-auto">
                                Hand-picked AI tools, launches, and productivity tips delivered straight to your inbox — every day.
                            </p>

                            <form onSubmit={handleSubscribe} className="space-y-4">
                                <div className="relative group/input">
                                    <input 
                                        type="email" 
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all text-center sm:text-left"
                                    />
                                    {/* Subtle focus glow */}
                                    <div className="absolute inset-0 rounded-xl border border-orange-500/0 group-focus-within/input:border-orange-500/30 group-focus-within/input:shadow-[0_0_15px_rgba(249,115,22,0.1)] transition-all pointer-events-none" />
                                </div>

                                <m.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={status.state === 'loading' || status.state === 'success'}
                                    className="w-full py-3.5 rounded-xl bg-[#FF6B00] text-white font-bold text-base hover:bg-[#ff8533] transition-all shadow-lg shadow-orange-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {status.state === 'loading' ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : status.state === 'success' ? (
                                        <> <FaCheck /> Subscribed </>
                                    ) : (
                                        'Subscribe Free'
                                    )}
                                </m.button>
                            </form>

                            {status.message && status.state === 'error' && (
                                <p className="mt-3 text-xs text-red-400">{status.message}</p>
                            )}

                            <p className="mt-6 text-xs text-gray-500">
                                No spam. Unsubscribe anytime.
                            </p>
                        </div>
                    </m.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default NewsletterPopup;
