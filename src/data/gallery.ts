// Gallery data structure
export interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: 'personal' | 'work' | 'travel' | 'tech' | 'moments';
  date: string;
  tags: string[];
  location?: string;
  camera?: string;
  settings?: {
    aperture?: string;
    shutter?: string;
    iso?: string;
  };
}

export interface GalleryCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const galleryCategories: GalleryCategory[] = [
  {
    id: 'personal',
    name: 'Personal',
    description: 'Life moments and personal photography',
    icon: '',
    color: 'accent'
  },
  {
    id: 'work',
    name: 'Work',
    description: 'Professional projects and workspace',
    icon: '',
    color: 'accent-light'
  },
  {
    id: 'travel',
    name: 'Travel',
    description: 'Adventures and places explored',
    icon: '',
    color: 'accent-dark'
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Development setups and tech moments',
    icon: '',
    color: 'accent'
  },
  {
    id: 'moments',
    name: 'Moments',
    description: 'Special memories and experiences',
    icon: '',
    color: 'accent-light'
  }
];

// Sample data - you can add your actual images here
export const galleryImages: GalleryImage[] = [
  {
    id: '1',
    title: 'Development Setup',
    description: 'My current development environment setup',
    imageUrl: '/gallery/setup-1.jpg',
    category: 'tech',
    date: '2024-12-15',
    tags: ['setup', 'coding', 'workspace'],
    location: 'Home Office',
    camera: 'iPhone 15 Pro'
  },
  {
    id: '2',
    title: 'Project Launch Day',
    description: 'Celebrating the launch of a major project',
    imageUrl: '/gallery/launch-1.jpg',
    category: 'work',
    date: '2024-11-20',
    tags: ['project', 'launch', 'celebration'],
    location: 'Office'
  },
  // Add more images as needed
];
