import React from 'react';

interface ExpandedContainerProps {
  text: string;
}

const ExpandedContainer: React.FC<ExpandedContainerProps> = ({ text }) => {
  return (
    <div className="w-full px-5 py-2 my-1.5 text-left border border-darkGrey rounded-sm relative overflow-hidden group transition-all duration-300 hover:border-accent-light/50">
      {/* Subtle accent background that appears on hover */}
      <div className="absolute inset-0 bg-accent/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
      
      <h2 className="text-2xl font-bold font-ptMono text-quillGray relative z-10">
        {text}
      </h2>
    </div>
  );
};

export default ExpandedContainer;