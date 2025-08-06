'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  onToggle?: (isOpen: boolean) => void;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  subtitle,
  icon,
  children,
  defaultOpen = false,
  className = '',
  headerClassName = '',
  contentClassName = '',
  onToggle
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [height, setHeight] = useState<number | undefined>(defaultOpen ? undefined : 0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      setHeight(isOpen ? scrollHeight : 0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (contentRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        if (isOpen) {
          const scrollHeight = entries[0].target.scrollHeight;
          setHeight(scrollHeight);
        }
      });

      resizeObserver.observe(contentRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [isOpen]);

  const toggleOpen = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {}
      <button
        onClick={toggleOpen}
        className={`w-full p-4 lg:p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200 ${headerClassName}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-left">
            {icon && (
              <div className="flex-shrink-0">
                {icon}
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex-shrink-0 ml-4">
            <div className={`transform transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
              <ChevronDown className="w-5 h-5 text-gray-500" />
            </div>
          </div>
        </div>
      </button>

      {}
      <div
        ref={contentRef}
        style={{ height }}
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className={`p-4 lg:p-6 ${contentClassName}`}>
          {children}
        </div>
      </div>

      {}
      <style jsx>{`
        .transition-all {
          transition-property: height, opacity;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default CollapsibleSection;