import React, { useEffect, useState } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';

const SubscriptionSuccess = ({ onComplete }) => {
  const [stage, setStage] = useState('prep'); // prep, launch, success

  useEffect(() => {
    // Sequence the animation stages
    const launchTimer = setTimeout(() => setStage('launch'), 1500); // Wait 1.5s for prep
    const successTimer = setTimeout(() => setStage('success'), 3500); // Launch takes ~2s

    return () => {
      clearTimeout(launchTimer);
      clearTimeout(successTimer);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden rounded-2xl bg-slate-900/95 backdrop-blur-sm pointer-events-none">
      <AnimatePresence mode="wait">
        
        {/* Scene 1 & 2: Rocket & Launch */}
        {stage !== 'success' && (
          <m.div
            className="relative flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Scene 1: Energy Ring (Rotating) */}
            <m.div
              className="absolute w-24 h-24 rounded-full border border-cyan-500/30 border-t-cyan-400 border-r-cyan-400"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{ opacity: stage === 'launch' ? 0 : 1 }}
            />
            
            {/* Scene 2: Pulse Waves (Expanding) */}
            {stage === 'launch' && (
              <>
                {[1, 2, 3].map((i) => (
                  <m.div
                    key={i}
                    className="absolute rounded-full border border-cyan-500/20"
                    initial={{ width: 50, height: 50, opacity: 0.8 }}
                    animate={{ width: 300, height: 300, opacity: 0 }}
                    transition={{ duration: 1.5, delay: i * 0.2, ease: "easeOut" }}
                  />
                ))}
              </>
            )}

            {/* Rocket Icon */}
            <m.div
              className="relative z-10 text-5xl text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
              animate={stage === 'launch' ? {
                y: [0, 20, -600],
                scale: [1, 0.9, 1.5],
                rotate: [0, -5, 0]
              } : {
                y: [0, -5, 0] // Floating in prep
              }}
              transition={stage === 'launch' ? {
                duration: 2,
                times: [0, 0.2, 1],
                ease: "easeInOut"
              } : {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🚀
              
              {/* Flame Tail (Visible on Launch) */}
              {stage === 'launch' && (
                <m.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: [0, 1, 0.8], height: [0, 60, 40] }}
                  transition={{ duration: 0.5 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full w-4 bg-gradient-to-b from-orange-400 via-red-500 to-transparent blur-sm rounded-full"
                />
              )}
            </m.div>

            {/* Particle Sparks (Trail) */}
            {stage === 'launch' && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                 {[...Array(10)].map((_, i) => (
                   <m.div
                     key={i}
                     className="absolute w-1 h-1 bg-cyan-300 rounded-full"
                     initial={{ opacity: 1, y: 0, x: 0 }}
                     animate={{ 
                       opacity: 0, 
                       y: 100 + Math.random() * 50, 
                       x: (Math.random() - 0.5) * 40 
                     }}
                     transition={{ duration: 1, delay: Math.random() * 0.5 }}
                   />
                 ))}
              </div>
            )}
          </m.div>
        )}

        {/* Scene 4: Success Confirmation */}
        {stage === 'success' && (
          <m.div
            className="flex flex-col items-center justify-center text-center p-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <m.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-green-400 to-cyan-500 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.4)] mb-4"
            >
              <FaCheck className="text-white text-3xl" />
            </m.div>
            
            <m.h3 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-white mb-1"
            >
              Subscription Successful <span className="inline-block animate-bounce">🚀</span>
            </m.h3>
            
            <m.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-cyan-200 text-sm"
            >
              Welcome to the future.
            </m.p>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubscriptionSuccess;
