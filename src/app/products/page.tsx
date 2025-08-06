'use client';

import React, { useEffect } from 'react';
import { CheckCircle, MessageCircle, ArrowRight, Star } from 'lucide-react';
import StoreInfoBox from '../../components/StoreInfoBox'; 

const Products: React.FC = () => {
  useEffect(() => {

    window.scrollTo({ top: 0, behavior: 'smooth' });

    const initializeProducts = async () => {
      try {
        const { initializeProductsSection } = await import('../../lib/productBuilder');
        initializeProductsSection();
      } catch (error) {
        console.error('Failed to load product builder:', error);
      }
    };

    initializeProducts();
  }, []);

  const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME || "";

    useEffect(() => {
        document.title = `Products | ${projectName}`;
      }, []);

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
          <div id="products-section">
            {}
          </div>
        </div>
      </section>

      {}
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
    </div>
  );
};

export default Products;