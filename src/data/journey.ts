// Journey/Timeline blog data structure
export interface JourneyContent {
  type: 'paragraph' | 'heading' | 'image' | 'code' | 'quote' | 'list' | 'twitter';
  content?: string;
  level?: number; // for headings (h1, h2, etc.)
  alt?: string; // for images
  language?: string; // for code blocks
  items?: string[]; // for lists
  tweetId?: string; // for twitter embeds
}

export interface JourneyPost {
  id: string;
  projectId?: string; // Link to existing project
  eventId?: string; // Link to timeline event
  title: string;
  subtitle?: string;
  description: string;
  slug: string;
  publishedDate: string;
  readTime: number; // in minutes
  coverImage?: string;
  tags: string[];
  category: 'project' | 'learning' | 'experience' | 'achievement' | 'reflection';
  status: 'draft' | 'published';
  content: JourneyContent[];
  relatedPosts?: string[]; // Array of related post IDs
}

export interface JourneyCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const journeyCategories: JourneyCategory[] = [
  {
    id: 'project',
    name: 'Project Journey',
    description: 'Stories behind the projects and their development',
    icon: '',
    color: 'accent'
  },
  {
    id: 'learning',
    name: 'Learning Path',
    description: 'Educational experiences and skill development',
    icon: '',
    color: 'accent-light'
  },
  {
    id: 'experience',
    name: 'Experience',
    description: 'Work experiences and professional growth',
    icon: '',
    color: 'accent-dark'
  },
  {
    id: 'achievement',
    name: 'Achievement',
    description: 'Milestones and accomplishments',
    icon: '',
    color: 'accent'
  },
  {
    id: 'reflection',
    name: 'Reflection',
    description: 'Thoughts, insights, and personal reflections',
    icon: '',
    color: 'accent-light'
  }
];

// Sample journey posts
export const journeyPosts: JourneyPost[] = [
  {
    id: 'fern',
    projectId: 'fern', // Assuming you have a project with this ID
    eventId: 'timeline-30 May 2025',
    title: 'Building Fern: From Idea to Reality',
    subtitle: 'The complete journey of developing a modern web application',
    description: 'A detailed look into the development process of Fern, challenges faced, solutions implemented, and lessons learned along the way.',
    slug: 'fern-development-journey',
    publishedDate: '2024-03-15',
    readTime: 12,
    coverImage: '/journey/fern-cover.jpg',
    tags: ['React', 'Next.js', 'Development', 'Web App', 'Project'],
    category: 'project',
    status: 'published',
    content: [
      {
        type: 'heading',
        content: 'The Beginning',
        level: 2
      },
      {
        type: 'paragraph',
        content: 'It all started with a simple problem I encountered during my daily workflow. I needed a better way to organize and manage my development resources, and existing solutions didn\'t quite fit my needs.'
      },
      {
        type: 'image',
        content: '/journey/fern-initial-sketch.jpg',
        alt: 'Initial sketches and wireframes for Fern'
      },
      {
        type: 'heading',
        content: 'Technical Decisions',
        level: 2
      },
      {
        type: 'paragraph',
        content: 'Choosing the right tech stack was crucial. After evaluating several options, I decided to go with:'
      },
      {
        type: 'list',
        items: [
          'Next.js 14 for the framework',
          'TypeScript for type safety',
          'Tailwind CSS for styling',
          'Supabase for backend services',
          'Vercel for deployment'
        ]
      },
      {
        type: 'heading',
        content: 'Challenges Faced',
        level: 2
      },
      {
        type: 'paragraph',
        content: 'The development wasn\'t without its challenges. The biggest hurdle was implementing real-time synchronization across multiple devices while maintaining performance.'
      },
      {
        type: 'code',
        content: `// Real-time sync implementation
const handleRealtimeUpdates = useCallback((payload) => {
  if (payload.eventType === 'INSERT') {
    setData(prev => [...prev, payload.new]);
  } else if (payload.eventType === 'UPDATE') {
    setData(prev => prev.map(item => 
      item.id === payload.new.id ? payload.new : item
    ));
  }
}, []);`,
        language: 'typescript'
      },
      {
        type: 'heading',
        content: 'Lessons Learned',
        level: 2
      },
      {
        type: 'quote',
        content: 'The best code is not the cleverest code, but the code that solves the problem most effectively and can be easily understood by others.'
      },
      {
        type: 'paragraph',
        content: 'This project taught me the importance of user feedback early in the development process. Regular testing with real users helped shape the final product significantly.'
      }
    ]
  },
  {
    id: 'conduit-http-client-journey',
    eventId: 'timeline-20 May 2025',
    title: 'Building Conduit: A Pure C HTTP Client',
    subtitle: 'Low-level networking without dependencies',
    description: 'The story behind creating a lightweight HTTP client in pure C with zero external dependencies and the challenges of low-level network programming.',
    slug: 'conduit-http-client-journey',
    publishedDate: '2024-05-20',
    readTime: 10,
    coverImage: '/journey/conduit-cover.jpg',
    tags: ['C', 'HTTP', 'Networking', 'Systems Programming'],
    category: 'project',
    status: 'published',
    content: [
      {
        type: 'heading',
        content: 'Why Build Another HTTP Client?',
        level: 2
      },
      {
        type: 'paragraph',
        content: 'While working on embedded systems projects, I found myself needing a lightweight HTTP client that didn\'t pull in massive dependencies. Most existing solutions were either too heavy or required external libraries that weren\'t suitable for constrained environments.'
      },
      {
        type: 'heading',
        content: 'The Challenge of Zero Dependencies',
        level: 2
      },
      {
        type: 'paragraph',
        content: 'Building an HTTP client from scratch meant implementing everything from TCP socket management to HTTP protocol parsing. Here\'s a glimpse of the core request function:'
      },
      {
        type: 'code',
        content: `// Core HTTP request implementation
int conduit_request(const char* method, const char* url, 
                   const char* headers, const char* body,
                   conduit_response_t* response) {
    
    parsed_url_t parsed;
    if (parse_url(url, &parsed) != 0) {
        return CONDUIT_ERROR_INVALID_URL;
    }
    
    int sockfd = create_socket(parsed.host, parsed.port);
    if (sockfd < 0) {
        return CONDUIT_ERROR_CONNECTION_FAILED;
    }
    
    // Build and send HTTP request
    char* request = build_http_request(method, &parsed, headers, body);
    send_request(sockfd, request);
    
    // Parse response
    return parse_http_response(sockfd, response);
}`,
        language: 'c'
      },
      {
        type: 'heading',
        content: 'Memory Management Nightmares',
        level: 2
      },
      {
        type: 'paragraph',
        content: 'One of the biggest challenges was ensuring proper memory management without leaks. Every malloc() needed its corresponding free(), and error handling had to be bulletproof.'
      },
      {
        type: 'quote',
        content: 'In C, you are not just writing code for the happy path - you are writing code for every possible failure scenario.'
      },
      {
        type: 'paragraph',
        content: 'The project taught me valuable lessons about systems programming, network protocols, and the importance of rigorous testing in low-level code.'
      }
    ]
  },
  {
    id: 'text-rasterization-journey',
    eventId: 'timeline-9 Jun 2025',
    title: 'Decoding TrueType: A Text Rasterization Adventure',
    subtitle: 'Understanding font rendering from the ground up',
    description: 'Deep dive into TTF file format and building a text rasterization engine to understand how computers render text.',
    slug: 'text-rasterization-journey',
    publishedDate: '2024-06-09',
    readTime: 15,
    coverImage: '/journey/text-raster-cover.jpg',
    tags: ['Graphics', 'TTF', 'Rasterization', 'C++', 'Typography'],
    category: 'project',
    status: 'published',
    content: [
      {
        type: 'heading',
        content: 'The Hardest "Hello World"',
        level: 2
      },
      {
        type: 'paragraph',
        content: 'What started as curiosity about how text appears on screen turned into one of the most complex projects I\'ve undertaken. Text rasterization involves understanding font formats, bezier curves, and pixel-level rendering.'
      },
      {
        type: 'heading',
        content: 'Diving into TTF Format',
        level: 2
      },
      {
        type: 'paragraph',
        content: 'TrueType Font files are incredibly complex binary formats. Each character is defined by a series of control points and curves that need to be interpreted and rasterized at different sizes.'
      },
      {
        type: 'code',
        content: `// TTF glyph outline parsing
typedef struct {
    uint16_t contour_count;
    int16_t xMin, yMin, xMax, yMax;
    uint16_t* contour_ends;
    uint16_t instruction_length;
    uint8_t* instructions;
    // Glyph coordinates and flags
    ttf_point_t* points;
    uint16_t point_count;
} ttf_glyph_t;

// Rasterize glyph to bitmap
void rasterize_glyph(ttf_glyph_t* glyph, float size, 
                    bitmap_t* output) {
    // Scale glyph coordinates
    scale_glyph_coordinates(glyph, size);
    
    // Convert curves to line segments
    tessellate_curves(glyph);
    
    // Fill the bitmap using scanline algorithm
    scanline_fill(glyph, output);
}`,
        language: 'cpp'
      },
      {
        type: 'heading',
        content: 'Bezier Curves and Mathematics',
        level: 2
      },
      {
        type: 'paragraph',
        content: 'The most challenging part was implementing proper curve rasterization. TrueType fonts use quadratic Bezier curves, and converting these to pixels requires careful mathematical implementation.'
      },
      {
        type: 'image',
        content: '/journey/bezier-curves.jpg',
        alt: 'Visualization of bezier curve tessellation'
      },
      {
        type: 'quote',
        content: 'Text rendering is where mathematics, computer graphics, and typography converge into something that seems simple but is incredibly complex under the hood.'
      },
      {
        type: 'paragraph',
        content: 'This project gave me a profound appreciation for the complexity hidden behind everyday computing tasks and deepened my understanding of graphics programming.'
      }
    ]
  },
  {
    id: 'axon-aes-implementation',
    eventId: 'timeline-29 Mar 2025',
    title: 'Axon: Implementing AES from Scratch',
    subtitle: 'Understanding cryptography through implementation',
    description: 'Building a complete AES encryption implementation in C to understand the mathematics and algorithms behind modern cryptography.',
    slug: 'axon-aes-implementation',
    publishedDate: '2024-03-29',
    readTime: 12,
    coverImage: '/journey/axon-cover.jpg',
    tags: ['Cryptography', 'AES', 'C', 'Security', 'Mathematics'],
    category: 'project',
    status: 'published',
    content: [
      {
        type: 'heading',
        content: 'Why Implement Crypto From Scratch?',
        level: 2
      },
      {
        type: 'paragraph',
        content: 'While production systems should always use well-tested cryptographic libraries, implementing AES from scratch was an invaluable learning experience. It forced me to understand every step of the encryption process.'
      },
      {
        type: 'heading',
        content: 'The AES Algorithm Structure',
        level: 2
      },
      {
        type: 'paragraph',
        content: 'AES operates on a 4x4 grid of bytes through multiple rounds of four operations: SubBytes, ShiftRows, MixColumns, and AddRoundKey. Each operation serves a specific cryptographic purpose.'
      },
      {
        type: 'code',
        content: `// AES encryption round implementation
void aes_encrypt_round(aes_state_t* state, uint8_t* round_key, int is_final) {
    // SubBytes transformation using S-box
    sub_bytes(state);
    
    // ShiftRows transformation
    shift_rows(state);
    
    // MixColumns (skip in final round)
    if (!is_final) {
        mix_columns(state);
    }
    
    // AddRoundKey
    add_round_key(state, round_key);
}

// S-box substitution
void sub_bytes(aes_state_t* state) {
    for (int i = 0; i < 16; i++) {
        state->bytes[i] = AES_SBOX[state->bytes[i]];
    }
}`,
        language: 'c'
      },
      {
        type: 'heading',
        content: 'The Mathematics Behind Security',
        level: 2
      },
      {
        type: 'paragraph',
        content: 'The most fascinating aspect was understanding how mathematical operations in finite fields provide security. The MixColumns operation, for example, uses multiplication in GF(2^8) to ensure diffusion.'
      },
      {
        type: 'heading',
        content: 'Testing and Validation',
        level: 2
      },
      {
        type: 'paragraph',
        content: 'Implementing test vectors from NIST was crucial to ensure correctness. A single bit error in implementation could compromise the entire security of the system.'
      },
      {
        type: 'quote',
        content: 'Cryptography is unforgiving - there is no "mostly secure" or "partially correct". It either works perfectly or it provides no security at all.'
      },
      {
        type: 'paragraph',
        content: 'This project deepened my appreciation for both the elegance of cryptographic algorithms and the critical importance of using well-tested implementations in production systems.'
      }
    ]
  },
  {
    id: 'learning-typescript-advanced',
    title: 'Mastering Advanced TypeScript',
    subtitle: 'A deep dive into complex type systems',
    description: 'My journey learning advanced TypeScript concepts, from basic types to complex utility types and design patterns.',
    slug: 'learning-typescript-advanced',
    publishedDate: '2024-02-20',
    readTime: 8,
    coverImage: '/journey/typescript-learning.jpg',
    tags: ['TypeScript', 'Learning', 'Programming', 'Types'],
    category: 'learning',
    status: 'published',
    content: [
      {
        type: 'heading',
        content: 'Why Advanced TypeScript?',
        level: 2
      },
      {
        type: 'paragraph',
        content: 'After working with TypeScript for basic type annotations, I realized there was so much more to explore. Advanced TypeScript opens up possibilities for creating robust, self-documenting APIs.'
      },
      {
        type: 'heading',
        content: 'Key Concepts Learned',
        level: 2
      },
      {
        type: 'list',
        items: [
          'Conditional Types and Type Guards',
          'Mapped Types and Template Literal Types',
          'Utility Types (Pick, Omit, Record, etc.)',
          'Generic Constraints and Inference',
          'Module Augmentation and Declaration Merging'
        ]
      },
      {
        type: 'code',
        content: `// Example of advanced TypeScript usage
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object 
    ? DeepReadonly<T[P]> 
    : T[P];
};

type ApiResponse<T> = {
  data: T;
  status: 'success' | 'error';
  message?: string;
};

// Usage
type UserResponse = ApiResponse<DeepReadonly<User>>;`,
        language: 'typescript'
      }
    ]
  }
];
