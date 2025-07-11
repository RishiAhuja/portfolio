'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import ExpandedContainer from '@/components/ui/ExpandedContainer';
import FadeInSection from '@/components/ui/FadeInSection';
import BucketListCard from '@/components/ui/BucketListCard';
import BucketListModal from '@/components/ui/BucketListModal';
import { bucketListItems, bucketListCategories, BucketListItem } from '@/data/bucket-list';

const BucketListPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<BucketListItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 800);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Filter items based on selected filters
  const filteredItems = useMemo(() => {
    let filtered = bucketListItems;
    
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (selectedStatus) {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }
    
    // Sort by status (in-progress first, then by priority, then by date)
    return filtered.sort((a, b) => {
      // Status priority: in-progress > not-started > paused > completed
      const statusOrder = { 'in-progress': 0, 'not-started': 1, 'paused': 2, 'completed': 3 };
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;
      
      // Priority order: high > medium > low
      const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Date order: newest first
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    });
  }, [selectedCategory, selectedStatus]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = bucketListItems.length;
    const completed = bucketListItems.filter(item => item.status === 'completed').length;
    const inProgress = bucketListItems.filter(item => item.status === 'in-progress').length;
    const notStarted = bucketListItems.filter(item => item.status === 'not-started').length;
    
    return { total, completed, inProgress, notStarted, completionRate: Math.round((completed / total) * 100) };
  }, []);

  const handleItemClick = (item: BucketListItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <main className="min-h-screen text-quillGray" style={{ backgroundColor: '#191919' }}>
      {/* Header */}
      <div className="border-b border-darkGrey/30">
        <div className={`${isMobile ? 'px-4' : 'max-w-6xl mx-auto px-8'} py-8`}>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-gunSmoke hover:text-accent transition-colors mb-6 font-ptMono text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Portfolio
          </Link>

          <div className="mb-6">
            <ExpandedContainer text="Bucket List" />
          </div>

          <p className="text-gunSmoke max-w-3xl font-inter leading-relaxed mb-8">
            A collection of goals, dreams, and aspirations I'm working towards. From technical challenges 
            to personal adventures, these are the experiences that shape my journey.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-bgShades-light border border-darkGrey/30 rounded-sm p-4 text-center">
              <div className="text-2xl font-bold text-accent">{stats.total}</div>
              <div className="text-sm text-gunSmoke font-ptMono">Total Goals</div>
            </div>
            <div className="bg-bgShades-light border border-darkGrey/30 rounded-sm p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
              <div className="text-sm text-gunSmoke font-ptMono">Completed</div>
            </div>
            <div className="bg-bgShades-light border border-darkGrey/30 rounded-sm p-4 text-center">
              <div className="text-2xl font-bold text-accent">{stats.inProgress}</div>
              <div className="text-sm text-gunSmoke font-ptMono">In Progress</div>
            </div>
            <div className="bg-bgShades-light border border-darkGrey/30 rounded-sm p-4 text-center">
              <div className="text-2xl font-bold text-accent">{stats.completionRate}%</div>
              <div className="text-sm text-gunSmoke font-ptMono">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`${isMobile ? 'px-4' : 'max-w-6xl mx-auto px-8'} py-8 border-b border-darkGrey/30`}>
        <FadeInSection>
          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-ptMono text-gunSmoke mb-3">Filter by Category</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-sm border font-ptMono text-sm transition-all duration-300 ${
                  selectedCategory === null
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-darkGrey/50 text-gunSmoke hover:border-accent/50 hover:text-accent'
                }`}
              >
                All Categories ({bucketListItems.length})
              </button>
              {bucketListCategories.map((category) => {
                const count = bucketListItems.filter(item => item.category === category.id).length;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-sm border font-ptMono text-sm transition-all duration-300 flex items-center gap-2 ${
                      selectedCategory === category.id
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-darkGrey/50 text-gunSmoke hover:border-accent/50 hover:text-accent'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                    <span className="text-xs opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <h3 className="text-sm font-ptMono text-gunSmoke mb-3">Filter by Status</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedStatus(null)}
                className={`px-4 py-2 rounded-sm border font-ptMono text-sm transition-all duration-300 ${
                  selectedStatus === null
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-darkGrey/50 text-gunSmoke hover:border-accent/50 hover:text-accent'
                }`}
              >
                All Status
              </button>
              {[
                { id: 'in-progress', label: 'In Progress', color: 'accent' },
                { id: 'not-started', label: 'Not Started', color: 'gunSmoke' },
                { id: 'completed', label: 'Completed', color: 'green-400' },
                { id: 'paused', label: 'Paused', color: 'yellow-400' }
              ].map((status) => {
                const count = bucketListItems.filter(item => item.status === status.id).length;
                return (
                  <button
                    key={status.id}
                    onClick={() => setSelectedStatus(status.id)}
                    className={`px-4 py-2 rounded-sm border font-ptMono text-sm transition-all duration-300 ${
                      selectedStatus === status.id
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-darkGrey/50 text-gunSmoke hover:border-accent/50 hover:text-accent'
                    }`}
                  >
                    {status.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </FadeInSection>
      </div>

      {/* Bucket List Items */}
      <div className={`${isMobile ? 'px-4' : 'max-w-6xl mx-auto px-8'} py-12`}>
        <FadeInSection>
          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-playfair text-gunSmoke mb-2">No goals found</h3>
              <p className="text-gunSmoke font-ptMono text-sm">
                Try adjusting your filters or check back later for new goals.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {filteredItems.map((item) => (
                  <BucketListCard
                    key={item.id}
                    item={item}
                    onClick={handleItemClick}
                  />
                ))}
              </div>

              {/* Results info */}
              <div className="text-center text-gunSmoke font-ptMono text-sm">
                Showing {filteredItems.length} of {bucketListItems.length} goals
                {(selectedCategory || selectedStatus) && (
                  <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs">
                    {selectedCategory && (
                      <span className="text-accent">
                        Category: {bucketListCategories.find(c => c.id === selectedCategory)?.name}
                      </span>
                    )}
                    {selectedStatus && (
                      <span className="text-accent">
                        Status: {selectedStatus.replace('-', ' ')}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </FadeInSection>
      </div>

      {/* Modal */}
      <BucketListModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </main>
  );
};

export default BucketListPage;
