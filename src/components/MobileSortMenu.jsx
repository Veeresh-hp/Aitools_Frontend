import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion as m, AnimatePresence } from 'framer-motion';

// --- Mobile Combined Sort & Pricing Menu ---
const MobileSortMenu = ({ activePricing, setActivePricing, sortOrder, setSortOrder }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Unified option list: first pricing filters then sort options
    const options = [
        { type: 'pricing', value: 'free', label: 'Free' },
        { type: 'pricing', value: 'freemium', label: 'Freemium' },
        { type: 'pricing', value: 'open-source', label: 'Open Source' },
        { type: 'pricing', value: 'paid', label: 'Paid' },
        { type: 'sort', value: 'date', label: 'Date Added' },
        { type: 'sort', value: 'name_asc', label: 'Name (A-Z)' },
        { type: 'sort', value: 'name_desc', label: 'Name (Z-A)' }
    ];


    // Lock body scroll when open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    // Helper to produce a compact summary (pricing + sort)
    const summaryLabel = () => {
        const pricingLabel = activePricing !== 'all' ? options.find(o => o.type === 'pricing' && o.value === activePricing)?.label : 'All';
        const sortLabel = options.find(o => o.type === 'sort' && o.value === sortOrder)?.label || 'Date Added';
        return `${pricingLabel} · ${sortLabel}`;
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(o => !o)}
                className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg bg-white/5 backdrop-blur-md text-white border border-white/10 hover:bg-white/20 transition-all duration-200 flex items-center gap-2 shadow-sm"
                aria-haspopup="true"
                aria-expanded={open}
            >
                <span className="flex items-center gap-1.5">
                    <span className="text-xs">⚙️</span>
                    <span>Sort</span>
                </span>
                <span className="ml-auto text-[9px] text-gray-400 hidden sm:inline-block truncate max-w-[80px] border-l border-white/10 pl-2">{summaryLabel()}</span>
                <span className={`transition-transform duration-200 text-[10px] ${open ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {/* Bottom Sheet Backdrop & Panel */}
            {/* Bottom Sheet Backdrop & Panel - Portalled to body to cover bottom nav */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {open && (
                        <>
                            {/* Backdrop */}
                            <m.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setOpen(false)}
                                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9990]"
                            />
                            {/* Sheet */}
                            <m.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="fixed bottom-0 left-0 right-0 bg-[#121212] rounded-t-3xl border-t border-white/10 z-[9999] overflow-hidden shadow-2xl safe-area-bottom"
                            >
                                {/* Handle */}
                                <div className="w-full flex justify-center pt-3 pb-1" onClick={() => setOpen(false)}>
                                    <div className="w-12 h-1.5 bg-white/20 rounded-full" />
                                </div>

                                <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto pb-24">
                                    {/* Header */}
                                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                                        <h3 className="text-lg font-bold text-white">Sort & Filter</h3>
                                        <button 
                                            onClick={() => setOpen(false)}
                                            className="p-2 text-gray-400 hover:text-white"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    {/* Content Grid */}
                                    <div className="space-y-6">
                                        {/* Pricing Section */}
                                        <div className="space-y-3">
                                            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Pricing</div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {options.filter(o => o.type === 'pricing').map(opt => {
                                                    const active = activePricing === opt.value;
                                                    return (
                                                        <button
                                                            key={opt.value}
                                                            onClick={() => {
                                                                if (activePricing === opt.value) setActivePricing('all');
                                                                else setActivePricing(opt.value);
                                                                setOpen(false);
                                                            }}
                                                            className={`px-3 py-3 text-sm font-medium rounded-xl border transition-all ${
                                                                active 
                                                                ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-lg' 
                                                                : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'
                                                            }`}
                                                        >
                                                            {opt.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Sort Section */}
                                        <div className="space-y-3">
                                            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Sort By</div>
                                            <div className="flex flex-col gap-2">
                                                {options.filter(o => o.type === 'sort').map(opt => {
                                                    const active = sortOrder === opt.value;
                                                    return (
                                                        <button
                                                            key={opt.value}
                                                            onClick={() => {
                                                                setSortOrder(opt.value);
                                                                setOpen(false);
                                                            }}
                                                            className={`flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all ${
                                                                active 
                                                                ? 'bg-white/10 text-white border-white/20' 
                                                                : 'bg-transparent text-gray-400 border-transparent hover:bg-white/5'
                                                            }`}
                                                        >
                                                            <span className="text-sm font-medium">{opt.label}</span>
                                                            {active && <span className="text-[#FF6B00]">●</span>}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-6" /> 
                                </div>
                            </m.div>
                        </>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export default MobileSortMenu;
