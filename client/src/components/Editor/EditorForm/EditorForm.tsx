import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { ImagePlus, X } from 'lucide-react';
import './EditorForm.css';
import ImageSlider from '../../ImageSlider';
import type { PostImage } from '../../../api/types';
import StatusPill from '../../Dashboard/StatusPill';

interface FormData {
  title: string;
  excerpt: string;
  body: string;
  coverImage: string;
  published: boolean;
  sliderImages: PostImage[];
}

interface EditorFormProps {
  data: FormData;
  onChange: (field: string, value: any) => void;
  onOpenMedia: (target: 'cover' | 'slider') => void;
}

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    ['clean'],
  ],
};

const EditorForm: React.FC<EditorFormProps> = ({ data, onChange, onOpenMedia }) => {
  const handleRemoveSliderImage = (index: number) => {
    const updated = data.sliderImages.filter((_, i) => i !== index);
    onChange('sliderImages', updated);
  };

  return (
    <div className="editor-form animate-fade-in-up">
      <StatusPill published={data.published} />
      {/* Title */}
      <div className="editor-form__group">
        <input
          type="text"
          className="editor-form__title-input"
          placeholder="Post title..."
          value={data.title}
          onChange={e => onChange('title', e.target.value)}
        />
      </div>

      {/* Excerpt */}
      {/* <div className="editor-form__group">
        <label className="form-label">Excerpt</label>
        <textarea
          className="form-input editor-form__excerpt"
          placeholder="A brief summary of your post..."
          value={data.excerpt}
          onChange={e => onChange('excerpt', e.target.value)}
          rows={2}
        />
      </div> */}

      {/* Cover Image */}
      <div className="editor-form__group">
        <label className="form-label">Cover Image</label>
        {data.coverImage ? (
          <div className="editor-form__cover">
            <img src={data.coverImage} alt="Cover" />
            <div className="editor-form__cover-actions">
              <button
                className="editor-form__cover-btn"
                onClick={() => onOpenMedia('cover')}
              >
                Change
              </button>
              <button
                className="editor-form__cover-btn editor-form__cover-btn--remove"
                onClick={() => onChange('coverImage', '')}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          <button
            className="editor-form__cover-placeholder"
            onClick={() => onOpenMedia('cover')}
          >
            <ImagePlus size={28} />
            <span>Add Cover Image</span>
          </button>
        )}
      </div>

      {/* Image Slider */}
      <div className="editor-form__group">
        <ImageSlider
          images={data.sliderImages}
          editMode={true}
          onAddClick={() => onOpenMedia('slider')}
          onRemove={handleRemoveSliderImage}
        />
      </div>

      {/* Body */}
      <div className="editor-form__group">
        <label className="form-label">Body</label>
        <div className="editor-form__quill-wrapper">
          <ReactQuill
            theme="snow"
            value={data.body}
            onChange={val => onChange('body', val)}
            modules={quillModules}
            placeholder="Write your story..."
          />
        </div>
      </div>
    </div>
  );
};

export default EditorForm;
