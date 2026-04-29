import React from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 md:mb-6">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-ptMono text-xs md:text-sm text-gunSmoke">
        {items.map((item, index) => (
          <li
            key={`breadcrumb-${item.label}-${index}`}
            className={`flex items-center gap-2 min-w-0 ${index === items.length - 1 ? 'max-w-full flex-1 sm:flex-none' : ''}`}
          >
            {item.href ? (
              <a
                href={item.href}
                className="hover:text-accent-light transition-colors duration-200 whitespace-nowrap"
                title={item.label}
              >
                {item.label}
              </a>
            ) : (
              <span
                className={`text-quillGray block ${index === items.length - 1 ? 'truncate max-w-full sm:max-w-[32rem] md:max-w-[42rem]' : 'whitespace-nowrap'}`}
                title={item.label}
              >
                {item.label}
              </span>
            )}
            {index < items.length - 1 && (
              <svg
                className="w-3 h-3 text-darkGrey flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
