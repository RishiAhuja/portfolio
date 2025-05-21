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
import { useEffect, useState } from 'react';
import FadeInSection from '@/components/ui/FadeInSection';
import JsonLd from '@/components/JsonLd';

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
        
        <Footer />
      </div>
      <BackToTop /> {/* Add BackToTop component */}
    </main>
  );
}