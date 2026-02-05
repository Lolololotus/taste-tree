import React from 'react';

interface CozyCardProps {
    children: React.ReactNode;
    className?: string;
}

export function CozyCard({ children, className = '' }: CozyCardProps) {
    return (
        <div
            className={`
        bg-[#FFFDF5] p-8 md:p-12 
        rounded-[2.5rem] 
        shadow-[8px_8px_0px_rgba(220,237,193,0.5)] 
        border-[3px] border-dashed border-[#D7CCC8]
        ${className}
      `}
        >
            {children}
        </div>
    );
}
