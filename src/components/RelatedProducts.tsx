'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { productService } from '../lib/productService';

interface RelatedProduct {
  id: number;
  title: string;
  slug: string;
  price_regular: number;
  price_discount?: number;
  primary_image_url: string;
  has_discount: boolean;
  is_featured: boolean;
  stock_status: string;
}

interface Category {
  id: number;
  name?: string;
  slug?: string;
  path?: string;
  level?: number;
}

interface RelatedProductsProps {
  products?: RelatedProduct[];
  categorySlug?: string;
  category?: Category;
}

export default function RelatedProducts({ products: initialProducts, categorySlug, category }: RelatedProductsProps) {
  const [products, setProducts] = useState<RelatedProduct[]>(initialProducts || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!categorySlug || (initialProducts && initialProducts.length > 0)) {
        return;
      }

      setLoading(true);
      try {
        const response = await productService.getProductList({
          category_slug: categorySlug,
          limit: 10,
          is_featured: null
        });

        if (response.success && response.data && response.data.products) {
          setProducts(response.data.products);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [categorySlug, initialProducts]);

  const getItemsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 2; 
      if (window.innerWidth < 768) return 2; 
      if (window.innerWidth < 1024) return 3; 
      return 5; 
    }
    return 5;
  };

  const [itemsPerView, setItemsPerView] = useState(getItemsPerView());

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(getItemsPerView());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const extendedProducts = products.length > 0 ? [
    ...products.slice(-itemsPerView),
    ...products,
    ...products.slice(0, itemsPerView)
  ] : [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handlePrevSlide = () => {
    if (isTransitioning || products.length === 0) return;

    setIsTransitioning(true);
    setCurrentIndex(prev => prev - 1);
  };

  const handleNextSlide = () => {
    if (isTransitioning || products.length === 0) return;

    setIsTransitioning(true);
    setCurrentIndex(prev => prev + 1);
  };

  useEffect(() => {
    if (!isTransitioning) return;

    const timer = setTimeout(() => {
      if (currentIndex >= products.length) {
        setCurrentIndex(0);
        if (carouselRef.current) {
          carouselRef.current.style.transition = 'none';
          carouselRef.current.style.transform = `translateX(-${itemsPerView * (100 / itemsPerView)}%)`;
          carouselRef.current.offsetHeight;
          carouselRef.current.style.transition = 'transform 600ms ease-out';
        }
      }
      else if (currentIndex < 0) {
        setCurrentIndex(products.length - 1);
        if (carouselRef.current) {
          carouselRef.current.style.transition = 'none';
          carouselRef.current.style.transform = `translateX(-${(products.length + itemsPerView - 1) * (100 / itemsPerView)}%)`;
          carouselRef.current.offsetHeight;
          carouselRef.current.style.transition = 'transform 600ms ease-out';
        }
      }

      setIsTransitioning(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [currentIndex, isTransitioning, products.length, itemsPerView]);

  const getTransform = () => {
    const offset = itemsPerView;
    const translateX = -(currentIndex + offset) * (100 / itemsPerView);
    return `translateX(${translateX}%)`;
  };

  useEffect(() => {
    if (products.length <= itemsPerView) return;

    const autoPlayTimer = setInterval(() => {
      handleNextSlide();
    }, 5000);

    return () => clearInterval(autoPlayTimer);
  }, [products.length, itemsPerView]);

  const getViewAllUrl = () => {
    const slug = category?.slug || categorySlug;
    if (slug) {
      return `/product-category/${slug}`;
    }
    return '/products';
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-0">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
              {Array.from({ length: getItemsPerView() }).map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-lg sm:rounded-xl animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-t-lg sm:rounded-t-xl"></div>
                  <div className="p-3 sm:p-4 space-y-2">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded"></div>
                    <div className="h-5 sm:h-6 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-0">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden">
        {}
        <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Produk Serupa</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Anda mungkin juga menyukai produk ini</p>
            </div>
          </div>
        </div>

        {}
        <div className="p-4 sm:p-6 lg:p-8 relative">
          {}
          {products.length > itemsPerView && (
            <>
              <button
                onClick={handlePrevSlide}
                disabled={isTransitioning}
                className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-gray-300 hover:border-gray-400 hover:bg-white hover:shadow-lg p-2 sm:p-3 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                aria-label="Previous products"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
              </button>

              <button
                onClick={handleNextSlide}
                disabled={isTransitioning}
                className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-gray-300 hover:border-gray-400 hover:bg-white hover:shadow-lg p-2 sm:p-3 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                aria-label="Next products"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
              </button>
            </>
          )}

          <div className="overflow-hidden">
            <div
              ref={carouselRef}
              className="flex transition-transform ease-out"
              style={{ 
                transform: getTransform(),
                transitionDuration: isTransitioning ? '600ms' : '0ms'
              }}
            >
              {extendedProducts.map((product, index) => (
                <div
                  key={`${product.id}-${index}`}
                  className="flex-shrink-0 px-1 sm:px-2"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <div
                    className={`group bg-white border rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-300 overflow-hidden h-full relative ${
                      hoveredProduct === product.id 
                        ? 'border-[#15803d] border-2 shadow-lg' 
                        : 'border-gray-200 border'
                    }`}
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    {}
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <Link href={`/products/${product.slug}`}>
                        <Image
                          src={product.primary_image_url}
                          alt={product.title}
                          fill
                          className="object-cover transition-transform duration-300"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        />
                      </Link>

                      {}
                      {product.has_discount && (
                        <div className="absolute top-1 sm:top-2 left-1 sm:left-2">
                          <span className="bg-red-500 text-white text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                            PROMO
                          </span>
                        </div>
                      )}

                      {}
                      <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-200 ${
                        hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                      }`}>
                        <Link
                          href={`/products/${product.slug}`}
                          className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors duration-200"
                          title="View Product"
                        >
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                        </Link>
                      </div>

                      {}
                      {product.stock_status === 'out_of_stock' && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-white text-gray-900 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>

                    {}
                    <div className="p-3 sm:p-4">
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="font-semibold text-gray-900 text-xs sm:text-sm leading-tight mb-2 hover:text-[#15803d] transition-colors duration-200 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
                          {product.title}
                        </h3>
                      </Link>

                      <div className="space-y-1">
                        {product.has_discount && product.price_discount ? (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1 sm:space-x-2">
                              <span className="text-sm sm:text-lg font-bold text-red-600">
                                {formatCurrency(product.price_discount)}
                              </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0">
                              <span className="text-xs sm:text-sm text-gray-500 line-through">
                                {formatCurrency(product.price_regular)}
                              </span>
                              <span className="text-xs text-green-600 font-medium">
                                Hemat {formatCurrency(product.price_regular - product.price_discount)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm sm:text-lg font-bold text-gray-900">
                            {formatCurrency(product.price_regular)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {}
          {products.length > itemsPerView && (
            <div className="flex justify-center space-x-2 mt-4 sm:mt-6">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (!isTransitioning) {
                      setIsTransitioning(true);
                      setCurrentIndex(index);
                    }
                  }}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    currentIndex === index ? 'bg-[#15803d]' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {}
          <div className="text-center mt-6 sm:mt-8">
            <Link
              href={getViewAllUrl()}
              className="inline-flex items-center text-[#15803d] hover:text-[#166534] font-medium text-sm transition-colors duration-200"
            >
              Lihat Produk Lainnya
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}