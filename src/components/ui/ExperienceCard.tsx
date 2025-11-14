
import React, { useState } from 'react';
import { format, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';


interface ExperienceCardProps {
  role: string;
  company: string;
  type: string;
  startDate: Date;
  endDate?: Date;
  location: string;
  responsibilities?: string[];
  companyLogo?: string;
  skills?: string[];
  current?: boolean;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  role,
  company,
  type,
  startDate,
  endDate,
  location,
  responsibilities,
  companyLogo,
  skills,
  current = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Format date range in a more readable format
  const formatDateRange = () => {
    const startStr = format(startDate, 'MMM yyyy');
    const endStr = endDate ? format(endDate, 'MMM yyyy') : 'Present';
    return `${startStr} - ${endStr}`;
  };

  // Calculate duration with improved precision for short durations
  const calculateDuration = () => {
    const end = endDate || new Date();
    
    // Calculate years, months, and days
    const years = differenceInYears(end, startDate);
    const months = differenceInMonths(end, startDate) % 12;
    const totalDays = differenceInDays(end, startDate);
    
    // For very short durations, show days
    if (totalDays < 30) {
      return `${totalDays} day${totalDays !== 1 ? 's' : ''}`;
    }
    
    // For durations under a year, show months and days if less than 11 months
    if (years === 0) {
      // If exactly N months, just show months
      if (months === Math.floor(totalDays / 30)) {
        return `${months} mo${months !== 1 ? 's' : ''}`;
      }
      
      // Calculate remaining days after accounting for full months
      const remainingDays = totalDays - (months * 30);
      
      // Only show days if there are some significant days remaining
      if (remainingDays > 5) {
        return `${months} mo${months !== 1 ? 's' : ''}, ${remainingDays} day${remainingDays !== 1 ? 's' : ''}`;
      }
      
      return `${months} mo${months !== 1 ? 's' : ''}`;
    }
    
    // For longer durations, show years and months
    const yearText = years > 0 ? `${years} yr${years > 1 ? 's' : ''}` : '';
    const monthText = months > 0 ? `${months} mo${months > 1 ? 's' : ''}` : '';
    
    if (yearText && monthText) {
      return `${yearText}, ${monthText}`;
    }
    
    return yearText || monthText;
  };

  return (
    <div className="mb-8">
      <div
        className={`
          relative w-full p-4 md:p-6 transition-all duration-300 rounded-sm
          border ${isHovered
            ? 'border-accent-light shadow-[0_4px_20px_-12px_rgba(100,178,188,0.25)] transform -translate-y-1'
            : 'border-darkGrey'}
          overflow-hidden
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Current job indicator */}
        {current && (
          <div className="absolute top-0 left-0 bg-accent-light text-black text-xs font-bold px-2 py-1 font-ptMono">
            CURRENT
          </div>
        )}
        
        {/* Accent corner */}
        <div className={`absolute top-0 right-0 w-0 h-0 transition-all duration-300
          border-t-[20px] border-r-[20px]
          ${isHovered ? 'border-t-accent-light border-r-accent-light' : 'border-t-transparent border-r-transparent'}`}>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-start">
          {/* Company logo (if provided) */}
          {companyLogo && (
            <div className="hidden md:block mr-6 mt-1">
              <div className="w-12 h-12 bg-darkGrey/30 rounded-sm overflow-hidden flex items-center justify-center">
                <img 
                  src={companyLogo}
                  alt={`${company} logo`}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              </div>
            </div>
          )}
          
          <div className="flex-1">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between">
              <div>
                {/* Role title with hover effect */}
                <h3 className={`text-lg md:text-2xl font-bold font-ptMono transition-colors duration-200 ${
                  isHovered ? 'text-accent-light' : 'text-quillGray'
                }`}>
                  {role}
                </h3>
                
                <p className="text-base md:text-lg font-ptMono text-quillGray mt-1">
                  {company}
                </p>
              </div>
              
              {/* Date information for larger screens */}
              <div className="hidden md:block text-right">
                <p className="text-gray-400 font-ptMono">
                  {formatDateRange()}
                </p>
                <p className="text-gray-500 font-ptMono text-sm">
                  {calculateDuration()}
                </p>
              </div>
            </div>
            
            {/* Date information for mobile */}
            <div className="md:hidden mt-2">
              <p className="text-sm font-ptMono text-gray-400">
                {formatDateRange()} · {calculateDuration()}
              </p>
            </div>
            
            {/* Job details */}
            <div className="mt-2 md:mt-3">
              <div className="flex flex-col md:flex-row md:items-center text-gray-400 font-ptMono text-sm md:text-base">
                <span className="mr-3">{type}</span>
                <span className="hidden md:inline-block mx-2">•</span>
                <span>{location}</span>
              </div>
            </div>
            
            {/* Skills tags (if provided) */}
            {skills && skills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-darkGrey/50 text-gray-400 px-1.5 py-0.5 rounded-sm font-ptMono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
            
            {/* Responsibilities section */}
            {responsibilities && responsibilities.length > 0 && (
              <>
                <div className="mt-4 md:mt-6">
                  {/* Section divider with accent */}
                  <div className="w-full h-px bg-darkGrey mb-4 relative">
                    <div className="absolute left-0 top-0 h-full w-1/3 bg-accent-light/40"></div>
                  </div>
                  
                  {/* On mobile, add an expand/collapse button */}
                  <div className="md:hidden mb-3">
                    <button 
                      className="text-accent-light flex items-center font-ptMono text-sm"
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
                      {isExpanded ? 'Hide details' : 'Show details'}
                      <span className="ml-1">
                        {isExpanded ? '▲' : '▼'}
                      </span>
                    </button>
                  </div>
                  
                  {/* Responsibilities list (always shown on desktop, toggleable on mobile) */}
                  <div className={`space-y-2 ${isExpanded ? 'block' : 'hidden md:block'}`}>
                    {responsibilities.map((responsibility, index) => (
                      <div key={index} className="flex items-start group">
                        {/* Bullet point with accent */}
                        <div className="mt-1.5 mr-2.5 w-1.5 h-1.5 rounded-full bg-accent-light/70 group-hover:bg-accent-light transition-colors duration-200"></div>
                        <span className="text-gray-400 font-ptMono group-hover:text-quillGray transition-colors duration-200">
                          {responsibility}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
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

export default ExperienceCard;