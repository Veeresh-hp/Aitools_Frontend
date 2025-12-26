import React, { useMemo } from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import ArcShowcase from './ArcShowcase';
import MotionCarousel from './MotionCarousel';
import FeaturedCollections from './FeaturedCollections';
import AnimatedBeamShowcase from './AnimatedBeamShowcase';
import toolsData from '../data/toolsData';

const ShowcasePage = () => {
    // Flatten and sort tools by date for "Latest Additions"
    const latestTools = useMemo(() => {
        const allTools = toolsData.flatMap(category => 
            category.tools.map(tool => ({ ...tool, category: category.id }))
        );
        return allTools
            .filter(t => t && t.name)
            .sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0))
            .slice(0, 15);
    }, []);

    return (
        <LazyMotion features={domAnimation}>
            <div className="min-h-screen bg-black text-white pt-24 pb-12">
                
                {/* Global Background Elements (similar to Home) */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                     <m.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5 }}
                        className="absolute top-0 left-0 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-orange-600/10 rounded-full blur-[80px] md:blur-[120px] -translate-x-1/2 -translate-y-1/2" 
                    />
                    <m.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="absolute bottom-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-orange-900/10 rounded-full blur-[60px] md:blur-[100px] translate-x-1/3 translate-y-1/3" 
                    />
                </div>

                <div className="relative z-10 space-y-24">
                    {/* Header Text */}
                    <div className="text-center px-4">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
                            Showcase <span className="text-[#FF6B00]">Gallery</span>
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Highlights, featured collections, and the latest additions to our platform.
                        </p>
                    </div>

                    {/* Relocated Section 1: Arc Showcase ("Let's Create Something Exceptional") */}
                    <ArcShowcase />

                    {/* NEW: Integration Hub (Animated Beam) */}
                    <div className="px-4">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">Seamless Integrations</h2>
                            <p className="text-gray-400 max-w-xl mx-auto">Connect your favorite tools to build powerful automated workflows.</p>
                        </div>
                        <AnimatedBeamShowcase />
                    </div>

                    {/* NEW: Featured Collections Bento Grid */}
                    <FeaturedCollections />

                    {/* Relocated Section 2: Motion Carousel ("Latest Additions") */}
                    <div className="relative">
                        <MotionCarousel tools={latestTools} />
                    </div>
                </div>
            </div>
        </LazyMotion>
    );
};

export default ShowcasePage;
