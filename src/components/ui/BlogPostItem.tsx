'use client';

import React, { useState } from 'react';

interface BlogPostItemProps {
  title: string;
  link: string;
  date?: string;
  readTime?: string;
}

const BlogPostItem: React.FC<BlogPostItemProps> = ({ 
  title, 
  link, 
  date,
  readTime 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        cursor-pointer transition-all duration-200 rounded-sm
        ${isHovered ? 'bg-darkGrey/30 border-accent-light' : 'bg-transparent border-transparent'}
        border p-3 md:p-4
        block w-full
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.open(link, '_blank')}
    >
      {/* Mobile Layout - Stacked */}
      <div className="block md:hidden">
        {/* Title for mobile */}
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
        
        {/* Date and arrow for mobile */}
        <div className="flex items-center justify-between pl-4">
          {date && (
            <span className="text-xs text-gunSmoke font-ptMono px-2 py-1 bg-darkGrey/20 rounded-sm">
              {date}
            </span>
          )}
          <div className={`
            transition-all duration-200
            ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-70 -translate-x-1'}
          `}>
            <span className="text-accent-light text-sm">→</span>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Horizontal */}
      <div className="hidden md:flex md:items-center md:justify-between md:gap-4">
        {/* Title section for desktop */}
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
            text-lg lg:text-xl
            ${isHovered ? 'text-accent-light' : ''}
            transition-colors duration-200
            leading-normal
            truncate
          `}>
            {title}
          </span>
        </div>
        
        {/* Date and arrow for desktop */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {date && (
            <span className="text-sm text-gunSmoke font-ptMono px-2 py-1 bg-darkGrey/20 rounded-sm whitespace-nowrap">
              {date}
            </span>
          )}
          
          <div className={`
            transition-all duration-200
            ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
          `}>
            <span className="text-accent-light text-lg">→</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostItem;