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
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 font-ptMono text-sm text-gunSmoke">
        {items.map((item, index) => (
          <li key={`breadcrumb-${item.label}-${index}`} className="flex items-center gap-2">
            {item.href ? (
              <a
                href={item.href}
                className="hover:text-accent-light transition-colors duration-200"
              >
                {item.label}
              </a>
            ) : (
              <span className="text-quillGray">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <svg
                className="w-3 h-3 text-darkGrey"
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
