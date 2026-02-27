<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Http\Resources\PostResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PostController extends Controller
{
    /**
     * Display a paginated list of published posts.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = $request->query('per_page', 10);

        $posts = Post::where('published', true)
            ->latest()
            ->Paginate($perPage);

        // This handles the pagination structure automatically
        return PostResource::collection($posts);
    }

    /**
     * Display the specified published post.
     */
    public function show(Post $post): PostResource
    {
        // Security check: If it's not published, 404
        if (!$post->published) {
            abort(404, 'Post not found.');
        }

        // Load 'images' so the public gallery can display the slider/grid
        return new PostResource($post->load('images'));
    }
}