// components/project/RelatedProjects.tsx

import React from 'react';
import ProjectCardCompact from '../ui/ProjectCardCompact';
import ExpandedContainer from '../ui/ExpandedContainer';
import type { Project } from '../../lib/projects';

interface RelatedProjectsProps {
  projects: Project[];
}

const RelatedProjects: React.FC<RelatedProjectsProps> = ({ projects }) => {
  return (
    <div>
      <h2 className="text-xl font-bold font-ptMono text-quillGray mb-6">
        Related Projects
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <a 
            key={project.id} 
            href={`/projects/${project.slug}`}
            className="block border border-darkGrey rounded-sm p-4 hover:border-accent-light hover:bg-accent/5 transition-all group"
          >
            <h3 className="font-ptMono text-lg font-bold text-quillGray mb-2 group-hover:text-accent-light transition-colors">
              {project.title}
            </h3>
            
            <p className="font-ptMono text-sm text-gunSmoke mb-4 line-clamp-3">
              {project.description}
            </p>
            
            <div className="flex flex-wrap gap-1.5">
              {project.tech_stack.slice(0, 3).map((tech, index) => (
                <span 
                  key={index}
                  className="text-xs bg-darkGrey/50 text-gray-400 px-1.5 py-0.5 rounded-sm font-ptMono"
                >
                  {tech}
                </span>
              ))}
              {project.tech_stack.length > 3 && (
                <span className="text-xs text-gray-400 font-ptMono">
                  +{project.tech_stack.length - 3} more
                </span>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default RelatedProjects;