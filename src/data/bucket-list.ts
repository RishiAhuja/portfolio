// Bucket list data structure
export interface BucketListItem {
  id: string;
  title: string;
  description: string;
  category: 'tech' | 'travel' | 'personal' | 'learning' | 'creative' | 'fitness';
  priority: 'high' | 'medium' | 'low';
  status: 'not-started' | 'in-progress' | 'completed' | 'paused';
  dateAdded: string;
  dateCompleted?: string;
  targetDate?: string;
  tags: string[];
  imageUrl?: string;
  progress?: number; // 0-100
  notes?: string;
  resources?: {
    title: string;
    url: string;
    type: 'link' | 'book' | 'course' | 'video';
  }[];
  milestones?: {
    id: string;
    title: string;
    completed: boolean;
    date?: string;
  }[];
}

export interface BucketListCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  count: number;
}

export const bucketListCategories: BucketListCategory[] = [
  {
    id: 'tech',
    name: 'Technology',
    description: 'Tech skills, projects, and innovations to explore',
    icon: '',
    color: 'accent',
    count: 0
  },
  {
    id: 'travel',
    name: 'Travel',
    description: 'Places to visit and adventures to experience',
    icon: '',
    color: 'accent-light',
    count: 0
  },
  {
    id: 'learning',
    name: 'Learning',
    description: 'Skills, courses, and knowledge to acquire',
    icon: '',
    color: 'accent-dark',
    count: 0
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Artistic projects and creative endeavors',
    icon: '',
    color: 'accent',
    count: 0
  },
  {
    id: 'personal',
    name: 'Personal',
    description: 'Personal goals and life achievements',
    icon: '',
    color: 'accent-light',
    count: 0
  },
  {
    id: 'fitness',
    name: 'Fitness',
    description: 'Health and fitness goals',
    icon: '',
    color: 'accent-dark',
    count: 0
  }
];

// Sample bucket list data
export const bucketListItems: BucketListItem[] = [
  {
    id: '1',
    title: 'Build a Full-Stack AI Application',
    description: 'Create a comprehensive AI-powered application using modern tech stack',
    category: 'tech',
    priority: 'high',
    status: 'in-progress',
    dateAdded: '2024-01-15',
    targetDate: '2025-06-01',
    tags: ['AI', 'Full-Stack', 'Machine Learning', 'React'],
    progress: 35,
    milestones: [
      { id: 'm1', title: 'Research and Planning', completed: true, date: '2024-02-01' },
      { id: 'm2', title: 'Backend API Development', completed: true, date: '2024-03-15' },
      { id: 'm3', title: 'Frontend Development', completed: false },
      { id: 'm4', title: 'AI Model Integration', completed: false },
      { id: 'm5', title: 'Testing and Deployment', completed: false }
    ],
    resources: [
      { title: 'OpenAI API Documentation', url: 'https://openai.com/api', type: 'link' },
      { title: 'Full Stack Development Course', url: '#', type: 'course' }
    ]
  },
  {
    id: '2',
    title: 'Visit Japan for Cherry Blossom Season',
    description: 'Experience the beauty of sakura season in Japan, visit Tokyo, Kyoto, and Osaka',
    category: 'travel',
    priority: 'high',
    status: 'not-started',
    dateAdded: '2024-02-10',
    targetDate: '2025-04-01',
    tags: ['Japan', 'Cherry Blossom', 'Culture', 'Photography'],
    progress: 0,
    milestones: [
      { id: 'm1', title: 'Save for trip', completed: false },
      { id: 'm2', title: 'Book flights', completed: false },
      { id: 'm3', title: 'Plan itinerary', completed: false },
      { id: 'm4', title: 'Learn basic Japanese', completed: false }
    ]
  },
  {
    id: '3',
    title: 'Learn Advanced TypeScript Patterns',
    description: 'Master advanced TypeScript concepts, design patterns, and best practices',
    category: 'learning',
    priority: 'medium',
    status: 'in-progress',
    dateAdded: '2024-01-20',
    tags: ['TypeScript', 'Design Patterns', 'Programming'],
    progress: 60,
    milestones: [
      { id: 'm1', title: 'Advanced Types', completed: true, date: '2024-02-15' },
      { id: 'm2', title: 'Generics & Utility Types', completed: true, date: '2024-03-01' },
      { id: 'm3', title: 'Design Patterns Implementation', completed: false },
      { id: 'm4', title: 'Build a Complex Project', completed: false }
    ]
  },
  {
    id: '4',
    title: 'Create a YouTube Tech Channel',
    description: 'Start a YouTube channel focused on web development tutorials and tech insights',
    category: 'creative',
    priority: 'medium',
    status: 'not-started',
    dateAdded: '2024-03-01',
    targetDate: '2025-01-01',
    tags: ['YouTube', 'Content Creation', 'Teaching', 'Tech'],
    progress: 0,
    milestones: [
      { id: 'm1', title: 'Channel Setup', completed: false },
      { id: 'm2', title: 'Create First 5 Videos', completed: false },
      { id: 'm3', title: 'Reach 100 Subscribers', completed: false },
      { id: 'm4', title: 'Establish Regular Schedule', completed: false }
    ]
  },
  {
    id: '5',
    title: 'Run a Half Marathon',
    description: 'Train for and complete a half marathon (21.1 km) race',
    category: 'fitness',
    priority: 'medium',
    status: 'not-started',
    dateAdded: '2024-02-20',
    targetDate: '2025-10-01',
    tags: ['Running', 'Fitness', 'Endurance', 'Health'],
    progress: 0,
    milestones: [
      { id: 'm1', title: 'Create Training Plan', completed: false },
      { id: 'm2', title: 'Run 5K consistently', completed: false },
      { id: 'm3', title: 'Run 10K', completed: false },
      { id: 'm4', title: 'Complete Half Marathon', completed: false }
    ]
  },
  {
    id: '6',
    title: 'Contribute to Major Open Source Project',
    description: 'Make meaningful contributions to a popular open source project',
    category: 'tech',
    priority: 'high',
    status: 'not-started',
    dateAdded: '2024-01-10',
    tags: ['Open Source', 'Contribution', 'Community', 'Git'],
    progress: 0,
    milestones: [
      { id: 'm1', title: 'Choose Project', completed: false },
      { id: 'm2', title: 'Understand Codebase', completed: false },
      { id: 'm3', title: 'First Small PR', completed: false },
      { id: 'm4', title: 'Major Feature Contribution', completed: false }
    ]
  }
];
