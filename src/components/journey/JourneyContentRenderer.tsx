'use client';

import React from 'react';
import Image from 'next/image';
import { JourneyContent } from '@/data/journey';

interface JourneyContentRendererProps {
  content: JourneyContent[];
}

const JourneyContentRenderer: React.FC<JourneyContentRendererProps> = ({ content }) => {
  const renderContent = (item: JourneyContent, index: number) => {
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
            {item.content}
          </p>
        );

      case 'image':
        return (
          <div key={index} className="mb-8">
            <div className="relative w-full h-64 md:h-96 rounded-sm overflow-hidden">
              <Image
                src={item.content!}
                alt={item.alt || 'Journey image'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
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
              "{item.content}"
            </p>
          </blockquote>
        );

      case 'list':
        return (
          <ul key={index} className="mb-8 space-y-2">
            {item.items?.map((listItem, listIndex) => (
              <li key={listIndex} className="flex items-start gap-3 text-gunSmoke font-ptMono">
                <span className="text-accent mt-2 text-xs">▸</span>
                <span>{listItem}</span>
              </li>
            ))}
          </ul>
        );

      case 'twitter':
        return (
          <div key={index} className="mb-8 flex justify-center">
            <div className="max-w-lg w-full border border-darkGrey/30 rounded-sm p-6" style={{ backgroundColor: '#1a1a1a' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-ptMono text-sm text-quillGray font-semibold">@username</p>
                  <p className="font-ptMono text-xs text-gunSmoke">Twitter</p>
                </div>
              </div>
              <p className="text-gunSmoke font-ptMono text-sm leading-relaxed mb-4">
                This is a placeholder for Twitter embed with ID: {item.tweetId}
              </p>
              <div className="flex items-center gap-4 text-xs text-gunSmoke font-ptMono">
                <span>12:34 PM · Jul 11, 2025</span>
                <span>·</span>
                <span className="text-accent">View on Twitter</span>
              </div>
            </div>
          </div>
        );

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

export default JourneyContentRenderer;
