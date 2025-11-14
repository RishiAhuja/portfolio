import React from 'react';
import ExpandedContainer from './ui/ExpandedContainer';

const SideQuests: React.FC = () => {
  return (
    <div className="flex flex-col">
      <ExpandedContainer text="Side Quests" />
      <div className="h-4" />
      
      <div className="font-ptMono text-sm md:text-base">
        <p className="text-gunSmoke mb-4">
          Moving heavy circles.
        </p>
        
        <div className="space-y-2 pl-4 border-l-2 border-darkGrey/40">
          <div className="flex justify-between items-baseline">
            <span className="text-gunSmoke">Bench Press</span>
            <span className="text-accent-light font-semibold">40 kg</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-gunSmoke">Weighted Squats</span>
            <span className="text-accent-light font-semibold">45 kg</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-gunSmoke">Leg Press</span>
            <span className="text-accent-light font-semibold">120 kg</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-gunSmoke">Shoulder Press (Machine)</span>
            <span className="text-accent-light font-semibold">30 kg</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-gunSmoke">Barbell Curl</span>
            <span className="text-accent-light font-semibold">20 kg</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideQuests;
