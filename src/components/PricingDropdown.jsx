import React, { useState, useRef, useEffect } from 'react';

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
                className="px-4 py-2 text-sm font-medium rounded-lg bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all duration-200 flex items-center gap-2 w-full justify-between shadow-lg"
            >
                <span className="flex items-center gap-2">
                    <span>{getSelected().icon}</span>
                    <span>{getSelected().label}</span>
                </span>
                <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 left-0 bg-[#0F0F0F] backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-2 min-w-[240px] z-[9999] overflow-visible space-y-1">
                    {pricingOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                handlePricing(option.value);
                                setIsOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left flex items-center gap-3 rounded-xl transition-all duration-200 group ${activePricing === option.value 
                                ? 'bg-white/20 text-white shadow-md' 
                                : 'text-gray-400 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <span className="text-lg opacity-80 group-hover:opacity-100 transition-opacity">{option.icon}</span>
                            <span className="text-sm font-semibold whitespace-nowrap flex-1">
                                {option.label}
                            </span>
                            {activePricing === option.value && (
                                <span className="text-xs text-white opacity-80">●</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PricingDropdown;
