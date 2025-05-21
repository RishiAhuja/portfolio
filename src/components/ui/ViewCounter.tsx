// components/ui/ViewCounter.tsx
'use client';

import React, { useEffect } from 'react';
import { incrementProjectView } from '@/lib/projects';

interface ViewCounterProps {
  projectId: string;
  viewCount?: number;
}

const ViewCounter: React.FC<ViewCounterProps> = ({ projectId, viewCount = 0 }) => {
  useEffect(() => {
    // Increment the view count when the component mounts
    // This is important - this needs to run once on initial load
    const incrementView = async () => {
      await incrementProjectView(projectId);
    };
    
    incrementView();
  }, [projectId]); // Only run once when projectId changes

  return (
    <div className="text-sm text-gray-500 font-ptMono mt-8">
      <span>{viewCount} view{viewCount !== 1 ? 's' : ''}</span>
    </div>
  );
};

export default ViewCounter;