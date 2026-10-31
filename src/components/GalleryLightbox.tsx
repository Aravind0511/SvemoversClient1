import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import type { GalleryItem } from '../types';

interface GalleryLightboxProps {
  items: GalleryItem[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  items,
  currentIndex,
  onClose,
  onPrev,
  onNext
}) => {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const minSwipeDistance = 45;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      onNext();
    } else if (isRightSwipe) {
      onPrev();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  const activeItem = items[currentIndex];
  if (!activeItem) return null;

  return (
    <div className="svem-lightbox-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="svem-lightbox-content"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Close Button */}
        <button
          type="button"
          className="svem-lightbox-close"
          onClick={onClose}
          aria-label="Close image viewer"
        >
          <X size={24} />
        </button>

        {/* Previous Button */}
        <button
          type="button"
          className="svem-lightbox-nav svem-lightbox-nav-prev"
          onClick={onPrev}
          aria-label="Previous image"
        >
          <ChevronLeft size={32} />
        </button>

        {/* Next Button */}
        <button
          type="button"
          className="svem-lightbox-nav svem-lightbox-nav-next"
          onClick={onNext}
          aria-label="Next image"
        >
          <ChevronRight size={32} />
        </button>

        {/* Main Image Frame */}
        <div className="svem-lightbox-image-wrap">
          <img
            src={activeItem.image}
            alt={activeItem.title}
            className="svem-lightbox-img"
          />

          {/* Caption Details */}
          <div className="svem-lightbox-caption">
            <div className="svem-lightbox-caption-top">
              <span className="svem-lightbox-badge">{activeItem.category}</span>
              <span className="svem-lightbox-location">
                <MapPin size={14} />
                <span>{activeItem.location}</span>
              </span>
            </div>
            <h3 className="svem-lightbox-title">{activeItem.title}</h3>
            <p className="svem-lightbox-desc">{activeItem.description}</p>
            <span className="svem-lightbox-counter">
              {currentIndex + 1} of {items.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
