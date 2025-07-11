'use client';

import React from 'react';
import { BucketListItem } from '@/data/bucket-list';

interface BucketListCardProps {
  item: BucketListItem;
  onClick: (item: BucketListItem) => void;
}

const BucketListCard: React.FC<BucketListCardProps> = ({ item, onClick }) => {
  const statusColors = {
    'not-started': 'border-gunSmoke/50 text-gunSmoke',
    'in-progress': 'border-accent text-accent',
    'completed': 'border-green-500 text-green-500',
    'paused': 'border-yellow-500 text-yellow-500'
  };

  const priorityColors = {
    'high': 'bg-red-500/20 text-red-400 border-red-500/30',
    'medium': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'low': 'bg-green-500/20 text-green-400 border-green-500/30'
  };

  const categoryIcons = {
    'tech': 'TECH',
    'travel': 'TRAVEL',
    'learning': 'LEARN',
    'creative': 'CREATE',
    'personal': 'PERSONAL',
    'fitness': 'FITNESS'
  };

  const completedMilestones = item.milestones?.filter(m => m.completed).length || 0;
  const totalMilestones = item.milestones?.length || 0;
  const progressPercentage = item.progress || (totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0);

  return (
    <div
      onClick={() => onClick(item)}
      className="group border border-darkGrey/30 rounded-sm p-6 hover:border-accent/50 transition-all duration-300 cursor-pointer"
      style={{ backgroundColor: '#191919' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-ptMono text-gunSmoke bg-darkGrey/30 px-2 py-1 rounded-sm">
            {categoryIcons[item.category]}
          </span>
          <div>
            <h3 className="font-ptMono text-lg font-semibold text-quillGray group-hover:text-accent transition-colors">
              {item.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 rounded-sm text-xs font-ptMono border ${statusColors[item.status]}`}>
                {item.status.replace('-', ' ')}
              </span>
              <span className={`px-2 py-1 rounded-sm text-xs font-ptMono border ${priorityColors[item.priority]}`}>
                {item.priority} priority
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gunSmoke leading-relaxed mb-4 line-clamp-3 font-ptMono text-sm">
        {item.description}
      </p>

      {/* Progress Bar */}
      {item.status !== 'not-started' && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-ptMono text-gunSmoke">Progress</span>
            <span className="text-xs font-ptMono text-accent">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-darkGrey/50 rounded-full h-2">
            <div
              className="bg-accent h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Milestones */}
      {totalMilestones > 0 && (
        <div className="mb-4">
          <span className="text-xs font-ptMono text-gunSmoke">
            Milestones: {completedMilestones}/{totalMilestones} completed
          </span>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {item.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-darkGrey/30 text-gunSmoke text-xs rounded-sm font-ptMono"
          >
            {tag}
          </span>
        ))}
        {item.tags.length > 3 && (
          <span className="text-xs text-gunSmoke font-ptMono">
            +{item.tags.length - 3} more
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-gunSmoke font-ptMono">
        <span>Added {new Date(item.dateAdded).toLocaleDateString()}</span>
        {item.targetDate && (
          <span>Target: {new Date(item.targetDate).toLocaleDateString()}</span>
        )}
      </div>
    </div>
  );
};

export default BucketListCard;
