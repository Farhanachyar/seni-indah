'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';
import RelatedProducts from './RelatedProducts';
import ProductBreadcrumb from './ProductBreadcrumb';
import { ChevronLeft, Share2, RefreshCw } from 'lucide-react';
import { productService } from '../lib/productService';

interface ProductDetailClientProps {
  initialData: any; 
  slug: string;
}

export default function ProductDetailClient({ 
  initialData, 
  slug 
}: ProductDetailClientProps) {
  const [product, setProduct] = useState(initialData.product);
  const [relatedProducts, setRelatedProducts] = useState(initialData.related_products);
  const [whatsappNumber, setWhatsappNumber] = useState(
    initialData.whatsapp_number || '6281234567890'
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(async () => {
      await refreshData(false); 
    }, 30000);

    return () => clearInterval(interval);
  }, [slug]);

  const refreshData = async (showLoader = true) => {
    if (showLoader) setIsRefreshing(true);

    try {
      console.log('🔄 Refreshing product data...');
      const response = await productService.getProductDetail(slug);

      if (response.success) {
        setProduct(response.data.product);
        setRelatedProducts(response.data.related_products);
        setWhatsappNumber(response.data.whatsapp_number || '6281234567890');
        setLastUpdated(new Date());
        console.log('✅ Product data refreshed successfully');
      } else {
        console.error('❌ Failed to refresh product data:', response.error);
      }
    } catch (error) {
      console.error('❌ Error refreshing product data:', error);
    } finally {
      if (showLoader) setIsRefreshing(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description?.substring(0, 100) + '...',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {

      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                aria-label="Go back"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              <ProductBreadcrumb product={product} />
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {}
            <div className="p-6 lg:p-8 bg-gray-50/50">
              <ProductImageGallery
                primaryImage={product.primary_image_url}
                images={product.images || []}
                productTitle={product.title}
              />
            </div>

            {}
            <div className="p-6 lg:p-8">
              <ProductInfo 
                product={product} 
                whatsappNumber={whatsappNumber} 
              />
            </div>
          </div>
        </div>

        {}
        <div className="mt-12">
          <RelatedProducts 
            products={relatedProducts && relatedProducts.length > 0 ? relatedProducts : undefined}
            category={product.category} 
            categorySlug={product.category?.slug} 
          />
        </div>
      </div>

      {}
      {isRefreshing && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl border border-blue-200 p-4 z-50">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">Updating product data...</p>
              <p className="text-xs text-gray-500">Getting the latest information</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}