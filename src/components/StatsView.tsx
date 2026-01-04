'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface DailyStat {
  date: string;
  visitors: number;
  page_views: number;
}

interface StatsData {
  totalVisitors: number;
  dailyStats: DailyStat[];
  isLoading: boolean;
}

const StatsView: React.FC = () => {
  const [stats, setStats] = useState<StatsData>({
    totalVisitors: 0,
    dailyStats: [],
    isLoading: true,
  });
  const [isMobile, setIsMobile] = useState(false);
  const [timeRange, setTimeRange] = useState(30); // days

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 800);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total visitors
        const { data: totalData, error: totalError } = await supabase.rpc('get_total_visitors');
        
        if (totalError) {
          console.error('Error fetching total visitors:', totalError);
        }

        // Get daily stats
        const { data: dailyData, error: dailyError } = await supabase.rpc('get_daily_stats', {
          days_back: timeRange
        });
        
        if (dailyError) {
          console.error('Error fetching daily stats:', dailyError);
        }

        setStats({
          totalVisitors: (totalData || 0) + 5747, // Add legacy visitors
          dailyStats: dailyData || [],
          isLoading: false,
        });
      } catch (error) {
        console.error('Error:', error);
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchStats();
  }, [timeRange]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const chartData = stats.dailyStats.map(stat => ({
    date: formatDate(stat.date),
    visitors: stat.visitors,
    views: stat.page_views,
  })).reverse(); // Reverse to show chronologically

  const totalPageViews = stats.dailyStats.reduce((sum, stat) => sum + stat.page_views, 0);
  const avgVisitorsPerDay = stats.dailyStats.length > 0 
    ? Math.round(stats.dailyStats.reduce((sum, stat) => sum + stat.visitors, 0) / stats.dailyStats.length)
    : 0;

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#191919' }}>
      <div className={`${isMobile ? 'w-full px-4' : 'w-[65%] px-8'} mx-auto py-8`}>
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className={`font-bold font-ptMono text-quillGray mb-3 ${isMobile ? 'text-3xl' : 'text-5xl'}`}>
            Analytics
          </h1>
          <p className={`text-gunSmoke font-ptMono mb-6 ${isMobile ? 'text-sm' : 'text-base'} max-w-2xl mx-auto`}>
            Portfolio visitor statistics and insights
          </p>
        </div>

        {stats.isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mb-4"></div>
              <p className="text-gunSmoke font-ptMono">Loading statistics...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-4 mb-8`}>
              {/* Total Visitors */}
              <div className="border border-darkGrey/30 rounded-sm p-6 bg-bgShades-light/20 hover:border-accent/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-ptMono text-gunSmoke">Total Visitors</span>
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold font-ptMono text-accent mb-1">
                  {stats.totalVisitors.toLocaleString()}
                </div>
                <div className="text-xs font-ptMono text-gunSmoke/60">
                  All time
                </div>
              </div>

              {/* Total Page Views */}
              <div className="border border-darkGrey/30 rounded-sm p-6 bg-bgShades-light/20 hover:border-accent/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-ptMono text-gunSmoke">Page Views</span>
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold font-ptMono text-accent mb-1">
                  {totalPageViews.toLocaleString()}
                </div>
                <div className="text-xs font-ptMono text-gunSmoke/60">
                  Last {timeRange} days
                </div>
              </div>

              {/* Average per Day */}
              <div className="border border-darkGrey/30 rounded-sm p-6 bg-bgShades-light/20 hover:border-accent/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-ptMono text-gunSmoke">Daily Average</span>
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold font-ptMono text-accent mb-1">
                  {avgVisitorsPerDay}
                </div>
                <div className="text-xs font-ptMono text-gunSmoke/60">
                  Visitors per day
                </div>
              </div>
            </div>

            {/* Time Range Selector */}
            <div className="flex justify-center gap-2 mb-8">
              {[7, 14, 30, 90].map(days => (
                <button
                  key={days}
                  onClick={() => setTimeRange(days)}
                  className={`px-4 py-2 font-ptMono text-xs rounded-sm transition-all ${
                    timeRange === days
                      ? 'bg-accent/10 text-accent border border-accent/30'
                      : 'bg-darkGrey/20 text-gunSmoke border border-darkGrey/40 hover:border-darkGrey/60'
                  }`}
                >
                  {days}d
                </button>
              ))}
            </div>

            {/* Charts */}
            <div className="space-y-8">
              {/* Visitors Chart */}
              <div className="border border-darkGrey/30 rounded-sm p-6 bg-bgShades-light/20">
                <h2 className="text-xl font-bold font-ptMono text-quillGray mb-6">
                  Daily Visitors
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#64B2BC" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#64B2BC" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#858585"
                      style={{ fontSize: '12px', fontFamily: 'PT Mono' }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      stroke="#858585"
                      style={{ fontSize: '12px', fontFamily: 'PT Mono' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#191919', 
                        border: '1px solid #2A2A2A',
                        borderRadius: '4px',
                        fontFamily: 'PT Mono',
                        fontSize: '12px'
                      }}
                      labelStyle={{ color: '#D3D0C9' }}
                      itemStyle={{ color: '#64B2BC' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="visitors" 
                      stroke="#64B2BC" 
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorVisitors)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Page Views Chart */}
              <div className="border border-darkGrey/30 rounded-sm p-6 bg-bgShades-light/20">
                <h2 className="text-xl font-bold font-ptMono text-quillGray mb-6">
                  Page Views
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#858585"
                      style={{ fontSize: '12px', fontFamily: 'PT Mono' }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      stroke="#858585"
                      style={{ fontSize: '12px', fontFamily: 'PT Mono' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#191919', 
                        border: '1px solid #2A2A2A',
                        borderRadius: '4px',
                        fontFamily: 'PT Mono',
                        fontSize: '12px'
                      }}
                      labelStyle={{ color: '#D3D0C9' }}
                      itemStyle={{ color: '#64B2BC' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#64B2BC" 
                      strokeWidth={2}
                      dot={{ fill: '#64B2BC', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default StatsView;
