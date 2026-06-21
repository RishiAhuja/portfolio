export type ContentNodeType =
  | 'project'
  | 'research'
  | 'blurb'
  | 'blog'
  | 'timeline'
  | 'uncompiled'
  | 'page';

export type GraphLinkKind = 'semantic' | 'structural' | 'tag' | 'cohort';

export interface ContentChunk {
  id: string;
  type: ContentNodeType;
  title: string;
  url: string;
  text: string;
  tags?: string[];
  projectId?: string;
  eventId?: string;
  blurbSlug?: string;
  year?: string;
  category?: string;
  /** Resolved node ids from explicit internal links */
  linkedIds?: string[];
}

export interface GraphNode {
  id: string;
  type: ContentNodeType;
  title: string;
  url: string;
  snippet: string;
  tags?: string[];
}

export interface GraphLink {
  source: string;
  target: string;
  weight: number;
  kind: GraphLinkKind;
}

export interface GraphData {
  generatedAt: string;
  embeddingModel?: string;
  usedChroma: boolean;
  nodes: GraphNode[];
  links: GraphLink[];
}
