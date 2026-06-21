/** Map an on-site path to a graph node id when we know the route shape. */
export function pathToNodeId(path: string): string | null {
  const normalized = path.replace(/^https?:\/\/rishia\.in/, '').split('?')[0].split('#')[0];
  if (!normalized || normalized === '/') return 'page-home';

  const segments = normalized.replace(/^\//, '').split('/').filter(Boolean);
  if (segments.length === 0) return 'page-home';

  const [section, slug] = segments;
  switch (section) {
    case 'projects':
      return slug ? `project-${slug}` : null;
    case 'rsh':
      return slug ? `research-${slug}` : null;
    case 'blurb':
      return slug ? `blurb-${slug}` : null;
    case 'blogs':
      return slug ? `blog-${slug}` : null;
    case 'uncompiled':
      return slug ? `uncompiled-${slug}` : null;
    case 'ledger':
      return 'page-ledger';
    case 'gallery':
      return 'page-gallery';
    case 'community':
      return 'page-community';
    case 'links':
      return 'page-links';
    default:
      return null;
  }
}
