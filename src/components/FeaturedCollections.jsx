import React from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaCode, FaPenFancy, FaChartLine, FaMagic } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';

const FeaturedCollections = () => {
    const history = useHistory();

    const collections = [
        {
            id: 'video-generators',
            title: 'Video Generation',
            subtitle: 'Create cinematic AI videos',
            icon: <FaPlay className="text-white text-2xl" />,
            color: 'from-orange-500 to-red-600',
            span: 'col-span-12 md:col-span-8',
            image: '/Images/sora.JPG',
            delay: 0
        },
        {
            id: 'ai-coding-assistants',
            title: 'Dev Studio',
            subtitle: 'Coding superpowers',
            icon: <FaCode className="text-white text-xl" />,
            color: 'from-blue-500 to-indigo-600',
            span: 'col-span-12 md:col-span-4',
            image: '/Images/cursor.JPG',
            delay: 0.1
        },
        {
            id: 'writing-tools',
            title: 'Writers\' Hub',
            subtitle: 'Copywriting & storytelling',
            icon: <FaPenFancy className="text-white text-xl" />,
            color: 'from-emerald-500 to-teal-600',
            span: 'col-span-12 md:col-span-4',
            image: '/Images/Jasper.JPG',
            delay: 0.2
        },
        {
            id: 'marketing-tools',
            title: 'Growth Lab',
            subtitle: 'Scale your business',
            icon: <FaChartLine className="text-white text-xl" />,
            color: 'from-purple-500 to-pink-600',
            span: 'col-span-12 md:col-span-4',
            image: '/Images/adcreative.JPG',
            delay: 0.3
        },
        {
            id: 'image-generators',
            title: 'Art Station',
            subtitle: 'Generate stunning visuals',
            icon: <FaMagic className="text-white text-xl" />,
            color: 'from-[#FF6B00] to-yellow-500',
            span: 'col-span-12 md:col-span-4',
            image: '/Images/midjourney.JPG',
            delay: 0.4
        }
    ];

    return (
        <section className="py-20 px-4 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                <div>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                        Curated <span className="text-[#FF6B00]">Collections</span>
                    </h2>
                    <p className="text-gray-400 mt-2 text-lg">Hand-picked tools for every workflow.</p>
                </div>
                <button 
                    onClick={() => history.push('/')}
                    className="text-white/70 hover:text-white flex items-center gap-2 group transition-colors"
                >
                    View Categories <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-12 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px]">
                {collections.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: item.delay, duration: 0.5 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => history.push(`/#${item.id}`)}
                        className={`relative group overflow-hidden rounded-3xl cursor-pointer ${item.span} bg-[#0F0F0F] border border-white/5 hover:border-white/10 transition-colors shadow-2xl`}
                    >
                        {/* Background Image & Gradient */}
                        <div className="absolute inset-0">
                            <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" 
                            />
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} mix-blend-overlay opacity-60`} />
                            <div className="absolute inset-0 bg-black/50" />
                        </div>
                        
                        {/* Decorative Blur */}
                        <div className={`absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br ${item.color} blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity`} />

                        {/* Content Container */}
                        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-10">
                            <div className="flex justify-between items-start">
                                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md group-hover:bg-white/10 transition-colors">
                                    {item.icon}
                                </div>
                                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-black/20 group-hover:bg-[#FF6B00] group-hover:border-[#FF6B00] transition-colors">
                                    <svg className="w-4 h-4 text-white -rotate-45 group-hover:rotate-0 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform duration-300">
                                    {item.title}
                                </h3>
                                <p className="text-gray-400 font-medium group-hover:text-gray-300 transition-colors">
                                    {item.subtitle}
                                </p>
                            </div>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedCollections;
