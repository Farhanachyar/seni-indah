'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';

interface ProductImageGalleryProps {
  primaryImage: string;
  images: string[];
  productTitle: string;
}

export default function ProductImageGallery({
  primaryImage,
  images,
  productTitle
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const allImages = [primaryImage, ...images].filter((img, index, arr) => {
    return img && arr.indexOf(img) === index;
  });

  const infiniteImages = allImages.length > 1 ? [
    allImages[allImages.length - 1], 
    ...allImages,
    allImages[0] 
  ] : allImages;

  const [displayIndex, setDisplayIndex] = useState(allImages.length > 1 ? 1 : 0);

  const handleThumbnailClick = (index: number) => {
    if (isTransitioning || allImages.length <= 1 || index === activeIndex) return;

    setIsTransitioning(true);
    const newDisplayIndex = index + 1; 
    setDisplayIndex(newDisplayIndex);
    setActiveIndex(index);
    updateThumbnailPosition(index);

    setTimeout(() => setIsTransitioning(false), 800);
  };

  const handlePrevious = () => {
    if (isTransitioning || allImages.length <= 1) return;

    setIsTransitioning(true);

    if (displayIndex === 1) {

      setDisplayIndex(0);
      setThumbnailDisplayIndex(prev => prev - 1);
      setTimeout(() => {
        setIsTransitioning(false);
        setDisplayIndex(allImages.length);
        setActiveIndex(allImages.length - 1);
        updateThumbnailPosition(allImages.length - 1, true);
      }, 800);
    } else {
      setDisplayIndex(prev => prev - 1);
      setActiveIndex(prev => prev - 1);
      setThumbnailDisplayIndex(prev => prev - 1);
      setTimeout(() => setIsTransitioning(false), 800);
    }
  };

  const handleNext = () => {
    if (isTransitioning || allImages.length <= 1) return;

    setIsTransitioning(true);

    if (displayIndex === allImages.length) {

      setDisplayIndex(allImages.length + 1);
      setThumbnailDisplayIndex(prev => prev + 1);
      setTimeout(() => {
        setIsTransitioning(false);
        setDisplayIndex(1);
        setActiveIndex(0);
        updateThumbnailPosition(0, true);
      }, 800);
    } else {
      setDisplayIndex(prev => prev + 1);
      setActiveIndex(prev => prev + 1);
      setThumbnailDisplayIndex(prev => prev + 1);
      setTimeout(() => setIsTransitioning(false), 800);
    }
  };

  const handleZoomIn = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const createInfiniteThumbnails = () => {
    if (allImages.length <= 1) return allImages;
    if (allImages.length <= 3) {

      return [...allImages, ...allImages, ...allImages, ...allImages, ...allImages];
    }

    return [
      ...allImages.slice(-2), 
      ...allImages,
      ...allImages.slice(0, 2) 
    ];
  };

  const infiniteThumbnails = createInfiniteThumbnails();

  const getThumbnailDisplayIndex = () => {
    if (allImages.length <= 1) return 0;
    if (allImages.length <= 3) {

      return allImages.length * 2 + activeIndex;
    }

    return activeIndex + 2;
  };

  const [thumbnailDisplayIndex, setThumbnailDisplayIndex] = useState(getThumbnailDisplayIndex());

  const updateThumbnailPosition = (newActiveIndex: number, immediate = false) => {
    if (allImages.length <= 1) return;

    if (allImages.length <= 3) {
      const newDisplayIndex = allImages.length * 2 + newActiveIndex;
      setThumbnailDisplayIndex(newDisplayIndex);
    } else {
      const newDisplayIndex = newActiveIndex + 2;
      setThumbnailDisplayIndex(newDisplayIndex);
    }
  };

  if (!allImages.length) {
    return (
      <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  return (
    <>
      {}
      <style jsx global>{`
        .main-slider-container {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          overflow: hidden;
          border-radius: 8px;
          background: white;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        }

        .main-slider-track {
          display: flex;
          width: ${infiniteImages.length * 100}%;
          height: 100%;
          transform: translateX(-${displayIndex * (100 / infiniteImages.length)}%);
          transition: ${isTransitioning ? 'transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none'};
          will-change: transform;
        }

        .main-slide {
          width: ${100 / infiniteImages.length}%;
          height: 100%;
          flex-shrink: 0;
          position: relative;
        }

        .thumbnail-container {
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          padding: 16px 0;
          position: relative;
          width: 100%;
          min-height: 120px;
        }

        .thumbnail-track {
          display: flex;
          align-items: center;
          gap: 8px;
          transition: ${isTransitioning ? 'transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none'};
          will-change: transform;
          position: relative;
        }

        .thumbnail-infinite-track {
          display: flex;
          width: ${infiniteThumbnails.length * 88}px;
          transform: translateX(-${thumbnailDisplayIndex * 88}px);
          transition: ${isTransitioning ? 'transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none'};
          will-change: transform;
          align-items: center;
          gap: 8px;
          padding: 0 400px; 
        }

        .thumbnail-item {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid;
          flex-shrink: 0;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
          will-change: transform, border-color;
          transform-origin: center;
          width: 80px;
          height: 80px;
        }

        .thumbnail-item:disabled {
          pointer-events: none;
        }

        .thumbnail-item.active {
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2);
          transform: scale(1.1);
          z-index: 10;
        }

        .thumbnail-item.inactive {
          border-color: #d1d5db;
          opacity: 0.7;
        }

        .thumbnail-item.inactive:hover:not(:disabled) {
          border-color: #9ca3af;
          transform: scale(1.05);
          opacity: 1;
        }

        .nav-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          padding: 8px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(4px);
          border-radius: 50%;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          transition: all 0.2s ease;
          z-index: 20;
          border: none;
          cursor: pointer;
        }

        .nav-button:hover:not(:disabled) {
          background: white;
          transform: translateY(-50%) scale(1.05);
        }

        .nav-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .nav-button.left {
          left: 16px;
        }

        .nav-button.right {
          right: 16px;
        }

        .zoom-button {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 8px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(4px);
          border-radius: 50%;
          opacity: 0;
          transition: all 0.2s ease;
          z-index: 20;
          border: none;
          cursor: pointer;
        }

        .main-slider-container:hover .zoom-button {
          opacity: 1;
        }

        .zoom-button:hover {
          background: white;
        }

        .counter-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          padding: 4px 12px;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          color: white;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 9999px;
          z-index: 20;
        }

        .thumbnail-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.3);
          transition: opacity 0.3s ease;
        }

        .thumbnail-item.active .thumbnail-overlay {
          opacity: 0;
        }

        .thumbnail-item.inactive .thumbnail-overlay {
          opacity: 1;
        }
      `}</style>

      <div className="space-y-4">
        {}
        <div className="main-slider-container group">
          <div className="main-slider-track">
            {infiniteImages.map((imageUrl, index) => (
              <div key={`slide-${index}`} className="main-slide">
                <Image
                  src={imageUrl}
                  alt={`${productTitle} slide ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === displayIndex}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>

          {}
          <button
            onClick={handleZoomIn}
            className="zoom-button"
            aria-label="Zoom image"
          >
            <ZoomIn className="w-4 h-4 text-gray-700" />
          </button>

          {}
          {allImages.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                disabled={isTransitioning}
                className="nav-button left"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>

              <button
                onClick={handleNext}
                disabled={isTransitioning}
                className="nav-button right"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </>
          )}

          {}
          <div className="counter-badge">
            {activeIndex + 1}/{allImages.length}
          </div>
        </div>

        {}
        {allImages.length > 1 && (
        <div className="thumbnail-container">
          <div className="thumbnail-infinite-track">
            {infiniteThumbnails.map((imageUrl, trackIndex) => {

              let originalIndex;
              if (allImages.length <= 3) {
                originalIndex = trackIndex % allImages.length;
              } else {
                if (trackIndex < 2) {

                  originalIndex = allImages.length - 2 + trackIndex;
                } else if (trackIndex >= infiniteThumbnails.length - 2) {

                  originalIndex = trackIndex - (infiniteThumbnails.length - 2);
                } else {

                  originalIndex = trackIndex - 2;
                }
              }

              const isActive = originalIndex === activeIndex;

              return (
                <button
                  key={`thumb-${trackIndex}-${originalIndex}`}
                  onClick={() => handleThumbnailClick(originalIndex)}
                  disabled={isTransitioning}
                  className={`thumbnail-item ${isActive ? 'active' : 'inactive'}`}
                >
                  <Image
                    src={imageUrl}
                    alt={`${productTitle} ${originalIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />

                  {}
                  <div className="thumbnail-overlay" />
                </button>
              );
            })}
          </div>
        </div>
        )}

        {}
        {allImages.length === 1 && (
          <div className="flex justify-center">
            <button
              className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-orange-500 ring-2 ring-orange-200 transition-transform duration-300 hover:scale-105"
              onClick={() => handleThumbnailClick(0)}
            >
              <Image
                src={allImages[0]}
                alt={`${productTitle} 1`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          </div>
        )}

        {}
        {allImages.length > 5 && (
          <div className="flex justify-center space-x-1">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                disabled={isTransitioning}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'bg-orange-500 w-6 shadow-lg' 
                    : 'bg-gray-300 hover:bg-gray-400 w-2'
                } ${isTransitioning ? 'pointer-events-none' : ''}`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-7xl max-h-full">
              <button
                onClick={handleCloseModal}
                className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors duration-200"
                aria-label="Close zoom"
              >
                <X className="w-6 h-6" />
              </button>

              <Image
                src={allImages[activeIndex]}
                alt={productTitle}
                width={1200}
                height={1200}
                className="max-w-full max-h-full object-contain"
                priority
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}