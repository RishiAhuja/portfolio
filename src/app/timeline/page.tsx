'use client';

import React, { useState, useEffect } from 'react';
import ExpandedContainer from '@/components/ui/ExpandedContainer';
import FadeInSection from '@/components/ui/FadeInSection';
import Link from 'next/link';

interface TimelineEvent {
  date: string;
  title: string;
  type: 'project' | 'blog' | 'achievement' | 'internship' | 'community';
  description: string;
  link?: string;
  status?: 'ongoing' | 'completed';
  year: string;
}

const Timeline: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2024-25');
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

  const timelineData: Record<string, TimelineEvent[]> = {
    '2024-25': [
      {
        date: 'July 10, 2025',
        title: 'Working on Mess ERP',
        type: 'project',
        description: 'Currently developing an ERP system for mess management with advanced features.',
        status: 'ongoing',
        year: '2024-25'
      },
      {
        date: 'June 14, 2025',
        title: 'Your Hardest "Hello World!": Text Rasterization',
        type: 'blog',
        description: 'Deep dive into the complexities of text rendering and rasterization techniques.',
        year: '2024-25'
      },
      {
        date: 'June 13, 2025',
        title: 'OpenLearn - AI/ML Learning Platform',
        type: 'community',
        description: 'Co-founded OpenLearn, a premier AI/ML and Finance learning organization. Launching June 15, 2025 with structured cohorts, ML League, and Finance League programs.',
        year: '2024-25'
      },
      {
        date: 'June 9, 2025',
        title: 'Text Rasterization',
        type: 'project',
        description: 'Low-level implementation of text rendering algorithms and font processing.',
        year: '2024-25'
      },
      {
        date: 'May 30, 2025',
        title: 'Fern Graphics Library',
        type: 'project',
        description: 'Minimalist graphics library for C/C++ with declarative API for HTML canvas via WebAssembly. Features both C (lightweight) and C++ (feature-rich) implementations, custom CLI tool, and near-native performance.',
        link: 'https://fern-life.web.app/',
        year: '2024-25'
      },
      {
        date: 'May 29, 2025',
        title: 'Anaam AI Intern - IIT Ropar',
        type: 'internship',
        description: 'AI research internship at IIT Ropar, working on cutting-edge machine learning projects.',
        year: '2024-25'
      },
      {
        date: 'May 21, 2025',
        title: 'Portfolio Refresh',
        type: 'project',
        description: 'Complete redesign and rebuild of personal portfolio with modern tech stack.',
        year: '2024-25'
      },
      {
        date: 'May 20, 2025',
        title: 'Conduit HTTP Client',
        type: 'project',
        description: 'A lightweight HTTP client library written in C with no external dependencies. Features JSON parsing, configurable timeouts, and socket-based communication.',
        year: '2024-25'
      },
      {
        date: 'May 19, 2025',
        title: 'Datum',
        type: 'project',
        description: 'Data management and analytics platform with modern architecture.',
        year: '2024-25'
      },
      {
        date: 'May 13, 2025',
        title: 'SUDO - Society of Unified Developers',
        type: 'community',
        description: 'Co-founded SUDO, a collective focused on systems programming and collaborative software development. Promotes layered, zero-dependency development model building software from the ground up.',
        year: '2024-25'
      },
      {
        date: 'May 4, 2025',
        title: 'NeoPrism Core UI Toolkit',
        type: 'project',
        description: 'A Flutter UI toolkit featuring neobrutalism design principles with pluggable architecture. Includes interactive animations, theme customization, and analytics plugins.',
        year: '2024-25'
      },
      {
        date: 'April 10, 2025',
        title: 'ESP32 RoboWar Controller',
        type: 'project',
        description: 'A Bluetooth-controlled combat robot using ESP32 and Flutter. Features wireless control of drive motors, drum weapons, and auxiliary systems with bidirectional BLE communication.',
        year: '2024-25'
      },
      {
        date: 'April 4, 2025',
        title: 'Stack Wealth Flutter Internship',
        type: 'internship',
        description: 'Ranked #2 contributor to Athena app at YC S21 startup, merging 50+ PRs. Led end-to-end development of analytics and biometric auth modules using clean architecture.',
        year: '2024-25'
      },
      {
        date: 'April 1, 2025',
        title: 'Bits of Trust: The Elegance of AES',
        type: 'blog',
        description: 'Technical deep-dive into AES encryption algorithms and cryptographic principles.',
        year: '2024-25'
      },
      {
        date: 'March 29, 2025',
        title: 'Axon AES Encryption CLI',
        type: 'project',
        description: 'High-performance, secure file encryption and decryption tool using AES-128 with CBC mode. Cross-platform CLI tool focused on performance and security.',
        year: '2024-25'
      },
      {
        date: 'March 10, 2025',
        title: 'BarqScoot E-Scooter App',
        type: 'project',
        description: 'Modern e-scooter rental application built with Flutter. Features OTP authentication, QR code scanning, real-time tracking, and payment processing using clean architecture.',
        year: '2024-25'
      },
      {
        date: 'March 1, 2025',
        title: 'SahlPlus IoT E-Scooter Platform',
        type: 'project',
        description: 'Led development of IoT-integrated e-scooter sharing platform as freelance Flutter developer. Implemented real-time location tracking with clean architecture and Riverpod state management.',
        year: '2024-25'
      },
      {
        date: 'February 27, 2025',
        title: 'Building Rosenblatt\'s Perceptron From Scratch in Flutter',
        type: 'blog',
        description: 'Implementation walkthrough of the classic perceptron algorithm in Flutter.',
        year: '2024-25'
      },
      {
        date: 'February 24, 2025',
        title: 'Rosenblatt\'s Perceptron Simulator',
        type: 'project',
        description: 'Visual implementation of Rosenblatt\'s Perceptron neural network using Flutter. Features real-time training visualization, shape recognition, and live weight updates.',
        year: '2024-25'
      },
      {
        date: 'February 20, 2025',
        title: 'Numd',
        type: 'project',
        description: 'High-performance numerical computation library with optimized algorithms.',
        year: '2024-25'
      },
      {
        date: 'February 15, 2025',
        title: 'KisaanMithraa Agricultural Platform',
        type: 'project',
        description: 'Spearheaded development under Annam AI initiative with IIT Ropar. Features modular architecture (GetX), offline caching for rural connectivity, and scalable cooperative management with Firebase.',
        year: '2024-25'
      },
      {
        date: 'February 10, 2025',
        title: 'Fingeine',
        type: 'project',
        description: 'Advanced fingerprint recognition engine with machine learning integration.',
        year: '2024-25'
      },
      {
        date: 'January 25, 2025',
        title: 'Level SuperMind Frontend Internship',
        type: 'internship',
        description: 'Developed responsive frontend using Next.js with RESTful API integration. Collaborated with 4 developers using agile methodology for religious services platform.',
        year: '2024-25'
      },
      {
        date: 'January 19, 2025',
        title: 'Level SuperMind Hackathon - 1st Runner-Up',
        type: 'achievement',
        description: 'Won 1st Runner-Up (2nd place) creating SoulBuddy.ai among 23,000+ participants nationwide. AI-powered astrological guidance platform.',
        year: '2024-25'
      },
      {
        date: 'January 18, 2025',
        title: 'SoulBuddy AI Spiritual Guide',
        type: 'project',
        description: 'AI-powered spiritual guidance platform using astrology and numerology. Features personalized Kundali generation, horoscope predictions, gemstone recommendations, and interactive chatbot.',
        year: '2024-25'
      },
      {
        date: 'January 9, 2025',
        title: 'Nexus Social Blogging Platform',
        type: 'project',
        description: 'Built modern blogging platform with Flutter Web, Firebase, and BLoC pattern. Features rich Markdown content editing, user authentication, responsive design, and clean architecture optimized for web performance.',
        link: 'https://nexus.rishia.in',
        year: '2024-25'
      },
      {
        date: 'January 5, 2025',
        title: 'Getting Cracked at Clean and BLoC Architecture',
        type: 'blog',
        description: 'Advanced guide to implementing clean architecture patterns in Flutter.',
        year: '2024-25'
      },
      {
        date: 'December 28, 2024',
        title: 'Bit by Bit: C++',
        type: 'project',
        description: 'Comprehensive C++ learning platform with interactive examples.',
        year: '2024-25'
      },
      {
        date: 'December 26, 2024',
        title: 'RoboRace NITJ - 2nd Place',
        type: 'achievement',
        description: 'Achieved second position in robotics competition at NITJ.',
        year: '2024-25'
      },
      {
        date: 'December 13, 2024',
        title: 'Getting Started at BLoC Architecture',
        type: 'blog',
        description: 'Beginner-friendly introduction to BLoC pattern in Flutter development.',
        year: '2024-25'
      },
      {
        date: 'December 8, 2024',
        title: 'Flutter Spotify Clone',
        type: 'project',
        description: 'Full-featured music streaming app with advanced audio controls.',
        year: '2024-25'
      },
      {
        date: 'November 28, 2024',
        title: 'GDSC NITJ Core Member',
        type: 'community',
        description: 'Became Core member of Google Developer Student Club NITJ. Organized technical workshops on Flutter development for undergraduate freshers.',
        year: '2024-25'
      },
      {
        date: 'November 1, 2024',
        title: 'Resource Management with Probabilistic Scheduling in Linux',
        type: 'blog',
        description: 'Technical exploration of Linux kernel scheduling mechanisms.',
        year: '2024-25'
      },
      {
        date: 'October 28, 2024',
        title: 'IEEE PEC × Prajna AI Hackathon - 2nd Runner-Up',
        type: 'achievement',
        description: 'Won 2nd Runner-Up (3rd place) developing IPQS, an intelligent document analysis system. Recognized for innovative AI implementation among 60+ teams.',
        year: '2024-25'
      },
      {
        date: 'October 19, 2024',
        title: 'IPQS',
        type: 'project',
        description: 'IP Quality Score analysis tool for network security assessment.',
        year: '2024-25'
      },
      {
        date: 'September 16, 2024',
        title: 'Chat App',
        type: 'project',
        description: 'Real-time messaging application with modern chat features.',
        year: '2024-25'
      },
      {
        date: 'September 3, 2024',
        title: 'State of the Art - Art',
        type: 'blog',
        description: 'Analysis of contemporary art trends and digital creativity.',
        year: '2024-25'
      },
      {
        date: 'September 1, 2024',
        title: 'Ideathon NITJ - 2nd Place',
        type: 'achievement',
        description: 'Won second position in ideation competition at NITJ.',
        year: '2024-25'
      },
      {
        date: 'August 16, 2024',
        title: 'Comprehensive Arch Linux Blog',
        type: 'blog',
        description: 'Complete guide to Arch Linux installation, configuration, and optimization.',
        year: '2024-25'
      }
    ]
  };

  const getTypeCounts = (data: TimelineEvent[]) => {
    return {
      projects: data.filter(item => item.type === 'project').length,
      blogs: data.filter(item => item.type === 'blog').length,
      achievements: data.filter(item => item.type === 'achievement').length,
      internships: data.filter(item => item.type === 'internship').length,
      community: data.filter(item => item.type === 'community').length,
    };
  };

  const currentData = timelineData[selectedYear] || [];
  const counts = getTypeCounts(currentData);

  return (
    <main className="min-h-screen bg-backgroundColor text-quillGray">
      {/* Back to Home */}
      <div className={`${isMobile ? 'px-4' : 'px-8'} pt-8`}>
        <Link href="/" className="inline-flex items-center text-accent hover:text-accent-light transition-colors font-ptMono">
          ← Back to Home
        </Link>
      </div>

      <div className={`${isMobile ? 'w-full px-4' : 'w-[65%] px-8'} mx-auto py-12`}>
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-ptMono text-quillGray mb-4">
            First Year Timeline
          </h1>
          <p className="text-lg text-gunSmoke font-ptMono">
            A chronological record of projects, achievements, and growth
          </p>
          <div className="w-1/3 h-px bg-darkGrey mx-auto mt-4 relative">
            <div className="absolute left-0 top-0 h-full w-1/2 bg-accent-light opacity-60"></div>
          </div>
        </div>

        {/* Year Selector */}
        <div>
          <div className="text-center mb-8">
            <span className="text-gunSmoke font-ptMono text-sm">Academic Year 2024-25</span>
          </div>
        </div>

        {/* Stats Section */}
        <div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            <div className="bg-bgShades-light border border-darkGrey rounded-sm p-4 text-center hover:border-accent-light/50 transition-colors">
              <div className="text-2xl font-bold text-quillGray font-ptMono">{counts.projects}</div>
              <div className="text-gunSmoke text-sm font-ptMono">Projects</div>
            </div>
            <div className="bg-bgShades-light border border-darkGrey rounded-sm p-4 text-center hover:border-accent-light/50 transition-colors">
              <div className="text-2xl font-bold text-quillGray font-ptMono">{counts.blogs}</div>
              <div className="text-gunSmoke text-sm font-ptMono">Blog Posts</div>
            </div>
            <div className="bg-bgShades-light border border-darkGrey rounded-sm p-4 text-center hover:border-accent-light/50 transition-colors">
              <div className="text-2xl font-bold text-quillGray font-ptMono">{counts.achievements}</div>
              <div className="text-gunSmoke text-sm font-ptMono">Achievements</div>
            </div>
            <div className="bg-bgShades-light border border-darkGrey rounded-sm p-4 text-center hover:border-accent-light/50 transition-colors">
              <div className="text-2xl font-bold text-quillGray font-ptMono">{counts.internships}</div>
              <div className="text-gunSmoke text-sm font-ptMono">Internships</div>
            </div>
            <div className="bg-bgShades-light border border-darkGrey rounded-sm p-4 text-center hover:border-accent-light/50 transition-colors">
              <div className="text-2xl font-bold text-quillGray font-ptMono">{counts.community}</div>
              <div className="text-gunSmoke text-sm font-ptMono">Community</div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <ExpandedContainer text="Timeline Events" />
          <div className="h-8" />
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-darkGrey"></div>
            <div className="absolute left-4 top-0 h-8 w-0.5 bg-accent-light"></div>
            
            <div className="space-y-8">
              {currentData.length > 0 ? currentData.map((item, index) => (
                <div key={index} className="relative flex items-start">
                  {/* Timeline dot */}
                  <div className="relative z-10 w-2 h-2 bg-accent rounded-full mt-6 mr-6 border-2 border-backgroundColor"></div>
                  
                  {/* Timeline card - exactly like project cards */}
                  <div className="flex-1">
                    <div 
                      className="border rounded-sm transition-all duration-300 h-full
                        border-darkGrey hover:border-accent-light hover:shadow-[0_4px_20px_-12px_rgba(100,178,188,0.25)] hover:transform hover:-translate-y-1
                        flex flex-col cursor-pointer group relative"
                    >
                      {/* Accent corner */}
                      <div className="absolute top-0 right-0 w-0 h-0 transition-all duration-300
                        border-t-[20px] border-r-[20px] 
                        group-hover:border-t-accent group-hover:border-r-accent border-t-transparent border-r-transparent">
                      </div>
                      
                      <div className="p-4 flex-grow flex flex-col">
                        {/* Header */}
                        <h3 className="text-xl font-bold font-ptMono transition-colors duration-200
                          group-hover:text-accent-light text-quillGray"
                        >
                          {item.title}
                        </h3>
                        
                        <div className="h-2" />
                        
                        {/* Brief description */}
                        <p className="text-sm text-gray-400 font-ptMono leading-relaxed mb-4">
                          {item.description}
                        </p>
                        
                        {/* Type and status pills */}
                        <div className="flex flex-wrap gap-1 mt-auto mb-4">
                          <span className="text-xs bg-darkGrey/50 text-gray-400 px-1.5 py-0.5 rounded-sm font-ptMono">
                            {item.type}
                          </span>
                          {item.status && (
                            <span className="text-xs bg-darkGrey/50 text-gray-400 px-1.5 py-0.5 rounded-sm font-ptMono">
                              {item.status}
                            </span>
                          )}
                        </div>
                        
                        {/* Bottom Actions */}
                        <div className="flex justify-between items-center mt-auto">
                          {/* Date */}
                          <span className="text-xs text-gray-400 font-ptMono">
                            {item.date}
                          </span>
                          
                          {/* Link if available */}
                          {item.link ? (
                            <a 
                              href={item.link}
                              className="flex items-center font-ptMono text-sm 
                                group-hover:text-accent-light text-quillGray
                                transition-colors duration-200"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <span>View Details</span>
                              <svg 
                                className="w-3 h-3 ml-1 transition-transform duration-200 group-hover:translate-x-1" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </a>
                          ) : (
                            <div className="flex items-center font-ptMono text-sm text-gray-400">
                              <span>Details coming soon</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <p className="text-gunSmoke font-ptMono">No timeline events found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div>
          <div className="text-center mt-16 p-8 border border-darkGrey rounded-sm hover:border-accent-light/50 transition-colors">
            <h2 className="text-2xl font-bold text-quillGray font-ptMono mb-4">
              First Year Complete
            </h2>
            <p className="text-gunSmoke mb-6">
              38 events across projects, technical writing, competitions, and professional development.
            </p>
            <Link 
              href="/"
              className="inline-block border border-darkGrey hover:border-accent-light text-quillGray hover:text-accent-light px-6 py-3 rounded-sm transition-colors font-ptMono"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Timeline;
