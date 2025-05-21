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
        border py-3 px-4 flex items-center
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.open(link, '_blank')}
    >
      <div className="flex flex-col flex-1">
        <div className="flex items-center">
          <div 
            className={`
              ${isHovered ? 'w-2 h-2' : 'w-1.5 h-1.5'} 
              rounded-full bg-accent-light transition-all duration-200
            `}
          />
          
          <span className={`
            ml-3 font-ptMono text-quillGray text-lg md:text-xl
            ${isHovered ? 'text-accent-light' : ''}
            transition-colors duration-200
          `}>
            {title}
          </span>
        </div>
        
        <div className="ml-5 mt-1 flex items-center text-xs text-gunSmoke">
          <span>{date}</span>
          {readTime && (
            <>
              <span className="mx-2">•</span>
              <span>{readTime}</span>
            </>
          )}
        </div>
      </div>
      
      <div className={`
        transition-all duration-200
        ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
      `}>
        <span className="text-accent-light">→</span>
      </div>
    </div>
  );
};

export default BlogPostItem;