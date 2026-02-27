import adminClient from "./client";
import type { FetchPostsParams, PostPayload, PostResponse } from "./types";

export const adminApi = {
  // Post Management
  getPosts: async (params: FetchPostsParams = { page: 1, per_page: 5 }): Promise<PostResponse> => { 
   const {data} = await adminClient.get("/admin/posts", {params});
   
   return data;
  },

  getPost: (id: number) => adminClient.get(`/admin/posts/${id}`),
  
  createPost: (payload: PostPayload) => 
    adminClient.post("/admin/posts", payload),
    
  updatePost: (id: number, payload: PostPayload) => 
    adminClient.put(`/admin/posts/${id}`, payload),
    
  deletePost: (id: number) => 
    adminClient.delete(`/admin/posts/${id}`),

  // Media Library
 uploadImage: (formData: FormData) => 
  adminClient.post("/admin/images", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),

    // Add the update function here as well for the MediaLibrary edit panel
    updateImage: (id: number, formData: FormData) =>
  adminClient.post(`/admin/images/${id}`, formData, {
    params: { _method: 'PATCH' }, 
    headers: { "Content-Type": "multipart/form-data" }
  }),
    
  getMediaLibrary: (page: number = 1) => adminClient.get(`/admin/images?page=${page}`),
  
  deleteImage: (id: number) => adminClient.delete(`/admin/images/${id}`),
};