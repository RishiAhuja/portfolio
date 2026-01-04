
import React, { useState, useEffect } from 'react';
import ExpandedContainer from './ui/ExpandedContainer';
import RadarChart from './ui/RadarChart';
import { getSideQuests, type SideQuest } from '../lib/admin';

const SideQuests: React.FC = () => {
  const [stats, setStats] = useState<Array<{ label: string; value: number; max: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getSideQuests();
        const formattedStats = data.map((quest: SideQuest) => ({
          label: quest.label,
          value: quest.value,
          max: quest.max_value
        }));
        setStats(formattedStats);
      } catch (error) {
        console.error('Error fetching side quests:', error);
        // Fallback to default data
        setStats([
          { label: "Bench", value: 45, max: 100 },
          { label: "Squat", value: 45, max: 100 },
          { label: "Leg Press", value: 130, max: 200 },
          { label: "Shoulder", value: 30, max: 80 },
          { label: "Curl", value: 25, max: 60 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col">
        <ExpandedContainer text="Side Quests" />
        <div className="h-4" />
        <div className="font-ptMono text-sm md:text-base">
          <div className="h-6 bg-darkGrey/20 rounded w-32 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Chart Skeleton */}
            <div className="w-full flex justify-center md:justify-start">
              <div className="w-80 h-80 bg-darkGrey/20 rounded-full animate-pulse" />
            </div>
            {/* Stats Skeleton */}
            <div className="space-y-4 hidden md:block">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between">
                    <div className="h-4 bg-darkGrey/20 rounded w-24 animate-pulse" />
                    <div className="h-4 bg-darkGrey/20 rounded w-16 animate-pulse" />
                  </div>
                  <div className="h-1.5 bg-darkGrey/20 rounded-full animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <ExpandedContainer text="Side Quests" />
      <div className="h-4" />

      <div className="font-ptMono text-sm md:text-base">
        <p className="text-gunSmoke mb-8 text-center md:text-left">
          Character Stats
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Chart Column */}
          <div className="w-full flex justify-center md:justify-start overflow-hidden py-4">
            <RadarChart data={stats} size={320} />
          </div>

          {/* Data List Column */}
          <div className="space-y-4 hidden md:block">
            {stats.map((stat, index) => (
              <div key={`stat-${stat.label}-${index}`} className="group">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-quillGray group-hover:text-accent-light transition-colors duration-300">
                    {stat.label}
                  </span>
                  <span className="text-accent-light font-bold">
                    {stat.value} <span className="text-xs text-gunSmoke font-normal">/ {stat.max} kg</span>
                  </span>
                </div>
                <div className="h-1.5 bg-darkGrey/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent-light/50 group-hover:bg-accent-light transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${(stat.value / stat.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideQuests;
