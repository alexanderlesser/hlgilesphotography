import { useEffect, useCallback, useState } from 'react';
import './Lightbox.css';

interface LightboxProps {
  images: { src: string; title?: string }[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({ images, currentIndex, onClose, onNavigate }: LightboxProps) {
  const current = images[currentIndex];
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) >= minSwipeDistance) {
      if (distance > 0 && currentIndex < images.length - 1) {
        onNavigate(currentIndex + 1);
      } else if (distance < 0 && currentIndex > 0) {
        onNavigate(currentIndex - 1);
      }
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
      if (e.key === 'ArrowRight' && currentIndex < images.length - 1) onNavigate(currentIndex + 1);
    },
    [currentIndex, images.length, onClose, onNavigate]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  return (
    <div className="lightbox" onClick={onClose}>
      {currentIndex > 0 && (
        <button
          className="lightbox__nav lightbox__nav--prev"
          onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex - 1); }}
          aria-label="Previous image"
        >
          ‹
        </button>
      )}
      <img
        className="lightbox__image"
        src={current.src}
        alt={current.title || 'Photo'}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />

      {currentIndex < images.length - 1 && (
        <button
          className="lightbox__nav lightbox__nav--next"
          onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex + 1); }}
          aria-label="Next image"
        >
          ›
        </button>
      )}
      <button className="lightbox__close" onClick={onClose} aria-label="Close lightbox">
        ✕
      </button>
    </div>
  );
}