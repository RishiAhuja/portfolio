import React from 'react';
import ExpandedContainer from '@/components/ui/ExpandedContainer';
import ExperienceCard from '@/components/ui/ExperienceCard';

const Experience: React.FC = () => {
  return (
    <div className="flex flex-col">
      <ExpandedContainer text="Experiences & Responsibilities" />
      <div className="h-4" />
      <div>
        <ExperienceCard
          role="Enterpreneur in Residence"
          company="iHub AWaDH IIT Ropar"
          type="Full-time"
          startDate={new Date(2025, 5)} // April 2025
          endDate={new Date(2025, 9)} // Oct 2025
          location="Hybrid"
          
        />
        <ExperienceCard
          role="Research Intern"
          company="Annam AI IIT Ropar"
          type="Internship"
          startDate={new Date(2025, 5)} // April 2025
          endDate={new Date(2025, 9)} // Oct 2025
          location="Hybrid"
          
        />

        <ExperienceCard
          role="Flutter Intern"
          company="Stack Wealth (YC S21)"
          type="Internship"
          startDate={new Date(2025, 3)} // April 2025
          endDate={new Date(2025, 4)}   // May 2025
          location="Remote"
          
        />
        
        <ExperienceCard
          role="Frontend Intern"
          company="Level SuperMind"
          type="Internship"
          startDate={new Date(2025, 0)} // January 2025
          endDate={new Date(2025, 1)}   // February 2025
          location="Remote"
        />
        
        <ExperienceCard
          role="Core member—Mobile Development"
          company="Google Developers Group on Campus - NIT Jalandhar"
          type="Self-employed"
          startDate={new Date(2024, 10)} // November 2024
          location="Jalandhar, Punjab, India"
        />
      </div>
    </div>
  );
};

export default Experience;