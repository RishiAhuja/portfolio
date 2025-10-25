import { BLOB_PATTERNS } from '../lib/blobStorage';
import { calculateReadTime } from '../lib/readTime';

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
  publishedDate: '2025-07-23',
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
      content: BLOB_PATTERNS.BASE + "/fern/fern-initial.png",
      alt: 'Initial sketches and wireframes for Fern'
    },
    {
      type: 'paragraph',
      content: 'Initially you could just export the image to PPM format, which is a simple image format. This is the first tweet I made about it:'
    },
    {
      type: 'tweetImage',
      content: BLOB_PATTERNS.BASE + '/fern/tweets/t1.png',
      alt: 'Tweet by @rishi2220 about Fern',
      tweetUrl: 'https://twitter.com/rishi2220/status/1234567890123456789'
    },
    {
      type: 'paragraph',
      content: 'The response was better than expected. 12 people starred the project on GitHub. I wanted to develop it further, so I started working on it. I made a simple canvas renderer, which could render basic shapes like lines, circles, rectangles, and text. After basic bitmap-based rasterization made the project look complete, I was genuinely excited. This was the first image I created after adding features like gradients and text rendering.'
    },
    {
      type: 'image',
      content: BLOB_PATTERNS.BASE + '/fern/cyberpunk.png',
      alt: 'First render of Fern with basic shapes and text'
    },
    {
      type: 'paragraph',
      content: 'After that I thought about taking the same concept and rendering it on the web using Wasm. It worked, and I found some amazing use cases. It felt like I was making an interactive website but using my own written library. The syntax was inspired by Flutter, and I made it that way on purpose.'
    },
    {
      type: 'tweetImage',
      content: BLOB_PATTERNS.BASE + '/fern/tweets/t2.png',
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
      content: BLOB_PATTERNS.BASE + '/fern/layout.png',
      alt: 'Layouts in Fern'
    },
    {
      type: 'paragraph',
      content: 'I kept going. Can we make this cross-platform? Maybe web is not enough. What about desktop? So I made renderers for both Wasm and native Linux. And now it ran on Linux too. Then I got tired of the blocky bitmap fonts. I wanted real text — like proper font rendering. So I learned about font rasterization, built a tool, wrote a blog, plugged it into Fern, and suddenly we had native TTF support. Not perfect, but it worked.'
    },
    {
      type: 'image',
      content: BLOB_PATTERNS.BASE + '/fern/hello.png',
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
  publishedDate: '2025-07-24',
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
        { src: BLOB_PATTERNS.BASE + '/openlearn/mlfest/1.jpeg', alt: 'Workshop session at ML Fest' },
        { src: BLOB_PATTERNS.BASE + '/openlearn/mlfest/2.jpeg', alt: 'Live coding session' },
        { src: BLOB_PATTERNS.BASE + '/openlearn/mlfest/3.jpeg', alt: 'Team Q&A panel' }
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
        { src: BLOB_PATTERNS.BASE + '/openlearn/mlfest/1.jpeg', alt: 'Students during orientation' },
        { src: BLOB_PATTERNS.BASE + '/openlearn/mlfest/2.jpeg', alt: 'Cohort introduction session' },
        { src: BLOB_PATTERNS.BASE + '/openlearn/mlfest/3.jpeg', alt: 'OpenLearn kickoff' }
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
        { src: BLOB_PATTERNS.BASE + '/openlearn/dev1.jpeg', alt: 'Students during orientation' },
        { src: BLOB_PATTERNS.BASE + '/openlearn/dev2.jpeg', alt: 'Cohort introduction session' },
        { src: BLOB_PATTERNS.BASE + '/openlearn/dev3.jpeg', alt: 'Cohort introduction session' },
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
  "id": "supermind-hack",
  "eventId": "timeline-19 Jan 2025",
  "title": "Our Journey to the Level Supermind Hackathon in Mumbai",
  "subtitle": "From a last-minute entry to a second-place victory, and the chaotic journey back home.",
  "description": "This is the story of how our team participated in the Level Supermind Hackathon, from the initial online qualifier to the final round in Mumbai. We built a social media analyzer, traveled across the country, coded for 12 hours straight, and even missed our train back home. It's a story of teamwork, perseverance, and a little bit of bad luck.",
  "slug": "level-supermind-hackathon",
  "publishedDate": "2025-07-25",
  "readTime": 15,
  "tags": ["Hackathon", "Mumbai", "Level Supermind", "Insightly", "SoulBuddy", "Travel"],
  "category": "project",
  "status": "published",
  "content": [
    {
      "type": "heading",
      "content": "The Hackathon Journey",
      "level": 2
    },
    {
      "type": "paragraph",
      "content": "While working on another project, a member of our team discovered a hackathon in Mumbai organized by prominent figures like Hitesh Choudhary and Ranveer Allahbadia's company, Level Supermind. The initial challenge was an online assignment to build a Social Media Analyzer tool using Langflow and AstraDB, who were also sponsors. We decided to participate, registered our team, and began developing the product during our winter vacation. In about 30 hours, we built the entire tool, named 'Insightly,' and created a well-edited YouTube video to demonstrate it. We were among the first to submit our project on December 31, 2024. Here is the link to the original product demo of Insightly:"
    },
    {
      "type": "linkEmbed",
      "title": "Original product demo of Insightly",
      "content": "https://www.youtube.com/watch?v=TGx_P_ZqODM"
    },
    {
      "type": "paragraph",
      "content": "Due to our early submission, we noticed that some other participants began to copy our project, with some even forgetting to change our team name in their GitHub repositories. Despite this, we were thrilled to learn that we had been selected for the final round and were invited to Mumbai. We quickly booked our train and accommodation, ready for the main event on January 19, 2025."
    },
    {
      "type": "paragraph",
      "content": "In preparation, we anticipated potential problem statements based on the sponsoring companies and designed some UI components in a neobrutalist style to save time during the hackathon. Our 30-hour train journey on the Paschim Express to Mumbai was an adventure in itself."
    },
    {
      "type": "carousel",
      "images": [
        { "src": BLOB_PATTERNS.BASE + "/supermind/travel/1.jpg", "alt": "Travel image 1" },
        { "src": BLOB_PATTERNS.BASE + "/supermind/travel/2.jpg", "alt": "Travel image 2" },
        { "src": BLOB_PATTERNS.BASE + "/supermind/travel/3.jpg", "alt": "Travel image 3" },
        { "src": BLOB_PATTERNS.BASE + "/supermind/travel/4.jpg", "alt": "Travel image 4" }
      ],
      "caption": "Traveling to Mumbai on the Paschim Express"
    },
    {
      "type": "paragraph",
      "content": "The hackathon began with introductions from the sponsors and a briefing on the problem statements. We chose the final task and had just 12 hours to develop a complete product, a promotional video, a landing page, and a presentation. The problem statement was:"
    },
    {
      "type": "quote",
      "content": "Task 3: SoulBuddy - AI-Powered Spiritual Guide"
    },
    {
      "type": "paragraph",
      "content": "Here are some images from the hackathon:"
    },
    {
      "type": "carousel",
      "images": [
        { "src": BLOB_PATTERNS.BASE + "/supermind/hack-time/1.jpg", "alt": "Hackathon image 1" },
        { "src": BLOB_PATTERNS.BASE + "/supermind/hack-time/2.jpg", "alt": "Hackathon image 2" },
        { "src": BLOB_PATTERNS.BASE + "/supermind/hack-time/3.jpg", "alt": "Hackathon image 3" },
        { "src": BLOB_PATTERNS.BASE + "/supermind/hack-time/4.jpg", "alt": "Hackathon image 4" },
        { "src": BLOB_PATTERNS.BASE + "/supermind/hack-time/5.jpeg", "alt": "Hackathon image 5" },
        { "src": BLOB_PATTERNS.BASE + "/supermind/hack-time/6.jpeg", "alt": "Hackathon image 6" },
        { "src": BLOB_PATTERNS.BASE + "/supermind/hack-time/7.jpg", "alt": "Hackathon image 7" }
      ],
      "caption": "Images from the hackathon"
    },
    {
      "type": "paragraph",
      "content": "We successfully built the product, created the video, and prepared our presentation. As the second team to present, we impressed the judges and confidently answered all their questions. Our hard work paid off when we secured second place and a cash prize of 50,000 rupees. Afterward, we celebrated by exploring some of Mumbai's famous landmarks, including Versova, Marine Drive, Churchgate, and Juhu."
    },
    {
      "type": "carousel",
      "images": [
        { "src": BLOB_PATTERNS.BASE + "/supermind/post-hack/1.jpg", "alt": "Post-hackathon image 1" },
        { "src": BLOB_PATTERNS.BASE + "/supermind/post-hack/2.jpg", "alt": "Post-hackathon image 2" },
        { "src": BLOB_PATTERNS.BASE + "/supermind/post-hack/3.jpg", "alt": "Post-hackathon image 3" },
        { "src": BLOB_PATTERNS.BASE + "/supermind/post-hack/4.jpg", "alt": "Post-hackathon image 4" },
        { "src": BLOB_PATTERNS.BASE + "/supermind/post-hack/5.jpg", "alt": "Post-hackathon image 5" },
        { "src": BLOB_PATTERNS.BASE + "/supermind/post-hack/6.jpg", "alt": "Post-hackathon image 6" },
        { "src": BLOB_PATTERNS.BASE + "/supermind/post-hack/7.jpg", "alt": "Post-hackathon image 7" },
        { "src": BLOB_PATTERNS.BASE + "/supermind/post-hack/8.jpg", "alt": "Post-hackathon image 8" },
        { "src": BLOB_PATTERNS.BASE + "/supermind/post-hack/9.jpg", "alt": "Post-hackathon image 9" }
      ],
      "caption": "Exploring Mumbai after the hackathon"
    },
    {
      "type": "paragraph",
      "content": "Our journey took an unexpected turn when we got stuck in heavy traffic and missed our train back to Jalandhar by just five minutes. We made a frantic effort to catch it at the next station by taking a local train, but all our attempts were unsuccessful. Exhausted and stranded in Borivali, we eventually booked plane tickets to Amritsar for a total of 42,000 rupees, using up most of our prize money after a student discount. It was an ironic end to our trip, but a memorable one nonetheless."
    },
    {
      "type": "carousel",
      "images": [
        { "src": BLOB_PATTERNS.BASE + "/supermind/plane/1.jpg", "alt": "Return journey image 1" },
        { "src": BLOB_PATTERNS.BASE + "/supermind/plane/2.jpg", "alt": "Return journey image 2" },
        { "src": BLOB_PATTERNS.BASE + "/supermind/plane/3.jpg", "alt": "Return journey image 3" },
        { "src": BLOB_PATTERNS.BASE + "/supermind/plane/4.jpg", "alt": "Return journey image 4" },
        { "src": BLOB_PATTERNS.BASE + "/supermind/plane/5.jpg", "alt": "Return journey image 5" },
        { "src": BLOB_PATTERNS.BASE + "/supermind/plane/6.jpg", "alt": "Return journey image 6" },
        { "src": BLOB_PATTERNS.BASE + "/supermind/plane/7.jpg", "alt": "Return journey image 7" }
      ],
      "caption": "The unexpected flight back home"
    },
    {
        "type": "heading",
        "content": "Conclusion",
        "level": 3
      },
      {
        "type": "paragraph",
        "content": "The Level Supermind Hackathon was an unforgettable experience. From the initial excitement of being selected to the intense 12-hour coding session and the thrill of winning, it was a rollercoaster of emotions. Even the chaotic journey back home added to the adventure. We learned a lot, pushed our limits, and created memories that will last a lifetime. It was a testament to our teamwork and resilience, and we are proud of what we accomplished."
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
