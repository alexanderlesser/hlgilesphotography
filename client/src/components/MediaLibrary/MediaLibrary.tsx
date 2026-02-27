import React, { useEffect, useState } from 'react';
import { Loader2, Search, ImageOff, Check, X, Trash2, Info } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { adminApi} from '../../api/admin';
import './MediaLibrary.css';
import type { PostImage } from '../../api/types';

interface MediaLibraryProps {
  onSelect?: (image: PostImage | PostImage[]) => void;
  onClose?: () => void;
  allowMultiple?: boolean;
}

const MediaLibrary = ({ onSelect, onClose, allowMultiple = false }: MediaLibraryProps) => {
  const [images, setImages] = useState<PostImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [focusedImage, setFocusedImage] = useState<PostImage | null>(null);
  const [localEdit, setLocalEdit] = useState<{ filename?: string; gallery?: boolean }>({});
  const [isSaving, setIsSaving] = useState(false);

  const fetchImages = async (page: number = 1, isLoadMore: boolean = false) => {
    if (isLoadMore) setIsLoadingMore(true);
    else setLoading(true);

    try {
      const response = await adminApi.getMediaLibrary(page);
      const newImages = response.data?.data || [];
      const meta = response.data?.meta;

      setImages(prev => isLoadMore ? [...prev, ...newImages] : newImages);
      
      if (meta) {
        setCurrentPage(meta.current_page);
        setLastPage(meta.last_page);
      }
    } catch (err) {
      console.error("Failed to fetch media:", err);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchImages(1);
  }, []);

  const handleLoadMore = () => {
    if (currentPage < lastPage) fetchImages(currentPage + 1, true);
  };

  const handleImageClick = (img: PostImage) => {
    if (onSelect) {
      // PICKER MODE: Toggle selection
      if (allowMultiple) {
        setSelectedIds(prev => 
          prev.includes(img.id) ? prev.filter(id => id !== img.id) : [...prev, img.id]
        );
      } else {
        setSelectedIds([img.id]);
      }
      // Close sidepanel if user was editing previously
      setFocusedImage(null);
    } else {
      // MANAGEMENT MODE: Open Sidepanel
      setFocusedImage(img);
      setLocalEdit({}); 
    }
  };

  const handleConfirmSelection = () => {
    const selectedImages = images.filter(img => selectedIds.includes(img.id));
    if (onSelect && selectedImages.length > 0) {
      onSelect(allowMultiple ? selectedImages : selectedImages[0]);
      setSelectedIds([]);
      if (onClose) onClose();
    }
  };

  const handleSaveAsset = async () => {
    if (!focusedImage || Object.keys(localEdit).length === 0) return;
    setIsSaving(true);
    const formData = new FormData();
    formData.append('filename', localEdit.filename ?? focusedImage.filename);
    if (localEdit.gallery !== undefined) formData.append('gallery', localEdit.gallery ? '1' : '0');

    try {
      const response = await adminApi.updateImage(focusedImage.id, formData);
      const updatedData = response.data?.data;
      if (!updatedData) throw new Error("No data returned");
      const sanitizedData = { ...updatedData, gallery: Boolean(updatedData.gallery) };

      setImages(prev => prev.map(img => img.id === focusedImage.id ? { ...img, ...sanitizedData } : img));
      setFocusedImage(sanitizedData);
      setLocalEdit({});
    } catch (err: any) {
      console.error(err);
    } finally { setIsSaving(false); }
  };

  const handleDeleteImage = async () => {
    if (!focusedImage) return;
    if (window.confirm(`Permanently delete ${focusedImage.filename}?`)) {
      try {
        await adminApi.deleteImage(focusedImage.id);
        setImages(prev => prev.filter(img => img.id !== focusedImage.id));
        setFocusedImage(null);
      } catch (err) { alert("Delete failed."); }
    }
  };

  const filteredImages = (images || []).filter(img => 
    img.filename?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`library-root ${focusedImage && !onSelect ? 'has-sidepanel' : ''}`}>
      <div className="library-main-content">
        <div className="library-actions">
          <div className="search-bar">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search assets..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ImageUpload onUploadSuccess={() => fetchImages(1)} />
        </div>

        <div className="library-scroll-area">
          {loading ? (
            <div className="library-state-msg">
              <Loader2 className="spinner" />
              <p>Scanning assets...</p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="library-state-msg">
              <ImageOff size={48} strokeWidth={1} />
              <p>No images found.</p>
            </div>
          ) : (
            <>
              <div className="media-grid">
                {filteredImages.map((img) => {
                  const isSelected = selectedIds.includes(img.id);
                  return (
                    <div 
                      key={img.id} 
                      className={`media-item 
                        ${onSelect ? 'is-selectable' : 'is-manageable'} 
                        ${isSelected ? 'is-selected' : ''} 
                        ${focusedImage?.id === img.id ? 'is-focused' : ''}`
                      }
                      onClick={() => handleImageClick(img)}
                    >
                      <div className="media-preview">
                        <img src={img.url} alt={img.filename} loading="lazy" />
                        {isSelected && (
                          <div className="media-check-badge">
                            <Check size={18} />
                          </div>
                        )}
                      </div>
                      <div className="media-meta">
                        <span className="media-name">{img.filename}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {currentPage < lastPage && (
                <div className="load-more-container">
                  <button 
                    className="library-btn load-more-btn" 
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                  >
                    {isLoadingMore ? <Loader2 className="spinner" size={16} /> : "Load More Assets"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* --- ADDED SELECTION FOOTER --- */}
        {onSelect && (
          <div className="library-footer">
            <div className="selection-count">
              {selectedIds.length > 0 && `${selectedIds.length} item${selectedIds.length > 1 ? 's' : ''} selected`}
            </div>
            <div className="footer-actions">
              <button className="library-btn library-btn--cancel" onClick={onClose}>
                Cancel
              </button>
              <button 
                className="library-btn library-btn--confirm" 
                disabled={selectedIds.length === 0}
                onClick={handleConfirmSelection}
              >
                Select {allowMultiple && selectedIds.length > 1 ? 'Images' : 'Image'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- MODIFIED SIDE PANEL GUARD --- */}
      {focusedImage && !onSelect && (
        <aside className="image-edit-sidepanel">
          <div className="sidepanel-header">
            <h3>Asset Details</h3>
            <button className="close-panel-btn" onClick={() => setFocusedImage(null)}>
              <X size={18} />
            </button>
          </div>
          <div className="sidepanel-content">
            <div className="sidepanel-preview">
              <img src={focusedImage.url} alt="Preview" />
            </div>
            <div className="edit-form">
              <div className="form-group">
                <label>Filename</label>
                <input 
                  type="text" 
                  value={localEdit.filename ?? focusedImage.filename}
                  onChange={(e) => setLocalEdit({ ...localEdit, filename: e.target.value })} 
                />
              </div>
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="isGallery"
                  checked={!!(localEdit.gallery ?? focusedImage.gallery)}
                  onChange={(e) => setLocalEdit({ ...localEdit, gallery: e.target.checked })}
                />
                <label htmlFor="isGallery">Visible in Gallery</label>
              </div>
              <div className="sidepanel-actions">
                <button 
                  className="library-btn library-btn--confirm save-asset-btn"
                  disabled={isSaving || Object.keys(localEdit).length === 0}
                  onClick={handleSaveAsset}
                >
                  {isSaving ? <Loader2 size={14} className="spinner" /> : "Save Changes"}
                </button>
                <button className="delete-asset-btn" onClick={handleDeleteImage}>
                  <Trash2 size={14} />
                  <span>Delete Permanently</span>
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

export default MediaLibrary;