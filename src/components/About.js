import React from 'react';
import { motion as m } from 'framer-motion';
import { Brain, Users, Zap, Shield, ArrowRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import toolsData from '../data/toolsData';
import HeroCards from './HeroCards';

const About = () => {
  const stats = [
    { number: "300+", label: "AI Tools", icon: Zap },
    { number: "280+", label: "Happy Users", icon: Users },
    { number: "480+", label: "Components", icon: Brain }, // Adapted labels to be generic but fitting
    { number: "18+", label: "Categories", icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans selection:bg-orange-500/30">
      
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12 flex flex-col justify-start min-h-screen">
        
        {/* Scrolling Text Strip (Decorative) */}
        <div className="absolute top-0 left-0 w-full overflow-hidden opacity-20 pointer-events-none py-4 border-b border-white/10 hidden md:block">
           <m.div 
             className="whitespace-nowrap flex gap-8 text-sm uppercase tracking-widest font-mono text-gray-400"
             animate={{ x: [0, -1000] }}
             transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
           >
             {[...Array(10)].map((_, i) => (
                <span key={i}>AI Tools Hub &nbsp;&bull;&nbsp; Empowering Creators &nbsp;&bull;&nbsp; Discover Future &nbsp;&bull;&nbsp;</span>
             ))}
           </m.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-4">
          
          {/* Main Title Area (Takes up left side on desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-start">
             <m.div
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
             >
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-12 h-12 bg-[#FF6B00] rounded-full flex items-center justify-center shrink-0">
                      <Brain className="text-white w-7 h-7" />
                   </div>
                   <div className="text-sm font-light tracking-wide text-gray-400">
                      <span className="text-[#FF6B00] font-bold block">AI Tools Hub</span>
                      The future of productivity
                   </div>
                </div>

                <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-[0.9] mb-8">
                  About <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-600">
                    Project
                  </span>
                </h1>
             </m.div>

             {/* Stats Grid aligned left/bottom */}
             <m.div 
               className="grid grid-cols-2 gap-4 mt-8 max-w-md"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.4, duration: 0.8 }}
             >
                {stats.map((stat, index) => (
                   <div key={index} className={`p-6 bg-[#111] border border-white/5 hover:border-[#FF6B00]/30 transition-colors duration-300 flex flex-col justify-end aspect-square ${index % 2 !== 0 ? 'mt-8' : ''}`}> {/* Staggered look */}
                      <span className="text-4xl sm:text-5xl font-bold text-white mb-2 block">{stat.number}</span>
                      <span className="text-gray-500 text-sm uppercase tracking-wider">{stat.label}</span>
                   </div>
                ))}
             </m.div>
          </div>

          {/* Right Content Area - NOW JUST CAROUSEL */}
          <div className="lg:col-span-5 flex flex-col gap-8 mt-8 lg:mt-0">
             {/* Tool Carousel / Visual Excellence */}
             <m.div 
                className="relative w-full overflow-hidden flex flex-col items-center justify-center py-12 rounded-3xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
             >
                {/* Background Image - Persons working */}
                <div className="absolute inset-0 z-0">
                   <img 
                      src="/Images/visual-bg.png" 
                      alt="Team working on AI" 
                      className="w-full h-full object-cover opacity-20"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>
                
                {/* Content Container */}
                <div className="relative z-10 w-full">

                {/* Content Overlay */}
                <div className="relative z-20 w-full">
                   <div className="text-center mb-8">
                      <h4 className="text-2xl font-bold text-white mb-2">Visual Excellence</h4>
                      <p className="text-gray-400 text-sm font-medium">Powered by our premium AI collection</p>
                   </div>
                   
                   {/* Fan Card Visual */}
                   <HeroCards />

                   {/* Infinite Marquee of Tools - Row 1 */}
                   <div className="flex gap-4 overflow-hidden mask-linear-fade mb-4">
                      <m.div 
                        className="flex gap-4 min-w-full"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                      >
                         {[...toolsData.flatMap(cat => cat.tools).filter(t => t.image).slice(0, 10), ...toolsData.flatMap(cat => cat.tools).filter(t => t.image).slice(0, 10)].map((tool, idx) => (
                            <div key={`row1-${tool.name}-${idx}`} className="relative w-80 h-48 shrink-0 rounded-xl overflow-hidden border border-white/20 shadow-lg group bg-black/20 backdrop-blur-sm">
                               <img 
                                 src={tool.image} 
                                 alt={tool.name}
                                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                               />
                               <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                               <div className="absolute bottom-2 left-2 right-2">
                                  <span className="text-xs font-semibold text-white truncate block text-shadow-md">{tool.name}</span>
                               </div>
                            </div>
                         ))}
                      </m.div>
                   </div>

                   {/* Infinite Marquee of Tools - Row 2 (Reverse) */}
                   <div className="flex gap-4 overflow-hidden mask-linear-fade">
                      <m.div 
                        className="flex gap-4 min-w-full"
                        animate={{ x: ["-50%", "0%"] }}
                        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                      >
                         {[...toolsData.flatMap(cat => cat.tools).filter(t => t.image).slice(10, 20), ...toolsData.flatMap(cat => cat.tools).filter(t => t.image).slice(10, 20)].map((tool, idx) => (
                            <div key={`row2-${tool.name}-${idx}`} className="relative w-80 h-48 shrink-0 rounded-xl overflow-hidden border border-white/20 shadow-lg group bg-black/20 backdrop-blur-sm">
                               <img 
                                 src={tool.image} 
                                 alt={tool.name}
                                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                               />
                               <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                               <div className="absolute bottom-2 left-2 right-2">
                                  <span className="text-xs font-semibold text-white truncate block text-shadow-md">{tool.name}</span>
                               </div>
                            </div>
                         ))}
                      </m.div>
                   </div>
                </div>
                </div>
             </m.div>
          </div>
        </div>

        {/* Bottom Section - Story and Vision */}
        <div className="grid md:grid-cols-2 gap-8 mt-12 pb-20">
             {/* Story Card */}
             <m.div 
               className="bg-[#111] border border-white/10 p-8 relative group"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2, duration: 0.6 }}
             >
                <Quote className="absolute top-6 right-6 w-8 h-8 text-[#FF6B00] opacity-50" />
                <div className="w-1 h-12 bg-[#FF6B00] mb-6" /> 
                
                <h3 className="text-xl font-bold text-white mb-4">Our Story</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  <span className="text-white font-semibold">AI Tools Hub</span> began as a passion project to democratize access to artificial intelligence. We recognized that while AI technology was advancing rapidly, finding and evaluating quality tools remained a challenge.
                </p>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Our platform bridges this gap by curating, testing, and presenting the most innovative AI-powered solutions available today.
                </p>
                 <p className="text-gray-400 leading-relaxed">
                  Built and maintained by <span className="text-[#FF6B00] font-semibold">Veeresh H P</span>, a passionate technologist dedicated to making AI accessible to everyone.
                </p>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                   <span className="text-xs text-gray-500 uppercase tracking-widest">[ Founder's Vision ]</span>
                   <Link to="/" className="text-[#FF6B00] hover:text-white transition-colors flex items-center gap-2 text-sm font-semibold">
                      Explore Tools <ArrowRight className="w-4 h-4" />
                   </Link>
                </div>
             </m.div>

             {/* Vision Card */}
             <m.div 
               className="bg-[#111] border border-white/10 p-8 relative group h-full"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.4, duration: 0.6 }}
             >
                <div className="w-1 h-12 bg-purple-500 mb-6" /> 
                
                <h3 className="text-xl font-bold text-white mb-4">Our Vision</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  We envision a world where AI tools are not just accessible, but seamlessly integrated into creative and professional workflows. Our mission extends beyond simple curation—we aim to educate, inspire, and empower.
                </p>
                <p className="text-gray-400 leading-relaxed">
                   Whether you're a developer, designer, or just curious, we're here to guide your journey. The future is intelligent, and it starts here.
                </p>
             </m.div>
        </div>

        {/* Quote Section */}
        <m.div 
           className="text-center pt-8 border-t border-white/10 max-w-4xl mx-auto"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.8 }}
        >
            <blockquote className="text-lg italic text-gray-500">
              "The best way to predict the future is to create it. AI Tools Hub is our contribution to building a more intelligent tomorrow."
            </blockquote>
            <p className="text-[#FF6B00] text-sm font-semibold mt-4">— Veeresh H P, Founder</p>
        </m.div>
      </div>
    </div>
  );
};

export default About;