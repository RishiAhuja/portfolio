import React, { useState } from 'react';
import ExpandedContainer from './ui/ExpandedContainer';

interface Paper {
  title: string;
  arxivId: string;
  year: string;
  link: string;
}

const PapersReading: React.FC = () => {
  const papers: Paper[] = [
    {
      title: "Advanced Real-Time Fraud Detection Using RAG-Based LLMs",
      arxivId: "2501.15290",
      year: "2025",
      link: "https://arxiv.org/abs/2501.15290"
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
      <div className="flex flex-col">
        {papers.map((paper, index) => {
          const [isHovered, setIsHovered] = useState(false);

          return (
            <a
              key={index}
              href={paper.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block w-full py-2 md:py-3 border-b border-darkGrey/20 hover:border-accent-light/30 transition-colors duration-300"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
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
    </div>
  );
};

export default PapersReading;
