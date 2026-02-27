import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { webApi } from '../../api/web';
import type { Post, Pagination } from '../../api/types'; // Ensure Post type matches your backend response
import './Blog.css';

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const fetchPosts = async (page: number) => {
    try {
      if (page === 1) setLoading(true);
      else setIsFetchingMore(true);

      const response = await webApi.getPosts({ page, per_page: 10 });
      console.log(response);
      
      const newPosts = response.data;
      const meta = response.meta;
      console.log(meta)

      setPosts((prev) => (page === 1 ? newPosts : [...prev, ...newPosts]));
      setPagination(meta);
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handleLoadMore = () => {
    if (pagination && pagination.current_page < pagination.last_page) {
      fetchPosts(pagination.current_page + 1);
    }
  };

  const hasMore = pagination ? pagination.current_page < pagination.last_page : false;

  if (loading && posts.length === 0) {
    return (
      <div className="studio-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ paddingTop: 'var(--nav-height)' }}>
      <section className="section">
        <div className="blog-header">
          <span className="blog-header__label">Stories &amp; Process</span>
          <h1 className="blog-header__title">Blog</h1>
        </div>

        <div className="blog-rows stagger-children">
          {posts.map((post) => (
            <Link key={post.id} to={`/blog/${post.id}`} className="blog-row">
              <div className="blog-row__image-wrapper">
                {/* banner_url comes from your PostResource */}
                <img 
                  className="blog-row__image" 
                  src={post.banner} 
                  alt={post.title} 
                  loading="lazy" 
                />
              </div>
              <div className="blog-row__content">
                <time className="blog-row__date">{post.created_at}</time>
                <h2 className="blog-row__title">{post.title}</h2>
                {/* <p className="blog-row__excerpt">
                   {post.body.replace(/<[^>]*>?/gm, '').substring(0, 160)}...
                </p> */}
                <span className="blog-row__link">Read More &rarr;</span>
              </div>
            </Link>
          ))}
        </div>

        {hasMore && (
          <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
            <button
              className="btn btn--outline"
              disabled={isFetchingMore}
              onClick={handleLoadMore}
            >
              {isFetchingMore ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}