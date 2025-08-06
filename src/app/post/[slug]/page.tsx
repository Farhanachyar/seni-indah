'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { apiService, GalleryDetail, formatCategoryName, formatGalleryTitle } from '../../../lib/apiService';
import ImageLightbox from '../../../components/ImageLightbox';
import { useImageLightbox } from '../../../hooks/useImageLightbox';

const PostDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [gallery, setGallery] = useState<GalleryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lightbox = useImageLightbox();

  useEffect(() => {
    if (!slug) return;

    const loadGallery = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await apiService.getGalleryDetail(slug);
        setGallery(data);

      } catch (err) {
        console.error('Error loading gallery:', err);
        setError('Postingan tidak ditemukan');
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, [slug]);

  const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME || "";

  useEffect(() => {
    if (gallery?.post_title) {
      document.title = `${gallery?.post_title} | ${projectName}`;
    } 
  }, [gallery?.post_title]);

  const buildImageUrl = (imagePath: string): string => {
    if (!imagePath) return '';

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    const baseUrl = apiService.getBaseUrl();
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

    return `${baseUrl}${cleanPath}`;
  };

  const openImageLightbox = (imageIndex: number) => {
    if (!gallery) return;

    const lightboxImages = gallery.media.images.map((image, index) => ({
      url: buildImageUrl(image.url),
      alt: `${gallery.post_title} - Image ${image.index}`,
      caption: `${formatGalleryTitle(gallery.location, gallery.post_title)} - Gambar ${index + 1} dari ${gallery.media.images.length}`
    }));

    lightbox.openLightbox(lightboxImages, imageIndex);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="animate-pulse">
            {}
            <div className="mb-8">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !gallery) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Postingan Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-6">{error || 'Postingan yang Anda cari tidak dapat ditemukan.'}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => router.back()}
              className="w-full sm:w-auto bg-gray-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-700 transition-colors text-center flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali
            </button>
            <Link
              href="/portofolio"
              className="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors text-center flex items-center justify-center gap-2"
            >
              Lihat Portfolio
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const renderGallery = () => {
    const images = gallery.media.images;

    if (images.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">📷</div>
          <p className="text-gray-600">Tidak ada gambar untuk ditampilkan</p>
        </div>
      );
    }

    if (gallery.style_view === '3-Grid') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {images.map((image, index) => {
            const imageUrl = buildImageUrl(image.url);
            return (
              <div
                key={`image-${image.index}-${index}`}
                className="group cursor-pointer relative aspect-square overflow-hidden rounded-lg bg-gray-100 hover:shadow-xl transition-all duration-300"
                onClick={() => openImageLightbox(index)}
              >
                <Image
                  src={imageUrl}
                  alt={`${gallery.post_title} - Image ${image.index}`}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    if (gallery.style_view === '1-Grid') {
      return (
        <div className="space-y-4 lg:space-y-6 max-w-3xl mx-auto">
          {images.map((image, index) => {
            const imageUrl = buildImageUrl(image.url);
            return (
              <div
                key={`image-${image.index}-${index}`}
                className="group cursor-pointer relative overflow-hidden rounded-lg bg-gray-100 hover:shadow-xl transition-all duration-300"
                onClick={() => openImageLightbox(index)}
              >
                <div className="relative w-full aspect-[16/9]">
                  <Image
                    src={imageUrl}
                    alt={`${gallery.post_title} - Image ${image.index}`}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />

                  {}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {images.map((image, index) => {
          const imageUrl = buildImageUrl(image.url);
          return (
            <div
              key={`image-${image.index}-${index}`}
              className="group cursor-pointer relative aspect-square overflow-hidden rounded-lg bg-gray-100 hover:shadow-xl transition-all duration-300"
              onClick={() => openImageLightbox(index)}
            >
              <Image
                src={imageUrl}
                alt={`${gallery.post_title} - Image ${image.index}`}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {}
        <div className="mb-8">
          {}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>→</span>
            <Link href="/portofolio" className="hover:text-primary transition-colors">Portfolio</Link>
            <span>→</span>
            <span className="text-gray-900 font-medium">
              {formatGalleryTitle(gallery.location, gallery.post_title)}
            </span>
          </nav>

          {}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-4 leading-tight">
            {formatGalleryTitle(gallery.location, gallery.post_title)}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="inline-block bg-primary-100 text-primary-800 px-4 py-2 rounded-full font-medium">
              {formatCategoryName(gallery.category)}
            </span>
            <span className="text-gray-600">
              {gallery.tanggal_unggahan}
            </span>
          </div>

          {}
          {gallery.deskripsi && gallery.meta.has_description && (
            <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-gray-100">
              <div 
                className="text-gray-700 leading-relaxed max-w-none [&>p]:mb-4 [&>p:last-child]:mb-0 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-3 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mb-3 [&>h4]:text-base [&>h4]:font-semibold [&>h4]:mb-2 [&>h5]:text-sm [&>h5]:font-semibold [&>h5]:mb-2 [&>h6]:text-sm [&>h6]:font-medium [&>h6]:mb-2 [&>ul]:mb-4 [&>ol]:mb-4 [&>ul>li]:mb-1 [&>ol>li]:mb-1 [&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:mb-4 [&>pre]:bg-gray-100 [&>pre]:p-4 [&>pre]:rounded [&>pre]:mb-4 [&>pre]:overflow-x-auto [&>code]:bg-gray-100 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm [&>table]:mb-4 [&>table]:border-collapse [&>table]:w-full [&>table_th]:border [&>table_th]:border-gray-300 [&>table_th]:p-2 [&>table_th]:bg-gray-50 [&>table_td]:border [&>table_td]:border-gray-300 [&>table_td]:p-2 [&>img]:mb-4 [&>img]:max-w-full [&>img]:h-auto [&>img]:rounded [&>br]:block [&>br]:my-2"
                dangerouslySetInnerHTML={{ __html: gallery.deskripsi }}
              />
            </div>
          )}
        </div>

        {}
        <div className="mb-12">
          {renderGallery()}
        </div>

        {}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto bg-gray-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-700 transition-colors text-center flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </button>
          <Link
            href="/portofolio"
            className="w-full sm:w-auto bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors text-center flex items-center justify-center gap-2"
          >
            Lihat Portfolio Lainnya
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>

      {}
      <ImageLightbox
        images={lightbox.images}
        currentIndex={lightbox.currentIndex}
        isOpen={lightbox.isOpen}
        onClose={lightbox.closeLightbox}
        onImageChange={lightbox.setCurrentIndex}
      />
    </div>
  );
};

export default PostDetailPage;