import React from 'react';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { useNavigate } from 'react-router-dom';
import { 
  Edit3, 
  Trash2, 
  ExternalLink, 
  ToggleLeft, 
  ToggleRight, 
  Copy 
} from 'lucide-react';
import './PostActionMenu.css';
import { useAdminDashboard } from '../../../context/AdminDashboardContext';
import { adminApi } from '../../../api/admin';

interface PostActionMenuProps {
  children: React.ReactNode;
  postId: number;
  published: boolean;
}

const PostActionMenu = ({ children, postId, published }: PostActionMenuProps) => {
  const navigate = useNavigate();
  const { getPosts, pagination } = useAdminDashboard();

  // Helper to refresh the current page of the dashboard
  const refreshDashboard = () => {
    getPosts({ 
      page: pagination?.current_page || 1, 
      per_page: 15 
    }, false);
  };

  const handleEdit = () => navigate(`/admin/post/${postId}`);

  const handleToggleStatus = async () => {
    try {
      // Using updatePost from adminApi
      // Note: We only send the field we want to change
      await adminApi.updatePost(postId, { published: !published } as any);
      refreshDashboard();
    } catch (err) {
      console.error("Failed to toggle status:", err);
      alert("Error updating post status.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      try {
        await adminApi.deletePost(postId);
        refreshDashboard();
      } catch (err) {
        console.error("Failed to delete post:", err);
        alert("Could not delete the post.");
      }
    }
  };

  const copyId = () => {
    navigator.clipboard.writeText(postId.toString());
  };

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        {children}
      </ContextMenu.Trigger>

      <ContextMenu.Portal>
        <ContextMenu.Content className="ctx-menu-content">
          <ContextMenu.Item className="ctx-menu-item" onSelect={handleEdit}>
            <Edit3 size={15} /> Edit Details
          </ContextMenu.Item>
          
          <ContextMenu.Item className="ctx-menu-item" onSelect={handleToggleStatus}>
            {published ? <ToggleLeft size={15} /> : <ToggleRight size={15} />}
            <span className="ctx-menu-text">
              {published ? 'Set to Draft' : 'Publish Post'}
            </span>
          </ContextMenu.Item>

          <ContextMenu.Item 
            className="ctx-menu-item" 
            onSelect={() => window.open(`/blog/${postId}`, '_blank')}
          >
            <ExternalLink size={15} /> View Live
          </ContextMenu.Item>

          <ContextMenu.Separator className="ctx-menu-separator" />

          <ContextMenu.Item className="ctx-menu-item" onSelect={copyId}>
            <Copy size={15} /> Copy Post ID
          </ContextMenu.Item>

          <ContextMenu.Separator className="ctx-menu-separator" />

          <ContextMenu.Item className="ctx-menu-item delete" onSelect={handleDelete}>
            <Trash2 size={15} /> Delete Post
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
};

export default PostActionMenu;