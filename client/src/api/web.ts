import { publicClient } from "./client";
import type { FetchPostsParams, PostResponse } from "./types";


export const webApi = {

    getImages: (params: FetchPostsParams) => publicClient.get(`/images`, {params}),

    getPosts: async (params: FetchPostsParams = { page: 1, per_page: 10 }): Promise<PostResponse> => { 
    const {data} = await publicClient.get("/posts", {params});
    
    return data;
    },

    getPost: (id: number) => publicClient.get(`/posts/${id}`),
}