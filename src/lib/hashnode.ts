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

// Define a type for node from GraphQL
interface HashnodeGraphQLNode {
  _id?: string;
  title: string;
  brief: string;
  slug: string;
  publishedAt: string;
  totalReactions?: number;
  responseCount: number;
  coverImage: { url: string } | null;
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
      query PublicationPosts($host: String!, $first: Int!) {
        publication(host: $host) {
          title
          displayTitle
          url
          posts(first: $first) {
            edges {
              node {
                title
                brief
                slug
                publishedAt
                responseCount
                coverImage {
                  url
                }
              }
            }
          }
        }
      }
    `;
    
    const variables = {
      host: `${username}.hashnode.dev`,
      first: limit,
    };
    
    
    const timestamp = Date.now();
    const response = await fetch(`https://gql.hashnode.com/graphql?t=${timestamp}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
      body: JSON.stringify({ query, variables }),
    });
    
    if (!response.ok) {
      throw new Error(`Hashnode API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    

   
    if (!data.data.publication.posts) {
      console.error('❌ No posts object found in publication');
      return [];
    }
    
    if (!data.data.publication.posts.edges) {
      console.error('❌ No edges found in posts');
      return [];
    }
    
    console.log('📊 Total posts found:', data.data.publication.posts.edges.length);
    console.log('===============================');
    
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      throw new Error(`GraphQL error: ${data.errors[0]?.message || 'Unknown GraphQL error'}`);
    }
    
    if (!data.data?.publication?.posts?.edges) {
      console.warn('No posts found in response');
      return [];
    }
    
    const edges = data.data.publication.posts.edges;
    
    // Transform the data and ensure uniqueness by slug
    const posts = edges.map(({ node }: { node: HashnodeGraphQLNode }) => ({
      _id: node.slug, // Use slug as unique ID
      title: node.title || '',
      brief: node.brief || '',
      slug: node.slug || '',
      dateAdded: node.publishedAt || '',
      totalReactions: 0, // Not available in this query
      responseCount: node.responseCount || 0,
      coverImage: node.coverImage,
      directUrl: `https://${username}.hashnode.dev/${node.slug}`,
    }));
    
    // Remove duplicates based on slug
    const uniquePosts = posts.filter((post: HashnodePost, index: number, self: HashnodePost[]) => 
      index === self.findIndex((p: HashnodePost) => p.slug === post.slug)
    );
    
    console.log(`Fetched ${uniquePosts.length} unique posts from Hashnode`);
    
    if (uniquePosts.length === 0) {
      console.log('🔄 No posts found with publication query, trying alternative approach...');
      return await tryAlternativeQuery(username, limit);
    }
    
    return uniquePosts;
    
  } catch (error) {
    console.error('❌ Error fetching Hashnode posts:', error);
    console.log('🔄 Trying alternative query approach...');
    try {
      return await tryAlternativeQuery(username, limit);
    } catch (fallbackError) {
      console.error('❌ Alternative query also failed:', fallbackError);
      throw error;
    }
  }
};

// Alternative query method using user-based approach
const tryAlternativeQuery = async (username: string, limit: number): Promise<HashnodePost[]> => {
  try {
    console.log('🔄 Trying user-based query...');
    
    const query = `
      query GetUserPosts($username: String!, $page: Int!) {
        user(username: $username) {
          publication {
            posts(page: $page) {
              title
              brief
              slug
              dateAdded
              totalReactions
              responseCount
              coverImage
            }
          }
        }
      }
    `;
    
    const variables = {
      username: username,
      page: 0,
    };
    
    const timestamp = Date.now();
    const response = await fetch(`https://api.hashnode.com?t=${timestamp}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
      body: JSON.stringify({ query, variables }),
    });
    
    if (!response.ok) {
      throw new Error(`Alternative API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('🔄 Alternative API response:', JSON.stringify(data, null, 2));
    
    if (data.errors) {
      throw new Error(`Alternative GraphQL error: ${data.errors[0]?.message || 'Unknown error'}`);
    }
    
    const posts = data.data?.user?.publication?.posts || [];
    
    return posts.map((post: any) => ({
      _id: post.slug,
      title: post.title || '',
      brief: post.brief || '',
      slug: post.slug || '',
      dateAdded: post.dateAdded || '',
      totalReactions: post.totalReactions || 0,
      responseCount: post.responseCount || 0,
      coverImage: post.coverImage,
      directUrl: `https://${username}.hashnode.dev/${post.slug}`,
    }));
    
  } catch (error) {
    console.error('❌ Alternative query failed:', error);
    return [];
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