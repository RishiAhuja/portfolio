
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
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full py-3 border-b border-darkGrey/20 hover:border-accent-light/30 transition-colors duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-baseline gap-4 md:gap-8">
        {/* Date Column - Fixed width on desktop */}
        {date && (
          <div className="flex-shrink-0 w-24 md:w-32 font-ptMono text-xs md:text-sm text-gunSmoke group-hover:text-quillGray transition-colors duration-300">
            {date}
          </div>
        )}

        {/* Content Column */}
        <div className="flex-grow flex items-baseline justify-between gap-4 min-w-0">
          <h3 className={`
            font-ptMono text-sm md:text-base font-medium truncate
            ${isHovered ? 'text-accent-light' : 'text-quillGray'}
            transition-colors duration-300
          `}>
            {title}
          </h3>

          {/* Arrow */}
          <div className={`
            flex-shrink-0 transform transition-all duration-300
            ${isHovered ? 'translate-x-0 opacity-100 text-accent-light' : '-translate-x-2 opacity-0'}
          `}>
            →
          </div>
        </div>
      </div>
    </a>
  );
};

export default BlogPostItem;