
import React, { useState } from 'react';
import SmallContainer from '../ui/SmallContainer.tsx';
import { FaGithub } from 'react-icons/fa';

interface ProjectCardProps {
  title: string;
  description: string;
  techStack: string[];
  features: string[];
  githubUrl?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  techStack,
  features,
  githubUrl,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 600;

  // Truncate description for mobile
  const truncateDescription = (text: string) => {
    if (text.length <= 100) return text;
    return `${text.substring(0, 100)}...`;
  };

  return (
    <div 
      className={`
        mb-6 md:mb-8 border rounded-sm transition-all duration-300 relative
        ${isHovered ? 'border-accent-light shadow-[0_4px_20px_-12px_rgba(100,178,188,0.25)] transform -translate-y-0.5' : 'border-darkGrey'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Accent corner */}
      <div className={`absolute top-0 right-0 w-0 h-0 transition-all duration-300
        border-t-[20px] border-r-[20px] 
        ${isHovered ? 'border-t-accent border-r-accent' : 'border-t-transparent border-r-transparent'}`}>
      </div>
      
      <div className="p-4 md:p-6">
        {/* Header - Always visible */}
        <h3 className="text-xl md:text-2xl font-bold font-ptMono text-quillGray group-hover:text-accent-light">
          {title}
        </h3>
        
        <div className="h-1 md:h-2" />
        
        <p className="text-sm md:text-base text-gray-400 font-ptMono leading-relaxed">
          {isMobile && !isExpanded ? truncateDescription(description) : description}
        </p>

        {/* Mobile: Show expand/collapse button */}
        {isMobile && (
          <button 
            className="mt-2 text-accent-light flex items-center font-ptMono"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show Less' : 'Show More'}
            <span className="ml-1">
              {isExpanded ? '▲' : '▼'}
            </span>
          </button>
        )}

        {/* Content sections */}
        {(!isMobile || isExpanded) && (
          <>
            <div className="h-4" />
            
            {/* Tech stack section */}
            <div>
              <div className="flex items-center">
                <h4 className="text-base md:text-lg font-bold font-ptMono text-quillGray">
                  Tech Stack
                </h4>
                <div className="ml-2 flex-1 h-px bg-darkGrey">
                  <div className="h-full w-1/4 bg-accent/30"></div>
                </div>
              </div>
              
              <div className="h-3" />
              
              <div className="flex flex-wrap gap-1 md:gap-2">
                {techStack.map((tech, index) => (
                  <SmallContainer key={index} text={tech} />
                ))}
              </div>
            </div>

            <div className="h-4" />

            {/* Features section */}
            <div>
              <div className="flex items-center">
                <h4 className="text-base md:text-lg font-bold font-ptMono text-quillGray">
                  Features
                </h4>
                <div className="ml-2 flex-1 h-px bg-darkGrey">
                  <div className="h-full w-1/4 bg-accent/30"></div>
                </div>
              </div>
              
              <div className="h-3" />
              
              <div className="flex flex-col space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start group">
                    <div className="mt-1.5 ml-2.5 w-1.5 h-1.5 rounded-full bg-accent-light/70 group-hover:bg-accent-light transition-colors duration-200"></div>
                    <span className="ml-2.5 font-ptMono text-quillGray text-base">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* GitHub button */}
            {githubUrl && (
              <>
                <div className="h-4" />
                <button
                  className="w-full border border-darkGrey rounded-sm p-3.5 transition-all
                    hover:border-accent-light hover:bg-accent/5 text-center flex justify-center items-center group"
                  onClick={() => window.open(githubUrl, '_blank')}
                >
                  <FaGithub className="text-quillGray group-hover:text-accent-light mr-2.5 transition-colors" />
                  <span className="font-ptMono text-quillGray group-hover:text-accent-light transition-colors">View on GitHub</span>
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;