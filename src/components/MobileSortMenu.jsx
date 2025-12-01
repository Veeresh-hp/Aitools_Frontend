import React, { useState, useEffect, useRef } from 'react';

// --- Mobile Combined Sort & Pricing Menu ---
const MobileSortMenu = ({ activePricing, setActivePricing, sortBy, setSortBy }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Unified option list: first pricing filters then sort options
    const options = [
        { type: 'pricing', value: 'free', label: 'Free' },
        { type: 'pricing', value: 'freemium', label: 'Freemium' },
        { type: 'pricing', value: 'open-source', label: 'Open Source' },
        { type: 'pricing', value: 'paid', label: 'Paid' },
        { type: 'sort', value: 'date-added', label: 'Date Added' },
        { type: 'sort', value: 'name', label: 'Name' }
    ];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Helper to produce a compact summary (pricing + sort)
    const summaryLabel = () => {
        const pricingLabel = activePricing !== 'all' ? options.find(o => o.type === 'pricing' && o.value === activePricing)?.label : 'All';
        const sortLabel = options.find(o => o.type === 'sort' && o.value === sortBy)?.label || 'Date Added';
        return `${pricingLabel} · ${sortLabel}`;
    };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(o => !o)}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all duration-200 flex items-center gap-2 shadow-lg"
                aria-haspopup="true"
                aria-expanded={open}
            >
                <span className="flex items-center gap-2">
                    <span className="text-sm">⚙️</span>
                    <span>Sort & Filter</span>
                </span>
                <span className="ml-auto text-[10px] text-gray-300 hidden xs:inline-block truncate max-w-[90px]">{summaryLabel()}</span>
                <span className={`transition-transform duration-200 text-[10px] ${open ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {open && (
                <div className="absolute top-full mt-2 left-0 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 py-2 min-w-[190px] max-h-80 overflow-auto z-[9999]">
                    <div className="px-3 pb-2 text-[11px] uppercase tracking-wide text-gray-400">Pricing</div>
                    {options.filter(o => o.type === 'pricing').map(opt => {
                        const active = activePricing === opt.value;
                        return (
                            <button
                                key={opt.value}
                                onClick={() => {
                                    if (activePricing === opt.value) {
                                        setActivePricing('all');
                                    } else {
                                        setActivePricing(opt.value);
                                    }
                                    setOpen(false);
                                }}
                                className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-white/10 transition-all duration-150 ${active ? 'bg-orange-500/20 border-l-4 border-orange-500' : ''}`}
                            >
                                <span className="text-sm font-medium whitespace-nowrap">{opt.label}</span>
                            </button>
                        );
                    })}
                    <div className="px-3 pt-3 pb-2 text-[11px] uppercase tracking-wide text-gray-400 border-t border-white/10">Sort By</div>
                    {options.filter(o => o.type === 'sort').map(opt => {
                        const active = sortBy === opt.value;
                        return (
                            <button
                                key={opt.value}
                                onClick={() => {
                                    setSortBy(opt.value);
                                    setOpen(false);
                                }}
                                className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 hover:bg-white/10 transition-all duration-150 ${active ? 'bg-orange-500/20 border-l-4 border-orange-500' : ''}`}
                            >
                                <span className="text-sm font-medium whitespace-nowrap">{opt.label}</span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MobileSortMenu;
