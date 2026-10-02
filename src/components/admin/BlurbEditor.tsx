import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { BlurbContent, BlurbPost } from '../../data/blurb';
import BlurbContentRenderer from '../blurb/BlurbContentRenderer';

const STORAGE_KEY = 'rishia.blurbDraft.v1';

const CATEGORIES = ['experience', 'project', 'learning', 'achievement', 'reflection'] as const;

const BLOCK_TYPES = [
  ['paragraph', 'Text'],
  ['heading', 'Heading'],
  ['image', 'Image'],
  ['carousel', 'Carousel'],
  ['linkEmbed', 'Link card'],
  ['quote', 'Quote'],
  ['list', 'List'],
  ['code', 'Code'],
  ['twitter', 'Tweet'],
  ['tweetImage', 'Tweet shot'],
  ['video', 'Video'],
] as const;

type BlockType = (typeof BLOCK_TYPES)[number][0];

interface Command {
  id: string;
  type: BlockType;
  label: string;
  hint: string;
  level?: number;
}

const COMMANDS: Command[] = [
  { id: 'text', type: 'paragraph', label: 'Text', hint: 'Keep writing' },
  { id: 'h2', type: 'heading', label: 'Heading', hint: 'A section', level: 2 },
  { id: 'h3', type: 'heading', label: 'Small heading', hint: 'A subsection', level: 3 },
  { id: 'quote', type: 'quote', label: 'Quote', hint: 'Set a line apart' },
  { id: 'list', type: 'list', label: 'List', hint: 'A few lines' },
  { id: 'image', type: 'image', label: 'Image', hint: 'One photo' },
  { id: 'carousel', type: 'carousel', label: 'Carousel', hint: 'Several photos' },
  { id: 'link', type: 'linkEmbed', label: 'Link', hint: 'A card, or a PDF' },
  { id: 'code', type: 'code', label: 'Code', hint: 'A snippet' },
  { id: 'tweet', type: 'twitter', label: 'Tweet', hint: 'Embed by ID' },
  { id: 'tweetshot', type: 'tweetImage', label: 'Tweet shot', hint: 'A screenshot' },
  { id: 'video', type: 'video', label: 'Video', hint: 'YouTube or a file' },
];

interface EditorBlock {
  key: string;
  type: BlockType;
  content: string;
  level: number;
  alt: string;
  language: string;
  itemsText: string;
  tweetId: string;
  tweetUrl: string;
  title: string;
  description: string;
  image: string;
  images: { src: string; alt?: string }[];
  caption: string;
  poster: string;
}

interface Draft {
  title: string;
  subtitle: string;
  description: string;
  slug: string;
  slugTouched: boolean;
  publishedDate: string;
  tags: string;
  category: (typeof CATEGORIES)[number];
  status: 'draft' | 'published';
  coverImage: string;
  socialImage: string;
  blocks: EditorBlock[];
}

interface MenuState {
  key: string;
  mode: 'slash' | 'insert' | 'turn';
  query: string;
  index: number;
  at?: number;
  line?: number;
}

const PROSE = new Set<BlockType>(['paragraph', 'heading', 'quote', 'code', 'list']);

const quiet =
  'w-full resize-none bg-transparent p-0 border-0 outline-none focus:ring-0 text-quillGray placeholder:text-gunSmoke/35';

function today(): string {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function createBlock(type: BlockType): EditorBlock {
  return {
    key: crypto.randomUUID(),
    type,
    content: '',
    level: 2,
    alt: '',
    language: '',
    itemsText: '',
    tweetId: '',
    tweetUrl: '',
    title: '',
    description: '',
    image: '',
    images: [],
    caption: '',
    poster: '',
  };
}

function emptyDraft(): Draft {
  return {
    title: '',
    subtitle: '',
    description: '',
    slug: '',
    slugTouched: false,
    publishedDate: today(),
    tags: '',
    category: 'experience',
    status: 'published',
    coverImage: '',
    socialImage: '',
    blocks: [createBlock('paragraph')],
  };
}

function loadDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Draft;
    if (!parsed || !Array.isArray(parsed.blocks)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function proseOf(block: EditorBlock): string {
  return block.type === 'list' ? block.itemsText : block.content;
}

function tweetIdFrom(value: string): string {
  const status = value.match(/status\/(\d{8,})/);
  return status ? status[1] : value.trim();
}

function fileKindFor(type: BlockType): 'image' | 'carousel' | 'shot' | null {
  if (type === 'image') return 'image';
  if (type === 'carousel') return 'carousel';
  if (type === 'tweetImage') return 'shot';
  return null;
}

function withCommand(block: EditorBlock, command: Command, fromSlash: boolean): EditorBlock {
  const source = fromSlash && proseOf(block).trim().startsWith('/') ? '' : proseOf(block);
  const next: EditorBlock = { ...block, type: command.type, level: command.level ?? block.level };
  if (command.type === 'carousel' && (block.type === 'image' || block.type === 'tweetImage') && block.content.trim()) {
    const carried = { src: block.content.trim(), alt: block.alt };
    next.images = [carried, ...block.images.filter((image) => image.src && image.src !== carried.src)];
  }
  if ((command.type === 'image' || command.type === 'tweetImage') && block.type === 'carousel' && block.images[0]?.src) {
    next.content = block.images[0].src;
    next.alt = block.images[0].alt || '';
  }
  if (command.type === 'list') {
    next.itemsText = PROSE.has(block.type) ? source : block.itemsText;
    next.content = '';
  } else if (PROSE.has(command.type)) {
    next.content = PROSE.has(block.type) ? source : block.alt || '';
  } else if (fromSlash) {
    next.content = '';
    next.itemsText = '';
  }
  if (fromSlash && (command.type === 'image' || command.type === 'tweetImage')) next.alt = '';
  return next;
}

function resize(element: HTMLTextAreaElement | null) {
  if (!element) return;
  const previous = element.style.height;
  element.style.height = 'auto';
  const next = `${element.scrollHeight}px`;
  element.style.height = next === previous ? previous : next;
}

function exportBlock(block: EditorBlock): BlurbContent | null {
  switch (block.type) {
    case 'paragraph':
    case 'quote':
    case 'code':
      if (!block.content.trim()) return null;
      if (block.type === 'code') {
        return {
          type: 'code',
          content: block.content,
          ...(block.language.trim() ? { language: block.language.trim() } : {}),
        };
      }
      return { type: block.type, content: block.content };
    case 'heading':
      if (!block.content.trim()) return null;
      return { type: 'heading', content: block.content.trim(), level: block.level === 3 ? 3 : 2 };
    case 'image':
      if (!block.content.trim()) return null;
      return {
        type: 'image',
        content: block.content.trim(),
        ...(block.alt.trim() ? { alt: block.alt.trim() } : {}),
      };
    case 'carousel':
      if (block.images.length === 0) return null;
      return {
        type: 'carousel',
        images: block.images.filter((image) => image.src),
        ...(block.caption.trim() ? { caption: block.caption.trim() } : {}),
      };
    case 'linkEmbed':
      if (!block.content.trim()) return null;
      return {
        type: 'linkEmbed',
        content: block.content.trim(),
        ...(block.title.trim() ? { title: block.title.trim() } : {}),
        ...(block.description.trim() ? { description: block.description.trim() } : {}),
        ...(block.image.trim() ? { image: block.image.trim() } : {}),
        ...(domainOf(block.content) ? { domain: domainOf(block.content) } : {}),
      };
    case 'list': {
      const items = block.itemsText.split('\n').map((item) => item.trim()).filter(Boolean);
      if (items.length === 0) return null;
      return { type: 'list', items };
    }
    case 'twitter':
      if (!block.tweetId.trim()) return null;
      return { type: 'twitter', tweetId: block.tweetId.trim() };
    case 'tweetImage':
      if (!block.content.trim()) return null;
      return {
        type: 'tweetImage',
        content: block.content.trim(),
        ...(block.alt.trim() ? { alt: block.alt.trim() } : {}),
        ...(block.tweetUrl.trim() ? { tweetUrl: block.tweetUrl.trim() } : {}),
      };
    case 'video':
      if (!block.content.trim()) return null;
      return {
        type: 'video',
        content: block.content.trim(),
        ...(block.alt.trim() ? { alt: block.alt.trim() } : {}),
        ...(block.poster.trim() ? { poster: block.poster.trim() } : {}),
      };
    default:
      return null;
  }
}

function toPost(draft: Draft): BlurbPost {
  const slug = slugify(draft.slug || draft.title);
  const tags = draft.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
  const content = draft.blocks.map(exportBlock).filter((block): block is BlurbContent => Boolean(block));
  const firstParagraph = content.find((block) => block.type === 'paragraph' && block.content)?.content || '';
  const post: BlurbPost = {
    id: slug,
    title: draft.title.trim(),
    description: draft.description.trim() || draft.subtitle.trim() || firstParagraph.trim().slice(0, 180),
    slug,
    publishedDate: draft.publishedDate,
    tags,
    category: draft.category,
    status: draft.status,
    content,
  };
  if (draft.subtitle.trim()) post.subtitle = draft.subtitle.trim();
  if (draft.coverImage.trim()) post.coverImage = draft.coverImage.trim();
  if (draft.socialImage.trim()) post.socialImage = draft.socialImage.trim();
  return post;
}

function blockFromContent(item: BlurbContent): EditorBlock {
  const block = createBlock(
    BLOCK_TYPES.some(([type]) => type === item.type) ? (item.type as BlockType) : 'paragraph'
  );
  block.content = item.content || '';
  block.level = item.level || 2;
  block.alt = item.alt || '';
  block.language = item.language || '';
  block.itemsText = (item.items || []).join('\n');
  block.tweetId = item.tweetId || '';
  block.tweetUrl = item.tweetUrl || '';
  block.title = item.title || '';
  block.description = item.description || '';
  block.image = item.image || '';
  block.images = item.images || [];
  block.caption = item.caption || '';
  block.poster = item.poster || '';
  return block;
}

function matches(command: Command, query: string): boolean {
  const haystack = `${command.label} ${command.hint}`.toLowerCase();
  return haystack.includes(query.toLowerCase().trim());
}

const BlurbEditor: React.FC<{ token: string }> = ({ token }) => {
  const [draft, setDraft] = useState<Draft>(() => loadDraft() ?? emptyDraft());
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [importText, setImportText] = useState('');
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [focusKey, setFocusKey] = useState<string | null>(null);
  const [linkFor, setLinkFor] = useState<{ key: string; field: 'content' | 'itemsText'; start: number; end: number } | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const textareas = useRef<Record<string, HTMLTextAreaElement | null>>({});
  const caretRef = useRef<{ key: string; pos: number } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const fileTarget = useRef<{ key: string; kind: 'image' | 'carousel' | 'shot' | 'video' | 'poster' | 'link'; command?: Command; fromSlash?: boolean } | null>(null);
  const activeKey = useRef<string | null>(null);
  const menuRef = useRef(menu);
  menuRef.current = menu;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft]);

  useEffect(() => {
    const last = draft.blocks[draft.blocks.length - 1];
    if (!last || last.type === 'paragraph') return;
    setDraft((current) => {
      const end = current.blocks[current.blocks.length - 1];
      if (!end || end.type === 'paragraph') return current;
      return { ...current, blocks: [...current.blocks, createBlock('paragraph')] };
    });
  }, [draft.blocks]);

  useLayoutEffect(() => {
    const top = window.scrollY;
    const active = document.activeElement;
    const start = active instanceof HTMLTextAreaElement ? active.selectionStart : null;
    const end = active instanceof HTMLTextAreaElement ? active.selectionEnd : null;
    Object.values(textareas.current).forEach(resize);
    if (active instanceof HTMLTextAreaElement && start != null && end != null && document.activeElement === active) {
      active.setSelectionRange(start, end);
    }
    if (window.scrollY !== top) window.scrollTo(window.scrollX, top);
  });

  useLayoutEffect(() => {
    if (!focusKey) return;
    const element = textareas.current[`${focusKey}:content`] || textareas.current[`${focusKey}:items`];
    const pos = caretRef.current?.key === focusKey ? caretRef.current.pos : element?.value.length ?? 0;
    caretRef.current = null;
    if (element) {
      if (document.activeElement !== element) element.focus();
      element.setSelectionRange(pos, pos);
    }
    setFocusKey(null);
  }, [focusKey]);

  const post = useMemo(() => toPost(draft), [draft]);
  const json = useMemo(() => JSON.stringify(post, null, 2), [post]);
  const commands = useMemo(() => {
    if (!menu || menu.mode === 'turn') return COMMANDS;
    return COMMANDS.filter((command) => matches(command, menu.query));
  }, [menu]);

  const patchMeta = (partial: Partial<Draft>) => {
    setDraft((current) => {
      const next = { ...current, ...partial };
      if (!current.slugTouched && partial.title !== undefined) {
        next.slug = slugify(partial.title);
      }
      return next;
    });
  };

  const patchBlock = (key: string, partial: Partial<EditorBlock>) => {
    setDraft((current) => ({
      ...current,
      blocks: current.blocks.map((block) => (block.key === key ? { ...block, ...partial } : block)),
    }));
  };

  const uploadFile = async (file: File): Promise<string> => {
    const slug = slugify(draft.slug || draft.title) || 'draft';
    const response = await fetch('/api/admin/blurb-presign', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slug,
        fileName: file.name || 'image.jpg',
        contentType: file.type || 'application/octet-stream',
      }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || 'Could not start the upload.');
    const uploaded = await fetch(body.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type || 'application/octet-stream' },
      body: file,
    });
    if (!uploaded.ok) throw new Error('The file did not upload.');
    return body.publicUrl as string;
  };

  const uploadInto = async (
    key: string,
    file: File,
    field: 'content' | 'image' | 'poster',
    convert?: { command: Command; fromSlash: boolean },
  ) => {
    setBusyKey(key);
    setError('');
    try {
      const url = await uploadFile(file);
      setDraft((current) => ({
        ...current,
        blocks: current.blocks.map((block) => {
          if (block.key !== key) return block;
          const base = convert && block.type !== convert.command.type ? withCommand(block, convert.command, convert.fromSlash) : block;
          return { ...base, [field]: url };
        }),
      }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed.');
    } finally {
      setBusyKey(null);
    }
  };

  const uploadCarousel = async (key: string, files: File[], convert?: { command: Command; fromSlash: boolean }) => {
    setBusyKey(key);
    setError('');
    try {
      for (const file of files) {
        const src = await uploadFile(file);
        setDraft((current) => ({
          ...current,
          blocks: current.blocks.map((block) => {
            if (block.key !== key) return block;
            const base = convert && block.type !== convert.command.type ? withCommand(block, convert.command, convert.fromSlash) : block;
            return { ...base, images: [...base.images, { src, alt: '' }] };
          }),
        }));
      }
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed.');
    } finally {
      setBusyKey(null);
    }
  };

  const openFiles = (
    key: string,
    kind: NonNullable<typeof fileTarget.current>['kind'],
    convert?: { command: Command; fromSlash: boolean },
  ) => {
    fileTarget.current = { key, kind, command: convert?.command, fromSlash: convert?.fromSlash };
    const input = fileInput.current;
    if (!input) return;
    input.multiple = kind === 'carousel';
    input.accept = kind === 'video'
      ? 'video/mp4'
      : kind === 'link'
        ? 'image/jpeg,image/png,image/webp,image/gif,application/pdf'
        : 'image/jpeg,image/png,image/webp,image/gif';
    input.click();
  };

  const onFiles = async (list: FileList | null) => {
    const target = fileTarget.current;
    const files = Array.from(list || []);
    if (fileInput.current) fileInput.current.value = '';
    if (!target || files.length === 0) return;
    const convert = target.command ? { command: target.command, fromSlash: Boolean(target.fromSlash) } : undefined;
    if (target.kind === 'carousel') {
      await uploadCarousel(target.key, files, convert);
      return;
    }
    if (target.kind === 'link') {
      const file = files[0];
      setBusyKey(target.key);
      try {
        const url = await uploadFile(file);
        patchBlock(target.key, file.type === 'application/pdf'
          ? { content: url, title: draft.blocks.find((block) => block.key === target.key)?.title || file.name }
          : { image: url });
      } catch (uploadError) {
        setError(uploadError instanceof Error ? uploadError.message : 'Upload failed.');
      } finally {
        setBusyKey(null);
      }
      return;
    }
    const field = target.kind === 'poster' ? 'poster' : 'content';
    await uploadInto(target.key, files[0], field, convert);
  };

  const placeBlock = (afterKey: string | null, block: EditorBlock) => {
    setDraft((current) => {
      if (!afterKey) return { ...current, blocks: [...current.blocks, block] };
      const index = current.blocks.findIndex((item) => item.key === afterKey);
      const blocks = [...current.blocks];
      blocks.splice(Math.max(index, 0) + 1, 0, block);
      return { ...current, blocks };
    });
  };

  const convertBlock = (key: string, command: Command, fromSlash: boolean) => {
    setDraft((current) => ({
      ...current,
      blocks: current.blocks.map((block) => (block.key === key ? withCommand(block, command, fromSlash) : block)),
    }));
  };

  const choose = (command: Command) => {
    if (!menu) return;
    const fileKind = fileKindFor(command.type);
    if (menu.mode === 'insert') {
      const block = createBlock(command.type);
      if (command.level) block.level = command.level;
      insertAfterLine(menu.key, block, menu.line ?? 0);
      setMenu(null);
      if (fileKind) openFiles(block.key, fileKind);
      else setFocusKey(block.key);
      return;
    }
    if (menu.mode === 'slash') {
      const host = draft.blocks.find((block) => block.key === menu.key);
      if (host?.type === 'paragraph') {
        const at = menu.at ?? 0;
        const token = `/${menu.query}`;
        const before = host.content.slice(0, at).replace(/\n+$/, '');
        const after = host.content.slice(at + (host.content.startsWith(token, at) ? token.length : 0)).replace(/^\n/, '');
        if (before.length > 0 || after.length > 0) {
          const created = createBlock(command.type);
          if (command.level) created.level = command.level;
          const tail = createBlock('paragraph');
          tail.content = after;
          setDraft((current) => {
            if (current.blocks.some((item) => item.key === created.key)) return current;
            const index = current.blocks.findIndex((item) => item.key === host.key);
            if (index < 0) return current;
            const blocks = [...current.blocks];
            const replacement: EditorBlock[] = [];
            if (before.length) replacement.push({ ...current.blocks[index], content: before });
            replacement.push(created);
            if (after.length) replacement.push(tail);
            blocks.splice(index, 1, ...replacement);
            return { ...current, blocks };
          });
          setMenu(null);
          if (fileKind) openFiles(created.key, fileKind);
          else setFocusKey(created.key);
          return;
        }
      }
    }
    const currentBlock = draft.blocks.find((block) => block.key === menu.key);
    const carriesMedia = Boolean(
      currentBlock && (
        ((currentBlock.type === 'image' || currentBlock.type === 'tweetImage') && currentBlock.content.trim())
        || (currentBlock.type === 'carousel' && currentBlock.images.some((image) => image.src))
      )
    );
    if (fileKind && !carriesMedia) {
      const key = menu.key;
      const fromSlash = menu.mode === 'slash';
      setMenu(null);
      openFiles(key, fileKind, { command, fromSlash });
      return;
    }
    const key = menu.key;
    convertBlock(key, command, menu.mode === 'slash');
    setMenu(null);
    if (command.type === 'carousel' && carriesMedia) openFiles(key, 'carousel');
    else if (!fileKind) setFocusKey(key);
  };

  const moveBlock = (key: string, direction: -1 | 1) => {
    setDraft((current) => {
      const index = current.blocks.findIndex((block) => block.key === key);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.blocks.length) return current;
      const blocks = [...current.blocks];
      const [block] = blocks.splice(index, 1);
      blocks.splice(nextIndex, 0, block);
      return { ...current, blocks };
    });
    setMenu(null);
  };

  const removeBlock = (key: string) => {
    setDraft((current) => {
      const blocks = current.blocks.filter((block) => block.key !== key);
      return { ...current, blocks: blocks.length ? blocks : [createBlock('paragraph')] };
    });
    setMenu(null);
  };

  const focusBlock = (key: string, pos: number) => {
    caretRef.current = { key, pos };
    setFocusKey(key);
  };

  const continueWriting = () => {
    const last = draft.blocks[draft.blocks.length - 1];
    if (last?.type === 'paragraph' && !last.content) {
      focusBlock(last.key, 0);
      return;
    }
    const block = createBlock('paragraph');
    placeBlock(last?.key ?? null, block);
    focusBlock(block.key, 0);
  };

  const focusFirstWriter = () => {
    const prose = draft.blocks.find((block) => block.type === 'paragraph' || block.type === 'heading' || block.type === 'quote' || block.type === 'list');
    if (!prose) {
      continueWriting();
      return;
    }
    focusBlock(prose.key, prose.type === 'list' ? prose.itemsText.length : prose.content.length);
  };

  const exitList = (key: string, before: string[], after: string[]) => {
    const paragraph = createBlock('paragraph');
    setDraft((current) => {
      const index = current.blocks.findIndex((block) => block.key === key);
      if (index < 0) return current;
      const list = current.blocks[index];
      const replacement: EditorBlock[] = [];
      if (before.some((item) => item.trim())) replacement.push({ ...list, itemsText: before.join('\n') });
      replacement.push(paragraph);
      if (after.some((item) => item.length > 0)) {
        const rest = createBlock('list');
        rest.itemsText = after.join('\n');
        replacement.push(rest);
      }
      const blocks = [...current.blocks];
      blocks.splice(index, 1, ...replacement);
      return { ...current, blocks };
    });
    focusBlock(paragraph.key, 0);
  };

  const mergeListBackward = (key: string, item: string, rest: string[]) => {
    const index = draft.blocks.findIndex((block) => block.key === key);
    const previous = draft.blocks[index - 1];
    const previousIsProse = previous && (previous.type === 'paragraph' || previous.type === 'heading' || previous.type === 'quote');
    if (previousIsProse) {
      const join = previous.content.length;
      setDraft((current) => {
        if (!current.blocks.some((block) => block.key === key)) return current;
        const blocks = current.blocks.flatMap((block) => {
          if (block.key === previous.key) return [{ ...block, content: block.content + item }];
          if (block.key !== key) return [block];
          if (!rest.length) return [];
          return [{ ...block, itemsText: rest.join('\n') }];
        });
        return { ...current, blocks: blocks.length ? blocks : [createBlock('paragraph')] };
      });
      focusBlock(previous.key, join);
      return;
    }
    if (!item && !rest.length) removeBlock(key);
  };

  const onProseKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>, block: EditorBlock) => {
    const open = menu && menu.key === block.key && (menu.mode === 'slash' || menu.mode === 'insert');
    if (open && menu) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const delta = event.key === 'ArrowDown' ? 1 : -1;
        setMenu({ ...menu, index: (menu.index + delta + Math.max(commands.length, 1)) % Math.max(commands.length, 1) });
        return;
      }
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (commands[menu.index]) choose(commands[menu.index]);
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        if (menu.mode === 'slash') {
          const at = menu.at ?? 0;
          const content = block.content.startsWith('/', at)
            ? `${block.content.slice(0, at)}${block.content.slice(at + 1)}`
            : block.content;
          patchBlock(block.key, { content });
        }
        setMenu(null);
        return;
      }
    }

    const element = event.currentTarget;
    const atStart = element.selectionStart === 0 && element.selectionEnd === 0;

    if (event.key === 'Enter' && block.type !== 'code') {
      event.preventDefault();
      const before = block.content.slice(0, element.selectionStart);
      const after = block.content.slice(element.selectionEnd);
      const next = createBlock(block.type === 'heading' ? 'paragraph' : 'paragraph');
      next.content = after;
      setDraft((current) => {
        const blocks = current.blocks.map((item) => item.key === block.key ? { ...item, content: before } : item);
        const index = blocks.findIndex((item) => item.key === block.key);
        blocks.splice(index + 1, 0, next);
        return { ...current, blocks };
      });
      setMenu(null);
      focusBlock(next.key, 0);
      return;
    }

    if (event.key === 'Backspace' && atStart) {
      const index = draft.blocks.findIndex((item) => item.key === block.key);
      const previous = draft.blocks[index - 1];
      if (!previous) return;
      const previousText = previous.type === 'list' ? previous.itemsText : previous.content;
      const previousIsProse = previous.type === 'paragraph' || previous.type === 'heading' || previous.type === 'quote';
      const currentIsProse = block.type === 'paragraph' || block.type === 'heading' || block.type === 'quote';
      if (previousIsProse && currentIsProse) {
        event.preventDefault();
        const join = previousText.length;
        setDraft((current) => ({
          ...current,
          blocks: current.blocks
            .filter((item) => item.key !== block.key)
            .map((item) => item.key === previous.key ? { ...item, content: previousText + block.content } : item),
        }));
        setMenu(null);
        focusBlock(previous.key, join);
        return;
      }
      if (block.content === '') {
        event.preventDefault();
        removeBlock(block.key);
        if (previousIsProse) focusBlock(previous.key, previousText.length);
      }
    }
  };

  const onProseChange = (block: EditorBlock, value: string, caret: number) => {
    patchBlock(block.key, { content: value });
    const at = value.lastIndexOf('\n', Math.max(caret - 1, 0)) + 1;
    const lineEnd = value.indexOf('\n', at);
    const line = value.slice(at, lineEnd === -1 ? value.length : lineEnd);
    const slash = block.type === 'paragraph' && /^\/\S*$/.test(line);
    if (slash) {
      const query = line.slice(1);
      const shown = COMMANDS.filter((command) => matches(command, query)).length;
      const lineIndex = value.slice(0, at).split('\n').length - 1;
      setMenu((current) => ({
        key: block.key,
        mode: 'slash',
        query,
        at,
        line: lineIndex,
        index: Math.min(
          current?.key === block.key && current.mode === 'slash' ? current.index : 0,
          Math.max(shown - 1, 0)
        ),
      }));
    } else if (menu?.key === block.key && menu.mode === 'slash') {
      setMenu(null);
    }
  };

  const insertAfterLine = (key: string, block: EditorBlock, lineIndex = 0) => {
    setDraft((current) => {
      if (current.blocks.some((item) => item.key === block.key)) return current;
      const index = current.blocks.findIndex((item) => item.key === key);
      if (index < 0) return { ...current, blocks: [...current.blocks, block] };
      const host = current.blocks[index];
      const lines = host.content.split('\n');
      const canSplit = (host.type === 'paragraph' || host.type === 'heading' || host.type === 'quote')
        && lines.length > 1
        && lineIndex < lines.length - 1;
      const blocks = [...current.blocks];
      if (!canSplit) {
        blocks.splice(index + 1, 0, block);
        return { ...current, blocks };
      }
      const rest = createBlock('paragraph');
      rest.content = lines.slice(lineIndex + 1).join('\n');
      blocks.splice(index, 1, { ...host, content: lines.slice(0, lineIndex + 1).join('\n') }, block, rest);
      return { ...current, blocks };
    });
  };

  const rememberSelection = (key: string, field: 'content' | 'itemsText', element: HTMLTextAreaElement) => {
    if (element.selectionStart === element.selectionEnd) {
      setLinkFor((current) => (current?.key === key ? null : current));
      return;
    }
    setLinkFor({ key, field, start: element.selectionStart, end: element.selectionEnd });
  };

  const applyLink = (event: React.FormEvent) => {
    event.preventDefault();
    if (!linkFor || !linkUrl.trim()) return;
    const block = draft.blocks.find((item) => item.key === linkFor.key);
    if (!block) return;
    const source = linkFor.field === 'itemsText' ? block.itemsText : block.content;
    const label = source.slice(linkFor.start, linkFor.end) || 'link';
    const next = `${source.slice(0, linkFor.start)}[${label}](${linkUrl.trim()})${source.slice(linkFor.end)}`;
    patchBlock(linkFor.key, { [linkFor.field]: next });
    setLinkFor(null);
    setLinkUrl('');
  };

  const copyJson = async () => {
    if (busyKey) {
      setError('Wait for the upload to finish.');
      return;
    }
    if (!post.title || !post.slug) {
      setError('Add a title first.');
      return;
    }
    const brokenLink = post.content.find(
      (block) => block.type === 'linkEmbed' && block.content && !/^https?:\/\//.test(block.content)
    );
    if (brokenLink) {
      setError('A link card needs a full https:// URL.');
      return;
    }
    await navigator.clipboard.writeText(json);
    setError('');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const startNew = () => {
    if (!window.confirm('Start a new blurb? Copy the JSON first if you still need this one.')) return;
    setDraft(emptyDraft());
    setError('');
    setMenu(null);
    setShowPreview(false);
  };

  const importJson = () => {
    try {
      const parsed = JSON.parse(importText) as BlurbPost;
      if (!parsed || !Array.isArray(parsed.content)) throw new Error('That is not a blurb JSON.');
      setDraft({
        title: parsed.title || '',
        subtitle: parsed.subtitle || '',
        description: parsed.description || '',
        slug: parsed.slug || '',
        slugTouched: true,
        publishedDate: parsed.publishedDate || today(),
        tags: (parsed.tags || []).join(', '),
        category: CATEGORIES.includes(parsed.category) ? parsed.category : 'experience',
        status: parsed.status === 'draft' ? 'draft' : 'published',
        coverImage: parsed.coverImage || '',
        socialImage: parsed.socialImage || '',
        blocks: parsed.content.length ? parsed.content.map(blockFromContent) : [createBlock('paragraph')],
      });
      setImportText('');
      setShowDetails(false);
      setError('');
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : 'Could not read that JSON.');
    }
  };

  const onPasteFiles = (event: React.ClipboardEvent) => {
    const images = Array.from(event.clipboardData.files).filter((file) => file.type.startsWith('image/'));
    if (images.length === 0) return;
    event.preventDefault();
    const current = draft.blocks.find((block) => block.key === activeKey.current);
    const carousel = COMMANDS.find((command) => command.id === 'carousel');
    if (current?.type === 'carousel') {
      void uploadCarousel(current.key, images);
      return;
    }
    if (current?.type === 'image' && carousel) {
      void uploadCarousel(current.key, images, { command: carousel, fromSlash: false });
      return;
    }
    const block = createBlock(images.length > 1 ? 'carousel' : 'image');
    const textarea = current ? textareas.current[`${current.key}:content`] : null;
    const line = textarea ? textarea.value.slice(0, textarea.selectionStart).split('\n').length - 1 : 0;
    if (current) insertAfterLine(current.key, block, line);
    else placeBlock(activeKey.current, block);
    if (images.length > 1) void uploadCarousel(block.key, images);
    else void uploadInto(block.key, images[0], 'content');
  };

  const chooseRef = useRef(choose);
  chooseRef.current = choose;

  useEffect(() => {
    const onPointer = (event: MouseEvent) => {
      if (!menuRef.current) return;
      const target = event.target;
      if (target instanceof HTMLElement && target.closest('[data-blurb-menu]')) return;
      setMenu(null);
    };
    document.addEventListener('mousedown', onPointer);
    return () => document.removeEventListener('mousedown', onPointer);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const current = menuRef.current;
      const target = event.target;
      if (target instanceof HTMLElement && (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT' || target.tagName === 'SELECT')) return;
      if (!current || current.mode !== 'insert') return;
      const shown = COMMANDS.filter((command) => matches(command, current.query));
      if (event.key === 'Escape') setMenu(null);
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const delta = event.key === 'ArrowDown' ? 1 : -1;
        setMenu({ ...current, index: (current.index + delta + Math.max(shown.length, 1)) % Math.max(shown.length, 1) });
      }
      if (event.key === 'Enter' && shown[current.index]) {
        event.preventDefault();
        chooseRef.current(shown[current.index]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const downloadJson = () => {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${post.slug || 'blurb'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-2 pb-24" onPaste={onPasteFiles}>
      <input ref={fileInput} className="hidden" type="file" onChange={(event) => void onFiles(event.target.files)} />

      <div className="mb-8 flex items-center justify-end gap-4 text-sm font-ptMono text-gunSmoke">
        <button type="button" className="hover:text-quillGray" onClick={() => setShowPreview((value) => !value)}>
          {showPreview ? 'Back to writing' : 'Preview'}
        </button>
        <button type="button" className="hover:text-quillGray" onClick={() => setShowDetails((value) => !value)}>
          Details
        </button>
        <button type="button" className="hover:text-quillGray" onClick={copyJson}>
          {copied ? 'Copied' : 'Copy JSON'}
        </button>
      </div>

      {error && <p className="mb-4 text-sm font-ptMono text-red-300">{error}</p>}

      {showDetails && (
        <div className="mb-10 space-y-3 border-b border-white/10 pb-8 text-sm">
          <label className="block text-gunSmoke">
            Slug
            <input className={`${quiet} mt-1 text-base`} value={draft.slug} onChange={(event) => patchMeta({ slug: slugify(event.target.value), slugTouched: true })} />
          </label>
          <label className="block text-gunSmoke">
            Description
            <textarea className={`${quiet} mt-1 text-base`} rows={2} value={draft.description} placeholder="Used for the link preview. Leave blank and the first paragraph is used." onChange={(event) => patchMeta({ description: event.target.value })} />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-gunSmoke">
              Date
              <input className={`${quiet} mt-1 text-base`} type="date" value={draft.publishedDate} onChange={(event) => patchMeta({ publishedDate: event.target.value })} />
            </label>
            <label className="block text-gunSmoke">
              Category
              <select className={`${quiet} mt-1 text-base`} value={draft.category} onChange={(event) => patchMeta({ category: event.target.value as Draft['category'] })}>
                {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </label>
          </div>
          <label className="block text-gunSmoke">
            Tags
            <input className={`${quiet} mt-1 text-base`} value={draft.tags} placeholder="comma separated" onChange={(event) => patchMeta({ tags: event.target.value })} />
          </label>
          <label className="block text-gunSmoke">
            Status
            <select className={`${quiet} mt-1 text-base`} value={draft.status} onChange={(event) => patchMeta({ status: event.target.value as Draft['status'] })}>
              <option value="published">Published, shareable link</option>
              <option value="draft">Draft, stays off the site</option>
            </select>
          </label>
          <p className="font-ptMono text-xs text-gunSmoke">
            {post.slug ? `rishia.in/blurb/${post.slug}/` : 'The title becomes the link.'} Saved in this browser.
          </p>
          <div className="flex flex-wrap gap-4 font-ptMono text-xs text-gunSmoke">
            <button type="button" className="hover:text-quillGray" onClick={downloadJson}>Download JSON</button>
            <button type="button" className="hover:text-quillGray" onClick={startNew}>New blurb</button>
          </div>
          <textarea className={`${quiet} min-h-20 text-xs`} placeholder="Paste JSON to keep editing it" value={importText} onChange={(event) => setImportText(event.target.value)} />
          {importText && <button type="button" className="font-ptMono text-xs text-gunSmoke hover:text-quillGray" onClick={importJson}>Load JSON</button>}
        </div>
      )}

      <textarea
        ref={(element) => { textareas.current.title = element; }}
        className={`${quiet} mb-3 text-4xl font-semibold leading-tight md:text-5xl`}
        rows={1}
        placeholder="Title"
        value={draft.title}
        onChange={(event) => patchMeta({ title: event.target.value })}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            focusFirstWriter();
          }
        }}
      />
      <textarea
        ref={(element) => { textareas.current.subtitle = element; }}
        className={`${quiet} mb-10 text-xl text-gunSmoke placeholder:text-gunSmoke/30`}
        rows={1}
        placeholder="Subtitle"
        value={draft.subtitle}
        onChange={(event) => patchMeta({ subtitle: event.target.value })}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            focusFirstWriter();
          }
        }}
      />

      {showPreview ? (
        <div>
          <BlurbContentRenderer content={post.content} />
        </div>
      ) : (
        <div
          className="min-h-[70vh] cursor-text"
          onMouseDown={(event) => {
            if (event.target !== event.currentTarget) return;
            event.preventDefault();
            continueWriting();
          }}
        >
          {draft.blocks.map((block, index) => (
            <BlockRow
              key={block.key}
              block={block}
              isFirstEmpty={index === 0 && draft.blocks.length === 1 && block.type === 'paragraph' && !block.content}
              menu={menu?.key === block.key ? menu : null}
              commands={menu?.key === block.key ? commands : []}
              busy={busyKey === block.key}
              linkFor={linkFor?.key === block.key ? linkFor : null}
              linkUrl={linkUrl}
              onLinkUrl={setLinkUrl}
              onApplyLink={applyLink}
              onChoose={choose}
              onTurn={() => setMenu({ key: block.key, mode: 'turn', query: '', index: 0 })}
              onInsert={(line) => setMenu({ key: block.key, mode: 'insert', query: '', index: 0, line })}
              onCloseMenu={() => setMenu(null)}
              onMove={(direction) => moveBlock(block.key, direction)}
              onRemove={() => removeBlock(block.key)}
              onCover={() => patchMeta({ coverImage: block.content })}
              onSocial={() => patchMeta({ socialImage: block.content })}
              onProseChange={onProseChange}
              onProseKeyDown={onProseKeyDown}
              onFocus={() => { activeKey.current = block.key; }}
              onSelect={rememberSelection}
              bindTextarea={(name, element) => { textareas.current[`${block.key}:${name}`] = element; }}
              patch={(partial) => patchBlock(block.key, partial)}
              onImages={(recipe) => {
                setDraft((current) => ({
                  ...current,
                  blocks: current.blocks.map((item) => item.key === block.key ? { ...item, images: recipe(item.images) } : item),
                }));
              }}
              onExitList={(before, after) => exitList(block.key, before, after)}
              onMergeList={(item, rest) => mergeListBackward(block.key, item, rest)}
              openFiles={(kind) => openFiles(block.key, kind)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

function BlockRow({
  block,
  isFirstEmpty,
  menu,
  commands,
  busy,
  linkFor,
  linkUrl,
  onLinkUrl,
  onApplyLink,
  onChoose,
  onTurn,
  onInsert,
  onCloseMenu,
  onMove,
  onRemove,
  onCover,
  onSocial,
  onProseChange,
  onProseKeyDown,
  onFocus,
  onSelect,
  bindTextarea,
  patch,
  onImages,
  onExitList,
  onMergeList,
  openFiles,
}: {
  block: EditorBlock;
  isFirstEmpty: boolean;
  menu: MenuState | null;
  commands: Command[];
  busy: boolean;
  linkFor: { field: 'content' | 'itemsText' } | null;
  linkUrl: string;
  onLinkUrl: (value: string) => void;
  onApplyLink: (event: React.FormEvent) => void;
  onChoose: (command: Command) => void;
  onTurn: () => void;
  onInsert: (line: number) => void;
  onCloseMenu: () => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
  onCover: () => void;
  onSocial: () => void;
  onProseChange: (block: EditorBlock, value: string, caret: number) => void;
  onProseKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>, block: EditorBlock) => void;
  onFocus: () => void;
  onSelect: (key: string, field: 'content' | 'itemsText', element: HTMLTextAreaElement) => void;
  bindTextarea: (name: string, element: HTMLTextAreaElement | null) => void;
  patch: (partial: Partial<EditorBlock>) => void;
  onImages: (recipe: (images: { src: string; alt?: string }[]) => { src: string; alt?: string }[]) => void;
  onExitList: (before: string[], after: string[]) => void;
  onMergeList: (item: string, rest: string[]) => void;
  openFiles: (kind: 'image' | 'carousel' | 'shot' | 'video' | 'poster' | 'link') => void;
}) {
  const showMenu = Boolean(menu);
  const dragFrom = useRef<number | null>(null);
  const proseLines = (block.type === 'paragraph' || block.type === 'heading' || block.type === 'quote')
    ? block.content.split('\n')
    : null;
  const multi = Boolean(proseLines && proseLines.length > 1);
  const proseClass = block.type === 'heading'
    ? block.level === 3 ? 'text-xl font-semibold' : 'text-3xl font-semibold'
    : block.type === 'quote'
      ? 'border-l-2 border-accent pl-4 text-lg italic'
      : block.type === 'code'
        ? 'font-mono text-sm'
        : 'min-h-8 text-lg leading-8';

  return (
    <div className="group relative py-1 pl-10" onFocus={onFocus}>
      <div data-blurb-menu className={`absolute flex gap-0.5 text-gunSmoke ${multi ? 'left-5' : 'left-0'} ${showMenu ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'}`} style={{ top: 6 }}>
        {!multi && <button type="button" className="h-6 w-5 hover:text-quillGray" aria-label="Add below" onMouseDown={(event) => event.preventDefault()} onClick={() => onInsert(0)}>+</button>}
        <button type="button" className="h-6 w-5 text-xs tracking-tighter hover:text-quillGray" aria-label="Turn into" onMouseDown={(event) => event.preventDefault()} onClick={onTurn}>⋮⋮</button>
      </div>
      {multi && proseLines?.map((_, lineIndex) => (
        <button
          key={lineIndex}
          type="button"
          data-blurb-menu
          style={{ top: lineIndex * 32 + 6 }}
          className={`absolute left-0 h-6 w-5 text-gunSmoke hover:text-quillGray ${showMenu ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'}`}
          aria-label={`Add below line ${lineIndex + 1}`}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onInsert(lineIndex)}
        >
          +
        </button>
      ))}

      {showMenu && menu && (
        <div data-blurb-menu className="absolute left-10 z-20 w-64 overflow-hidden rounded-md border border-white/10 bg-[#161616] py-1 shadow-2xl" style={{ top: (menu.line ?? 0) * 32 + 32 }}>
          {commands.map((command, index) => (
            <button
              key={command.id}
              type="button"
              className={`flex w-full items-baseline justify-between px-3 py-1.5 text-left text-sm ${index === menu.index ? 'bg-white/10 text-white' : 'text-white/75'}`}
              onMouseDown={(event) => { event.preventDefault(); onChoose(command); }}
            >
              <span>{command.label}</span>
              <span className="text-[11px] text-white/35">{command.hint}</span>
            </button>
          ))}
          {commands.length === 0 && <p className="px-3 py-2 text-sm text-white/40">Nothing matches</p>}
          {menu.mode === 'turn' && (
            <div className="mt-1 border-t border-white/10 pt-1">
              <MenuAction label="Move up" onClick={() => onMove(-1)} />
              <MenuAction label="Move down" onClick={() => onMove(1)} />
              {block.type === 'image' && block.content && <MenuAction label="Use as cover" onClick={onCover} />}
              {block.type === 'image' && block.content && <MenuAction label="Use as social image" onClick={onSocial} />}
              <MenuAction label="Delete" onClick={onRemove} />
            </div>
          )}
          <button type="button" className="sr-only" onClick={onCloseMenu}>Close</button>
        </div>
      )}

      {linkFor && (
        <form className="absolute left-10 top-0 z-10 -translate-y-full" onSubmit={onApplyLink}>
          <input
            className="w-64 bg-[#161616] px-2 py-1 text-sm text-accent-light outline-none"
            placeholder="Paste a URL, then Enter"
            value={linkUrl}
            onChange={(event) => onLinkUrl(event.target.value)}
            onKeyDown={(event) => event.stopPropagation()}
          />
        </form>
      )}

      {busy && <p className="mb-1 text-xs font-ptMono text-accent-light">Uploading…</p>}

      {block.type === 'code' && (
        <input className={`${quiet} mb-1 text-xs text-gunSmoke`} placeholder="Language" value={block.language} onChange={(event) => patch({ language: event.target.value })} />
      )}

      {(block.type === 'paragraph' || block.type === 'heading' || block.type === 'quote' || block.type === 'code') && (
        <textarea
          ref={(element) => bindTextarea('content', element)}
          className={`${quiet} ${proseClass}`}
          rows={1}
          placeholder={
            block.type === 'paragraph' && !block.content
              ? (isFirstEmpty ? 'Type / for a photo, heading, list, or link' : 'Write…')
              : block.type === 'heading' ? 'Heading' : block.type === 'quote' ? 'Quote' : ''
          }
          value={block.content}
          onChange={(event) => onProseChange(block, event.target.value, event.target.selectionStart)}
          onKeyDown={(event) => onProseKeyDown(event, block)}
          onMouseUp={(event) => onSelect(block.key, 'content', event.currentTarget)}
          onFocus={onFocus}
        />
      )}

      {block.type === 'list' && (
        <ListBlock
          block={block}
          onPatch={patch}
          onFocus={onFocus}
          onSelect={(element) => onSelect(block.key, 'itemsText', element)}
          bind={(element) => bindTextarea('items', element)}
          onExit={onExitList}
          onMerge={onMergeList}
        />
      )}

      {block.type === 'image' && (
        <figure>
          {block.content ? (
            <img src={block.content} alt="" className="w-full cursor-pointer rounded-sm" onClick={() => openFiles('image')} />
          ) : (
            <button type="button" className="w-full py-10 text-left text-lg text-gunSmoke/50" onClick={() => openFiles('image')}>
              Choose a photo
            </button>
          )}
          <input className={`${quiet} mt-2 text-center text-sm italic text-gunSmoke`} placeholder="Caption" value={block.alt} onChange={(event) => patch({ alt: event.target.value })} />
        </figure>
      )}

      {block.type === 'carousel' && (
        <figure>
          <div className="grid grid-cols-2 gap-3">
            {block.images.map((image, imageIndex) => (
              <div
                key={`${image.src}-${imageIndex}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = 'move';
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  const from = dragFrom.current;
                  dragFrom.current = null;
                  if (from == null || from === imageIndex) return;
                  onImages((images) => {
                    if (from < 0 || from >= images.length) return images;
                    const next = [...images];
                    const [moved] = next.splice(from, 1);
                    next.splice(imageIndex, 0, moved);
                    return next;
                  });
                }}
              >
                <div className="relative">
                  <img
                    src={image.src}
                    alt=""
                    draggable
                    className="h-40 w-full cursor-grab rounded-sm bg-black/30 object-contain active:cursor-grabbing"
                    onDragStart={(event) => {
                      dragFrom.current = imageIndex;
                      event.dataTransfer.effectAllowed = 'move';
                      event.dataTransfer.setData('text/plain', String(imageIndex));
                    }}
                  />
                  <div className="absolute inset-x-1 top-1 flex items-center justify-between">
                    <span className="rounded-sm bg-black/70 px-1.5 py-0.5 font-ptMono text-[10px] text-white/80">{imageIndex + 1}</span>
                    <span className="flex gap-1">
                      <button type="button" className="rounded-sm bg-black/70 px-1.5 py-0.5 font-ptMono text-[11px] text-white hover:text-accent-light disabled:opacity-30" aria-label="Move earlier" disabled={imageIndex === 0} onClick={() => onImages((images) => moveImage(images, imageIndex, imageIndex - 1))}>←</button>
                      <button type="button" className="rounded-sm bg-black/70 px-1.5 py-0.5 font-ptMono text-[11px] text-white hover:text-accent-light disabled:opacity-30" aria-label="Move later" disabled={imageIndex === block.images.length - 1} onClick={() => onImages((images) => moveImage(images, imageIndex, imageIndex + 1))}>→</button>
                      <button type="button" className="rounded-sm bg-black/70 px-1.5 py-0.5 font-ptMono text-[11px] text-white hover:text-red-300" aria-label="Remove photo" onClick={() => onImages((images) => images.filter((_, index) => index !== imageIndex))}>×</button>
                    </span>
                  </div>
                </div>
                <input
                  className={`${quiet} mt-1 text-sm text-gunSmoke`}
                  placeholder="Caption"
                  value={image.alt}
                  onChange={(event) => {
                    const value = event.target.value;
                    onImages((images) => images.map((item, itemIndex) => itemIndex === imageIndex ? { ...item, alt: value } : item));
                  }}
                />
              </div>
            ))}
            <button type="button" className="flex h-40 items-center justify-center rounded-sm text-gunSmoke/50" onClick={() => openFiles('carousel')}>
              Add photos
            </button>
          </div>
          {block.images.length > 1 && <p className="mt-2 text-center font-ptMono text-[11px] text-gunSmoke/50">Drag a photo, or use the arrows, to change the order.</p>}
          <input className={`${quiet} mt-2 text-center text-sm italic text-gunSmoke`} placeholder="Caption for the set" value={block.caption} onChange={(event) => patch({ caption: event.target.value })} />
        </figure>
      )}

      {block.type === 'linkEmbed' && (
        <div className="my-2 rounded-sm border border-white/10 px-4 py-3">
          <input className={`${quiet} text-lg`} placeholder="Link title" value={block.title} onChange={(event) => patch({ title: event.target.value })} />
          <textarea ref={(element) => bindTextarea('title', element)} className={`${quiet} mt-1 text-sm text-gunSmoke`} rows={1} placeholder="A short note" value={block.description} onChange={(event) => patch({ description: event.target.value })} />
          <input className={`${quiet} mt-2 text-sm text-accent-light`} placeholder="https://" value={block.content} onChange={(event) => patch({ content: event.target.value })} />
          <button type="button" className="mt-2 text-xs font-ptMono text-gunSmoke hover:text-quillGray" onClick={() => openFiles('link')}>
            Upload a PDF or thumbnail
          </button>
        </div>
      )}

      {block.type === 'twitter' && (
        <input className={`${quiet} text-lg`} placeholder="Tweet link or ID" value={block.tweetId} onChange={(event) => patch({ tweetId: tweetIdFrom(event.target.value) })} />
      )}

      {block.type === 'tweetImage' && (
        <figure>
          {block.content ? <img src={block.content} alt="" className="w-full rounded-sm" /> : (
            <button type="button" className="py-8 text-lg text-gunSmoke/50" onClick={() => openFiles('shot')}>Choose the screenshot</button>
          )}
          <input className={`${quiet} mt-2 text-sm text-accent-light`} placeholder="Link to the tweet" value={block.tweetUrl} onChange={(event) => patch({ tweetUrl: event.target.value })} />
          <input className={`${quiet} mt-1 text-center text-sm italic text-gunSmoke`} placeholder="Caption" value={block.alt} onChange={(event) => patch({ alt: event.target.value })} />
        </figure>
      )}

      {block.type === 'video' && (
        <div>
          <input className={`${quiet} text-lg`} placeholder="YouTube link, or upload a video" value={block.content} onChange={(event) => patch({ content: event.target.value })} />
          <div className="mt-2 flex gap-4 text-xs font-ptMono text-gunSmoke">
            <button type="button" className="hover:text-quillGray" onClick={() => openFiles('video')}>Upload mp4</button>
            <button type="button" className="hover:text-quillGray" onClick={() => openFiles('poster')}>Poster image</button>
          </div>
          <input className={`${quiet} mt-2 text-center text-sm italic text-gunSmoke`} placeholder="Caption" value={block.alt} onChange={(event) => patch({ alt: event.target.value })} />
        </div>
      )}
    </div>
  );
}

function moveImage(images: { src: string; alt?: string }[], from: number, to: number) {
  if (to < 0 || to >= images.length || from === to) return images;
  const next = [...images];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

function ListBlock({
  block,
  onPatch,
  onFocus,
  onSelect,
  bind,
  onExit,
  onMerge,
}: {
  block: EditorBlock;
  onPatch: (partial: Partial<EditorBlock>) => void;
  onFocus: () => void;
  onSelect: (element: HTMLTextAreaElement) => void;
  bind: (element: HTMLTextAreaElement | null) => void;
  onExit: (before: string[], after: string[]) => void;
  onMerge: (item: string, rest: string[]) => void;
}) {
  const items = block.itemsText.length ? block.itemsText.split('\n') : [''];
  const write = (next: string[]) => onPatch({ itemsText: next.join('\n') });
  const pending = useRef<number | null>(null);
  const pendingPos = useRef(0);
  const refs = useRef<(HTMLTextAreaElement | null)[]>([]);

  useLayoutEffect(() => {
    const active = document.activeElement;
    const start = active instanceof HTMLTextAreaElement ? active.selectionStart : null;
    const end = active instanceof HTMLTextAreaElement ? active.selectionEnd : null;
    refs.current.forEach(resize);
    if (pending.current == null) {
      if (active instanceof HTMLTextAreaElement && start != null && end != null && document.activeElement === active) {
        active.setSelectionRange(start, end);
      }
      return;
    }
    const element = refs.current[pending.current];
    const pos = pendingPos.current;
    pending.current = null;
    if (!element) return;
    element.focus();
    element.setSelectionRange(pos, pos);
    resize(element);
  });

  return (
    <div>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <span className="pt-1 text-sm text-accent">▸</span>
          <textarea
            ref={(element) => { refs.current[index] = element; if (index === 0) bind(element); }}
            className={`${quiet} text-lg leading-8`}
            rows={1}
            placeholder={index === 0 ? 'List' : ''}
            value={item}
            onFocus={onFocus}
            onChange={(event) => write(items.map((line, lineIndex) => lineIndex === index ? event.target.value : line))}
            onMouseUp={(event) => onSelect(event.currentTarget)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && event.shiftKey) {
                event.preventDefault();
                return;
              }
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                if (!item.trim()) {
                  onExit(items.slice(0, index), items.slice(index + 1));
                  return;
                }
                const cursor = event.currentTarget.selectionStart;
                const next = [...items];
                const rest = item.slice(cursor);
                next[index] = item.slice(0, cursor);
                next.splice(index + 1, 0, rest);
                pending.current = index + 1;
                pendingPos.current = 0;
                write(next);
              }
              if (event.key === 'Backspace' && event.currentTarget.selectionStart === 0 && event.currentTarget.selectionEnd === 0 && index > 0) {
                event.preventDefault();
                const previous = items[index - 1] ?? '';
                const next = [...items];
                next[index - 1] = previous + item;
                next.splice(index, 1);
                pending.current = index - 1;
                pendingPos.current = previous.length;
                write(next);
              }
              if (event.key === 'Backspace' && event.currentTarget.selectionStart === 0 && event.currentTarget.selectionEnd === 0 && index === 0) {
                event.preventDefault();
                if (!item && items.length > 1) {
                  pending.current = 0;
                  pendingPos.current = 0;
                  write(items.slice(1));
                  return;
                }
                onMerge(item, items.slice(1));
              }
            }}
          />
        </div>
      ))}
    </div>
  );
}

function MenuAction({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className="block w-full px-3 py-1.5 text-left text-sm text-white/60 hover:bg-white/10 hover:text-white"
      onMouseDown={(event) => { event.preventDefault(); onClick(); }}
    >
      {label}
    </button>
  );
}

export default BlurbEditor;
