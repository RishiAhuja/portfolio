import React, { useState, useEffect } from 'react';
import { timelineData, type TimelineEvent } from '../data/timeline';
import ExpandedContainer from './ui/ExpandedContainer';

const getButtonIcon = (iconType: string) => {
  switch (iconType) {
    case 'github':
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      );
    case 'demo':
    case 'external':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      );
    case 'blog':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      );
    case 'certificate':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      );
    case 'video':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'docs':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case 'download':
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      );
  }
};

interface TimelineCardProps {
  item: TimelineEvent;
  index: number;
}

const TimelineCard: React.FC<TimelineCardProps> = ({ item, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <div className="relative flex items-start">
      {/* Timeline dot with glow */}
      <div 
        className={`relative z-10 bg-accent rounded-full border-2 border-codGray shadow-[0_0_8px_rgba(100,178,188,0.3)]
          ${isMobile ? 'w-2.5 h-2.5 mt-4 mr-4' : 'w-3 h-3 mt-6 mr-6'}`}
        style={{ 
          animation: `dot-pulse 3s ease-in-out infinite ${index * 0.2}s`,
        }}
      >
        {/* Subtle ring animation */}
        <div className="absolute -inset-1 border border-accent/20 rounded-full animate-ping" 
          style={{ animationDuration: '4s', animationDelay: `${index * 0.3}s` }}></div>
      </div>
      
      {/* Timeline card */}
      <div className="flex-1 mb-2">
        <div 
          className={`
            border rounded-sm transition-all duration-300 relative group
            ${isHovered ? 'border-accent shadow-[0_4px_20px_-12px_rgba(100,178,188,0.25)] transform -translate-y-1' : 'border-darkGrey/30'}
          `}
          style={{ backgroundColor: '#191919' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Accent corner */}
          <div className={`absolute top-0 right-0 w-0 h-0 transition-all duration-300
            ${isMobile ? 'border-t-[12px] border-r-[12px]' : 'border-t-[20px] border-r-[20px]'}
            ${isHovered ? 'border-t-accent border-r-accent' : 'border-t-transparent border-r-transparent'}`}>
          </div>
          
          <div className={isMobile ? "p-3" : "p-6"}>
            {/* Header with Journey Link on the right */}
            <div className={`flex items-start justify-between ${isMobile ? 'mb-3' : 'mb-4'}`}>
              <div className="flex-1 pr-3">
                <h3 className={`font-ptMono font-bold text-quillGray group-hover:text-accent transition-colors duration-200
                  ${isMobile ? 'text-base mb-2' : 'text-xl mb-2'}`}>
                  {item.title}
                </h3>
                <p className={`text-gunSmoke leading-relaxed font-ptMono
                  ${isMobile ? 'text-xs' : 'text-base'}`}>
                  {item.description}
                </p>
              </div>
              
              {/* Journey Link - Subtle and on the right */}
              {item.journeySlug && (
                <a
                  href={`/journey/${item.journeySlug}`}
                  className={`flex-shrink-0 font-ptMono text-gunSmoke hover:text-accent 
                    transition-colors duration-200 border-b border-transparent hover:border-accent/30 pb-0.5 mt-1
                    ${isMobile ? 'text-xs' : 'text-xs'}`}
                >
                  Read Journey →
                </a>
              )}
            </div>
            
            {/* Type and status pills */}
            <div className={`flex flex-wrap gap-2 ${isMobile ? 'mb-3' : 'mb-4'}`}>
              <span className={`text-xs bg-darkGrey/30 text-gunSmoke rounded-sm font-ptMono
                ${isMobile ? 'px-2 py-1' : 'px-3 py-1.5'}`}>
                {item.type}
              </span>
              {item.status && (
                <span className={`text-xs bg-accent/10 text-accent rounded-sm font-ptMono border border-accent/20
                  ${isMobile ? 'px-2 py-1' : 'px-3 py-1.5'}`}>
                  {item.status}
                </span>
              )}
            </div>
            
            {/* Action Buttons */}
            {item.buttons && item.buttons.length > 0 && (
              <div className={`flex flex-wrap gap-2 ${isMobile ? 'mb-3' : 'mb-4'}`}>
                {item.buttons.map((button, buttonIndex) => (
                  <a
                    key={buttonIndex}
                    href={button.link}
                    className={`inline-flex items-center gap-2 font-ptMono 
                      border border-darkGrey/50 text-gunSmoke hover:border-accent hover:text-accent 
                      transition-all duration-200 rounded-sm hover:bg-accent/5
                      ${isMobile ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'}`}
                    target={button.link.startsWith('#') ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                  >
                    {getButtonIcon(button.icon)}
                    <span>{button.label}</span>
                  </a>
                ))}
              </div>
            )}

            {/* Bottom section */}
            <div className="flex justify-between items-center pt-3 border-t border-darkGrey/20">
              <span className={`text-gunSmoke font-ptMono
                ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {item.date}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimelineView: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  // Get all years sorted in descending order
  const years = Object.keys(timelineData).sort((a, b) => b.localeCompare(a));

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 800);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <main className="min-h-screen text-quillGray" style={{ backgroundColor: '#191919' }}>
      {/* Back to Home - Fixed positioning */}
      <div className="pt-8 pb-4">
        <div className={`${isMobile ? 'w-full px-4' : 'w-[65%] px-8'} mx-auto`}>
          <a 
            href="/" 
            className="inline-flex items-center gap-2 text-accent hover:text-accent transition-colors font-ptMono text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </a>
        </div>
      </div>

      <div className={`${isMobile ? 'w-full px-4' : 'w-[65%] px-8'} mx-auto py-8 relative`}>
        {/* Header */}
        <div className="mb-12 relative text-center">
          <h1 className={`font-bold font-ptMono text-quillGray mb-3 ${isMobile ? 'text-3xl' : 'text-5xl'}`}>
            Life Ledger
          </h1>
          <p className={`text-gunSmoke font-ptMono mb-6 ${isMobile ? 'text-sm' : 'text-base'} max-w-2xl mx-auto`}>
            A running log of things happened to me.
          </p>
          <div className="w-24 h-px bg-accent mx-auto hidden md:block"></div>
        </div>

        {/* Iterate through all years */}
        {years.map((year, yearIndex) => {
          const currentData = timelineData[year] || [];
          
          return (
            <div key={year} className="mb-16">
              {/* Year Separator */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-darkGrey/50 to-transparent"></div>
                <div className="relative">
                  <span className="text-accent text-sm px-4 py-2 border border-accent/30 rounded-sm bg-codGray/50 backdrop-blur-sm font-ptMono">
                    Academic Year {year}
                  </span>
                  {/* Corner accents */}
                  <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-accent/50"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-accent/50"></div>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-darkGrey/50 to-transparent"></div>
              </div>

              {/* Timeline for this year */}
              <div>
                <ExpandedContainer text="Timeline Events" />
                <div className="h-8" />
                
                <div className="relative">
                  {/* Vertical timeline line */}
                  <div 
                    className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-darkGrey/20 via-darkGrey/40 to-darkGrey/20"
                    style={{ left: isMobile ? '5px' : '6px' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/10 to-transparent"></div>
                    <div 
                      className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-accent/30 via-accent/10 to-transparent"
                      style={{
                        animation: 'timeline-flow 15s ease-in-out infinite',
                      }}
                    ></div>
                  </div>
            
                  <div className="space-y-0">
                    {currentData.length > 0 ? currentData.map((item, index) => (
                      <TimelineCard 
                        key={index} 
                        item={item} 
                        index={index}
                      />
                    )) : (
                      <div className="text-center py-12">
                        <p className="text-lg font-ptMono text-gunSmoke">
                          No timeline events found.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes timeline-flow {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(100vh);
            opacity: 0.1;
          }
        }
        
        @keyframes dot-pulse {
          0%, 100% {
            box-shadow: 0 0 8px rgba(100, 178, 188, 0.3);
          }
          50% {
            box-shadow: 0 0 12px rgba(100, 178, 188, 0.5);
          }
        }
      `}</style>
    </main>
  );
};

export default TimelineView;
