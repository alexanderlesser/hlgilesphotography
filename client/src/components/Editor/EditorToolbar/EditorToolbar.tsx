import React from 'react';
import { ArrowLeft, Eye, Edit3, Save, Send } from 'lucide-react';
import './EditorToolbar.css';

interface EditorToolbarProps {
  isEdit: boolean;
  view: 'edit' | 'preview';
  setView: (view: 'edit' | 'preview') => void;
  onBack: () => void;
  onSave: (status: 'draft' | 'published') => void;
  isSaving: boolean;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  isEdit,
  view,
  setView,
  onBack,
  onSave,
  isSaving,
}) => {
  return (
    <header className="editor-toolbar">
      <div className="editor-toolbar__left">
        <button className="editor-toolbar__back" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <div className="editor-toolbar__divider" />
        <h1 className="editor-toolbar__title">
          {isEdit ? 'Edit Post' : 'New Post'}
        </h1>
      </div>

      <div className="editor-toolbar__center">
        <div className="editor-toolbar__tabs">
          <button
            className={`editor-toolbar__tab ${view === 'edit' ? 'editor-toolbar__tab--active' : ''}`}
            onClick={() => setView('edit')}
          >
            <Edit3 size={15} />
            <span>Editor</span>
          </button>
          <button
            className={`editor-toolbar__tab ${view === 'preview' ? 'editor-toolbar__tab--active' : ''}`}
            onClick={() => setView('preview')}
          >
            <Eye size={15} />
            <span>Preview</span>
          </button>
        </div>
      </div>

      <div className="editor-toolbar__right">
        <button
          className="editor-toolbar__btn editor-toolbar__btn--secondary"
          onClick={() => onSave('draft')}
          disabled={isSaving}
        >
          <Save size={15} />
          <span>Save Draft</span>
        </button>
        <button
          className="editor-toolbar__btn editor-toolbar__btn--primary"
          onClick={() => onSave('published')}
          disabled={isSaving}
        >
          <Send size={15} />
          <span>Publish</span>
        </button>
      </div>
    </header>
  );
};

export default EditorToolbar;
