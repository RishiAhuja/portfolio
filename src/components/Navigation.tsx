// components/Navigation.tsx (fixed version)

import React, { useState, useEffect } from 'react';

interface Section {
  id: string;
  label: string;
}

const Navigation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('about');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sections, setSections] = useState<Section[]>([]);
  const [sectionPositions, setSectionPositions] = useState<{[key: string]: number}>({});
  
  // Initialize section data
  useEffect(() => {
    const sectionData: Section[] = [
      { id: 'about', label: 'About' },
      { id: 'tech', label: 'Tech' },
      { id: 'projects', label: 'Projects' },
      { id: 'blog', label: 'Blog' },
      { id: 'experience', label: 'Experience' },
      { id: 'education', label: 'Education' },
      { id: 'contact', label: 'Contact' }
    ];
    setSections(sectionData);
  }, []);
  
  // Calculate section positions on mount and window resize
  useEffect(() => {
    const calculateSectionPositions = () => {
      const positions: {[key: string]: number} = {};
      
      sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
          // Get position relative to the top of the viewport + a small offset
          positions[section.id] = element.offsetTop - 100;
        }
      });
      
      setSectionPositions(positions);
    };
    
    // Wait for DOM to be ready
    setTimeout(calculateSectionPositions, 500);
    window.addEventListener('resize', calculateSectionPositions);
    
    return () => window.removeEventListener('resize', calculateSectionPositions);
  }, [sections]);
  
  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      // Update scroll progress indicator
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      
      // Update active section based on scroll position
      const scrollPosition = window.scrollY + 150; // Add offset to trigger active state earlier
      
      // Find the current section by comparing scroll position to section positions
      let currentSection = 'about'; // Default to first section
      
      // Convert positions object to array and sort by position value
      const positionEntries = Object.entries(sectionPositions).sort((a, b) => a[1] - b[1]);
      
      // Find the last section whose position is less than or equal to current scroll
      for (const [id, position] of positionEntries) {
        if (scrollPosition >= position) {
          currentSection = id;
        } else {
          break;
        }
      }
      
      setActiveSection(currentSection);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionPositions]);
  
  // Scroll to section handler
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 50, // Offset to account for potential fixed header
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <>
      {/* Scroll progress indicator */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-darkGrey z-50">
        <div 
          className="h-full bg-accent-light transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      
      {/* Side navigation - desktop only */}
      <nav className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 hidden md:block">
        <ul className="flex flex-col space-y-6">
          {sections.map((section) => (
            <li key={section.id}>
              <button 
                className="block group relative p-2"
                onClick={() => scrollToSection(section.id)}
                aria-label={`Scroll to ${section.label} section`}
              >
                {/* Tooltip */}
                <span className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 bg-bgShades-light border border-darkGrey px-2 py-1 rounded-sm text-xs font-ptMono text-quillGray opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {section.label}
                </span>
                
                {/* Navigation dot */}
                <div 
                  className={`transition-all duration-300 rounded-full
                    ${activeSection === section.id 
                      ? 'w-3 h-3 bg-accent-light' 
                      : 'w-2 h-2 bg-darkGrey group-hover:bg-accent-light/50'}`} 
                />
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Navigation;