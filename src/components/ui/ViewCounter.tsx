// components/ui/ViewCounter.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { incrementProjectView } from '@/lib/projects';

interface ViewCounterProps {
  projectId: string;
  viewCount?: number;
}

const ViewCounter: React.FC<ViewCounterProps> = ({ projectId, viewCount = 0 }) => {
  const [count, setCount] = useState(viewCount);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set initial count from props
    setCount(viewCount);
    
    async function updateViewCount() {
      try {
        // Check if this project has been viewed in this session
        const viewedProjects = JSON.parse(
          sessionStorage.getItem('viewed_projects') || '[]'
        );
        
        if (viewedProjects.includes(projectId)) {
          setIsLoading(false);
          return; // Already viewed
        }
        
        // Add to viewed projects
        viewedProjects.push(projectId);
        sessionStorage.setItem('viewed_projects', JSON.stringify(viewedProjects));
        
        
        // Use the API route to increment and get the updated count
        const response = await fetch('/api/project-view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId }),
          cache: 'no-store' // Ensure no caching
        });
        
        const result = await response.json();
        
        if (response.ok && result.view_count) {
          setCount(result.view_count);
        } else {
          console.error('Failed to update view count:', result);
        }
      } catch (err) {
        console.error('Failed to update view count:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    updateViewCount();
  }, [projectId, viewCount]);

  return (
    <div className="text-sm text-gray-500 font-ptMono mt-8">
      <span>
        {isLoading ? `${viewCount}` : `${count}`} view{count !== 1 ? 's' : ''}
      </span>
    </div>
  );
};

export default ViewCounter;