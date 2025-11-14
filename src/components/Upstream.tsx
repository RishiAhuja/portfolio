import React, { useState, useEffect } from 'react';
import ExpandedContainer from './ui/ExpandedContainer';
import { fetchUserPRs, fetchUserIssues, formatDate, type GitHubPR, type GitHubIssue } from '../lib/github-upstream';

interface UpstreamItemProps {
  item: GitHubPR | GitHubIssue;
  getStateBadge: (state: string) => string;
  getStateLabel: (state: string) => string;
}

const UpstreamItem: React.FC<UpstreamItemProps> = ({ item, getStateBadge, getStateLabel }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        cursor-pointer transition-all duration-200 rounded-sm
        ${isHovered ? 'bg-darkGrey/30 border-accent-light' : 'bg-transparent border-transparent'}
        border p-3 md:p-4
        block w-full
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.open(item.url, '_blank')}
    >
      {/* Mobile Layout */}
      <div className="block md:hidden">
        <div className="flex items-start gap-2 mb-2">
          <div 
            className={`
              ${isHovered ? 'w-2 h-2' : 'w-1.5 h-1.5'} 
              rounded-full bg-accent-light transition-all duration-200
              flex-shrink-0 mt-1.5
            `}
          />
          <span className={`
            font-ptMono text-quillGray 
            text-sm leading-tight
            ${isHovered ? 'text-accent-light' : ''}
            transition-colors duration-200
            break-words flex-1
          `}>
            {item.title}
          </span>
        </div>
        
        <div className="flex items-center justify-between pl-4 gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2 py-0.5 text-xs font-ptMono rounded border ${getStateBadge(item.state)}`}>
              {getStateLabel(item.state)}
            </span>
            <span className="text-xs text-gunSmoke font-ptMono">
              {item.repo}
            </span>
          </div>
          <div className={`
            transition-all duration-200
            ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-70 -translate-x-1'}
          `}>
            <span className="text-accent-light text-sm">→</span>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex md:items-center md:justify-between md:gap-4">
        <div className="flex items-center flex-1 min-w-0 gap-3">
          <div 
            className={`
              ${isHovered ? 'w-2 h-2' : 'w-1.5 h-1.5'} 
              rounded-full bg-accent-light transition-all duration-200
              flex-shrink-0
            `}
          />
          
          <span className={`
            font-ptMono text-quillGray 
            text-base lg:text-lg
            ${isHovered ? 'text-accent-light' : ''}
            transition-colors duration-200
            leading-normal
            truncate
          `}>
            {item.title}
          </span>
        </div>
        
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`px-2 py-0.5 text-xs font-ptMono rounded border ${getStateBadge(item.state)}`}>
            {getStateLabel(item.state)}
          </span>
          <span className="text-sm text-gunSmoke font-ptMono whitespace-nowrap">
            {item.repo}
          </span>
          
          <div className={`
            transition-all duration-200
            ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-70 -translate-x-1'}
          `}>
            <span className="text-accent-light text-lg">→</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Upstream: React.FC = () => {
  const [prs, setPrs] = useState<GitHubPR[]>([]);
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'prs' | 'issues'>('prs');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const loadUpstreamData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [fetchedPRs, fetchedIssues] = await Promise.all([
          fetchUserPRs(),
          fetchUserIssues(),
        ]);

        setPrs(fetchedPRs);
        setIssues(fetchedIssues);
      } catch (err) {
        console.error('Error loading upstream data:', err);
        setError('Failed to load upstream contributions');
      } finally {
        setIsLoading(false);
      }
    };

    loadUpstreamData();
  }, []);

  const getStateBadge = (state: string) => {
    switch (state) {
      case 'open':
        return 'bg-accent-light/10 text-accent-light border-accent-light/30';
      case 'merged':
        return 'bg-purple-400/10 text-purple-400 border-purple-400/30';
      default:
        return 'bg-gunSmoke/10 text-gunSmoke border-gunSmoke/30';
    }
  };

  const getStateLabel = (state: string) => {
    return state === 'closed' ? 'MERGED' : state.toUpperCase();
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-2 md:space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-darkGrey/30 h-16 md:h-20 rounded-sm animate-pulse"></div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-base font-ptMono text-gunSmoke">
          {error}
        </div>
      );
    }

    const items = activeTab === 'prs' ? prs : issues;

    if (items.length === 0) {
      return (
        <div className="text-base font-ptMono text-gunSmoke">
          No {activeTab === 'prs' ? 'pull requests' : 'issues'} found.
        </div>
      );
    }

    const displayItems = showAll ? items : items.slice(0, 5);

    return (
      <>
        <div className="space-y-2 md:space-y-4">
          {displayItems.map((item) => (
            <UpstreamItem key={item.id} item={item} getStateBadge={getStateBadge} getStateLabel={getStateLabel} />
          ))}
        </div>

        {items.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-4 w-full py-3 font-ptMono text-sm text-accent-light border border-darkGrey/40 hover:border-accent-light/30 rounded-sm transition-all duration-300 hover:bg-darkGrey/20"
          >
            {showAll ? 'Show Less' : `Show All (${items.length})`}
          </button>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col">
      <ExpandedContainer text="Upstream" />
      <div className="h-4" />
      
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('prs')}
          className={`px-4 py-2 font-ptMono text-sm rounded-sm transition-all duration-300 ${
            activeTab === 'prs'
              ? 'bg-accent-light/10 text-accent-light border border-accent-light/30'
              : 'bg-darkGrey/20 text-gunSmoke border border-darkGrey/40 hover:border-darkGrey/60'
          }`}
        >
          Pull Requests ({prs.length})
        </button>
        <button
          onClick={() => setActiveTab('issues')}
          className={`px-4 py-2 font-ptMono text-sm rounded-sm transition-all duration-300 ${
            activeTab === 'issues'
              ? 'bg-accent-light/10 text-accent-light border border-accent-light/30'
              : 'bg-darkGrey/20 text-gunSmoke border border-darkGrey/40 hover:border-darkGrey/60'
          }`}
        >
          Issues ({issues.length})
        </button>
      </div>

      {renderContent()}
    </div>
  );
};

export default Upstream;
