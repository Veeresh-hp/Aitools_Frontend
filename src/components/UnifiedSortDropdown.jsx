import React, { useState, useRef, useEffect } from 'react';

const UnifiedSortDropdown = ({ 
    dateFilter, handleDateFilter, 
    sortOrder, handleSortOrder, 
    nameFilter, handleNameFilter 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedSection, setExpandedSection] = useState('date'); // 'date' | 'name' | null
    const [showCustomDate, setShowCustomDate] = useState(false);
    const [showLetterSelector, setShowLetterSelector] = useState(false);
    const dropdownRef = useRef(null);

    // Options Arrays
    const dateOptions = [
        { value: 'all', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: 'month', label: 'This Month' },
        { value: 'custom', label: 'Choose Date...' }
    ];
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setShowCustomDate(false);
                setShowLetterSelector(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleLetter = (letter) => {
        const current = [...nameFilter];
        const idx = current.indexOf(letter);
        if (idx >= 0) current.splice(idx, 1);
        else current.push(letter);
        handleNameFilter(current);
        // If filtering by letters, force name sort if not already
        if (!['name_asc', 'name_desc'].includes(sortOrder)) {
            handleSortOrder('name_asc');
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all duration-200 flex items-center gap-2 w-full justify-between shadow-lg"
            >
                <span className="truncate">Sort By</span>
                <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 right-0 bg-[#0F0F0F] backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-2 min-w-[240px] z-[9999] overflow-visible flex flex-col gap-1">
                    
                    {/* Date Added Section */}
                    <div className="rounded-xl overflow-hidden bg-white/5 border border-white/5">
                        <button 
                            onClick={() => setExpandedSection(expandedSection === 'date' ? null : 'date')}
                            className="w-full px-4 py-3 flex items-center justify-between text-sm font-bold text-gray-200 hover:bg-white/5 transition-colors"
                        >
                            <span>Date Added</span>
                            <span className={`transition-transform ${expandedSection === 'date' ? 'rotate-180' : ''}`}>▼</span>
                        </button>
                        
                        {expandedSection === 'date' && (
                            <div className="p-2 space-y-1 bg-black/20 border-t border-white/5">
                                {!showCustomDate ? (
                                    dateOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                if (option.value === 'custom') {
                                                    setShowCustomDate(true);
                                                } else {
                                                    handleDateFilter({ type: option.value, value: null });
                                                    handleSortOrder('date'); // Switch sort to date
                                                }
                                            }}
                                            className={`w-full px-3 py-2 text-left rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                                                dateFilter.type === option.value && sortOrder === 'date' ? 'bg-[#FF6B00] text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'
                                            }`}
                                        >
                                            {option.label}
                                            {dateFilter.type === option.value && sortOrder === 'date' && option.value !== 'custom' && <span>✓</span>}
                                        </button>
                                    ))
                                ) : (
                                    <div className="space-y-2 p-1">
                                         <div className="flex items-center justify-between text-xs text-gray-400">
                                            <span>Pick Date</span>
                                            <button onClick={() => setShowCustomDate(false)} className="hover:text-white text-[10px] uppercase">Back</button>
                                         </div>
                                         <input 
                                            type="date" 
                                            className="w-full bg-white/10 border border-white/10 rounded px-2 py-1 text-white text-xs"
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    handleDateFilter({ type: 'custom', value: e.target.value });
                                                    handleSortOrder('date');
                                                }
                                            }}
                                         />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Name Section */}
                    <div className="rounded-xl overflow-hidden bg-white/5 border border-white/5">
                         <button 
                            onClick={() => setExpandedSection(expandedSection === 'name' ? null : 'name')}
                            className="w-full px-4 py-3 flex items-center justify-between text-sm font-bold text-gray-200 hover:bg-white/5 transition-colors"
                        >
                            <span>Name</span>
                            <span className={`transition-transform ${expandedSection === 'name' ? 'rotate-180' : ''}`}>▼</span>
                        </button>
                        
                        {expandedSection === 'name' && (
                            <div className="p-2 space-y-1 bg-black/20 border-t border-white/5">
                                {!showLetterSelector ? (
                                    <>
                                        <button
                                            onClick={() => { handleSortOrder('name_asc'); handleNameFilter([]); }}
                                            className={`w-full px-3 py-2 text-left rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                                                sortOrder === 'name_asc' && nameFilter.length === 0 ? 'bg-[#FF6B00] text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'
                                            }`}
                                        >
                                            A - Z
                                            {sortOrder === 'name_asc' && nameFilter.length === 0 && <span>✓</span>}
                                        </button>
                                        <button
                                            onClick={() => { handleSortOrder('name_desc'); handleNameFilter([]); }}
                                            className={`w-full px-3 py-2 text-left rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                                                sortOrder === 'name_desc' && nameFilter.length === 0 ? 'bg-[#FF6B00] text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'
                                            }`}
                                        >
                                            Z - A
                                            {sortOrder === 'name_desc' && nameFilter.length === 0 && <span>✓</span>}
                                        </button>
                                        <button
                                            onClick={() => setShowLetterSelector(true)}
                                            className={`w-full px-3 py-2 text-left rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                                                nameFilter.length > 0 ? 'bg-[#FF6B00] text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'
                                            }`}
                                        >
                                            Customize...
                                            <span>→</span>
                                        </button>
                                    </>
                                ) : (
                                    <div className="space-y-2 p-1">
                                        <div className="flex items-center justify-between text-xs text-gray-400">
                                            <span>Start Letter</span>
                                            <button onClick={() => setShowLetterSelector(false)} className="hover:text-white text-[10px] uppercase">Back</button>
                                        </div>
                                        <div className="grid grid-cols-5 gap-1 max-h-[160px] overflow-y-auto scrollbar-hide py-1">
                                            {alphabet.map(letter => (
                                                <button
                                                    key={letter}
                                                    onClick={() => toggleLetter(letter)}
                                                    className={`aspect-square rounded flex items-center justify-center text-[10px] font-bold ${
                                                        nameFilter.includes(letter) ? 'bg-orange-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'
                                                    }`}
                                                >
                                                    {letter}
                                                </button>
                                            ))}
                                        </div>
                                        <button onClick={() => handleNameFilter([])} className="w-full text-[10px] text-center text-gray-500 hover:text-white">Clear Selection</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
};

export default UnifiedSortDropdown;
