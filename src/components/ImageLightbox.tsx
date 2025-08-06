'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface ImageItem {
  url: string;
  alt?: string;
  caption?: string;
}

interface ImageLightboxProps {
  images: ImageItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onImageChange?: (index: number) => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onImageChange
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const supportsFullscreen = typeof document !== 'undefined' && (
    document.fullscreenEnabled || 
    (document as any).webkitFullscreenEnabled || 
    (document as any).mozFullScreenEnabled ||
    (document as any).msFullscreenEnabled
  );

  const toggleFullscreen = useCallback(async () => {
    if (!supportsFullscreen) return;

    try {
      if (!isFullscreen) {

        const lightboxContainer = document.querySelector('[data-lightbox-container]') as HTMLElement;
        if (lightboxContainer) {
          if (lightboxContainer.requestFullscreen) {
            await lightboxContainer.requestFullscreen();
          } else if ((lightboxContainer as any).webkitRequestFullscreen) {
            await (lightboxContainer as any).webkitRequestFullscreen();
          } else if ((lightboxContainer as any).mozRequestFullScreen) {
            await (lightboxContainer as any).mozRequestFullScreen();
          } else if ((lightboxContainer as any).msRequestFullscreen) {
            await (lightboxContainer as any).msRequestFullscreen();
          }
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (error) {
      console.error('Fullscreen toggle failed:', error);
    }
  }, [isFullscreen, supportsFullscreen]);

  const exitFullscreenIfActive = useCallback(async () => {
    if (isFullscreen) {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      } catch (error) {
        console.error('Exit fullscreen failed:', error);
      }
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      setIsFullscreen(isCurrentlyFullscreen);
      console.log('Lightbox fullscreen status:', isCurrentlyFullscreen);
    };

    if (supportsFullscreen) {
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.addEventListener('mozfullscreenchange', handleFullscreenChange);
      document.addEventListener('msfullscreenchange', handleFullscreenChange);

      return () => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
        document.removeEventListener('msfullscreenchange', handleFullscreenChange);
      };
    }
  }, [supportsFullscreen]);

  const goToPrevious = useCallback(() => {
    if (images.length <= 1 || isAnimating) return;

    setIsAnimating(true);
    setSlideDirection('prev');
    setImageLoaded(false);

    setTimeout(() => {
      const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
      onImageChange?.(newIndex);

      setTimeout(() => {
        setIsAnimating(false);
        setSlideDirection(null);
      }, 300);
    }, 150);
  }, [currentIndex, images.length, onImageChange, isAnimating]);

  const goToNext = useCallback(() => {
    if (images.length <= 1 || isAnimating) return;

    setIsAnimating(true);
    setSlideDirection('next');
    setImageLoaded(false);

    setTimeout(() => {
      const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
      onImageChange?.(newIndex);

      setTimeout(() => {
        setIsAnimating(false);
        setSlideDirection(null);
      }, 300);
    }, 150);
  }, [currentIndex, images.length, onImageChange, isAnimating]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':

          if (isFullscreen) {
            exitFullscreenIfActive().then(() => {
              onClose();
            });
          } else {
            onClose();
          }
          break;
        case 'ArrowLeft':
          event.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNext();
          break;
        case 'f':
        case 'F':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            toggleFullscreen();
          }
          break;
        case ' ': 
          event.preventDefault();
          goToNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToPrevious, goToNext, onClose, toggleFullscreen, isFullscreen, exitFullscreenIfActive]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setImageLoaded(false);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !images.length) return null;

  const currentImage = images[currentIndex];
  const showNavigation = images.length > 1;

  return (
    <div 
      data-lightbox-container
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isFullscreen 
          ? 'bg-black' 
          : 'bg-black bg-opacity-95'
      }`}
      onClick={(e) => {

        if (isFullscreen) {
          exitFullscreenIfActive();
        } else {

          onClose();
        }
      }}
    >
      {}
      {showNavigation && (
        <>
          {}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            disabled={isAnimating}
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-80 hover:bg-opacity-95 text-white p-4 rounded-full transition-all duration-200 backdrop-blur-sm z-[70] border border-gray-600 ${
              isFullscreen ? 'opacity-70 hover:opacity-100' : 'opacity-100'
            } ${isAnimating ? 'cursor-not-allowed opacity-30' : ''}`}
            title="Previous Image (←)"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            disabled={isAnimating}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-80 hover:bg-opacity-95 text-white p-4 rounded-full transition-all duration-200 backdrop-blur-sm z-[70] border border-gray-600 ${
              isFullscreen ? 'opacity-70 hover:opacity-100' : 'opacity-100'
            } ${isAnimating ? 'cursor-not-allowed opacity-30' : ''}`}
            title="Next Image (→)"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {}
      <div 
        className="relative flex items-center justify-center transition-all duration-300 w-full h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {}
        {isFullscreen && showNavigation && (
          <>
            <div 
              className="absolute left-0 top-0 w-1/3 h-full z-50 cursor-pointer flex items-center justify-start pl-4"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              title="Previous Image"
            >
              <div className="opacity-0 hover:opacity-70 bg-black bg-opacity-50 text-white p-2 rounded-full transition-opacity duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </div>

            <div 
              className="absolute right-0 top-0 w-1/3 h-full z-50 cursor-pointer flex items-center justify-end pr-4"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              title="Next Image"
            >
              <div className="opacity-0 hover:opacity-70 bg-black bg-opacity-50 text-white p-2 rounded-full transition-opacity duration-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </>
        )}

        {}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {}
        <div className="relative">
          <Image
            src={currentImage.url}
            alt={currentImage.alt || `Image ${currentIndex + 1}`}
            width={1200}
            height={800}
            className={`object-contain transition-all duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              maxWidth: isFullscreen ? '98vw' : '90vw',
              maxHeight: isFullscreen ? '95vh' : '80vh',
              width: 'auto',
              height: 'auto',
              minWidth: isFullscreen ? '85vw' : '70vw',
              minHeight: isFullscreen ? '75vh' : '60vh'
            }}
            sizes={isFullscreen ? '98vw' : '90vw'}
            priority
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />
        </div>
      </div>

      {}
      <div className={`absolute bottom-3 left-3 right-3 flex justify-between items-end z-[70] transition-all duration-300 ${
        isFullscreen ? 'opacity-70 hover:opacity-100' : 'opacity-100'
      }`}>
        {}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFullscreen();
          }}
          className="bg-black bg-opacity-80 hover:bg-opacity-95 text-white p-3 rounded-lg transition-all duration-200 backdrop-blur-sm border border-gray-600"
          title={isFullscreen ? 'Exit Fullscreen (Ctrl+F)' : 'Enter Fullscreen (Ctrl+F)'}
        >
          {isFullscreen ? (

            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5m5.5 11v4.5M9 20h4.5M9 20l5.5 5.5M20 9h-4.5M20 9V4.5M20 9l5.5-5.5M15 20h4.5M20 20v-4.5M20 20l-5.5 5.5" />
            </svg>
          ) : (

            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          )}
        </button>

        {}
        <div className="bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg backdrop-blur-sm border border-gray-600">
          <div className="text-center">
            {currentImage.caption && (
              <div className="text-sm mb-1">{currentImage.caption}</div>
            )}
            {showNavigation && (
              <div className="text-xs text-gray-300">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>

        {}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isFullscreen) {
              exitFullscreenIfActive().then(() => {
                onClose();
              });
            } else {
              onClose();
            }
          }}
          className="bg-black bg-opacity-80 hover:bg-opacity-95 text-white p-3 rounded-lg transition-all duration-200 backdrop-blur-sm border border-gray-600"
          title={isFullscreen ? "Exit Fullscreen & Close (ESC)" : "Close (ESC)"}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {}
      <div className="sr-only">
        <p>Keyboard shortcuts:</p>
        <ul>
          <li>ESC: Close (or exit fullscreen first)</li>
          <li>Left Arrow: Previous image</li>
          <li>Right Arrow: Next image</li>
          <li>Spacebar: Next image</li>
          <li>Ctrl+F: Toggle fullscreen</li>
        </ul>
      </div>

      {}
      <style jsx>{`

      `}</style>
    </div>
  );
};

export default ImageLightbox;