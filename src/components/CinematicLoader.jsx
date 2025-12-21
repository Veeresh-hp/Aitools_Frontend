import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import './CinematicLoader.css';

const CinematicLoader = ({ onComplete }) => {
    const loaderRef = useRef(null);
    const containerRef = useRef(null);
    const textWrapperRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    if (onComplete) onComplete();
                }
            });

            // 1. Entrance Fade In (Instant in CSS usually, but let's ensure)
            tl.fromTo(loaderRef.current, 
                { opacity: 0 }, 
                { opacity: 1, duration: 0.1 }
            );

            // 2. Text Marquee Animation
            // We want it to scroll up.
            // Let's assume height of one text block is approx 100px or so based on ems.
            // We can calculate or just use percentage if carefully structured.
            
            tl.to(textWrapperRef.current, {
                yPercent: -50, // Scroll halfway up (assuming duplicated list)
                ease: "power2.inOut",
                duration: 2.5,
            });

            // 3. Exit Sequence
            tl.to(containerRef.current, {
                scale: 1.1,
                opacity: 0,
                duration: 0.4,
                ease: "power2.in",
                delay: 0.1
            }, "-=0.2"); // Overlap slightly

            tl.to(loaderRef.current, {
                yPercent: -100,
                duration: 0.8,
                ease: "power4.inOut"
            });
            
        }, loaderRef);

        return () => ctx.revert();
    }, [onComplete]);

    // Text to display
    const words = ["LOADING", "SYSTEM", "AI HUB", "READY"];
    // Duplicate for smooth infinite-like scroll illusion or just a long list
    const repeatedWords = [...words, ...words, ...words];

    return (
        <div className="cinematic-loader" ref={loaderRef}>
            <div className="loader-container" ref={containerRef}>
                <div className="loader-content-mask">
                    <div className="loader-text-wrapper" ref={textWrapperRef}>
                        {repeatedWords.map((word, i) => (
                            <div key={i} className={`loader-text ${i % 2 !== 0 ? 'dim' : ''}`}>
                                {word}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CinematicLoader;
