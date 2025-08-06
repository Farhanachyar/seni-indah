'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import ProductDetailClient from '../../../components/ProductDetailClient';
import StoreInfoBox from '../../../components/StoreInfoBox';
import { productService } from '../../../lib/productService';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!slug) {
        setError('Product slug is required');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Fetching fresh product data for slug:', slug);
        const response = await productService.getProductDetail(slug);

        if (!response.success) {
          setError(response.error || 'Product not found');
          setLoading(false);
          return;
        }

        setProductData(response.data);

        if (response.data.product.title) {
          document.title = `${response.data.product.title} | Seni Indah Gypsum`;
        }

      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product data');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [slug]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex items-center space-x-2">
                <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {}
              <div className="p-6 lg:p-8 bg-gray-50/50">
                <div className="space-y-4">
                  <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="flex space-x-2 justify-center">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>

              {}
              <div className="p-6 lg:p-8">
                <div className="space-y-6">
                  {}
                  <div className="w-24 h-6 bg-blue-100 rounded animate-pulse"></div>

                  {}
                  <div className="space-y-2">
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  </div>

                  {}
                  <div className="space-y-2">
                    <div className="h-10 bg-gray-200 rounded animate-pulse w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
                  </div>

                  {}
                  <div className="w-20 h-8 bg-green-100 rounded-full animate-pulse"></div>

                  {}
                  <div className="flex space-x-4 border-b border-gray-200">
                    <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
                  </div>

                  {}
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
                  </div>

                  {}
                  <div className="h-12 bg-green-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="mt-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="h-20 bg-gradient-to-r from-pink-200 to-purple-200 animate-pulse"></div>
              <div className="p-6">
                <div className="text-center space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
                  <div className="h-12 bg-pink-200 rounded-full animate-pulse w-48 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="mt-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 lg:p-8 border-b border-gray-200">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-48"></div>
              </div>
              <div className="p-6 lg:p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-gray-100 rounded-xl animate-pulse">
                      <div className="aspect-square bg-gray-200 rounded-t-xl"></div>
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
            <span className="text-sm text-gray-600">Loading product...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!productData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {}
        <ProductDetailClient 
          initialData={productData}
          slug={slug}
        />

        {}
        <div className="mt-8">
          <StoreInfoBox />
        </div>
      </div>
    </div>
  );
}