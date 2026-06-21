'use client';

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { GraphData, GraphLink, GraphNode, ContentNodeType } from '../lib/graph/types';

const TYPE_COLORS: Record<ContentNodeType, string> = {
  project: '#64b2bc',
  research: '#c9a227',
  blurb: '#8ecfd6',
  blog: '#7aa2f7',
  timeline: '#bb9af7',
  uncompiled: '#f7768e',
  page: '#6a6a6a',
};

const KIND_LABELS: Record<GraphLink['kind'], string> = {
  structural: 'Explicit',
  semantic: 'Related',
  tag: 'Tag',
  cohort: 'Shared blurb',
};

const KIND_ORDER: Record<GraphLink['kind'], number> = {
  structural: 0,
  cohort: 1,
  semantic: 2,
  tag: 3,
};
const TYPE_LABELS: Record<ContentNodeType, string> = {
  project: 'Project',
  research: 'Research',
  blurb: 'Blurb',
  blog: 'Blog',
  timeline: 'Timeline',
  uncompiled: 'Uncompiled',
  page: 'Page',
};

type GraphLinkRuntime = GraphLink & {
  source: string | GraphNode;
  target: string | GraphNode;
};

type ForceGraphHandle = {
  zoom: (level?: number, durationMs?: number) => number;
  zoomToFit: (durationMs?: number, padding?: number) => void;
  centerAt: (x?: number, y?: number, durationMs?: number) => void;
  d3Force: (name: string, force?: unknown) => unknown;
};

function nodeId(value: string | GraphNode): string {
  return typeof value === 'object' ? value.id : value;
}

function nodeRadius(type: ContentNodeType): number {
  return type === 'page' ? 2 : type === 'timeline' ? 2.5 : 3;
}

const ContentGraphView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<ForceGraphHandle | null>(null);
  const [ForceGraph2D, setForceGraph2D] = useState<React.ComponentType<Record<string, unknown>> | null>(null);
  const [graph, setGraph] = useState<GraphData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [hovered, setHovered] = useState<GraphNode | null>(null);
  const [query, setQuery] = useState('');
  const [activeTypes, setActiveTypes] = useState<Set<ContentNodeType>>(
    () => new Set((Object.keys(TYPE_COLORS) as ContentNodeType[]).filter((type) => type !== 'page')),
  );
  const [size, setSize] = useState({ width: 0, height: 0 });
  const fitPadding = 90;

  useEffect(() => {
    import('react-force-graph-2d').then((mod) => {
      setForceGraph2D(() => mod.default as React.ComponentType<Record<string, unknown>>);
    });
  }, []);

  useEffect(() => {
    fetch('/graph/data.json')
      .then((res) => {
        if (!res.ok) throw new Error('Graph data not found');
        return res.json() as Promise<GraphData>;
      })
      .then(setGraph)
      .catch((err: Error) => setError(err.message));
  }, []);

  const measureContainer = useCallback(() => {
    const element = containerRef.current;
    if (!element) return;

    const width = Math.floor(element.clientWidth);
    const height = Math.floor(element.clientHeight);
    if (width <= 0 || height <= 0) return;

    setSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
  }, []);

  useLayoutEffect(() => {
    measureContainer();
  }, [measureContainer, graph]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      measureContainer();
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [measureContainer]);

  const filtered = useMemo(() => {
    if (!graph) return null;

    const normalizedQuery = query.trim().toLowerCase();
    const nodes = graph.nodes.filter((node) => {
      if (!activeTypes.has(node.type)) return false;
      if (!normalizedQuery) return true;
      return (
        node.title.toLowerCase().includes(normalizedQuery) ||
        node.snippet.toLowerCase().includes(normalizedQuery) ||
        node.tags?.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      );
    });

    const nodeIds = new Set(nodes.map((node) => node.id));
    const links = graph.links.filter(
      (link) => nodeIds.has(link.source) && nodeIds.has(link.target),
    );

    return { nodes, links };
  }, [graph, query, activeTypes]);

  const graphData = useMemo(() => {
    if (!filtered) return { nodes: [], links: [] };
    return {
      nodes: filtered.nodes.map((node) => ({ ...node })),
      links: filtered.links.map((link) => ({ ...link })),
    };
  }, [filtered]);

  const focusNode = hovered ?? selected;
  const focusId = focusNode?.id ?? null;

  const neighborIds = useMemo(() => {
    if (!focusId || !filtered) return new Set<string>();
    const ids = new Set<string>([focusId]);
    for (const link of filtered.links) {
      if (link.source === focusId) ids.add(link.target);
      if (link.target === focusId) ids.add(link.source);
    }
    return ids;
  }, [focusId, filtered]);

  const neighborLinks = useMemo(() => {
    if (!focusId || !filtered) return new Map<string, GraphLink>();

    const byNeighbor = new Map<string, GraphLink>();
    for (const link of filtered.links) {
      const otherId = link.source === focusId ? link.target : link.target === focusId ? link.source : null;
      if (!otherId) continue;

      const existing = byNeighbor.get(otherId);
      if (!existing || KIND_ORDER[link.kind] < KIND_ORDER[existing.kind]) {
        byNeighbor.set(otherId, link);
      } else if (KIND_ORDER[link.kind] === KIND_ORDER[existing.kind] && link.weight > existing.weight) {
        byNeighbor.set(otherId, link);
      }
    }
    return byNeighbor;
  }, [focusId, filtered]);

  const neighbors = useMemo(() => {
    if (!focusNode || !filtered) return [];

    return filtered.nodes
      .filter((node) => neighborLinks.has(node.id))
      .sort((a, b) => {
        const linkA = neighborLinks.get(a.id)!;
        const linkB = neighborLinks.get(b.id)!;
        const kindDiff = KIND_ORDER[linkA.kind] - KIND_ORDER[linkB.kind];
        if (kindDiff !== 0) return kindDiff;
        return linkB.weight - linkA.weight;
      });
  }, [focusNode, filtered, neighborLinks]);

  const configureForces = useCallback(() => {
    const fg = graphRef.current;
    if (!fg) return;

    const charge = fg.d3Force('charge') as { strength?: (value: number) => unknown } | undefined;
    charge?.strength?.(-220);

    const linkForce = fg.d3Force('link') as { distance?: (value: number) => unknown } | undefined;
    linkForce?.distance?.(72);

    const center = fg.d3Force('center') as
      | { x?: (value: number) => unknown; y?: (value: number) => unknown; strength?: (value: number) => unknown }
      | undefined;
    center?.x?.(0);
    center?.y?.(0);
    center?.strength?.(0.08);
  }, []);

  const fitGraph = useCallback(
    (durationMs = 400) => {
      const fg = graphRef.current;
      if (!fg || size.width <= 0 || size.height <= 0 || graphData.nodes.length === 0) return;

      configureForces();
      fg.centerAt(0, 0, 0);
      fg.zoomToFit(durationMs, fitPadding);
    },
    [configureForces, fitPadding, graphData.nodes.length, size.height, size.width],
  );

  const handleEngineStop = useCallback(() => {
    fitGraph(500);
  }, [fitGraph]);

  useEffect(() => {
    if (graphData.nodes.length === 0) return;
    fitGraph(300);
  }, [fitGraph, graphData]);

  const isLinkHighlighted = useCallback(
    (link: GraphLinkRuntime) => {
      if (!focusId) return false;
      return nodeId(link.source) === focusId || nodeId(link.target) === focusId;
    },
    [focusId],
  );

  const paintNode = useCallback(
    (node: GraphNode & { x?: number; y?: number }, ctx: CanvasRenderingContext2D, globalScale: number) => {
      if (node.x === undefined || node.y === undefined) return;

      const radius = nodeRadius(node.type) / globalScale;
      const isFocused = node.id === focusId;
      const isNeighbor = neighborIds.has(node.id);
      const isDimmed = Boolean(focusId && !isFocused && !isNeighbor);

      ctx.globalAlpha = isDimmed ? 0.18 : 1;

      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = TYPE_COLORS[node.type];
      ctx.fill();

      if (isFocused || isNeighbor) {
        ctx.strokeStyle = isFocused ? '#e2e2dd' : 'rgba(142, 207, 214, 0.7)';
        ctx.lineWidth = (isFocused ? 1.2 : 0.6) / globalScale;
        ctx.stroke();
      }

      if (isFocused) {
        const fontSize = Math.max(10, 13 / globalScale);
        const label = node.title.length > 36 ? `${node.title.slice(0, 34)}…` : node.title;
        ctx.font = `${fontSize}px "PT Mono", ui-monospace, monospace`;
        ctx.fillStyle = '#e2e2dd';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, node.x + radius + 4 / globalScale, node.y);
      }

      ctx.globalAlpha = 1;
    },
    [focusId, neighborIds],
  );

  const paintPointerArea = useCallback(
    (node: GraphNode & { x?: number; y?: number }, color: string, ctx: CanvasRenderingContext2D) => {
      if (node.x === undefined || node.y === undefined) return;
      const hit = nodeRadius(node.type) + 5;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, hit, 0, 2 * Math.PI);
      ctx.fill();
    },
    [],
  );

  const linkColor = useCallback(
    (link: GraphLinkRuntime) => {
      const highlighted = isLinkHighlighted(link);
      if (!focusId) {
        switch (link.kind) {
          case 'structural':
            return 'rgba(226, 226, 221, 0.55)';
          case 'semantic':
            return 'rgba(142, 207, 214, 0.35)';
          case 'tag':
            return 'rgba(100, 178, 188, 0.3)';
          default:
            return 'rgba(187, 154, 247, 0.28)';
        }
      }
      return highlighted ? 'rgba(142, 207, 214, 0.9)' : 'rgba(80, 80, 80, 0.06)';
    },
    [focusId, isLinkHighlighted],
  );

  const linkWidth = useCallback(
    (link: GraphLinkRuntime) => {
      const highlighted = isLinkHighlighted(link);
      if (!focusId) {
        if (link.kind === 'structural') return 1.4;
        return 0.7;
      }
      return highlighted ? 2.2 : 0.25;
    },
    [focusId, isLinkHighlighted],
  );

  const toggleType = (type: ContentNodeType) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelected(node);
  }, []);

  const handleNodeHover = useCallback((node: GraphNode | null) => {
    setHovered(node);
  }, []);

  const zoomBy = (factor: number) => {
    const fg = graphRef.current;
    if (!fg) return;
    fg.zoom(fg.zoom() * factor, 300);
  };

  const resetView = () => {
    fitGraph(400);
  };

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="font-ptMono text-accent-light">Graph unavailable</p>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!graph || !filtered) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center font-ptMono text-sm text-muted-foreground">
        Mapping the site…
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl flex-col px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-ptMono text-xs uppercase tracking-[0.2em] text-accent-light">Knowledge graph</p>
            <span className="rounded-full border border-accent-light/30 px-2 py-0.5 font-ptMono text-[10px] uppercase tracking-wide text-muted-foreground">
              Experimental
            </span>
          </div>
          <h1 className="mt-2 font-ptMono text-2xl sm:text-3xl">How this site connects</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Hover a dot to see its connections. Click to inspect. Scroll to zoom, drag to pan.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(TYPE_COLORS) as ContentNodeType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => toggleType(type)}
              className={`rounded-full border px-3 py-1 font-ptMono text-xs transition-colors ${
                activeTypes.has(type)
                  ? 'border-accent-light/40 bg-accent-light/10 text-accent-light'
                  : 'border-muted text-muted-foreground'
              }`}
            >
              <span
                className="mr-2 inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: TYPE_COLORS[type] }}
              />
              {TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div
          ref={containerRef}
          className="relative h-[68vh] min-h-0 overflow-hidden rounded-xl border border-muted bg-[rgb(var(--card))]"
        >
          <div className="pointer-events-none absolute left-4 top-4 z-10 flex max-w-sm flex-col gap-2">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter nodes…"
              className="pointer-events-auto w-full max-w-sm rounded-lg border border-muted bg-[rgb(var(--background))]/95 px-3 py-2 font-ptMono text-sm outline-none ring-accent-light/30 backdrop-blur focus:ring-2"
            />
            <p className="font-ptMono text-[10px] text-muted-foreground/80">
              Scroll · zoom · drag · pan · click node
            </p>
          </div>

          <div className="pointer-events-none absolute bottom-4 right-4 z-10 flex flex-col gap-1">
            {[
              { label: '+', action: () => zoomBy(1.35) },
              { label: '−', action: () => zoomBy(1 / 1.35) },
              { label: '⌂', action: resetView },
            ].map((control) => (
              <button
                key={control.label}
                type="button"
                onClick={control.action}
                className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-md border border-muted bg-[rgb(var(--background))]/90 font-ptMono text-sm text-foreground backdrop-blur transition-colors hover:border-accent-light/40 hover:text-accent-light"
                aria-label={control.label === '⌂' ? 'Reset view' : `Zoom ${control.label}`}
              >
                {control.label}
              </button>
            ))}
          </div>

          {graphData.nodes.length === 0 ? (
            <div className="flex h-full items-center justify-center font-ptMono text-sm text-muted-foreground">
              No nodes match this filter.
            </div>
          ) : !ForceGraph2D || size.width <= 0 || size.height <= 0 ? (
            <div className="flex h-full items-center justify-center font-ptMono text-sm text-muted-foreground">
              Loading graph…
            </div>
          ) : (
            <div className="absolute inset-0">
              <ForceGraph2D
              ref={graphRef}
              graphData={graphData}
              width={size.width}
              height={size.height}
              backgroundColor="rgba(0,0,0,0)"
              nodeRelSize={1}
              nodeVal={1}
              nodeLabel=""
              linkCurvature={0.12}
              linkDirectionalParticles={0}
              warmupTicks={80}
              cooldownTicks={150}
              enableNodeDrag
              onEngineStop={handleEngineStop}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              nodeCanvasObject={paintNode as any}
              nodeCanvasObjectMode={() => 'replace'}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              nodePointerAreaPaint={paintPointerArea as any}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              linkColor={linkColor as any}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              linkWidth={linkWidth as any}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onNodeClick={handleNodeClick as any}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onNodeHover={handleNodeHover as any}
              />
            </div>
          )}
        </div>

        <aside className="flex max-h-[68vh] flex-col rounded-xl border border-muted bg-[rgb(var(--card))] p-4">
          <p className="font-ptMono text-xs uppercase tracking-[0.15em] text-muted-foreground">Inspector</p>

          <div className="mt-4 flex-1 overflow-y-auto">
            {focusNode ? (
              <div className="space-y-4">
                <div>
                  <span
                    className="inline-block rounded-full px-2 py-0.5 font-ptMono text-[10px] uppercase tracking-wide"
                    style={{
                      color: TYPE_COLORS[focusNode.type],
                      backgroundColor: `${TYPE_COLORS[focusNode.type]}22`,
                    }}
                  >
                    {TYPE_LABELS[focusNode.type]}
                  </span>
                  <h2 className="mt-2 font-ptMono text-lg leading-snug">{focusNode.title}</h2>
                  <p className="mt-1 font-ptMono text-[11px] text-muted-foreground">
                    {neighbors.length} connection{neighbors.length === 1 ? '' : 's'}
                  </p>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">{focusNode.snippet}</p>

                {focusNode.tags && focusNode.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {focusNode.tags.slice(0, 6).map((tag) => (
                      <span key={tag} className="rounded bg-muted px-2 py-0.5 font-ptMono text-[10px] text-foreground/80">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {neighbors.length > 0 && (
                  <div>
                    <p className="mb-2 font-ptMono text-[10px] uppercase tracking-wide text-muted-foreground">
                      Connected to
                    </p>
                    <ul className="space-y-1.5">
                      {neighbors.slice(0, 12).map((neighbor) => {
                        const link = neighborLinks.get(neighbor.id);
                        return (
                        <li key={neighbor.id}>
                          <button
                            type="button"
                            onClick={() => setSelected(neighbor)}
                            className="flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted/60"
                          >
                            <span
                              className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                              style={{ backgroundColor: TYPE_COLORS[neighbor.type] }}
                            />
                            <span className="min-w-0">
                              <span className="block truncate font-ptMono text-xs text-foreground">
                                {neighbor.title}
                              </span>
                              <span className="font-ptMono text-[10px] text-muted-foreground">
                                {TYPE_LABELS[neighbor.type]}
                                {link ? ` · ${KIND_LABELS[link.kind]}` : ''}
                              </span>
                            </span>
                          </button>
                        </li>
                        );
                      })}
                      {neighbors.length > 12 && (
                        <li className="px-2 font-ptMono text-[10px] text-muted-foreground">
                          +{neighbors.length - 12} more
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <a
                  href={focusNode.url}
                  className="inline-flex font-ptMono text-sm text-accent-light transition-colors hover:text-accent-light/80"
                >
                  Open page →
                </a>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Hover or click a node to highlight its connections and see related pages here.
              </p>
            )}
          </div>

          <div className="mt-4 border-t border-muted pt-4 text-xs text-muted-foreground">
            <p>{filtered.nodes.length} nodes · {filtered.links.length} edges</p>
            {graph.generatedAt && (
              <p className="mt-1">Updated {new Date(graph.generatedAt).toLocaleDateString()}</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ContentGraphView;
