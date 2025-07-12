import { calculateReadTime } from '@/lib/readTime';

// Journey/Timeline blog data structure
// 
// HOW TO ADD TWITTER CONTENT (AD-FREE):
// Option 1: Screenshot + Link (Recommended)
// 1. Take a screenshot of the tweet
// 2. Save it in /public/journey/ folder
// 3. Add as image with tweet link:
//    {
//      type: 'tweetImage',
//      content: '/journey/tweet-screenshot.jpg',
//      alt: 'Tweet by @username about...',
//      tweetUrl: 'https://twitter.com/username/status/1234567890123456789'
//    }
//
// Option 2: Live embed (has ads):
//    {
//      type: 'twitter',
//      tweetId: '1234567890123456789'
//    }
//
// HOW TO ADD IMAGES:
// 1. Place your image in the /public/journey/ folder
// 2. Reference it in your content like this:
//    {
//      type: 'image',
//      content: '/journey/your-image.jpg',
//      alt: 'Description of your image'
//    }
//
// HOW TO ADD LINK EMBEDS:
// 1. Add a link preview card like this:
//    {
//      type: 'linkEmbed',
//      content: 'https://example.com/article',
//      title: 'Article Title',
//      description: 'Brief description of the link content',
//      image: 'https://example.com/preview.jpg', // optional
//      domain: 'example.com' // optional, auto-extracted if not provided
//    }
//
// HOW TO ADD VIDEOS:
// 1. For local videos, place them in /public/journey/ folder:
//    {
//      type: 'video',
//      content: '/journey/demo-video.mp4',
//      alt: 'Demo video showing the application',
//      poster: '/journey/video-thumbnail.jpg' // optional poster image
//    }
// 2. For YouTube videos:
//    {
//      type: 'video',
//      content: 'https://www.youtube.com/watch?v=VIDEO_ID',
//      alt: 'YouTube video description'
//    }
//
// HOW TO ADD IMAGE CAROUSEL/GALLERY:
// 1. Place your images in the /public/journey/ folder
// 2. Add multiple images in a single carousel:
//    {
//      type: 'carousel',
//      images: [
//        { src: '/journey/image1.jpg', alt: 'First image description' },
//        { src: '/journey/image2.jpg', alt: 'Second image description' },
//        { src: '/journey/image3.jpg', alt: 'Third image description' }
//      ],
//      caption: 'Optional caption for the entire carousel'
//    }
//
// Images and videos maintain their original aspect ratio without cropping!
// Read time is now calculated automatically based on content!

export interface JourneyContent {
  type: 'paragraph' | 'heading' | 'image' | 'code' | 'quote' | 'list' | 'twitter' | 'tweetImage' | 'linkEmbed' | 'carousel' | 'video';
  content?: string;
  level?: number; // for headings (h1, h2, etc.)
  alt?: string; // for images and videos
  language?: string; // for code blocks
  items?: string[]; // for lists
  tweetId?: string; // for twitter embeds (with ads)
  tweetUrl?: string; // for tweet image links (ad-free)
  title?: string; // for link embeds
  description?: string; // for link embeds
  image?: string; // for link embeds
  domain?: string; // for link embeds
  images?: { src: string; alt: string }[]; // for carousel
  caption?: string; // for carousel
  poster?: string; // for video poster/thumbnail
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
  readTime?: number; // in minutes - auto-calculated if not provided
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

// Sample journey posts (raw data)
const rawJourneyPosts: JourneyPost[] = [
{
  id: 'fern',
  projectId: 'fern',
  eventId: 'timeline-30 May 2025',
  title: 'Building Fern',
  subtitle: 'The complete journey of developing a modern web graphics library',
  description: 'A deep dive into the development of Fern — a zero-dependency, Wasm-powered graphics and UI library built in C and C++. From early pixel buffers to a Flutter-like layout engine, this post documents the entire story.',
  slug: 'fern',
  publishedDate: '2024-03-15',
//   readTime: 12,
  tags: ['C++', 'Wasm', 'Graphics', 'UI', 'Layout Engine'],
  category: 'project',
  status: 'published',
  content: [
    {
      type: 'heading',
      content: 'Chapter 1',
      level: 2
    },
    {
      type: 'paragraph',
      content: 'So it all started with a simple idea, to make a graphing library that was flexible and easy to use, which can make simple shapes on a canvas, and export it to image. I got into some work, made a simple implementation by spinning up a simple C project, and made some example scenes out of it. Here is one of them.'
    },
    {
      type: 'image',
      content: '/journey/fern/fern-initial.png',
      alt: 'Initial sketches and wireframes for Fern'
    },
    {
      type: 'paragraph',
      content: 'Initially you could just export the image to PPM format, which is a simple image format. This is the first tweet I made about it:'
    },
    {
      type: 'tweetImage',
      content: '/journey/fern/tweets/t1.png',
      alt: 'Tweet by @rishi2220 about Fern',
      tweetUrl: 'https://twitter.com/rishi2220/status/1234567890123456789'
    },
    {
      type: 'paragraph',
      content: 'The response was better than expected. 12 people starred the project on GitHub. I wanted to develop it further, so I started working on it. I made a simple canvas renderer, which could render basic shapes like lines, circles, rectangles, and text. After basic bitmap-based rasterization made the project look complete, I was genuinely excited. This was the first image I created after adding features like gradients and text rendering.'
    },
    {
      type: 'image',
      content: '/journey/fern/cyberpunk.png',
      alt: 'First render of Fern with basic shapes and text'
    },
    {
      type: 'paragraph',
      content: 'After that I thought about taking the same concept and rendering it on the web using Wasm. It worked, and I found some amazing use cases. It felt like I was making an interactive website but using my own written library. The syntax was inspired by Flutter, and I made it that way on purpose.'
    },
    {
      type: 'tweetImage',
      content: '/journey/fern/tweets/t2.png',
      alt: 'Tweet by @rishi2220 about Fern',
      tweetUrl: 'https://x.com/Rishi2220/status/1921201566410846390'
    },
    {
      type: 'paragraph',
      content: 'Eventually I made a life simulator using Fern. It was kind of amazing to see it come together. Zero dependency, interactive, and built using raw C compiled to Wasm. The name "Fern" is also inspired from Flutter. Here is the link to that life simulator:'
    },
    {
      type: 'linkEmbed',
      title: 'Fern Life Simulator',
      content: 'https://fern-life.web.app'
    },
    {
      type: 'paragraph',
      content: 'It was time to make it public. Yes, it wasn’t polished, but it worked. There was already a lot of proof of work. I quickly built a CLI, a documentation site, and a landing page. Here’s the page you might have seen if you know Fern:'
    },
    {
      type: 'linkEmbed',
      title: 'Fern Documentation',
      content: 'https://fern.rishia.in'
    },
    {
      type: 'heading',
      content: 'Chapter 2',
      level: 2
    },
    {
      type: 'paragraph',
      content: 'I concluded the project for a while, but it always felt like there was more. During a random discussion, someone told me, “Till then, you’ll make a whole DSL.” And it hit me. I already had one — it just wasn’t well structured. So I decided to take it seriously. I started porting it to C++ to make it more robust and scalable. Proper widget systems, layout managers, just like how Flutter does it. And this was the starting point.'
    },
    {
      type: 'paragraph',
      content: 'Here’s a small gist of the syntax if you haven’t seen it yet.'
    },
    {
      type: 'code',
      content: `void draw() {
    Draw::fill(Colors::DarkGray);
    TextWidget(Point(50, 50), "Button Demo", 3, Colors::White);
    std::string counterText = "Count: " + std::to_string(clickCount);
    TextWidget(Point(50, 400), counterText.c_str(), 2, Colors::White);
}

int main() {
    Fern::initialize(pixels, 800, 600);
    setupUI();
    Fern::setDrawCallback(draw);
    Fern::startRenderLoop();
    return 0;
}`,
      language: 'cpp'
    },
    {
      type: 'paragraph',
      content: 'I then wrote an actual layout engine. Before this, you had to manually place everything with coordinates, which meant no responsive design. With Row, Column, Expanded, Spacer — just like Flutter — Fern could now lay out widgets properly. This was the first working layout:'
    },
    {
      type: 'image',
      content: '/journey/fern/layout.png',
      alt: 'Layouts in Fern'
    },
    {
      type: 'paragraph',
      content: 'I kept going. Can we make this cross-platform? Maybe web is not enough. What about desktop? So I made renderers for both Wasm and native Linux. And now it ran on Linux too. Then I got tired of the blocky bitmap fonts. I wanted real text — like proper font rendering. So I learned about font rasterization, built a tool, wrote a blog, plugged it into Fern, and suddenly we had native TTF support. Not perfect, but it worked.'
    },
    {
      type: 'image',
      content: '/journey/fern/hello.png',
      alt: 'First TTF rasterized text in Fern'
    },
    {
      type: 'paragraph',
      content: 'This project taught me how design decisions directly impact developer experience. It also showed me the value of early feedback and quick iterations. But more importantly, it made me realize how deep and powerful even the simplest graphics systems can be when built from scratch.'
    },
    {
      type: 'heading',
      content: 'What Now?',
      level: 2
    },
    {
      type: 'paragraph',
      content: 'Fern is not finished. In fact, I am still building it. Right now progress is slow. A lot of other things are taking time. But the goal is clear. Polish the CLI, refine the C++ API, make the docs better, and officially launch the whole project.'
    },
    {
      type: 'paragraph',
      content: 'If you have seen Fern before, know this. I am not done. The vision is still alive, and something better is coming soon.'
    },
  ]
},

{
  id: 'openlearn',
  projectId: 'openlearn',
  eventId: 'timeline-13 Jun 2025',
  title: 'Building OpenLearn',
  subtitle: 'the complete journey of developing a modern cohort-based educational platform',
  description: 'The story behind OpenLearn — a production-grade platform built for scalable, structured, and role-based education. This chapter traces how the first real version came to life in less than a week.',
  slug: 'openlearn',
  publishedDate: '2024-03-15',
//   readTime: 10,
  tags: ['TypeScript', 'Express', 'PostgreSQL', 'Prisma', 'Docker', 'Render', 'NeonDB'],
  category: 'project',
  status: 'published',
  content: [
    {
      type: 'heading',
      content: 'chapter 1',
      level: 2
    },
    {
      type: 'paragraph',
      content: 'The idea for OpenLearn started in a casual conversation with a friend from IIT Kanpur. We discussed how seniors could actively involve juniors in real projects, creating a space where learning happens through doing. That evolved into something much bigger, a cohort-based, role-driven learning model built around structure, progress, and autonomy. This was the very first webpage that captured that early version.'
    },
    {
      type: 'linkEmbed',
      title: 'Initial webpage for OpenLearn',
      content: 'https://openlearnnitj.web.app/'
    },
    {
      type: 'paragraph',
      content: 'We wanted OpenLearn to focus on practical domains like finance and machine learning. The ones that don’t get enough attention in traditional classrooms. To test the idea, we launched ML Fest, a 3-day college-wide event. The turnout, retention, and response told us we were onto something real.'
    },
    {
      type: 'carousel',
      images: [
        { src: '/journey/openlearn/mlfest/1.jpeg', alt: 'Workshop session at ML Fest' },
        { src: '/journey/openlearn/mlfest/2.jpeg', alt: 'Live coding session' },
        { src: '/journey/openlearn/mlfest/3.jpeg', alt: 'Team Q&A panel' }
      ],
      caption: 'snapshots from ML Fest'
    },
    {
      type: 'paragraph',
      content: 'The success of the event gave us momentum. On June 9, 2025, we held an offline orientation at NIT Jalandhar. Over 70 students attended, and the first OpenLearn cohort was officially live.'
    },
    {
      type: 'carousel',
      images: [
        { src: '/journey/openlearn/mlfest/1.jpeg', alt: 'Students during orientation' },
        { src: '/journey/openlearn/mlfest/2.jpeg', alt: 'Cohort introduction session' },
        { src: '/journey/openlearn/mlfest/3.jpeg', alt: 'OpenLearn kickoff' }
      ],
      caption: 'cohort commencement'
    },
    {
      type: 'paragraph',
      content: 'We could have managed everything on WhatsApp and Google Sheets. But we knew we needed to build it the right way — a real system with logins, access control, learning paths, submissions, and real-time progress tracking. Two of us sat through the night and built it. OpenLearn was coded, tested, and deployed in under half a week.'    },
    {
      type: 'paragraph',
      content: 'The backend was built with TypeScript, Express.js, and Prisma, running on PostgreSQL. Over 25 tables were designed, 100+ endpoints written, all containerized with Docker. We used Render for deployment, NeonDB for the database, and Vercel for the frontend.'
    },
    {
      type: 'linkEmbed',
      title: 'OpenLearn live platform',
      content: 'https://openlearn.org.in/'
    },
    {
      type: 'linkEmbed',
      title: 'OpenLearn GitHub',
      content: 'https://github.com/openlearnnitj/'
    },
    {
      type: 'paragraph',
      content: 'Everything ran smoother than expected. The platform handled live traffic from 120+ users, with a complete status system, zero downtime, and full observability from day one.'
    },
    {
      type: 'linkEmbed',
      title: 'OpenLearn Status Page',
      content: 'https://api.openlearn.org.in/status-page'
    },
    {
      type: 'paragraph',
      content: 'Eventually, we hit NeonDB’s free-tier limits. But even that didn’t break us. We migrated the entire system — data, users, progress — to a new PostgreSQL instance with zero downtime. It was the first major incident, and it proved the resilience of the system.'
    },
    {
      type: 'image',
      content: '/journey/openlearn/neondb.png',
      alt: 'NeonDB usage warning'
    },
    {
      type: 'paragraph',
      content: 'To scale properly, we moved to a self-managed EC2 server. We hardened the deployment, added Redis caching, wrote CI/CD pipelines, and added a real health monitoring layer. Now, OpenLearn runs on a stable, high-performance infrastructure built for real education at scale. Here are some images while development of the LMS:'
    },
    {
      type: 'carousel',
      images: [
        { src: '/journey/openlearn/dev1.jpeg', alt: 'Students during orientation' },
        { src: '/journey/openlearn/dev2.jpeg', alt: 'Cohort introduction session' },
      ],
      caption: 'Development images'
    },
    {
      type: 'paragraph',
      content: 'Looking back, the only reason this came together was because we had a small, high-agency, high-vision team. That’s what it takes. Not just code, not just deadlines, clarity of purpose and people who execute.'
    },
    {
      type: 'paragraph',
      content: 'We are now preparing for our biggest project yet — a large-scale, nationwide college hackathon powered by OpenLearn. The announcement will be coming soon.'
    },
    {
      type: 'paragraph',
      content: 'This is just chapter 1. More stories from behind the scenes are coming soon.'
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
  },
  {
    id: 'nextjs-documentation',
    title: 'Next.js Documentation',
    subtitle: 'The React Framework for Production',
    description: 'Next.js gives you the best developer experience with all the features you need for production.',
    slug: 'nextjs-documentation',
    publishedDate: '2024-01-10',
    readTime: 5,
    coverImage: '/journey/nextjs-docs.jpg',
    tags: ['Next.js', 'React', 'Documentation', 'Web Development'],
    category: 'learning',
    status: 'published',
    content: [
      {
        type: 'heading',
        content: 'Introduction to Next.js',
        level: 2
      },
      {
        type: 'paragraph',
        content: 'Next.js is a React framework that enables functionality such as server-side rendering and generating static websites for React-based web applications.'
      },
      {
        type: 'linkEmbed',
        content: 'https://nextjs.org/docs',
        title: 'Next.js Documentation',
        description: 'The React Framework for Production. Next.js gives you the best developer experience with all the features you need for production.',
        image: 'https://nextjs.org/static/blog/next-13/twitter-card.png',
        domain: 'nextjs.org'
      },
      {
        type: 'heading',
        content: 'Getting Started',
        level: 2
      },
      {
        type: 'paragraph',
        content: 'To get started with Next.js, you can follow the official documentation which provides a comprehensive guide on setting up a new Next.js project.'
      },
      {
        type: 'code',
        content: `npx create-next-app@latest my-nextjs-app
cd my-nextjs-app
npm run dev`,
        language: 'bash'
      },
      {
        type: 'heading',
        content: 'Key Features',
        level: 2
      },
      {
        type: 'list',
        items: [
          'Server-side rendering',
          'Static site generation',
          'API routes',
          'Incremental static regeneration',
          'Built-in CSS and Sass support'
        ]
      },
      {
        type: 'heading',
        content: 'Conclusion',
        level: 2
      },
      {
        type: 'paragraph',
        content: 'Next.js is a powerful React framework that provides a rich set of features to build production-ready web applications. Its flexibility and performance make it a popular choice among developers.'
      }
    ]
  }
];

// Process journey posts to calculate read time automatically
export const processedJourneyPosts: JourneyPost[] = rawJourneyPosts.map((post: JourneyPost) => ({
  ...post,
  readTime: post.readTime || calculateReadTime(post.content)
}));

// Export processed posts as main export
export const journeyPosts = processedJourneyPosts;

// Helper function to get a journey post by slug with calculated read time
export function getJourneyPostBySlug(slug: string): JourneyPost | undefined {
  return processedJourneyPosts.find(post => post.slug === slug);
}

// Helper function to get all published journey posts with calculated read time
export function getPublishedJourneyPosts(): JourneyPost[] {
  return processedJourneyPosts.filter(post => post.status === 'published');
}
