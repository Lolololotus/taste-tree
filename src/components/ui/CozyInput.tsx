import React from 'react';

interface CozyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
}

export function CozyInput({ className = '', ...props }: CozyInputProps) {
    return (
        <input
            className={`
        w-full px-6 py-4 rounded-xl text-lg
        bg-white border-4 border-[#A8E6CF] text-[#5D4037]
        placeholder-[#D7CCC8]
        focus:outline-none focus:border-[#4ade80] focus:shadow-[0_0_0_4px_rgba(168,230,207,0.4)]
        transition-all duration-200
        ${className}
      `}
            {...props}
        />
    );
}
