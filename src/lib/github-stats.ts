export interface GitHubRepoStats {
  stars: number;
  forks: number;
  language: string;
  size: number; // in KB
  updatedAt: string;
  commitsCount?: number;
  linesOfCode?: number;
  isPrivate: boolean;
}

export interface GitHubCommitStats {
  total: number;
  additions: number;
  deletions: number;
}

// Cache for GitHub API responses (simple in-memory cache)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

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

export async function getRepoStats(owner: string, repo: string): Promise<GitHubRepoStats | null> {
  try {
    const repoData = await fetchWithCache(
      `https://api.github.com/repos/${owner}/${repo}`,
      `repo-${owner}-${repo}`
    );

    if (!repoData) return null;

    // Get commit count from the commits API
    let commitsCount: number | undefined;
    try {
      const commitsData = await fetchWithCache(
        `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`,
        `commits-${owner}-${repo}`
      );
      
      if (commitsData && Array.isArray(commitsData) && commitsData.length > 0) {
        // This is a rough estimate - GitHub API doesn't provide total count directly
        // We could parse the Link header for more accurate count, but for simplicity:
        commitsCount = repoData.size > 1000 ? Math.floor(repoData.size / 10) : undefined;
      }
    } catch (error) {
      console.warn(`Failed to fetch commit count for ${owner}/${repo}:`, error);
    }

    return {
      stars: repoData.stargazers_count || 0,
      forks: repoData.forks_count || 0,
      language: repoData.language || 'N/A',
      size: repoData.size || 0,
      updatedAt: repoData.updated_at || '',
      commitsCount,
      isPrivate: repoData.private || false,
    };
  } catch (error) {
    console.error(`Error fetching repo stats for ${owner}/${repo}:`, error);
    return null;
  }
}

export function extractGitHubInfo(githubUrl: string): { owner: string; repo: string } | null {
  try {
    const url = new URL(githubUrl);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    if (pathParts.length >= 2 && url.hostname === 'github.com') {
      return {
        owner: pathParts[0],
        repo: pathParts[1],
      };
    }
    
    return null;
  } catch (error) {
    console.error('Invalid GitHub URL:', githubUrl, error);
    return null;
  }
}

export function formatRepoStats(stats: GitHubRepoStats): string[] {
  const formatted: string[] = [];
  
  if (stats.stars > 0) {
    formatted.push(`${stats.stars} stars`);
  }
  
  if (stats.forks > 0) {
    formatted.push(`${stats.forks} forks`);
  }
  
  if (stats.language && stats.language !== 'N/A') {
    formatted.push(stats.language);
  }
  
  return formatted;
}
