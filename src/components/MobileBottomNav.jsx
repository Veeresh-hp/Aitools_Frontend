import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FaHome, FaPlus, FaUser, FaHeart, FaEnvelope } from 'react-icons/fa';
import AccountMenu from './AccountMenu';

export default function MobileBottomNav() {
  const history = useHistory();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Configuration for the menu items matching app routes
  const menuItems = [
    { name: 'Home', icon: <FaHome size={22} />, path: '/' },
    { name: 'Favorites', icon: <FaHeart size={22} />, path: '/favorites' },
    { name: 'Add', icon: <FaPlus size={22} />, path: '/add-tool' },
    { name: 'Contact', icon: <FaEnvelope size={22} />, path: '/contact' },
    { name: 'Profile', isProfile: true, path: '/profile' }, // Profile uses AccountMenu
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const index = menuItems.findIndex(item => {
      // Exact match for root, startsWith for others
      if (item.path === '/') return currentPath === '/';
      return currentPath.startsWith(item.path);
    });
    // If no match (e.g. /history), we might want to unselect or maybe default to none? 
    // But for now, existing logic sets to 0 if not found which might be misleading.
    // Let's keep existing logic but arguably 0 is fallback.
    if (index !== -1) setActiveIndex(index);
    else setActiveIndex(0); 
  }, [location.pathname]);

  const handleNavigation = (index, path) => {
    setActiveIndex(index);
    history.push(path);
  };

  // Calculate mask position for "Dip" effect
  // 5 items -> each is 20% width. Center is at 10%, 30%, 50%, 70%, 90%.
  const maskPosition = `${activeIndex * 20 + 10}%`;

  // Scroll visibility logic
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Simple threshold to avoid jitter
      if (Math.abs(currentScrollY - lastScrollY.current) < 10) return;

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // Scrolling DOWN -> Hide
        setIsVisible(false);
      } else {
        // Scrolling UP -> Show
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isMobile) return null;

  const activeItem = menuItems[activeIndex];

  return (
    <div 
        className={`fixed bottom-0 left-0 right-0 z-50 flex justify-center items-end bg-transparent pointer-events-none px-2 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : 'translate-y-[120%]'}`}
    >
      {/* Structural Wrapper - No Mask */}
      <div className="relative w-full max-w-md mx-auto pointer-events-auto">
        
        {/* Floating Active Button - Sibling to bar so it's NOT masked */}
        <div 
            className="absolute bottom-[40px] left-0 h-14 w-[20%] z-50 flex justify-center transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
        >
             <div className={`w-14 h-14 bg-[#FF6B00] rounded-full shadow-lg shadow-orange-500/40 flex items-center justify-center text-white ${activeItem.isProfile ? 'pointer-events-auto' : ''}`}>
                 {activeItem.isProfile ? (
                     <div className="flex items-center justify-center w-full h-full">
                        <AccountMenu compact={true} transparent={true} />
                     </div>
                 ) : (
                     activeItem.icon
                 )}
             </div>
        </div>

        {/* 
          Main Bar Container - MASK APPLIED HERE 
          This contains the white background and the menu list.
        */}
        <div 
          className="relative w-full bg-[#0F0F0F] border-t border-white/10 h-[70px] rounded-t-[20px] shadow-[0_-5px_20px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            WebkitMaskImage: `radial-gradient(circle 38px at ${maskPosition} 0px, transparent 96%, black 100%)`,
            maskImage: `radial-gradient(circle 38px at ${maskPosition} 0px, transparent 96%, black 100%)`
          }}
        >
          {/* The Menu List */}
          <ul className="grid grid-cols-5 w-full h-full relative z-20">
            {menuItems.map((item, i) => {
              const isActive = i === activeIndex;
              
              // If this is the Profile item
              if (item.isProfile) {
                return (
                    <li key={i} className="relative w-full h-full flex items-center justify-center group">
                        {/* If inactive, show AccountMenu which handles its own click */}
                        <div 
                            className={`transition-all duration-300 transform ${isActive ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'}`}
                        >
                            <AccountMenu compact={true} transparent={true} />
                        </div>
                        
                        {/* Label logic - same as buttons */}
                         <span
                            className={`
                              absolute text-[11px] font-semibold tracking-wide transition-all duration-300 transform pointer-events-none
                              ${isActive 
                                ? 'opacity-100 translate-y-[20px] text-[#FF6B00]' 
                                : 'opacity-0 translate-y-[20px]'}
                            `}
                          >
                            {item.name}
                          </span>
                    </li>
                );
              }

              return (
                <li key={i} className="relative w-full h-full flex items-center justify-center group">
                  <button
                    className="flex flex-col items-center justify-center w-full h-full focus:outline-none pt-4"
                    onClick={() => handleNavigation(i, item.path)}
                  >
                    <span
                      className={`
                        absolute transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] z-40
                        ${isActive 
                          ? 'opacity-0 scale-50' 
                          : 'transform translate-y-0 text-gray-400 group-hover:text-[#FF6B00] opacity-100 scale-100'}
                      `}
                    >
                      {item.icon}
                    </span>
                    
                    <span
                      className={`
                        absolute text-[11px] font-semibold tracking-wide transition-all duration-300 transform
                        ${isActive 
                          ? 'opacity-100 translate-y-[12px] text-[#FF6B00]' 
                          : 'opacity-0 translate-y-[20px]'}
                      `}
                    >
                      {item.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

      </div>
    </div>
  );
}
