<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpsertPostRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\Request;

class AdminPostController extends Controller 
{
    public function index(Request $request) 
    {
        $perPage = $request->query('per_page', 15);

        $posts = Post::with('creator')
            ->latest()
            ->orderBy('id', 'desc')
            ->paginate($perPage);

        return PostResource::collection($posts);
    }

    public function show(Post $post)
    {
        // withPivot ensures 'sort_order' is fetched from the junction table
        $post->load(['creator', 'images' => function($query) {
            $query->withPivot('sort_order')->orderBy('pivot_sort_order', 'asc');
        }]);

        return new PostResource($post);
    }

    public function store(UpsertPostRequest $request) 
    {
        $data = $request->validated();
        $data['created_by'] = auth()->id();
        
        // 1. Create the post
        $post = Post::create($data);

        // 2. Sync images if they exist in request
        if ($request->has('slider_images')) {
            $this->syncSliderImages($post, $request->input('slider_images'));
        }

        // 3. Load relationships with pivot data for the response
        return new PostResource($post->load(['creator', 'images' => function($query) {
            $query->withPivot('sort_order')->orderBy('pivot_sort_order', 'asc');
        }]));
    }

    public function update(UpsertPostRequest $request, Post $post) 
    {
        $data = $request->validated();
        $post->update($data);
        
        if ($request->has('slider_images')) {
            $this->syncSliderImages($post, $request->input('slider_images'));
        }

        // Load relationships with pivot data for the response
        return new PostResource($post->load(['creator', 'images' => function($query) {
            $query->withPivot('sort_order')->orderBy('pivot_sort_order', 'asc');
        }]));
    }

    /**
     * Helper to handle the pivot table mapping
     */
    protected function syncSliderImages(Post $post, array $sliderImages)
    {
        $syncData = [];
        
        foreach ($sliderImages as $item) {
            // Eloquent sync() expects: [id => ['pivot_col' => value]]
            $syncData[$item['id']] = [
                'sort_order' => $item['sort_order']
            ];
        }

        $post->images()->sync($syncData);
    }

    public function destroy(Post $post)
    {
        // Detach all associated images from the pivot table first
        $post->images()->detach();

        // Delete the post record
        $post->delete();

        // Return a 204 No Content response
        return response()->noContent();
    }
}