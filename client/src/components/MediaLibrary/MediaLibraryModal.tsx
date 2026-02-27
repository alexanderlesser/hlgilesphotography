import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Image as ImageIcon } from 'lucide-react';
import MediaLibrary from './MediaLibrary'; 
import './MediaLibraryModal.css';

interface MediaLibraryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect?: (image: any | any[]) => void;
  allowMultiple?: boolean; // Add this
}

const MediaLibraryModal = ({ open, onOpenChange, onSelect, allowMultiple = false }: MediaLibraryModalProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* The backdrop blur makes it feel like a professional studio app */}
        <Dialog.Overlay className="dialog-overlay" />
        
        <Dialog.Content className="media-modal-content">
          <div className="modal-header">
            <div className="modal-title-group">
              <div className="modal-icon-wrapper">
                <ImageIcon size={18} />
              </div>
              <div>
                <Dialog.Title className="display-font modal-title">
                  Media Library
                </Dialog.Title>
                <Dialog.Description className="modal-description">
                  Manage and upload your photography assets.
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close asChild>
              <button className="modal-close-btn" aria-label="Close">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>
          
          <div className="modal-body">
            <MediaLibrary 
              onSelect={onSelect} 
              allowMultiple={allowMultiple}
              onClose={() => onOpenChange(false)} 
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default MediaLibraryModal;