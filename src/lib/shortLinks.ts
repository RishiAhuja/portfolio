import { LINKS } from './constants';
import type { OgRedirectOptions } from './socialRedirect';

type ShortLink = Omit<OgRedirectOptions, 'destination'> & {
  destination: string;
};

export const SHORT_LINKS = {
  linkedin: {
    destination: LINKS.LINKEDIN,
    title: 'LinkedIn · Rishi Ahuja',
    description:
      'Connect with Rishi Ahuja — AI researcher & engineer working on trustworthy systems.',
    ogTitle: 'LinkedIn',
    ogDescription: 'Professional profile · AI research & engineering',
    type: 'linkedin',
  },
  youtube: {
    destination: LINKS.YOUTUBE,
    title: 'YouTube · Rishi Ahuja',
    description: 'Talks, demos, and builds from Rishi Ahuja.',
    ogTitle: 'YouTube',
    ogDescription: 'Talks, demos, and builds',
    type: 'youtube',
  },
  github: {
    destination: LINKS.GITHUB,
    title: 'GitHub · Rishi Ahuja',
    description: 'Open-source projects and research code by Rishi Ahuja.',
    ogTitle: 'GitHub',
    ogDescription: 'Code, projects, and experiments',
    type: 'github',
  },
  instagram: {
    destination: LINKS.INSTAGRAM,
    title: 'Instagram · Rishi Ahuja',
    description: 'Visual updates from Rishi Ahuja.',
    ogTitle: 'Instagram',
    ogDescription: 'Visual updates & moments',
    type: 'instagram',
  },
  calendar: {
    destination: LINKS.CAL_COM,
    title: 'Book a call · Rishi Ahuja',
    description: 'Schedule a 30-minute conversation with Rishi Ahuja.',
    ogTitle: 'Book a call',
    ogDescription: '30 minutes · cal.com/rishi2220',
    type: 'calendar',
  },
  resume: {
    destination: LINKS.RESUME_FALLBACK,
    title: 'Resume · Rishi Ahuja',
    description:
      'Latest resume — AI researcher & engineer focused on trustworthy systems.',
    ogTitle: 'Resume',
    ogDescription: 'AI research · engineering · selected experience',
    type: 'resume',
  },
  researchResume: {
    destination: LINKS.RESEARCH_RESUME_FALLBACK,
    title: 'Research Resume · Rishi Ahuja',
    description:
      'Latest research CV — papers, academic work, and selected experience.',
    ogTitle: 'Research Resume',
    ogDescription: 'Academic CV · papers · selected experience',
    type: 'resume',
  },
} as const satisfies Record<string, ShortLink>;
