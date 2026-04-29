import React from 'react';
import { Calendar, Mail, Twitter, FileText, Linkedin, Github, Hash, Globe, BookOpen } from 'lucide-react';

type IconName = 'Schedule a Call' | 'Email' | 'Twitter' | 'Resume' | 'LinkedIn' | 'GitHub' | 'Technical Blog' | 'Portfolio' | 'Research';

const iconMap: Record<IconName, any> = {
  'Schedule a Call': Calendar,
  'Email': Mail,
  'Twitter': Twitter,
  'Resume': FileText,
  'LinkedIn': Linkedin,
  'GitHub': Github,
  'Technical Blog': Hash,
  'Portfolio': Globe,
  'Research': BookOpen
};

interface LinkCardProps {
  title: IconName;
  description: string;
  url: string;
  primary?: boolean;
}

export const LinkCard: React.FC<LinkCardProps> = ({ title, description, url, primary }) => {
  const Icon = iconMap[title];
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block bg-bgShades-light border ${primary ? 'border-accent-light/50' : 'border-darkGrey/30'} rounded-sm p-4 hover:border-accent-light/60 transition-all duration-300 hover:-translate-y-0.5`}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <Icon className="w-6 h-6 text-accent-light" />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-sm md:text-base font-bold ${primary ? 'text-accent-light' : 'text-quillGray'} font-ptMono group-hover:text-accent-light transition-colors mb-1`}>
            {title}
          </div>
          <div className="text-xs md:text-sm text-gunSmoke font-ptMono truncate">
            {description}
          </div>
        </div>
        <svg 
          className="w-5 h-5 text-gunSmoke group-hover:text-accent-light group-hover:translate-x-1 transition-all flex-shrink-0" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
    </a>
  );
};
