'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { JourneyPost } from '@/data/journey';
import JourneyContentRenderer from './JourneyContentRenderer';

interface JourneyModalProps {
  post: JourneyPost | null;
  isOpen: boolean;
  onClose: () => void;
}

const JourneyModal: React.FC<JourneyModalProps> = ({ post, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !post) return null;

  const categoryIcons = {
    'project': 'PROJECT',
    'learning': 'LEARN',
    'experience': 'WORK',
    'achievement': 'ACHIEVE',
    'reflection': 'REFLECT'
  };

  const categoryColors = {
    'project': 'border-accent/50 text-accent bg-accent/5',
    'learning': 'border-gunSmoke/50 text-gunSmoke bg-gunSmoke/5',
    'experience': 'border-gunSmoke/50 text-gunSmoke bg-gunSmoke/5',
    'achievement': 'border-accent/50 text-accent bg-accent/5',
    'reflection': 'border-gunSmoke/50 text-gunSmoke bg-gunSmoke/5'
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      {/* Modal Container */}
      <div className="w-full h-full flex flex-col overflow-hidden" style={{ backgroundColor: '#191919' }}>
        {/* Header */}
        <div className="flex-shrink-0 border-b border-darkGrey/30" style={{ backgroundColor: '#1a1a1a' }}>
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
              </div>
              
              <button
                onClick={onClose}
                className="text-gunSmoke hover:text-accent transition-colors p-2"
                aria-label="Close journey post"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Cover Image */}
            {post.coverImage && (
              <div className="relative w-full h-64 md:h-80 rounded-sm overflow-hidden mb-8">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 80vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            )}

            {/* Article Header */}
            <header className="mb-8">
              <h1 className="font-ptMono text-3xl md:text-4xl font-bold text-quillGray mb-4">
                {post.title}
              </h1>
              
              {post.subtitle && (
                <p className="text-xl text-gunSmoke font-ptMono mb-6">
                  {post.subtitle}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-gunSmoke font-ptMono mb-6">
                <span>{new Date(post.publishedDate).toLocaleDateString()}</span>
                <span>•</span>
                <span>{post.readTime} min read</span>
                <span>•</span>
                <span className="capitalize">{post.status}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-darkGrey/30 text-gunSmoke text-sm rounded-sm font-ptMono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            {/* Content */}
            <div className="mb-12">
              <JourneyContentRenderer content={post.content} />
            </div>

            {/* Footer */}
            <footer className="border-t border-darkGrey/30 pt-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <p className="text-gunSmoke font-ptMono text-sm mb-2">
                    Published on {new Date(post.publishedDate).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gunSmoke font-ptMono">
                    <span>Journey Post {post.id}</span>
                    {post.projectId && (
                      <>
                        <span>•</span>
                        <span>Linked to Project: {post.projectId}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-darkGrey/50 text-gunSmoke hover:border-accent hover:text-accent transition-colors font-ptMono text-sm rounded-sm"
                >
                  Close Article
                </button>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneyModal;
