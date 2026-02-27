import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { webApi } from '../../api/web';
import type { Post, PostImage } from '../../api/types'; // Ensure PostImage is imported
import ImageSlider from '../../components/ImageSlider';
import './BlogPostPage.css';

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await webApi.getPost(parseInt(id));
        // Note: Check your console log here to see if it's response.data.data or response.data
        setPost(response.data.data); 
      } catch (err) {
        console.error("Failed to load post:", err);
        navigate('/blog', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [id, navigate]);

  if (loading) return <div className="studio-loader"><div className="spinner"></div></div>;
  if (!post) return null;

  return (
    <article className="blog-post page-enter animate-fade-in">
      {post.banner && (
        <div className="post-preview__hero">
          <img src={post.banner} alt="Cover" />
          <div className="post-preview__hero-overlay" />
        </div>
      )}
      
      <div className="blog-post__content">
      <Link to="/blog" className="blog-post__back">← Back to Blog</Link>
      <header className="blog-post__header">
        <time className="blog-post__date">{post.created_at}</time>
        <h1 className="blog-post__title">{post.title}</h1>
      </header>

      {/* FIX: Use banner_url for the src */}
      {/* {post.banner && (
        <img 
          className="blog-post__hero-image" 
          src={post.banner} 
          alt={post.title} 
        />
      )} */}

      <div 
        className="blog-post__body ql-editor" 
        dangerouslySetInnerHTML={{ __html: post.body }} 
      />

      {post.images && post.images.length > 0 && (
        <div className="blog-post__slider-container">
          {/* FIX: If PostImage interface expects 'url', 
              don't rename it to 'src' here. 
          */}
          <ImageSlider 
            images={post.images} 
            editMode={false} 
          />
        </div>
      )}
      </div>
    </article>
  );
}