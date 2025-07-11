'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { journeyPosts } from '@/data/journey';
import JourneyContentRenderer from '@/components/journey/JourneyContentRenderer';

interface JourneyPageProps {
  params: {
    slug: string;
  };
}

const JourneyPage: React.FC<JourneyPageProps> = ({ params }) => {
  const post = journeyPosts.find(p => p.slug === params.slug);

  if (!post) {
    notFound();
  }

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
    <main className="min-h-screen text-quillGray" style={{ backgroundColor: '#191919' }}>
      {/* Header */}
      <div className="border-b border-darkGrey/30">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link 
            href="/timeline"
            className="inline-flex items-center gap-2 text-gunSmoke hover:text-accent transition-colors mb-6 font-ptMono text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Timeline
          </Link>

          {/* Title and Meta */}
          <h1 className="text-3xl md:text-4xl font-ptMono font-bold text-quillGray mb-4">
            {post.title}
          </h1>
          
          {post.subtitle && (
            <p className="text-lg text-gunSmoke font-ptMono mb-6">
              {post.subtitle}
            </p>
          )}

          <div className="flex items-center gap-6 text-sm text-gunSmoke font-ptMono">
            <span>{new Date(post.publishedDate).toLocaleDateString()}</span>
            <span>{post.readTime}</span>
            <span>{post.category}</span>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="border-b border-darkGrey/30">
          <div className="max-w-4xl mx-auto">
            <div className="relative w-full h-64 md:h-96">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-lg max-w-none">
          <JourneyContentRenderer content={post.content} />
        </div>

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-darkGrey/30">
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
        </div>

        {/* Related Posts */}
        <div className="mt-12 pt-8 border-t border-darkGrey/30">
          <h3 className="text-xl font-ptMono font-semibold text-quillGray mb-6">
            Other Journey Posts
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {journeyPosts
              .filter(p => p.slug !== post.slug)
              .slice(0, 2)
              .map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/journey/${relatedPost.slug}`}
                  className="group block p-6 border border-darkGrey/30 rounded-sm hover:border-accent/50 transition-all duration-300"
                  style={{ backgroundColor: '#1a1a1a' }}
                >
                  <h4 className="font-ptMono font-semibold text-quillGray group-hover:text-accent transition-colors mb-2">
                    {relatedPost.title}
                  </h4>
                  <p className="text-sm text-gunSmoke font-ptMono line-clamp-2">
                    {relatedPost.description}
                  </p>
                  <div className="mt-3 text-xs text-gunSmoke font-ptMono">
                    {new Date(relatedPost.publishedDate).toLocaleDateString()}
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default JourneyPage;
