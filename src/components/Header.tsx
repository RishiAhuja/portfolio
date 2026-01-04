import React, { useState, useEffect } from 'react';

interface HeaderProps {
  currentPath?: string;
}

const Header: React.FC<HeaderProps> = ({ currentPath = '/' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Blogs', href: '/blogs' },
    { label: 'Artifacts', href: '/gallery' },
    { label: 'Ledger', href: '/ledger' },
    { label: 'Uncompiled', href: '/uncompiled' },
    { label: 'Community', href: '/community' },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    
    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const isActive = (href: string) => {
    if (href === '/' && currentPath === '/') return true;
    if (href !== '/' && currentPath.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      {/* Header */}
      <header className="relative z-10 bg-codGray">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div />
          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`font-ptMono text-sm transition-colors relative group ${
                    isActive(item.href)
                      ? 'text-accent-light'
                      : 'text-gunSmoke hover:text-quillGray'
                  }`}
                >
                  {item.label}
                  <span 
                    className={`absolute -bottom-1 left-0 h-px bg-accent-light transition-all duration-300 ${
                      isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-quillGray hover:text-accent-light transition-colors p-2"
            aria-label="Toggle menu"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              )}
            </svg>
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-codGray/98 backdrop-blur-sm" />
          
          {/* Menu Content */}5
          <div className="relative h-full flex flex-col items-center justify-center">
            <nav className="space-y-8">
              {/* Home Link */}
              <a
                href="/"
                className={`block font-ptMono text-2xl text-center transition-colors ${
                  isActive('/')
                    ? 'text-accent-light'
                    : 'text-quillGray hover:text-accent-light'
                }`}
              >
                Home
              </a>

              {/* Main Pages */}
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`block font-ptMono text-2xl text-center transition-colors ${
                    isActive(item.href)
                      ? 'text-accent-light'
                      : 'text-quillGray hover:text-accent-light'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Close hint */}
            <div className="absolute bottom-12 left-0 right-0 text-center">
              <p className="font-ptMono text-sm text-gunSmoke">
                Press <kbd className="px-2 py-1 bg-darkGrey/50 rounded text-xs">ESC</kbd> to close
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
