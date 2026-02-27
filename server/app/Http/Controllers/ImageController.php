<?php

namespace App\Http\Controllers;

use App\Http\Resources\ImageResource;
use App\Http\Resources\PostResource;
use App\Models\Image;
use App\Models\Post;
use Illuminate\Http\Request;

class ImageController extends Controller
{
    /**
     * Display a paginated list of images for the public gallery.
     */
    public function index(Request $request) 
    {
        $perPage = $request->query('per_page', 10);

        $posts = Image::latest()
            ->orderBy('id', 'desc')
            ->paginate($perPage);

        return ImageResource::collection($posts);
    }

    public function show(Post $post)
    {
        // withPivot ensures 'sort_order' is fetched from the junction table
        $post->load(['images' => function($query) {
            $query->withPivot('sort_order')->orderBy('pivot_sort_order', 'asc');
        }]);

        return new ImageResource($post);
    }
}