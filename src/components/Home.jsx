import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import FuseNamespace from 'fuse.js';
import { Player } from '@lottiefiles/react-lottie-player';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import toolsData from '../data/toolsData';
import ToolCard from './ToolCard';
import ToolDetailModal from './ToolDetailModal';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import MobileCategoryTabs from './MobileCategoryTabs';
import MobileTopNav from './MobileTopNav';
import MobileSortMenu from './MobileSortMenu';
import HeroHeading from './HeroHeading';
import ChatBot from './ChatBot';

// Derived category IDs (fallback if utility not present)
const CATEGORY_IDS = toolsData.map(c => c.id);

// --- ProCarousel Component (reconstructed) ---
const ProCarousel = ({
    items = [],
    label,
    emoji,
    centerHeader = false,
    labelClass = '',
    description = '',
    iconAnim,
    progressColor = 'bg-blue-500',
    renderCard = () => null,
    cardClassName = ''
}) => {
    const ref = useRef(null);
    const [scrollPos, setScrollPos] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Card metrics (approximate) used for momentum / auto scroll
    const CARD_WIDTH = 280;
    const CARD_GAP = 24;

    // Drag-to-scroll with momentum
    useEffect(() => {
        let isDragging = false, startX = 0, scrollLeft = 0, velocity = 0, lastX = 0, lastTime = 0;
        const el = ref.current;
        if (!el) return;

        const onMouseDown = (e) => {
            isDragging = true;
            startX = e.pageX - el.offsetLeft;
            scrollLeft = el.scrollLeft;
            lastX = e.pageX;
            lastTime = Date.now();
            velocity = 0;
            el.style.cursor = 'grabbing';
            el.style.userSelect = 'none';
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - el.offsetLeft;
            const walk = (x - startX) * 2;
            el.scrollLeft = scrollLeft - walk;
            const currentTime = Date.now();
            const timeDelta = currentTime - lastTime;
            if (timeDelta > 0) {
                velocity = (e.pageX - lastX) / timeDelta;
            }
            lastX = e.pageX;
            lastTime = currentTime;
        };

        const onMouseUp = () => {
            isDragging = false;
            el.style.cursor = 'grab';
            el.style.userSelect = 'auto';
            if (Math.abs(velocity) > 0.5) {
                const momentum = velocity * 100;
                el.scrollTo({ left: el.scrollLeft - momentum, behavior: 'smooth' });
            }
        };

        el.addEventListener('mousedown', onMouseDown);
        el.addEventListener('mousemove', onMouseMove);
        el.addEventListener('mouseleave', onMouseUp);
        el.addEventListener('mouseup', onMouseUp);

        return () => {
            el.removeEventListener('mousedown', onMouseDown);
            el.removeEventListener('mousemove', onMouseMove);
            el.removeEventListener('mouseleave', onMouseUp);
            el.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    // Auto-scroll with pause on hover
    useEffect(() => {
        if (!ref.current || isHovered || items.length <= 3) return;
        const el = ref.current;
        const interval = setInterval(() => {
            const maxScroll = el.scrollWidth - el.clientWidth;
            const currentScroll = el.scrollLeft;
            if (currentScroll >= maxScroll - 10) {
                el.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                el.scrollTo({ left: currentScroll + CARD_WIDTH + CARD_GAP, behavior: 'smooth' });
            }
        }, 4000);
        return () => clearInterval(interval);
    }, [isHovered, items.length]);

    // Scroll tracking
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const onScroll = () => {
            const l = el.scrollLeft;
            const max = el.scrollWidth - el.clientWidth;
            setScrollPos(l);
            setCanScrollLeft(l > 5);
            setCanScrollRight(l < max - 5);
        };
        el.addEventListener('scroll', onScroll);
        onScroll();
        return () => el.removeEventListener('scroll', onScroll);
    }, []);

    const handleArrow = (dir) => {
        if (!ref.current) return;
        const el = ref.current;
        const scrollAmount = (CARD_WIDTH + CARD_GAP) * 2;
        const newLeft = dir === 'left'
            ? Math.max(0, el.scrollLeft - scrollAmount)
            : Math.min(el.scrollWidth - el.clientWidth, el.scrollLeft + scrollAmount);
        el.scrollTo({ left: newLeft, behavior: 'smooth' });
    };

    const progress = ref.current && ref.current.scrollWidth > ref.current.clientWidth
        ? Math.min(1, Math.max(0.1, scrollPos / (ref.current.scrollWidth - ref.current.clientWidth)))
        : 0;

    if (!items || items.length === 0) return null;

    return (
        <m.section className="relative">
            {centerHeader ? (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50" style={{ color: labelClass?.includes('blue') ? '#60a5fa' : labelClass?.includes('yellow') ? '#fbbf24' : '#a78bfa' }} />
                        {emoji && <span className="text-3xl">{emoji}</span>}
                        <h2 className={`text-3xl font-bold ${labelClass}`}>{label}</h2>
                        {emoji && <span className="text-3xl">{emoji}</span>}
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50" style={{ color: labelClass?.includes('blue') ? '#60a5fa' : labelClass?.includes('yellow') ? '#fbbf24' : '#a78bfa' }} />
                    </div>
                    {items.length > 3 && (
                        <div className="flex items-center justify-center gap-2">
                            <button
                                className={`p-2 rounded-full transition-all duration-300 ${canScrollLeft ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-800/30 text-gray-600 cursor-not-allowed'}`}
                                onClick={() => handleArrow('left')} disabled={!canScrollLeft} aria-label="Scroll left"
                            >
                                <FaChevronLeft size={16} />
                            </button>
                            <button
                                className={`p-2 rounded-full transition-all duration-300 ${canScrollRight ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-800/30 text-gray-600 cursor-not-allowed'}`}
                                onClick={() => handleArrow('right')} disabled={!canScrollRight} aria-label="Scroll right"
                            >
                                <FaChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 flex items-center justify-center">
                                {typeof Player !== 'undefined' && Player ? (
                                    <Player autoplay loop src={iconAnim} style={{ height: '100%', width: '100%' }} rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }} />
                                ) : (
                                    <div className="w-full h-full bg-gray-800 rounded-md" />
                                )}
                            </div>
                            <div>
                                <h2 className={`text-3xl font-bold ${labelClass}`}>{label}</h2>
                                {description && (<p className="text-gray-400 text-sm mt-1">{description}</p>)}
                            </div>
                        </div>
                        {items.length > 3 && (
                            <div className="flex items-center gap-2">
                                <button
                                    className={`p-2 rounded-full transition-all duration-300 ${canScrollLeft ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-800/30 text-gray-600 cursor-not-allowed'}`}
                                    onClick={() => handleArrow('left')} disabled={!canScrollLeft} aria-label="Scroll left"
                                >
                                    <FaChevronLeft size={16} />
                                </button>
                                <button
                                    className={`p-2 rounded-full transition-all duration-300 ${canScrollRight ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-800/30 text-gray-600 cursor-not-allowed'}`}
                                    onClick={() => handleArrow('right')} disabled={!canScrollRight} aria-label="Scroll right"
                                >
                                    <FaChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div className="relative">
                <div
                    ref={ref}
                    className="flex gap-6 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4"
                    style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', cursor: 'grab' }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {items.map((tool, idx) => (
                        <div
                            key={tool.id || tool.name || idx}
                            className={`flex-shrink-0 w-[280px] snap-center ${cardClassName}`}
                        >
                            {renderCard(tool, idx)}
                        </div>
                    ))}
                </div>
                {items.length > 3 && (
                    <div className="mx-4 sm:mx-6 lg:mx-8 mt-4">
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                            <m.div
                                className={`h-full transition-all duration-300 ${progressColor} rounded-full`}
                                initial={{ width: '10%' }}
                                animate={{ width: `${Math.max(10, progress * 100)}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </m.section>
    );
};

// --- Filter Button Component ---
function FilterButton({ id, label, isActive, onClick, count }) {
    return (
        <m.button
            onClick={() => onClick(id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`group relative px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 border backdrop-blur-sm ${isActive ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-500/50 shadow-lg shadow-blue-500/25' : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-white'}`}
        >
            <span className="relative z-10 flex items-center gap-2">
                {label}
                {count > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-gray-700 text-gray-300 group-hover:bg-gray-600'}`}>
                        {count}
                    </span>
                )}
            </span>
            {isActive && (
                <m.div
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.2 }}
                />
            )}
        </m.button>
    );
}

// Typewriter Effect Hook
const useTypewriter = (text, speed = 100, startDelay = 1000) => {
    const [displayText, setDisplayText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [hasTyped, setHasTyped] = useState(false);

    useEffect(() => {
        // Reset hasTyped when text changes
        setHasTyped(false);
        setDisplayText('');
    }, [text]);

    useEffect(() => {
        // Only run the typewriter effect once per text
        if (hasTyped) return;

        let timeout;
        let interval;

        const startTyping = () => {
            setIsTyping(true);
            let i = 0;

            interval = setInterval(() => {
                if (i < text.length) {
                    setDisplayText(text.slice(0, i + 1));
                    i++;
                } else {
                    clearInterval(interval);
                    setIsTyping(false);
                    setHasTyped(true); // Mark as completed
                }
            }, speed);
        };

        timeout = setTimeout(startTyping, startDelay);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, [text, speed, startDelay, hasTyped]); // Added hasTyped to dependencies

    return { displayText, isTyping };
};

// --- Pricing Dropdown Component ---
const PricingDropdown = ({ activePricing, handlePricing }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const pricingOptions = [
        { value: 'all', label: 'All Resources', icon: '📚', color: 'text-blue-500' },
        { value: 'free', label: 'Free', icon: '⬅️', color: 'text-cyan-500' },
        { value: 'freemium', label: 'Freemium', icon: '⚡', color: 'text-yellow-500' },
        { value: 'open-source', label: 'Open Source', icon: '🧊', color: 'text-purple-500' },
        { value: 'paid', label: 'Paid', icon: '💲', color: 'text-green-500' }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getSelected = () => pricingOptions.find(opt => opt.value === activePricing) || pricingOptions[0];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all duration-200 flex items-center gap-2 min-w-[160px] justify-between shadow-lg"
            >
                <span className="flex items-center gap-2">
                    <span>{getSelected().icon}</span>
                    <span>{getSelected().label}</span>
                </span>
                <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 left-0 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 py-2 min-w-[220px] z-[9999] overflow-visible">
                    {pricingOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                handlePricing(option.value);
                                setIsOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-white/10 transition-all duration-150 ${activePricing === option.value ? 'bg-orange-500/20 border-l-4 border-orange-500' : ''
                                }`}
                        >
                            <span className="text-xl">{option.icon}</span>
                            <span className="text-sm font-medium text-white whitespace-nowrap">
                                {option.label}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Sort Dropdown Component ---
const SortDropdown = ({ sortBy, handleSort }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const sortOptions = [
        { value: 'date-added', label: 'Date Added' },
        { value: 'name', label: 'Name' }
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getSelected = () => sortOptions.find(opt => opt.value === sortBy) || sortOptions[0];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all duration-200 flex items-center gap-2 min-w-[160px] justify-between shadow-lg"
            >
                <span>{getSelected().label}</span>
                <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 right-0 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 py-2 min-w-[160px] z-[9999] overflow-visible">
                    {sortOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                handleSort(option.value);
                                setIsOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-white/10 transition-all duration-150 ${sortBy === option.value ? 'bg-orange-500/20 border-l-4 border-orange-500' : ''
                                }`}
                        >
                            <span className="text-sm font-medium text-white whitespace-nowrap">
                                {option.label}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};


// --- Main Home Component ---
const Home = () => {
    // nav-related state moved to a global Sidebar component

    // Show more categories state


    const [showAllCategories, setShowAllCategories] = useState(false);
    const [showAllStickyCategories, setShowAllStickyCategories] = useState(false);

    // --- Particles Init ---
    const [init, setInit] = useState(false);
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesOptions = useMemo(
        () => ({
            background: {
                color: {
                    value: "transparent",
                },
            },
            fpsLimit: 120,
            interactivity: {
                events: {
                    onClick: {
                        enable: true,
                        mode: "push",
                    },
                    onHover: {
                        enable: true,
                        mode: "repulse",
                    },
                    resize: true,
                },
                modes: {
                    push: {
                        quantity: 4,
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4,
                    },
                },
            },
            particles: {
                color: {
                    value: "#ffffff",
                },
                links: {
                    color: "#ffffff",
                    distance: 150,
                    enable: true,
                    opacity: 0.15, // Slightly lower opacity for global background
                    width: 1,
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: {
                        default: "bounce",
                    },
                    random: false,
                    speed: 0.8, // Slightly slower speed
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                        area: 800,
                    },
                    value: 60, // Slightly fewer particles
                },
                opacity: {
                    value: 0.2,
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 1, max: 2 },
                },
            },
            detectRetina: true,
        }),
        [],
    );

    const location = useLocation();
    const history = useHistory();
    // Modal state for detailed tool view
    const [selectedTool, setSelectedTool] = useState(null);

    const openModal = useCallback((tool) => {
        if (!tool) {
            console.error('Tool data is missing!');
            return;
        }
        setSelectedTool(tool);
    }, []);

    const closeModal = useCallback(() => {
        setSelectedTool(null);
    }, []);

    // Consistent navigation for both grid and list views
    const navigateToTool = useCallback((tool) => {
        if (!tool || !tool.name) return;
        if (tool.comingSoon) return;
        const toolSlug = tool.name.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
        const categorySlug = tool.category || 'all';
        history.push(`/tools/${categorySlug}/${toolSlug}`);
    }, [history]);

    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [activePricing, setActivePricing] = useState('all');
    const [sortBy, setSortBy] = useState('date-added');
    // Pagination & progressive loading
    const PAGE_SIZE = 30;
    const [page, setPage] = useState(1); // desktop pagination current page
    const [mobileVisibleCount, setMobileVisibleCount] = useState(PAGE_SIZE); // mobile progressive load
    const debounceRef = useRef(null);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(false);
    const [showStickyNav, setShowStickyNav] = useState(false);
    const stickyNavRef = useRef(null);
    const [stickyHeight, setStickyHeight] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(() => localStorage.getItem('sidebarOpen') === 'true');
    // Grid/List view mode for tools
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    // Reference to the hero/search section (non-sticky mobile nav will sit below it)
    const searchSectionRef = useRef(null);
    // Intersection trigger for Browse by Category heading
    const categoryHeadingRef = useRef(null);
    // Refs to detect outside-click for category chip groups (sticky and main)
    const stickyCatsRef = useRef(null);
    const mainCatsRef = useRef(null);

    // Scroll to top button visibility
    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setShowScrollTop(window.scrollY > 500);

                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Show sticky nav after you scroll past the "Browse by Category" heading; hide when you scroll back above it
    useEffect(() => {
        const target = categoryHeadingRef.current;
        if (!target) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                // If the heading is not intersecting and has moved past the top (negative top),
                // we are scrolled below it → show sticky nav. Otherwise hide.
                const shouldShow = !entry.isIntersecting && entry.boundingClientRect.top <= 0;
                setShowStickyNav(shouldShow);
                // Recalculate spacer height when toggling
                if (shouldShow && stickyNavRef.current) {
                    setStickyHeight(stickyNavRef.current.offsetHeight || 0);
                } else {
                    setStickyHeight(0);
                }
            },
            {
                threshold: 0,
                rootMargin: '0px 0px 0px 0px'
            }
        );
        observer.observe(target);
        return () => observer.disconnect();
    }, []);

    // Lock body scroll when the mobile categories sheet is open
    useEffect(() => {
        if (!isMobile) return;
        const prev = document.body.style.overflow;
        if (mobileSheetOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = prev || '';
        }
        return () => { document.body.style.overflow = prev || ''; };
    }, [mobileSheetOpen, isMobile]);

    // Collapse expanded category lists when clicking outside of category chip groups
    useEffect(() => {
        const onDocClick = (e) => {
            const target = e.target;
            const inSticky = stickyCatsRef.current && stickyCatsRef.current.contains(target);
            const inMain = mainCatsRef.current && mainCatsRef.current.contains(target);
            if (!inSticky && !inMain) {
                if (showAllStickyCategories) setShowAllStickyCategories(false);
                if (showAllCategories) setShowAllCategories(false);
            }
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, [showAllStickyCategories, showAllCategories]);

    // Horizontal scroll for sticky navbar categories (non-passive to prevent default page scroll)
    useEffect(() => {
        const el = stickyCatsRef.current;
        if (!el) return;

        let targetScroll = el.scrollLeft;
        let isAnimating = false;
        let animationFrameId;

        const ease = 0.1; // Smoothness factor (lower is smoother/slower)

        const animateScroll = () => {
            if (!el) return;

            // Linear interpolation
            const diff = targetScroll - el.scrollLeft;

            if (Math.abs(diff) < 0.5) {
                el.scrollLeft = targetScroll;
                isAnimating = false;
                return;
            }

            el.scrollLeft += diff * ease;
            animationFrameId = requestAnimationFrame(animateScroll);
        };

        const onWheel = (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();

                // Update target scroll position
                const maxScroll = el.scrollWidth - el.clientWidth;
                targetScroll = Math.max(0, Math.min(maxScroll, targetScroll + e.deltaY));

                if (!isAnimating) {
                    isAnimating = true;
                    // Sync target with current if we were stopped (prevents jumps if user scrolls after animation stopped)
                    // But here we want to accumulate, so we just start the loop.
                    // However, if we were stopped, targetScroll might be stale? 
                    // No, we just updated it based on current targetScroll. 
                    // Wait, if animation stopped, targetScroll == scrollLeft. 
                    // So we are good.
                    // Actually, better to re-sync targetScroll to current scrollLeft + delta if we were idle?
                    // No, because we want to maintain momentum if they scroll fast.
                    // But if they stopped scrolling for a while, targetScroll is already at scrollLeft.
                    // So it's fine.

                    // One edge case: if external scroll happened (e.g. drag), targetScroll might be wrong.
                    // So we should sync targetScroll on scroll event?
                    // But we are overriding wheel. Drag is handled by browser native or other handlers.
                    // Let's just sync targetScroll to el.scrollLeft + deltaY if not animating?
                    // If not animating, targetScroll IS el.scrollLeft (approximately).
                    // So let's just ensure we start from current position if we are starting fresh.
                    if (Math.abs(targetScroll - el.scrollLeft) > 100) {
                        // If we drifted too far (e.g. manual drag), reset target
                        targetScroll = el.scrollLeft + e.deltaY;
                    }

                    animateScroll();
                }
            }
        };

        // We also need to update targetScroll if the user scrolls manually (e.g. touch/drag)
        // so that the next wheel event doesn't jump back.
        const onScroll = () => {
            if (!isAnimating) {
                targetScroll = el.scrollLeft;
            }
        };

        el.addEventListener('wheel', onWheel, { passive: false });
        el.addEventListener('scroll', onScroll);

        return () => {
            el.removeEventListener('wheel', onWheel);
            el.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(animationFrameId);
        };
    }, [showStickyNav]);

    // Fallback scroll listener in case IntersectionObserver doesn't trigger (some edge browsers / dynamic layout changes)
    useEffect(() => {
        let ticking = false;
        const handleScrollFallback = () => {
            if (!categoryHeadingRef.current) return;
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const rect = categoryHeadingRef.current.getBoundingClientRect();
                    const shouldShow = rect.top <= 0; // show only when heading reaches/above top edge
                    setShowStickyNav(prev => {
                        if (prev !== shouldShow) {
                            if (shouldShow && stickyNavRef.current) {
                                setStickyHeight(stickyNavRef.current.offsetHeight || 0);
                            } else if (!shouldShow) {
                                setStickyHeight(0);
                            }
                        }
                        return shouldShow;
                    });
                    ticking = false;
                });
                ticking = true;
            }
        };
        // Initial check on mount
        handleScrollFallback();
        window.addEventListener('scroll', handleScrollFallback, { passive: true });
        return () => window.removeEventListener('scroll', handleScrollFallback);
    }, []);

    // Removed sticky mini nav observer; navbar will be static in the flow

    // Listen to sidebar open state broadcast so sticky nav can align beneath it and not obscure logo.
    useEffect(() => {
        const handler = (e) => {
            if (e && e.detail && typeof e.detail.open === 'boolean') {
                setSidebarOpen(e.detail.open);
            }
        };
        window.addEventListener('sidebar-state', handler);
        return () => window.removeEventListener('sidebar-state', handler);
    }, []);

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Mobile and Desktop placeholder texts with fade effect
    const mobilePlaceholderTexts = [
        'Search AI tools...',
        'Find the best ChatGPT alternatives...',
        'Discover new AI models...',
        'Type any tool name...',
        'Find aitools picks',
        'find Presentation ai'
    ];

    const desktopPlaceholderTexts = [
        'Search All AI tools and collections...',
        'Find AI coding assistants to speed up development...',
        'Discover faceless video tools for anonymous creators...',
        'Explore video generators for instant clips and edits...',
        'Find writing tools to draft, edit, and refine text...',
        'Search presentation tools to build slides quickly...',
        'Locate short clippers for creating video highlights...',
        'Discover marketing tools to grow your audience...',
        'Find voice tools for synthesis, dubbing, and editing...',
        'Search website builders for fast landing pages...',
        'Explore image generators for custom visuals...',
        'Find email assistance tools to write better emails...',
        'Search chatbots for customer support and chat flows...',
        'Discover user favorite tools loved by the community...',
        'Find text humanizer AI to make copy sound natural...',
        'Search spreadsheet tools for smarter data work...',
        'Find meeting notes tools to transcribe and summarize...',
        'Discover music generators to create original tracks...',
        'Search data analysis tools for insights and reports...',
        'Find AI diagrams to visualize processes and systems...',
        'Explore portfolio tools to showcase your work...',
        'Find AI scheduling tools to manage meetings easily...',
        'Search data visualization tools for beautiful charts...',
        'Discover gaming tools for AI-assisted game design...',
        'Find other tools across categories and utilities...',
        'Search utility tools for quick one-off tasks...',
        'Explore AI prompts to jumpstart creative workflows...',
        'Find AI design tools for layouts, mockups, and UX...',
        'Search logo generators to create brand marks fast...',
        'Discover social media tools for content and analytics...',
        'Find productivity tools to organize and automate work...',
        'Explore AI-powered product tools for feature discovery...',
        'Search for tools across categories, from A to Z...'
    ];

    const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
    const [placeholderFade, setPlaceholderFade] = useState(true);
    const [isPlaceholderPaused, setIsPlaceholderPaused] = useState(false);

    // Determine which placeholders to use based on screen size
    const activePlaceholders = isMobile ? mobilePlaceholderTexts : desktopPlaceholderTexts;
    const currentPlaceholderText = activePlaceholders[currentPlaceholderIndex];

    // Pause rotation when searching or input is focused
    useEffect(() => {
        setIsPlaceholderPaused(isSearchFocused || searchQuery.length > 0);
    }, [isSearchFocused, searchQuery]);

    // Rotate placeholder with fade effect - 4 seconds for both mobile and desktop
    useEffect(() => {
        if (isPlaceholderPaused) return; // Don't rotate if paused

        const fadeOutDuration = 300; // ms
        const displayDuration = 4000; // 4 seconds for both mobile and desktop
        const cycleDuration = displayDuration + fadeOutDuration;

        const timer = setInterval(() => {
            // Fade out
            setPlaceholderFade(false);

            // Change text after fade out
            setTimeout(() => {
                setCurrentPlaceholderIndex((prev) => (prev + 1) % activePlaceholders.length);
                // Fade in
                setPlaceholderFade(true);
            }, fadeOutDuration);
        }, cycleDuration);

        return () => clearInterval(timer);
    }, [isMobile, isPlaceholderPaused, activePlaceholders.length]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const rawUsername = localStorage.getItem('username');
    const username = rawUsername && rawUsername.trim() !== '' ? rawUsername : null;

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };
    // Fetch approved tools from backend - NON-BLOCKING
    const [approvedTools, setApprovedTools] = useState([]);
    // Robust API base: env var, else auto-detect for Vercel hosts, else localhost
    const API_URL = useMemo(() => {
        const envUrl = process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.trim();
        if (envUrl) return envUrl;
        try {
            const host = typeof window !== 'undefined' ? window.location.hostname : '';
            const isVercel = /vercel\.app$/.test(host);
            if (isVercel) return 'https://ai-tools-hub-backend-u2v6.onrender.com';
        } catch { }
        return 'http://localhost:5000';
    }, []);

    // Memoize slug function
    const toSlug = useCallback((val) => {
        try {
            return String(val || '')
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
        } catch {
            return '';
        }
    }, []);

    // Helper: build a favicon URL fallback when a tool has no snapshot image
    const getFaviconUrl = useCallback((url) => {
        try {
            if (!url) return null;
            const { hostname } = new URL(url);
            return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
        } catch {
            return null;
        }
    }, []);

    // Helper: choose best image source for any tool (snapshot -> provided image -> favicon)
    const getImageSrc = useCallback((tool) => {
        if (!tool) return null;
        if (tool.image) return tool.image;
        if (tool.url) return getFaviconUrl(tool.url);
        return null;
    }, [getFaviconUrl]);

    useEffect(() => {
        // Fetch in background without blocking UI
        const fetchApprovedTools = async () => {
            const tick = Math.floor(Date.now() / 60000); // bust cache every minute
            const base = `${API_URL}/api/tools/approved`;
            const url = `${base}?t=${tick}`;
            try {
                let res = await fetch(url, {
                    priority: 'low',
                    cache: 'no-store',
                    headers: { 'Cache-Control': 'no-cache' }
                });
                let json = await res.json();
                if (!(res.ok && json.tools && Array.isArray(json.tools))) {
                    // Fallback: try once more with a hard-bust timestamp
                    const url2 = `${base}?t=${Date.now()}`;
                    res = await fetch(url2, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } });
                    json = await res.json();
                }
                if (res.ok && json.tools && Array.isArray(json.tools)) {
                    const validTools = json.tools.filter(tool => tool && tool.name);
                    setApprovedTools(validTools);
                } else {
                    setApprovedTools([]);
                }
            } catch (err) {
                console.error('Failed to fetch approved tools:', err);
                setApprovedTools([]);
            }
        };
        // Fetch immediately without delay
        fetchApprovedTools();
    }, [API_URL]);

    // Convert approved tools from database to display format with NEW badge
    const convertedApprovedTools = useMemo(() => {
        console.log('🔄 Converting approved tools, count:', approvedTools.length);

        const buildSnapshotUrl = (snap) => {
            if (!snap) return null;
            try {
                if (/^https?:\/\//i.test(snap)) return snap;
                const withLeading = snap.startsWith('/') ? snap : `/${snap}`;
                return `${API_URL}${withLeading}`;
            } catch {
                return null;
            }
        };

        const converted = approvedTools
            .filter(tool => tool && tool.name)
            .map((tool) => {
                const snapshot = buildSnapshotUrl(tool.snapshotUrl);
                const fallback = !snapshot ? getFaviconUrl(tool.url) : null;
                const rawCategory = tool.category || 'utility-tools';
                const normalizedCategory = toSlug(rawCategory) || 'utility-tools';
                const parsed = Date.parse(tool.createdAt || tool.updatedAt || '');
                const safeTime = isNaN(parsed) ? Date.now() : parsed;

                return {
                    _id: tool._id,
                    name: tool.name,
                    shortDescription: tool.shortDescription || '',
                    description: tool.description || '',
                    link: tool.url || '#',
                    url: tool.url || '#',
                    image: snapshot || fallback || null,
                    isNew: true,
                    category: normalizedCategory,
                    dateAdded: safeTime,

                    pricing: tool.pricing || 'Freemium',
                    isAiToolsChoice: tool.isAiToolsChoice || false,
                };
            });
        return converted;
    }, [approvedTools, API_URL, getFaviconUrl, toSlug]);

    const mergedToolsData = useMemo(() => {
        const staticCategoriesMap = new Map(
            toolsData.map(cat => [cat.id, { ...cat, tools: [...cat.tools] }])
        );
        const newCategoriesMap = new Map();

        convertedApprovedTools.forEach(tool => {
            if (staticCategoriesMap.has(tool.category)) {
                staticCategoriesMap.get(tool.category).tools.push(tool);
            } else {
                if (!newCategoriesMap.has(tool.category)) {
                    const displayName = tool.category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                    newCategoriesMap.set(tool.category, {
                        id: tool.category,
                        name: displayName,
                        description: `Tools for ${displayName}`,
                        tools: []
                    });
                }
                newCategoriesMap.get(tool.category).tools.push(tool);
            }
        });
        return [...staticCategoriesMap.values(), ...newCategoriesMap.values()];
    }, [convertedApprovedTools]);

    // Mobile Categories (Sorted A-Z) - Derived from merged data to include server categories
    const mobileCategories = useMemo(() => {
        const allCats = mergedToolsData.map(cat => ({ id: cat.id, label: cat.name }));
        const sorted = allCats.sort((a, b) => a.label.localeCompare(b.label));
        return [{ id: 'all', label: 'Show All' }, ...sorted];
    }, [mergedToolsData]);

    const toolList = useMemo(() =>
        mergedToolsData.flatMap((category) =>
            category.tools.map((tool) => ({ ...tool, category: category.id }))
        ), [mergedToolsData]);

    const fuse = useMemo(() => {
        let FuseCtor = null;
        try {
            if (typeof FuseNamespace === 'function') FuseCtor = FuseNamespace;
            else if (FuseNamespace && FuseNamespace.default) FuseCtor = FuseNamespace.default;
            else FuseCtor = FuseNamespace;
        } catch (e) { FuseCtor = FuseNamespace; }

        try {
            return new FuseCtor(toolList, { keys: ['name', 'description', 'tags'], threshold: 0.4 });
        } catch (err) { return { search: () => [] }; }
    }, [toolList]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setActiveSuggestionIndex(-1);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            if (value.trim()) {
                const results = fuse.search(value).map((r) => r.item).filter(item => item && item.name);
                setSuggestions(results.slice(0, 5));
            } else { setSuggestions([]); }
        }, 150);
    };

    const filteredTools = useMemo(() => {
        let result = mergedToolsData
            .map((category) => ({
                ...category,
                tools: category.tools.filter((tool) => {
                    if (!tool || !tool.name) return false;
                    const searchLower = searchQuery.toLowerCase();
                    const matchesSearch = searchQuery
                        ? tool.name.toLowerCase().includes(searchLower) || (tool.description ? tool.description.toLowerCase() : '').includes(searchLower)
                        : true;
                    const matchesFilter = activeFilter === 'all' || category.id === activeFilter;
                    let matchesPricing = true;
                    if (activePricing !== 'all') {
                        const toolPricing = (tool.pricing || 'free').toLowerCase();
                        if (activePricing === 'free') matchesPricing = toolPricing === 'free';
                        else if (activePricing === 'freemium') matchesPricing = toolPricing === 'freemium';
                        else if (activePricing === 'paid') matchesPricing = toolPricing === 'paid';
                        else if (activePricing === 'open-source') matchesPricing = toolPricing === 'open source' || toolPricing === 'open-source';
                    }

                    // Special filter for Admin Choice
                    if (activeFilter === 'choice') {
                        return matchesSearch && matchesPricing && tool.isAiToolsChoice;
                    }

                    return matchesSearch && matchesFilter && matchesPricing;
                }),
            }))
            .filter((category) => category.tools.length > 0);

        if (sortBy === 'name') {
            result = result.map(category => ({
                ...category,
                tools: [...category.tools].filter(t => t && t.name).sort((a, b) => a.name.localeCompare(b.name))
            }));
        } else if (sortBy === 'date-added') {
            result = result.map(category => ({
                ...category,
                tools: [...category.tools].filter(t => t && t.name).sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0))
            }));
        }
        return result;
    }, [searchQuery, activeFilter, activePricing, sortBy, mergedToolsData]);

    const allToolsFlatSorted = useMemo(() => {
        const all = filteredTools.flatMap(category => category.tools.filter(t => t && t.name));
        if (sortBy === 'name') return [...all].sort((a, b) => a.name.localeCompare(b.name));
        return [...all].sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0));
    }, [filteredTools, sortBy]);

    useEffect(() => {
        const id = location.hash?.replace('#', '');
        if (!id) return;
        if (id === 'all') {
            setActiveFilter('all');
            setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 50);
            return;
        }
        if (id === 'choice') {
            setActiveFilter('choice');
            setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 50);
            return;
        }
        const allCategoryIds = mergedToolsData.map(c => c.id);
        if (allCategoryIds.includes(id)) {
            setActiveFilter(id);
            setTimeout(() => {
                const el = document.querySelector(`[data-category="${id}"]`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 80);
        }
    }, [location.hash, mergedToolsData]);

    useEffect(() => {
        setPage(1);
        setMobileVisibleCount(PAGE_SIZE);
        if (!isMobile) {
            const params = new URLSearchParams(location.search || '');
            if (params.get('page') !== '1') {
                params.set('page', '1');
                history.replace({ pathname: location.pathname, search: params.toString(), hash: location.hash });
            }
        }
    }, [searchQuery, activeFilter, activePricing, sortBy, isMobile, history, location.search, location.pathname, location.hash]);

    const updatePage = useCallback((next) => {
        if (isMobile) return;
        setPage(next);
        const params = new URLSearchParams(location.search || '');
        params.set('page', String(next));
        history.replace({ pathname: location.pathname || '/', search: params.toString(), hash: location.hash });
        setTimeout(() => {
            const toolsEl = document.getElementById('tools');
            if (toolsEl) toolsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
    }, [history, location.pathname, location.search, location.hash, isMobile]);

    const loadMoreMobile = useCallback(() => setMobileVisibleCount(c => c + PAGE_SIZE), []);

    const buildPageList = useCallback((totalPages, current) => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages = [];
        const add = (p) => { if (!pages.includes(p)) pages.push(p); };
        add(1);
        const windowStart = Math.max(2, current - 1);
        const windowEnd = Math.min(totalPages - 1, current + 1);
        if (windowStart > 2) pages.push('…');
        for (let p = windowStart; p <= windowEnd; p++) add(p);
        if (windowEnd < totalPages - 1) pages.push('…');
        add(totalPages);
        return pages;
    }, []);

    const trendingTools = useMemo(() => toolList.filter((t) => t.badge === 'Recommended'), [toolList]);
    const newTools = useMemo(() => toolList.filter((t) => t.isNew), [toolList]);
    const categories = useMemo(() => {
        const base = [{ id: 'all', name: 'All Tools' }, ...mergedToolsData];
        return base.map(cat => ({
            id: cat.id,
            label: cat.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        }));
    }, [mergedToolsData]);

    const debugMode = (() => {
        try { return new URLSearchParams(location.search || '').get('debug') === '1'; }
        catch { return false; }
    })();

    // Categories logic
    const curatedBase = [
        'all',
        'ai-coding-assistants',
        'faceless-video',
        'video-generators',
        'writing-tools',
        'presentation-tools',
        'short-clippers',
        'marketing-tools',
        'voice-tools',
        'website-builders',
        'image-generators',
        'email-assistance',
        'chatbots',
        'music-generators',
        'data-analysis',
        'gaming-tools',
        'ai-diagrams',
        'ai-scheduling',
        'data-visualization',
        'utility-tools',
        'Portfolio',
        'text-humanizer-ai',
        'meeting-notes',
        'spreadsheet-tools'
    ];

    const labelFor = (id) => (
        id === 'all' ? 'All' :
            id === 'ai-coding-assistants' ? 'Ai Coding Assistants' :
                id === 'faceless-video' ? 'Faceless Video' :
                    id === 'video-generators' ? 'Video Generators' :
                        id === 'writing-tools' ? 'Writing Tools' :
                            id === 'presentation-tools' ? 'Presentation Tools' :
                                id === 'short-clippers' ? 'Short Clippers' :
                                    id === 'marketing-tools' ? 'Marketing Tools' :
                                        id === 'voice-tools' ? 'Voice Tools' :
                                            id === 'website-builders' ? 'Website Builders' :
                                                id === 'image-generators' ? 'Image Generators' :
                                                    id === 'email-assistance' ? 'Email Assistance' :
                                                        id === 'chatbots' ? 'Chatbots' :
                                                            id === 'music-generators' ? 'Music Generators' :
                                                                id === 'data-analysis' ? 'Data Analysis' :
                                                                    id === 'gaming-tools' ? 'Gaming Tools' :
                                                                        id === 'ai-diagrams' ? 'Ai Diagrams' :
                                                                            id === 'ai-scheduling' ? 'Ai Scheduling' :
                                                                                id === 'data-visualization' ? 'Data Visualization' :
                                                                                    id === 'utility-tools' ? 'Utility Tools' :
                                                                                        id === 'Portfolio' ? 'Portfolio' :
                                                                                            id === 'text-humanizer-ai' ? 'Text Humanizer Ai' :
                                                                                                id === 'meeting-notes' ? 'Meeting Notes' :
                                                                                                    id === 'spreadsheet-tools' ? 'Spreadsheet Tools' :
                                                                                                        id === 'choice' ? 'Admin Choice' :
                                                                                                            id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    );

    const userCats = Array.from(new Set((convertedApprovedTools || []).map(t => t.category).filter(Boolean)));
    const dataCats = toolsData.map(c => c.id);
    const allSet = Array.from(new Set(['all', ...curatedBase.filter(id => id !== 'all'), ...dataCats, ...userCats]));
    const extra = allSet.filter(id => !curatedBase.includes(id));
    const collapsed = [...curatedBase, '__more__'];
    const expanded = [...curatedBase, ...extra];
    const categoriesToShow = showAllCategories ? expanded : collapsed;

    return (
        <>
            <LazyMotion features={domAnimation}>
                <div className="min-h-screen text-white relative overflow-hidden">
                    {debugMode && (
                        <div className="fixed top-2 left-2 z-[1000] p-3 rounded-lg bg-black/70 text-xs font-mono border border-white/20 shadow-lg space-y-1">
                            <div><strong>DEBUG</strong></div>
                            <div>API_URL: {API_URL}</div>
                            <div>approvedTools: {approvedTools.length}</div>
                            <div>convertedApprovedTools: {convertedApprovedTools.length}</div>
                            <div>merged toolList: {toolList.length}</div>
                            <div>activeFilter: {activeFilter}</div>
                            <div>searchQuery: {searchQuery || '(empty)'}</div>
                        </div>
                    )}
                    {/* Global Single Background for Entire Page */}
                    <div className="fixed inset-0 z-0">
                        {/* Base gradient background - Deep Navy Blue */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1d3a] via-[#252847] to-[#1a1d3a]" />
                        {/* Background image layer for Home page */}
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-60 animate-subtle-zoom"
                            style={{
                                backgroundImage: `url(${process.env.PUBLIC_URL || ''}/Images/home-bg.jpg)`,
                                transformOrigin: 'center center',
                                backgroundBlendMode: 'soft-light'
                            }}
                        />

                        {/* Radial gradient overlays for depth */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-600/15 via-transparent to-transparent" />
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600/15 via-transparent to-transparent" />
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-cyan-600/10 via-transparent to-transparent" />

                        {/* Subtle grid pattern - REPLACED with Moving Perspective Grid */}
                        <div
                            className="absolute inset-0 z-0 pointer-events-none opacity-10"
                            style={{
                                backgroundImage: `
                                linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
                                `,
                                backgroundSize: '60px 60px',
                                transform: 'perspective(500px) rotateX(20deg) scale(1.5)',
                                transformOrigin: 'top center',
                                animation: 'gridMove 20s linear infinite'
                            }}
                        />
                        <style>{`
                            @keyframes gridMove {
                                0% { background-position: 0 0; }
                                100% { background-position: 0 60px; }
                            }
                        `}</style>

                        {/* Animated gradient orbs - Enhanced with Framer Motion & Color Shift */}
                        <m.div
                            animate={{
                                x: [0, 50, -50, 0],
                                y: [0, -30, 30, 0],
                                scale: [1, 1.2, 0.9, 1],
                                filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"],
                            }}
                            transition={{
                                duration: 15,
                                repeat: Infinity,
                                repeatType: "mirror",
                                ease: "easeInOut",
                            }}
                            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl"
                        />
                        <m.div
                            animate={{
                                x: [0, -40, 40, 0],
                                y: [0, 40, -40, 0],
                                scale: [1, 1.1, 0.9, 1],
                                filter: ["hue-rotate(0deg)", "hue-rotate(-90deg)", "hue-rotate(0deg)"],
                            }}
                            transition={{
                                duration: 18,
                                repeat: Infinity,
                                repeatType: "mirror",
                                ease: "easeInOut",
                                delay: 1,
                            }}
                            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl"
                        />
                        <m.div
                            animate={{
                                x: [0, 60, -20, 0],
                                y: [0, -20, 50, 0],
                                scale: [1, 0.9, 1.1, 1],
                                filter: ["hue-rotate(0deg)", "hue-rotate(60deg)", "hue-rotate(0deg)"],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                repeatType: "mirror",
                                ease: "easeInOut",
                                delay: 2,
                            }}
                            className="absolute top-2/3 left-2/3 w-80 h-80 bg-cyan-600/12 rounded-full blur-3xl"
                        />

                        {/* Particles Layer */}
                        {init && (
                            <Particles
                                id="tsparticles"
                                options={particlesOptions}
                                className="absolute inset-0 z-0 pointer-events-none"
                            />
                        )}
                    </div >

                    {/* Sidebar has been moved to a global component (src/components/Sidebar.jsx) so it appears on every route */}

                    {/* Sticky Search & Filter Navbar - Compact Design (desktop only) */}
                    {
                        !isMobile && (
                            <m.div
                                initial={false}
                                animate={{
                                    y: showStickyNav ? 0 : -100,
                                    opacity: showStickyNav ? 1 : 0
                                }}
                                transition={{
                                    duration: 0.12,
                                    ease: "easeOut"
                                }}
                                className={`fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-[#1a1d3a]/98 to-[#252847]/98 backdrop-blur-xl border-b border-white/10 shadow-2xl overflow-visible ${showStickyNav ? 'pointer-events-auto' : 'pointer-events-none'}`}
                                style={{
                                    // Full width bar; interior padding accounts for sidebar width on desktop so content aligns visually.
                                    marginLeft: 0,
                                    willChange: 'transform, opacity'
                                }}
                                ref={stickyNavRef}
                            >
                                <div
                                    className="px-4 sm:px-6 lg:px-8"
                                    style={{
                                        paddingLeft: !isMobile ? (sidebarOpen ? 'calc(16rem + 1.5rem)' : 'calc(4.5rem + 1.5rem)') : undefined,
                                        transition: 'padding-left 0.3s cubic-bezier(.4,0,.2,1)'
                                    }}
                                >
                                    {/* Top Row: Categories Label + Show All Dropdown + Search */}
                                    <div className="flex items-center gap-4 py-3 border-b border-white/5">
                                        <span className="text-sm font-medium text-gray-400 whitespace-nowrap">Categories</span>
                                        {/* Search Bar with Suggestions */}
                                        <div className="relative flex-1 max-w-sm">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                                                <FaSearch className="text-gray-400 text-xs" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Search tools..."
                                                className="w-full pl-9 pr-10 py-2 text-sm text-white bg-[#1a1d3a]/60 placeholder-gray-400 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 focus:bg-[#1a1d3a]/80 hover:border-white/20 transition-all"
                                                value={searchQuery}
                                                onChange={handleInputChange}
                                                onFocus={() => setIsSearchFocused(true)}
                                                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'ArrowDown' && suggestions.length > 0) {
                                                        e.preventDefault();
                                                        setActiveSuggestionIndex(prev => prev < suggestions.length - 1 ? prev + 1 : 0);
                                                    } else if (e.key === 'ArrowUp' && suggestions.length > 0) {
                                                        e.preventDefault();
                                                        setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : suggestions.length - 1);
                                                    } else if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
                                                        e.preventDefault();
                                                        const selected = suggestions[activeSuggestionIndex];
                                                        setSearchQuery(selected.name);
                                                        setActiveFilter(selected.category);
                                                        setSuggestions([]);
                                                        setActiveSuggestionIndex(-1);
                                                    } else if (e.key === 'Escape') {
                                                        setSuggestions([]);
                                                        setActiveSuggestionIndex(-1);
                                                        e.target.blur();
                                                    }
                                                }}
                                            />
                                            {/* Clear Button */}
                                            {searchQuery && (
                                                <button
                                                    onClick={() => {
                                                        setSearchQuery('');
                                                        setSuggestions([]);
                                                        setActiveSuggestionIndex(-1);
                                                    }}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 p-1 hover:bg-white/10 rounded-full transition-all"
                                                    aria-label="Clear search"
                                                >
                                                    <svg className="w-4 h-4 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            )}

                                            {/* Search Suggestions Dropdown */}
                                            {isSearchFocused && suggestions.length > 0 && (
                                                <div className="absolute top-full mt-2 w-full bg-[#1a1d3a]/95 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden z-50 border border-white/10 max-h-80 overflow-y-auto">
                                                    {suggestions.slice(0, 8).map((suggestion, index) => (
                                                        <div
                                                            key={index}
                                                            className={`px-4 py-3 cursor-pointer transition-all border-b border-white/5 last:border-b-0 ${index === activeSuggestionIndex
                                                                ? 'bg-blue-600/20 text-white'
                                                                : 'hover:bg-white/5 text-gray-300'
                                                                }`}
                                                            onMouseDown={() => {
                                                                setSearchQuery(suggestion.name);
                                                                setActiveFilter(suggestion.category);
                                                                setSuggestions([]);
                                                                setActiveSuggestionIndex(-1);
                                                            }}
                                                            onMouseEnter={() => setActiveSuggestionIndex(index)}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <FaSearch className="text-blue-400 text-xs" />
                                                                <span className="font-medium text-sm">{suggestion.name}</span>
                                                                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400 ml-auto capitalize">
                                                                    {suggestion.category.replace(/-/g, ' ')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bottom Row: Category Pills */}
                                    <div className="py-3 overflow-x-auto scrollbar-hide">
                                        <div
                                            ref={stickyCatsRef}
                                            className="flex items-center gap-2 flex-nowrap"
                                        >
                                            {(() => {
                                                // Curated base order up to Chatbots
                                                const curatedBase = [
                                                    'all',
                                                    'ai-coding-assistants',
                                                    'faceless-video',
                                                    'video-generators',
                                                    'writing-tools',
                                                    'presentation-tools',
                                                    'short-clippers',
                                                    'marketing-tools',
                                                    'voice-tools',
                                                    'website-builders',
                                                    'image-generators',
                                                    'email-assistance',
                                                    'chatbots'
                                                ];

                                                // Build the complete category set from data + any user-added categories
                                                const dataCats = Array.from(new Set((toolsData || []).map(c => c.id).filter(Boolean)));
                                                const userCats = Array.from(new Set((convertedApprovedTools || []).map(t => t.category).filter(Boolean)));
                                                const allSet = Array.from(new Set(['all', ...curatedBase.filter(id => id !== 'all'), ...dataCats, ...userCats]));

                                                // Extra categories are anything beyond curated base + all
                                                const extra = allSet.filter(id => !curatedBase.includes(id));

                                                const finalCollapsed = [...curatedBase, '__more__'];
                                                const finalExpanded = [...curatedBase, ...extra];
                                                const categoriesToShow = showAllStickyCategories ? finalExpanded : finalCollapsed;

                                                const labelFor = (id) => (
                                                    id === 'all' ? 'All' :
                                                        id === 'ai-coding-assistants' ? 'Ai Coding Assistants' :
                                                            id === 'faceless-video' ? 'Faceless Video' :
                                                                id === 'video-generators' ? 'Video Generators' :
                                                                    id === 'writing-tools' ? 'Writing Tools' :
                                                                        id === 'presentation-tools' ? 'Presentation Tools' :
                                                                            id === 'short-clippers' ? 'Short Clippers' :
                                                                                id === 'marketing-tools' ? 'Marketing Tools' :
                                                                                    id === 'voice-tools' ? 'Voice Tools' :
                                                                                        id === 'website-builders' ? 'Website Builders' :
                                                                                            id === 'image-generators' ? 'Image Generators' :
                                                                                                id === 'email-assistance' ? 'Email Assistance' :
                                                                                                    id === 'chatbots' ? 'Chatbots' :
                                                                                                        id === 'music-generators' ? 'Music Generators' :
                                                                                                            id === 'data-analysis' ? 'Data Analysis' :
                                                                                                                id === 'gaming-tools' ? 'Gaming Tools' :
                                                                                                                    id === 'ai-diagrams' ? 'Ai Diagrams' :
                                                                                                                        id === 'ai-scheduling' ? 'Ai Scheduling' :
                                                                                                                            id === 'data-visualization' ? 'Data Visualization' :
                                                                                                                                id === 'utility-tools' ? 'Utility Tools' :
                                                                                                                                    id === 'Portfolio' ? 'Portfolio' :
                                                                                                                                        id === 'text-humanizer-ai' ? 'Text Humanizer Ai' :
                                                                                                                                            id === 'meeting-notes' ? 'Meeting Notes' :
                                                                                                                                                id === 'spreadsheet-tools' ? 'Spreadsheet Tools' :
                                                                                                                                                    id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                                                );

                                                return categoriesToShow.map((id) => {
                                                    if (id === '__more__') {
                                                        return (
                                                            <button
                                                                key="__more__"
                                                                onClick={() => setShowAllStickyCategories(true)}
                                                                className="px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-all bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 border border-white/10"
                                                                aria-label="Show more categories"
                                                            >
                                                                Show More
                                                            </button>
                                                        );
                                                    }
                                                    const isAll = id === 'all';
                                                    return (
                                                        <button
                                                            key={id}
                                                            onClick={() => setActiveFilter(id)}
                                                            className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-all ${isAll ? 'sticky left-0 z-20' : ''
                                                                } ${activeFilter === id
                                                                    ? 'bg-white text-black shadow-lg shadow-white/25'
                                                                    : 'bg-[#1a1d3a] text-gray-300 hover:bg-white/10 border border-white/10 hover:border-white/20'
                                                                }`}
                                                            style={isAll ? { boxShadow: '4px 0 12px -2px rgba(0,0,0,0.5)' } : {}}
                                                        >
                                                            {labelFor(id)}
                                                        </button>
                                                    );
                                                });
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </m.div>
                        )
                    }

                    {/* Spacer to prevent collision with content when sticky bar is visible */}
                    {
                        showStickyNav && (
                            <div aria-hidden="true" className="w-full" style={{ height: stickyHeight || 72 }} />
                        )
                    }

                    {/* Hero Section - Full Width Edge to Edge - NO GAPS */}
                    <section
                        ref={searchSectionRef}
                        className={`relative overflow-visible pt-20 sm:pt-6 pb-32 sm:pb-24 z-20 min-h-[600px] -mt-4 transition-opacity duration-300 ${showStickyNav ? 'opacity-0 pointer-events-none select-none' : 'opacity-100'}`}
                        aria-hidden={showStickyNav ? 'true' : 'false'}
                    >
                        {/* Google AI Mode Curved Gradient Lines */}
                        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                            {/* Top Left - Orange to Yellow (U-shaped curve) */}
                            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="none">
                                <path d="M -100 200 Q 300 80 800 220"
                                    stroke="url(#gradient-orange)"
                                    strokeWidth="2.5"
                                    fill="none"
                                    strokeLinecap="round"
                                    opacity="0.9" />
                                <defs>
                                    <linearGradient id="gradient-orange" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#FF9500" stopOpacity="0" />
                                        <stop offset="25%" stopColor="#FF9500" stopOpacity="1" />
                                        <stop offset="75%" stopColor="#FFD60A" stopOpacity="1" />
                                        <stop offset="100%" stopColor="#FFD60A" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            {/* Top Right - Red to Pink (inverted U-shaped curve) */}
                            <svg className="absolute top-0 right-0 w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="none">
                                <path d="M 2020 100 Q 1620 20 1120 180"
                                    stroke="url(#gradient-red)"
                                    strokeWidth="2.5"
                                    fill="none"
                                    strokeLinecap="round"
                                    opacity="0.9" />
                                <defs>
                                    <linearGradient id="gradient-red" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#FF3B30" stopOpacity="0" />
                                        <stop offset="25%" stopColor="#FF3B30" stopOpacity="1" />
                                        <stop offset="75%" stopColor="#FF69B4" stopOpacity="1" />
                                        <stop offset="100%" stopColor="#FF69B4" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            {/* Bottom Left - Green to Cyan (inverted U-shaped curve) */}
                            <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="none">
                                <path d="M -100 900 Q 300 1020 800 880"
                                    stroke="url(#gradient-green)"
                                    strokeWidth="2.5"
                                    fill="none"
                                    strokeLinecap="round"
                                    opacity="0.9" />
                                <defs>
                                    <linearGradient id="gradient-green" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#34C759" stopOpacity="0" />
                                        <stop offset="25%" stopColor="#34C759" stopOpacity="1" />
                                        <stop offset="75%" stopColor="#00C7BE" stopOpacity="1" />
                                        <stop offset="100%" stopColor="#00C7BE" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>

                            {/* Bottom Right - Blue to Purple (U-shaped curve) */}
                            <svg className="absolute bottom-0 right-0 w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="none">
                                <path d="M 2020 950 Q 1620 1040 1120 920"
                                    stroke="url(#gradient-blue)"
                                    strokeWidth="2.5"
                                    fill="none"
                                    strokeLinecap="round"
                                    opacity="0.9" />
                                <defs>
                                    <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#007AFF" stopOpacity="0" />
                                        <stop offset="25%" stopColor="#007AFF" stopOpacity="1" />
                                        <stop offset="75%" stopColor="#5E5CE6" stopOpacity="1" />
                                        <stop offset="100%" stopColor="#5E5CE6" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>

                        <div className="w-full relative z-10">
                            {/* Mobile Menu Toggle */}
                            {/* Removed mobile hamburger trigger (Sidebar replaced by bottom nav) */}
                            {false && isMobile && (
                                <m.button />
                            )}

                            <div className="text-center mb-6 sm:mb-16 relative px-3 sm:px-6 lg:px-8 pt-0 sm:pt-2 -mt-1 sm:mt-0">
                                {/* Floating AI Icons - Decorative */}
                                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                    {/* Top Left - Flask/Lab Icon */}
                                    <div className="absolute top-10 left-[10%] text-blue-500/40 animate-float" style={{ animationDelay: '0s' }}>
                                        <svg className="w-12 h-12 sm:w-16 sm:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                    </div>

                                    {/* Top Right - Share/Network Icon */}
                                    <div className="absolute top-16 right-[12%] text-orange-500/40 animate-float" style={{ animationDelay: '1s' }}>
                                        <svg className="w-14 h-14 sm:w-20 sm:h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                        </svg>
                                    </div>

                                    {/* Bottom Left - Rocket Icon */}
                                    <div className="absolute bottom-20 left-[8%] text-blue-400/30 animate-float" style={{ animationDelay: '2s' }}>
                                        <svg className="w-10 h-10 sm:w-14 sm:h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>

                                    {/* Right Side - Brain/AI Icon */}
                                    <div className="absolute top-1/3 right-[8%] text-purple-500/40 animate-float" style={{ animationDelay: '1.5s' }}>
                                        <svg className="w-12 h-12 sm:w-16 sm:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </div>

                                    {/* Left Side - Star Icon */}
                                    <div className="absolute top-1/2 left-[15%] text-cyan-400/30 animate-float" style={{ animationDelay: '0.5s' }}>
                                        <svg className="w-8 h-8 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                    </div>

                                    {/* Small dots scattered */}
                                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse" />
                                    <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-purple-400/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                                    <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-orange-400/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                                </div>

                                {/* Hero Text */}
                                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-0">
                                    {/* Small Badge - Hidden on mobile */}
                                    <div className="hidden sm:inline-flex items-center gap-2 px-4 py-2 mb-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                                        <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="text-sm text-gray-300 font-medium">Your Curated AI Resource Hub</span>
                                    </div>

                                    <HeroHeading />

                                    <p className="text-sm sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto mb-4 sm:mb-8 leading-relaxed font-normal">
                                        Expertly curated AI tools to boost your productivity, creativity, and decision-making.
                                        <br className="hidden sm:block" />
                                        Find and evaluate the right solutions for you.
                                    </p>

                                    {/* Stats Section */}
                                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-12 mb-4 sm:mb-8">
                                        <div className="text-center">
                                            <div className="text-2xl sm:text-4xl font-bold text-white mb-0.5">300+</div>
                                            <div className="text-xs sm:text-sm text-gray-400">AI Tools</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl sm:text-4xl font-bold text-white mb-0.5">99+</div>
                                            <div className="text-xs sm:text-sm text-gray-400">Use Cases</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl sm:text-4xl font-bold text-white mb-0.5">Weekly</div>
                                            <div className="text-xs sm:text-sm text-gray-400">Updates</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl sm:text-4xl font-bold text-white mb-0.5">100%</div>
                                            <div className="text-xs sm:text-sm text-gray-400">Curated</div>
                                        </div>
                                    </div>

                                    {/* Explore Tools Button */}
                                    <div className="flex justify-center mb-6 sm:mb-0">
                                        <m.button
                                            onClick={() => {
                                                if (isMobile) {
                                                    // On mobile, scroll to the category tabs section
                                                    const categoryTabs = document.querySelector('#mobile-category-tabs');
                                                    if (categoryTabs) {
                                                        categoryTabs.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                    } else {
                                                        // Fallback: scroll to the first category section
                                                        const firstCategory = document.querySelector('[data-category]');
                                                        if (firstCategory) {
                                                            firstCategory.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                        }
                                                    }
                                                } else {
                                                    const toolsSection = document.getElementById('tools');
                                                    if (toolsSection) {
                                                        toolsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                    }
                                                }
                                            }}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="group inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-xl text-white font-medium text-base border border-white/20 hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-xl"
                                        >
                                            <span>Explore Tools</span>
                                            <svg
                                                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </m.button>
                                    </div>
                                </div>
                            </div>

                            <style>{`
                  @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                  }
                  .animate-float {
                    animation: float 6s ease-in-out infinite;
                  }
                  @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                  }
                  @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                  }
                  .placeholder-fade-in {
                    animation: fadeIn 0.3s ease-in-out forwards;
                  }
                  .placeholder-fade-out {
                    animation: fadeOut 0.3s ease-in-out forwards;
                  }
                `}</style>

                            {/* Search Bar (Hero) */}
                            <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-12 mb-0 -mb-2 sm:mb-0 z-30">
                                <div
                                    className={`relative transition-all duration-300 ${isSearchFocused || isHovered ? 'transform scale-[1.02]' : ''}`}
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                >
                                    {/* Subtle Glow effect */}
                                    <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />

                                    <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300">
                                        <div className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10">
                                            <FaSearch className="text-gray-400 text-xl" />
                                        </div>
                                        <input
                                            id="hero-search-input"
                                            type="text"
                                            placeholder={currentPlaceholderText}
                                            className={`w-full pl-16 pr-14 py-6 text-lg text-white bg-transparent placeholder-gray-400 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/30 rounded-3xl transition-opacity duration-300 ${placeholderFade ? 'placeholder-fade-in' : 'placeholder-fade-out'}`}
                                            value={searchQuery}
                                            onFocus={() => setIsSearchFocused(true)}
                                            onBlur={() => setTimeout(() => setIsSearchFocused(false), 150)}
                                            onChange={handleInputChange}
                                            onKeyDown={(e) => {
                                                if (e.key === 'ArrowDown' && suggestions.length > 0) {
                                                    e.preventDefault();
                                                    setActiveSuggestionIndex(prev => prev < suggestions.length - 1 ? prev + 1 : 0);
                                                } else if (e.key === 'ArrowUp' && suggestions.length > 0) {
                                                    e.preventDefault();
                                                    setActiveSuggestionIndex(prev => prev > 0 ? prev - 1 : suggestions.length - 1);
                                                } else if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
                                                    e.preventDefault();
                                                    const selected = suggestions[activeSuggestionIndex];
                                                    setSearchQuery(selected.name);
                                                    setActiveFilter(selected.category);
                                                    setSuggestions([]);
                                                    setActiveSuggestionIndex(-1);
                                                } else if (e.key === 'Escape') {
                                                    setSuggestions([]);
                                                    setActiveSuggestionIndex(-1);
                                                    e.target.blur();
                                                }
                                            }}
                                        />
                                        {/* Clear Button */}
                                        {searchQuery && (
                                            <button
                                                onClick={() => {
                                                    setSearchQuery('');
                                                    setSuggestions([]);
                                                    setActiveSuggestionIndex(-1);
                                                }}
                                                className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10 p-2 hover:bg-white/10 rounded-full transition-all"
                                                aria-label="Clear search"
                                            >
                                                <svg className="w-5 h-5 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Suggestions */}
                                {isSearchFocused && suggestions.length > 0 && (
                                    <div className="absolute top-full mt-3 w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-700/50 backdrop-blur-xl">
                                        {suggestions.map((suggestion, index) => (
                                            <div
                                                key={index}
                                                className={`px-6 py-4 cursor-pointer transition-all duration-200 border-b border-gray-700/30 last:border-b-0 ${index === activeSuggestionIndex
                                                    ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white'
                                                    : 'hover:bg-gray-700/30 text-gray-300'
                                                    }`}
                                                onMouseDown={() => {
                                                    setSearchQuery(suggestion.name);
                                                    setActiveFilter(suggestion.category);
                                                    setSuggestions([]);
                                                    setActiveSuggestionIndex(-1);
                                                }}
                                                onMouseEnter={() => setActiveSuggestionIndex(index)}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <FaSearch className="text-blue-400 text-sm" />
                                                    <span className="font-semibold">{suggestion.name}</span>
                                                    <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-400 ml-auto capitalize">
                                                        {suggestion.category.replace(/-/g, ' ')}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section >

                    {/* Mobile Top Nav - Logo + Categories/Picks (Mobile Only) */}
                    {
                        isMobile && (
                            <MobileTopNav
                                categories={mobileCategories}
                                onCategorySelect={(id) => {
                                    setActiveFilter(id);
                                    setTimeout(() => {
                                        if (id === 'all') {
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        } else {
                                            const el = document.querySelector(`[data-category="${id}"]`);
                                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }
                                    }, 50);
                                }}
                                onChoiceClick={() => {
                                    setActiveFilter('choice');
                                    history.push('/#choice');
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                onLogoClick={() => {
                                    setActiveFilter('all');
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            />
                        )
                    }

                    {/* Mobile Top Margin (accounts for fixed MobileTopNav) */}
                    {isMobile && <div className="h-16 md:hidden" />}

                    {/* Mobile Tools FAB and Categories Drop-up – removed in favor of MobileCategoryTabs */}

                    {/* Mobile Category Tabs (static, non-sticky) */}
                    {
                        isMobile && (
                            <div className="px-0">
                                <MobileCategoryTabs
                                    categories={[
                                        { id: 'all', label: "New Tools" },
                                        { id: 'chatbots', label: 'ChatGPT Alternatives' },
                                        { id: 'ai-coding-assistants', label: 'AI Coding Assistants' },
                                        ...categories.filter(c => !['all', 'chatbots', 'ai-coding-assistants'].includes(c.id)).slice(0, 5)
                                    ]}
                                    activeId={activeFilter}
                                    onSelect={(id) => {
                                        setActiveFilter(id);
                                        setTimeout(() => {
                                            if (id === 'all') {
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            } else {
                                                const el = document.querySelector(`[data-category="${id}"]`);
                                                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                            }
                                        }, 50);
                                    }}
                                />
                            </div>
                        )
                    }

                    {/* Main Content */}
                    <div className={`transition-all duration-300 relative z-10 ${isMobile ? '' : 'ml-20'}`}>
                        {/* Layout wrapper for rest of content: centered content */}
                        <div className="flex justify-center gap-6 px-4">
                            {/* Centered main content area */}
                            <main className="w-full max-w-5xl">
                                {/* Carousels Section - Only show when no search query (now treated as part of What's New) */}
                                {!searchQuery && activeFilter === 'all' && (
                                    <m.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ duration: 0.5 }}
                                        className="relative pt-2 sm:pt-8 pb-6 sm:pb-8 space-y-4 sm:space-y-6 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent"
                                    >
                                        {/* Subtle background accent - only on mobile */}
                                        {isMobile && <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.03] to-transparent pointer-events-none" />}
                                        {/* Latest Tools Carousel - Sorted by Date */}
                                        <div className="relative -mb-2 sm:mb-0">
                                            {/* Decorative line accent */}
                                            <div className="absolute top-0 left-0 w-32 h-[2px] bg-gradient-to-r from-blue-500 to-transparent" />
                                            <ProCarousel
                                                items={[...toolList]
                                                    .filter(t => t && t.name && t.dateAdded)
                                                    .sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0))
                                                    .slice(0, 20)}
                                                label="Latest Additions"
                                                emoji="🆕"
                                                centerHeader={true}
                                                labelClass="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent"
                                                progressColor="bg-gradient-to-r from-blue-500 to-teal-500"
                                                renderCard={(tool) => (
                                                    <ToolCard tool={tool} openModal={openModal} />
                                                )}
                                            />
                                        </div>

                                        {/* Recommended Tools Carousel - Hidden when viewing Picks only */}
                                        {trendingTools.length > 0 && (
                                            <div className="relative -mt-2 sm:mt-0" id="picks-section" data-category="__picks__">
                                                {/* Decorative line accent */}
                                                <div className="absolute top-0 right-0 w-32 h-[2px] bg-gradient-to-l from-orange-500 to-transparent" />
                                                <ProCarousel
                                                    items={trendingTools}
                                                    label="Recommended Tools"
                                                    emoji="⭐"
                                                    centerHeader={true}
                                                    labelClass="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent"
                                                    progressColor="bg-gradient-to-r from-yellow-500 to-orange-500"
                                                    renderCard={(tool) => (
                                                        <ToolCard tool={tool} openModal={openModal} />
                                                    )}
                                                />
                                            </div>
                                        )}
                                    </m.div>
                                )}

                                {/* Category Filter Buttons - Hidden on Mobile (replaced by tabs) */}
                                {!isMobile && (
                                    <section className="relative px-4 sm:px-6 lg:px-8 pb-8">
                                        <div className="max-w-7xl mx-auto relative">
                                            {/* Section Title */}
                                            <div ref={categoryHeadingRef} className="text-center mb-10">
                                                <h3 className="text-2xl font-semibold text-white mb-2">Browse by Category</h3>
                                                <p className="text-gray-400 text-sm">Explore tools organized by their purpose</p>
                                            </div>

                                            <div ref={mainCatsRef} className="flex flex-wrap justify-center gap-3">
                                                {categoriesToShow.map((id) => {
                                                    if (id === '__more__') {
                                                        return (
                                                            <button
                                                                key="__more__"
                                                                onClick={() => setShowAllCategories(true)}
                                                                className="px-5 py-3 text-sm font-medium rounded-full transition-all duration-300 bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 hover:scale-105"
                                                                aria-label="Show more categories"
                                                            >
                                                                Show More
                                                            </button>
                                                        );
                                                    }
                                                    return (
                                                        <button
                                                            key={id}
                                                            onClick={() => {
                                                                setActiveFilter(id);
                                                                const el = document.querySelector(`[data-category="${id}"]`);
                                                                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                            }}
                                                            className={`px-5 py-3 text-sm font-medium rounded-full transition-all duration-300 border ${activeFilter === id
                                                                ? 'bg-white text-blue-900 border-white shadow-lg scale-105'
                                                                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:border-white/30'
                                                                }`}
                                                        >
                                                            {labelFor(id)}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                        </div>
                                    </section>
                                )}

                                {/* Tools Grid Section */}
                                <m.section
                                    id="tools"
                                    className="relative px-4 sm:px-6 lg:px-8 py-12"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.6 }}
                                >
                                    {/* Breadcrumb Navigation */}
                                    {activeFilter !== 'all' && (
                                        <div className="max-w-7xl mx-auto mb-6 relative">
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <button onClick={() => setActiveFilter('all')} className="hover:text-white transition-colors">
                                                    Home
                                                </button>
                                                <span>/</span>
                                                <span className="text-white capitalize">{activeFilter.replace(/-/g, ' ')}</span>
                                            </div>
                                        </div>
                                    )}

                                    <style>{`
                @keyframes subtle-zoom {
                  0%, 100% { transform: scale(1); }
                  50% { transform: scale(1.05); }
                }
                @keyframes grid-move {
                  0% { background-position: 0 0; }
                  100% { background-position: 50px 50px; }
                }
                @keyframes pulse-glow {
                  0%, 100% { opacity: 0.3; transform: scale(1); }
                  50% { opacity: 0.5; transform: scale(1.1); }
                }
                @keyframes pulse-glow-delayed {
                  0%, 100% { opacity: 0.4; transform: scale(1); }
                  50% { opacity: 0.6; transform: scale(1.15); }
                }
                .animate-subtle-zoom {
                  animation: subtle-zoom 25s ease-in-out infinite;
                }
                .animate-pulse-glow {
                  animation: pulse-glow 6s ease-in-out infinite;
                }
                .animate-pulse-glow-delayed {
                  animation: pulse-glow-delayed 8s ease-in-out infinite;
                }
              `}</style>

                                    <div className="max-w-7xl mx-auto relative">
                                        {/* Pricing/Sort Controls - above tools */}
                                        <div className={`flex items-center justify-between px-2 relative z-30 ${isMobile ? 'mb-4' : 'mb-8'}`}>
                                            {/* Left group: Pricing + Count */}
                                            <div className="flex items-center gap-2">
                                                {/* Mobile: single combined Sort button replaces "All Resources"; Desktop: Pricing dropdown */}
                                                {isMobile ? (
                                                    <div className="origin-left scale-95 ml-2">
                                                        <MobileSortMenu
                                                            activePricing={activePricing}
                                                            setActivePricing={setActivePricing}
                                                            sortBy={sortBy}
                                                            setSortBy={setSortBy}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <PricingDropdown
                                                            activePricing={activePricing}
                                                            handlePricing={setActivePricing}
                                                        />
                                                    </div>
                                                )}
                                                {/* Hide count on mobile per request */}
                                                {!isMobile && (
                                                    <span className="text-lg font-medium text-white select-none">
                                                        {`${filteredTools.reduce((acc, cat) => acc + cat.tools.length, 0)} Tools Found`}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Right group: View toggle + Sort (compact on mobile) */}
                                            <div className="flex items-center gap-2">
                                                {/* Grid/List View Toggle */}
                                                <button
                                                    onClick={() => setViewMode(prev => (prev === 'grid' ? 'list' : 'grid'))}
                                                    title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
                                                    className={`backdrop-blur-md text-white rounded-lg border transition-all duration-200 ${isMobile ? 'p-1.5' : 'p-2'
                                                        } ${viewMode === 'grid' ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-blue-600/20 border-blue-400/30 hover:bg-blue-600/30'
                                                        }`}
                                                    aria-label={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
                                                >
                                                    {viewMode === 'grid' ? (
                                                        <svg className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                                        </svg>
                                                    ) : (
                                                        <svg className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M4 6h16a1 1 0 000-2H4a1 1 0 000 2zm0 7h16a1 1 0 000-2H4a1 1 0 000 2zm0 7h16a1 1 0 000-2H4a1 1 0 000 2z" />
                                                        </svg>
                                                    )}
                                                </button>

                                                {/* Sort Dropdown (hidden on mobile because combined menu handles it) */}
                                                {!isMobile && (
                                                    <div>
                                                        <SortDropdown
                                                            sortBy={sortBy}
                                                            handleSort={setSortBy}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Tools Grid */}
                                        <div>
                                            {isMobile && activeFilter === 'all' ? (
                                                // What's New (renamed from For You; uses 'all' id)
                                                (() => {
                                                    let allNew = [...newTools];

                                                    // Apply Pricing Filter
                                                    if (activePricing !== 'all') {
                                                        allNew = allNew.filter(tool => {
                                                            const toolPricing = (tool.pricing || 'free').toLowerCase();
                                                            if (activePricing === 'free') return toolPricing === 'free';
                                                            if (activePricing === 'freemium') return toolPricing === 'freemium';
                                                            if (activePricing === 'paid') return toolPricing === 'paid';
                                                            if (activePricing === 'open-source') return toolPricing === 'open source' || toolPricing === 'open-source';
                                                            return true;
                                                        });
                                                    }

                                                    // Apply Sort
                                                    if (sortBy === 'name') {
                                                        allNew.sort((a, b) => a.name.localeCompare(b.name));
                                                    } else {
                                                        allNew.sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0));
                                                    }
                                                    const total = allNew.length;
                                                    const displayed = isMobile ? allNew.slice(0, mobileVisibleCount) : allNew;
                                                    return (
                                                        <div className="mb-12">
                                                            <div className="flex items-center gap-3 mb-8 px-2 relative">
                                                                <div className="w-1 h-10 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg" />
                                                                <h2 className="text-3xl font-bold text-white">New Tools</h2>
                                                            </div>
                                                            {viewMode === 'grid' ? (
                                                                <>
                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                                        {displayed.map((tool, idx) => (
                                                                            <div key={`${tool.name}-${tool.dateAdded || idx}`}>
                                                                                <ToolCard tool={tool} openModal={openModal} />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    {isMobile && mobileVisibleCount < total && (
                                                                        <div className="mt-8 flex justify-center">
                                                                            <button onClick={loadMoreMobile} className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium backdrop-blur-md border border-white/20 hover:border-white/30 transition-all">Load More ({Math.min(mobileVisibleCount + PAGE_SIZE, total)}/{total})</button>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className="space-y-4">
                                                                        {displayed.map((tool, idx) => (
                                                                            <article key={`${tool.name}-${tool.dateAdded || idx}`} className="flex items-start gap-5 p-4 rounded-xl bg-gray-900/40 border border-white/10 hover:border-blue-500/30 hover:bg-white/5 transition-all cursor-pointer" onClick={() => navigateToTool(tool)}>
                                                                                <div className="w-48 h-28 flex-shrink-0 overflow-hidden rounded-lg bg-black/30">
                                                                                    {(() => {
                                                                                        const src = getImageSrc(tool);
                                                                                        if (!src) { return (<div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No Image</div>); }
                                                                                        return (
                                                                                            <img src={src} alt={tool.name} className="w-full h-full object-cover" loading="lazy" onError={(e) => {
                                                                                                try {
                                                                                                    const current = e.currentTarget.getAttribute('src') || '';
                                                                                                    if (current.includes('/images/')) { e.currentTarget.onerror = null; e.currentTarget.src = current.replace('/images/', '/Images/'); }
                                                                                                    else { e.currentTarget.style.display = 'none'; }
                                                                                                } catch { }
                                                                                            }} />
                                                                                        );
                                                                                    })()}
                                                                                </div>
                                                                                <div className="flex-1 min-w-0">
                                                                                    <div className="flex items-start justify-between gap-3">
                                                                                        <h3 className="text-lg font-semibold text-white truncate">{tool.name}</h3>
                                                                                        {tool.dateAdded && (<span className="text-xs text-gray-400 whitespace-nowrap">{new Date(tool.dateAdded).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>)}
                                                                                    </div>
                                                                                    <p className="mt-1 text-sm text-gray-300 line-clamp-2">{tool.description}</p>
                                                                                </div>
                                                                            </article>
                                                                        ))}
                                                                    </div>
                                                                    {isMobile && mobileVisibleCount < total && (
                                                                        <div className="mt-8 flex justify-center">
                                                                            <button onClick={loadMoreMobile} className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium backdrop-blur-md border border-white/20 hover:border-white/30 transition-all">Load More ({Math.min(mobileVisibleCount + PAGE_SIZE, total)}/{total})</button>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    )
                                                })()
                                            ) : filteredTools.length === 0 ? (
                                                <div className="text-center py-20">
                                                    {typeof Player !== 'undefined' && Player ? (
                                                        <Player autoplay loop src="https://assets4.lottiefiles.com/packages/lf20_pNx6yH.json" style={{ height: '150px', width: '150px', margin: '0 auto' }} />
                                                    ) : (
                                                        <div style={{ height: 150, width: 150, margin: '0 auto' }} className="bg-gray-800 rounded-md" />
                                                    )}
                                                    <h3 className="text-2xl font-semibold text-white mt-4">No Tools Found</h3>
                                                    <p className="text-gray-400 mt-2">Try adjusting your search or filter to find what you're looking for.</p>
                                                </div>
                                            ) : (
                                                <>
                                                    {activeFilter === 'all' && (
                                                        <div className="mb-12">
                                                            <div className="flex items-center gap-3 mb-8 px-2 relative">
                                                                <div className="w-1 h-10 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg shadow-blue-500/50" />
                                                                <h2 className="text-3xl font-bold text-white">All AI Tools</h2>
                                                                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-transparent" />
                                                            </div>
                                                            {(() => {
                                                                const allTools = allToolsFlatSorted;
                                                                const total = allTools.length;
                                                                let displayed = allTools;
                                                                if (isMobile) {
                                                                    displayed = allTools.slice(0, mobileVisibleCount);
                                                                } else {
                                                                    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
                                                                    const currentPage = Math.min(page, totalPages);
                                                                    const start = (currentPage - 1) * PAGE_SIZE;
                                                                    const end = start + PAGE_SIZE;
                                                                    displayed = allTools.slice(start, end);
                                                                }
                                                                if (viewMode === 'grid') {
                                                                    return (
                                                                        <>
                                                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                                                {displayed.map((tool, idx) => (
                                                                                    <div key={`${tool.name}-${tool.dateAdded || idx}`}>
                                                                                        <ToolCard tool={tool} openModal={openModal} />
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                            {isMobile && mobileVisibleCount < total && (
                                                                                <div className="mt-8 flex justify-center">
                                                                                    <button onClick={loadMoreMobile} className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium backdrop-blur-md border border-white/20 hover:border-white/30 transition-all">Load More ({Math.min(mobileVisibleCount + PAGE_SIZE, total)}/{total})</button>
                                                                                </div>
                                                                            )}
                                                                            {!isMobile && total > PAGE_SIZE && (
                                                                                <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
                                                                                    <button onClick={() => updatePage(Math.max(1, page - 1))} disabled={page === 1} aria-label="Previous page" className={`px-3 py-2 rounded-lg text-sm border transition-colors ${page === 1 ? 'border-white/10 text-gray-500 cursor-not-allowed' : 'border-white/20 hover:border-white/40 hover:bg-white/10 text-white'}`}>Prev</button>
                                                                                    {buildPageList(Math.ceil(total / PAGE_SIZE), page).map((p, i) => (
                                                                                        p === '…' ? (
                                                                                            <span key={`dots-${i}`} className="px-2 py-2 text-sm text-gray-400">…</span>
                                                                                        ) : (
                                                                                            <button key={`page-${p}`} onClick={() => updatePage(p)} aria-current={p === page ? 'page' : undefined} className={`px-3 py-2 rounded-lg text-sm border transition-colors ${p === page ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-500/60 shadow-lg' : 'border-white/20 text-white hover:bg-white/10 hover:border-white/40'}`}>{p}</button>
                                                                                        )
                                                                                    ))}
                                                                                    <button onClick={() => updatePage(Math.min(Math.ceil(total / PAGE_SIZE), page + 1))} disabled={page >= Math.ceil(total / PAGE_SIZE)} aria-label="Next page" className={`px-3 py-2 rounded-lg text-sm border transition-colors ${page >= Math.ceil(total / PAGE_SIZE) ? 'border-white/10 text-gray-500 cursor-not-allowed' : 'border-white/20 hover:border-white/40 hover:bg-white/10 text-white'}`}>Next</button>
                                                                                </div>
                                                                            )}
                                                                        </>
                                                                    );
                                                                }
                                                                return (
                                                                    <>
                                                                        <div className="space-y-4">
                                                                            {displayed.map((tool, idx) => (
                                                                                <article key={`${tool.name}-${tool.dateAdded || idx}`} className="flex items-start gap-5 p-4 rounded-xl bg-gray-900/40 border border-white/10 hover:border-blue-500/30 hover:bg-white/5 transition-all cursor-pointer" onClick={() => navigateToTool(tool)}>
                                                                                    <div className="w-48 h-28 flex-shrink-0 overflow-hidden rounded-lg bg-black/30">
                                                                                        {(() => {
                                                                                            const src = getImageSrc(tool);
                                                                                            if (!src) { return (<div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No Image</div>); }
                                                                                            return (
                                                                                                <img src={src} alt={tool.name} className="w-full h-full object-cover" loading="lazy" onError={(e) => {
                                                                                                    try {
                                                                                                        const current = e.currentTarget.getAttribute('src') || '';
                                                                                                        if (current.includes('/images/')) { e.currentTarget.onerror = null; e.currentTarget.src = current.replace('/images/', '/Images/'); }
                                                                                                        else { e.currentTarget.style.display = 'none'; }
                                                                                                    } catch { }
                                                                                                }} />
                                                                                            );
                                                                                        })()}
                                                                                    </div>
                                                                                    <div className="flex-1 min-w-0">
                                                                                        <div className="flex items-start justify-between gap-3">
                                                                                            <h3 className="text-lg font-semibold text-white truncate">{tool.name}</h3>
                                                                                            {tool.dateAdded && (<span className="text-xs text-gray-400 whitespace-nowrap">{new Date(tool.dateAdded).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>)}
                                                                                        </div>
                                                                                        <p className="mt-1 text-sm text-gray-300 line-clamp-2">{tool.description}</p>
                                                                                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                                                                                            {tool.badge && (<span className="px-2 py-0.5 text-xs rounded-md bg-white/10 border border-white/20 text-gray-200">{tool.badge}</span>)}
                                                                                            {tool.category && (<span className="px-2 py-0.5 text-xs rounded-md bg-white/10 border border-white/20 text-gray-200">{tool.category.replace(/-/g, ' ')}</span>)}
                                                                                        </div>
                                                                                    </div>
                                                                                </article>
                                                                            ))}
                                                                        </div>
                                                                        {isMobile && mobileVisibleCount < total && (
                                                                            <div className="mt-8 flex justify-center">
                                                                                <button onClick={loadMoreMobile} className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium backdrop-blur-md border border-white/20 hover:border-white/30 transition-all">Load More ({Math.min(mobileVisibleCount + PAGE_SIZE, total)}/{total})</button>
                                                                            </div>
                                                                        )}
                                                                        {!isMobile && total > PAGE_SIZE && (
                                                                            <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
                                                                                <button onClick={() => updatePage(Math.max(1, page - 1))} disabled={page === 1} aria-label="Previous page" className={`px-3 py-2 rounded-lg text-sm border transition-colors ${page === 1 ? 'border-white/10 text-gray-500 cursor-not-allowed' : 'border-white/20 hover:border-white/40 hover:bg-white/10 text-white'}`}>Prev</button>
                                                                                {buildPageList(Math.ceil(total / PAGE_SIZE), page).map((p, i) => (
                                                                                    p === '…' ? (
                                                                                        <span key={`dots-${i}`} className="px-2 py-2 text-sm text-gray-400">…</span>
                                                                                    ) : (
                                                                                        <button key={`page-${p}`} onClick={() => updatePage(p)} aria-current={p === page ? 'page' : undefined} className={`px-3 py-2 rounded-lg text-sm border transition-colors ${p === page ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-500/60 shadow-lg' : 'border-white/20 text-white hover:bg-white/10 hover:border-white/40'}`}>{p}</button>
                                                                                    )
                                                                                ))}
                                                                                <button onClick={() => updatePage(Math.min(Math.ceil(total / PAGE_SIZE), page + 1))} disabled={page >= Math.ceil(total / PAGE_SIZE)} aria-label="Next page" className={`px-3 py-2 rounded-lg text-sm border transition-colors ${page >= Math.ceil(total / PAGE_SIZE) ? 'border-white/10 text-gray-500 cursor-not-allowed' : 'border-white/20 hover:border-white/40 hover:bg-white/10 text-white'}`}>Next</button>
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                );
                                                            })()}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </m.section>
                            </main>
                        </div>
                    </div>
                </div>


                {/* Tool Detail Modal */}
                {
                    selectedTool && (
                        <ToolDetailModal tool={selectedTool} onClose={closeModal} />
                    )
                }

                {/* Scroll to Top Button */}
                {
                    showScrollTop && (
                        <m.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={scrollToTop}
                            className="fixed bottom-8 right-8 z-50 p-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                            aria-label="Scroll to top"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                                />
                            </svg>
                        </m.button>
                    )
                }
            </LazyMotion>
            <ChatBot />
        </>
    );
};

export default Home;
