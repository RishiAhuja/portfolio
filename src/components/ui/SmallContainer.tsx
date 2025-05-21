'use client';

import React, { useState } from 'react';

interface SmallContainerProps {
  text: string;
  clickLink?: string;
}

const SmallContainer: React.FC<SmallContainerProps> = ({ text, clickLink }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        px-4 py-2 transition-all duration-200 rounded-sm
        ${isHovered ? 'bg-darkGrey border-accent-light' : 'bg-transparent border-darkGrey'}
        border cursor-${clickLink ? 'pointer' : 'default'}
        ${clickLink ? 'underline decoration-accent-light decoration-1' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (clickLink) {
          window.open(clickLink, '_blank');
        }
      }}
    >
      <span className={`font-ptMono ${isHovered ? 'text-accent-light' : 'text-quillGray'} text-lg md:text-xl transition-colors duration-200`}>
        {text}
      </span>
    </div>
  );
};

export default SmallContainer;