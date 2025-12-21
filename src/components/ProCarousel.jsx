import React, { useState, useRef, useEffect } from 'react';
import { motion as m } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Player } from '@lottiefiles/react-lottie-player';

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

export default ProCarousel;
