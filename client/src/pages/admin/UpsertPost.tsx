import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/admin';

// Sub-components
import EditorToolbar from '../../components/Editor/EditorToolbar/EditorToolbar';
import EditorForm from '../../components/Editor/EditorForm/EditorForm';
import PostPreview from '../../components/Editor/PostPreview';
import MediaLibraryModal from '../../components/MediaLibrary';

import './UpsertPost.css';
import { useAdminDashboard } from '../../context/AdminDashboardContext';
import type { PostImage } from '../../api/types';

const UpsertPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // UI States
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<'cover' | 'slider'>('cover');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);
  const { notify } = useAdminDashboard();

  // Unified State Object
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    body: '',
    coverImage: '',
    published: false,
    sliderImages: [] as PostImage[],
  });

  // Load data from Laravel API
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const response = await adminApi.getPost(parseInt(id));
        console.log('one post: ', response)
        const post = response.data.data;

        setFormData({
          title: post.title,
          excerpt: post.excerpt || '',
          body: post.body,
          coverImage: post.banner || '', // Using the Storage URL from Resource
          published: post.published || false,
          sliderImages: post.images || [],
        });
      } catch (err) {
        console.error("Could not load post:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const openMediaPicker = (target: 'cover' | 'slider') => {
    setMediaTarget(target);
    setIsMediaOpen(true);
  };

    const handleMediaSelect = (selection: PostImage | PostImage[]) => {
        if (mediaTarget === 'cover') {
            // 1. Extract the single image
            const img = Array.isArray(selection) ? selection[0] : selection;
            
            /**
             * NOTE: If your backend expects the relative path (e.g., "uploads/image.jpg") 
             * but 'img.url' is a full URL, you might need to strip the domain here.
             * If your 'img.url' is already the path, just use it directly.
             */
            updateField('coverImage', img.url);
        } else {
            // 2. Normalize selection to an array
            const incomingImages = Array.isArray(selection) ? selection : [selection];
            
            // 3. Prevent duplicates by checking IDs
            const uniqueNewImages = incomingImages.filter(
            newImg => !formData.sliderImages.some(existing => existing.id === newImg.id)
            );

            // 4. Update the slider array with the full PostImage objects
            updateField('sliderImages', [...formData.sliderImages, ...uniqueNewImages]);
        }
        
        setIsMediaOpen(false);
    };

  const handleSave = async (status: 'draft' | 'published') => {
    setIsSaving(true);
    try {
      const payload = {
        title: formData.title,
        body: formData.body,
        banner: formData.coverImage,
        published: status === 'published',
        // Send the ID + the current index as the sort order
        slider_images: formData.sliderImages.map((img, index) => ({
          id: img.id,
          sort_order: index 
        }))
      };

      if (id) {
        await adminApi.updatePost(parseInt(id), payload);
      } else {
        await adminApi.createPost(payload);
      }
      
        notify(
        "Post Updated", 
        "success", 
        `Successfully ${status === 'published' ? 'published' : 'saved'} the entry.`
      );
      
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="studio-loader">
        <div className="spinner"></div>
        <p>Fetching entry...</p>
      </div>
    );
  }

  return (
    <div className="upsert-root page-enter">
      <EditorToolbar
        isEdit={!!id}
        view={view}
        setView={setView}
        onBack={() => navigate('/admin/dashboard')}
        onSave={handleSave}
        isSaving={isSaving}
      />

      <main className="editor-main">
        {view === 'edit' ? (
          <EditorForm
            data={formData}
            onChange={updateField}
            onOpenMedia={openMediaPicker}
          />
        ) : (
          <PostPreview data={formData} />
        )}
      </main>

      <MediaLibraryModal
        open={isMediaOpen}
        onOpenChange={setIsMediaOpen}
        onSelect={handleMediaSelect}
        allowMultiple={mediaTarget === 'slider'} 
      />
    </div>
  );
};

export default UpsertPost;