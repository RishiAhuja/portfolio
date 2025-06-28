// components/Projects.tsx
'use client';

import React, { useState, useEffect } from 'react';
import ExpandedContainer from '@/components/ui/ExpandedContainer';
import { getAllProjects, Project, debugListAllProjects } from '@/lib/projects';
import ProjectCardCompact from './ui/ProjectCardCompact';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        
        // Debug: List all projects in the database
        await debugListAllProjects();
        
        const data = await getAllProjects();
        
        // Filter out projects without slugs to avoid navigation errors
        const validProjects = data.filter(project => !!project.slug);
        console.log(`Projects loaded: ${data.length}, valid projects with slugs: ${validProjects.length}`);
        
        setProjects(validProjects);
      } catch (err) {
        console.error('Error loading projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProjects();
  }, []);

  return (
    <div className="flex flex-col">
      <ExpandedContainer text="Projects" />
      <div className="h-4" />
      
      {/* Loading state */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-48 bg-darkGrey/30 rounded-sm animate-pulse"></div>
          ))}
        </div>
      ) : error ? (
        <div className="py-8 text-center">
          <p className="text-lg font-ptMono text-gray-400">
            {error}
          </p>
        </div>
      ) : (
        <>
          {/* Grid of compact project cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {projects.map((project) => (
              <ProjectCardCompact
                key={project.id}
                project={project}
              />
            ))}
          </div>
          
          {/* Empty state */}
          {projects.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-lg font-ptMono text-gray-400">
                No projects found. Check back soon!
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Projects;