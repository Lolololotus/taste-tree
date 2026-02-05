import React from 'react';

interface ConsoleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export function ConsoleInput({ label = "답변", className = '', ...props }: ConsoleInputProps) {
    return (
        <div className={`flex items-center gap-2 font-bold text-lg md:text-xl text-[#5D4037] ${className}`}>
            <span className="whitespace-nowrap">[ {label}: </span>
            <input
                className="
          bg-transparent border-b-2 border-[#5D4037] 
          focus:outline-none focus:border-[#4ade80] 
          w-full py-1 text-[#5D4037] placeholder-[#D7CCC8]
        "
                {...props}
            />
            <span className="whitespace-nowrap"> ]</span>
        </div>
    );
}
