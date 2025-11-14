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
      <div className="space-y-2 md:space-y-4">
        {papers.map((paper, index) => {
          const [isHovered, setIsHovered] = useState(false);
          
          return (
            <div
              key={index}
              className={`
                cursor-pointer transition-all duration-200 rounded-sm
                ${isHovered ? 'bg-darkGrey/30 border-accent-light' : 'bg-transparent border-transparent'}
                border p-3 md:p-4
                block w-full
              `}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => window.open(paper.link, '_blank')}
            >
              {/* Mobile Layout */}
              <div className="block md:hidden">
                <div className="flex items-start gap-2 mb-3">
                  <div 
                    className={`
                      ${isHovered ? 'w-2 h-2' : 'w-1.5 h-1.5'} 
                      rounded-full bg-accent-light transition-all duration-200
                      flex-shrink-0 mt-1.5
                    `}
                  />
                  <span className={`
                    font-ptMono text-quillGray 
                    text-sm leading-tight
                    ${isHovered ? 'text-accent-light' : ''}
                    transition-colors duration-200
                    break-words flex-1
                  `}>
                    {paper.title}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pl-4">
                  <span className="text-xs text-gunSmoke font-ptMono px-2 py-1 bg-darkGrey/20 rounded-sm">
                    arXiv: {paper.arxivId}
                  </span>
                  <div className={`
                    transition-all duration-200
                    ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-70 -translate-x-1'}
                  `}>
                    <span className="text-accent-light text-sm">→</span>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex md:items-center md:justify-between md:gap-4">
                <div className="flex items-center flex-1 min-w-0 gap-3">
                  <div 
                    className={`
                      ${isHovered ? 'w-2 h-2' : 'w-1.5 h-1.5'} 
                      rounded-full bg-accent-light transition-all duration-200
                      flex-shrink-0
                    `}
                  />
                  
                  <span className={`
                    font-ptMono text-quillGray 
                    text-base lg:text-lg
                    ${isHovered ? 'text-accent-light' : ''}
                    transition-colors duration-200
                    leading-normal
                    truncate
                  `}>
                    {paper.title}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-sm text-gunSmoke font-ptMono px-2 py-1 bg-darkGrey/20 rounded-sm whitespace-nowrap">
                    arXiv: {paper.arxivId}
                  </span>
                  
                  <div className={`
                    transition-all duration-200
                    ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-70 -translate-x-1'}
                  `}>
                    <span className="text-accent-light text-lg">→</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PapersReading;
