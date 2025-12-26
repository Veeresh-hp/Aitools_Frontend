import React from "react";

const GlowBorder = ({
  children,
  className = "",
  color = ["#A07CFE", "#FE8FB5", "#FFBE7B"],
  borderRadius = 12,
  borderWidth = 2,
  duration = 4,
}) => {
  const gradientColors = [...color, color[0]]; // Close the loop
  
  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center ${className}`}
      style={{
        borderRadius: `${borderRadius}px`,
      }}
    >
      {/* Spinning Gradient Layer */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          background: `conic-gradient(from 0deg, ${gradientColors.join(", ")})`,
          animation: `spin ${duration}s linear infinite`,
          width: '200%',
          height: '200%',
          left: '-50%',
          top: '-50%',
        }}
      />
      
      {/* Content Container (Card) masking the center */}
      <div 
        className="relative bg-[#12121A] z-10 w-full h-full flex items-center justify-center"
        style={{
          borderRadius: `${borderRadius - borderWidth}px`,
          margin: `${borderWidth}px`,
        }}
      >
        {children}
      </div>
      
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default GlowBorder;