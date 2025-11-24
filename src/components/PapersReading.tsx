import React, { useState } from 'react';
import ExpandedContainer from './ui/ExpandedContainer';

interface Paper {
  title: string;
  arxivId: string;
  year: string;
  link: string;
}

const PapersReading: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(5);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const papers: Paper[] = [
    {
      title: "Don’t Do RAG: When Cache-Augmented Generation is All You Need for Knowledge Tasks",
      arxivId: "2412.15605",
      year: "2024",
      link: "https://arxiv.org/abs/2412.15605"
    },
    {
      title: "Enhancing Cache-Augmented Generation (CAG) with Adaptive Contextual Compression for Scalable Knowledge Integration",
      arxivId: "2505.08261",
      year: "2024",
      link: "https://arxiv.org/abs/2505.08261"
    },
    {
      title: "Efficient Memory Management for Large Language Model Serving with PagedAttention",
      arxivId: "2309.06180",
      year: "2024",
      link: "https://arxiv.org/abs/2309.06180"
    },
    {
      title: "TeleAntiFraud-28k: An Audio-Text Slow-Thinking Dataset for Telecom Fraud Detection",
      arxivId: "2503.24115",
      year: "2025",
      link: "https://arxiv.org/abs/2503.24115"
    },
    {
      title: "Retrieval Augmented Time Series Forecasting",
      arxivId: "2411.08249",
      year: "2024/25",
      link: "https://arxiv.org/abs/2411.08249"
    },
    {
      title: "Attention Is All You Need",
      arxivId: "1706.03762",
      year: "2017",
      link: "https://arxiv.org/abs/1706.03762"
    },
    {
      title: "Dense Passage Retrieval for Open-Domain Question Answering",
      arxivId: "2004.04906",
      year: "2020",
      link: "https://arxiv.org/abs/2004.04906"
    },
    {
      title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
      arxivId: "2005.11401",
      year: "2020",
      link: "https://arxiv.org/abs/2005.11401"
    }
  ];

  return (
    <div className="flex flex-col">
      <ExpandedContainer text="Things I'm figuring out" />
      <div className="h-4" />
      <div className="flex flex-col space-y-2 md:space-y-4">
        {papers.slice(0, visibleCount).map((paper, index) => {
          const isHovered = hoveredIndex === index;

          return (
            <a
              key={index}
              href={paper.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block w-full py-2 md:py-3 border-b border-darkGrey/20 hover:border-accent-light/30 transition-colors duration-300"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Mobile Layout - Stacked */}
              <div className="flex md:hidden flex-col gap-1.5">
                <h3 className={`
                  font-ptMono text-sm font-medium
                  ${isHovered ? 'text-accent-light' : 'text-quillGray'}
                  transition-colors duration-300
                `}>
                  {paper.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="font-ptMono text-xs text-accent-light/80">
                    arXiv: {paper.arxivId}
                  </span>
                  <div className={`
                    transform transition-all duration-300
                    ${isHovered ? 'translate-x-0 opacity-100 text-accent-light' : '-translate-x-2 opacity-0'}
                  `}>
                    →
                  </div>
                </div>
              </div>

              {/* Desktop Layout - Horizontal */}
              <div className="hidden md:flex items-baseline gap-3 md:gap-8">
                {/* ID Column - Fixed width */}
                <div className="flex-shrink-0 w-40 font-ptMono text-xs text-accent-light/80 group-hover:text-accent-light transition-colors duration-300">
                  arXiv: {paper.arxivId}
                </div>

                {/* Content Column */}
                <div className="flex-grow flex items-baseline justify-between gap-4 min-w-0">
                  <h3 className={`
                    font-ptMono text-sm md:text-base font-medium truncate
                    ${isHovered ? 'text-accent-light' : 'text-quillGray'}
                    transition-colors duration-300
                  `}>
                    {paper.title}
                  </h3>

                  {/* Arrow */}
                  <div className={`
                    flex-shrink-0 transform transition-all duration-300
                    ${isHovered ? 'translate-x-0 opacity-100 text-accent-light' : '-translate-x-2 opacity-0'}
                  `}>
                    →
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {visibleCount < papers.length && (
        <button
          onClick={() => setVisibleCount(prev => Math.min(papers.length, prev + 5))}
          className="mt-6 font-ptMono text-sm text-accent-light hover:text-accent transition-colors duration-200 mx-auto block"
        >
          Show {Math.min(papers.length - visibleCount, 5)} more →
        </button>
      )}
    </div>
  );
};

export default PapersReading;
