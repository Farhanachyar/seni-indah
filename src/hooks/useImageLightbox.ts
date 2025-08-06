import { useState, useCallback } from 'react';

interface ImageItem {
  url: string;
  alt?: string;
  caption?: string;
}

interface UseImageLightboxReturn {
  isOpen: boolean;
  currentIndex: number;
  images: ImageItem[];
  openLightbox: (images: ImageItem[], initialIndex?: number) => void;
  closeLightbox: () => void;
  setCurrentIndex: (index: number) => void;
  goToNext: () => void;
  goToPrevious: () => void;
}

export const useImageLightbox = (): UseImageLightboxReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<ImageItem[]>([]);

  const openLightbox = useCallback((imageList: ImageItem[], initialIndex: number = 0) => {
    setImages(imageList);
    setCurrentIndex(initialIndex);
    setIsOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsOpen(false);

    setTimeout(() => {
      setImages([]);
      setCurrentIndex(0);
    }, 300);
  }, []);

  const goToNext = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  }, [images.length]);

  return {
    isOpen,
    currentIndex,
    images,
    openLightbox,
    closeLightbox,
    setCurrentIndex,
    goToNext,
    goToPrevious,
  };
};