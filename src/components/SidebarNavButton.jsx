import React from 'react';

const SidebarNavButton = React.forwardRef(function SidebarNavButton(
	{ icon, label, onClick, active = false, ...rest },
	ref
) {
	const compact = !label; // collapsed sidebar uses no label
	return (
		<div className="relative group">
			{/* Active gradient accent bar */}
			<span
				aria-hidden
				className={`pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-[70%] w-1 rounded-full transition-opacity transition-transform duration-200 ${
					active ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-50'
				} bg-gradient-to-b from-indigo-400 via-purple-400 to-pink-400`}
			/>
			<button
				ref={ref}
				onClick={onClick}
				className={`w-full flex items-center ${label ? 'gap-3 pl-4 pr-3' : 'justify-center px-0'} py-3 rounded-xl text-left transition-all duration-200 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/60 ${
					active
						? 'bg-white/10 text-white border border-white/15 shadow-inner'
						: 'text-gray-300 hover:text-white'
				} backdrop-blur-[2px] hover:bg-white/5 hover:border hover:border-white/10`}
				style={{ minWidth: label ? undefined : '3.5rem' }}
				aria-pressed={active}
				{...rest}
			>
				<span className="w-7 h-7 flex items-center justify-center text-xl">{icon}</span>
				{label && <span>{label}</span>}
			</button>

			{/* Tooltip for compact (icon-only) mode */}
			{compact && (
				<span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap px-2 py-1 rounded-md text-xs text-white bg-gradient-to-br from-[#1a1d3a]/95 via-[#202449]/95 to-[#151833]/95 border border-white/10 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
					{rest['aria-label'] || label || 'Item'}
				</span>
			)}
		</div>
	);
});

export default SidebarNavButton;
