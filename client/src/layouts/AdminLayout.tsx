import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import MediaLibraryModal from '../components/MediaLibrary';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const navigate = useNavigate();

  const handleNewEntry = () => {
    navigate('/admin/post'); // Navigates to the empty upsert form
  };

  return (
    <div className="admin-layout">
      <AdminNavbar 
        onOpenMedia={() => setIsMediaOpen(true)} 
        onNewEntry={handleNewEntry} 
      />
      
      {/* The actual page content (Dashboard or UpsertPost) */}
      {children}

      {/* Since this is in the layout, the modal is available globally in admin */}
      <MediaLibraryModal 
        open={isMediaOpen} 
        onOpenChange={setIsMediaOpen} 
      />
    </div>
  );
}