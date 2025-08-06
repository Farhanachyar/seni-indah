'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface ProductBreadcrumbProps {
  product: {
    title: string;
    slug: string;
    category: {
      name?: string;
      slug?: string;
      path?: string;
    };
  };
}

interface BreadcrumbItem {
  name: string;
  href?: string | null;
  icon?: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

export default function ProductBreadcrumb({ product }: ProductBreadcrumbProps) {

  const getCategoryPath = () => {
    if (product.category.path) {

      return product.category.path.split(' > ').map((name, index) => ({
        name: name.trim(),
        slug: index === 0 ? product.category.slug : null 
      }));
    }

    if (product.category.name) {
      return [{
        name: product.category.name,
        slug: product.category.slug
      }];
    }

    return [];
  };

  const categoryPath = getCategoryPath();

  const breadcrumbItems: BreadcrumbItem[] = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Products', href: '/products' },
    { name: product.title, href: null, current: true }
  ];

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1 text-sm">
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        const Icon = item.icon;

        return (
          <div key={index} className="flex items-center">
            {}
            {index > 0 && (
              <ChevronRight className="w-3 h-3 text-gray-400 mx-1 flex-shrink-0" />
            )}

            {}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-200 truncate"
              >
                {Icon && <Icon className="w-4 h-4 mr-1 flex-shrink-0" />}
                <span className="truncate max-w-[120px] sm:max-w-none">
                  {item.name}
                </span>
              </Link>
            ) : (
              <span 
                className={`flex items-center truncate max-w-[150px] sm:max-w-[200px] ${
                  isLast 
                    ? 'text-gray-900 font-medium' 
                    : 'text-gray-500'
                }`}
                title={item.name}
              >
                {Icon && <Icon className="w-4 h-4 mr-1 flex-shrink-0" />}
                <span className="truncate">
                  {item.name}
                </span>
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}