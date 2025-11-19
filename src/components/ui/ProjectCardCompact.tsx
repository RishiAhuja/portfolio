'use client';

import React, { useState } from 'react';
import type { Project } from '../../lib/projects';

interface ProjectCardCompactProps {
  project: Project;
}

const ProjectCardCompact: React.FC<ProjectCardCompactProps> = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Truncate description for preview
  const truncateDescription = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Check if project has a valid slug
  const hasValidSlug = !!project.slug;

  const handleCardClick = () => {
    if (hasValidSlug) {
      window.location.href = `/projects/${project.slug}`;
    }
  };

  const handleGithubClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
  };

  return (
    <div
      className={`
        relative border rounded-sm transition-all duration-300 h-full overflow-hidden
        ${isHovered ? 'border-accent-light shadow-[0_8px_30px_-12px_rgba(100,178,188,0.3)] transform -translate-y-1 bg-bgShades-light/30' : 'border-darkGrey bg-transparent'}
        flex flex-col ${hasValidSlug ? 'cursor-pointer' : 'opacity-75 hover:opacity-100'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Accent corner */}
      <div className={`absolute top-0 right-0 w-0 h-0 transition-all duration-300
        border-t-[20px] border-r-[20px] 
        ${isHovered ? 'border-t-accent border-r-accent' : 'border-t-transparent border-r-transparent'}`}>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        {/* Header */}
        <h3 className={`text-xl font-bold font-ptMono transition-colors duration-200
          ${isHovered ? 'text-accent-light' : 'text-quillGray'}`}
        >
          {project.title}
        </h3>

        <div className="h-2" />

        {/* Brief description */}
        <p className="text-sm text-gray-400 font-ptMono leading-relaxed mb-4">
          {truncateDescription(project.description, 120)}
        </p>

        {/* Tech pills */}
        <div className="flex flex-wrap gap-2 mt-auto mb-6">
          {project.tech_stack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="text-[10px] font-ptMono px-2 py-1 rounded border border-darkGrey/30 bg-darkGrey/10 text-gunSmoke group-hover:border-accent-light/30 group-hover:text-accent-light/80 transition-colors duration-300"
            >
              {tech}
            </span>
          ))}
          {project.tech_stack.length > 3 && (
            <span className="text-[10px] font-ptMono px-2 py-1 rounded border border-darkGrey/30 bg-darkGrey/10 text-gunSmoke">
              +{project.tech_stack.length - 3}
            </span>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-between items-center mt-auto">
          {/* Project status indicator */}
          <div
            className={`
              flex items-center font-ptMono text-sm 
              ${isHovered ? 'text-accent-light' : 'text-quillGray'}
              transition-colors duration-200
            `}
          >
            <span>{hasValidSlug ? 'View Details' : 'Coming Soon'}</span>
            {hasValidSlug && (
              <svg
                className={`w-4 h-4 ml-1 transition-all duration-200 
                  ${isHovered ? 'transform translate-x-1' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </div>

          {/* GitHub link (if available) */}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gunSmoke hover:text-accent-light transition-colors z-10"
              aria-label="View on GitHub"
              onClick={handleGithubClick}
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCardCompact;