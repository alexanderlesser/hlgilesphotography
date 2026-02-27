import React from 'react';
import PostActionMenu from '../PostActionMenu';
import StatusPill from '../StatusPill';
import { Calendar, Hash, ChevronRight } from 'lucide-react';
import './PostTable.css';
import { useNavigate } from 'react-router-dom';

interface Post {
  id: number;
  title: string;
  published: boolean;
  created_at: string;
}

interface PostTableProps {
  posts: Post[];
}

const PostTable = ({ posts }: PostTableProps) => {
    const navigate = useNavigate();
  if (posts.length === 0) {
    return (
      <div className="empty-table-state">
        <p>No journal entries found. Start by creating your first post.</p>
      </div>
    );
  }

const handleClick = (postId: number) => {
    if(postId) {
        navigate(`/admin/post/${postId}`);
    }
}

  return (
    <div className="table-container">
      <table className="studio-table">
        <thead>
          <tr>
            <th className="col-id"><Hash size={14} /></th>
            <th>Title</th>
            <th>Status</th>
            <th>Date Created</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            /* We wrap the whole row in the Context Menu Trigger */
            <PostActionMenu key={post.id} postId={post.id} published={post.published}>
              <tr onClick={() => handleClick(post.id)} className="table-row-trigger">
                <td className="col-id text-muted">{post.id}</td>
                <td className="col-title">
                  <div className="title-cell">
                    <span className="font-medium">{post.title}</span>
                  </div>
                </td>
                <td>
                  <StatusPill published={post.published} />
                </td>
                <td className="col-date text-muted">
                  <div className="date-cell">
                    <Calendar size={14} />
                    {new Date(post.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </td>
                <td className="text-right">
                  <div className="action-hint">
                    <span className="hint-text">Right-click for options</span>
                    <ChevronRight size={16} className="text-muted" />
                  </div>
                </td>
              </tr>
            </PostActionMenu>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostTable;