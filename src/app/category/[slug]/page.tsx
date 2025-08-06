'use client';

import React, { useEffect } from 'react';
import { CheckCircle, MessageCircle, ArrowRight, Star } from 'lucide-react';
import StoreInfoBox from '../../../components/StoreInfoBox'; 

interface CategoryProductsProps {
  params: {
    slug: string;
  };
}

const CategoryProducts: React.FC<CategoryProductsProps> = ({ params }) => {
  const [isProductsLoaded, setIsProductsLoaded] = React.useState(false);

  useEffect(() => {

    window.scrollTo({ top: 0, behavior: 'smooth' });

    setIsProductsLoaded(false);

    const initializeCategoryProducts = async () => {
      try {
        const { initializeCategoryProductsSection } = await import('../../../lib/categoryProductBuilder');
        await initializeCategoryProductsSection(params.slug);

        setIsProductsLoaded(true);
      } catch (error) {
        console.error('Failed to load category product builder:', error);

        setIsProductsLoaded(true);
      }
    };

    initializeCategoryProducts();
  }, [params.slug]);

  const handleWhatsAppClick = () => {
    const message = 'Halo, saya tertarik dengan produk Seni Indah Gypsum. Bisa minta informasi lebih detail?';
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {}
      <section className="py-16">
        <div 
          className="px-4"
          style={{ 
            maxWidth: '1200px', 
            margin: '0 auto' 
          }}
        >
          <div id="category-products-section">
            {}
          </div>
        </div>
      </section>

      {}
      {isProductsLoaded && (
        <section className="py-8">
          <div 
            className="px-4"
            style={{ 
              maxWidth: '1200px', 
              margin: '0 auto' 
            }}
          >
            <StoreInfoBox />
          </div>
        </section>
      )}
    </div>
  );
};

export default CategoryProducts;