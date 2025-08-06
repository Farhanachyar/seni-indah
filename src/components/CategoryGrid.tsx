'use client';

import React, { useEffect, useState } from 'react';
import { buildApiUrl, buildMediaUrl } from '../lib/apiEndpointsV2';
import { apiPost, ApiError } from '../utils/apiClient';

interface Category {
  category_id: number;
  category_name: string;
  category_slug: string;
  category_image: string;
  parent_id: number | null;
  total_products: number;
}

interface CategoryResponse {
  success: boolean;
  data: {
    categories: Category[];
  };
}

const CategoryGrid: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const data: CategoryResponse = await apiPost(
        '/v1.0/services/product/category', 
        {}, 
        {}, 
        true 
      );

      if (!data.success || !data.data.categories) {
        throw new Error('Invalid response format');
      }

      const parentCategories = data.data.categories.filter(
        category => category.parent_id === null
      );

      setCategories(parentCategories);
    } catch (err) {
      console.error('Error loading categories:', err);

      let errorMessage = 'Terjadi kesalahan saat memuat kategori';

      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categorySlug: string) => {
    window.location.href = `/category/${categorySlug}`;
  };

  const CategoryItem: React.FC<{ category: Category }> = ({ category }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const imageUrl = category.category_image ? buildMediaUrl(category.category_image) : null;
    const fallbackLetter = category.category_name.charAt(0).toUpperCase();

    const handleImageLoad = () => {
      setImageLoaded(true);
    };

    const handleImageError = () => {
      setImageError(true);
    };

    return (
      <div 
        className="group cursor-pointer flex flex-col items-center w-full p-3 sm:p-4 min-h-[180px] sm:min-h-[200px] md:min-h-[220px] lg:min-h-[240px] hover:bg-gradient-to-br hover:from-green-50 hover:to-blue-50 transition-all duration-300"
        onClick={() => handleCategoryClick(category.category_slug)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCategoryClick(category.category_slug);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`Kategori ${category.category_name}`}
      >
        {}
        <div className="mb-3 w-full flex-shrink-0">
          <div className="aspect-square relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden w-full rounded-xl border border-gray-200 group-hover:border-green-300 transition-colors duration-300">
            {imageUrl && !imageError ? (
              <div className={`lazy-load-image-background blur w-full h-full absolute inset-0 rounded-xl ${imageLoaded ? 'lazy-load-image-loaded' : ''}`}>
                <img
                  src={imageUrl}
                  alt={category.category_name}
                  className="w-full h-full object-cover absolute inset-0 rounded-xl"
                  loading="lazy"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 rounded-xl">
                <span className="text-2xl sm:text-3xl md:text-4xl text-green-600 font-bold">
                  {fallbackLetter}
                </span>
              </div>
            )}

            {}
            <div className="absolute top-2 right-2 bg-white bg-opacity-95 backdrop-blur-sm text-green-700 text-sm sm:text-sm font-bold px-2 py-1 rounded-full border border-green-200">
              {category.total_products}
            </div>
          </div>
        </div>

        {}
        <div className="text-center w-full flex-1 flex items-center justify-center px-1">
          <h3 className="font-bold text-gray-800 text-base sm:text-base md:text-base leading-tight break-words w-full group-hover:text-green-700 transition-colors duration-300 text-center line-clamp-2">
            {category.category_name}
          </h3>
        </div>

        {}
        <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="text-sm sm:text-sm text-green-600 font-medium">Lihat Produk →</div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
        <div 
          className="px-4 relative z-10"
          style={{ 
            maxWidth: '1200px', 
            margin: '0 auto' 
          }}
        >
          {}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-green-700 mb-6">
              Kategori Produk Kami
            </h2>
            <p className="text-gray-700 text-xl max-w-4xl mx-auto leading-relaxed font-medium">
              Memuat kategori produk...
            </p>
          </div>

          {}
          <div 
            className="w-full mx-auto"
            style={{ 
              maxWidth: '1200px'
            }}
          >
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 divide-x divide-y divide-gray-200">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="animate-pulse flex flex-col items-center w-full p-3 sm:p-4 min-h-[180px] sm:min-h-[200px] md:min-h-[220px] lg:min-h-[240px]">
                    <div className="aspect-square bg-gray-200 mb-3 w-full rounded-xl"></div>
                    <div className="w-full text-center">
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
        <div 
          className="px-4 relative z-10"
          style={{ 
            maxWidth: '1200px', 
            margin: '0 auto' 
          }}
        >
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
              <span className="text-4xl">⚠️</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Gagal Memuat Kategori</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
            <button 
              onClick={loadCategories}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 font-semibold transition-all duration-300 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
        <div 
          className="px-4 relative z-10"
          style={{ 
            maxWidth: '1200px', 
            margin: '0 auto' 
          }}
        >
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <span className="text-4xl">📦</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Belum Ada Kategori</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">Kategori produk sedang dalam proses penambahan</p>
            <button 
              onClick={loadCategories}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 font-semibold transition-all duration-300 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Muat Ulang
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
      {}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gray-200 rounded-full blur-3xl"></div>
      </div>

      <div 
        className="px-4 relative z-10"
        style={{ 
          maxWidth: '1200px', 
          margin: '0 auto' 
        }}
      >
        {}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-green-700 mb-6">
            Kategori Produk Kami
          </h2>
          <p className="text-gray-700 text-xl max-w-4xl mx-auto leading-relaxed font-medium">
            Jelajahi koleksi lengkap produk interior berkualitas tinggi. 
            <span className="text-green-600 font-semibold"> Dikerjakan oleh tenaga profesional</span> 
          </p>
        </div>

        {}
        <div 
          className="w-full mx-auto"
          style={{ 
            maxWidth: '1200px'
          }}
        >
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 divide-x divide-y divide-gray-200">
              {categories.map((category) => (
                <CategoryItem key={category.category_id} category={category} />
              ))}
            </div>
          </div>
        </div>

        {}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Tidak menemukan yang Anda cari?</p>
          <button 
            onClick={() => window.open('https://wa.me/6282170669287', '_blank')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-full font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:-translate-y-1 border border-green-600"
          >
            <span>💬</span>
            Konsultasi dengan Ahli
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;