import React, { useState, useEffect } from 'react';

interface HeaderProps {
  currentPath?: string;
}

const Header: React.FC<HeaderProps> = ({ currentPath = '/' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isResearchHome = currentPath === '/';

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Blogs', href: '/blogs' },
    { label: 'Artifacts', href: '/gallery' },
    { label: 'Ledger', href: '/ledger' },
    { label: 'Community', href: '/community' },
    { label: 'Research', href: '/rsh' },
    { label: 'Links', href: '/links' },
  ];
  const visibleNavItems = isResearchHome
    ? [
        { label: 'Research', href: '/rsh' },
        { label: 'Writing', href: '/blogs' },
        { label: 'CV', href: '/resume' },
        { label: 'Links', href: '/links' },
      ]
    : navItems;

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
      <header className={`relative z-10 border-b ${isResearchHome ? 'bg-white border-[#dedede]' : 'bg-codGray border-transparent'}`}>
        <nav className={`${isResearchHome ? 'max-w-[852px]' : 'max-w-7xl'} mx-auto px-4 py-3 flex items-center justify-between`}>
          <a href="/" className={`${isResearchHome ? 'font-inter text-sm font-semibold text-[#222]' : 'font-ptMono text-xs font-bold tracking-[0.18em] text-quillGray'}`} aria-label="Rishi Ahuja home">
            {isResearchHome ? 'Rishi Ahuja' : 'R/A'}
          </a>
          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            {visibleNavItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`${isResearchHome ? 'font-inter text-[13px] font-normal' : 'font-ptMono text-sm'} transition-colors relative group ${
                    isResearchHome
                      ? isActive(item.href) ? 'text-[#222]' : 'text-[#555] hover:text-[#174ea6]'
                      : isActive(item.href) ? 'text-accent-light' : 'text-gunSmoke hover:text-quillGray'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px ${isResearchHome ? 'bg-transparent' : 'bg-accent-light'} ${
                      isResearchHome ? 'w-0' : isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden transition-colors p-2 relative z-50 ${isResearchHome ? 'text-[#222] hover:text-[#174ea6]' : 'text-quillGray hover:text-accent-light'}`}
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
        <>
          {/* Backdrop with click handler */}
          <div 
            className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ease-out ${isResearchHome ? 'bg-white/98' : 'bg-codGray/85'}`}
            onClick={() => setIsMenuOpen(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsMenuOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Close menu"
          />
          
          {/* Menu Content */}
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center md:hidden pointer-events-none">
            <nav className="space-y-8 pointer-events-auto animate-[fadeInScale_0.4s_ease-out]">
              {/* Main Pages */}
              {visibleNavItems.map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`block ${isResearchHome ? 'font-inter' : 'font-ptMono'} text-xl text-center transition-colors ${
                    isActive(item.href)
                      ? isResearchHome ? 'text-[#222]' : 'text-accent-light'
                      : isResearchHome ? 'text-[#555] hover:text-[#174ea6]' : 'text-quillGray hover:text-accent-light'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Close hint */}
            <div className="absolute bottom-12 left-0 right-0 text-center">
              <p className={`font-ptMono text-sm ${isResearchHome ? 'text-[#777]' : 'text-gunSmoke'}`}>
                Press <kbd className="px-2 py-1 bg-darkGrey/50 rounded text-xs">ESC</kbd> to close
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
