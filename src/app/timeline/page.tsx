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
  buttons?: {
    label: string;
    link: string;
    icon: 'github' | 'demo' | 'blog' | 'certificate' | 'video' | 'docs' | 'download' | 'external';
  }[];
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
        date: '10 Jul 2025',
        title: 'Mess ERP with 6-way Infrastructure',
        type: 'project',
        description: 'Currently developing comprehensive ERP system for NITJ with 6-way infrastructure, targeting 5000+ users for mess management and operations.',
        status: 'ongoing',
        year: '2025',
      },
      {
        date: '14 Jun 2025',
        title: 'Your Hardest "Hello World!": Text Rasterization #1',
        type: 'blog',
        description: 'Deep technical blog (32 min read) exploring TTF file format and text rendering fundamentals.',
        year: '2024-25',
        buttons: [
          { label: 'Read Blog', link: 'https://rishi2220.hashnode.dev/your-hardest-hello-world-text-rasterization-1', icon: 'blog' }
        ]
      },
      {
        date: '13 Jun 2025',
        title: 'OpenLearn - Educational Organization',
        type: 'community',
        description: 'Co-founded educational organization for teaching via blogs with cohorts, achieved 120+ active users.',
        year: '2024-25',
        buttons: [
          { label: 'GitHub', link: 'https://github.com/openlearnnitj', icon: 'github' },
          { label: 'Website', link: 'https://openlearn.org.in', icon: 'external' }
        ]
      },
      {
        date: '9 Jun 2025',
        title: 'Text Rasterization Tool',
        type: 'project',
        description: 'Low-level tool for understanding and processing TrueType Font (TTF) files and text rendering.',
        year: '2024-25',
        buttons: [
          { label: 'GitHub', link: 'https://github.com/rishiahuja/text-rasterization', icon: 'github' },
        ]
      },
      {
        date: '30 May 2025',
        title: 'Fern Graphics Library',
        type: 'project',
        description: '0-dependency C/C++ GUI creation library built from scratch, cross-platform with WebAssembly support.',
        year: '2024-25',
        buttons: [
          { label: 'GitHub', link: 'https://github.com/RishiAhuja/fern', icon: 'github' },
          { label: 'Docs', link: 'https://fern.rishia.in', icon: 'docs' }
        ]
      },
      {
        date: '29 May 2025',
        title: 'Annam AI Research Intern - IIT Ropar',
        type: 'internship',
        description: 'AI research internship at IIT Ropar focusing on agricultural technology and machine learning applications.',
        year: '2024-25',
        buttons: [
          { label: 'Company', link: 'http://annam.ai/', icon: 'external' }
        ]
      },
      {
        date: '21 May 2025',
        title: 'Portfolio Refresh',
        type: 'project',
        description: 'Complete redesign and modernization of personal portfolio with improved design and user experience.',
        year: '2024-25',
        buttons: [
          { label: 'GitHub', link: 'https://github.com/RishiAhuja/portfolio', icon: 'github' },
        ]
      },
      {
        date: '20 May 2025',
        title: 'Conduit HTTP Client',
        type: 'project',
        description: 'HTTP client for C written in pure C with no external dependencies, lightweight and efficient.',
        year: '2024-25',
        buttons: [
          { label: 'GitHub', link: 'https://github.com/RishiAhuja/conduit', icon: 'github' },
          { label: 'Documentation', link: 'https://conduit.rishia.in', icon: 'docs' }
        ]
      },
      {
        date: '19 May 2025',
        title: 'Datum Web3 Wallet',
        type: 'project',
        description: 'Web3-based wallet project (never completed) - exploration into blockchain and cryptocurrency technologies.',
        year: '2024-25',
        buttons: [
          { label: 'GitHub', link: 'https://github.com/RishiAhuja/datum', icon: 'github' }
        ]
      },
      {
        date: '13 May 2025',
        title: 'SUDO - Society of Unified Developers',
        type: 'community',
        description: 'Co-founded Society of Unified Developer and Operators, focusing on 0-dependency system programming tools.',
        year: '2024-25',
        buttons: [
          { label: 'GitHub', link: 'https://github.com/sudonitj', icon: 'github' },
        ]
      },
      {
        date: '4 May 2025',
        title: 'NeoPrismLabs UI Library',
        type: 'project',
        description: 'Neubrutalist UI library for Flutter (somewhat completed), providing bold design components with modern aesthetics.',
        year: '2024-25',
        buttons: [
          { label: 'GitHub', link: 'https://github.com/neoprismlabs', icon: 'github' },
          { label: 'Website', link: 'https://neoprismlabs.in', icon: 'external' }
        ]
      },
      {
        date: '10 Apr 2025',
        title: 'ESP32 Controller & Hardware Robo',
        type: 'project',
        description: 'IoT-based robot car for Robowar competitions with ESP32 controller and Flutter app for remote control.',
        year: '2024-25',
        buttons: [
          { label: 'GitHub', link: 'https://github.com/RishiAhuja/esp32-robowar-app', icon: 'github' },
        ]
      },
      {
        date: '4 Apr 2025',
        title: 'Stack Wealth Flutter Internship',
        type: 'internship',
        description: 'Flutter intern at YC S21 company, ranked #2 contributor with 50+ PRs merged for Athena app.',
        year: '2024-25',
        buttons: [
          { label: 'LOR', link: 'https://drive.google.com/file/d/12MZKpXLjgAQN3gtzB-0IFRipC4g-qtyO/view?usp=drive_link', icon: 'certificate' },
          { label: 'Tweet', link: 'https://x.com/archiexzzz/status/1919137769474929025', icon: 'external' }
        ]
      },
      {
        date: '1 Apr 2025',
        title: 'Bits of Trust: The Elegance of AES',
        type: 'blog',
        description: 'Technical blog (24 min read) exploring AES encryption algorithms and cryptographic implementations.',
        year: '2024-25',
        buttons: [
          { label: 'Read Blog', link: 'https://rishi2220.hashnode.dev/bits-of-trust-the-elegance-of-aes', icon: 'blog' }
        ]
      },
      {
        date: '29 Mar 2025',
        title: 'Axon AES Implementation',
        type: 'project',
        description: '0-dependency AES implementation tool in C with SIMD optimizations for high performance encryption.',
        year: '2024-25',
        buttons: [
          { label: 'GitHub', link: 'https://github.com/RishiAhuja/axon', icon: 'github' },
          { label: 'Release', link: 'https://github.com/RishiAhuja/axon/releases', icon: 'docs' }
        ]
      },
      {
        date: '10 Mar 2025',
        title: 'BarqScoot E-Scooter Platform',
        type: 'project',
        description: 'Freelancing project for Saudi Arabia-based e-scooter rental platform with real-time tracking and IoT integration.',
        year: '2024-25',
        buttons: [
          { label: 'GitHub', link: 'https://github.com/RishiAhuja/barqscoot', icon: 'github' },
        ]
      },
      {
        date: '27 Feb 2025',
        title: 'Building Rosenblatt\'s Perceptron From Scratch in Flutter',
        type: 'blog',
        description: 'Technical blog (24 min read) implementing classic machine learning perceptron algorithm in Flutter with visual explanations.',
        year: '2024-25',
        buttons: [
          { label: 'Read Blog', link: 'https://rishi2220.hashnode.dev/building-rosenblatts-perceptron-from-scratch-a-comprehensive-technical-deep-dive', icon: 'blog' }
        ]
      },
      {
        date: '24 Feb 2025',
        title: 'Perceptron Simulator',
        type: 'project',
        description: '0-dependency Flutter visualization for Rosenblatt Perceptrons, educational tool for understanding neural networks.',
        year: '2024-25',
        buttons: [
          { label: 'GitHub', link: 'https://github.com/RishiAhuja/perceptron', icon: 'github' },
          { label: 'Demo Video', link: 'https://youtu.be/V5WDkxi9qWg?si=CR3zSRFjn8wmRBRf', icon: 'external' },
        ]
      },
      {
        date: '20 Feb 2025',
        title: 'Numd - NumPy but in Dart',
        type: 'project',
        description: 'Rudimentary NumPy clone implemented in Dart, providing numerical computation capabilities for Flutter applications.',
        year: '2024-25',
        buttons: [
          { label: 'GitHub', link: 'https://github.com/RishiAhuja/numd', icon: 'github' },
          { label: 'Pub.dev', link: 'https://pub.dev/packages/numd', icon: 'external' }
        ]
      },
      {
        date: '15 Feb 2025',
        title: 'KisaanMithraa Agricultural Platform',
        type: 'project',
        description: 'Agricultural app developed under Annam AI initiative with IIT Ropar, featuring cooperative management and multilingual support.',
        year: '2024-25',
        buttons: [
          { label: 'GitHub', link: 'https://github.com/RishiAhuja/kisaanmithraa', icon: 'github' },
        ]
      },
      {
        date: '10 Feb 2025',
        title: 'FinGenie Social Score Management',
        type: 'project',
        description: 'AI-based social score management system developed as hackathon product, focusing on social credit algorithms.',
        year: '2024-25',
        buttons: [
          { label: 'GitHub', link: 'https://github.com/RishiAhuja/fingenie/', icon: 'github' },
        ]
      },
      {
        date: '25 Jan 2025',
        title: 'Level SuperMind Frontend Internship',
        type: 'internship',
        description: 'Frontend development internship using Next.js, working on religious services platform with agile methodology.',
        year: '2024-25',
        buttons: [
          { label: 'LOR', link: 'https://drive.google.com/file/d/1mWVdeaanniDgBbJE5a5gmxK5cgJhXm3y/view?usp=sharing', icon: 'certificate' }
        ]
      },
      {
        date: '19 Jan 2025',
        title: 'Level SuperMind National Hack - 2nd Place',
        type: 'achievement',
        description: 'Won 2nd place at national hackathon in Mumbai among 23,000+ participants with SoulBuddy AI project.',
        year: '2024-25',
        buttons: [
          { label: 'Tweet', link: 'https://x.com/Rishi2220/status/1881041863983169800', icon: 'certificate' },
          { label: 'Demo Video', link: 'https://youtu.be/AS8gnSInEF4?si=age9v2QcePFksNOU', icon: 'external' },
        ]
      },
      {
        date: '18 Jan 2025',
        title: 'SoulBuddy AI Spiritual Guide',
        type: 'project',
        description: '12-hour hackathon project creating AI-powered astrological guidance platform with personalized insights and predictions.',
        year: '2024-25',
        buttons: [
          { label: 'GitHub', link: 'https://github.com/RishiAhuja/SoulBuddy.ai', icon: 'github' },
        ]
      },
      {
        date: '9 Jan 2025',
        title: 'Nexus Tech Blogging Platform',
        type: 'project',
        description: 'Flutter web technical blogging platform with rich Markdown editing, user authentication, and clean architecture.',
        year: '2024-25',
        buttons: [
          { label: 'GitHub', link: 'https://github.com/RishiAhuja/nexus', icon: 'github' },
          { label: 'Live App', link: 'https://nexus.rishia.in', icon: 'demo' }
        ]
      },
      {
        date: '5 Jan 2025',
        title: 'Getting Cracked at Clean and BLoC Architecture',
        type: 'blog',
        description: 'Advanced Flutter architecture blog (22 min read) covering clean architecture principles and BLoC pattern implementation.',
        year: '2024-25',
        buttons: [
          { label: 'Read Blog', link: 'https://rishi2220.hashnode.dev/getting-cracked-at-clean-and-bloc-architecture', icon: 'blog' }
        ]
      },
      {
        date: '28 Dec 2024',
        title: 'Bit by Bit: C++',
        type: 'project',
        description: 'Comprehensive 150-page C++ programming guide covering fundamentals to advanced concepts with practical examples.',
        year: '2024-25',
        buttons: [
          { label: 'Download PDF', link: 'https://rishiahuja.gumroad.com/l/cpp', icon: 'download' },
        ]
      },
      // {
      //   date: '26 Dec 2024',
      //   title: 'RoboRace NITJ - 2nd Place',
      //   type: 'achievement',
      //   description: 'Secured 2nd position in robotics competition at NITJ, demonstrating hardware integration and control systems expertise.',
      //   year: '2024-25',
      //   buttons: [
      //     { label: '', link:'#',  icon: 'certificate' },
      //     { label: 'Demo Video', link: '#', icon: 'video' }
      //   ]
      // },
      {
        date: '13 Dec 2024',
        title: 'Getting Started at BLoC Architecture',
        type: 'blog',
        description: 'Beginner-friendly Flutter architecture blog (23 min read) introducing BLoC pattern with practical examples.',
        year: '2024-25',
        buttons: [
          { label: 'Read Blog', link: 'https://rishi2220.hashnode.dev/getting-started-at-bloc-architecture', icon: 'blog' }
        ]
      },
      {
        date: '8 Dec 2024',
        title: 'Flutter Spotify Clone',
        type: 'project',
        description: 'Full-featured music streaming app built with Flutter and BLoC pattern, implementing advanced audio controls and UI.',
        year: '2024-25',
        buttons: [
          { label: 'GitHub', link: 'https://github.com/RishiAhuja/flutter-spotify-clone/', icon: 'github' },
        ]
      },
      {
        date: '28 Nov 2024',
        title: 'GDSC NITJ Core Member',
        type: 'community',
        description: 'Became Core member (Mobile Dev) of Google Developer Student Club NITJ, organizing technical workshops.',
        year: '2024-25',
        buttons: [
          { label: 'Linkedin', link: 'https://www.linkedin.com/posts/rishi-ahuja-b1a224310_im-happy-to-share-that-im-starting-a-new-activity-7268339791119765505-4g-k?utm_source=share&utm_medium=member_desktop&rcm=ACoAAE8OG0YBW0x_VJWiL5Z6CLmHlpxAa8e5EXE', icon: 'external' }
        ]
      },
      {
        date: '1 Nov 2024',
        title: 'Resource Management with Probabilistic Scheduling in Linux',
        type: 'blog',
        description: 'Deep technical blog (33 min read) exploring Linux kernel scheduling mechanisms and resource management algorithms.',
        year: '2024-25',
        buttons: [
          { label: 'Read Blog', link: 'https://rishi2220.hashnode.dev/resource-management-with-probabilistic-scheduling-in-the-context-of-linux', icon: 'blog' }
        ]
      },
      {
        date: '28 Oct 2024',
        title: 'PEC × Prajna AI Hackathon - 3rd Place',
        type: 'achievement',
        description: 'Placed 3rd solo in hackathon among 60+ teams, developing IPQS (Intelligence PDF Querying System) with innovative AI implementation.',
        year: '2024-25',
        buttons: [
          { label: 'Linkedin', link: 'https://www.linkedin.com/posts/rishi-ahuja-b1a224310_i-recently-participated-in-my-first-18-hour-activity-7256694930364887042-BTQ4?utm_source=share&utm_medium=member_desktop&rcm=ACoAAE8OG0YBW0x_VJWiL5Z6CLmHlpxAa8e5EXE', icon: 'demo' }
        ]
      },
      {
        date: '19 Oct 2024',
        title: 'IPQS - Intelligence PDF Querying System',
        type: 'project',
        description: 'AI-powered document analysis system for intelligent PDF querying and information extraction using advanced NLP techniques.',
        year: '2024-25',
        buttons: [
          { label: 'GitHub', link: 'https://github.com/rishiahuja/ipqs', icon: 'github' },
          { label: 'Demo video', link: 'https://youtu.be/ydlOXu-8uQg?si=iXOu2GnT7aOmWtgN', icon: 'external' },
        ]
      },
      {
        date: '16 Sep 2024',
        title: 'Flutter Chat Application',
        type: 'project',
        description: 'Real-time messaging application built with Flutter, featuring modern chat interface and real-time communication.',
        year: '2024-25',
        buttons: [
          { label: 'GitHub', link: 'https://github.com/RishiAhuja/chat-app', icon: 'github' },
          { label: 'Demo Video', link: '#', icon: 'video' }
        ]
      },
      {
        date: '3 Sep 2024',
        title: 'State of the Art - ART (Android Runtime)',
        type: 'blog',
        description: 'Technical blog (6 min read) analyzing Android Runtime (ART) and its impact on app performance and development.',
        year: '2024-25',
        buttons: [
          { label: 'Read Blog', link: 'https://rishi2220.hashnode.dev/art', icon: 'blog' }
        ]
      },
      // {
      //   date: '1 Sep 2024',
      //   title: 'Ideathon NITJ - 2nd Place',
      //   type: 'achievement',
      //   description: 'Secured 2nd position in ideation competition at NITJ, showcasing innovative problem-solving and presentation skills.',
      //   year: '2024-25',
      //   buttons: [
      //     { label: 'Certificate', link: '#', icon: 'certificate' },
      //     { label: 'Presentation', link: '#', icon: 'docs' }
      //   ]
      // },
      {
        date: '16 Aug 2024',
        title: 'Comprehensive Arch Linux Blog',
        type: 'blog',
        description: 'In-depth technical guide (26 min read) covering Arch Linux installation, configuration, and advanced system administration.',
        year: '2024-25',
        buttons: [
          { label: 'Read Blog', link: 'https://rishi2220.hashnode.dev/comprehensive-arch-linux-guide', icon: 'blog' }
        ]
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

  const getButtonIcon = (iconType: string) => {
    switch (iconType) {
      case 'github':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        );
      case 'demo':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        );
      case 'blog':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        );
      case 'certificate':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      case 'video':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M13 16h-1.586a1 1 0 01-.707-.293l-2.414-2.414a1 1 0 00-.707-.293H7m9-5v.01M7 16v.01" />
          </svg>
        );
      case 'docs':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'download':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'external':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
    }
  };

  const currentData = timelineData[selectedYear] || [];
  const counts = getTypeCounts(currentData);

  return (
    <main className="min-h-screen bg-codGray text-quillGray">
      {/* Back to Home - with blur effect */}
      <div className={`${isMobile ? 'px-4' : 'px-8'} pt-8 sticky top-0 z-10`}>
        <div className="absolute inset-0 bg-codGray/80 backdrop-blur-sm -z-10"></div>
        <Link href="/" className="inline-flex items-center text-accent hover:text-accent-light transition-colors font-ptMono">
          ← Back to Home
        </Link>
      </div>

      <div className={`${isMobile ? 'w-full px-4' : 'w-[65%] px-8'} mx-auto py-12 relative`}>
        {/* Subtle blur effect for the header */}
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-bgShades-light/5 to-transparent pointer-events-none"></div>
        
        {/* Header */}
        <div className="text-center mb-12 relative">
          <h1 className="text-4xl font-bold font-ptMono text-quillGray mb-4">
            First Year Timeline
          </h1>
          <p className="text-lg text-gunSmoke font-ptMono">
            A chronological record of events
          </p>
          <div className="w-1/3 h-px bg-darkGrey mx-auto mt-4 relative overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-1/2 bg-accent-light opacity-60"></div>
          </div>
        </div>

        {/* Year Selector */}
        <div>
          <div className="text-center mb-8">
            <span className="text-gunSmoke font-ptMono text-sm">Academic Year 2024-25</span>
          </div>
        </div>


        {/* Timeline */}
        <div>
          <ExpandedContainer text="Timeline Events" />
          <div className="h-8" />
          
          <div className="relative">
            {/* Timeline line with subtle glow */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-darkGrey"></div>
            <div className="absolute left-4 top-0 h-8 w-0.5 bg-accent-light shadow-[0_0_10px_rgba(100,178,188,0.3)]"></div>
            
            <div className="space-y-8">
              {currentData.length > 0 ? currentData.map((item, index) => (
                <div key={index} className="relative flex items-start">
                  {/* Timeline dot with glow */}
                  <div className="relative z-10 w-2 h-2 bg-accent rounded-full mt-6 mr-6 border-2 border-codGray shadow-[0_0_6px_rgba(100,178,188,0.4)]"></div>
                  
                  {/* Timeline card with glass effect */}
                  <div className="flex-1">
                    <div 
                      className="border rounded-sm transition-all duration-300 h-full
                        border-darkGrey hover:border-accent-light hover:shadow-[0_4px_20px_-12px_rgba(100,178,188,0.25)] hover:transform hover:-translate-y-1
                        flex flex-col cursor-pointer group relative bg-codGray/70 backdrop-blur-[2px]"
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
                        
                        {/* Action Buttons */}
                        {item.buttons && item.buttons.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.buttons.map((button, buttonIndex) => (
                              <a
                                key={buttonIndex}
                                href={button.link}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-ptMono 
                                  border border-darkGrey text-gunSmoke hover:border-accent-light hover:text-accent-light 
                                  transition-colors duration-200 rounded-sm bg-bgShades-light/50"
                                target={button.link.startsWith('#') ? '_self' : '_blank'}
                                rel="noopener noreferrer"
                              >
                                {getButtonIcon(button.icon)}
                                <span>{button.label}</span>
                              </a>
                            ))}
                          </div>
                        )}

                        {/* Bottom Actions */}
                        <div className="flex justify-between items-center mt-auto">
                          {/* Date */}
                          <span className="text-xs text-gray-400 font-ptMono">
                            {item.date}
                          </span>
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
          <div className="text-center mt-16 p-8 border border-darkGrey rounded-sm hover:border-accent-light/50 transition-colors
                          relative bg-bgShades-light/10 backdrop-blur-[1px]">
            <div className="absolute inset-0 bg-gradient-to-t from-accent/3 to-transparent pointer-events-none"></div>
            <h2 className="text-2xl font-bold text-quillGray font-ptMono mb-4 relative">
              First Year Complete
            </h2>
            <p className="text-gunSmoke mb-6 relative">
              38 events across projects, technical writing, competitions, and professional development.
            </p>
            <Link 
              href="/"
              className="inline-block border border-darkGrey hover:border-accent-light text-quillGray hover:text-accent-light px-6 py-3 rounded-sm transition-colors font-ptMono relative
                        bg-bgShades-lighter/50 hover:bg-bgShades-lighter/80 backdrop-blur-sm"
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
