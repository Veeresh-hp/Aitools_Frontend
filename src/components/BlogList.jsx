import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendar, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const BlogList = () => {
    const [articles, setArticles] = useState([]);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [subscribing, setSubscribing] = useState(false);
    
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    const fetchArticles = (page) => {
        // ... existing fetch logic
        setLoading(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        fetch(`${API_URL}/api/articles?page=${page}&limit=12`)
            .then(res => res.json())
            .then(data => {
                if (data.articles) {
                    setArticles(data.articles);
                    setPagination({ 
                        currentPage: data.currentPage, 
                        totalPages: data.totalPages 
                    });
                } else if (Array.isArray(data)) {
                    setArticles(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchArticles(1);
    }, [API_URL]);

    const handleSubscribe = async () => {
        if (!email) {
            toast.error('Please enter your email address');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            toast.error('Please enter a valid email');
            return;
        }

        setSubscribing(true);
        try {
            const res = await fetch(`${API_URL}/api/newsletter/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            
            if (res.ok) {
                toast.success(data.message || 'Subscribed successfully!');
                setEmail('');
            } else {
                toast.error(data.error || 'Subscription failed');
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong. Try again.');
        } finally {
            setSubscribing(false);
        }
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
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

    if (loading) return (
        // ... existing loader
        <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
            <motion.div 
                animate={{ opacity: [0.5, 1, 0.5] }} 
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex flex-col items-center gap-4"
            >
                <div className="h-2 w-24 bg-gray-800 rounded overflow-hidden">
                    <motion.div 
                        className="h-full bg-white" 
                        animate={{ x: [-100, 100] }} 
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    />
                </div>
                <div className="font-serif text-xl italic text-gray-500">Curating stories...</div>
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-[#EAEAEA] font-sans selection:bg-white/20">
            {/* Header */}
            <header className="relative pt-32 pb-24 px-6 border-b border-white/5 overflow-hidden">
                {/* Background Image scoped to Header */}
                <motion.div 
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050505] z-10" />
                    <img src="/images/blog-bg.png" alt="Background" className="w-full h-full object-cover opacity-50" />
                </motion.div>

                <div className="relative z-20 max-w-7xl mx-auto text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-serif tracking-tight text-white mb-6 drop-shadow-2xl uppercase"
                    >
                        AI TOOLS HUB INSIGHTS
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed mb-10"
                    >
                        Explore the latest breakthroughs in Artificial Intelligence. Discover new tools, industry news, and expert reviews curated by AI Tools Hub.
                    </motion.p>
                    
                    {/* Newsletter Micro-Interaction */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="max-w-md mx-auto relative group"
                    >
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                            placeholder="Enter your email for weekly updates from AI Tools Hub..." 
                            className="w-full bg-white/5 border border-white/20 rounded-full py-3 pl-6 pr-32 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all backdrop-blur-md shadow-xl"
                        />
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSubscribe}
                            disabled={subscribing}
                            className="absolute right-1 top-1 bottom-1 bg-white text-black rounded-full px-6 text-xs font-bold uppercase tracking-wider shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {subscribing ? 'Joining...' : 'Subscribe'}
                        </motion.button>
                    </motion.div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-[1400px] mx-auto px-6 py-16">
                {articles.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 font-serif italic text-2xl">
                        No stories found.
                    </div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16"
                    >
                        {articles.map((article, index) => {
                            return (
                                <motion.a 
                                    variants={itemVariants}
                                    whileHover={{ y: -8 }}
                                    key={article._id || index}
                                    href={article.isExternal ? article.sourceUrl : `/blog/${article.slug}`}
                                    target={article.isExternal ? "_blank" : "_self"}
                                    rel="noopener noreferrer"
                                    className="group flex flex-col h-full"
                                >
                                    {/* Image Container */}
                                    <div className="aspect-[4/3] w-full overflow-hidden bg-gray-900 mb-6 relative rounded-sm">
                                        {article.image ? (
                                            <motion.img 
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ duration: 0.6 }}
                                                src={article.image} 
                                                alt={article.title} 
                                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-[#111] text-gray-700 font-serif text-4xl">
                                                Az
                                            </div>
                                        )}
                                        {/* Category Badge */}
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 backdrop-blur-sm text-black text-[10px] font-bold uppercase tracking-widest px-2 py-1 shadow-sm">
                                                {article.source?.name || 'AI NEWS'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 flex flex-col">
                                        <h3 className="text-2xl font-serif leading-[1.1] text-gray-100 mb-3 group-hover:text-blue-400 transition-colors duration-300">
                                            {article.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6 font-light">
                                            {article.summary}
                                        </p>
                                        
                                        {/* Footer / Author */}
                                        <div className="mt-auto flex items-center gap-3 pt-4 border-t border-white/10 group-hover:border-white/30 transition-colors">
                                            <div className="w-8 h-8 rounded-full bg-gray-800 overflow-hidden flex items-center justify-center shrink-0 border border-white/10">
                                                {/* Mock Avatar based on author name */}
                                                <span className="text-xs text-gray-400 font-serif">
                                                    {(article.author || 'AI')[0]}
                                                </span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300">
                                                    {article.author ? article.author.split(',')[0] : 'AI Tools Hub'}
                                                </span>
                                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                                                    {new Date(article.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.a>
                            );
                        })}
                    </motion.div>
                )}

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-16 pb-12">
                        <button 
                            disabled={pagination.currentPage === 1}
                            onClick={() => fetchArticles(pagination.currentPage - 1)}
                            className="px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-bold uppercase tracking-wider"
                        >
                            Previous
                        </button>
                        <span className="text-gray-400 font-serif italic">
                            Page {pagination.currentPage} of {pagination.totalPages}
                        </span>
                        <button 
                            disabled={pagination.currentPage === pagination.totalPages}
                            onClick={() => fetchArticles(pagination.currentPage + 1)}
                            className="px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-bold uppercase tracking-wider"
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default BlogList;
