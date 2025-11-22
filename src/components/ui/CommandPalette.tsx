import React, { useState, useEffect, useRef } from 'react';
import type { TimelineEvent } from '../../data/timeline';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: TimelineEvent[];
  onSelectItem: (item: TimelineEvent) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, items, onSelectItem }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<TimelineEvent[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = items.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(query);
      const descriptionMatch = item.description.toLowerCase().includes(query);
      const typeMatch = item.type.toLowerCase().includes(query);
      
      return titleMatch || descriptionMatch || typeMatch;
    });

    setFilteredItems(filtered);
    setSelectedIndex(0);
  }, [searchQuery, items]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredItems.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
        e.preventDefault();
        onSelectItem(filteredItems[selectedIndex]);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose, onSelectItem]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && filteredItems.length > 0) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex, filteredItems]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-codGray/80 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh] px-4"
      onClick={onClose}
    >
      <div 
        className="bg-darkGrey border border-gunSmoke/30 rounded-sm w-full max-w-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center border-b border-gunSmoke/30 px-4 py-3">
          <svg className="w-5 h-5 text-gunSmoke mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search life events, hackathons, achievements..."
            className="flex-1 bg-transparent text-quillGray font-ptMono text-base outline-none placeholder:text-gunSmoke"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="ml-2 text-gunSmoke hover:text-accent-light transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Results */}
        <div 
          ref={resultsRef}
          className="max-h-[60vh] overflow-y-auto custom-scrollbar"
        >
          {filteredItems.length > 0 ? (
            <div className="py-2">
              {filteredItems.map((item, index) => (
                <button
                  key={`${item.date}-${item.title}`}
                  onClick={() => {
                    onSelectItem(item);
                    onClose();
                  }}
                  className={`
                    w-full text-left px-4 py-3 transition-all duration-200
                    ${index === selectedIndex 
                      ? 'bg-accent-light/10 border-l-2 border-accent-light' 
                      : 'border-l-2 border-transparent hover:bg-darkGrey/50'
                    }
                  `}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`
                          px-2 py-0.5 text-[10px] font-ptMono rounded border
                          ${getTypeBadge(item.type)}
                        `}>
                          {item.type.toUpperCase()}
                        </span>
                        <span className="text-xs font-ptMono text-gunSmoke">
                          {item.date}
                        </span>
                      </div>
                      <h3 className="font-ptMono text-sm md:text-base text-quillGray mb-1 truncate">
                        {item.title}
                      </h3>
                      <p className="text-xs md:text-sm text-gunSmoke line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="px-4 py-12 text-center">
              <svg className="w-12 h-12 text-gunSmoke/50 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-ptMono text-sm text-gunSmoke">
                No results found for "{searchQuery}"
              </p>
              <p className="font-ptMono text-xs text-gunSmoke/70 mt-1">
                Try searching for hackathons, achievements, or events
              </p>
            </div>
          ) : (
            <div className="px-4 py-12 text-center">
              <svg className="w-12 h-12 text-gunSmoke/50 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="font-ptMono text-sm text-gunSmoke">
                Start typing to search life events
              </p>
              <p className="font-ptMono text-xs text-gunSmoke/70 mt-1">
                Search by title, type, description, or tags
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gunSmoke/30 px-4 py-2 flex items-center justify-between text-xs font-ptMono text-gunSmoke">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-codGray border border-gunSmoke/30 rounded text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-codGray border border-gunSmoke/30 rounded text-[10px]">↓</kbd>
              <span className="ml-1">Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-codGray border border-gunSmoke/30 rounded text-[10px]">↵</kbd>
              <span className="ml-1">Select</span>
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-codGray border border-gunSmoke/30 rounded text-[10px]">esc</kbd>
            <span className="ml-1">Close</span>
          </span>
        </div>
      </div>
    </div>
  );
};

const getTypeBadge = (type: string) => {
  // Use consistent accent color scheme for all types
  return 'bg-accent-light/10 text-accent-light border-accent-light/30';
};

export default CommandPalette;
