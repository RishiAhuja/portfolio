
import React from 'react';
import type { GalleryCategory } from '../../data/gallery';
import { galleryCategories } from '../../data/gallery';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  imageCounts: Record<string, number>;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategory, 
  onCategoryChange, 
  imageCounts 
}) => {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {/* All categories button */}
      <button
        onClick={() => onCategoryChange(null)}
        className={`px-4 py-2 rounded-sm border font-ptMono text-sm transition-all duration-300 ${
          selectedCategory === null
            ? 'border-accent bg-accent/10 text-accent'
            : 'border-darkGrey/50 text-gunSmoke hover:border-accent/50 hover:text-accent'
        }`}
      >
        All ({Object.values(imageCounts).reduce((sum, count) => sum + count, 0)})
      </button>

      {/* Category buttons */}
      {galleryCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 rounded-sm border font-ptMono text-sm transition-all duration-300 ${
            selectedCategory === category.id
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-darkGrey/50 text-gunSmoke hover:border-accent/50 hover:text-accent'
          }`}
        >
          <span>{category.name}</span>
          <span className="ml-2 text-xs opacity-70">({imageCounts[category.id] || 0})</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
