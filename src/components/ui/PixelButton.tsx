import React from 'react';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
}

export function PixelButton({ children, className = '', variant = 'primary', ...props }: PixelButtonProps) {
    // Soft, puffy button style with "high res" rounded pixel feel
    const baseStyles = "relative inline-flex items-center justify-center px-8 py-4 font-bold text-lg transition-all duration-200 active:scale-95 active:translate-y-1 focus:outline-none rounded-xl";

    const variants = {
        // Mint Green Tea Cookie style
        primary: `
      bg-[#A8E6CF] text-[#5D4037] 
      border-b-4 border-r-4 border-[#84D9B6] 
      shadow-[4px_4px_10px_rgba(168,230,207,0.4)]
      hover:bg-[#97E0C3] hover:border-[#73CFA9]
    `,
        // Soft Pink Macaron style
        secondary: `
      bg-[#FFD3B6] text-[#5D4037]
      border-b-4 border-r-4 border-[#FFBC93]
      shadow-[4px_4px_10px_rgba(255,211,182,0.4)]
      hover:bg-[#FFC6A2] hover:border-[#FFA978]
    `
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            <span className="drop-shadow-sm">{children}</span>
        </button>
    );
}
