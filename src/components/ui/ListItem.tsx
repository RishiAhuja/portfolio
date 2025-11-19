import React, { useState } from 'react';

interface ListItemProps {
    title: string;
    link: string;
    badge?: {
        text: string;
        className?: string;
    };
    meta?: string;
    className?: string;
}

const ListItem: React.FC<ListItemProps> = ({ title, link, badge, meta, className = '' }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`
        cursor-pointer transition-all duration-200 rounded-sm
        ${isHovered ? 'bg-darkGrey/30 border-accent-light' : 'bg-transparent border-transparent'}
        border p-3 md:p-4
        block w-full
        ${className}
      `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => window.open(link, '_blank')}
        >
            {/* Mobile Layout */}
            <div className="block md:hidden">
                <div className="flex items-start gap-2 mb-3">
                    <div
                        className={`
              ${isHovered ? 'w-2 h-2' : 'w-1.5 h-1.5'} 
              rounded-full bg-accent-light transition-all duration-200
              flex-shrink-0 mt-1.5
            `}
                    />
                    <span className={`
            font-ptMono text-quillGray 
            text-sm leading-tight
            ${isHovered ? 'text-accent-light' : ''}
            transition-colors duration-200
            break-words flex-1
          `}>
                        {title}
                    </span>
                </div>

                <div className="flex items-center justify-between pl-4 gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        {badge && (
                            <span className={`px-2 py-0.5 text-xs font-ptMono rounded border ${badge.className || 'bg-darkGrey/20 text-gunSmoke border-transparent'}`}>
                                {badge.text}
                            </span>
                        )}
                        {meta && (
                            <span className="text-xs text-gunSmoke font-ptMono">
                                {meta}
                            </span>
                        )}
                    </div>
                    <div className={`
            transition-all duration-200
            ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-70 -translate-x-1'}
          `}>
                        <span className="text-accent-light text-sm">→</span>
                    </div>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex md:items-center md:justify-between md:gap-4">
                <div className="flex items-center flex-1 min-w-0 gap-3">
                    <div
                        className={`
              ${isHovered ? 'w-2 h-2' : 'w-1.5 h-1.5'} 
              rounded-full bg-accent-light transition-all duration-200
              flex-shrink-0
            `}
                    />

                    <span className={`
            font-ptMono text-quillGray 
            text-base lg:text-lg
            ${isHovered ? 'text-accent-light' : ''}
            transition-colors duration-200
            leading-normal
            truncate
          `}>
                        {title}
                    </span>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                    {badge && (
                        <span className={`px-2 py-0.5 text-xs font-ptMono rounded border ${badge.className || 'bg-darkGrey/20 text-gunSmoke border-transparent'}`}>
                            {badge.text}
                        </span>
                    )}
                    {meta && (
                        <span className="text-sm text-gunSmoke font-ptMono whitespace-nowrap">
                            {meta}
                        </span>
                    )}

                    <div className={`
            transition-all duration-200
            ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-70 -translate-x-1'}
          `}>
                        <span className="text-accent-light text-lg">→</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListItem;
