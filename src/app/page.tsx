'use client';

import AboutMe from '@/components/AboutMe';
import TechStacks from '@/components/TechStacks';
import Projects from '@/components/Projects';
import BlogPosts from '@/components/BlogPosts';
import Experience from '@/components/Experience';
import EducationTimeline from '@/components/EducationTimeline';
import ContactSocial from '@/components/ContactSocial';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import BackToTop from '@/components/ui/BackToTop';
import ExpandedContainer from '@/components/ui/ExpandedContainer';
import { useEffect, useState } from 'react';
import FadeInSection from '@/components/ui/FadeInSection';
import JsonLd from '@/components/JsonLd';
import Link from 'next/link';

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Rishi Ahuja",
    "url": "https://rishia.in",
    "jobTitle": "Full Flutter Stack Developer",
    "sameAs": [
      "https://github.com/RishiAhuja",
      "https://www.linkedin.com/in/rishi-ahuja-b1a224310",
      "https://twitter.com/Rishi2220"
    ],
    "knowsAbout": ["Web Development", "Mobile Development", "UI/UX Design", "Flutter", "React", "TypeScript"],
    "workExample": [
      {
        "@type": "CreativeWork",
        "name": "Fern",
        "url": "https://fern.rishia.in"
      },
      {
        "@type": "CreativeWork",
        "name": "Nexus",
        "url": "https://nexus.rishia.in"
      }
    ]
  };
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 800);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center">
      <JsonLd data={schema} />
      <Navigation /> {/* Add Navigation component */}
      
      {/* Timeline Navigation - Non-fixed */}
      <div className="absolute top-0 right-0 z-40">
        <a 
          href="/timeline" 
          className="group flex items-center gap-2 bg-bgShades-light/80 backdrop-blur-sm border-l border-b border-darkGrey/30 px-4 py-3 
          text-quillGray hover:text-accent transition-all duration-300 font-ptMono text-sm"
        >
          <span>Year One</span>
          <svg className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1 opacity-70 group-hover:opacity-100" 
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
      </div>
      
      <div className={`${isMobile ? 'w-full' : 'w-[65%]'} p-8`}>
        <section id="about">
          <AboutMe />
        </section>
        
        <div className="h-8" />
        
        <section id="tech">
          <FadeInSection>
            <TechStacks />
          </FadeInSection>
        </section>
        
        <div className="h-8" />
        
        <section id="projects">
          <FadeInSection delay={100}>
            <Projects />
          </FadeInSection>
        </section>
        
        <div className="h-8" />
        
        <section id="blog">
          <FadeInSection delay={150}>
            <BlogPosts />
          </FadeInSection>
        </section>
        
        <div className="h-8" />
        
        <section id="experience">
          <FadeInSection delay={200}>
            <Experience />
          </FadeInSection>
        </section>
        
        <div className="h-8" />
        
        <section id="education">
          <FadeInSection delay={250}>
            <EducationTimeline />
          </FadeInSection>
        </section>
        
        <div className="h-8" />
        
        <section id="contact">
          <FadeInSection delay={300}>
            <ContactSocial />
          </FadeInSection>
        </section>
        
        <div className="h-8" />
        
        {/* Quick Links Section */}
        {/* <section id="explore">
          <FadeInSection delay={200}>
            <div className="flex flex-col">
              <ExpandedContainer text="Explore More" />
              <div className="h-4" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link 
                  href="/gallery"
                  className="group relative border border-darkGrey/30 rounded-sm p-6 transition-all duration-300
                    hover:border-accent/50 hover:shadow-[0_4px_20px_-12px_rgba(100,178,188,0.15)] hover:transform hover:-translate-y-0.5"
                  style={{ backgroundColor: '#191919' }}
                > */}
                  {/* Accent corner */}
                  {/* <div className="absolute top-0 right-0 w-0 h-0 transition-all duration-300
                    border-t-[20px] border-r-[20px] 
                    group-hover:border-t-accent group-hover:border-r-accent border-t-transparent border-r-transparent">
                  </div>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-sm flex items-center justify-center">
                      <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-ptMono text-lg font-semibold text-quillGray group-hover:text-accent transition-colors">
                      Gallery
                    </h3>
                  </div>
                  <p className="text-gunSmoke leading-relaxed font-ptMono text-sm">
                    A curated collection of moments, projects, and experiences captured through my lens.
                  </p>
                </Link>

                <Link 
                  href="/timeline"
                  className="group relative border border-darkGrey/30 rounded-sm p-6 transition-all duration-300
                    hover:border-accent/50 hover:shadow-[0_4px_20px_-12px_rgba(100,178,188,0.15)] hover:transform hover:-translate-y-0.5"
                  style={{ backgroundColor: '#191919' }}
                > */}
                  {/* Accent corner */}
                  {/* <div className="absolute top-0 right-0 w-0 h-0 transition-all duration-300
                    border-t-[20px] border-r-[20px] 
                    group-hover:border-t-accent group-hover:border-r-accent border-t-transparent border-r-transparent">
                  </div>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-sm flex items-center justify-center">
                      <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-ptMono text-lg font-semibold text-quillGray group-hover:text-accent transition-colors">
                      Timeline
                    </h3>
                  </div>
                  <p className="text-gunSmoke leading-relaxed font-ptMono text-sm">
                    A chronological journey through my first year of projects, achievements, and learning experiences.
                  </p>
                </Link>
              </div>
            </div>
          </FadeInSection>
        </section> */}

        <Footer />
      </div>
      <BackToTop /> {/* Add BackToTop component */}
    </main>
  );
}