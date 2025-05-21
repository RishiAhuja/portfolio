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
    
    const response = await fetch('https://gql.hashnode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });
    
    if (!response.ok) {
      throw new Error(`Hashnode API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return [];
    }
    
    const edges = data?.data?.publication?.posts?.edges || [];
    
    return edges.map(({ node }: { node: HashnodeGraphQLNode }) => ({
      _id: node._id || '',
      title: node.title || '',
      brief: node.brief || '',
      slug: node.slug || '',
      dateAdded: node.publishedAt || '',
      totalReactions: node.totalReactions || 0,
      responseCount: node.responseCount || 0,
      coverImage: node.coverImage,
      directUrl: `https://${username}.hashnode.dev/${node.slug}`,
    }));
  } catch (error) {
    console.error('Error fetching Hashnode posts:', error);
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