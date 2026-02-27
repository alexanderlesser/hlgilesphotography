import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useAdminDashboard } from '../../context/AdminDashboardContext';

// Specialized Components
import PostTable from '../../components/Dashboard/PostTable';

import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useAdminAuth();
  
  const { posts, getPosts, pagination } = useAdminDashboard();
  const perPage = 15;

  useEffect(() => {
  if (!loading && !isAuthenticated) {
    navigate("/admin/login");
  } else if (isAuthenticated) {
    // ALWAYS fetch page 1 when landing on dashboard to ensure fresh data
    // false = overwrite the old posts array instead of appending
    getPosts({ page: 1, per_page: perPage }, false);
  }
}, [loading, isAuthenticated, navigate]);

  const handleLoadMoreClick = () => {
    const nextPage = (pagination?.current_page || 1) + 1;
    // Tell the context to fetch the next page and append it
    getPosts({ page: nextPage, per_page: perPage }, true); 
  };

  if (loading || !user) {
    return (
      <div className="studio-loader">
        <div className="spinner"></div>
        <p className="display-font">Entering the Studio...</p>
      </div>
    );
  }

  // Logic: Show button only if we have 15 or more posts AND there are more to fetch
  const hasMore = pagination ? pagination.current_page < pagination.last_page : false;
  const showLoadMore = posts.length >= perPage && hasMore;

  return (
    <div className="studio-root page-enter">
      <main className="studio-main">
        <header className="view-header">
          <div className="title-group">
            <h2 className="display-font">Journal Entries</h2>
            <span className="count-badge">
              {pagination?.total || posts.length} Posts Total
            </span>
          </div>
        </header>

        <PostTable posts={posts} />

        {showLoadMore && (
          <div className="load-more-wrapper">
            <button 
              className="load-more-btn" 
              onClick={handleLoadMoreClick}
            >
              Load more
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;