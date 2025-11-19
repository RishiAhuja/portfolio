
import React, { useState } from 'react';

interface SmallContainerProps {
  text: string;
  clickLink?: string;
  icon?: React.ReactNode;
}

const SmallContainer: React.FC<SmallContainerProps> = ({ text, clickLink, icon }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        px-4 py-2 transition-all duration-200 rounded-sm
        ${isHovered ? 'bg-darkGrey border-accent-light' : 'bg-transparent border-darkGrey'}
        border cursor-${clickLink ? 'pointer' : 'default'}
        ${clickLink ? 'underline decoration-accent-light decoration-1' : ''}
        flex items-center gap-3
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (clickLink) {
          window.open(clickLink, '_blank');
        }
      }}
    >
      {icon && (
        <span className={`transition-colors duration-200 ${isHovered ? 'text-accent-light' : 'text-quillGray'}`}>
          {icon}
        </span>
      )}
      <span className={`font-ptMono ${isHovered ? 'text-accent-light' : 'text-quillGray'} text-lg md:text-xl transition-colors duration-200`}>
        {text}
      </span>
    </div>
  );
};

export default SmallContainer;