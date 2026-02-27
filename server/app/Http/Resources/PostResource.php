<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'body' => $this->body,
            'banner' => $this->banner,
            'banner_url' => Storage::disk('public')->url($this->banner),
            'published' => (bool) $this->published,
            'created_at' => $this->created_at->format('Y-m-d H:i'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i'),
            
            // Nested Relationships (only included when creator is eager-loaded)
            'author' => $this->whenLoaded('creator', fn () => [
                'id' => $this->creator->id,
                'name' => $this->creator->name,
            ]),
            
            // Only includes images if $post->load('images') was called
            'images' => ImageResource::collection($this->whenLoaded('images')),
        ];
    }
}