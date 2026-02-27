import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as Toast from '@radix-ui/react-toast'; // Import the primitives
import { adminApi } from "../api/admin";
import type { FetchPostsParams, Pagination, Post } from "../api/types";

interface AdminDashboardContextType {
  loading: boolean;
  setLoading: (val: boolean) => void;
  getPosts: (params: FetchPostsParams, append: boolean) => void;
  notify: (title: string, type: 'success' | 'error', description?: string) => void; // Added notify
  posts: Post[];
  pagination: Pagination | null;
}

const AdminDashboardContext = createContext<AdminDashboardContextType | null>(null);

export function AdminDashboardProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  // Toast States
  const [toastOpen, setToastOpen] = useState(false);
  const [toastConfig, setToastConfig] = useState<{title: string, type: 'success'|'error', description?: string}>({
    title: '',
    type: 'success'
  });

  const notify = (title: string, type: 'success' | 'error', description?: string) => {
    setToastConfig({ title, type, description });
    setToastOpen(true);
  };

  const getPosts = async (params: FetchPostsParams = {}, append = false) => {
    try {
      const response = await adminApi.getPosts(params);
      const newPosts = response.data;
      const meta = response.meta;
      setPosts(prev => append ? [...prev, ...newPosts] : newPosts);
      setPagination(meta);
    } catch (err) {
      console.error(err);
      notify("Fetch Error", "error", "Could not load posts from server.");
    }
  };

  const value: AdminDashboardContextType = {
    loading,
    setLoading,
    getPosts,
    notify, // Provided to all components
    posts,
    pagination
  };

  return (
    <AdminDashboardContext.Provider value={value}>
      <Toast.Provider swipeDirection="right">
        {children}

        {/* The Toast UI */}
        <Toast.Root 
          className={`ToastRoot ${toastConfig.type}`} 
          open={toastOpen} 
          onOpenChange={setToastOpen}
        >
          <div className="ToastContent">
            <Toast.Title className="ToastTitle">{toastConfig.title}</Toast.Title>
            {toastConfig.description && (
              <Toast.Description className="ToastDescription">
                {toastConfig.description}
              </Toast.Description>
            )}
          </div>
        </Toast.Root>

        <Toast.Viewport className="ToastViewport" />
      </Toast.Provider>
    </AdminDashboardContext.Provider>
  );
}

export function useAdminDashboard(): AdminDashboardContextType {
  const context = useContext(AdminDashboardContext);
  if (!context) throw new Error("useAdminDashboard must be used within provider");
  return context;
}