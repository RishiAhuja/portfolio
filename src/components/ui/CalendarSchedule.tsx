
import React from 'react';

interface CalendarScheduleProps {
  calcomUsername: string;
  eventType?: string;
  className?: string;
  buttonText?: string;
}

const CalendarSchedule: React.FC<CalendarScheduleProps> = ({ 
  calcomUsername, 
  eventType = '30min',
  className = '',
  buttonText = 'Schedule a Meeting'
}) => {
  const handleScheduleClick = () => {
    const calcomUrl = eventType 
      ? `https://cal.com/${calcomUsername}/${eventType}`
      : `https://cal.com/${calcomUsername}`;
    
    window.open(calcomUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleScheduleClick}
      className={`group inline-flex items-center justify-center gap-2.5 px-6 py-3 
        bg-accent-light/10 border-2 border-accent-light/40 
        text-accent-light hover:bg-accent-light hover:text-codGray 
        transition-all duration-300 rounded-sm font-ptMono text-base font-medium
        hover:scale-[1.02] hover:border-accent-light shadow-sm hover:shadow-accent-light/20 ${className}`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span>{buttonText}</span>
      <svg className="w-4 h-4 opacity-80 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </button>
  );
};

export default CalendarSchedule;
