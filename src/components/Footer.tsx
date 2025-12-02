'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const VisitorCounter: React.FC = () => {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateVisitorCount = async () => {
      try {
        // Get or create session ID
        let sessionId = sessionStorage.getItem('visitor_session_id');
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
          sessionStorage.setItem('visitor_session_id', sessionId);
        }

        // Log the visit with page path and session ID
        await supabase.rpc('log_visit', {
          p_page_path: window.location.pathname,
          p_session_id: sessionId
        });
        
        // Get total visitor count
        const { data, error } = await supabase.rpc('get_total_visitors');
        
        if (error) {
          console.error('Error getting visitor count:', error);
          return;
        }
        
        // Add legacy visitor count (5747) to new system
        setVisitorCount((data || 0) + 5747);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    updateVisitorCount();
  }, []);

  if (isLoading) {
    return (
      <span className="text-sm font-ptMono text-gunSmoke">
        Counting...
      </span>
    );
  }

    if (!mounted) {
    return <span className="text-sm font-ptMono text-gunSmoke">Visitors: --</span>;
  }

  return (
    <a 
      href="/stats"
      className="flex items-center gap-1.5 group cursor-pointer transition-all duration-200"
    >
      <span className="text-sm font-ptMono text-gunSmoke group-hover:text-accent-light transition-colors underline decoration-gunSmoke/40 group-hover:decoration-accent-light underline-offset-2">
        Visitor #{visitorCount || '?'}
      </span>
      <svg 
        className="w-3.5 h-3.5 text-gunSmoke/70 group-hover:text-accent-light group-hover:scale-110 transition-all duration-200 rotate-45" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </a>
  );
};

/**
 * Simple time spent display widget without tracking
 */
const TimeSpentWidget: React.FC = () => {
  const [timeSpent, setTimeSpent] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    // Only run client-side
    setIsMounted(true);
    
    // Set up timer
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    
    // Clean up on component unmount
    return () => {
      clearInterval(interval);
    };
  }, []); // No dependencies so it only runs once on mount

  const formatTime = () => {
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle server-side rendering consistently
  if (!isMounted) {
    return (
      <div className="flex items-center group">
        <svg 
          className="w-3 h-3 text-accent-light mr-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <span className="text-sm font-ptMono text-gunSmoke">
          Time spent: <span>0:00</span>
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center group">
      <svg 
        className="w-3 h-3 text-accent-light mr-2 transition-transform group-hover:rotate-12" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      <span className="text-sm font-ptMono text-gunSmoke">
        Time spent: <span className="group-hover:text-accent-light transition-colors">{formatTime()}</span>
      </span>
    </div>
  );
};

/**
 * Footer component with analytics widgets and responsive layout
 */
const Footer: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [year] = useState(new Date().getFullYear());

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    
    checkMobile();
    
    const handleResize = () => {
      checkMobile();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <footer className="mt-8 pt-8 pb-4 px-4 border-t border-b-0 border-l-0 border-r-0 border-solid border-gunSmoke transition-colors duration-500 hover:border-accent-light/30">
      {isMobile ? (
        <div className="flex flex-col space-y-4 items-center">
          <div className="flex flex-col space-y-3 items-center">
            <VisitorCounter />
            <TimeSpentWidget />
            <a 
              href="/uncompiled" 
              className="flex items-center gap-1.5 group cursor-pointer transition-all duration-200"
            >
              <span className="text-sm font-ptMono text-gunSmoke group-hover:text-accent-light transition-colors underline decoration-gunSmoke/40 group-hover:decoration-accent-light underline-offset-2">
                Uncompiled
              </span>
              <svg 
                className="w-3.5 h-3.5 text-gunSmoke/70 group-hover:text-accent-light group-hover:scale-110 transition-all duration-200 rotate-45" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </a>
            <a 
              href="/colophon" 
              className="flex items-center gap-1.5 group cursor-pointer transition-all duration-200"
            >
              <span className="text-sm font-ptMono text-gunSmoke group-hover:text-accent-light transition-colors underline decoration-gunSmoke/40 group-hover:decoration-accent-light underline-offset-2">
                Colophon
              </span>
              <svg 
                className="w-3.5 h-3.5 text-gunSmoke/70 group-hover:text-accent-light group-hover:scale-110 transition-all duration-200 rotate-45" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </a>
            <a 
              href="/gallery" 
              className="flex items-center gap-1.5 group cursor-pointer transition-all duration-200"
            >
              <span className="text-sm font-ptMono text-gunSmoke group-hover:text-accent-light transition-colors underline decoration-gunSmoke/40 group-hover:decoration-accent-light underline-offset-2">
                Gallery
              </span>
              <svg 
                className="w-3.5 h-3.5 text-gunSmoke/70 group-hover:text-accent-light group-hover:scale-110 transition-all duration-200 rotate-45" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </a>
          </div>
          <div className="text-sm font-ptMono text-quillGray flex items-center space-x-1">
            <span>made with</span>
            <span className="text-accent-light animate-pulse">❤</span>
            <span>by Rishi</span>
          </div>
          <div className="text-xs font-ptMono text-gunSmoke opacity-70">
            © {year} All rights reserved
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-5">
              <VisitorCounter />
              <TimeSpentWidget />
            </div>
            <div className="text-sm font-ptMono text-quillGray flex items-center space-x-1">
              <span>made with</span>
              <span className="text-accent-light animate-pulse">❤</span>
              <span>by Rishi</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-xs font-ptMono text-gunSmoke opacity-70">
            <div className="flex items-center gap-4">
              <a 
                href="/uncompiled" 
                className="flex items-center gap-1.5 group cursor-pointer transition-all duration-200"
              >
                <span className="text-sm font-ptMono text-gunSmoke group-hover:text-accent-light transition-colors underline decoration-gunSmoke/40 group-hover:decoration-accent-light underline-offset-2">
                  Uncompiled
                </span>
                <svg 
                  className="w-3.5 h-3.5 text-gunSmoke/70 group-hover:text-accent-light group-hover:scale-110 transition-all duration-200 rotate-45" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </a>
              <a 
                href="/colophon" 
                className="flex items-center gap-1.5 group cursor-pointer transition-all duration-200"
              >
                <span className="text-sm font-ptMono text-gunSmoke group-hover:text-accent-light transition-colors underline decoration-gunSmoke/40 group-hover:decoration-accent-light underline-offset-2">
                  Colophon
                </span>
                <svg 
                  className="w-3.5 h-3.5 text-gunSmoke/70 group-hover:text-accent-light group-hover:scale-110 transition-all duration-200 rotate-45" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </a>
              <a 
                href="/gallery" 
                className="flex items-center gap-1.5 group cursor-pointer transition-all duration-200"
              >
                <span className="text-sm font-ptMono text-gunSmoke group-hover:text-accent-light transition-colors underline decoration-gunSmoke/40 group-hover:decoration-accent-light underline-offset-2">
                  Gallery
                </span>
                <svg 
                  className="w-3.5 h-3.5 text-gunSmoke/70 group-hover:text-accent-light group-hover:scale-110 transition-all duration-200 rotate-45" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </a>
            </div>
            <div>© {year} All rights reserved</div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;