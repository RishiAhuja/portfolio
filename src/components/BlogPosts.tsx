import React, { useState, useEffect } from 'react';
import ExpandedContainer from './ui/ExpandedContainer';
import BlogPostItem from './ui/BlogPostItem';
import { fetchHashnodePosts, formatPostDate } from '../lib/hashnode';

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
  
  const loadBlogPosts = async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await fetchHashnodePosts(USERNAME, 50); // Fetch all posts
      
      if (data && data.length > 0) {
        setPosts(data);
      } else {
        setError('No blog posts found. Please check back later.');
      }
    } catch (err) {
      console.error('❌ Error loading blog posts:', err);
      setError(`Failed to load blog posts: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadBlogPosts();
  }, []);
  
  return (
    <div className="flex flex-col">
      <ExpandedContainer text="Blog Posts" />
      <div className="h-4" />
      {isLoading ? (
        <div className="space-y-2 md:space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-darkGrey/30 h-16 md:h-20 rounded-sm animate-pulse"></div>
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
        <div className="space-y-2 md:space-y-4">
          {posts.map((post, index) => {
            if (!post) return null;
            
            const title = typeof post.title === 'string' ? post.title : 'Untitled Post';
            const link = post.slug ? `/blogs/${post.slug}` : '#';
            const date = typeof post.dateAdded === 'string' ? formatPostDate(post.dateAdded) : 'Date unavailable';
            
            // Use slug as key for uniqueness, fallback to index
            const uniqueKey = post.slug || post._id || `post-${index}`;
            
            return (
              <BlogPostItem
                key={uniqueKey}
                title={title}
                link={link}
                date={date}
                readTime={undefined} // Remove brief/readTime
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BlogPosts;