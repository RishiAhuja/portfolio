import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  images: { src: string; alt: string }[];
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

const fieldClass =
  'w-full bg-darkGrey/40 border border-darkGrey rounded-sm px-3 py-2 text-sm font-ptMono text-quillGray placeholder:text-gunSmoke/50 focus:outline-none focus:border-accent-light/60';
const labelClass = 'block text-[11px] uppercase tracking-[0.08em] text-gunSmoke font-ptMono mb-1';
const tinyButton =
  'px-2 py-1 border border-darkGrey rounded-sm text-[11px] font-ptMono text-gunSmoke hover:text-quillGray hover:border-gunSmoke/50';

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
  const post: BlurbPost = {
    id: slug,
    title: draft.title.trim(),
    description: draft.description.trim(),
    slug,
    publishedDate: draft.publishedDate,
    tags,
    category: draft.category,
    status: draft.status,
    content: draft.blocks.map(exportBlock).filter((block): block is BlurbContent => Boolean(block)),
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

const BlurbEditor: React.FC<{ token: string }> = ({ token }) => {
  const [draft, setDraft] = useState<Draft>(() => loadDraft() ?? emptyDraft());
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const textareas = useRef<Record<string, HTMLTextAreaElement | null>>({});

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft]);

  const post = useMemo(() => toPost(draft), [draft]);
  const json = useMemo(() => JSON.stringify(post, null, 2), [post]);

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

  const insertAfter = (key: string | null, type: BlockType) => {
    const block = createBlock(type);
    setDraft((current) => {
      if (!key) return { ...current, blocks: [...current.blocks, block] };
      const index = current.blocks.findIndex((item) => item.key === key);
      const blocks = [...current.blocks];
      blocks.splice(index + 1, 0, block);
      return { ...current, blocks };
    });
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
  };

  const removeBlock = (key: string) => {
    setDraft((current) => ({
      ...current,
      blocks: current.blocks.filter((block) => block.key !== key),
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
    if (!response.ok) {
      throw new Error(body.error || 'Could not start the upload.');
    }
    const uploaded = await fetch(body.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type || 'application/octet-stream' },
      body: file,
    });
    if (!uploaded.ok) {
      throw new Error('The file did not upload.');
    }
    return body.publicUrl as string;
  };

  const uploadInto = async (key: string, file: File, target: 'content' | 'image' | 'poster') => {
    setBusyKey(key);
    setError('');
    try {
      const url = await uploadFile(file);
      patchBlock(key, { [target]: url });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed.');
    } finally {
      setBusyKey(null);
    }
  };

  const uploadCarousel = async (key: string, files: File[]) => {
    setBusyKey(key);
    setError('');
    try {
      const images: { src: string; alt: string }[] = [];
      for (const file of files) {
        images.push({ src: await uploadFile(file), alt: '' });
      }
      setDraft((current) => ({
        ...current,
        blocks: current.blocks.map((block) =>
          block.key === key ? { ...block, images: [...block.images, ...images] } : block
        ),
      }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed.');
    } finally {
      setBusyKey(null);
    }
  };

  const insertLink = (key: string, field: 'content' | 'itemsText') => {
    const block = draft.blocks.find((item) => item.key === key);
    if (!block) return;
    const url = window.prompt('Link URL', 'https://');
    if (!url) return;
    const element = textareas.current[`${key}:${field}`];
    const source = block[field];
    const start = element?.selectionStart ?? source.length;
    const end = element?.selectionEnd ?? start;
    const selected = source.slice(start, end);
    const label = selected || window.prompt('Words that should be the link', 'link') || 'link';
    const next = `${source.slice(0, start)}[${label}](${url.trim()})${source.slice(end)}`;
    patchBlock(key, { [field]: next });
  };

  const copyJson = async () => {
    if (busyKey) {
      setError('Wait for the upload to finish.');
      return;
    }
    if (!post.title || !post.slug || !post.description) {
      setError('Add a title, slug, and short description before copying.');
      return;
    }
    const brokenLink = post.content.find(
      (block) => block.type === 'linkEmbed' && block.content && !/^https?:\/\//.test(block.content)
    );
    if (brokenLink) {
      setError('Link cards need a full https:// URL.');
      return;
    }
    await navigator.clipboard.writeText(json);
    setError('');
    setNotice('JSON copied. Send that and it can go into the site.');
  };

  const downloadJson = () => {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${post.slug || 'blurb'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const startNew = () => {
    if (!window.confirm('Start a new blurb? Copy the JSON first if you still need this one.')) return;
    const next = emptyDraft();
    setDraft(next);
    setNotice('');
    setError('');
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
      setShowImport(false);
      setImportText('');
      setNotice('Loaded that JSON back into the editor.');
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : 'Could not read that JSON.');
    }
  };

  const onPasteFiles = (event: React.ClipboardEvent) => {
    const images = Array.from(event.clipboardData.files).filter((file) => file.type.startsWith('image/'));
    if (images.length === 0) return;
    event.preventDefault();
    const block = createBlock(images.length > 1 ? 'carousel' : 'image');
    setDraft((current) => ({ ...current, blocks: [...current.blocks, block] }));
    if (images.length > 1) {
      void uploadCarousel(block.key, images);
    } else {
      void uploadInto(block.key, images[0], 'content');
    }
  };

  return (
    <div className="space-y-6" onPaste={onPasteFiles}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-ptMono text-quillGray">Write a blurb</h2>
          <p className="text-sm font-ptMono text-gunSmoke mt-1 max-w-2xl">
            Write here. Images upload straight to the site. Nothing is published until the JSON is added to the site.
            A published blurb is still only a link unless it is also attached to the ledger.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={tinyButton} onClick={() => setShowPreview((value) => !value)}>
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          <button type="button" className={tinyButton} onClick={() => setShowImport((value) => !value)}>
            Load JSON
          </button>
          <button type="button" className={tinyButton} onClick={startNew}>
            New
          </button>
        </div>
      </div>

      {error && <p className="text-sm font-ptMono text-red-300">{error}</p>}
      {notice && <p className="text-sm font-ptMono text-accent-light">{notice}</p>}

      {showImport && (
        <div className="space-y-2">
          <textarea
            className={`${fieldClass} min-h-32`}
            placeholder="Paste a blurb JSON to keep editing it"
            value={importText}
            onChange={(event) => setImportText(event.target.value)}
          />
          <button type="button" className={tinyButton} onClick={importJson}>
            Load into editor
          </button>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <label>
          <span className={labelClass}>Title</span>
          <input className={fieldClass} value={draft.title} onChange={(event) => patchMeta({ title: event.target.value })} />
        </label>
        <label>
          <span className={labelClass}>Slug</span>
          <input
            className={fieldClass}
            value={draft.slug}
            onChange={(event) => patchMeta({ slug: slugify(event.target.value), slugTouched: true })}
          />
        </label>
        <label className="md:col-span-2">
          <span className={labelClass}>Subtitle</span>
          <input className={fieldClass} value={draft.subtitle} onChange={(event) => patchMeta({ subtitle: event.target.value })} />
        </label>
        <label className="md:col-span-2">
          <span className={labelClass}>Short description</span>
          <textarea
            className={`${fieldClass} min-h-20`}
            value={draft.description}
            onChange={(event) => patchMeta({ description: event.target.value })}
          />
        </label>
        <label>
          <span className={labelClass}>Date</span>
          <input className={fieldClass} type="date" value={draft.publishedDate} onChange={(event) => patchMeta({ publishedDate: event.target.value })} />
        </label>
        <label>
          <span className={labelClass}>Category</span>
          <select className={fieldClass} value={draft.category} onChange={(event) => patchMeta({ category: event.target.value as Draft['category'] })}>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>
        <label>
          <span className={labelClass}>Tags, comma separated</span>
          <input className={fieldClass} value={draft.tags} onChange={(event) => patchMeta({ tags: event.target.value })} />
        </label>
        <label>
          <span className={labelClass}>Status</span>
          <select className={fieldClass} value={draft.status} onChange={(event) => patchMeta({ status: event.target.value as Draft['status'] })}>
            <option value="published">published, shareable link</option>
            <option value="draft">draft, stays off the site</option>
          </select>
        </label>
      </div>

      <p className="text-xs font-ptMono text-gunSmoke">
        {post.slug ? `https://rishia.in/blurb/${post.slug}/` : 'The slug becomes the link.'}
        {' '}Saved in this browser.
      </p>

      {showPreview ? (
        <div className="border border-darkGrey rounded-sm p-4 md:p-8 bg-codGray">
          <h1 className="text-3xl font-ptMono text-quillGray mb-2">{post.title || 'Untitled'}</h1>
          {post.subtitle && <p className="text-gunSmoke font-ptMono mb-6">{post.subtitle}</p>}
          <BlurbContentRenderer content={post.content} />
        </div>
      ) : (
        <div className="space-y-4">
          {draft.blocks.map((block, index) => (
            <article key={block.key} className="border border-darkGrey/80 rounded-sm p-3 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] uppercase tracking-wide font-ptMono text-accent-light">
                  {BLOCK_TYPES.find(([type]) => type === block.type)?.[1]}
                </span>
                <span className="text-[11px] font-ptMono text-gunSmoke">{index + 1}</span>
                <button type="button" className={tinyButton} onClick={() => moveBlock(block.key, -1)}>Up</button>
                <button type="button" className={tinyButton} onClick={() => moveBlock(block.key, 1)}>Down</button>
                <button type="button" className={tinyButton} onClick={() => removeBlock(block.key)}>Remove</button>
                {busyKey === block.key && <span className="text-[11px] font-ptMono text-accent-light">Uploading…</span>}
              </div>

              {block.type === 'heading' && (
                <select className={fieldClass} value={block.level} onChange={(event) => patchBlock(block.key, { level: Number(event.target.value) })}>
                  <option value={2}>Section</option>
                  <option value={3}>Smaller heading</option>
                </select>
              )}

              {(block.type === 'paragraph' || block.type === 'heading' || block.type === 'quote' || block.type === 'code') && (
                <textarea
                  ref={(element) => { textareas.current[`${block.key}:content`] = element; }}
                  className={`${fieldClass} min-h-28`}
                  placeholder={block.type === 'heading' ? 'Heading' : 'Write…'}
                  value={block.content}
                  onChange={(event) => patchBlock(block.key, { content: event.target.value })}
                />
              )}

              {block.type === 'code' && (
                <input className={fieldClass} placeholder="language, optional" value={block.language} onChange={(event) => patchBlock(block.key, { language: event.target.value })} />
              )}

              {(block.type === 'paragraph' || block.type === 'quote') && (
                <button type="button" className={tinyButton} onClick={() => insertLink(block.key, 'content')}>
                  Insert link at cursor
                </button>
              )}

              {block.type === 'list' && (
                <>
                  <textarea
                    ref={(element) => { textareas.current[`${block.key}:itemsText`] = element; }}
                    className={`${fieldClass} min-h-28`}
                    placeholder="One item per line"
                    value={block.itemsText}
                    onChange={(event) => patchBlock(block.key, { itemsText: event.target.value })}
                  />
                  <button type="button" className={tinyButton} onClick={() => insertLink(block.key, 'itemsText')}>
                    Insert link at cursor
                  </button>
                </>
              )}

              {(block.type === 'image' || block.type === 'tweetImage' || block.type === 'video') && (
                <>
                  <input className={fieldClass} placeholder={block.type === 'video' ? 'Video or YouTube URL' : 'Image URL'} value={block.content} onChange={(event) => patchBlock(block.key, { content: event.target.value })} />
                  <input className={fieldClass} placeholder="Caption" value={block.alt} onChange={(event) => patchBlock(block.key, { alt: event.target.value })} />
                  {block.content && block.type !== 'video' && (
                    <img src={block.content} alt="" className="max-h-64 rounded-sm" />
                  )}
                </>
              )}

              {block.type === 'image' && (
                <div className="flex flex-wrap gap-2">
                  <FileButton label="Upload image" accept="image/jpeg,image/png,image/webp,image/gif" onFile={(file) => uploadInto(block.key, file, 'content')} />
                  <button type="button" className={tinyButton} onClick={() => patchMeta({ coverImage: block.content })} disabled={!block.content}>Use as cover</button>
                  <button type="button" className={tinyButton} onClick={() => patchMeta({ socialImage: block.content })} disabled={!block.content}>Use as social image</button>
                </div>
              )}

              {block.type === 'carousel' && (
                <>
                  <FileButton label="Add photos" accept="image/jpeg,image/png,image/webp,image/gif" multiple onFiles={(files) => uploadCarousel(block.key, files)} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    {block.images.map((image, imageIndex) => (
                      <div key={`${image.src}-${imageIndex}`} className="space-y-2">
                        <img src={image.src} alt="" className="h-36 w-full object-cover rounded-sm" />
                        <input
                          className={fieldClass}
                          placeholder="Caption for this photo"
                          value={image.alt}
                          onChange={(event) => {
                            const images = block.images.map((item, itemIndex) =>
                              itemIndex === imageIndex ? { ...item, alt: event.target.value } : item
                            );
                            patchBlock(block.key, { images });
                          }}
                        />
                        <button
                          type="button"
                          className={tinyButton}
                          onClick={() => patchBlock(block.key, { images: block.images.filter((_, itemIndex) => itemIndex !== imageIndex) })}
                        >
                          Remove photo
                        </button>
                      </div>
                    ))}
                  </div>
                  <input className={fieldClass} placeholder="Caption under the carousel" value={block.caption} onChange={(event) => patchBlock(block.key, { caption: event.target.value })} />
                </>
              )}

              {block.type === 'linkEmbed' && (
                <>
                  <input className={fieldClass} placeholder="https://…" value={block.content} onChange={(event) => patchBlock(block.key, { content: event.target.value })} />
                  <input className={fieldClass} placeholder="Title" value={block.title} onChange={(event) => patchBlock(block.key, { title: event.target.value })} />
                  <textarea className={`${fieldClass} min-h-20`} placeholder="Short note, optional" value={block.description} onChange={(event) => patchBlock(block.key, { description: event.target.value })} />
                  <div className="flex flex-wrap gap-2 items-center">
                    <FileButton label="Upload a file for this link" accept="image/jpeg,image/png,image/webp,image/gif,application/pdf" onFile={async (file) => {
                      setBusyKey(block.key);
                      try {
                        const url = await uploadFile(file);
                        patchBlock(block.key, file.type === 'application/pdf' ? { content: url, title: block.title || file.name } : { image: url });
                      } catch (uploadError) {
                        setError(uploadError instanceof Error ? uploadError.message : 'Upload failed.');
                      } finally {
                        setBusyKey(null);
                      }
                    }} />
                    <span className="text-[11px] font-ptMono text-gunSmoke">A PDF becomes the link. An image becomes the card thumbnail.</span>
                  </div>
                </>
              )}

              {block.type === 'twitter' && (
                <input className={fieldClass} placeholder="Tweet ID" value={block.tweetId} onChange={(event) => patchBlock(block.key, { tweetId: event.target.value })} />
              )}

              {block.type === 'tweetImage' && (
                <>
                  <input className={fieldClass} placeholder="Link to the tweet" value={block.tweetUrl} onChange={(event) => patchBlock(block.key, { tweetUrl: event.target.value })} />
                  <FileButton label="Upload screenshot" accept="image/jpeg,image/png,image/webp,image/gif" onFile={(file) => uploadInto(block.key, file, 'content')} />
                </>
              )}

              {block.type === 'video' && (
                <>
                  <FileButton label="Upload mp4" accept="video/mp4" onFile={(file) => uploadInto(block.key, file, 'content')} />
                  <FileButton label="Upload poster" accept="image/jpeg,image/png,image/webp" onFile={(file) => uploadInto(block.key, file, 'poster')} />
                </>
              )}

              <div className="flex flex-wrap gap-1 pt-1">
                {BLOCK_TYPES.map(([type, label]) => (
                  <button key={type} type="button" className={tinyButton} onClick={() => insertAfter(block.key, type)}>
                    + {label}
                  </button>
                ))}
              </div>
            </article>
          ))}

          {draft.blocks.length === 0 && (
            <div className="flex flex-wrap gap-1">
              {BLOCK_TYPES.map(([type, label]) => (
                <button key={type} type="button" className={tinyButton} onClick={() => insertAfter(null, type)}>
                  + {label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="sticky bottom-3 flex flex-wrap gap-2 bg-codGray/95 border border-darkGrey rounded-sm p-3">
        <button
          type="button"
          onClick={copyJson}
          className="px-4 py-2 bg-accent-light/10 border border-accent-light/40 rounded-sm text-accent-light font-ptMono text-sm hover:bg-accent-light hover:text-codGray"
        >
          Copy JSON
        </button>
        <button type="button" className={tinyButton} onClick={downloadJson}>
          Download JSON
        </button>
        <span className="text-[11px] font-ptMono text-gunSmoke self-center">
          {post.content.length} blocks · paste an image anywhere to drop it in
        </span>
      </div>
    </div>
  );
};

function FileButton({
  label,
  accept,
  multiple,
  onFile,
  onFiles,
}: {
  label: string;
  accept: string;
  multiple?: boolean;
  onFile?: (file: File) => void;
  onFiles?: (files: File[]) => void;
}) {
  return (
    <label className={`${tinyButton} cursor-pointer`}>
      {label}
      <input
        className="hidden"
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(event) => {
          const files = Array.from(event.target.files || []);
          event.target.value = '';
          if (files.length === 0) return;
          if (onFiles) onFiles(files);
          else if (onFile) onFile(files[0]);
        }}
      />
    </label>
  );
}

export default BlurbEditor;
