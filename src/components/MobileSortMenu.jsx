import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion as m, AnimatePresence } from 'framer-motion';

// --- Mobile Combined Sort & Pricing Menu ---
const MobileSortMenu = ({ activePricing, setActivePricing, sortOrder, setSortOrder, dateFilter, setDateFilter }) => {
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

    // Helper to produce a compact summary (pricing + sort + date)
    const summaryLabel = () => {
        const pricingLabel = activePricing !== 'all' ? options.find(o => o.type === 'pricing' && o.value === activePricing)?.label : 'All';
        const sortLabel = options.find(o => o.type === 'sort' && o.value === sortOrder)?.label || 'Date Added';
        let dateLabel = '';
        if (dateFilter && dateFilter.type !== 'all') {
            if (dateFilter.type === 'today') dateLabel = 'Today';
            else if (dateFilter.type === 'month') dateLabel = 'Month';
            else dateLabel = 'Custom';
        }
        
        const parts = [pricingLabel];
        if (sortLabel !== 'Date Added') parts.push(sortLabel);
        if (dateLabel) parts.push(dateLabel);

        return parts.join(' · ');
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(o => !o)}
                className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl backdrop-blur-md border transition-all duration-200 flex items-center gap-2 shadow-sm ${
                    (dateFilter?.type !== 'all' || activePricing !== 'all' || sortOrder !== 'date')
                    ? 'bg-[#FF6B00]/10 text-orange-400 border-[#FF6B00]/30 shadow-orange-900/10'
                    : 'bg-white/5 text-white border-white/10 hover:bg-white/20'
                }`}
                aria-haspopup="true"
                aria-expanded={open}
            >
                <div className="flex items-center gap-2">
                    <span className="text-sm">⚡</span>
                    <span>Sort</span>
                    
                    {/* Active Filter Indicators (Only if active) */}
                    {(dateFilter?.type !== 'all' || activePricing !== 'all' || sortOrder !== 'date') && (
                        <div className="flex items-center gap-1.5 ml-1 border-l border-white/10 pl-2">
                            {dateFilter?.type !== 'all' && (
                                <span className="text-[9px] font-extrabold text-[#FF6B00]">
                                    {dateFilter.type === 'today' ? 'TODAY' : dateFilter.type === 'month' ? 'MONTH' : 'CUSTOM'}
                                </span>
                            )}
                            {activePricing !== 'all' && (
                                <span className="text-[9px] font-extrabold text-white/90">
                                    {options.find(o => o.value === activePricing)?.label.toUpperCase()}
                                </span>
                            )}
                            {sortOrder !== 'date' && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
                            )}
                        </div>
                    )}
                </div>

                <span className={`ml-1 transition-transform duration-200 text-[10px] opacity-50 ${open ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {/* Bottom Sheet Backdrop & Panel */}
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

                                <div className="p-4 space-y-6 max-h-[80vh] overflow-y-auto pb-24">
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

                                    {/* Time Period Section */}
                                    <div className="space-y-3">
                                        <div className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Time Period</div>
                                        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide mask-linear-fade">
                                            <button
                                                onClick={() => { 
                                                    setDateFilter({ type: 'all', value: null }); 
                                                    setOpen(false);
                                                }}
                                                className={`px-4 py-2 text-sm font-medium rounded-full border whitespace-nowrap transition-all ${
                                                    (!dateFilter || dateFilter.type === 'all')
                                                    ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-lg shadow-orange-900/20' 
                                                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                                                }`}
                                            >
                                                All Time
                                            </button>
                                            <button
                                                onClick={() => { 
                                                    setDateFilter({ type: 'today', value: null }); 
                                                    setOpen(false);
                                                }}
                                                className={`px-4 py-2 text-sm font-medium rounded-full border whitespace-nowrap transition-all ${
                                                    (dateFilter?.type === 'today')
                                                    ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-lg shadow-orange-900/20' 
                                                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                                                }`}
                                            >
                                                Added Today
                                            </button>
                                            <button
                                                onClick={() => { 
                                                    setDateFilter({ type: 'month', value: null }); 
                                                    setOpen(false);
                                                }}
                                                className={`px-4 py-2 text-sm font-medium rounded-full border whitespace-nowrap transition-all ${
                                                    (dateFilter?.type === 'month')
                                                    ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-lg shadow-orange-900/20' 
                                                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                                                }`}
                                            >
                                                This Month
                                            </button>
                                            
                                            {/* Custom Date Picker Button */}
                                            <div className="relative flex-shrink-0">
                                                <input
                                                    type="date"
                                                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                                                    onChange={(e) => {
                                                        if (e.target.value) {
                                                            setDateFilter({ type: 'custom', value: e.target.value });
                                                            setOpen(false);
                                                        }
                                                    }}
                                                />
                                                <button
                                                    className={`px-4 py-2 text-sm font-medium rounded-full border whitespace-nowrap transition-all flex items-center gap-2 ${
                                                        (dateFilter?.type === 'custom')
                                                        ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-lg shadow-orange-900/20' 
                                                        : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                                                    }`}
                                                >
                                                    {dateFilter?.type === 'custom' && dateFilter.value ? dateFilter.value : 'Select Date'}
                                                    <span className="text-xs opacity-70">📅</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>


                                    {/* Pricing Section - Horizontal Scroll */}
                                    <div className="space-y-3">
                                        <div className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Pricing</div>
                                        <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide mask-linear-fade">
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
                                                        className={`px-4 py-2 text-sm font-medium rounded-full border whitespace-nowrap transition-all ${
                                                            active 
                                                            ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-lg shadow-orange-900/20' 
                                                            : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
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
                                        <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
                                            {options.filter(o => o.type === 'sort').map(opt => {
                                                const active = sortOrder === opt.value;
                                                return (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => {
                                                            setSortOrder(opt.value);
                                                            setOpen(false);
                                                        }}
                                                        className={`w-full flex items-center justify-between px-5 py-4 text-left transition-all ${
                                                            active ? 'bg-white/5' : 'hover:bg-white/[0.02]'
                                                        }`}
                                                    >
                                                        <span className={`text-sm font-medium ${active ? 'text-white' : 'text-gray-400'}`}>
                                                            {opt.label}
                                                        </span>
                                                        {active && (
                                                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#FF6B00] text-white shadow-orange-500/20 shadow-lg">
                                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
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
