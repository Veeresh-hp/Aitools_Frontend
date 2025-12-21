import React from 'react';
import { motion } from 'framer-motion';

const HeroCards = () => {
  return (
    <div className="relative w-full h-[300px] flex items-center justify-center overflow-visible my-2">
      {/* Ambient Gradient Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-orange-500/20 blur-[100px] rounded-full pointer-events-none" />

      {/* Card Container */}
      <motion.div 
        className="relative flex items-center justify-center w-full h-full perspective-[1000px]"
        initial="hidden"
        animate="visible"
        whileHover="hover"
      >
        {/* Card 1 (Far Left) - Apob */}
        <motion.div
           className="absolute w-40 h-56 rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
           variants={{
             hidden: { opacity: 0, scale: 0.8, y: 100, rotate: -30, x: -120 },
             visible: { 
               opacity: 1, 
               scale: 0.85, 
               y: 20, 
               rotate: -15, 
               x: -140,
               zIndex: 10,
               transition: { duration: 0.6, ease: "easeOut", delay: 0.1 } 
             },
             hover: { 
               y: 0, 
               rotate: -18, 
               x: -150, 
               scale: 0.88,
               transition: { duration: 0.4 } 
             }
           }}
        >
          <img src="/Images/apob.JPG" alt="Apob" className="w-full h-full object-cover" />
        </motion.div>

        {/* Card 2 (Left) - Akool */}
        <motion.div
           className="absolute w-44 h-60 rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
           variants={{
             hidden: { opacity: 0, scale: 0.85, y: 100, rotate: -15, x: -60 },
             visible: { 
               opacity: 1, 
               scale: 0.9, 
               y: 10, 
               rotate: -8, 
               x: -80,
               zIndex: 20,
               transition: { duration: 0.6, ease: "easeOut", delay: 0.2 } 
             },
             hover: { 
               y: -10, 
               rotate: -10, 
               x: -90, 
               scale: 0.93,
               transition: { duration: 0.4 } 
             }
           }}
        >
           <img src="/Images/Akool.JPG" alt="Akool" className="w-full h-full object-cover" />
        </motion.div>

        {/* Card 5 (Far Right) - Recraft */}
        <motion.div
           className="absolute w-40 h-56 rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
           variants={{
             hidden: { opacity: 0, scale: 0.8, y: 100, rotate: 30, x: 120 },
             visible: { 
               opacity: 1, 
               scale: 0.85, 
               y: 20, 
               rotate: 15, 
               x: 140,
               zIndex: 10,
               transition: { duration: 0.6, ease: "easeOut", delay: 0.1 } 
             },
             hover: { 
               y: 0, 
               rotate: 18, 
               x: 150, 
               scale: 0.88,
               transition: { duration: 0.4 } 
             }
           }}
        >
          <img src="/Images/recraft.JPG" alt="Recraft" className="w-full h-full object-cover" />
        </motion.div>

        {/* Card 4 (Right) - Easypeasy */}
        <motion.div
           className="absolute w-44 h-60 rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
           variants={{
             hidden: { opacity: 0, scale: 0.85, y: 100, rotate: 15, x: 60 },
             visible: { 
               opacity: 1, 
               scale: 0.9, 
               y: 10, 
               rotate: 8, 
               x: 80,
               zIndex: 20,
               transition: { duration: 0.6, ease: "easeOut", delay: 0.2 } 
             },
             hover: { 
               y: -10, 
               rotate: 10, 
               x: 90, 
               scale: 0.93,
               transition: { duration: 0.4 } 
             }
           }}
        >
            <img src="/Images/easypeasy.JPG" alt="EasyPeasy" className="w-full h-full object-cover" />
        </motion.div>

        {/* Card 3 (Center) - Main Card - Hero Person */}
        <motion.div
           className="absolute w-48 h-64 rounded-2xl shadow-2xl border border-white/10 overflow-hidden bg-black"
           style={{ zIndex: 30 }}
           variants={{
             hidden: { opacity: 0, scale: 0.9, y: 100 },
             visible: { 
               opacity: 1, 
               scale: 1, 
               y: 0,
               transition: { duration: 0.6, ease: "easeOut", delay: 0.3 } 
             },
             hover: { 
               y: -20, 
               scale: 1.05,
               boxShadow: "0 25px 50px -12px rgba(255, 107, 0, 0.25)",
               transition: { duration: 0.4 } 
             }
           }}
        >
             <img src="/Images/hero-person.png" alt="Hero" className="w-full h-full object-cover" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroCards;
