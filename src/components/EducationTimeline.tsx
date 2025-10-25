
import React, { useState } from 'react';
import ExpandedContainer from './ui/ExpandedContainer.tsx';

interface TimelineItemProps {
  duration: string;
  institute: string;
  department: string;
  achievement: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  duration,
  institute,
  department,
  achievement,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="flex items-start"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Timeline icon */}
      <div className={`
        rounded-full border transition-all duration-300
        flex items-center justify-center w-6 h-6
        ${isHovered 
          ? 'border-accent-light transform scale-110' 
          : 'border-darkGrey'}
      `}>
        <svg
          className={`w-3 h-3 transition-colors duration-300 
            ${isHovered ? 'text-accent-light' : 'text-quillGray'}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l9-5-9-5-9 5 9 5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14v7"
          />
        </svg>
      </div>
      
      {/* Content */}
      <div className={`
        ml-6 transition-all duration-300
        ${isHovered ? 'transform -translate-y-1' : ''}
      `}>
        {/* Duration */}
        <div className={`
          inline-block px-3 py-1 mb-3 border text-sm font-ptMono transition-all duration-300
          ${isHovered 
            ? 'border-accent-light/50 text-accent-light bg-accent/5' 
            : 'border-darkGrey text-gray-400'}
        `}>
          {duration}
        </div>
        
        {/* Institute */}
        <h3 className={`
          text-xl font-bold font-ptMono transition-colors duration-300
          ${isHovered ? 'text-accent-light' : 'text-quillGray'}
        `}>
          {institute}
        </h3>
        
        <div className="h-2" />
        
        {/* Department */}
        <p className="text-base font-ptMono text-quillGray">
          {department}
        </p>
        
        <div className="h-2" />
        
        {/* Achievement */}
        <div className="flex items-center mb-8">
          <div className={`
            w-1.5 h-1.5 rounded-full mr-2 transition-colors duration-300
            ${isHovered ? 'bg-accent-light' : 'bg-gray-500'}
          `}></div>
          <span className="text-sm font-ptMono text-gray-400">
            {achievement}
          </span>
        </div>
      </div>
    </div>
  );
};

const EducationTimeline: React.FC = () => {
  return (
    <div>
      <ExpandedContainer text="Education" />
      <div className="h-6" />
      <div className="pl-2">
        <TimelineItem
          duration="Present"
          institute="Dr. B.R. Ambedkar NIT, Jalandhar"
          department="Department of Information Technology"
          achievement="Currently pursuing B.Tech"
        />
      </div>
    </div>
  );
};

export default EducationTimeline;