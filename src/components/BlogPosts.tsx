import React, { useState } from 'react';
import ExpandedContainer from './ui/ExpandedContainer';
import BlogPostItem from './ui/BlogPostItem';

export interface BlogPostPreview {
  slug: string;
  title: string;
  dateLabel: string;
  href: string;
}

interface BlogPostsProps {
  posts: BlogPostPreview[];
}

const BlogPosts: React.FC<BlogPostsProps> = ({ posts }) => {
  const [visibleCount, setVisibleCount] = useState(5);

  return (
    <div className="flex flex-col">
      <ExpandedContainer text="Things I've written" />
      <div className="h-4" />
      {posts.length === 0 ? (
        <div className="text-base font-ptMono text-gunSmoke">
          No blog posts found. Check back soon!
        </div>
      ) : (
        <>
          <div className="space-y-2 md:space-y-4">
            {posts.slice(0, visibleCount).map((post) => (
              <BlogPostItem
                key={post.slug}
                title={post.title}
                link={post.href}
                date={post.dateLabel}
                external={false}
              />
            ))}
          </div>

          {visibleCount < posts.length && (
            <button
              onClick={() => setVisibleCount((prev) => Math.min(posts.length, prev + 5))}
              className="mt-4 font-ptMono text-sm text-accent-light hover:text-accent transition-colors duration-200 mx-auto block"
            >
              Show {Math.min(posts.length - visibleCount, 5)} more →
            </button>
          )}

          {visibleCount >= posts.length && posts.length > 5 && (
            <button
              onClick={() => setVisibleCount(5)}
              className="mt-4 font-ptMono text-sm text-gunSmoke hover:text-accent-light transition-colors duration-200 mx-auto block"
            >
              Show less
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default BlogPosts;
