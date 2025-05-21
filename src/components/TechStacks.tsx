import React from 'react';
import ExpandedContainer from '@/components/ui/ExpandedContainer';
import SmallContainer from '@/components/ui/SmallContainer';

const TechStacks: React.FC = () => {
  const technologyCategories = [
    'Flutter', 'Dart', 'BLoC', 'Riverpod', 'GetX', 'Firebase',
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Recoil',
    'HTML', 'CSS', 'Node.js', 'Express.js', 'MongoDB',
    'PostgreSQL', 'Prisma', 'Supabase', 'AppWrite', 'NeonDB',
    'C', 'C++', 'Make', 'CMake', 'Python', 'Bash',
    'Git', 'GitHub', 'Linux', 'Arch Linux', 'Android Studio', 'Markdown', 'Notion', 'Obsidian', 'Ngrok', 'Nginx', 'AWS',
  ];

  return (
    <div className="flex flex-col">
      <ExpandedContainer text="Tech Stacks" />
      
      <div className="h-4" />
      
      <div className="flex flex-wrap gap-x-2 gap-y-2 sm:gap-x-2 sm:gap-y-2">
        {technologyCategories.map((tech, index) => (
          <SmallContainer key={index} text={tech} />
        ))}
      </div>
    </div>
  );
};

export default TechStacks;
