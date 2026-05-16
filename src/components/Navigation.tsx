import React, { useState, useEffect } from 'react';

interface Section {
  id: string;
  label: string;
}

const Navigation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('about');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    const sectionData = [
      { id: 'about', label: 'About' },
      { id: 'blog', label: 'Blog' },
      { id: 'papers', label: 'Papers' },
      { id: 'sidequests', label: 'Side Quests' },
      { id: 'experience', label: 'Experience' },
      { id: 'upstream', label: 'Upstream' },
      { id: 'education', label: 'Education' },
      { id: 'projects', label: 'Projects' },
      { id: 'contact', label: 'Contact' },
    ].filter((section) => document.getElementById(section.id));

    setSections(sectionData);
  }, []);

  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0.1, 0.25, 0.5],
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 48,
        behavior: 'smooth',
      });
    }
  };

  if (sections.length === 0) return null;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-darkGrey z-50">
        <div 
          className="h-full bg-accent-light transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <nav
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:block"
        aria-label="Homepage sections"
      >
        <ul className="flex flex-col items-center gap-5">
          {sections.map((section) => {
            const isActive = activeSection === section.id;

            return (
              <li key={section.id}>
                <button
                  className="group relative flex h-6 w-6 items-center justify-center"
                  onClick={() => scrollToSection(section.id)}
                  aria-label={`Scroll to ${section.label} section`}
                >
                  <span className="absolute right-full mr-3 rounded-sm border border-darkGrey bg-bgShades-light px-2 py-1 font-ptMono text-xs text-quillGray opacity-0 shadow-sm transition-opacity group-hover:opacity-100 whitespace-nowrap">
                    {section.label}
                  </span>
                  <span
                    className={`rounded-full transition-all duration-200 ${
                      isActive
                        ? 'h-3 w-3 bg-accent-light'
                        : 'h-2 w-2 bg-darkGrey group-hover:bg-accent-light/60'
                    }`}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default Navigation;
