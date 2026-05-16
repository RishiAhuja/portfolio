'use client';

import React, { useEffect, useMemo, useState } from 'react';

interface CarouselImage {
  src: string;
  alt: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  caption?: string;
  priority?: boolean;
}

const SWIPE_THRESHOLD = 40;

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, caption, priority = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const currentImage = images[currentIndex];
  const imageCount = images.length;

  const adjacentSources = useMemo(() => {
    if (imageCount < 2) return [];
    const previousIndex = currentIndex === 0 ? imageCount - 1 : currentIndex - 1;
    const nextIndex = currentIndex === imageCount - 1 ? 0 : currentIndex + 1;
    return [images[previousIndex].src, images[nextIndex].src];
  }, [currentIndex, imageCount, images]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    adjacentSources.forEach((src) => {
      const preload = new window.Image();
      preload.decoding = 'async';
      preload.src = src;
    });
  }, [adjacentSources]);

  if (!images || imageCount === 0) return null;

  const goToIndex = (index: number) => {
    setCurrentIndex((index + imageCount) % imageCount);
  };

  const goToPrevious = () => goToIndex(currentIndex - 1);
  const goToNext = () => goToIndex(currentIndex + 1);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goToPrevious();
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToNext();
    }
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;

    const deltaX = event.changedTouches[0].clientX - touchStartX;
    setTouchStartX(null);

    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
    if (deltaX > 0) {
      goToPrevious();
    } else {
      goToNext();
    }
  };

  return (
    <figure
      className="mb-10 outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={imageCount > 1 ? `Image carousel with ${imageCount} images` : 'Image'}
    >
      <div
        className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-sm border border-darkGrey bg-darkGrey/10"
        onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)}
        onTouchEnd={handleTouchEnd}
      >
        <img
          key={currentImage.src}
          src={currentImage.src}
          alt={currentImage.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          className="blurb-media-image h-full max-h-full w-full max-w-full object-contain"
        />

        {imageCount > 1 && (
          <>
            <button
              onClick={goToPrevious}
              type="button"
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-darkGrey/60 bg-codGray/85 text-quillGray shadow-sm transition-colors hover:border-accent-light hover:text-accent-light focus:outline-none focus:ring-2 focus:ring-accent-light/60"
              aria-label="Previous image"
            >
              <svg className="h-4 w-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={goToNext}
              type="button"
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-darkGrey/60 bg-codGray/85 text-quillGray shadow-sm transition-colors hover:border-accent-light hover:text-accent-light focus:outline-none focus:ring-2 focus:ring-accent-light/60"
              aria-label="Next image"
            >
              <svg className="h-4 w-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="absolute right-3 top-3 rounded-sm border border-darkGrey/60 bg-codGray/85 px-2 py-1 font-ptMono text-xs text-quillGray">
              {currentIndex + 1} / {imageCount}
            </div>
          </>
        )}
      </div>

      {imageCount > 1 && (
        <div className="mt-3 flex flex-wrap justify-center gap-2" aria-label="Carousel slides">
          {images.map((image, index) => (
            <button
              key={image.src}
              onClick={() => goToIndex(index)}
              type="button"
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                index === currentIndex
                  ? 'bg-accent-light'
                  : 'bg-darkGrey hover:bg-gunSmoke'
              }`}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === currentIndex}
            />
          ))}
        </div>
      )}

      {(caption || currentImage.alt) && (
        <figcaption className="mt-2 text-center font-ptMono text-sm italic text-gunSmoke">
          {caption || currentImage.alt}
        </figcaption>
      )}
    </figure>
  );
};

export default ImageCarousel;
