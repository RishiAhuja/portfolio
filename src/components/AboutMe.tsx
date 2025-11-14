
import React, { useState } from 'react';
import ExpandedContainer from './ui/ExpandedContainer';
import { TypeAnimation } from 'react-type-animation';

const AboutMe: React.FC = () => {
  const [nameTyped, setNameTyped] = useState(false);
  
  // Resume download handler - updated to use Google Drive link
  const handleResumeDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://drive.google.com/file/d/1SpP3eBDUF2afMULBGsiF682-dN5kww0a/view?usp=sharing', '_blank');
  };

  return (
    <div className="flex flex-col items-start">
      <div className="text-4xl font-bold font-ptMono text-quillGray">
        <TypeAnimation
          sequence={[
            'Rishi', 
            () => setNameTyped(true)
          ]}
          speed={75}
          cursor={false}
        />
      </div>
      
      <div className="h-2" />
      
      <div className="text-lg font-ptMono text-gray-400">
        {nameTyped && (
          <TypeAnimation
            sequence={["A builder's logbook."]}
            speed={40}
            cursor={false}
          />
        )}
      </div>
      
      <div className="h-2.5" />
      
      <div className="w-4/5 h-px bg-darkGrey relative">
        <div className="absolute left-0 top-0 h-full w-1/3 bg-accent-light opacity-60"></div>
      </div>
      
      <div className="h-2.5" />
      
      <ExpandedContainer text="About Me" />
      
      <div className="h-3" />
      
      <p className="text-base font-ptMono text-quillGray">
        Hi, I&apos;m Rishi. I&apos;m an 18-year-old Entrepreneur-in-Residence (EIR) at{" "}
        <span className="text-accent-light font-semibold">iHub AwaDH, IIT Ropar</span>, where I&apos;m building AI-powered platforms for Indian agriculture.
      </p>
      
      <div className="h-3" />
      
      <p className="text-base font-ptMono text-quillGray">
        We recently presented our work to a delegation from the{" "}
        <span className="text-accent-light font-semibold">Government of India and MeitY</span>.
      </p>
      
      <div className="h-3" />
      
      <p className="text-base font-ptMono text-quillGray">
        By day, I&apos;m a B.Tech IT student at NIT Jalandhar, but I love to get my hands dirty and build things from scratch.
      </p>
      
      <div className="h-3" />
      
      <p className="text-base font-ptMono text-quillGray">
        I write about my process on{" "}
        <a 
          href="https://hashnode.com/@rishi2220" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-light underline decoration-1 decoration-accent-light/50 hover:decoration-accent-light transition-all"
        >
          Hashnode
        </a>
        {" "}and shitpost on{" "}
        <a 
          href="https://twitter.com/Rishi2220" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-light underline decoration-1 decoration-accent-light/50 hover:decoration-accent-light transition-all"
        >
          Twitter
        </a>
        . Check out my work below or see my{" "}
        <a 
          href="#" 
          onClick={handleResumeDownload}
          className="inline-flex items-center group"
        >
          <span className="text-accent-light underline decoration-1 decoration-accent-light/50 hover:decoration-accent-light transition-all">
            resume
          </span>
          <svg 
            className="w-3.5 h-3.5 ml-0.5 text-accent-light opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </a>
        .
      </p>
    </div>
  );
};

export default AboutMe;