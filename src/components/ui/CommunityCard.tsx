import React, { useState } from 'react';

interface CommunityStat {
    label: string;
    value: string | number;
}

interface CommunityCardProps {
    title: string;
    role: string;
    date: string;
    description: string;
    stats: CommunityStat[];
    link?: string;
    external?: boolean;
    icon?: 'flutter' | 'mentor' | 'community';
}

const getIcon = (type: string) => {
    switch (type) {
        case 'flutter':
            return (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.314 0L2.3 12 6 15.7 21.684.013h-7.357zm.014 11.072L7.857 17.53l6.47 6.47H21.7l-6.46-6.468 6.46-6.46h-7.37z" />
                </svg>
            );
        case 'mentor':
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            );
        case 'community':
        default:
            return (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            );
    }
};

const CommunityCard: React.FC<CommunityCardProps> = ({
    title,
    role,
    date,
    description,
    stats,
    link,
    external = false,
    icon = 'community'
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="mb-6 group">
            <div
                className={`
          relative w-full p-5 md:p-7 transition-all duration-300 rounded-sm
          border ${isHovered
                        ? 'border-accent-light shadow-[0_4px_20px_-12px_rgba(100,178,188,0.25)] transform -translate-y-1'
                        : 'border-darkGrey'}
          overflow-hidden bg-[#1a1a1a]
        `}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Accent corner */}
                <div className={`absolute top-0 right-0 w-0 h-0 transition-all duration-300
          border-t-[20px] border-r-[20px]
          ${isHovered ? 'border-t-accent-light border-r-accent-light' : 'border-t-transparent border-r-transparent'}`}>
                </div>

                <div className="flex flex-col md:flex-row md:items-start gap-5">
                    {/* Icon */}
                    <div className={`
            hidden md:flex flex-shrink-0 w-12 h-12 rounded-sm items-center justify-center
            transition-all duration-300
            ${isHovered ? 'bg-accent-light/10 text-accent-light' : 'bg-darkGrey/30 text-gunSmoke'}
          `}>
                        {getIcon(icon)}
                    </div>

                    <div className="flex-1 min-w-0">
                        {/* Header section */}
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                            <div>
                                <div className="flex items-center gap-3 mb-1 md:hidden">
                                    <div className={`
                      flex w-8 h-8 rounded-sm items-center justify-center
                      ${isHovered ? 'bg-accent-light/10 text-accent-light' : 'bg-darkGrey/30 text-gunSmoke'}
                    `}>
                                        {getIcon(icon)}
                                    </div>
                                    <span className="text-xs font-ptMono text-gunSmoke/70">{date}</span>
                                </div>

                                <h3 className={`text-xl md:text-2xl font-bold font-ptMono transition-colors duration-200 ${isHovered ? 'text-accent-light' : 'text-quillGray'
                                    }`}>
                                    {title}
                                </h3>

                                <p className="text-base font-ptMono text-accent-light mt-1">
                                    {role}
                                </p>
                            </div>

                            <div className="hidden md:block text-right flex-shrink-0">
                                <span className="text-sm font-ptMono text-gunSmoke/70 block">{date}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-gunSmoke font-ptMono leading-relaxed text-sm md:text-base mb-6 max-w-3xl">
                            {description}
                        </p>

                        {/* CTA */}
                        {link && (
                            <div className="flex justify-end md:justify-start">
                                <a
                                    href={link}
                                    target={external ? '_blank' : undefined}
                                    rel={external ? 'noopener noreferrer' : undefined}
                                    className={`
                    inline-flex items-center gap-2 text-sm font-ptMono transition-all duration-200
                    ${isHovered ? 'text-accent-light translate-x-1' : 'text-gunSmoke hover:text-accent-light'}
                  `}
                                >
                                    <span>{external ? 'View Details' : 'Explore Bootcamp'}</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={external ? "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" : "M17 8l4 4m0 0l-4 4m4-4H3"} />
                                    </svg>
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Subtle hover background effect */}
                {isHovered && (
                    <div className="absolute inset-0 bg-accent/5 -z-10"></div>
                )}
            </div>
        </div>
    );
};

export default CommunityCard;
