import { BLOB_PATTERNS } from '../lib/blobStorage';
import { calculateReadTime } from '../lib/readTime';

export interface BlurbContent {
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

export interface BlurbPost {
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
  socialImage?: string;
  tags: string[];
  category: 'project' | 'learning' | 'experience' | 'achievement' | 'reflection';
  status: 'draft' | 'published';
  content: BlurbContent[];
  relatedPosts?: string[]; // Array of related post IDs
}

export interface BlurbCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}



// Sample blurb posts (raw data)
const rawBlurbPosts: BlurbPost[] = [
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
      content: '/blurb/openlearn/neondb.png',
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
},
{
  id: "rio-iclr-2026",
  eventId: "timeline-23 Apr 2026",
  title: "My ICLR 2026 and Brazil Experience in Rio de Janeiro",
  subtitle: "A long route to Rio, a paper presentation at ICLR, and the practical lessons that came with figuring out Brazil in real time.",
  description: "A personal blurb about presenting at ICLR 2026 in Rio de Janeiro, learning the city through transport mistakes, conference conversations, hostel people, and a few hard-won travel lessons.",
  slug: "iclr-2026-rio-de-janeiro",
  publishedDate: "2026-05-16",
  tags: [
    "ICLR",
    "Rio de Janeiro",
    "Brazil",
    "Conference",
    "Travel",
    "Research"
  ],
  category: "experience",
  status: "published",
  coverImage: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/IMG_3826.jpeg",
  socialImage: "/og/rio-iclr-2026.jpg",
  content: [
    {
      type: "paragraph",
      content: "ICLR 2026 was the 14th International Conference on Learning Representations. It was held from April 23 to April 27, 2026, at Riocentro in Rio de Janeiro, Brazil. For me, it was not just a conference trip. It was my first time dealing with a long international route, a different transport system, language barriers, expensive last-minute decisions, conference networking, and a paper presentation in a place I had only seen in pictures before."
    },
    {
      type: "paragraph",
      content: "The visa and pre-travel paperwork part is important, but it is also boring to write in detail right now. I might add that separately later. This post starts from the actual journey."
    },
    {
      type: "heading",
      level: 2,
      content: "Delhi Airport T3 and the Journey Out"
    },
    {
      type: "paragraph",
      content: "I started from NIT Jalandhar on April 22 at 11.50 in the morning. I took the Indo Canadian bus towards Delhi ISBT Kashmere Gate. This was already my third Delhi trip that month, and of course I managed to forget my printed poster at home."
    },
    {
      type: "paragraph",
      content: "Somewhere near Pipli, Haryana, I called someone and asked them to print a new poster. He got it printed, came near the bus stand, and handed it to me while I was still on the way. That was the first stressful moment of the trip, and it happened before I even reached Delhi."
    },
    {
      type: "paragraph",
      content: "I reached Kashmere Gate and had a heavy dinner because I knew the flights ahead were going to be long."
    },
    {
      type: "image",
      content: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/IMG_3704.jpeg",
      alt: "Dinner at Kashmere Gate before heading to Delhi Airport T3."
    },
    {
      type: "paragraph",
      content: "After that I printed a few extra documents through Blinkit, just to be safe, and went to New Delhi metro station. From there I took the Airport Express line to Terminal 3."
    },
    {
      type: "paragraph",
      content: "I reached the airport early, which was the right decision. The process was smooth. Immigration at Delhi asked only basic questions, and nothing felt difficult. I was flying with ITA Airways, and overall my experience with them was good, including the boarding process."
    },
    {
      type: "paragraph",
      content: "One thing I did not expect was getting boarding passes for all three flights from ITA itself. My final domestic flight inside Brazil was operated by GOL, but ITA still issued all the boarding passes at Delhi."
    },
    {
      type: "image",
      content: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/IMG_3709.jpeg",
      alt: "Boarding passes for the Delhi-Rome-São Paulo-Rio route."
    },
    {
      type: "paragraph",
      content: "At the airport I met several people who were also going to Brazil for ICLR. Nishant, Abhinav, Shubham, and a few others were on similar routes. Nishant was working part-time at IISc and had a poster presentation. Abhinav was with Microsoft Research and had an offer from CMU. Shubham was a final-year PhD student at IISc Bangalore."
    },
    {
      type: "paragraph",
      content: "Most of the airport conversation was basic introductions, but it immediately made the trip feel less lonely. Abhinav and Nishant were with me until the first flight."
    },
    {
      type: "paragraph",
      content: "The first flight was to Rome. The flight was slightly delayed, but the seats and food were better than I expected. It was around eight hours long, and we got one meal and one snack. I could spot many Indians on the flight, and some were clearly going to the same conference."
    },
    {
      type: "image",
      content: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/IMG_3751.jpeg",
      alt: "Meal on the first long flight."
    },
    {
      type: "paragraph",
      content: "The second flight was from Rome to São Paulo. This one was around eleven hours. ITA's food policy said that flights longer than eleven hours get two main meals and one snack, and that matched what we got. Long flights are still tiring, but having food timing predictable helps."
    },
    {
      type: "paragraph",
      content: "After São Paulo, we shifted terminals, cleared immigration, and moved to the domestic GOL flight to Rio. Brazilian immigration was surprisingly quick for me. The turnaround time was maybe three minutes. The layovers were short but manageable."
    },
    {
      type: "paragraph",
      content: "The GOL flight was only about an hour, but I was surprised to see that even this short domestic flight had snacks and onboard Wi-Fi. The plane also looked cartoonish in a good way."
    },
    {
      type: "image",
      content: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/IMG_3759.jpeg",
      alt: "GOL aircraft for the final domestic flight to Rio."
    },
    {
      type: "heading",
      level: 2,
      content: "Touchdown in Brazil"
    },
    {
      type: "paragraph",
      content: "Inside the airport, while collecting baggage, I met more people connected to the conference. There were some Sri Lankan attendees, someone from the Apple booth, a Chinese student from Western University, and Rajeev sir from IISER Bhopal. Rajeev sir was a final-year PhD student and one of the sweetest, most helpful people I met during the trip."
    },
    {
      type: "paragraph",
      content: "Then came the first practical problem, which was money and Uber."
    },
    {
      type: "paragraph",
      content: "I could not find a convenient place to exchange cash at the airport. I booked an Uber to Ipanema Beach House, but the driver needed either cash or direct payment through the Uber app. To pay through the app, I needed to add my card. To add my card, I needed an OTP. And my Vodafone international messaging was not active yet. It took around three to four hours for that to start working."
    },
    {
      type: "paragraph",
      content: "This is one of the first lessons I would give anyone traveling internationally from India. Turn on international roaming and SMS before leaving, or set up a working eSIM or alternate number and card payment method in advance. UPI is useless once you step out unless the other person is Indian. Abhinav booked a cab for me, and I paid him later through UPI. The ride cost me around INR 1.5K, and that was the moment I realized Rio transport could get expensive very quickly if I kept using Uber."
    },
    {
      type: "paragraph",
      content: "I reached Ipanema Beach House. The place was fine and had a hostel vibe. In my dorm there was one French guy and two women from England. I did not interact with anyone much that night. I went to the washroom, realized there were no jet sprays and that everyone used toilet paper, and then slept."
    },
    {
      type: "image",
      content: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/IMG_3809.jpeg",
      alt: "Ipanema Beach House, my hostel in Rio."
    },
    {
      type: "paragraph",
      content: "I woke up early the next morning, around 6."
    },
    {
      type: "paragraph",
      content: "One of my biggest first impressions was the language barrier. Almost nobody I spoke to in Brazil knew comfortable English, including many airport and transport staff. My hostel receptionist knew English, which helped a lot, but outside that I had to rely heavily on translation apps. This is not a complaint, just something to prepare for. If you are going to Rio from India, do not assume English will work everywhere."
    },
    {
      type: "paragraph",
      content: "At breakfast I saw the menu and had to decode basic food words. Chicken is `frango`, egg is `ovo`, cheese is `queijo`. I ate a cheese toast with two slices of bread and cheese inside. It cost around R$12. Tea was basically a tea bag with hot water and cost R$10."
    },
    {
      type: "paragraph",
      content: "For someone with Indian food habits, especially if you avoid beef or pork, food takes planning in Rio. You can find chicken and eggs, but you have to look carefully. Ham, pork, and beef are common. Vegetarian options exist, but they are not always obvious or filling."
    },
    {
      type: "heading",
      level: 2,
      content: "First Day at ICLR"
    },
    {
      type: "paragraph",
      content: "From Ipanema I took an Uber to the conference venue. It cost close to INR 1K, which again made it clear that I needed a cheaper commute option. Still, the ride itself was beautiful. Rio has mountains, beaches, tunnels, wide roads, and sudden sea views in the middle of normal city travel. I reached the venue about twenty minutes late, but the view on the way made the first morning memorable."
    },
    {
      type: "image",
      content: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/IMG_3826.jpeg",
      alt: "First photo at the ICLR board in Riocentro."
    },
    {
      type: "paragraph",
      content: "Riocentro was huge and well suited for a conference at ICLR scale. ICLR 2026 had grown massively. The official ICLR review-process post says the conference received 19,525 valid, format-compliant submissions, and 5,355 papers were accepted, an acceptance rate of 27.4%. Knowing that number while standing there made the place feel even bigger."
    },
    {
      type: "carousel",
      images: [
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/IMG_3843.jpeg",
          alt: "Riocentro exterior and conference area."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/IMG_3839.jpeg",
          alt: "Another view around Riocentro."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/IMG_3831.jpeg",
          alt: "Conference venue walkway."
        }
      ]
    },
    {
      type: "paragraph",
      content: "I went to the registration desk and got my ID card. It felt surreal to see my college name written alongside ICLR. It is one thing to know you have a paper accepted. It is another thing to stand at the venue, wear the badge, and see your institution represented there."
    },
    {
      type: "image",
      content: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/IMG_3848.jpeg",
      alt: "ICLR badge and proceedings."
    },
    {
      type: "paragraph",
      content: "After registration, I went towards an oral session. Outside the amphitheatre there was someone distributing free T-shirts from a company called Liner. When I reached, I was told it was the last one. He told me to come again the next day, but I never found that distribution again."
    },
    {
      type: "carousel",
      images: [
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/IMG_3853.jpeg",
          alt: "Near the amphitheatre."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/IMG_3850.jpeg",
          alt: "Inside or near one of the main session areas."
        }
      ]
    },
    {
      type: "paragraph",
      content: "I also tried a local Brazilian drink called Guaraná. It cost me around R$12. Coming from India, I also noticed that there was no MRP-style printed-price culture in the same way I am used to. The same item can be sold at different prices depending on the seller and place."
    },
    {
      type: "image",
      content: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/IMG_3859.jpeg",
      alt: "Guaraná, a Brazilian soft drink I tried at the venue."
    },
    {
      type: "paragraph",
      content: "Lunch at ICLR was paid, which is understandable for a conference with thousands of people. There were free snacks, but many were non-vegetarian and often included pork or ham. Some had egg, which I could eat. I eventually bought a burrito from outside for around R$32. It was dry but edible. This matched a broader pattern I felt in Rio, where food was manageable but not effortless for my preferences."
    },
    {
      type: "image",
      content: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/IMG_3977.jpeg",
      alt: "Food from the conference day."
    },
    {
      type: "paragraph",
      content: "Then I went to Pavilion 4, which was full of company booths. Almost every company you would expect at a major ML conference seemed to be there. The first booth I noticed was Jane Street."
    },
    {
      type: "image",
      content: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/IMG_3860.jpeg",
      alt: "Jane Street booth at ICLR."
    },
    {
      type: "paragraph",
      content: "I spoke to or met people from many places, including Microsoft, Nebius, CUHK, Google DeepMind, Amazon, MBZUAI, Salesforce, Handshake AI, Vetto AI, Appen, Western, Nubank, Translated, Baseten, Eqvilent, Susquehanna, Prolific, MATS Research, Rise Data Labs, and more. Some conversations were very short, some were useful, and some were just about understanding what people were building."
    },
    {
      type: "paragraph",
      content: "I wrote NITJ on a board there. It felt good to leave a tiny mark from my college. I also saw an affiliation/statistics visualization where China and the US dominated the accepted-paper landscape. A community analysis going around after ICLR put mainland China around 43.7% and the US around 31.9% of accepted-paper affiliations. I would not treat those exact affiliation numbers as official conference statistics, but the broad point was obvious. India was a very small presence compared with the biggest research ecosystems. Standing there as someone from NIT Jalandhar made that hit differently."
    },
    {
      type: "carousel",
      images: [
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/nitj.jpeg",
          alt: "NITJ written on the conference board."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/stat.jpeg",
          alt: "Affiliation/statistics visualization I saw around the conference context."
        }
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "Learning Rio's Bus System the Hard Way"
    },
    {
      type: "paragraph",
      content: "After the first conference day, I had to figure out how to go back to Ipanema. Uber would again cost around R$50, which was not sustainable. I accidentally saw a bus passing by and remembered reading a tweet that Rio's bus system was efficient."
    },
    {
      type: "paragraph",
      content: "I asked a bus driver for help. Of course, this happened through a translation app. He told me to take bus 881 from Riocentro to Alvorada, and then 553 or 554 towards Ipanema. I also asked whether they accepted cash because I had read about the Jaé card, Rio's public-transport ticketing system."
    },
    {
      type: "image",
      content: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/translation.jpeg",
      alt: "Translation app conversation while figuring out the bus route."
    },
    {
      type: "paragraph",
      content: "I boarded the bus and immediately became confused. The bus had a gate and turnstile system where you pay the driver or tap a card, and only then the gate opens. The problem was that the only cash I had was a R$50 note, given to me by Rajeev sir earlier."
    },
    {
      type: "paragraph",
      content: "The fare was R$5, whether you went one stop or all the way to the end. The driver did not have change for R$50. I offered the note anyway, and he basically told me not to worry and keep standing. He understood that I was a foreigner and a little helpless. He dropped me at Alvorada, where bus 554 was already waiting."
    },
    {
      type: "image",
      content: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/bus_standing.jpeg",
      alt: "Standing in the bus while figuring out the system."
    },
    {
      type: "paragraph",
      content: "I boarded 554 and explained the same issue to the next driver. He also let me stand and dropped me without making a fuss. I got down a little before Ipanema because I was following a rough estimate on Google Maps and was not sure how close the bus would go. At that time, I did not know about the best local tracking options."
    },
    {
      type: "paragraph",
      content: "Later I learned that Moovit is useful in Rio for bus planning. Even then, you have to be alert. Buses may not stop automatically at every sign. In my experience, you need to wave early and clearly, sometimes from quite far away."
    },
    {
      type: "paragraph",
      content: "After getting down, I clicked some photos and then took an Uber Moto to the hostel."
    },
    {
      type: "carousel",
      images: [
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/uber_stop1.jpeg",
          alt: "A stop on the way back from the bus route."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/uber_stop2.jpeg",
          alt: "Rio street view after getting down from the bus."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/uber_stop3.jpeg",
          alt: "Another view from that evening."
        }
      ]
    },
    {
      type: "paragraph",
      content: "At night I went to McDonald's because it felt like the safest food option. I also asked the hostel reception about cash exchange and found out there were metro stations after every few blocks in that part of the city. That was useful to know, but the ATM I tried only accepted Brazilian cards, so it did not solve my cash problem."
    },
    {
      type: "paragraph",
      content: "Finally, I visited Ipanema beach for the first time. It was almost closed, with very few people around, and it was already dark because sunset in Rio around that time was close to 5.30 PM. The beach still felt good, but Rio after sunset also felt like a place where you should stay aware."
    },
    {
      type: "carousel",
      images: [
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/mcd.jpeg",
          alt: "McDonald's in Rio, one of the safest food choices for me at first."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/bus.jpeg",
          alt: "Bus view from the Rio commute."
        }
      ]
    },
    {
      type: "paragraph",
      content: "There was also a cat at the hostel. That was the end of day one."
    },
    {
      type: "image",
      content: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/cat.jpeg",
      alt: "Hostel cat."
    },
    {
      type: "heading",
      level: 2,
      content: "More Conference Days, More Transport Lessons"
    },
    {
      type: "paragraph",
      content: "The next morning I again had cheese bread and scrambled eggs, and decided to try the bus properly. I figured out that Moovit could track buses better than my rough guessing."
    },
    {
      type: "paragraph",
      content: "I waited for the bus. The turnaround time was usually around twenty minutes. After missing one bus, I realized I had to signal clearly. Buses do not always stop just because someone is standing near a bus stop."
    },
    {
      type: "carousel",
      images: [
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/bus_stop1.jpeg",
          alt: "Morning bus stop near Ipanema."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/bus_stop2.jpeg",
          alt: "Another view near the bus stop."
        }
      ]
    },
    {
      type: "paragraph",
      content: "I finally took a bus, but I boarded the correct number in the wrong direction. That was frustrating, and I eventually gave up and booked an Uber Moto."
    },
    {
      type: "paragraph",
      content: "Uber Moto in Rio was fast. The bikes were generally much more powerful than typical Indian commuter bikes. Because the roads were wider and traffic was more organized in many areas, the bikes could move quickly and lead the traffic. It saved money compared with Uber cars, but it is not something I would recommend casually to everyone unless you are comfortable with fast two-wheeler rides."
    },
    {
      type: "image",
      content: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/bike_after.jpeg",
      alt: "View from the Uber Moto ride."
    },
    {
      type: "paragraph",
      content: "Back at the conference, I saw a map where I had left another small mark from the city and college side."
    },
    {
      type: "image",
      content: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/map.jpeg",
      alt: "Conference map / booth activity."
    },
    {
      type: "paragraph",
      content: "I attended some amazing oral sessions, including GEPA, and also an invited talk by Katie Bouman. Her talk was extremely clear and easy to understand. Seeing someone whose work I had known from far away speak live at ICLR was one of those moments that made the conference feel real."
    },
    {
      type: "carousel",
      images: [
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/katie.jpeg",
          alt: "Photo with Katie Bouman."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/audi.jpeg",
          alt: "Large auditorium/session area."
        }
      ]
    },
    {
      type: "paragraph",
      content: "Across these days I met a lot of interesting people and saw many posters. Some names I remember are Nay from SMU, Hari from TUM, Sedigheh from Perplexity, Saket from Brown, Ada from the Max Planck Institute, and many others. I also attended the Test of Time awards and had a long discussion with Rajeev sir before going back."
    },
    {
      type: "paragraph",
      content: "Dinner again ended up being McDonald's. This became a pattern because predictable food is valuable when you are tired, hungry, and still figuring out a new city."
    },
    {
      type: "paragraph",
      content: "The next day I boarded the bus correctly in the morning and reached the venue. Rajeev sir had his poster presentation that day, so I helped him set up his poster. I attended more sessions, met more people, solved some Jane Street puzzles, and went to a mentorship session with Prof. Evan and Prof. Yuntian. Both were excellent."
    },
    {
      type: "paragraph",
      content: "The return journey that day was again messy. Bus 881 was not available when I needed it, and only the connecting buses 553/554 seemed to be running. I waited for around thirty minutes, then took an Uber to Alvorada. From there I boarded bus 553, but again it was going in the wrong direction."
    },
    {
      type: "paragraph",
      content: "On that bus, a woman started talking to me. She said she was doing a PhD, liked Indians, and knew how to make Indian food. We had a good conversation, but she eventually made me realize I was on the correct bus number in the wrong direction. She told me not to panic and even suggested going for coffee. She seemed genuine, but I did not want to take unnecessary risks in a city I barely understood. I got off, took the correct bus, and went home."
    },
    {
      type: "paragraph",
      content: "This is one of the strange things about travel. The most confusing moments also become the most memorable ones."
    },
    {
      type: "heading",
      level: 2,
      content: "The Day Before My Presentation"
    },
    {
      type: "paragraph",
      content: "My paper presentation was the next day, so I wanted a proper meal before preparing. I asked the hostel reception what Brazilian people usually eat for a normal full meal. They pointed me to a cheap local restaurant where I could get a plate of food."
    },
    {
      type: "paragraph",
      content: "For my dietary constraints, the options were limited. Most things were pork or beef, but I found two chicken options. I ordered fried chicken, green rice, and potato wedges. It was good, but it cost around R$50, which is close to INR 1,000 for one meal. Rio is not cheap if you are converting everything to rupees."
    },
    {
      type: "image",
      content: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/meal.jpeg",
      alt: "Fried chicken, green rice, and potato wedges."
    },
    {
      type: "paragraph",
      content: "After that I relaxed and prepared for the presentation."
    },
    {
      type: "image",
      content: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/prep.jpeg",
      alt: "Preparing for the poster presentation."
    },
    {
      type: "heading",
      level: 2,
      content: "Presentation Day"
    },
    {
      type: "paragraph",
      content: "The next day I got ready in formals and again boarded the bus. By then the bus had become part of the story."
    },
    {
      type: "image",
      content: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/me_in_bus.jpeg",
      alt: "Presentation day, still using the bus."
    },
    {
      type: "paragraph",
      content: "There were no big company pavilions that day. It was mostly workshops in smaller rooms. Mine was in room 205."
    },
    {
      type: "paragraph",
      content: "I went to my room, attended a talk, and initially worried because there did not seem to be space for my poster. Eventually, after the session, I got a really good spot, almost like a spotlight position."
    },
    {
      type: "carousel",
      images: [
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/poster1.jpeg",
          alt: "Standing with the poster."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/poster2.jpeg",
          alt: "Poster presentation setup."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/poster3.jpeg",
          alt: "Another photo from the poster session."
        }
      ]
    },
    {
      type: "paragraph",
      content: "I met more amazing people that day, including Anatas, Poojita, and Jimmy. Poojita was from Chandigarh, and we had a really nice interaction. Rajeev sir and I got food, clicked some photos around the venue, and then went back."
    },
    {
      type: "carousel",
      images: [
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/img_after_conf1.jpeg",
          alt: "After the conference session."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/img_after_conf2.jpeg",
          alt: "Photos around the venue after the session."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/img_after_conf3.jpeg",
          alt: "Riocentro / conference memories."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/img_after_conf4.jpeg",
          alt: "Last photos around the venue."
        }
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "Ipanema, BRT, and the Jaé Card"
    },
    {
      type: "paragraph",
      content: "That evening we planned to see the sunset at Ipanema. To save money, we tried taking public transport. The route in Moovit suggested taking a BRT bus first and then a normal 553 bus."
    },
    {
      type: "paragraph",
      content: "BRT in Rio felt like a tram system on the road. It has dedicated lanes and stations, and it is much more structured than a normal bus stop. The problem was payment. Unlike the normal buses I had used, the BRT did not allow cash. We needed a Jaé card."
    },
    {
      type: "paragraph",
      content: "Useful update. While editing this in May 2026, I found Rio City Hall guidance saying that VLT and BRT already operate without cash payments, and that municipal buses were scheduled to stop accepting cash from May 30, 2026. During my late-April trip, cash still worked on the normal buses I used, but not on BRT. Check the latest rules before relying on cash."
    },
    {
      type: "paragraph",
      content: "We struggled with the machine for a while. Eventually we figured out that we had to select credit card instead of debit card. Then we needed to load money into the card. A lady there helped us a lot. She credited R$20 for us, and we paid her in cash."
    },
    {
      type: "paragraph",
      content: "The bus route took longer than expected, and by the time we reached Ipanema, we had missed the sunset. We reached around 6.30 PM. We still went to the beach and spent around thirty minutes there, but by then the main concern was how Rajeev sir would get back safely because he had a long way to go."
    },
    {
      type: "paragraph",
      content: "The problem was that we had almost no cash and no useful balance left on the Jaé card. We had only a R$50 note, and getting change in Rio was often difficult. I ran back in the opposite direction to get cash from my wallet. There was confusion, delay, and a missed bus. Eventually he got a bus and reached around 10.30 PM."
    },
    {
      type: "paragraph",
      content: "Bad decision-making from our side. Rio becomes a very different city after sunset, and sunset was around 5.30 PM. Future travelers should not plan public-transport experiments late in the evening unless they already understand the route, payment method, and last-mile safety."
    },
    {
      type: "heading",
      level: 2,
      content: "Christ the Redeemer"
    },
    {
      type: "paragraph",
      content: "The next day was for sightseeing. We planned Christ the Redeemer and Sugarloaf Mountain."
    },
    {
      type: "paragraph",
      content: "I woke up early, but Rajeev sir had to come from far away. Another friend, Abhipasa, also joined. We had already booked tickets for the Corcovado train through the official Trem do Corcovado route. The train starts from Cosme Velho and goes up through Tijuca National Park towards Christ the Redeemer."
    },
    {
      type: "paragraph",
      content: "From online research, morning seemed like the best time to visit because the weather can change quickly and crowds increase later. We booked a morning slot and thought that the exact time meant the train would leave exactly then and we had to catch that specific train. In practice, at least for us, it was more flexible. We stood in line and boarded when the train came, around 10.20 AM."
    },
    {
      type: "paragraph",
      content: "I would still tell future visitors not to depend on that flexibility. Check the latest official rules and reach early. Tourist attractions in Rio can get crowded, and ticket-slot rules may be enforced differently depending on the day."
    },
    {
      type: "paragraph",
      content: "The train ride itself was short, maybe fifteen to twenty minutes, but beautiful. When we reached the top, Christ the Redeemer was impressive, but the view was the real highlight. From there you can see Rio's beaches, mountains, city blocks, water, and the strange way the city fits between all of them."
    },
    {
      type: "carousel",
      images: [
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/christ1.jpeg",
          alt: "Christ the Redeemer visit."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/christ2.jpeg",
          alt: "View from Corcovado."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/christ3.jpeg",
          alt: "At Christ the Redeemer."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/christ4.jpeg",
          alt: "Rio from the top."
        }
      ]
    },
    {
      type: "paragraph",
      content: "We came back down around 11.30. At the bottom we had a cheese sandwich, which was one of the only vegetarian-ish options we could find there."
    },
    {
      type: "heading",
      level: 2,
      content: "Sugarloaf Mountain"
    },
    {
      type: "paragraph",
      content: "After Christ the Redeemer, we went to Sugarloaf Mountain. We had heard that 3-4 PM was a good time to go because you can see daylight, clouds, and then sunset. We booked the ticket there. It cost R$205 each, which was expensive but ended up being worth it."
    },
    {
      type: "paragraph",
      content: "The official Sugarloaf cable car route starts at Praia Vermelha, goes up to Morro da Urca, and then continues by a second cable car to Pão de Açúcar, the actual Sugarloaf Mountain. The ticket lets you do both cable-car legs."
    },
    {
      type: "paragraph",
      content: "We also had some corn there before going up."
    },
    {
      type: "paragraph",
      content: "There are two mountain levels. First you go to Morro da Urca, the middle mountain. Then you take another cable car to Sugarloaf. There was no strict feeling that you had to take a specific cable car at a specific time. You could move with the flow."
    },
    {
      type: "paragraph",
      content: "The top mountain was cloudy when we reached. It felt like standing inside a cloud. The views kept appearing and disappearing, which made it even more scenic. Later we came back to the middle mountain around 5 PM to see the sunset."
    },
    {
      type: "paragraph",
      content: "That sunset was one of the best I have ever seen. The light, the water, the mountains, and the city all came together. It was easily one of the strongest memories of the trip."
    },
    {
      type: "carousel",
      images: [
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/sugarloaf1.jpeg",
          alt: "Sugarloaf cable car / mountain view."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/sugarloaf2.jpeg",
          alt: "At Sugarloaf."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/sugarloaf3.jpeg",
          alt: "Clouds and views from Sugarloaf."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/sugarloaf4.jpeg",
          alt: "View from the top."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/sugarloaf5.jpeg",
          alt: "Sugarloaf evening view."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/sugarloaf6.jpeg",
          alt: "Waiting for sunset."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/sugarloaf7.jpeg",
          alt: "Sunset from Sugarloaf."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/sugarloaf8.jpeg",
          alt: "Rio at sunset."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/sugarloaf9.jpeg",
          alt: "More sunset views."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/sugarloaf10.jpeg",
          alt: "Cable car / mountain memory."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/sugarloaf11.jpeg",
          alt: "Final Sugarloaf photo from the day."
        }
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "Hostel People and Botanical Garden"
    },
    {
      type: "paragraph",
      content: "That night I came back to the hostel and met new people. I played Uno with Dirk, Sophia, and Henri. We stayed up late, discussed cultures, and had a lot of fun."
    },
    {
      type: "paragraph",
      content: "The next day I went to the Botanical Garden with them. More people joined too, including Rohit and Robert. The ticket was around R$80. The garden was fine, but the best part was still the people."
    },
    {
      type: "paragraph",
      content: "At night I met Connor, Summer, Nicholas, and a few others. Everyone was interesting in a different way. One thing that felt very new to me was how common gap years were for Europeans. Nicholas was from Germany, around twenty, and was on a two-year gap after high school. Sophia was working as a bartender to earn enough money to travel. Two women from England I met were also doing gap-year travel. Coming from India, this felt like a completely different life path."
    },
    {
      type: "paragraph",
      content: "I also heard a phone-snatching story from Nicholas. He was waiting for an Uber in Ilha Grande around 9 PM, opened his phone to check the remaining time, someone pushed him and stole it, and the Uber never came. Maybe the Uber was unrelated, maybe not, but the lesson was clear. Rio and nearby tourist routes are beautiful, but you cannot be careless with your phone, especially at night."
    },
    {
      type: "carousel",
      images: [
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/bot1.jpeg",
          alt: "Botanical Garden visit."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/bot2.jpeg",
          alt: "Inside the garden."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/bot3.jpeg",
          alt: "Garden walkway / greenery."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/bot4.jpeg",
          alt: "More Botanical Garden photos."
        }
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "Leaving Rio"
    },
    {
      type: "paragraph",
      content: "The next morning I woke up, packed, and left the hostel around 11. Before leaving, I did one last round near Ipanema and bought a few souvenirs."
    },
    {
      type: "paragraph",
      content: "The return journey was again long, with all window seats, all long flights, and almost thirty hours of travel. Rajeev sir and I did not have the same first flight, but we connected later."
    },
    {
      type: "paragraph",
      content: "Reaching Delhi airport felt like a fresh breeze. I had breakfast at Haldiram's and then took a cab to Kashmere Gate, barely catching the bus back to NIT Jalandhar."
    },
    {
      type: "carousel",
      images: [
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/final1.jpeg",
          alt: "Leaving Rio / return journey."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/final2.jpeg",
          alt: "Flight back home."
        },
        {
          src: "https://artifacts.rishia.in/blurbs/iclr-2026-rio-de-janeiro/final3.jpeg",
          alt: "Back in India."
        }
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "Things I Wish I Knew Before Going"
    },
    {
      type: "paragraph",
      content: "These are not universal truths, just things that would have helped me."
    },
    {
      type: "list",
      items: [
        "Turn on international roaming and SMS before leaving India. Card OTPs matter. Without them, even Uber can become difficult.",
        "Carry some small cash in local currency if possible. Big notes are hard to break, and small transport payments become awkward.",
        "Do not depend only on Uber. Rio is large, and repeated Uber rides from Ipanema to Riocentro become expensive.",
        "Learn the public-transport payment system early. Rio uses Jaé for municipal transport, and BRT/VLT style systems may not accept cash. Normal bus payment rules were changing while I was there, so check the latest official guidance before your trip.",
        "Use Moovit or a similar app for buses, but still verify direction manually. The same bus number in the wrong direction can waste a lot of time.",
        "Wave at buses clearly. In my experience, they do not always stop automatically.",
        "Learn basic Portuguese food words. `frango` is chicken, `ovo` is egg, `queijo` is cheese, `porco` is pork, `presunto` is ham, and `carne` often means meat or beef depending on context.",
        "If you avoid beef or pork, plan meals ahead. Chicken and egg options exist, but you may need to search.",
        "Rio gets dark early around April. Treat sunset as a real planning boundary.",
        "Keep your phone secure in public, especially while waiting for rides or standing near roads at night.",
        "For tourist places, book official tickets when possible. Christ the Redeemer and Sugarloaf are worth planning properly.",
        "Conference travel is not only about talks and posters. The people you meet in airports, buses, hostels, and food lines become part of the experience."
      ]
    },
    {
      type: "heading",
      level: 2,
      content: "Useful Links"
    },
    {
      type: "linkEmbed",
      title: "ICLR 2026 official site",
      content: "https://iclr.cc/",
      description: "conference information, venue, schedule, and official pages."
    },
    {
      type: "linkEmbed",
      title: "ICLR 2026 review-process statistics",
      content: "https://blog.iclr.cc/2026/03/31/a-retrospective-on-the-iclr-2026-review-process/",
      description: "official submission and acceptance numbers."
    },
    {
      type: "linkEmbed",
      title: "Rio City Hall transport updates",
      content: "https://en.prefeitura.rio/noticias/prefeitura-do-rio-detalha-mudancas-no-pagamento-dos-onibus-e-na-integracao-do-bilhete-unico-carioca/",
      description: "useful for checking Jaé and bus payment changes."
    },
    {
      type: "linkEmbed",
      title: "Trem do Corcovado official site",
      content: "https://www.tremdocorcovado.rio/",
      description: "official train route for Christ the Redeemer."
    },
    {
      type: "linkEmbed",
      title: "Sugarloaf / Bondinho official ticket page",
      content: "https://bondinho.com.br/en/ingresso-bondinho",
      description: "official cable car ticket and route information."
    },
    {
      type: "linkEmbed",
      title: "ICLR 2026 affiliation analysis project",
      content: "https://github.com/DmytroLopushanskyy/iclr2026-affiliations",
      description: "community analysis of accepted-paper affiliations; useful context, but not official ICLR statistics."
    },
    {
      type: "heading",
      level: 2,
      content: "Final Thought"
    },
    {
      type: "paragraph",
      content: "This trip was chaotic, expensive in unexpected places, confusing because of language and transport, and tiring because of the long flights. But it was also one of the most valuable experiences I have had."
    },
    {
      type: "paragraph",
      content: "I went from forgetting my poster in India to presenting at ICLR in Brazil. I learned how to move around Rio by making mistakes. I met researchers, students, booth people, travelers, and strangers who helped me when they did not have to. I saw Christ the Redeemer, watched the sunset from Sugarloaf, and wrote NITJ on a board at one of the biggest ML conferences in the world."
    },
    {
      type: "paragraph",
      content: "That combination is hard to summarize cleanly. Maybe that is why the raw notes were messy in the first place."
    }
  ]
}
];

// Process blurb posts to calculate read time automatically
export const processedBlurbPosts: BlurbPost[] = rawBlurbPosts.map((post: BlurbPost) => ({
  ...post,
  readTime: post.readTime || calculateReadTime(post.content)
}));

// Export processed posts as main export
export const blurbPosts = processedBlurbPosts;

// Helper function to get a blurb post by slug with calculated read time
export function getBlurbPostBySlug(slug: string): BlurbPost | undefined {
  return processedBlurbPosts.find(post => post.slug === slug);
}

// Helper function to get all published blurb posts with calculated read time
export function getPublishedBlurbPosts(): BlurbPost[] {
  return processedBlurbPosts.filter(post => post.status === 'published');
}
