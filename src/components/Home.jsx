import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import FuseNamespace from 'fuse.js';
import { Player } from '@lottiefiles/react-lottie-player';
import ToolOfTheDay from './ToolOfTheDay';

import toolsData from '../data/toolsData';
import ToolCard from './ToolCard';
import ToolDetailModal from './ToolDetailModal';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import MobileCategoryTabs from './MobileCategoryTabs';
import MobileTopNav from './MobileTopNav';
import MobileSortMenu from './MobileSortMenu';
import HeroHeading from './HeroHeading';
import InfiniteMarquee from './InfiniteMarquee';
import ChatBot from './ChatBot';

import ProCarousel from './ProCarousel';
import PricingDropdown from './PricingDropdown';
import UnifiedSortDropdown from './UnifiedSortDropdown';




// Derived category IDs (fallback if utility not present)
const CATEGORY_IDS = toolsData.map(c => c.id);



// --- Main Home Component ---
const Home = () => {
    // nav-related state moved to a global Sidebar component
    const { t } = useLanguage();

    // Show more categories state


    const [showAllCategories, setShowAllCategories] = useState(false);
    const [showAllStickyCategories, setShowAllStickyCategories] = useState(false);



    const location = useLocation();
    const history = useHistory();
    // --- Infinite Marquee Featured Tools ---
    const featuredTools = useMemo(() => {
        // Find tools tagged as 'Recommended' or 'New' or 'Choice' to showcase
        // Prioritize tools with images
        const all = toolsData.flatMap(c => c.tools);
        // Shuffle or pick specific ones. For now, let's pick 15 specific high-quality ones to ensure logos look good
        const topPicks = all.filter(t => 
             (t.badge === 'Recommended' || t.name === 'ChatGPT' || t.name === 'Midjourney' || t.name === 'Claude' || t.name === 'Jasper' || t.name === 'Notion AI') 
             && t.image // Ensure they have logos
        );
        // Dedupe by name
        return Array.from(new Map(topPicks.map(item => [item.name, item])).values()).slice(0, 15);
    }, []);
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
    const [dateFilter, setDateFilter] = useState({ type: 'all', value: null });
    const [sortOrder, setSortOrder] = useState('date'); // 'date' | 'name_asc' | 'name_desc'
    const [nameFilter, setNameFilter] = useState([]); // array of 'A', 'B' etc.
    // Pagination & progressive loading
    const PAGE_SIZE = 30;
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [page, setPage] = useState(() => {
        if (typeof window === 'undefined') return 1;
        const params = new URLSearchParams(window.location.search || '');
        const p = parseInt(params.get('page'), 10);
        return (p && !isNaN(p) && p > 0) ? p : 1;
    }); // desktop pagination current page
    const [mobileVisibleCount, setMobileVisibleCount] = useState(PAGE_SIZE); // mobile progressive load
    const debounceRef = useRef(null);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
    const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);
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
    // Simplified for i18n
    const mobilePlaceholderTexts = [ t('search_placeholder_mobile') ];
    const desktopPlaceholderTexts = [ t('search_placeholder_desktop') ];

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
    // Fetch approved tools from backend - NON-BLOCKING with Stale-While-Revalidate Cache
    const [approvedTools, setApprovedTools] = useState(() => {
        try {
            const cached = typeof localStorage !== 'undefined' ? localStorage.getItem('cached_tools_data') : null;
            return cached ? JSON.parse(cached) : [];
        } catch {
            return [];
        }
    });
    const [isLoading, setIsLoading] = useState(() => {
        try {
            return !localStorage.getItem('cached_tools_data');
        } catch {
            return true;
        }
    });

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
                    // Update cache
                    localStorage.setItem('cached_tools_data', JSON.stringify(validTools));
                } else {
                    // If fetch fails but we have cache, keep cache (don't wipe it)
                    if (approvedTools.length === 0) setApprovedTools([]);
                }
            } catch (err) {
                console.error('Failed to fetch approved tools:', err);
                // Keep cache if exists
                if (approvedTools.length === 0) setApprovedTools([]);
            } finally {
                setIsLoading(false);
            }
        };
        // Fetch immediately without delay
        fetchApprovedTools();
    }, [API_URL]);

    // Helper for "isNew" logic (7 days)
    const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
    const isRecent = useCallback((date) => {
        if (!date) return false;
        return (Date.now() - date) < ONE_WEEK_MS;
    }, []);

    // Convert approved tools from database to display format with NEW badge
    const convertedApprovedTools = useMemo(() => {
        // console.log('🔄 Converting approved tools, count:', approvedTools.length);

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
                    isNew: isRecent(safeTime),
                    category: normalizedCategory,
                    dateAdded: safeTime,

                    pricing: tool.pricing || 'Freemium',
                    isAiToolsChoice: tool.isAiToolsChoice || false,
                };
            });
        return converted;
    }, [approvedTools, API_URL, getFaviconUrl, toSlug, isRecent]);

    const mergedToolsData = useMemo(() => {
        // Process static tools to update isNew based on dateAdded
        const staticCategoriesMap = new Map(
            toolsData.map(cat => ({
                ...cat,
                tools: cat.tools.map(t => ({
                    ...t,
                    isNew: isRecent(t.dateAdded || 0) // Override static isNew
                }))
            })).map(cat => [cat.id, cat])
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
        
        // Sort tools inside categories by date (newest first)? Optional but good practice.
        // For now, just returning the merged list.
        return [...staticCategoriesMap.values(), ...newCategoriesMap.values()];
    }, [convertedApprovedTools, isRecent]);

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
            return new FuseCtor(toolList, {
                keys: [
                    { name: 'name', weight: 0.7 },
                    { name: 'tags', weight: 0.2 },
                    { name: 'description', weight: 0.1 }
                ],
                threshold: 0.4,
                includeScore: true
            });
        } catch (err) { return { search: () => [] }; }
    }, [toolList]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        // Auto-scroll to tools on mobile when typing
        if (isMobile && value.trim().length > 0) {
             const targetEl = document.getElementById('mobile-category-tabs') || document.getElementById('tools');
             if (targetEl) {
                 const rect = targetEl.getBoundingClientRect();
                 // If the element is far down (hero visible), scroll it up.
                 // Sticky header is 64px. If top is > 150, it's likely below the fold or hero is showing.
                 if (rect.top > 150) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                 }
             }
        }

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

                    // 1. Search Filter
                    const searchLower = searchQuery.toLowerCase();
                    const matchesSearch = searchQuery
                        ? tool.name.toLowerCase().includes(searchLower) || (tool.description ? tool.description.toLowerCase() : '').includes(searchLower)
                        : true;

                    // 2. Category Filter
                    // If activeFilter is 'all', matches everything.
                    // If 'choice', matches only tools with isAiToolsChoice (across all categories).
                    // Otherwise, matches only tools in the active category (which is handled by outer map/filter usually, but here we can be explicit).
                    // Note: The outer `.map` iterates all categories. We should filter out tools that don't belong if we are strictly in a category view?
                    // Actually, usually we filter the *Categories* array first.
                    // But `mergedToolsData` is the source.
                    
                    let matchesCategory = true;
                    if (activeFilter === 'choice') {
                        matchesCategory = tool.isAiToolsChoice || tool.badge === 'Recommended' || tool.badge === "Editor's Choice";
                    } else if (activeFilter !== 'all') {
                        matchesCategory = category.id === activeFilter;
                    }

                    // 3. Pricing Filter
                    let matchesPricing = true;
                    if (activePricing !== 'all') {
                        const toolPricing = (tool.pricing || 'free').toLowerCase();
                        if (activePricing === 'free') matchesPricing = toolPricing === 'free';
                        else if (activePricing === 'freemium') matchesPricing = toolPricing === 'freemium';
                        else if (activePricing === 'paid') matchesPricing = toolPricing === 'paid';
                        else if (activePricing === 'open-source') matchesPricing = toolPricing === 'open source' || toolPricing === 'open-source';
                    }

                    // 4. Date Filter
                    let matchesDate = true;
                    const toolDate = new Date(tool.dateAdded || 0);
                    const now = new Date();

                    if (dateFilter.type === 'today') {
                        matchesDate = toolDate.getDate() === now.getDate() &&
                                      toolDate.getMonth() === now.getMonth() &&
                                      toolDate.getFullYear() === now.getFullYear();
                    } else if (dateFilter.type === 'month') {
                        matchesDate = toolDate.getMonth() === now.getMonth() &&
                                      toolDate.getFullYear() === now.getFullYear();
                    } else if (dateFilter.type === 'custom' && dateFilter.value) {
                         // Parse custom date (YYYY-MM-DD from input)
                         // But we need to be careful about timezone. input="date" returns YYYY-MM-DD.
                         // new Date("YYYY-MM-DD") is UTC.
                         // We want to match local day.
                         // Let's compare parts manually or use a helper.
                         // Actually `new Date(string)` is usually UTC for hyphens.
                         // Let's use string splitting to avoid timezone offset issues if possible, or force timezone consistency.
                         // For simplicity, let's treat the input date as local components.
                         const [y, m, d] = dateFilter.value.split('-').map(Number);
                         // toolDate is local.
                         matchesDate = toolDate.getDate() === d &&
                                       toolDate.getMonth() === (m - 1) &&
                                       toolDate.getFullYear() === y;
                    }

                    // 5. Name Filter (Letter)
                    let matchesNameFilter = true;
                    if (nameFilter.length > 0) {
                        const firstChar = tool.name.trim().charAt(0).toUpperCase();
                        matchesNameFilter = nameFilter.includes(firstChar);
                    }

                    return matchesSearch && matchesCategory && matchesPricing && matchesDate && matchesNameFilter;
                }),
            }))
            .filter((category) => category.tools.length > 0);

        // Sorting Logic applied to each category's tools
        result = result.map(category => ({
            ...category,
            tools: [...category.tools].sort((a, b) => {
                const nameA = a.name.toLowerCase();
                const nameB = b.name.toLowerCase();
                
                if (sortOrder === 'name_asc') return nameA.localeCompare(nameB);
                if (sortOrder === 'name_desc') return nameB.localeCompare(nameA);
                
                // fallback or default: 'date' (Newest First)
                return (b.dateAdded || 0) - (a.dateAdded || 0);
            })
        }));

        return result;
    }, [searchQuery, activeFilter, activePricing, dateFilter, sortOrder, nameFilter, mergedToolsData]);

    const allToolsFlatSorted = useMemo(() => {
        // If searching, PRIORITIZE RELEVANCE from Fuse results
        if (searchQuery.trim().length > 0) {
             const results = fuse.search(searchQuery);
             // Verify we have results
             let searchHits = results.map(r => r.item).filter(t => t && t.name);

             // Apply other filters (Category, Pricing, etc.) to these hits
             // We do this manually because 'filteredTools' relies on the old .includes logic
             searchHits = searchHits.filter(tool => {
                   // Category
                   let matchesCategory = true;
                   if (activeFilter === 'choice') {
                       matchesCategory = tool.isAiToolsChoice || tool.badge === 'Recommended' || tool.badge === "Editor's Choice";
                   } else if (activeFilter !== 'all') {
                       // We need to match category ID. Tool objects have 'category' property which is the slug ID.
                       matchesCategory = tool.category === activeFilter;
                   }
                   
                   // Pricing
                   let matchesPricing = true;
                   if (activePricing !== 'all') {
                       const toolPricing = (tool.pricing || 'free').toLowerCase();
                       if (activePricing === 'free') matchesPricing = toolPricing === 'free';
                       else if (activePricing === 'freemium') matchesPricing = toolPricing === 'freemium';
                       else if (activePricing === 'paid') matchesPricing = toolPricing === 'paid';
                       else if (activePricing === 'open-source') matchesPricing = toolPricing === 'open source' || toolPricing === 'open-source';
                   }

                   // Date
                   let matchesDate = true;
                   const toolDate = new Date(tool.dateAdded || 0);
                   const now = new Date();
                   if (dateFilter.type === 'today') {
                       matchesDate = toolDate.getDate() === now.getDate() && toolDate.getMonth() === now.getMonth() && toolDate.getFullYear() === now.getFullYear();
                   } else if (dateFilter.type === 'month') {
                       matchesDate = toolDate.getMonth() === now.getMonth() && toolDate.getFullYear() === now.getFullYear();
                   } else if (dateFilter.type === 'custom' && dateFilter.value) {
                        const [y, m, d] = dateFilter.value.split('-').map(Number);
                        matchesDate = toolDate.getDate() === d && toolDate.getMonth() === (m - 1) && toolDate.getFullYear() === y;
                   }

                   // Name (Letter)
                   let matchesNameFilter = true;
                   if (nameFilter.length > 0) {
                       const firstChar = tool.name.trim().charAt(0).toUpperCase();
                       matchesNameFilter = nameFilter.includes(firstChar);
                   }

                   return matchesCategory && matchesPricing && matchesDate && matchesNameFilter;
             });

             return searchHits;
        }

        // Default behavior (Not searching)
        const all = filteredTools.flatMap(category => category.tools.filter(t => t && t.name));
        return all.sort((a, b) => {
             const nameA = a.name.toLowerCase();
             const nameB = b.name.toLowerCase();
             if (sortOrder === 'name_asc') return nameA.localeCompare(nameB);
             if (sortOrder === 'name_desc') return nameB.localeCompare(nameA);
             return (b.dateAdded || 0) - (a.dateAdded || 0);
        });
    }, [filteredTools, sortOrder, searchQuery, fuse, activeFilter, activePricing, dateFilter, nameFilter]);

    useEffect(() => {
        const id = location.hash?.replace('#', '');
        if (!id) return;
        if (id === 'all') {
            setActiveFilter('all');
            setTimeout(() => {
                const toolsEl = document.getElementById('tools');
                if (toolsEl) toolsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
            return;
        }
        if (id === 'choice') {
            setActiveFilter('choice');
            setTimeout(() => {
                const toolsEl = document.getElementById('tools');
                if (toolsEl) toolsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
            return;
        }
        const allCategoryIds = mergedToolsData.map(c => c.id);
        if (allCategoryIds.includes(id)) {
            setActiveFilter(id);
            setTimeout(() => {
                const el = document.getElementById('tools');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 80);
        }
    }, [location.hash, mergedToolsData]);

    // Ref to track if it's the first mount to avoid resetting page from URL
    const isFirstRun = useRef(true);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showMoreMenu && !event.target.closest('.more-menu-container')) {
                setShowMoreMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showMoreMenu]);

    useEffect(() => {
        // Skip the first run to allow state initialization from URL
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        setPage(1);
        setMobileVisibleCount(PAGE_SIZE);
        if (!isMobile) {
            const params = new URLSearchParams(location.search || '');
            if (params.get('page') !== '1') {
                params.set('page', '1');
                history.replace({ pathname: location.pathname, search: params.toString(), hash: location.hash });
            }
        }
    }, [searchQuery, activeFilter, activePricing, sortOrder, isMobile]);

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

    const { visibleCategories, hiddenCategories } = useMemo(() => {
        const priorityIds = [
            'all', 'ai-coding-assistants', 'faceless-video', 'video-generators', 'writing-tools', 
            'presentation-tools', 'short-clippers', 'marketing-tools', 'voice-tools', 'website-builders'
        ];
        // Get priority items in order
        const priority = priorityIds.map(id => categories.find(c => c.id === id)).filter(Boolean);
        // Get rest items (excluding priority ones)
        const rest = categories.filter(c => !priorityIds.includes(c.id));
        
        // Combine: Priority (Top 10) + Rest 
        // Note: Use only first 10 of priority as visible if we strictly want 10. 
        // Logic: The requirement is Top 10 visible. 
        // So we take the full combined list and slice it.
        const all = [...priority, ...rest];
        return {
            visibleCategories: all.slice(0, 10),
            hiddenCategories: all.slice(10)
        };
    }, [categories]);

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
                {/* Changed overflow-hidden to visible (default) to allow sticky children to work reliably */}
                <div className="min-h-screen text-white relative">
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
                        <div className="absolute inset-0 bg-black" />
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-cyan-600/10 via-transparent to-transparent" />


                        <style>{`
                            @keyframes gridMove {
                                0% { background-position: 0 0; }

                                100% { background-position: 0 60px; }
                            }
                            @media (min-width: 1024px) {
                                .desktop-hero-zoom {
                                    zoom: 0.90;
                                }
                            }
                        `}</style>

                        {/* Animated gradient orbs - Enhanced with Framer Motion & Color Shift */}

                    </div >

                    {/* Sidebar has been moved to a global component (src/components/Sidebar.jsx) so it appears on every route */}

                    {/* Unified Sticky Navigation (Search + Categories) */}
                    {/* Fixed Nav removed in favor of in-flow Sticky Nav */}

                    {/* Spacer to prevent collision with content when sticky bar is visible */}
                    {
                        showStickyNav && (
                            <div aria-hidden="true" className="w-full" style={{ height: stickyHeight || 72 }} />
                        )
                    }

                    {/* Hero Section - Dominic Style - Clean, Dark, Bold */}
                    <section
                        ref={searchSectionRef}
                        className={`desktop-hero-zoom relative pt-32 pb-8 md:pb-24 px-6 sm:px-12 lg:px-24 z-20 flex flex-col transition-opacity duration-300 ${showStickyNav ? 'opacity-0 pointer-events-none select-none' : 'opacity-100'}`}
                        aria-hidden={showStickyNav ? 'true' : 'false'}
                    >
                        {/* Background Elements - Minimal & Dark */}
                        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-black rounded-b-[60px]">
                             {/* Gradient overlay for bottom fade only */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                            
                            {/* Central Hero Image */}
                            <div className="absolute inset-x-0 bottom-0 top-0 flex items-center justify-center opacity-100">
                                <img 
                                    src="/Images/hero-person.png" 
                                    alt="Hero Persona" 
                                    className="h-[110%] w-auto object-cover object-top mask-image-linear-gradient opacity-90"
                                    style={{ 
                                        maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                                        WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' 
                                    }}
                                />
                            </div>
                        </div>

                        <div className="relative z-10 max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-12 items-center">
                            
                            {/* Left Content */}
                            <div className="text-left space-y-8">
                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
                                    <span className="text-xs font-semibold text-gray-300 tracking-wide uppercase">Available for Everyone</span>
                                </div>

                                {/* Main Heading */}
                                <div>
                                    <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.85]">
                                        Discover <br />
                                        <span className="text-white">Intelligent</span> <br />
                                        Tools.
                                    </h1>
                                </div>

                                {/* Subtitle */}
                                <p className="text-lg text-gray-400 max-w-lg leading-relaxed font-light">
                                    Curated AI resources to elevate your workflow. <br/>
                                    Find the perfect tool to 
                                    <span className="text-white font-medium"> automate</span>, 
                                    <span className="text-white font-medium"> create</span>, and 
                                    <span className="text-white font-medium"> innovate</span>.
                                </p>

                                {/* CTA Button */}
                                <div className="flex flex-wrap gap-4">
                                    <m.button
                                        onClick={() => {
                                            const toolsSection = document.getElementById('tools');
                                            if (toolsSection) toolsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="group flex items-center gap-3 px-8 py-4 bg-[#FF6B00] hover:bg-[#ff8533] rounded-full text-white text-base font-bold transition-all shadow-lg shadow-orange-500/20"
                                    >
                                        Explore Tools
                                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </m.button>
                                </div>

                                {/* Mobile Stats Row (Fills gap) */}
                                <div className="lg:hidden grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-6 mt-6">
                                    <div className="text-center px-2">
                                        <div className="text-2xl font-black text-white">300+</div>
                                        <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-0.5">Tools</div>
                                    </div>
                                    <div className="text-center px-2">
                                        <div className="text-2xl font-black text-white">100%</div>
                                        <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-0.5">Free</div>
                                    </div>
                                    <div className="text-center px-2">
                                        <div className="text-2xl font-black text-white">20+</div>
                                        <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-0.5">Cats</div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Content - Stats / Visuals */}
                            <div className="hidden lg:flex flex-col gap-8 items-end text-right">
                                <div className="space-y-6">
                                     <div className="group">
                                        <h3 className="text-6xl font-black text-white group-hover:text-[#FF6B00] transition-colors duration-300">300+</h3>
                                        <p className="text-sm text-gray-500 font-medium uppercase tracking-widest mt-1">AI Tools</p>
                                     </div>
                                     <div className="w-full h-px bg-white/10" />
                                     <div className="group">
                                        <h3 className="text-6xl font-black text-white group-hover:text-[#FF6B00] transition-colors duration-300">100%</h3>
                                        <p className="text-sm text-gray-500 font-medium uppercase tracking-widest mt-1">Free & Verified</p>
                                     </div>
                                     <div className="w-full h-px bg-white/10" />
                                     <div className="group">
                                        <h3 className="text-6xl font-black text-white group-hover:text-[#FF6B00] transition-colors duration-300">20+</h3>
                                        <p className="text-sm text-gray-500 font-medium uppercase tracking-widest mt-1">Categories</p>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Tool of the Day */}
                    <ToolOfTheDay />

                    {/* Unified Sticky Navigation - In Flow */}
                    {(!isMobile) && (
                        <div className={`sticky top-0 z-50 ${isMobile ? '' : 'ml-20'}`}>
                            <div className="bg-[#050505]/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
                                <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-4">
                                        {/* Left: Title */}
                                        <div className="text-center md:text-left">
                                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                                <span className="text-[#FF6B00]">Browse</span> by Category
                                            </h2>
                                            <p className="text-xs text-gray-400">Explore tools organized by their purpose</p>
                                        </div>

                                        {/* Middle/Right: Search Bar (Integrated) */}
                                        <div className="w-full md:w-[400px] relative group">
                                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#FF6B00] transition-colors">
                                                <FaSearch />
                                             </div>
                                             <input
                                                type="text"
                                                placeholder="Search AI tools..."
                                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B00]/50 focus:bg-white/10 transition-all shadow-inner"
                                                value={searchQuery}
                                                onChange={handleInputChange}
                                             />
                                        </div>
                                    </div>

                                    {/* Category Pills - Custom Scrollbar */}
                                    {/* Category Pills - Custom Scrollbar */}
                                    <div className="relative group/cats flex items-center">
                                        <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide mask-linear-fade">
                                            {visibleCategories.map((cat) => {
                                                const isActive = activeFilter === cat.id;
                                                return (
                                                    <button
                                                        key={cat.id}
                                                        onClick={() => setActiveFilter(cat.id)}
                                                        className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap border ${
                                                            isActive 
                                                            ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-lg shadow-orange-900/20' 
                                                            : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
                                                        }`}
                                                    >
                                                        {cat.label}
                                                    </button>
                                                )
                                            })}
                                        </div>

                                        {/* MORE BUTTON - Moved outside scroll container to prevent clipping */}
                                        {hiddenCategories.length > 0 && (
                                            <div className="relative more-menu-container ml-2 shrink-0">
                                                <button 
                                                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                                                    className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap border flex items-center gap-2 ${
                                                        showMoreMenu 
                                                        ? 'bg-white/10 text-white border-white/20' 
                                                        : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
                                                    }`}
                                                >
                                                    More
                                                    <FaChevronRight className={`text-[10px] transition-transform ${showMoreMenu ? 'rotate-90' : 'rotate-0'}`} />
                                                </button>

                                                {/* Dropdown Menu */}
                                                {showMoreMenu && (
                                                    <div className="absolute top-full right-0 mt-2 w-64 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl z-[60] overflow-hidden backdrop-blur-xl p-2 grid grid-cols-1 gap-1 max-h-[60vh] overflow-y-auto custom-modal-scrollbar">
                                                        {hiddenCategories.map((cat) => {
                                                            const isActive = activeFilter === cat.id;
                                                            return (
                                                                <button
                                                                    key={cat.id}
                                                                    onClick={() => {
                                                                        setActiveFilter(cat.id);
                                                                        setShowMoreMenu(false);
                                                                    }}
                                                                    className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                                                                        isActive 
                                                                        ? 'bg-[#FF6B00] text-white shadow-md' 
                                                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                                                    }`}
                                                                >
                                                                    {cat.label}
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    {/* Fade Edges */}
                                        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}



                    {/* New 'Dominic' Theme Sections - Placed after Hero */}


                    {/* Mobile Top Nav - Logo + Categories/Picks (Mobile Only) */}
                    {
                        isMobile && (
                            <MobileTopNav
                                categories={mobileCategories}
                                searchQuery={searchQuery}
                                onSearchChange={handleInputChange}
                                onCategorySelect={(id) => {
                                    setActiveFilter(id);
                                    setTimeout(() => {
                                        if (id === 'all') {
                                            const toolsEl = document.getElementById('tools');
                                            if (toolsEl) toolsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        } else {
                                            const el = document.querySelector(`[data-category="${id}"]`);
                                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }
                                    }, 50);
                                }}
                                onChoiceClick={() => {
                                    setActiveFilter('choice');
                                    // history.push('/#choice'); // Optional: update URL
                                    setTimeout(() => {
                                        const toolsEl = document.getElementById('tools');
                                        if (toolsEl) toolsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }, 50);
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
                                <MobileCategoryTabs
                                    categories={[
                                        { id: 'all', label: "New Tools" },
                                        { id: 'chatbots', label: 'ChatGPT Alternatives' },
                                        { id: 'ai-coding-assistants', label: 'AI Coding Assistants' },
                                        ...categories.filter(c => !['all', 'chatbots', 'ai-coding-assistants'].includes(c.id))
                                    ]}
                                    activeId={activeFilter}
                                    onSelect={(id) => {
                                        setActiveFilter(id);
                                        setTimeout(() => {
                                            if (id === 'all') {
                                                const toolsEl = document.getElementById('tools');
                                                if (toolsEl) toolsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                            } else {
                                                const el = document.querySelector(`[data-category="${id}"]`);
                                                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                            }
                                        }, 50);
                                    }}
                                />
                        )
                    }

                    {/* Main Content */}
                    <div className={`transition-all duration-300 relative z-30 ${isMobile ? '' : 'ml-20'}`}>
                        <div className="w-full px-6 lg:px-12">
                            {/* Main content area - Full width */}
                            <main className="w-full">
                                 {/* Carousels Section - Replaced with Cinematic Motion Carousel */}
                                 {/* Carousels Section - Replaced with Cinematic Motion Carousel */}

                                {/* Category Filter Buttons - Hidden on Mobile (replaced by tabs) */}
                                {/* Category Filter Buttons - Integrated into sticky bar now */}

                                {/* Tools Grid Section */}
                                <section
                                    id="tools"
                                    className="relative px-4 sm:px-6 lg:px-8 py-4"
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

                                    <div className="w-full relative flex flex-col lg:flex-row gap-8">
                                        {/* Left Sidebar: Filtering & Controls - Sticky */}
                                        <aside className={`w-full lg:w-48 xl:w-64 flex-shrink-0 space-y-8 z-30 self-start ${isMobile ? 'mb-6' : 'lg:sticky lg:top-32'}`}>
                                            {/* Header Group */}
                                            <div className="space-y-4">
                                                <div className="flex items-center">
                                                    <h2 className="text-2xl font-bold text-white whitespace-nowrap">
                                                        {activeFilter === 'all' ? 'All AI Tools' : labelFor(activeFilter)}
                                                    </h2>
                                                </div>
                                                
                                                {!isMobile && (
                                                    <div className="text-sm font-medium text-gray-500 bg-white/5 py-1 px-3 rounded-md border border-white/5 inline-block">
                                                        {filteredTools.reduce((acc, cat) => acc + cat.tools.length, 0)} Tools
                                                    </div>
                                                )}
                                            </div>

                                            {/* Filters Stack */}
                                            {!isMobile && (
                                                <div className="space-y-4 pt-4 border-t border-white/5">
                                                    <div className="space-y-2">
                                                        <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider ml-1">Pricing</label>
                                                        <PricingDropdown
                                                            activePricing={activePricing}
                                                            handlePricing={setActivePricing}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider ml-1">Sort By</label>
                                                        <UnifiedSortDropdown
                                                            dateFilter={dateFilter}
                                                            handleDateFilter={setDateFilter}
                                                            sortOrder={sortOrder}
                                                            handleSortOrder={setSortOrder}
                                                            nameFilter={nameFilter}
                                                            handleNameFilter={setNameFilter}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Mobile Controls */}
                                            {isMobile && (
                                                <div className="flex items-center justify-between">
                                                    <div className="origin-left">
                                                        <MobileSortMenu
                                                            activePricing={activePricing}
                                                            setActivePricing={setActivePricing}
                                                            sortOrder={sortOrder}
                                                            setSortOrder={setSortOrder}
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => setViewMode(prev => (prev === 'grid' ? 'list' : 'grid'))}
                                                        className="p-2 bg-white/10 rounded-lg border border-white/20 text-white"
                                                    >
                                                        {viewMode === 'grid' ? (
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                                        ) : (
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16a1 1 0 000-2H4a1 1 0 000 2zm0 7h16a1 1 0 000-2H4a1 1 0 000 2zm0 7h16a1 1 0 000-2H4a1 1 0 000 2z" /></svg>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </aside>

                                        {/* Main Content Grid */}
                                        <div className="flex-1 min-w-0">
                                            {/* Desktop View Toggle (Aligned Right) */}
                                            {!isMobile && (
                                                <div className="flex justify-end mb-6">
                                                     <button
                                                        onClick={() => setViewMode(prev => (prev === 'grid' ? 'list' : 'grid'))}
                                                        title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
                                                        className={`backdrop-blur-md text-white rounded-lg border transition-all duration-200 p-2 ${
                                                            viewMode === 'grid' ? 'bg-white/10 border-white/20 hover:bg-white/20' : 'bg-blue-600/20 border-blue-400/30 hover:bg-blue-600/30'
                                                        }`}
                                                    >
                                                        {viewMode === 'grid' ? (
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                                        ) : (
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16a1 1 0 000-2H4a1 1 0 000 2zm0 7h16a1 1 0 000-2H4a1 1 0 000 2zm0 7h16a1 1 0 000-2H4a1 1 0 000 2z" /></svg>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                            {isLoading ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {[...Array(6)].map((_, i) => (
                                                        <div key={i} className="bg-gray-900/40 rounded-xl overflow-hidden border border-white/5 h-full flex flex-col">
                                                            <div className="h-48 bg-white/5 animate-pulse" />
                                                            <div className="p-5 space-y-4 flex-1">
                                                                <div className="h-6 bg-white/5 rounded w-3/4 animate-pulse" />
                                                                <div className="space-y-2">
                                                                    <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
                                                                    <div className="h-4 bg-white/5 rounded w-2/3 animate-pulse" />
                                                                </div>
                                                                <div className="pt-4 flex items-center gap-2">
                                                                    <div className="h-6 w-16 bg-white/5 rounded-full animate-pulse" />
                                                                    <div className="h-6 w-16 bg-white/5 rounded-full animate-pulse" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
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
                                                    <div className="mb-12">
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
                                                                // Bento Grid Slicing logic
                                                                displayed = allTools.slice(start, end);
                                                            }

                                                            if (viewMode === 'grid') {
                                                                return (
                                                                    <>
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 auto-rows-[minmax(180px,auto)] gap-4 sm:gap-6 grid-flow-row-dense">
                                                                            {displayed.map((tool, idx) => {
                                                                                // Bento Grid Pattern Logic
                                                                                // Pattern spans 10 items
                                                                                const patternIndex = idx % 10;
                                                                                let spanClass = "col-span-1 row-span-1";
                                                                                
                                                                                // Only apply bento sizing on desktop
                                                                                if (!isMobile) {
                                                                                    if (patternIndex === 0) spanClass = "md:col-span-2 md:row-span-2"; // Big Feature
                                                                                    else if (patternIndex === 3) spanClass = "md:col-span-1 md:row-span-1 lg:row-span-1"; 
                                                                                    else if (patternIndex === 6) spanClass = "md:col-span-2 md:row-span-1"; // Wide
                                                                                    else if (patternIndex === 7) spanClass = "md:row-span-2"; // Tall
                                                                                }

                                                                                return (
                                                                                    <ToolCard 
                                                                                        key={`${tool.name}-${tool.dateAdded || idx}`}
                                                                                        tool={tool} 
                                                                                        className={spanClass}
                                                                                        // Pass style or other props if needed
                                                                                    />
                                                                                );
                                                                            })}
                                                                        </div>
                                                                        
                                                                        {/* Mobile Load More */}
                                                                        {isMobile && mobileVisibleCount < total && (
                                                                            <div className="mt-8 flex justify-center">
                                                                                <button onClick={loadMoreMobile} className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium backdrop-blur-md border border-white/20 hover:border-white/30 transition-all">Load More ({Math.min(mobileVisibleCount + PAGE_SIZE, total)}/{total})</button>
                                                                            </div>
                                                                        )}

                                                                        {/* Desktop Pagination */}
                                                                        {!isMobile && total > PAGE_SIZE && (
                                                                            <div className="mt-16 flex items-center justify-center gap-2 flex-wrap">
                                                                                <button onClick={() => updatePage(Math.max(1, page - 1))} disabled={page === 1} aria-label="Previous page" className={`px-4 py-3 rounded-xl text-sm font-medium border transition-colors ${page === 1 ? 'border-white/5 bg-white/5 text-gray-500 cursor-not-allowed' : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white'}`}>Prev</button>
                                                                                {buildPageList(Math.ceil(total / PAGE_SIZE), page).map((p, i) => (
                                                                                    p === '…' ? (
                                                                                        <span key={`dots-${i}`} className="px-3 py-3 text-sm text-gray-400">…</span>
                                                                                    ) : (
                                                                                        <button key={`page-${p}`} onClick={() => updatePage(p)} aria-current={p === page ? 'page' : undefined} className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium border transition-all ${p === page ? 'bg-[#FF6B00] text-white border-orange-500 shadow-lg shadow-orange-500/20' : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/20'}`}>{p}</button>
                                                                                    )
                                                                                ))}
                                                                                <button onClick={() => updatePage(Math.min(Math.ceil(total / PAGE_SIZE), page + 1))} disabled={page >= Math.ceil(total / PAGE_SIZE)} aria-label="Next page" className={`px-4 py-3 rounded-xl text-sm font-medium border transition-colors ${page >= Math.ceil(total / PAGE_SIZE) ? 'border-white/5 bg-white/5 text-gray-500 cursor-not-allowed' : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white'}`}>Next</button>
                                                                            </div>
                                                                        )}
                                                                    </>
                                                                );
                                                            }
                                                            return (
                                                                <>
                                                                    <div className="space-y-4">
                                                                        {displayed.map((tool, idx) => (
                                                                            <article key={`${tool.name}-${tool.dateAdded || idx}`} className="flex items-start gap-5 p-4 rounded-3xl bg-[#12121A] border border-white/5 hover:border-white/10 hover:bg-white/[0.03] transition-all cursor-pointer group" onClick={() => navigateToTool(tool)}>
                                                                                <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-2xl bg-black/30 border border-white/5 flex items-center justify-center">
                                                                                    {(() => {
                                                                                        const src = getImageSrc(tool);
                                                                                        if (src) {
                                                                                            return (
                                                                                                <img src={src} alt={tool.name} className="w-full h-full object-cover" loading="lazy" onError={(e) => {
                                                                                                    e.currentTarget.style.display = 'none';
                                                                                                    e.currentTarget.nextSibling.style.display = 'flex';
                                                                                                }} />
                                                                                            );
                                                                                        }
                                                                                        return null;
                                                                                    })()}
                                                                                     <div className="hidden w-full h-full items-center justify-center text-2xl" style={{ display: !getImageSrc(tool) ? 'flex' : 'none' }}>
                                                                                        🚀
                                                                                     </div>
                                                                                </div>
                                                                                <div className="flex-1 min-w-0 py-1">
                                                                                    <div className="flex items-start justify-between gap-3">
                                                                                        <h3 className="text-lg font-bold text-white group-hover:text-[#a78bfa] transition-colors truncate">{tool.name}</h3>
                                                                                        {tool.dateAdded && (<span className="text-xs text-gray-500 whitespace-nowrap">{new Date(tool.dateAdded).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>)}
                                                                                    </div>
                                                                                    <p className="mt-1 text-sm text-gray-400 line-clamp-2 leading-relaxed">{tool.description}</p>
                                                                                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                                                                                        {tool.badge && (<span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-white/5 border border-white/10 text-gray-300">{tool.badge}</span>)}
                                                                                        {tool.pricing && (<span className={`px-2 py-0.5 text-[10px] font-medium rounded-md border ${
                                                                                            tool.pricing === 'Free' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' :
                                                                                            'text-blue-400 border-blue-500/20 bg-blue-500/5'
                                                                                        }`}>{tool.pricing}</span>)}
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
                                                                        <div className="mt-16 flex items-center justify-center gap-2 flex-wrap">
                                                                            <button onClick={() => updatePage(Math.max(1, page - 1))} disabled={page === 1} aria-label="Previous page" className={`px-4 py-3 rounded-xl text-sm font-medium border transition-colors ${page === 1 ? 'border-white/5 bg-white/5 text-gray-500 cursor-not-allowed' : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white'}`}>Prev</button>
                                                                            {buildPageList(Math.ceil(total / PAGE_SIZE), page).map((p, i) => (
                                                                                p === '…' ? (
                                                                                    <span key={`dots-${i}`} className="px-3 py-3 text-sm text-gray-400">…</span>
                                                                                ) : (
                                                                                    <button key={`page-${p}`} onClick={() => updatePage(p)} aria-current={p === page ? 'page' : undefined} className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium border transition-all ${p === page ? 'bg-[#FF6B00] text-white border-orange-500 shadow-lg shadow-orange-500/20' : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/20'}`}>{p}</button>
                                                                                )
                                                                            ))}
                                                                            <button onClick={() => updatePage(Math.min(Math.ceil(total / PAGE_SIZE), page + 1))} disabled={page >= Math.ceil(total / PAGE_SIZE)} aria-label="Next page" className={`px-4 py-3 rounded-xl text-sm font-medium border transition-colors ${page >= Math.ceil(total / PAGE_SIZE) ? 'border-white/5 bg-white/5 text-gray-500 cursor-not-allowed' : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white'}`}>Next</button>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                </section>
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
                            className="fixed bottom-8 right-8 z-50 p-3 bg-[#FF6B00] hover:bg-[#ff8533] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
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
