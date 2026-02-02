import React from 'react';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
}

export function PixelButton({ children, className = '', variant = 'primary', ...props }: PixelButtonProps) {
    const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 font-bold text-sm transition-transform active:translate-y-1 focus:outline-none";

    const variants = {
        primary: "bg-[#4ade80] text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]",
        secondary: "bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            style={{ imageRendering: 'pixelated' }}
            {...props}
        >
            {children}
        </button>
    );
}
