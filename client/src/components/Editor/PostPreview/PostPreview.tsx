import React from 'react';
import './PostPreview.css';
import ImageSlider from '../../ImageSlider';
import type { PostImage } from '../../../api/types';

interface PostPreviewProps {
  data: {
    title: string;
    excerpt: string;
    body: string;
    coverImage: string;
    sliderImages: PostImage[];
  };
}

const PostPreview: React.FC<PostPreviewProps> = ({ data }) => {
  return (
    <article className="post-preview animate-fade-in">
      {data.coverImage && (
        <div className="post-preview__hero">
          <img src={data.coverImage} alt="Cover" />
          <div className="post-preview__hero-overlay" />
        </div>
      )}

      <div className="post-preview__content">
        <h1 className="post-preview__title">
          {data.title || 'Untitled Post'}
        </h1>

        {data.excerpt && (
          <p className="post-preview__excerpt">{data.excerpt}</p>
        )}

        <div
          className="post-preview__body ql-editor"
          dangerouslySetInnerHTML={{ __html: data.body }}
        />

        {data.sliderImages.length > 0 && (
          <div className="post-preview__slider">
            <ImageSlider images={data.sliderImages} editMode={false} />
          </div>
        )}
      </div>
    </article>
  );
};

export default PostPreview;
