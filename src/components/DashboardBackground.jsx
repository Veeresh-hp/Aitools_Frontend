import React from 'react';
import { motion } from 'framer-motion';

const DashboardBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#050505] pointer-events-none">
      {/* Grid Layer */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(3)',
        }}
      />

      {/* Animated Data Streams */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent"
            style={{ left: `${20 * i + 10}%` }}
            animate={{
              y: ['-100%', '100%'],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Decorative HUD Elements */}
      {/* Top Left Corner */}
      <div className="absolute top-10 left-10">
        <svg width="200" height="100" viewBox="0 0 200 100" className="opacity-40">
          <path d="M0 0 L150 0 L200 50" stroke="#3b82f6" strokeWidth="2" fill="none" />
          <text x="10" y="20" fill="#3b82f6" fontFamily="monospace" fontSize="10">SYS.STATUS: ONLINE</text>
          <text x="10" y="35" fill="#3b82f6" fontFamily="monospace" fontSize="10">SEC.LEVEL: ALPHA</text>
          <rect x="10" y="45" width="50" height="5" fill="#3b82f6" opacity="0.5">
             <animate attributeName="width" values="10;50;30;50" dur="2s" repeatCount="indefinite" />
          </rect>
        </svg>
      </div>

      {/* Top Right Corner - CPU/Mem Stats */}
      <div className="absolute top-10 right-10 text-right">
        <svg width="200" height="100" viewBox="0 0 200 100" className="opacity-40">
           <path d="M200 0 L50 0 L0 50" stroke="#3b82f6" strokeWidth="2" fill="none" />
           <text x="190" y="20" textAnchor="end" fill="#3b82f6" fontFamily="monospace" fontSize="10">CPU_LOAD: 12%</text>
           <text x="190" y="35" textAnchor="end" fill="#3b82f6" fontFamily="monospace" fontSize="10">MEM_ALLOC: 4.2GB</text>
           <circle cx="180" cy="50" r="3" fill="#3b82f6">
             <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
           </circle>
        </svg>
      </div>

      {/* Bottom Left - Network Activity */}
      <div className="absolute bottom-10 left-10">
        <svg width="200" height="100" viewBox="0 0 200 100" className="opacity-40">
          <path d="M0 100 L150 100 L200 50" stroke="#3b82f6" strokeWidth="2" fill="none" />
          <polyline points="10,90 30,70 50,85 70,60 90,80 110,75" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
          <text x="10" y="50" fill="#3b82f6" fontFamily="monospace" fontSize="10">NET.TRAFFIC: STABLE</text>
        </svg>
      </div>

       {/* Bottom Right - Coordinates */}
      <div className="absolute bottom-10 right-10 text-right">
         <div className="font-mono text-xs text-blue-500/50 mb-1">COORDINATES</div>
         <div className="font-mono text-lg text-blue-400">
           <span className="inline-block w-20">34.0522° N</span>
           <span className="inline-block w-20">118.2437° W</span>
         </div>
      </div>

      {/* Central Ring Scanner */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" stroke="#3b82f6" strokeWidth="0.5" fill="none" strokeDasharray="5,5">
             <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="60s" repeatCount="indefinite" />
          </circle>
          <circle cx="50" cy="50" r="30" stroke="#3b82f6" strokeWidth="0.2" fill="none">
             <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="40s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
      
      {/* Soft Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#050505]" style={{ background: 'radial-gradient(circle at center, transparent 30%, #050505 100%)' }} />
    </div>
  );
};

export default DashboardBackground;
