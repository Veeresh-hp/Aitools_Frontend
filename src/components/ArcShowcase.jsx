import React from 'react';
import { motion } from 'framer-motion';

const ArcShowcase = () => {
    // AI Tool cards for the arc
    const cards = [
        { id: 1, image: '/Images/Gemini.JPG', rotate: -25, y: 40 },
        { id: 2, image: '/Images/Jasper.JPG', rotate: -12, y: 10 },
        { id: 3, image: '/Images/ClickUp.JPG', rotate: 0, y: 0 }, // Center
        { id: 4, image: '/Images/Dall-E.JPG', rotate: 12, y: 10 },
        { id: 5, image: '/Images/Claude.jpg', rotate: 25, y: 40 },
    ];

    return (
        <section className="py-32 bg-black relative overflow-hidden">
             {/* Radial gradient background similar to reference */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                <div className="mb-20">
                    <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                        Let's Create Something <br />
                        <span className="text-gray-500">Exceptional</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Collaborate to create a bold brand or seamless digital experience.
                    </p>
                    
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-8 px-8 py-3 bg-[#FF6B00] text-white rounded-full font-bold shadow-lg shadow-orange-500/25 hover:bg-[#ff8533] transition-colors"
                    >
                        Get in Touch
                    </motion.button>
                </div>

                {/* Arc Layout */}
                <div className="relative h-[300px] md:h-[400px] flex justify-center items-end overflow-visible"> 
                    <div className="relative w-full max-w-4xl flex justify-center perspective-[1000px]">
                        {cards.map((card, index) => (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 100 }}
                                whileInView={{ opacity: 1, y: card.y }}
                                transition={{ 
                                    delay: index * 0.1, 
                                    type: "spring", 
                                    damping: 20 
                                }}
                                viewport={{ once: true }}
                                style={{ 
                                    rotate: card.rotate,
                                    zIndex: 10 - Math.abs(index - 2)
                                }}
                                className={`
                                    w-32 h-44 md:w-48 md:h-64 rounded-2xl shadow-2xl border-4 border-black 
                                    flex-shrink-0 -mx-4 md:-mx-8 transform-gpu bg-white
                                `}
                            >
                                <div className="w-full h-full rounded-xl overflow-hidden relative group">
                                    <img 
                                        src={card.image} 
                                        alt="AI Tool" 
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ArcShowcase;
