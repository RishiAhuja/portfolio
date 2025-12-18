
import React, { useState } from 'react';
import { TypeAnimation } from 'react-type-animation';

const AboutMe: React.FC = () => {
  const [nameTyped, setNameTyped] = useState(false);

  // Resume download handler
  const handleResumeDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('https://drive.google.com/file/d/16paBtFuAfVC34CCNgM-266I6e4X_SxKu/view?usp=sharing', '_blank');
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
              A builder&apos;s logbook.
            </span>
          )}
        </div>
      </div>

      {/* Bio Section */}
      <div className="w-full space-y-6 text-base md:text-lg font-ptMono text-quillGray leading-relaxed">
        <p>
          Hi, I&apos;m Rishi. I&apos;m an 18-year-old <span className="text-accent-light">Entrepreneur-in-Residence (EIR)</span> at{" "}
          <span className="text-accent-light">iHub AwaDH, IIT Ropar</span>, where I&apos;m building AI-powered platforms for Indian agriculture.
        </p>

        <p>
          We recently presented our work to a delegation from the{" "}
          <span className="text-accent-light">Government of India and MeitY</span>.
        </p>

        <p>
          By day, I&apos;m a B.Tech IT student at NIT Jalandhar, but I love to get my hands dirty and build things from scratch.
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
          <a
            href="#"
            onClick={handleResumeDownload}
            className="text-accent-light hover:text-accent-light/80 underline decoration-1 decoration-accent-light/30 hover:decoration-accent-light transition-all inline-flex items-center group font-medium"
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
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default AboutMe;