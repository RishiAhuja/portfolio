export interface HashnodePost {
  _id: string;
  title: string;
  brief: string;
  slug: string;
  dateAdded: string;
  totalReactions: number;
  responseCount: number;
  coverImage: { url: string } | null;
  directUrl: string;
}

export interface HashnodePostDetail extends HashnodePost {
  content: {
    markdown: string;
  };
  readTimeInMinutes: number;
  tags: Array<{ name: string; slug: string }>;
  author: {
    name: string;
    username: string;
    profilePicture?: string;
  };
}

// Define a type for node from GraphQL v2 API
interface HashnodeGraphQLNode {
  id: string;
  title: string;
  brief: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
  readTimeInMinutes: number;
  reactionCount: number;
  responseCount: number;
  views: number;
  url: string;
  coverImage: { url: string } | null;
  author: {
    name: string;
    username: string;
  };
}

// Define a type with the minimum fields needed for URL creation
export interface PostUrlData {
  directUrl?: string;
  url?: string;
  slug?: string;
}

export const fetchHashnodePosts = async (username: string, limit: number = 10): Promise<HashnodePost[]> => {
  try {
    
    const query = `
      query Publication($host: String!) {
        publication(host: $host) {
          posts(first: 20) {
            edges {
              node {
                id
                title
                brief
                slug
                publishedAt
                url
              }
            }
          }
        }
      }
    `;
    
    const variables = {
      host: `${username}.hashnode.dev`,
    };
    
    const response = await fetch('https://gql.hashnode.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query,
        variables,
      }),
    });

    if (!response.ok) {
      console.error(`❌ Hashnode API error: ${response.status} ${response.statusText}`);
      throw new Error(`Hashnode API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.errors) {
      console.error('❌ GraphQL errors:', data.errors);
      throw new Error(`GraphQL error: ${data.errors[0]?.message || 'Unknown GraphQL error'}`);
    }
    
    if (!data.data?.publication) {
      console.error('❌ No publication found for host:', `${username}.hashnode.dev`);
      return [];
    }
    
    if (!data.data.publication.posts?.edges || data.data.publication.posts.edges.length === 0) {
      console.warn('⚠️ No posts found in publication');
      return [];
    }
    
    const edges = data.data.publication.posts.edges;
    
    // Transform the data with proper URL construction
    const posts = edges.map(({ node }: { node: any }) => {
      const post = {
        _id: node.id,
        title: node.title,
        brief: node.brief || '',
        slug: node.slug,
        dateAdded: node.publishedAt,
        totalReactions: 0,
        responseCount: 0,
        coverImage: null,
        directUrl: node.url,
      };
      
      return post;
    });
    
    // Sort posts by date (newest first)
    posts.sort((a: HashnodePost, b: HashnodePost) => {
      const dateA = new Date(a.dateAdded).getTime();
      const dateB = new Date(b.dateAdded).getTime();
      return dateB - dateA;
    });

    
    return posts;
    
  } catch (error) {
    throw error;
  }
};

/**
 * Format post date to a readable format
 */
export const formatPostDate = (dateString: string): string => {
  if (typeof dateString !== 'string') {
    return 'Date unavailable';
  }
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Date unavailable';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    return `${e instanceof Error ? e.message : 'Unknown error'}`;
  }
};

/**
 * Get the full URL for a Hashnode post
 */
/**
 * Get the full URL for a Hashnode post
 * The type is inferred from usage - we only need properties that could be used for URL creation
 */
export const getPostUrl = (post: PostUrlData | null | undefined): string => {
  if (!post) {
    return '#';
  }
  
  if (typeof post.directUrl === 'string') {
    return post.directUrl;
  }
  
  if (typeof post.url === 'string') {
    return post.url;
  }
  
  if (typeof post.slug === 'string') {
    return `https://hashnode.com/${post.slug}`;
  }
  
  return '#';
};

/**
 * Fetch a single blog post with full content
 */
export const fetchHashnodePostBySlug = async (username: string, slug: string): Promise<HashnodePostDetail | null> => {
  try {
    const query = `
      query PostBySlug($host: String!, $slug: String!) {
        publication(host: $host) {
          post(slug: $slug) {
            id
            title
            brief
            slug
            publishedAt
            updatedAt
            readTimeInMinutes
            reactionCount
            responseCount
            views
            url
            content {
              markdown
            }
            coverImage {
              url
            }
            author {
              name
              username
              profilePicture
            }
            tags {
              name
              slug
            }
          }
        }
      }
    `;
    
    const variables = {
      host: `${username}.hashnode.dev`,
      slug: slug,
    };
    
    const response = await fetch('https://gql.hashnode.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Hashnode API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL error: ${data.errors[0]?.message}`);
    }
    
    const post = data.data?.publication?.post;
    
    if (!post) {
      return null;
    }
    
    return {
      _id: post.id,
      title: post.title,
      brief: post.brief,
      slug: post.slug,
      dateAdded: post.publishedAt,
      totalReactions: post.reactionCount || 0,
      responseCount: 0,
      coverImage: post.coverImage,
      directUrl: post.url,
      content: post.content,
      readTimeInMinutes: post.readTimeInMinutes,
      tags: post.tags || [],
      author: post.author,
    };
    
  } catch (error) {
    console.error('Error fetching Hashnode post:', error);
    throw error;
  }
};