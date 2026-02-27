import React, { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, Loader2, AlertCircle } from 'lucide-react';
import './ImageUpload.css';
import { adminApi } from '../../api/admin';

interface ImageUploadProps {
  onUploadSuccess: () => void;
}

const ImageUpload = ({ onUploadSuccess }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // 1. Validation
  if (!file.type.startsWith('image/')) {
    setError("Please select a valid image file.");
    return;
  }

  setIsUploading(true);
  setError(null);

  // 2. Prepare Payload
  const formData = new FormData();
  formData.append('image', file);
  
  // Send the actual file name as the 'filename' parameter
  const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
    formData.append('filename', nameWithoutExtension);
  
  // Setting gallery to true (as '1') for library uploads
  formData.append('gallery', '1'); 

  try {
    // 3. Use the centralized adminApi
    // Passing the formData which now includes 'image', 'filename', and 'gallery'
    await adminApi.uploadImage(formData);
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    onUploadSuccess();
  } catch (err: any) {
    const message = err.response?.data?.message || "Upload failed.";
    setError(message);
  } finally {
    setIsUploading(false);
  }
};

  return (
    <div className="upload-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      
      <button 
        className={`btn-upload ${isUploading ? 'loading' : ''}`}
        onClick={handleButtonClick}
        disabled={isUploading}
      >
        {isUploading ? (
          <>
            <Loader2 size={16} className="spinner" />
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <UploadCloud size={16} />
            <span>Upload Image</span>
          </>
        )}
      </button>

      {error && (
        <div className="upload-error-hint" title={error}>
          <AlertCircle size={14} />
          <span>Error</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;