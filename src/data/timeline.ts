// Timeline Events Data
export interface TimelineEvent {
  date: string;
  title: string;
  type: 'project' | 'blog' | 'achievement' | 'internship' | 'community';
  description: string;
  link?: string;
  status?: 'ongoing' | 'completed';
  year: string;
  journeySlug?: string; // Link to journey post if exists (displays as "Read Blurb")
  gallerySlug?: string; // Link to gallery event if exists (displays as "View Artifacts")
  buttons?: {
    label: string;
    link: string;
    icon: 'github' | 'demo' | 'blog' | 'certificate' | 'video' | 'docs' | 'download' | 'external';
  }[];
}

export const timelineData: Record<string, TimelineEvent[]> = {
  '2025-26': [
    {
      date: '13 Dec 2025',
      title: '1st Place Winner: AWS Partner Track @ HackCBS 8.0',
      type: 'achievement',
      description: 'Won 1st place in the AWS Partner Track at HackCBS 8.0 with Swasya.AI. Built a hybrid serverless architecture using EC2 (Dockerized FastAPI), Lambda (SAM), S3 triggers, DynamoDB, AWS Transcribe, Textract, and real-time updates via IoT Core (MQTT).',
      year: '2025-26',
      gallerySlug: 'hackcbs-8',
      buttons: [
        {
          label: 'Devfolio',
          link: 'https://devfolio.co/projects/swasya-ai-bf6e',
          icon: 'external'
        },
        {
          label: 'HackCBS',
          link: 'https://hackcbs.tech/',
          icon: 'external'
        }
      ]
    },
    {
      date: '15 Nov 2025',
      title: 'SMX Tour - Chandigarh',
      type: 'community',
      description: 'Attended the Seedhe Maut SMX Tour in Chandigarh. Witnessed the raw energy of the duo live—jumping into the moshpit and screaming lyrics with thousands of fans was an unmatched experience.',
      year: '2025-26',
      gallerySlug: 'smx',
      buttons: [
        {
          label: 'Spotify', 
          link: 'https://open.spotify.com/artist/2oBG74gAocPMFv6Ij9ykdo?si=-BooK2k5St-woUhw3O7Csw',
          icon: 'external' 
        }
      ]
    },
    {
      date: '10 Nov 2025',
      title: '1st Place Winner: Qyrus Track @ HackCBS 8.0',
      type: 'achievement',
      description: 'Secured First Place in the qAPI by Qyrus sponsor track at the HackCBS 8.0 hackathon in Delhi. Our project, Swasya.AI, was awarded the top prize (Ray-Ban Meta smart glasses) by the Qyrus leadership team.',
      year: '2025-26', 
      buttons: [
        {
          label: 'View Sponsor (Qyrus)',
          link: 'https://qyrus.com/',
          icon: 'external'
        },
        {
          label: 'View HackCBS',
          link: 'https://hackcbs.tech/',
          icon: 'external'
        }
      ]
    },
    {
      date: '3 Nov 2025',
      title: 'Product Presentation to GOI & MeitY Delegation',
      type: 'community',
      description: 'Presented our Agri-Tech innovations to a high-level delegation in a 4-hour strategic meeting and luncheon. The audience included the Chief AI Officer (Ministry of Agriculture), the Director of IIT Ropar, officials from the Ministry of Education, and leadership from MeitY.',
      year: '2025-26', 
      gallerySlug: 'goi-meity-delegation',
      buttons: [
        {
          label: 'View Post (MeitY)',
          link: 'https://www.linkedin.com/posts/nicmeity_artificialintelligence-agriculture-nicmeity-activity-7391430381838721024-JoFY/',
          icon: 'external'
        },
        {
          label: 'View Post (Annam AI)',
          link: 'https://www.linkedin.com/posts/annam-ai_iitropar-annamai-agritech-activity-7391777407919214592-TGyh/',
          icon: 'external'
        }
      ]
    },
    {
      date: '17 Oct 2025',
      title: 'Started Entrepreneur-in-Residence (EIR)',
      type: 'community',
      description: 'Began role as an Entrepreneur-in-Residence at iHub AwaDH, IIT Ropar, supporting and mentoring technology startups.',
      link: 'https://ihub-awadh.in/',
      status: 'ongoing',
      year: '2025-26', 
      buttons: [
        {
          label: 'Visit iHub AwaDH',
          link: 'https://ihub-awadh.in/',
          icon: 'external'
        }
      ]
    },
    {
      date: '6 Sept 2025',
      title: 'Bit N Build Punjab Mentor',
      type: 'community',
      description: 'Invited as a mentor for the Bit n Build Punjab Round hackathon at Thapar University, Patiala. Guided and advised over 30 participating teams during the event held on September 6, 2025, which hosted 120+ participants in collaboration with Genesoc Society.',
      year: '2025-26',
      gallerySlug: 'bit-n-build-punjab',
      buttons: [
        { label: 'View Event Details', link: 'https://www.openlearn.org.in/events/hackathon-1', icon: 'external' }
      ]
    },
    {
      date: '25 Aug 2025',
      title: 'You Don\'t Know WebSockets. Yet.',
      type: 'blog',
      description: 'Deep dive technical blog exploring WebSocket protocol, real-time communication patterns, and bidirectional data flow in modern web applications.',
      year: '2025-26',
      buttons: [
        { label: 'Read Blog', link: '/blogs/you-dont-know-websockets-yet', icon: 'blog' }
      ]
    },
    {
      date: '3 Aug 2025',
      title: 'Go Beneath the Abstraction: Building Interactive UIs with FernKit',
      type: 'blog',
      description: 'Technical deep dive into FernKit UI toolkit, exploring low-level rendering, widget systems, and building UIs from scratch with C++.',
      year: '2025-26',
      buttons: [
        { label: 'Read Blog', link: '/blogs/go-beneath-the-abstraction-building-interactive-uis-with-fernkit', icon: 'blog' }
      ]
    },
  ],
  '2024-25': [
    {
      date: '10 Jul 2025',
      title: 'Mess ERP with 6-way Infrastructure',
      type: 'project',
      description: 'Currently developing comprehensive ERP system for NITJ with 6-way infrastructure, targeting 5000+ users for mess management and operations.',
      status: 'ongoing',
      year: '2025-26',
    },
    {
      date: '5 July 2025',
      title: 'Shamir\'s Secret Sharing Scheme and Multi Party Computation.',
      type: 'blog',
      description: 'Mathematical Blog (21 min read) exploring Shamir\'s Secret Sharing Scheme and Multi Party Computation for private key management.',
      year: '2025-26',
      buttons: [
        { label: 'Read Blog', link: '/blogs/shamirs-secret-sharing-scheme-and-multi-party-computation', icon: 'blog' }
      ]
    },
    {
      date: '14 Jun 2025',
      title: 'Your Hardest "Hello World!": Text Rasterization #1',
      type: 'blog',
      description: 'Deep technical blog (32 min read) exploring TTF file format and text rendering fundamentals.',
      year: '2024-25',
      buttons: [
        { label: 'Read Blog', link: '/blogs/your-hardest-hello-world-text-rasterization-1', icon: 'blog' }
      ]
    },
    {
      date: '13 Jun 2025',
      title: 'OpenLearn - Educational Organization',
      type: 'community',
      description: 'Co-founded educational organization for teaching via blogs with cohorts, achieved 120+ active users.',
      year: '2024-25',
      journeySlug: 'openlearn',
      buttons: [
        { label: 'Read Story', link: '/journey/openlearn', icon: 'blog' },
        { label: 'GitHub', link: 'https://github.com/openlearnnitj', icon: 'github' },
        { label: 'Website', link: 'https://openlearn.org.in', icon: 'external' }
      ]
    },
    {
      date: '9 Jun 2025',
      title: 'Text Rasterization Tool',
      type: 'project',
      description: 'Low-level tool for understanding and processing TrueType Font (TTF) files and text rendering.',
      year: '2024-25',
      buttons: [
        { label: 'GitHub', link: 'https://github.com/rishiahuja/text-rasterization', icon: 'github' },
      ]
    },
    {
      date: '30 May 2025',
      title: 'Fern Graphics Library',
      type: 'project',
      description: '0-dependency C/C++ GUI creation library built from scratch, cross-platform with WebAssembly support.',
      year: '2024-25',
      journeySlug: 'fern',
      buttons: [
        { label: 'Read Story', link: '/journey/fern', icon: 'blog' },
        { label: 'GitHub', link: 'https://github.com/RishiAhuja/fern', icon: 'github' },
        { label: 'Docs', link: 'https://fern.rishia.in', icon: 'docs' }
      ]
    },
    {
      date: '29 May 2025',
      title: 'Annam AI Research Intern - IIT Ropar',
      type: 'internship',
      description: 'AI research internship at IIT Ropar focusing on agricultural technology and machine learning applications.',
      year: '2024-25',
      buttons: [
        { label: 'Company', link: 'http://annam.ai/', icon: 'external' }
      ]
    },
    {
      date: '21 May 2025',
      title: 'Portfolio Refresh',
      type: 'project',
      description: 'Complete redesign and modernization of personal portfolio with improved design and user experience.',
      year: '2024-25',
      buttons: [
        { label: 'GitHub', link: 'https://github.com/RishiAhuja/portfolio', icon: 'github' },
      ]
    },
    {
      date: '20 May 2025',
      title: 'Conduit HTTP Client',
      type: 'project',
      description: 'HTTP client for C written in pure C with no external dependencies, lightweight and efficient.',
      year: '2024-25',
      buttons: [
        { label: 'GitHub', link: 'https://github.com/RishiAhuja/conduit', icon: 'github' },
        { label: 'Documentation', link: 'https://conduit.rishia.in', icon: 'docs' }
      ]
    },
    {
      date: '19 May 2025',
      title: 'Datum Web3 Wallet',
      type: 'project',
      description: 'Web3-based wallet project (never completed) - exploration into blockchain and cryptocurrency technologies.',
      year: '2024-25',
      buttons: [
        { label: 'GitHub', link: 'https://github.com/RishiAhuja/datum', icon: 'github' }
      ]
    },
    {
      date: '13 May 2025',
      title: 'SUDO - Society of Unified Developers',
      type: 'community',
      description: 'Co-founded Society of Unified Developer and Operators, focusing on 0-dependency system programming tools.',
      year: '2024-25',
      buttons: [
        { label: 'GitHub', link: 'https://github.com/sudonitj', icon: 'github' },
      ]
    },
    {
      date: '4 May 2025',
      title: 'NeoPrismLabs UI Library',
      type: 'project',
      description: 'Neubrutalist UI library for Flutter (somewhat completed), providing bold design components with modern aesthetics.',
      year: '2024-25',
      buttons: [
        { label: 'GitHub', link: 'https://github.com/neoprismlabs', icon: 'github' },
        { label: 'Website', link: 'https://neoprismlabs.in', icon: 'external' }
      ]
    },
    {
      date: '10 Apr 2025',
      title: 'ESP32 Controller & Hardware Robo',
      type: 'project',
      description: 'IoT-based robot car for Robowar competitions with ESP32 controller and Flutter app for remote control.',
      year: '2024-25',
      buttons: [
        { label: 'GitHub', link: 'https://github.com/RishiAhuja/esp32-robowar-app', icon: 'github' },
      ]
    },
    {
      date: '4 Apr 2025',
      title: 'Stack Wealth Flutter Internship',
      type: 'internship',
      description: 'Flutter intern at YC S21 company, ranked #2 contributor with 50+ PRs merged for Athena app.',
      year: '2024-25',
      buttons: [
        { label: 'LOR', link: 'https://drive.google.com/file/d/12MZKpXLjgAQN3gtzB-0IFRipC4g-qtyO/view?usp=drive_link', icon: 'certificate' },
        { label: 'Tweet', link: 'https://x.com/archiexzzz/status/1919137769474929025', icon: 'external' }
      ]
    },
    {
      date: '1 Apr 2025',
      title: 'Bits of Trust: The Elegance of AES',
      type: 'blog',
      description: 'Technical blog (24 min read) exploring AES encryption algorithms and cryptographic implementations.',
      year: '2024-25',
      buttons: [
        { label: 'Read Blog', link: 'https://rishi2220.hashnode.dev/bits-of-trust-the-elegance-of-aes', icon: 'blog' }
      ]
    },
    {
      date: '29 Mar 2025',
      title: 'Axon AES Implementation',
      type: 'project',
      description: '0-dependency AES implementation tool in C with SIMD optimizations for high performance encryption.',
      year: '2024-25',
      buttons: [
        { label: 'GitHub', link: 'https://github.com/RishiAhuja/axon', icon: 'github' },
        { label: 'Release', link: 'https://github.com/RishiAhuja/axon/releases', icon: 'docs' }
      ]
    },
    {
      date: '10 Mar 2025',
      title: 'BarqScoot E-Scooter Platform',
      type: 'project',
      description: 'Freelancing project for Saudi Arabia-based e-scooter rental platform with real-time tracking and IoT integration.',
      year: '2024-25',
      buttons: [
        { label: 'GitHub', link: 'https://github.com/RishiAhuja/barqscoot', icon: 'github' },
      ]
    },
    {
      date: '27 Feb 2025',
      title: 'Building Rosenblatt\'s Perceptron From Scratch in Flutter',
      type: 'blog',
      description: 'Technical blog (24 min read) implementing classic machine learning perceptron algorithm in Flutter with visual explanations.',
      year: '2024-25',
      buttons: [
        { label: 'Read Blog', link: 'https://rishi2220.hashnode.dev/building-rosenblatts-perceptron-from-scratch-a-comprehensive-technical-deep-dive', icon: 'blog' }
      ]
    },
    {
      date: '24 Feb 2025',
      title: 'Perceptron Simulator',
      type: 'project',
      description: '0-dependency Flutter visualization for Rosenblatt Perceptrons, educational tool for understanding neural networks.',
      year: '2024-25',
      buttons: [
        { label: 'GitHub', link: 'https://github.com/RishiAhuja/perceptron', icon: 'github' },
        { label: 'Demo Video', link: 'https://youtu.be/V5WDkxi9qWg?si=CR3zSRFjn8wmRBRf', icon: 'external' },
      ]
    },
    {
      date: '20 Feb 2025',
      title: 'Numd - NumPy but in Dart',
      type: 'project',
      description: 'Rudimentary NumPy clone implemented in Dart, providing numerical computation capabilities for Flutter applications.',
      year: '2024-25',
      buttons: [
        { label: 'GitHub', link: 'https://github.com/RishiAhuja/numd', icon: 'github' },
        { label: 'Pub.dev', link: 'https://pub.dev/packages/numd', icon: 'external' }
      ]
    },
    {
      date: '15 Feb 2025',
      title: 'KisaanMithraa Agricultural Platform',
      type: 'project',
      description: 'Agricultural app developed under Annam AI initiative with IIT Ropar, featuring cooperative management and multilingual support.',
      year: '2024-25',
      buttons: [
        { label: 'GitHub', link: 'https://github.com/RishiAhuja/kisaanmithraa', icon: 'github' },
      ]
    },
    {
      date: '10 Feb 2025',
      title: 'FinGenie Social Score Management',
      type: 'project',
      description: 'AI-based social score management system developed as hackathon product, focusing on social credit algorithms.',
      year: '2024-25',
      buttons: [
        { label: 'GitHub', link: 'https://github.com/RishiAhuja/fingenie/', icon: 'github' },
      ]
    },
    {
      date: '25 Jan 2025',
      title: 'Level SuperMind Frontend Internship',
      type: 'internship',
      description: 'Frontend development internship using Next.js, working on religious services platform with agile methodology.',
      year: '2024-25',
      buttons: [
        { label: 'LOR', link: 'https://drive.google.com/file/d/1mWVdeaanniDgBbJE5a5gmxK5cgJhXm3y/view?usp=sharing', icon: 'certificate' }
      ]
    },
    {
      date: '19 Jan 2025',
      title: 'Level SuperMind National Hack - 2nd Place',
      type: 'achievement',
      description: 'Won 2nd place at national hackathon in Mumbai among 23,000+ participants with SoulBuddy AI project.',
      year: '2024-25',
      journeySlug: 'level-supermind-hackathon',
      gallerySlug: 'level-supermind-hack',
      buttons: [
        { label: 'Read Story', link: '/journey/level-supermind-hackathon', icon: 'blog' },
        { label: 'Tweet', link: 'https://x.com/Rishi2220/status/1881041863983169800', icon: 'certificate' },
        { label: 'Demo Video', link: 'https://youtu.be/AS8gnSInEF4?si=age9v2QcePFksNOU', icon: 'external' },
      ]
    },
    {
      date: '18 Jan 2025',
      title: 'SoulBuddy AI Spiritual Guide',
      type: 'project',
      description: '12-hour hackathon project creating AI-powered astrological guidance platform with personalized insights and predictions.',
      year: '2024-25',
      buttons: [
        { label: 'GitHub', link: 'https://github.com/RishiAhuja/SoulBuddy.ai', icon: 'github' },
      ]
    },
    {
      date: '9 Jan 2025',
      title: 'Nexus Tech Blogging Platform',
      type: 'project',
      description: 'Flutter web technical blogging platform with rich Markdown editing, user authentication, and clean architecture.',
      year: '2024-25',
      buttons: [
        { label: 'GitHub', link: 'https://github.com/RishiAhuja/nexus', icon: 'github' },
        { label: 'Live App', link: 'https://nexus.rishia.in', icon: 'demo' }
      ]
    },
    {
      date: '5 Jan 2025',
      title: 'Getting Cracked at Clean and BLoC Architecture',
      type: 'blog',
      description: 'Advanced Flutter architecture blog (22 min read) covering clean architecture principles and BLoC pattern implementation.',
      year: '2024-25',
      buttons: [
        { label: 'Read Blog', link: 'https://rishi2220.hashnode.dev/getting-cracked-at-clean-and-bloc-architecture', icon: 'blog' }
      ]
    },
    {
      date: '28 Dec 2024',
      title: 'Bit by Bit: C++',
      type: 'project',
      description: 'Comprehensive 150-page C++ programming guide covering fundamentals to advanced concepts with practical examples.',
      year: '2024-25',
      buttons: [
        { label: 'Download PDF', link: 'https://rishiahuja.gumroad.com/l/cpp', icon: 'download' },
      ]
    },
    {
      date: '13 Dec 2024',
      title: 'Getting Started at BLoC Architecture',
      type: 'blog',
      description: 'Beginner-friendly Flutter architecture blog (23 min read) introducing BLoC pattern with practical examples.',
      year: '2024-25',
      buttons: [
        { label: 'Read Blog', link: 'https://rishi2220.hashnode.dev/getting-started-at-bloc-architecture', icon: 'blog' }
      ]
    },
    {
      date: '8 Dec 2024',
      title: 'Flutter Spotify Clone',
      type: 'project',
      description: 'Full-featured music streaming app built with Flutter and BLoC pattern, implementing advanced audio controls and UI.',
      year: '2024-25',
      buttons: [
        { label: 'GitHub', link: 'https://github.com/RishiAhuja/flutter-spotify-clone/', icon: 'github' },
      ]
    },
    {
      date: '28 Nov 2024',
      title: 'GDSC NITJ Core Member',
      type: 'community',
      description: 'Became Core member (Mobile Dev) of Google Developer Student Club NITJ, organizing technical workshops.',
      year: '2024-25',
      buttons: [
        { label: 'Linkedin', link: 'https://www.linkedin.com/posts/rishi-ahuja-b1a224310_im-happy-to-share-that-im-starting-a-new-activity-7268339791119765505-4g-k?utm_source=share&utm_medium=member_desktop&rcm=ACoAAE8OG0YBW0x_VJWiL5Z6CLmHlpxAa8e5EXE', icon: 'external' }
      ]
    },
    {
      date: '1 Nov 2024',
      title: 'Resource Management with Probabilistic Scheduling in Linux',
      type: 'blog',
      description: 'Deep technical blog (33 min read) exploring Linux kernel scheduling mechanisms and resource management algorithms.',
      year: '2024-25',
      buttons: [
        { label: 'Read Blog', link: 'https://rishi2220.hashnode.dev/resource-management-with-probabilistic-scheduling-in-the-context-of-linux', icon: 'blog' }
      ]
    },
    {
      date: '28 Oct 2024',
      title: 'PEC × Prajna AI Hackathon - 3rd Place',
      type: 'achievement',
      description: 'Placed 3rd solo in hackathon among 60+ teams, developing IPQS (Intelligence PDF Querying System) with innovative AI implementation.',
      year: '2024-25',
      buttons: [
        { label: 'Linkedin', link: 'https://www.linkedin.com/posts/rishi-ahuja-b1a224310_i-recently-participated-in-my-first-18-hour-activity-7256694930364887042-BTQ4?utm_source=share&utm_medium=member_desktop&rcm=ACoAAE8OG0YBW0x_VJWiL5Z6CLmHlpxAa8e5EXE', icon: 'demo' }
      ]
    },
    {
      date: '19 Oct 2024',
      title: 'IPQS - Intelligence PDF Querying System',
      type: 'project',
      description: 'AI-powered document analysis system for intelligent PDF querying and information extraction using advanced NLP techniques.',
      year: '2024-25',
      buttons: [
        { label: 'GitHub', link: 'https://github.com/rishiahuja/ipqs', icon: 'github' },
        { label: 'Demo video', link: 'https://youtu.be/ydlOXu-8uQg?si=iXOu2GnT7aOmWtgN', icon: 'external' },
      ]
    },
    {
      date: '16 Sep 2024',
      title: 'Flutter Chat Application',
      type: 'project',
      description: 'Real-time messaging application built with Flutter, featuring modern chat interface and real-time communication.',
      year: '2024-25',
      buttons: [
        { label: 'GitHub', link: 'https://github.com/RishiAhuja/chat-app', icon: 'github' },
      ]
    },
    {
      date: '3 Sep 2024',
      title: 'State of the Art - ART (Android Runtime)',
      type: 'blog',
      description: 'Technical blog (6 min read) analyzing Android Runtime (ART) and its impact on app performance and development.',
      year: '2024-25',
      buttons: [
        { label: 'Read Blog', link: 'https://rishi2220.hashnode.dev/art', icon: 'blog' }
      ]
    },
    {
      date: '16 Aug 2024',
      title: 'Comprehensive Arch Linux Blog',
      type: 'blog',
      description: 'In-depth technical guide (26 min read) covering Arch Linux installation, configuration, and advanced system administration.',
      year: '2024-25',
      buttons: [
        { label: 'Read Blog', link: 'https://rishi2220.hashnode.dev/comprehensive-arch-linux-guide', icon: 'blog' }
      ]
    }
  ]
};
