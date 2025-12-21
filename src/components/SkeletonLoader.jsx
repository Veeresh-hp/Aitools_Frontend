import React from 'react';


// Tool Card Skeleton
export const ToolCardSkeleton = () => (
  <div className="relative bg-[#0F0F0F] rounded-2xl overflow-hidden border border-white/10">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" 
         style={{ 
           backgroundSize: '200% 100%',
           animation: 'shimmer 2s infinite linear'
         }} 
    />
    
    {/* Image Skeleton */}
    <div className="relative h-48 bg-white/5">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 animate-pulse" />
    </div>
    
    {/* Content Skeleton */}
    <div className="px-5 pt-4 pb-16">
      {/* Title Skeleton */}
      <div className="h-6 bg-white/10 rounded-lg mb-3 w-3/4 animate-pulse" />
      
      {/* Description Skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
        <div className="h-4 bg-white/5 rounded w-5/6 animate-pulse" />
      </div>
    </div>
    
    {/* Bottom badges skeleton */}
    <div className="absolute bottom-3 left-3 flex items-center gap-2">
      <div className="h-6 w-20 bg-white/10 rounded-lg animate-pulse" />
      <div className="h-6 w-16 bg-white/10 rounded-full animate-pulse" />
    </div>
  </div>
);

// Carousel Skeleton
export const CarouselSkeleton = () => (
  <div className="mb-16">
    {/* Header Skeleton */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="h-px flex-1 bg-white/10" />
        <div className="h-8 w-64 bg-white/10 rounded-lg animate-pulse" />
        <div className="h-px flex-1 bg-white/10" />
      </div>
      <div className="flex items-center justify-center gap-2">
        <div className="w-10 h-10 bg-white/10 rounded-full animate-pulse" />
        <div className="w-10 h-10 bg-white/10 rounded-full animate-pulse" />
      </div>
    </div>
    
    {/* Cards Skeleton */}
    <div className="flex gap-6 overflow-hidden px-4 sm:px-6 lg:px-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex-shrink-0 w-[280px]">
          <ToolCardSkeleton />
        </div>
      ))}
    </div>
  </div>
);

// Hero Section Skeleton
export const HeroSkeleton = () => (
  <section className="relative min-h-[60vh] flex items-center justify-center px-4 py-20">
    <div className="max-w-4xl mx-auto text-center space-y-6">
      {/* Title Skeleton */}
      <div className="h-16 bg-white/10 rounded-2xl w-3/4 mx-auto animate-pulse mb-4" />
      <div className="h-16 bg-white/10 rounded-2xl w-2/3 mx-auto animate-pulse mb-8" />
      
      {/* Search Bar Skeleton */}
      <div className="max-w-3xl mx-auto">
        <div className="h-16 bg-white/10 rounded-2xl animate-pulse" />
      </div>
    </div>
  </section>
);

// Tool Detail Page Skeleton
export const ToolDetailSkeleton = () => (
  <div className="min-h-screen bg-black">
    {/* Breadcrumb Skeleton */}
    <div className="bg-[#050505] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
          <span className="text-gray-600">/</span>
          <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
          <span className="text-gray-600">/</span>
          <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
    </div>
    
    {/* Main Content Skeleton */}
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Card Skeleton */}
      <div className="bg-[#0F0F0F] rounded-2xl p-8 mb-8 border border-white/10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Image Skeleton */}
          <div className="w-full lg:w-48 h-48 bg-white/5 rounded-xl animate-pulse flex-shrink-0" />
          
          {/* Content Skeleton */}
          <div className="flex-1 space-y-4">
            <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
            <div className="h-10 w-3/4 bg-white/10 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
              <div className="h-4 bg-white/5 rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-white/5 rounded w-4/5 animate-pulse" />
            </div>
            <div className="flex gap-3">
              <div className="h-10 w-32 bg-white/10 rounded-lg animate-pulse" />
              <div className="h-10 w-32 bg-white/10 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Description Section Skeleton */}
      <div className="bg-[#0F0F0F] rounded-2xl p-8 mb-8 border border-white/10">
        <div className="h-8 w-48 bg-white/10 rounded mb-4 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
          <div className="h-4 bg-white/5 rounded w-11/12 animate-pulse" />
          <div className="h-4 bg-white/5 rounded w-5/6 animate-pulse" />
        </div>
      </div>
      
      {/* Related Tools Skeleton */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-white/10 rounded mb-6 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#0F0F0F] rounded-xl overflow-hidden border border-white/10">
              <div className="h-40 bg-white/5 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-6 bg-white/10 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
                <div className="h-4 bg-white/5 rounded w-5/6 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Grid Section Skeleton
export const GridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ToolCardSkeleton key={i} />
    ))}
  </div>
);

// Add shimmer animation to global CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  
  .animate-shimmer {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
    background-size: 200% 100%;
    animation: shimmer 2s infinite linear;
  }
`;
document.head.appendChild(style);

export default {
  ToolCardSkeleton,
  CarouselSkeleton,
  HeroSkeleton,
  ToolDetailSkeleton,
  GridSkeleton
};
