'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GalleryImage } from '@/data/gallery';

interface ImageModalProps {
  image: GalleryImage | null;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, isOpen, onClose, onNext, onPrev }) => {
  if (!isOpen || !image) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-accent transition-colors z-50"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Navigation arrows */}
      <button
        onClick={onPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-accent transition-colors z-50"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-accent transition-colors z-50"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Image container */}
      <div className="max-w-7xl max-h-[90vh] relative">
        <div className="relative w-full h-full">
          <Image
            src={image.imageUrl}
            alt={image.title}
            width={1200}
            height={800}
            className="object-contain max-h-[80vh] w-auto"
            priority
          />
        </div>

        {/* Image info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
          <h3 className="text-xl font-ptMono font-semibold mb-2">{image.title}</h3>
          {image.description && (
            <p className="text-sm text-gray-300 mb-3 font-ptMono">{image.description}</p>
          )}
          
          <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-ptMono">
            {image.location && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {image.location}
              </span>
            )}
            {image.camera && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                {image.camera}
              </span>
            )}
            <span>{new Date(image.date).toLocaleDateString()}</span>
          </div>

          {/* Tags */}
          {image.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {image.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-sm border border-accent/30 font-ptMono"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
