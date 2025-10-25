
import React from 'react';

import { GalleryImage } from '@/data/gallery';

interface GalleryGridProps {
  images: GalleryImage[];
  onImageClick: (image: GalleryImage, index: number) => void;
  useBentoLayout?: boolean;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ images, onImageClick, useBentoLayout = false }) => {
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gunSmoke">
        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="font-ptMono text-sm">No images found</p>
      </div>
    );
  }

  // Improved bento layout with better spacing and patterns
  const getBentoClass = (index: number) => {
    // Create a more balanced pattern that fills space better
    const patterns = [
      'md:col-span-2 md:row-span-2', // Large
      'md:col-span-1 md:row-span-1', // Regular
      'md:col-span-1 md:row-span-1', // Regular
      'md:col-span-1 md:row-span-2', // Tall
      'md:col-span-2 md:row-span-1', // Wide
      'md:col-span-1 md:row-span-1', // Regular
      'md:col-span-1 md:row-span-1', // Regular
      'md:col-span-1 md:row-span-1', // Regular
    ];
    return patterns[index % patterns.length];
  };

  const gridClass = useBentoLayout 
    ? "grid grid-cols-1 md:grid-cols-3 gap-3 auto-rows-[180px] md:auto-rows-[200px]"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4";

  return (
    <div className={gridClass}>
      {images.map((image, index) => (
        <div
          key={image.id}
          className={`group relative overflow-hidden rounded-sm bg-darkGrey/10 cursor-pointer border border-darkGrey/20 hover:border-accent/30 transition-all duration-300 ${
            useBentoLayout ? `${getBentoClass(index)} aspect-auto` : 'aspect-square hover:scale-[1.02] hover:shadow-lg'
          }`}
          onClick={() => onImageClick(image, index)}
        >
          <Image
            src={image.imageUrl}
            alt={image.title}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-ptMono font-semibold text-sm mb-1 line-clamp-1">
                {image.title}
              </h3>
              {image.description && (
                <p className="text-gray-300 text-xs line-clamp-2 mb-2 font-ptMono">
                  {image.description}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-400 font-ptMono">
                <span>{new Date(image.date).toLocaleDateString()}</span>
                {image.location && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {image.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;
