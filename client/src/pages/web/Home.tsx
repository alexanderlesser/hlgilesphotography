import { useEffect, useState } from 'react';
import Lightbox from '../../components/Lightbox';
import './Home.css';
import { webApi } from '../../api/web';
import type { PostImage } from '../../api/types';

// Helper to keep the layout logic clean
function distributeToColumns<T>(items: T[], maxCols: number): T[][] {
  if (!items.length) return [];
  const numCols = Math.min(items.length, maxCols);
  const columns: T[][] = Array.from({ length: numCols }, () => []);
  items.forEach((item, i) => columns[i % numCols].push(item));
  return columns;
}

export default function Home() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await webApi.getImages({page: 1, per_page: 10});
        console.log('RESPONSE: ', response)
        // Assuming response.data contains the array of PostImages
        const apiImages = response.data.data.map((img: PostImage) => ({
          id: img.id,
          src: img.url,
          title: img.filename
        }));
        setImages(apiImages);
      } catch (err) {
        console.error("Failed to load images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Use the fetched images for the grid (taking the first 6 like your mock did)
  const featured = images.slice(0, 6);
  const columns = distributeToColumns(featured, 3);

  if (loading && images.length === 0) {
    return (
      <div className="studio-loader">
        <div className="spinner"></div>
      </div>
    );
  }
  console.log('IMAGES: ', images)
  return (
    <div className="page-enter">
      {/* Hero - Using the first fetched image or a fallback */}
      <section className="hero">
        <img className="hero__image" src={'https://cloudinary-marketing-res.cloudinary.com/image/upload/w_1300/q_auto/f_auto/hiking_dog_mountain'} alt={'Hero banner'} />
        <div className="hero__content">
          <h1 className="hero__title">Hannah Giles Photography</h1>
          <p className="hero__subtitle">Fine art &amp; editorial photography</p>
        </div>
      </section>

      {/* Featured Work */}
      <section className="section">
        <h2 className="section__title">Recent Work</h2>
        <p className="section__subtitle">Selected images from the latest projects</p>
        <div className="featured-grid stagger-children">
          {columns.map((col, colIndex) => (
            <div key={colIndex} className="featured-grid__column">
              {col.map((photo, itemIndex) => {
                // Calculate original index for Lightbox mapping
                const originalIndex = colIndex + itemIndex * columns.length;
                return (
                  <div
                    key={photo.id}
                    className="featured-grid__item"
                    onClick={() => setLightboxIndex(originalIndex)}
                  >
                    <img src={photo.src} alt={photo.title} loading="lazy" />
                    <span className="featured-grid__caption">{photo.title}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      {/* About Section remains the same... */}
      <section className="about-section">
        {/* Decorative corners */}
  <div className="about-section__corner about-section__corner--top-left" />
  <div className="about-section__corner about-section__corner--bottom-right" />

  <div className="about-section__inner">
    <div className="about-section__grid">
      
      {/* Left Column: Big Initials */}
      <div className="about-section__initials-col">
        <span className="about-section__initials">HG</span>
        <div className="about-section__initials-line" />
      </div>

      {/* Right Column: Content */}
      <div className="about-section__content">
        <span className="about-section__label">My name is</span>
        <h2 className="about-section__name">Hannah Giles</h2>
        
        <p className="about-section__text">
          Focusing on the architectural integrity of light and the mathematical 
          precision of space. My work bridges the gap between raw structures 
          and human perception.
        </p>
        
        <p className="about-section__text">
          Based in Stockholm, working globally with designers and architects who 
          value the quiet power of minimalist storytelling.
        </p>

        <div className="about-section__tags">
          <div className="about-section__tags-line" />
          <span className="about-section__tags-text">
            Absrtact art • Photography • Film
          </span>
        </div>
      </div>

    </div>
  </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={featured}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}