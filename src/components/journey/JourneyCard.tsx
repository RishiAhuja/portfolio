'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { JourneyPost } from '@/data/journey';

interface JourneyCardProps {
  post: JourneyPost;
}

const JourneyCard: React.FC<JourneyCardProps> = ({ post }) => {
  return (
    <Link href={`/journey/${post.slug}`}>
      <article className="group border border-darkGrey/30 rounded-sm overflow-hidden hover:border-accent/50 transition-all duration-300" style={{ backgroundColor: '#191919' }}>
        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Title and subtitle */}
          <div className="mb-4">
            <h3 className="font-ptMono text-lg font-semibold text-quillGray group-hover:text-accent transition-colors mb-2 line-clamp-2">
              {post.title}
            </h3>
            {post.subtitle && (
              <p className="text-sm text-gunSmoke font-ptMono line-clamp-1">
                {post.subtitle}
              </p>
            )}
          </div>

          {/* Description */}
          <p className="text-gunSmoke text-sm leading-relaxed mb-4 line-clamp-3 font-ptMono">
            {post.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-sm border border-accent/20 font-ptMono"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-gunSmoke font-ptMono">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gunSmoke font-ptMono">
            <span>{new Date(post.publishedDate).toLocaleDateString()}</span>
            <span>{post.readTime} min read</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default JourneyCard;
