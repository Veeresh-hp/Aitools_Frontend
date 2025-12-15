import React, { useEffect, useRef } from 'react';
import { m, useMotionValue } from 'framer-motion';

const TiltCard = ({ children, className = '', ...rest }) => {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    rotateX.set(-(y - centerY) / 15);
    rotateY.set((x - centerX) / 15);

    if (glowRef.current) {
      glowRef.current.style.left = `${x}px`;
      glowRef.current.style.top = `${y}px`;
    }
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    if (glowRef.current) {
      glowRef.current.style.left = `50%`;
      glowRef.current.style.top = `50%`;
    }
  };

  useEffect(() => {
    const handleOrientation = (event) => {
      const gamma = event.gamma;
      const beta = event.beta;
      const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
      rotateX.set(clamp(-beta / 4, -10, 10));
      rotateY.set(clamp(gamma / 4, -10, 10));
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [rotateX, rotateY]);

  return (
    <m.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={`relative overflow-hidden ${className}`}
      {...rest}
    >
      <div
        ref={glowRef}
        className="absolute w-32 h-32 bg-cyan-400 opacity-30 blur-2xl rounded-full pointer-events-none z-0"
        style={{ transform: 'translate(-50%, -50%)', left: '50%', top: '50%' }}
      />
      {children}
    </m.div>
  );
};

export default TiltCard;
