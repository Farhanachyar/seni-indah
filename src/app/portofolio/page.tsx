'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { apiService, Gallery, formatCategoryName, formatGalleryTitle, generateGalleryShareUrl } from '../../lib/apiService';

const PortofolioPage = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [shareMenuOpen, setShareMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME || "";

  useEffect(() => {
      document.title = `Portofolio | ${projectName}`;
    }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      const [galleriesData, categoriesData] = await Promise.all([
        apiService.getGalleryList(1),
        apiService.getGalleryCategories()
      ]);

      setGalleries(galleriesData.galleries);
      setCategories(['all', ...categoriesData]);
      setHasNextPage(galleriesData.pagination.has_next);
      setCurrentPage(1);

    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreGalleries = useCallback(async () => {
    if (!hasNextPage || loadingMore) return;

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const data = await apiService.getGalleryList(nextPage);

      if (data.galleries.length > 0) {
        setGalleries(prev => [...prev, ...data.galleries]);
        setCurrentPage(nextPage);
        setHasNextPage(data.pagination.has_next);
      } else {
        setHasNextPage(false);
      }

    } catch (error) {
      console.error('Error loading more galleries:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [currentPage, hasNextPage, loadingMore]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop 
        >= document.documentElement.offsetHeight - 1000
      ) {
        loadMoreGalleries();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreGalleries]);

  const filteredGalleries = selectedCategory === 'all' 
    ? galleries 
    : galleries.filter(g => g.category === selectedCategory);

  const handleShare = async (slug: string) => {
    const url = generateGalleryShareUrl(slug);
    const galleryItem = galleries.find(g => g.slug === slug);
    const title = galleryItem 
      ? `${formatGalleryTitle(galleryItem.location, galleryItem.post_title)} - Seni Indah Gypsum`
      : 'Gallery Seni Indah Gypsum';

    setShareMenuOpen(null);

    if (navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title: title,
          text: 'Lihat portfolio terbaru dari Seni Indah Gypsum',
          url: url,
        });
        return;
      } catch (error) {
        console.log('Native share failed:', error);

      }
    }

    try {
      await copyToClipboard(url);
    } catch (error) {
      console.error('Share failed:', error);
      alert('Gagal membagikan link');
    }
  };

  const copyToClipboard = async (text: string): Promise<void> => {

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);

        const tempDiv = document.createElement('div');
        tempDiv.textContent = '✅ Link berhasil disalin!';
        tempDiv.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10B981;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 9999;
          font-weight: 600;
        `;
        document.body.appendChild(tempDiv);
        setTimeout(() => {
          document.body.removeChild(tempDiv);
        }, 3000);
        return;
      } catch (error) {
        console.log('Modern clipboard failed:', error);
      }
    }

    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.cssText = 'position:fixed;left:-9999px;top:-9999px;';
    document.body.appendChild(textArea);

    try {
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');

      if (success) {

        const tempDiv = document.createElement('div');
        tempDiv.textContent = '✅ Link berhasil disalin!';
        tempDiv.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10B981;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 9999;
          font-weight: 600;
        `;
        document.body.appendChild(tempDiv);
        setTimeout(() => {
          document.body.removeChild(tempDiv);
        }, 3000);
      } else {
        throw new Error('Copy command failed');
      }
    } catch (error) {
      console.error('Fallback copy failed:', error);

      prompt('Salin link berikut:', text);
    } finally {
      document.body.removeChild(textArea);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="flex gap-4 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-10 bg-gray-200 rounded-full w-32"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg">
                  <div className="flex">
                    <div className="w-32 sm:w-40 md:w-56 lg:w-72 aspect-square bg-gray-200 flex-shrink-0"></div>
                    <div className="flex-1 p-3 sm:p-4 md:p-6">
                      <div className="h-4 sm:h-5 md:h-6 bg-gray-200 rounded mb-2 md:mb-3 w-3/4"></div>
                      <div className="h-3 sm:h-4 bg-gray-200 rounded mb-1 md:mb-2 w-1/2"></div>
                      <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            Portfolio <span className="text-primary">Kami</span>
          </h1>
          <p className="text-xl text-gray-600">
            Koleksi proyek terbaik dari Seni Indah Gypsum
          </p>
        </div>

        {}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category === 'all' ? 'Semua' : formatCategoryName(category)}
              </button>
            ))}
          </div>
        </div>

        {}
        <div className="space-y-6 mb-8">
          {filteredGalleries.map((gallery) => (
            <div key={gallery.slug} className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 relative">
              {}
              <div className="absolute top-3 right-3 z-20">
                <div className="relative">
                  <button
                    onClick={() => setShareMenuOpen(shareMenuOpen === gallery.slug ? null : gallery.slug)}
                    className="w-8 h-8 sm:w-9 sm:h-9 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 backdrop-blur-sm"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>

                  {}
                  {shareMenuOpen === gallery.slug && (
                    <div className="absolute top-10 right-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 w-44 z-30">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(gallery.slug);
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-3 text-sm"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                        </svg>
                        Bagikan Postingan
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex">
                {}
                <div className="w-32 sm:w-40 md:w-56 lg:w-72 flex-shrink-0 relative">
                  <Link href={`/post/${gallery.slug}`} className="block relative aspect-square overflow-hidden">
                    {gallery.thumbnail && gallery.meta.has_thumbnail ? (
                      <Image
                        src={gallery.thumbnail}
                        alt={formatGalleryTitle(gallery.location, gallery.post_title)}
                        fill
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 224px, 288px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-gray-500 text-2xl sm:text-3xl lg:text-4xl">🖼️</span>
                      </div>
                    )}

                    {}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
                  </Link>
                </div>

                {}
                <div className="flex-1 p-3 sm:p-4 md:p-6 flex flex-col justify-between relative min-h-32 sm:min-h-40 md:min-h-56 lg:min-h-72">
                  <div className="flex-1 pr-10"> {}
                    <Link href={`/post/${gallery.slug}`}>
                      <h3 className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 md:mb-3 group-hover:text-primary transition-colors leading-tight line-clamp-2 md:line-clamp-3">
                        {formatGalleryTitle(gallery.location, gallery.post_title)}
                      </h3>
                    </Link>

                    <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-1 sm:gap-2 md:gap-4 mb-2 md:mb-4">
                      <span className="inline-block bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs md:text-sm font-medium w-fit">
                        {formatCategoryName(gallery.category)}
                      </span>
                      <span className="text-gray-500 text-xs md:text-sm">
                        📅 {gallery.tanggal_unggahan}
                      </span>
                    </div>

                    {gallery.location && (
                      <div className="flex items-center gap-1 md:gap-2 mb-2 md:mb-4">
                        <span className="text-gray-500 text-xs md:text-sm">📍</span>
                        <span className="text-gray-600 font-medium text-xs md:text-sm">{gallery.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-start">
                    <Link
                      href={`/post/${gallery.slug}`}
                      className="inline-flex items-center gap-1 md:gap-2 bg-primary text-white px-3 md:px-6 py-1.5 md:py-2 rounded-full font-semibold hover:bg-primary-700 transition-colors text-xs md:text-sm"
                    >
                      <span className="hidden sm:inline">Lihat Detail</span>
                      <span className="sm:hidden">Detail</span>
                      <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {}
        {loadingMore && (
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-3 text-gray-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span>Memuat lebih banyak...</span>
            </div>
          </div>
        )}

        {}
        {!hasNextPage && galleries.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">
              Anda telah melihat semua {filteredGalleries.length} portfolio kami
            </p>
          </div>
        )}

        {}
        {filteredGalleries.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🖼️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {selectedCategory === 'all' ? 'Belum Ada Portfolio' : 'Tidak Ada Portfolio'}
            </h3>
            <p className="text-gray-600 mb-6">
              {selectedCategory === 'all' 
                ? 'Portfolio akan segera ditambahkan.' 
                : `Tidak ada portfolio untuk kategori "${formatCategoryName(selectedCategory)}".`
              }
            </p>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors"
              >
                Lihat Semua Portfolio
              </button>
            )}
          </div>
        )}
      </div>

      {}
      {shareMenuOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShareMenuOpen(null)}
        ></div>
      )}
    </div>
  );
};

export default PortofolioPage;