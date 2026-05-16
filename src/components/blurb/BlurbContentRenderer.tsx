import React, { useEffect } from 'react';
import type { BlurbContent } from '../../data/blurb';
import ImageCarousel from './ImageCarousel';

interface BlurbContentRendererProps {
  content: BlurbContent[];
}

function renderInlineText(text: string): React.ReactNode[] {
  return text.split(/(`[^`]+`)/g).map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="rounded-sm bg-darkGrey/50 px-1.5 py-0.5 text-sm text-accent-light">
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
}

// Helper function to extract YouTube video ID from URL
function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

const BlurbContentRenderer: React.FC<BlurbContentRendererProps> = ({ content }) => {
  // Load Twitter widgets after component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).twttr?.widgets) {
      (window as any).twttr.widgets.load();
    }
  }, [content]);

  const renderContent = (item: BlurbContent, index: number) => {
    switch (item.type) {
      case 'heading':
        const HeadingTag = `h${item.level || 2}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag
            key={index}
            className={`font-ptMono font-semibold text-quillGray mb-4 ${
              item.level === 1 ? 'text-3xl' :
              item.level === 2 ? 'text-2xl' :
              item.level === 3 ? 'text-xl' :
              'text-lg'
            }`}
          >
            {item.content}
          </HeadingTag>
        );

      case 'paragraph':
        return (
          <p key={index} className="text-gunSmoke leading-relaxed mb-6 font-ptMono">
            {renderInlineText(item.content || '')}
          </p>
        );

      case 'image':
        return (
          <div key={index} className="mb-8">
            <div 
              className="relative w-full rounded-sm overflow-hidden bg-darkGrey/10 flex items-center justify-center"
              style={{ 
                height: '400px', // Fixed height for consistency
                aspectRatio: '16/10'
              }}
            >
              <img
                src={(item.content!)}
                alt={item.alt || 'Blurb image'}
                loading={index < 6 ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={index < 6 ? 'high' : 'auto'}
                className="blurb-media-image max-w-full max-h-full object-contain" // Preserves natural aspect ratio
              />
            </div>
            {item.alt && (
              <p className="text-sm text-gunSmoke font-ptMono mt-2 text-center italic">
                {item.alt}
              </p>
            )}
          </div>
        );

      case 'code':
        return (
          <div key={index} className="mb-8">
            <div className="border border-darkGrey/30 rounded-sm overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
              {item.language && (
                <div className="bg-darkGrey/50 px-4 py-2 text-xs font-ptMono text-gunSmoke border-b border-darkGrey/30">
                  {item.language}
                </div>
              )}
              <pre className="p-4 overflow-x-auto">
                <code className="text-sm font-ptMono text-quillGray whitespace-pre">
                  {item.content}
                </code>
              </pre>
            </div>
          </div>
        );

      case 'quote':
        return (
          <blockquote key={index} className="mb-8 border-l-4 border-accent pl-6 py-4 rounded-r-sm" style={{ backgroundColor: 'rgba(100, 178, 188, 0.05)' }}>
            <p className="text-lg font-ptMono text-quillGray italic leading-relaxed">
              "{renderInlineText(item.content || '')}"
            </p>
          </blockquote>
        );

      case 'list':
        return (
          <ul key={index} className="mb-8 space-y-2">
            {item.items?.map((listItem, listIndex) => (
              <li key={listIndex} className="flex items-start gap-3 text-gunSmoke font-ptMono">
                <span className="text-accent mt-2 text-xs">▸</span>
                <span>{renderInlineText(listItem)}</span>
              </li>
            ))}
          </ul>
        );

      case 'twitter':
        // Only render if we have a valid tweet ID (real Twitter IDs are typically 19 digits)
        if (!item.tweetId || item.tweetId.length < 15) {
          // Skip invalid tweet IDs
          return null;
        }
        
        return (
          <div key={index} className="mb-8 flex justify-center">
            <div className="max-w-xl w-full">
              {/* Real Twitter embed using Twitter's official embed API */}
              <blockquote className="twitter-tweet" data-theme="dark">
                <a href={`https://twitter.com/i/status/${item.tweetId}`}>
                  Loading tweet...
                </a>
              </blockquote>
              
              {/* Fallback iframe if Twitter widget doesn't load */}
              <div className="mt-4">
                <iframe
                  src={`https://twitframe.com/show?url=https://twitter.com/i/status/${item.tweetId}`}
                  className="w-full border border-darkGrey/30 rounded-sm"
                  style={{ 
                    backgroundColor: '#1a1a1a',
                    minHeight: '300px',
                    height: '400px'
                  }}
                  frameBorder="0"
                  scrolling="no"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        );

      case 'tweetImage':
        return (
          <div key={index} className="mb-8">
            <div 
              className="relative w-full rounded-sm overflow-hidden bg-darkGrey/10 flex items-center justify-center"
              style={{ 
                height: '400px', // Fixed height for consistency
                aspectRatio: '16/10'
              }}
            >
              <img
                src={item.content!}
                alt={item.alt || 'Tweet screenshot'}
                className="max-w-full max-h-full object-contain" // Preserves natural aspect ratio
              />
            </div>
            <div className="text-center mt-3">
              {item.alt && (
                <p className="text-sm text-gunSmoke font-ptMono mb-2 italic">
                  {item.alt}
                </p>
              )}
              {item.tweetUrl && (
                <a 
                  href={item.tweetUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 font-ptMono transition-colors"
                >
                  <span>🐦</span>
                  View original tweet
                </a>
              )}
            </div>
          </div>
        );

      case 'linkEmbed':
        const domain = item.domain || (item.content ? new URL(item.content).hostname : '');
        return (
          <div key={index} className="mb-8">
            <a 
              href={item.content} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block border border-darkGrey/30 rounded-sm overflow-hidden hover:border-accent/50 transition-colors bg-darkGrey/20 hover:bg-darkGrey/30"
            >
              <div className="flex">
                {item.image && (
                  <div className="w-32 h-24 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title || 'Link preview'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 p-4">
                  <div className="text-xs text-gunSmoke font-ptMono mb-1 uppercase tracking-wide">
                    {domain}
                  </div>
                  {item.title && (
                    <h3 className="text-quillGray font-ptMono font-semibold text-sm mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                  )}
                  {item.description && (
                    <p className="text-gunSmoke font-ptMono text-xs line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-accent text-xs">→</span>
                    <span className="text-accent font-ptMono text-xs">Visit link</span>
                  </div>
                </div>
              </div>
            </a>
          </div>
        );

      case 'carousel':
        return (
          <ImageCarousel
            key={index}
            images={item.images || []}
            caption={item.caption}
            priority={index < 6}
          />
        );

      case 'video':
        const isYouTube = item.content?.includes('youtube.com') || item.content?.includes('youtu.be');
        
        if (isYouTube) {
          // Extract YouTube video ID
          const videoId = extractYouTubeId(item.content || '');
          if (!videoId) return null;
          
          return (
            <div key={index} className="mb-8">
              <div className="relative w-full rounded-sm overflow-hidden bg-darkGrey/10" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={item.alt || 'YouTube video'}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {item.alt && (
                <p className="text-sm text-gunSmoke font-ptMono mt-2 text-center italic">
                  {item.alt}
                </p>
              )}
            </div>
          );
        } else {
          // Local video file
          return (
            <div key={index} className="mb-8">
              <div className="relative w-full rounded-sm overflow-hidden bg-darkGrey/10">
                <video
                  className="w-full h-auto"
                  controls
                  poster={item.poster}
                  preload="metadata"
                >
                  <source src={item.content} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              {item.alt && (
                <p className="text-sm text-gunSmoke font-ptMono mt-2 text-center italic">
                  {item.alt}
                </p>
              )}
            </div>
          );
        }

      default:
        return null;
    }
  };

  return (
    <div className="prose prose-lg max-w-none">
      {content.map((item, index) => renderContent(item, index))}
    </div>
  );
};

export default BlurbContentRenderer;
