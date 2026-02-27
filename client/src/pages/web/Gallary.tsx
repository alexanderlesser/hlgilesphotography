import { useState, useEffect, useRef, useCallback } from 'react';
import Lightbox from '../../components/Lightbox';
import { webApi } from '../../api/web';
import type { PostImage, Pagination } from '../../api/types';
import './Gallery.css';

export default function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [images, setImages] = useState<any[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchGallery = useCallback(async (page: number) => {
    // Basic guard to prevent duplicate calls for the same page
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      const response = await webApi.getImages({page: page, per_page: 30});
      
      const newImages = response.data.data.map((img: PostImage) => ({
        id: img.id,
        src: img.url,
        title: img.filename
      }));

      setImages(prev => [...prev, ...newImages]);
      setPagination(response.data.meta);
    } catch (err) {
      console.error("Failed to fetch gallery images:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Initial load
  useEffect(() => {
    fetchGallery(1);
  }, []);

  // Intersection Observer for the main page scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pagination && pagination.current_page < pagination.last_page && !isLoading) {
          fetchGallery(pagination.current_page + 1);
        }
      },
      { threshold: 0.1 } // Trigger slightly before it's fully in view
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [pagination, isLoading, fetchGallery]);

  /**
   * Smart Navigation for Lightbox
   * This triggers the next fetch when the user navigates near the end
   */
  const handleLightboxNavigate = (newIndex: number) => {
    setLightboxIndex(newIndex);

    // If user is 3 images away from the end of the loaded batch
    const threshold = 3;
    const isNearEnd = newIndex >= images.length - threshold;
    const hasMore = pagination && pagination.current_page < pagination.last_page;

    if (isNearEnd && hasMore && !isLoading) {
      fetchGallery(pagination.current_page + 1);
    }
  };

  if (isLoading && images.length === 0) {
    return (
      <div className="studio-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ paddingTop: 'var(--nav-height)' }}>
      <section className="section">
        <h1 className="section__title">Gallery</h1>
        <p className="section__subtitle">A collection of fine art photography</p>
        
        <div className="gallery-grid stagger-children">
          {images.map((photo, i) => (
            <div
              key={`${photo.id}-${i}`}
              className="gallery-grid__item"
              onClick={() => setLightboxIndex(i)}
            >
              <img src={photo.src} alt={photo.title} loading="lazy" />
            </div>
          ))}
        </div>

        <div ref={observerTarget} className="infinite-scroll-trigger" style={{ height: '50px' }}>
          {isLoading && <div className="mini-loader">Fetching more images...</div>}
        </div>
      </section>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={handleLightboxNavigate} // Use the custom handler
        />
      )}
    </div>
  );
}