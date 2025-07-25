'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface CarouselImage {
  src: string;
  alt: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  caption?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, caption }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return null;
  }

  // If only one image, render without carousel controls
  if (images.length === 1) {
    return (
      <div className="mb-8">
        <div 
          className="relative w-full rounded-sm overflow-hidden bg-darkGrey/10 flex items-center justify-center"
          style={{ 
            height: '400px', // Fixed height for consistency
            aspectRatio: '16/10'
          }}
        >
          <Image
            src={images[0].src}
            alt={images[0].alt}
            width={800}
            height={600}
            className="max-w-full max-h-full object-contain" // Preserves natural aspect ratio
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
        </div>
        {(images[0].alt || caption) && (
          <p className="text-sm text-gunSmoke font-ptMono mt-2 text-center italic">
            {images[0].alt || caption}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div 
        className="relative w-full rounded-sm overflow-hidden bg-darkGrey/10 flex items-center justify-center"
        style={{ 
          height: '400px', // Fixed height for consistency
          aspectRatio: '16/10'
        }}
      >
        {/* Main Image */}
        <Image
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          width={800}
          height={600}
          className="max-w-full max-h-full object-contain" // Preserves natural aspect ratio
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
        />

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-darkGrey/80 hover:bg-darkGrey text-quillGray rounded-full p-2 transition-colors"
          aria-label="Previous image"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-darkGrey/80 hover:bg-darkGrey text-quillGray rounded-full p-2 transition-colors"
          aria-label="Next image"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Image Counter */}
        <div className="absolute top-2 right-2 bg-darkGrey/80 text-quillGray px-2 py-1 rounded text-xs font-ptMono">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-3 space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex 
                ? 'bg-accent' 
                : 'bg-darkGrey/50 hover:bg-darkGrey/80'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Caption or Current Image Alt Text */}
      {(caption || images[currentIndex].alt) && (
        <p className="text-sm text-gunSmoke font-ptMono mt-2 text-center italic">
          {caption || images[currentIndex].alt}
        </p>
      )}

      {/* Thumbnail Preview (for larger carousels) */}
      {images.length > 3 && (
        <div className="flex justify-center mt-4 space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-colors ${
                index === currentIndex 
                  ? 'border-accent' 
                  : 'border-darkGrey/30 hover:border-darkGrey/60'
              }`}
            >
              <Image
                src={image.src}
                alt={`Thumbnail ${index + 1}`}
                width={64}
                height={48}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
