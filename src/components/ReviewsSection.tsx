import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { REVIEWS_LIST } from '../data/reviewsData';

export const ReviewsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + REVIEWS_LIST.length) % REVIEWS_LIST.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % REVIEWS_LIST.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const diff = touchStartX - touchEndX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const currentReview = REVIEWS_LIST[currentIndex];

  return (
    <div className="svem-reviews-block">
      {/* Block Header with navigation arrows matching reference image */}
      <div className="svem-reviews-header">
        <div className="svem-title-with-pill">
          <span className="svem-accent-pill" />
          <h3 className="svem-subheading">Customer Reviews</h3>
        </div>

        <div className="svem-reviews-nav">
          <button
            type="button"
            className="svem-reviews-arrow-btn"
            onClick={handlePrev}
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-semibold text-slate-500 px-1">
            {currentIndex + 1} / {REVIEWS_LIST.length}
          </span>
          <button
            type="button"
            className="svem-reviews-arrow-btn"
            onClick={handleNext}
            aria-label="Next testimonial"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Review Card with Touch Swipe */}
      <div
        className="svem-review-card select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Large Yellow Quote Icon matching reference photo */}
        <div className="svem-review-quote-icon">
          <Quote size={28} />
        </div>

        {/* Comment Text */}
        <p className="svem-review-text">
          "{currentReview.comment}"
        </p>

        {/* Stars Rating */}
        <div className="svem-review-rating">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={18}
              className={`svem-star ${
                i < currentReview.rating ? 'svem-star-filled' : 'svem-star-empty'
              }`}
            />
          ))}
        </div>

        {/* Reviewer Details */}
        <div className="svem-review-author">
          <span className="svem-author-name">{currentReview.name}</span>
          <span className="svem-author-location">{currentReview.location} &bull; {currentReview.projectType}</span>
        </div>

        {/* Dots pagination */}
        <div className="flex justify-center gap-1.5 mt-3 pt-2 border-t border-slate-100">
          {REVIEWS_LIST.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? 'w-5 bg-amber-500' : 'w-2 bg-slate-200'
              }`}
              aria-label={`Go to review ${idx + 1}`}
            />
          ))}
        </div>

        {/* Placeholder badge for transparency */}
        <div className="svem-review-disclaimer">
          <span>* Client feedback placeholder demonstration</span>
        </div>
      </div>
    </div>
  );
};
