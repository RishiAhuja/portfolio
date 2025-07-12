'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ExpandedContainer from '@/components/ui/ExpandedContainer';
import FadeInSection from '@/components/ui/FadeInSection';
import GalleryGrid from '@/components/gallery/GalleryGrid';
import ImageModal from '@/components/gallery/ImageModal';
import { galleryImages, GalleryImage } from '@/data/gallery';

const GalleryPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
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

  // Sort images by date (most recent first)
  const sortedImages = [...galleryImages].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleImageClick = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleNextImage = () => {
    const nextIndex = (selectedIndex + 1) % sortedImages.length;
    setSelectedImage(sortedImages[nextIndex]);
    setSelectedIndex(nextIndex);
  };

  const handlePrevImage = () => {
    const prevIndex = selectedIndex === 0 ? sortedImages.length - 1 : selectedIndex - 1;
    setSelectedImage(sortedImages[prevIndex]);
    setSelectedIndex(prevIndex);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      
      if (e.key === 'Escape') {
        handleCloseModal();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isModalOpen, selectedIndex, sortedImages]);

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
            <ExpandedContainer text="Gallery" />
          </div>

          <p className="text-gunSmoke max-w-2xl leading-relaxed">
            A curated collection of moments, projects, and experiences captured through my lens. 
            Each image tells a story from my journey as a developer and creator.
          </p>
        </div>
      </div>

      {/* Gallery Content */}
      <div className={`${isMobile ? 'px-4' : 'max-w-6xl mx-auto px-8'} py-12`}>
        <FadeInSection>
          {/* Gallery Grid */}
          <GalleryGrid
            images={sortedImages}
            onImageClick={handleImageClick}
            useBentoLayout={false}
          />

          {/* Stats */}
          <div className="mt-12 text-center text-gunSmoke font-ptMono text-sm">
            {sortedImages.length} images • Chronological order
          </div>
        </FadeInSection>
      </div>

      {/* Image Modal */}
      <ImageModal
        image={selectedImage}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
      />
    </main>
  );
};

export default GalleryPage;
