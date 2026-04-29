
import React, { useState } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { LINKS } from '../lib/constants';

const AboutMe: React.FC = () => {
  const [nameTyped, setNameTyped] = useState(false);

  // Resume download handler
  const handleResumeDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(LINKS.RESUME, '_blank');
  };

  return (
    <div className="flex flex-col items-start">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-5xl md:text-6xl font-bold font-ptMono text-quillGray mb-4 tracking-tight">
          <TypeAnimation
            sequence={[
              'Rishi',
              () => setNameTyped(true)
            ]}
            speed={75}
            cursor={false}
          />
        </h1>

        <div className="text-lg md:text-xl font-ptMono text-gunSmoke min-h-[30px]">
          {nameTyped && (
            <span className="animate-fade-in">
              Building systems, publishing papers, taking notes.
            </span>
          )}
        </div>
      </div>

      {/* Bio Section */}
      <div className="w-full space-y-6 text-base md:text-lg font-ptMono text-quillGray leading-relaxed">
        <p>
          Hi, I&apos;m Rishi. I&apos;m an 18-year-old builder, researcher, and engineer.
        </p>

        <p>
          In April 2026, I presented my <span className="text-accent-light">ICLR 2026</span> TSALM workshop paper in{" "}
          <span className="text-accent-light">Rio de Janeiro</span>. This August, I&apos;ll be presenting{" "}
          <span className="text-accent-light">ICFD-31k</span> at <span className="text-accent-light">IJCAI-ECAI 2026</span> in{" "}
          <span className="text-accent-light">Bremen, Germany</span> after its acceptance to the main conference special track.
        </p>

        <p>
          I also work as a <span className="text-accent-light">Founding DevOps Engineer</span> at{" "}
          <span className="text-accent-light">Zenbase (Singapore)</span>, building <em>Ninja</em> — and by day, I&apos;m a B.Tech IT student at{" "}
          <span className="text-accent-light">NIT Jalandhar</span>.
        </p>

        <p className="text-gunSmoke pt-2">
          I write about my process on{" "}
          <a
            href="https://hashnode.com/@rishi2220"
            target="_blank"
            rel="noopener noreferrer"
            className="text-quillGray hover:text-accent-light underline decoration-1 decoration-darkGrey hover:decoration-accent-light transition-all"
          >
            Hashnode
          </a>
          {" "}and shitpost on{" "}
          <a
            href="https://twitter.com/Rishi2220"
            target="_blank"
            rel="noopener noreferrer"
            className="text-quillGray hover:text-accent-light underline decoration-1 decoration-darkGrey hover:decoration-accent-light transition-all"
          >
            Twitter
          </a>
          . Check out my work below or see my{" "}
          <button
            onClick={handleResumeDownload}
            className="text-accent-light hover:text-accent-light/80 underline decoration-1 decoration-accent-light/30 hover:decoration-accent-light transition-all inline-flex items-center group font-medium bg-transparent border-0 cursor-pointer p-0"
          >
            resume
            <svg
              className="w-3.5 h-3.5 ml-1 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>.
        </p>
      </div>
    </div>
  );
};

export default AboutMe;
