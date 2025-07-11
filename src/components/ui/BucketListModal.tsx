'use client';

import React from 'react';
import { BucketListItem } from '@/data/bucket-list';

interface BucketListModalProps {
  item: BucketListItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const BucketListModal: React.FC<BucketListModalProps> = ({ item, isOpen, onClose }) => {
  if (!isOpen || !item) return null;

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
    'tech': '💻',
    'travel': '🌍',
    'learning': '📚',
    'creative': '🎨',
    'personal': '🎯',
    'fitness': '💪'
  };

  const completedMilestones = item.milestones?.filter(m => m.completed).length || 0;
  const totalMilestones = item.milestones?.length || 0;
  const progressPercentage = item.progress || (totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0);

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-bgShades-light border border-darkGrey/30 rounded-sm max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-darkGrey/30">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{categoryIcons[item.category]}</span>
            <div>
              <h2 className="font-playfair text-2xl font-semibold text-quillGray">
                {item.title}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-sm text-sm font-ptMono border ${statusColors[item.status]}`}>
                  {item.status.replace('-', ' ')}
                </span>
                <span className={`px-3 py-1 rounded-sm text-sm font-ptMono border ${priorityColors[item.priority]}`}>
                  {item.priority} priority
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gunSmoke hover:text-accent transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-quillGray mb-2">Description</h3>
            <p className="text-gunSmoke leading-relaxed">{item.description}</p>
          </div>

          {/* Progress */}
          {item.status !== 'not-started' && (
            <div className="mb-6">
              <h3 className="font-semibold text-quillGray mb-2">Progress</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-ptMono text-gunSmoke">Overall Progress</span>
                <span className="text-sm font-ptMono text-accent">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-darkGrey/50 rounded-full h-3">
                <div
                  className="bg-accent h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Milestones */}
          {item.milestones && item.milestones.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-quillGray mb-3">Milestones</h3>
              <div className="space-y-3">
                {item.milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      milestone.completed 
                        ? 'bg-accent border-accent' 
                        : 'border-gunSmoke/50'
                    }`}>
                      {milestone.completed && (
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className={`text-sm ${milestone.completed ? 'text-quillGray' : 'text-gunSmoke'}`}>
                        {milestone.title}
                      </span>
                      {milestone.date && (
                        <span className="text-xs text-gunSmoke ml-2">
                          {new Date(milestone.date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {item.resources && item.resources.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-quillGray mb-3">Resources</h3>
              <div className="space-y-2">
                {item.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-darkGrey/20 rounded-sm hover:bg-darkGrey/30 transition-colors"
                  >
                    <span className="text-sm">
                      {resource.type === 'link' && '🔗'}
                      {resource.type === 'book' && '📚'}
                      {resource.type === 'course' && '🎓'}
                      {resource.type === 'video' && '🎥'}
                    </span>
                    <span className="text-sm text-quillGray hover:text-accent transition-colors">
                      {resource.title}
                    </span>
                    <svg className="w-4 h-4 text-gunSmoke ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {item.notes && (
            <div className="mb-6">
              <h3 className="font-semibold text-quillGray mb-2">Notes</h3>
              <p className="text-gunSmoke text-sm leading-relaxed bg-darkGrey/20 p-3 rounded-sm">
                {item.notes}
              </p>
            </div>
          )}

          {/* Tags */}
          <div className="mb-6">
            <h3 className="font-semibold text-quillGray mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-sm border border-accent/20 font-ptMono"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="border-t border-darkGrey/30 pt-4">
            <div className="flex justify-between items-center text-sm text-gunSmoke font-ptMono">
              <div>
                <span className="block">Added: {new Date(item.dateAdded).toLocaleDateString()}</span>
                {item.dateCompleted && (
                  <span className="block text-green-400">
                    Completed: {new Date(item.dateCompleted).toLocaleDateString()}
                  </span>
                )}
              </div>
              {item.targetDate && (
                <div className="text-right">
                  <span className="block">Target Date:</span>
                  <span className="text-accent">{new Date(item.targetDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BucketListModal;
