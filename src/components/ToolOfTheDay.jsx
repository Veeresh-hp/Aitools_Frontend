import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaArrowRight } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';
import GlowBorder from './GlowBorder';

import toolsData from '../data/toolsData';

const ToolOfTheDay = () => {
    const [tool, setTool] = useState(null);
    const { t } = useLanguage();
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetch(`${API_URL}/api/tools/tool-of-the-day`)
            .then(res => res.json())
            .then(data => {
                if (data.tool) {
                    setTool(data.tool);
                } else {
                    // Fallback to static data
                    pickStaticTool();
                }
            })
            .catch(err => {
                console.error(err);
                pickStaticTool();
            });
    }, [API_URL]);

    const pickStaticTool = () => {
        // Flatten toolsData
        const allTools = toolsData.flatMap(cat => cat.tools);
        if (allTools.length > 0) {
            // Seeded random based on date
            const today = new Date().toISOString().slice(0, 10);
            let hash = 0;
            for (let i = 0; i < today.length; i++) {
                hash = today.charCodeAt(i) + ((hash << 5) - hash);
            }
            const index = Math.abs(hash) % allTools.length;
            setTool({...allTools[index], category: allTools[index].category || 'Featured'}); 
        }
    };

    if (!tool) return null;

    const toSlug = (val) => {
        return String(val || '')
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
    };

    const getImageSrc = (item) => {
        if (item.image) return item.image;
        if (item.logo) return item.logo;
        // Try constructing path from public folder if it follows naming convention
        // This assumes images are at /Images/<name>.jpg or similar
        // For now, return null to trigger fallback if explicit image prop missing
        return null;
    };

    const imageSrc = getImageSrc(tool) || (tool.name ? `/Images/${tool.name.replace(/\s+/g, '')}.jpg` : null) || (tool.name ? `/Images/${tool.name.replace(/\s+/g, '')}.png` : null);

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 relative">
             {/* Section Label */}
             <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-[#FF6B00] rounded-full" />
                <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                    {t('tool_of_the_day') || 'Spotlight'}
                </h2>
             </div>

            <GlowBorder 
                color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
                borderRadius={24}
                borderWidth={3}
                className="w-full"
            >
                <div className="relative bg-[#12121A]/80 backdrop-blur-xl p-6 flex flex-col md:flex-row items-center gap-6 md:gap-8 h-full">
                     {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

                    {/* Image */}
                    <Link to={`/tools/${toSlug(tool.category || 'all')}/${toSlug(tool.name)}`} className="group w-full md:w-64 shrink-0 relative">
                        <div className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/50 shadow-xl relative z-10 group-hover:scale-[1.02] transition-transform duration-500">
                             <img 
                                src={imageSrc} 
                                alt={tool.name} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null; 
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                             />
                             {/* Fallback */}
                             <div className="hidden absolute inset-0 items-center justify-center bg-gradient-to-br from-gray-800 to-black">
                                <span className="text-4xl">🚀</span>
                             </div>
                        </div>
                        {/* Ring Decoration */}
                        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#FF6B00] to-blue-600 blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
                    </Link>

                    {/* Content */}
                    <div className="flex-1 text-center md:text-left relative z-10">
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/20 text-[#FF6B00] text-[10px] font-bold uppercase tracking-widest mb-3">
                            <FaStar size={10} /> Featured Choice
                        </div>
                        
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-3 leading-tight">
                            {tool.name}
                        </h3>
                        
                        <p className="text-sm text-gray-300 mb-6 max-w-xl leading-relaxed line-clamp-2">
                            {tool.shortDescription || tool.description}
                        </p>

                        {/* Features / Tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {(tool.tags || tool.hashtags || []).slice(0, 4).map((tag, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-xs text-gray-300 bg-white/5 px-2.5 py-1.5 rounded-md border border-white/5">
                                    <span className="text-[#FF6B00]">✓</span> {tag.replace(/#/g, '')}
                                </div>
                            ))}
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <Link 
                                to={`/tools/${toSlug(tool.category || 'all')}/${toSlug(tool.name)}`}
                                className="px-6 py-2.5 bg-[#FF6B00] hover:bg-[#E55A00] text-white rounded-lg font-bold text-xs transition-all shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40 flex items-center gap-2 transform hover:-translate-y-0.5"
                            >
                                {t('tool_visit') || 'Discover Tool'} <FaArrowRight />
                            </Link>
                            
                            <div className="text-xs text-gray-400">
                                <span className="opacity-50">Category:</span> <span className="text-white ml-1 font-medium">{tool.category.replace(/-/g, ' ')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </GlowBorder>
        </div>
    );
};

export default ToolOfTheDay;
