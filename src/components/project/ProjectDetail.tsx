import React, { useEffect, useState } from 'react';
import { marked } from 'marked';

import type { Project } from '../../lib/projects';
import SmallContainer from '../ui/SmallContainer.tsx';
import ViewCounter from '../ui/ViewCounter';

interface ProjectDetailProps {
  project: Project;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
  const [renderedMarkdown, setRenderedMarkdown] = useState('');

  useEffect(() => {
    if (project.full_description) {
      const parseMarkdown = async () => {
        const html = await marked.parse(project.full_description || '');
        setRenderedMarkdown(html);
      };
      parseMarkdown();
    }
  }, [project.full_description]);

  return (
    <article className="animate-fade-in">
      {/* Navigation */}
      <div className="mb-8">
        <a 
          href="/"
          className="flex items-center text-gunSmoke hover:text-accent-light transition-colors"
        >
          <svg 
            className="w-4 h-4 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-ptMono">Back to home</span>
        </a>
      </div>
      
      {/* Project header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-ptMono text-quillGray mb-4">
          {project.title}
        </h1>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech_stack.map((tech, index) => (
            <SmallContainer key={index} text={tech} />
          ))}
        </div>
        
        <p className="text-lg text-gray-400 font-ptMono leading-relaxed">
          {project.description}
        </p>
      </header>
      
      {/* Project links */}
      <div className="flex space-x-4 mb-8">
        {project.github_url && (
          <a 
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-accent-light rounded-sm bg-accent/10 text-accent-light font-ptMono hover:bg-accent/20 transition-colors"
          >
            View on GitHub
          </a>
        )}
        
        {project.live_url && (
          <a 
            href={project.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-darkGrey rounded-sm text-quillGray font-ptMono hover:border-accent-light hover:text-accent-light transition-colors"
          >
            Visit Live Site
          </a>
        )}
      </div>
      
      {/* Full description */}
      {project.full_description && (
        <div className="mb-8">
          <h2 className="text-xl font-bold font-ptMono text-quillGray mb-4">
            About the Project
          </h2>
          
          <div 
            className="prose prose-invert prose-accent max-w-none font-ptMono text-quillGray
              prose-headings:font-ptMono prose-headings:text-quillGray
              prose-p:text-quillGray prose-p:leading-relaxed
              prose-a:text-accent-light prose-a:no-underline hover:prose-a:underline
              prose-code:text-accent-light prose-code:bg-darkGrey/40 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-darkGrey/40 prose-pre:border prose-pre:border-darkGrey
              prose-ul:text-quillGray prose-ol:text-quillGray
              prose-li:text-quillGray prose-li:marker:text-accent-light
              prose-strong:text-quillGray prose-strong:font-bold
              prose-blockquote:text-gunSmoke prose-blockquote:border-l-accent-light"
            dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
          />
        </div>
      )}
      
      {/* Features */}
      <div className="mb-8">
        <h2 className="text-xl font-bold font-ptMono text-quillGray mb-4">
          Key Features
        </h2>
        
        <ul className="space-y-3">
          {project.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-light/70 mr-2.5"></div>
              <span className="font-ptMono text-quillGray text-base">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
      
      <ViewCounter projectId={project.id} viewCount={project.view_count} />
    </article>
  );
};

export default ProjectDetail;