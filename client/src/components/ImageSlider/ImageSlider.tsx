import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, X, Images } from 'lucide-react';
import './ImageSlider.css';
import type { PostImage } from '../../api/types';
import Lightbox from '../Lightbox'; // Adjust path as needed

interface ImageSliderProps {
  images: PostImage[];
  editMode?: boolean;
  onAddClick?: () => void;
  onRemove?: (index: number) => void;
}

const ImageSlider: React.FC<ImageSliderProps> = ({
  images,
  editMode = false,
  onAddClick,
  onRemove,
}) => {
  const [current, setCurrent] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent(c => (c === 0 ? images.length - 1 : c - 1));
  };

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent(c => (c === images.length - 1 ? 0 : c + 1));
  };

  // Map PostImage[] to { src: string; title?: string }[] for Lightbox compatibility
  const lightboxImages = images.map(img => ({
    src: img.url,
    title: img.filename
  }));

  if (editMode) {
    return (
      <div className="image-slider image-slider--edit">
        <label className="form-label">Image Slider</label>
        <div className="image-slider__grid">
          {images.map((img, i) => (
            <div key={i} className="image-slider__thumb">
              <img src={img.url} alt={`Slide ${i + 1}`} />
              <button
                className="image-slider__remove"
                onClick={() => onRemove?.(i)}
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <button className="image-slider__add" onClick={onAddClick}>
            <Plus size={22} />
            <span>Add Images</span>
          </button>
        </div>
      </div>
    );
  }

  if (images.length === 0) return null;

  return (
    <>
      <div className="image-slider image-slider--preview">
        {/* Clicking the viewport opens the Lightbox */}
        <div 
          className="image-slider__viewport" 
          onClick={() => setIsLightboxOpen(true)}
          style={{ cursor: 'zoom-in' }}
        >
          <img
            src={images[current].url}
            alt={`Slide ${current + 1}`}
            className="image-slider__slide"
          />
          {images.length > 1 && (
            <>
              <button className="image-slider__nav image-slider__nav--prev" onClick={prev}>
                <ChevronLeft size={22} />
              </button>
              <button className="image-slider__nav image-slider__nav--next" onClick={next}>
                <ChevronRight size={22} />
              </button>
              <div className="image-slider__dots">
                {images.map((_, i) => (
                  <button
                    key={i}
                    className={`image-slider__dot ${i === current ? 'image-slider__dot--active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrent(i);
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="image-slider__counter">
          <Images size={14} />
          <span>{current + 1} / {images.length}</span>
        </div>
      </div>

      {/* Render Lightbox when open */}
      {isLightboxOpen && (
        <Lightbox
          images={lightboxImages}
          currentIndex={current}
          onClose={() => setIsLightboxOpen(false)}
          onNavigate={setCurrent}
        />
      )}
    </>
  );
};

export default ImageSlider;