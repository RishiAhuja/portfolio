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
  isStub?: boolean;
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

const HASHNODE_ENDPOINT = 'https://gql.hashnode.com';
const HASHNODE_HOST = 'rishi2220.hashnode.dev';
const HASHNODE_API_ACCESS_NOTICE_URL = 'https://hashnode.com/changelog/2026-05-13-graphql-api-paid-access';
const STUB_POST_NOTICE = 'This local copy keeps the post discoverable on rishia.in while the full article remains on Hashnode.';

const getHashnodePersonalAccessToken = (): string | undefined => {
  const token = import.meta.env.HASHNODE_PERSONAL_ACCESS_TOKEN;
  return typeof token === 'string' && token.trim().length > 0 ? token.trim() : undefined;
};

const buildHashnodeHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const token = getHashnodePersonalAccessToken();
  if (token) {
    // Hashnode expects the raw PAT in Authorization, not a Bearer prefix.
    headers.Authorization = token;
  }

  return headers;
};

const hasHashnodeApiAccess = (): boolean => Boolean(getHashnodePersonalAccessToken());

const fallbackHashnodePosts: HashnodePost[] = [
  {
    _id: 'fallback-towards-the-modern-transformer-architecture',
    title: 'Towards the Modern Transformer Architecture',
    brief: 'Tracing how the 2017 Transformer evolved into the recipes used by modern frontier models — norms, activations, attention variants, RoPE, KV cache, and more.',
    slug: 'towards-the-modern-transformer-architecture',
    dateAdded: '2026-07-01T00:00:00.000Z',
    totalReactions: 0,
    responseCount: 0,
    coverImage: null,
    directUrl: `https://${HASHNODE_HOST}/towards-the-modern-transformer-architecture`,
  },
  {
    _id: 'fallback-you-dont-know-websockets-yet',
    title: "You Don't Know WebSockets. Yet.",
    brief: 'Deep dive technical blog exploring WebSocket protocol, real-time communication patterns, and bidirectional data flow in modern web applications.',
    slug: 'you-dont-know-websockets-yet',
    dateAdded: '2025-08-25T00:00:00.000Z',
    totalReactions: 0,
    responseCount: 0,
    coverImage: null,
    directUrl: `https://${HASHNODE_HOST}/you-dont-know-websockets-yet`,
  },
  {
    _id: 'fallback-go-beneath-the-abstraction-building-interactive-uis-with-fernkit',
    title: 'Go Beneath the Abstraction: Building Interactive UIs with FernKit',
    brief: 'Technical deep dive into FernKit UI toolkit, exploring low-level rendering, widget systems, and building UIs from scratch with C++.',
    slug: 'go-beneath-the-abstraction-building-interactive-uis-with-fernkit',
    dateAdded: '2025-08-03T00:00:00.000Z',
    totalReactions: 0,
    responseCount: 0,
    coverImage: null,
    directUrl: `https://${HASHNODE_HOST}/fernkit`,
  },
  {
    _id: 'fallback-shamirs-secret-sharing-scheme-and-multi-party-computation',
    title: "Shamir's Secret Sharing Scheme and Multi Party Computation.",
    brief: "Mathematical Blog exploring Shamir's Secret Sharing Scheme and Multi Party Computation for private key management.",
    slug: 'shamirs-secret-sharing-scheme-and-multi-party-computation',
    dateAdded: '2025-07-05T00:00:00.000Z',
    totalReactions: 0,
    responseCount: 0,
    coverImage: null,
    directUrl: `https://${HASHNODE_HOST}/shamirs-secret-sharing-scheme-and-multi-party-computation`,
  },
  {
    _id: 'fallback-your-hardest-hello-world-text-rasterization-1',
    title: 'Your Hardest "Hello World!": Text Rasterization #1',
    brief: 'Deep technical blog exploring TTF file format and text rendering fundamentals.',
    slug: 'your-hardest-hello-world-text-rasterization-1',
    dateAdded: '2025-06-14T00:00:00.000Z',
    totalReactions: 0,
    responseCount: 0,
    coverImage: null,
    directUrl: `https://${HASHNODE_HOST}/your-hardest-hello-world-text-rasterization-1`,
  },
  {
    _id: 'fallback-bits-of-trust-the-elegance-of-aes',
    title: 'Bits of Trust: The Elegance of AES',
    brief: 'Technical blog exploring AES encryption algorithms and cryptographic implementations.',
    slug: 'bits-of-trust-the-elegance-of-aes',
    dateAdded: '2025-04-01T00:00:00.000Z',
    totalReactions: 0,
    responseCount: 0,
    coverImage: null,
    directUrl: `https://${HASHNODE_HOST}/bits-of-trust-the-elegance-of-aes`,
  },
  {
    _id: 'fallback-building-rosenblatts-perceptron-from-scratch-a-comprehensive-technical-deep-dive',
    title: "Building Rosenblatt's Perceptron From Scratch in Flutter",
    brief: 'Technical blog implementing classic machine learning perceptron algorithm in Flutter with visual explanations.',
    slug: 'building-rosenblatts-perceptron-from-scratch-a-comprehensive-technical-deep-dive',
    dateAdded: '2025-02-27T00:00:00.000Z',
    totalReactions: 0,
    responseCount: 0,
    coverImage: null,
    directUrl: `https://${HASHNODE_HOST}/building-rosenblatts-perceptron-from-scratch-a-comprehensive-technical-deep-dive`,
  },
  {
    _id: 'fallback-getting-cracked-at-clean-and-bloc-architecture',
    title: 'Getting Cracked at Clean and BLoC Architecture',
    brief: 'Advanced Flutter architecture blog covering clean architecture principles and BLoC pattern implementation.',
    slug: 'getting-cracked-at-clean-and-bloc-architecture',
    dateAdded: '2025-01-05T00:00:00.000Z',
    totalReactions: 0,
    responseCount: 0,
    coverImage: null,
    directUrl: `https://${HASHNODE_HOST}/getting-cracked-at-clean-and-bloc-architecture`,
  },
  {
    _id: 'fallback-getting-started-at-bloc-architecture',
    title: 'Getting Started at BLoC Architecture',
    brief: 'Beginner-friendly Flutter architecture blog introducing BLoC pattern with practical examples.',
    slug: 'getting-started-at-bloc-architecture',
    dateAdded: '2024-12-13T00:00:00.000Z',
    totalReactions: 0,
    responseCount: 0,
    coverImage: null,
    directUrl: `https://${HASHNODE_HOST}/getting-started-at-bloc-architecture`,
  },
  {
    _id: 'fallback-resource-management-with-probabilistic-scheduling-in-the-context-of-linux',
    title: 'Resource Management with Probabilistic Scheduling in Linux',
    brief: 'Deep technical blog exploring Linux kernel scheduling mechanisms and resource management algorithms.',
    slug: 'resource-management-with-probabilistic-scheduling-in-the-context-of-linux',
    dateAdded: '2024-11-01T00:00:00.000Z',
    totalReactions: 0,
    responseCount: 0,
    coverImage: null,
    directUrl: `https://${HASHNODE_HOST}/resource-management-with-probabilistic-scheduling-in-the-context-of-linux`,
  },
  {
    _id: 'fallback-art',
    title: 'State of the Art - ART (Android Runtime)',
    brief: 'Technical blog analyzing Android Runtime (ART) and its impact on app performance and development.',
    slug: 'art',
    dateAdded: '2024-09-03T00:00:00.000Z',
    totalReactions: 0,
    responseCount: 0,
    coverImage: null,
    directUrl: `https://${HASHNODE_HOST}/art`,
  },
  {
    _id: 'fallback-comprehensive-arch-linux-guide',
    title: 'Comprehensive Arch Linux Blog',
    brief: 'In-depth technical guide covering Arch Linux installation, configuration, and advanced system administration.',
    slug: 'comprehensive-arch-linux-guide',
    dateAdded: '2024-08-16T00:00:00.000Z',
    totalReactions: 0,
    responseCount: 0,
    coverImage: null,
    directUrl: `https://${HASHNODE_HOST}/comprehensive-arch-linux-guide`,
  },
];

let hashnodeUnavailable = false;

const getFallbackHashnodePosts = (limit: number = fallbackHashnodePosts.length): HashnodePost[] => {
  return fallbackHashnodePosts.slice(0, limit);
};

const getFallbackPostDetail = (slug: string): HashnodePostDetail | null => {
  const post = fallbackHashnodePosts.find((item) => item.slug === slug);
  if (!post) return null;

  return {
    ...post,
    isStub: true,
    content: {
      markdown: [
        post.brief,
        '',
        STUB_POST_NOTICE,
        '',
        `[Open the full article on Hashnode](${post.directUrl}).`,
      ].join('\n'),
    },
    readTimeInMinutes: 1,
    tags: [],
    author: {
      name: 'Rishi Ahuja',
      username: 'rishi2220',
    },
  };
};

export const isHashnodeStubPost = (post: Pick<HashnodePostDetail, 'isStub' | 'content'>): boolean => {
  if (post.isStub) return true;

  const markdown = typeof post.content === 'string' ? post.content : post.content.markdown;
  return markdown.includes(STUB_POST_NOTICE);
};

interface HashnodePostListNode {
  id: string;
  title: string;
  brief: string;
  slug: string;
  publishedAt: string;
  url: string;
}

const parseHashnodeJsonResponse = async (response: Response) => {
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get('location') || HASHNODE_API_ACCESS_NOTICE_URL;
    const upgradeHint = hasHashnodeApiAccess()
      ? ''
      : ' Set HASHNODE_PERSONAL_ACCESS_TOKEN from hashnode.com/settings/developer after upgrading to Hashnode Pro.';
    throw new Error(`Hashnode GraphQL access redirected to ${location}.${upgradeHint}`);
  }

  if (!response.ok) {
    throw new Error(`Hashnode API error: ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(`Hashnode API returned ${contentType || 'non-JSON'} instead of JSON`);
  }

  return response.json();
};

const getErrorMessage = (error: unknown) => error instanceof Error ? error.message : String(error);

// Define a type with the minimum fields needed for URL creation
export interface PostUrlData {
  directUrl?: string;
  url?: string;
  slug?: string;
}

export const fetchHashnodePosts = async (username: string, limit: number = 10): Promise<HashnodePost[]> => {
  try {
    if (hashnodeUnavailable && !hasHashnodeApiAccess()) {
      return getFallbackHashnodePosts(limit);
    }
    
    const query = `
      query Publication($host: String!, $limit: Int!) {
        publication(host: $host) {
          posts(first: $limit) {
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
      limit,
    };
    
    const response = await fetch(HASHNODE_ENDPOINT, {
      method: 'POST',
      redirect: 'manual',
      headers: buildHashnodeHeaders(),
      body: JSON.stringify({ 
        query,
        variables,
      }),
    });

    const data = await parseHashnodeJsonResponse(response);
    
    if (data.errors) {
      console.error('❌ GraphQL errors:', data.errors);
      throw new Error(`GraphQL error: ${data.errors[0]?.message || 'Unknown GraphQL error'}`);
    }
    
    if (!data.data?.publication) {
      console.error('❌ No publication found for host:', `${username}.hashnode.dev`);
      return getFallbackHashnodePosts(limit);
    }
    
    if (!data.data.publication.posts?.edges || data.data.publication.posts.edges.length === 0) {
      console.warn('⚠️ No posts found in publication');
      return getFallbackHashnodePosts(limit);
    }
    
    const edges = data.data.publication.posts.edges;
    
    // Transform the data with proper URL construction
    const posts = edges.map(({ node }: { node: HashnodePostListNode }) => {
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

    hashnodeUnavailable = false;
    return posts;
    
  } catch (error) {
    if (!hasHashnodeApiAccess()) {
      hashnodeUnavailable = true;
    }
    console.warn(`Hashnode posts unavailable, using local post index: ${getErrorMessage(error)}`);
    return getFallbackHashnodePosts(limit);
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
    
    if (Number.isNaN(date.getTime())) {
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
    if (hashnodeUnavailable && !hasHashnodeApiAccess()) {
      return getFallbackPostDetail(slug);
    }

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
    
    const response = await fetch(HASHNODE_ENDPOINT, {
      method: 'POST',
      redirect: 'manual',
      headers: buildHashnodeHeaders(),
      body: JSON.stringify({ query, variables }),
    });

    const data = await parseHashnodeJsonResponse(response);
    
    if (data.errors) {
      throw new Error(`GraphQL error: ${data.errors[0]?.message}`);
    }
    
    const post = data.data?.publication?.post;
    
    if (!post) {
      return getFallbackPostDetail(slug);
    }

    hashnodeUnavailable = false;
    
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
      isStub: false,
    };
    
  } catch (error) {
    if (!hasHashnodeApiAccess()) {
      hashnodeUnavailable = true;
    }
    console.warn(`Hashnode post "${slug}" unavailable, using local preview if present: ${getErrorMessage(error)}`);
    return getFallbackPostDetail(slug);
  }
};
