export interface PostPayload {
  title: string;
  body: string;
  banner?: string;
  published: boolean;
  slider_images?: { id: number; sort_order: number }[];
}

export interface PostImage {
  id: number;
  url: string;           // Renamed from path to match Resource 'url'
  filename: string;
  gallery: boolean;
  dimensions: {          // Restructured to match the Resource 'dimensions' object
    width: number;
    height: number;
  };
  size_human: string;    // Added missing field
  uploaded_at: string;   // Added missing field
  pivot?: {
    post_id: number;
    image_id: number;
    sort_order: number;
  };
}

export interface Post {
  id: number;
  title: string;
  body: string;
  banner: string;
  banner_url: string;
  published: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
  images?: PostImage[];
}

export interface FetchPostsParams {
  page?: number;
  per_page?: number;
}

export interface Pagination {
    current_page: number;
    from: number;
    path: string;
    per_page: string | number;
    to: number;
    total: number;
    last_page: number;
    links: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: Pagination;
}

// Specifically for your Posts
export type PostResponse = PaginatedResponse<Post>;