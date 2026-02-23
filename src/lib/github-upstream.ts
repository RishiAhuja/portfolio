export interface GitHubPR {
  id: number;
  title: string;
  url: string;
  repo: string;
  state: 'open' | 'closed' | 'merged';
  createdAt: string;
  mergedAt?: string;
  number: number;
}

export interface GitHubIssue {
  id: number;
  title: string;
  url: string;
  repo: string;
  state: 'open' | 'closed';
  createdAt: string;
  number: number;
}

export interface UpstreamOverride {
  pr_url: string;
  visible: boolean;
  state_override: 'open' | 'closed' | 'merged' | null;
  title_override: string | null;
  notes: string | null;
}

interface GitHubSearchItem {
  id: number;
  title: string;
  html_url: string;
  repository_url: string;
  state: string;
  created_at: string;
  pull_request?: {
    url: string;
    html_url: string;
    diff_url: string;
    patch_url: string;
    merged_at: string | null;
  };
  number: number;
}

const GITHUB_USERNAME = 'RishiAhuja';

// Cache for GitHub API responses
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

async function fetchWithCache(url: string, cacheKey: string): Promise<any> {
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-Website',
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        console.warn('GitHub API rate limit exceeded');
        return null;
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.warn(`Failed to fetch GitHub data for ${url}:`, error);
    return null;
  }
}

function extractRepoName(repoUrl: string): string {
  const parts = repoUrl.split('/');
  return `${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
}

export async function fetchUserPRs(): Promise<GitHubPR[]> {
  try {
    // Search for all PRs authored by the user
    const searchUrl = `https://api.github.com/search/issues?q=author:${GITHUB_USERNAME}+type:pr&sort=created&order=desc&per_page=50`;
    const searchData = await fetchWithCache(searchUrl, `prs-${GITHUB_USERNAME}`);

    if (!searchData || !searchData.items) {
      return [];
    }

    const prs: GitHubPR[] = searchData.items
      .filter((item: GitHubSearchItem) => {
        // Only include PRs from repos the user doesn't own
        const repoName = extractRepoName(item.repository_url);
        return !repoName.toLowerCase().includes(GITHUB_USERNAME.toLowerCase());
      })
      .map((item: GitHubSearchItem) => ({
        id: item.id,
        title: item.title,
        url: item.html_url,
        repo: extractRepoName(item.repository_url),
        state: item.pull_request?.merged_at ? 'merged' : item.state as 'open' | 'closed',
        createdAt: item.created_at,
        mergedAt: item.pull_request?.merged_at ?? undefined,
        number: item.number,
      }));

    return prs;
  } catch (error) {
    console.error('Error fetching GitHub PRs:', error);
    return [];
  }
}

export async function fetchUserIssues(): Promise<GitHubIssue[]> {
  try {
    // Search for issues authored by the user (excluding PRs)
    const searchUrl = `https://api.github.com/search/issues?q=author:${GITHUB_USERNAME}+type:issue&sort=created&order=desc&per_page=30`;
    const searchData = await fetchWithCache(searchUrl, `issues-${GITHUB_USERNAME}`);

    if (!searchData || !searchData.items) {
      return [];
    }

    const issues: GitHubIssue[] = searchData.items
      .filter((item: GitHubSearchItem) => {
        // Only include issues from repos the user doesn't own
        const repoName = extractRepoName(item.repository_url);
        return !repoName.toLowerCase().includes(GITHUB_USERNAME.toLowerCase()) && !item.pull_request;
      })
      .map((item: GitHubSearchItem) => ({
        id: item.id,
        title: item.title,
        url: item.html_url,
        repo: extractRepoName(item.repository_url),
        state: item.state as 'open' | 'closed',
        createdAt: item.created_at,
        number: item.number,
      }));

    return issues;
  } catch (error) {
    console.error('Error fetching GitHub issues:', error);
    return [];
  }
}

export async function fetchUpstreamOverrides(): Promise<Map<string, UpstreamOverride>> {
  try {
    const { supabase } = await import('./supabase');
    const { data, error } = await supabase
      .from('upstream_overrides')
      .select('pr_url, visible, state_override, title_override, notes');

    if (error || !data) return new Map();

    const map = new Map<string, UpstreamOverride>();
    for (const row of data) {
      map.set(row.pr_url, row as UpstreamOverride);
    }
    return map;
  } catch {
    return new Map();
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}
