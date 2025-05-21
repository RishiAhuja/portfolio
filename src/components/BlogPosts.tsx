'use client';
import React, { useState, useEffect } from 'react';
import ExpandedContainer from '@/components/ui/ExpandedContainer';
import BlogPostItem from '@/components/ui/BlogPostItem';
import { fetchHashnodePosts, formatPostDate, getPostUrl } from '@/lib/hashnode';

// Define a type for our component's state
interface Post {
  _id?: string;
  title?: string;
  brief?: string;
  dateAdded?: string;
  directUrl?: string;
  totalReactions?: number;
  responseCount?: number;
  slug?: string;
}

const BlogPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const USERNAME = "rishi2220";
  
  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching Hashnode posts...');
        
        const data = await fetchHashnodePosts(USERNAME, 10);
        console.log('Hashnode posts loaded:', data);
        
        const validPosts = Array.isArray(data) ? data : [];
        setPosts(validPosts);
        
        if (validPosts.length === 0) {
          setError('No blog posts found. Check username or network connection.');
        }
      } catch (err) {
        console.error('Error fetching Hashnode posts:', err);
        setError(`Failed to load blog posts: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBlogPosts();
  }, []);
  
  // Safe function to create a blog post snippet
  const createSafeSnippet = (text: string | undefined | null): string => {
    if (typeof text !== 'string') return 'No description available';
    
    try {
      return text.length > 60 ? text.slice(0, 60) + '...' : text;
    } catch (e) {
      return `No description available ${e instanceof Error ? e.message : ''}`;
    }
  };
  
  return (
    <div className="flex flex-col">
      <ExpandedContainer text="Blog Posts" />
      <div className="h-4" />
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-darkGrey/30 h-16 rounded-sm animate-pulse"></div>
          ))}
        </div>
      ) : error ? (
        <div className="text-base font-ptMono text-gunSmoke">
          {error}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-base font-ptMono text-gunSmoke">
          No blog posts found. Check back soon!
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post, index) => {
            if (!post) return null;
            
            const title = typeof post.title === 'string' ? post.title : 'Untitled Post';
            const link = getPostUrl(post);
            const date = typeof post.dateAdded === 'string' ? formatPostDate(post.dateAdded) : 'Date unavailable';
            const readTime = createSafeSnippet(post.brief);
            
            return (
              <BlogPostItem
                key={typeof post._id === 'string' ? post._id : `post-${index}`}
                title={title}
                link={link}
                date={date}
                readTime={readTime}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BlogPosts;