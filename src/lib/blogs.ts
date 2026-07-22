import { getCollection, type CollectionEntry } from 'astro:content';
import { formatPostDate } from './hashnode';

export type BlogEntry = CollectionEntry<'blogs'>;

export interface BlogListItem {
  slug: string;
  title: string;
  brief: string;
  dateAdded: string;
  dateLabel: string;
  hashnodeUrl: string;
  readTimeInMinutes: number;
  href: string;
}

export const getBlogEntries = async (): Promise<BlogEntry[]> => {
  const blogs = await getCollection('blogs');
  return blogs.sort(
    (a, b) => b.data.dateAdded.getTime() - a.data.dateAdded.getTime(),
  );
};

export const toBlogListItem = (entry: BlogEntry): BlogListItem => {
  const dateAdded = entry.data.dateAdded.toISOString();
  return {
    slug: entry.slug,
    title: entry.data.title,
    brief: entry.data.brief,
    dateAdded,
    dateLabel: formatPostDate(dateAdded),
    hashnodeUrl: entry.data.hashnodeUrl,
    readTimeInMinutes: entry.data.readTimeInMinutes,
    href: `/blogs/${entry.slug}`,
  };
};

export const getBlogListItems = async (): Promise<BlogListItem[]> => {
  const entries = await getBlogEntries();
  return entries.map(toBlogListItem);
};
