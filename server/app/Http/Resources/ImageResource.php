<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ImageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            // 'url' => Storage::disk('public')->url($this->path), // Points to your bucket later
            'url' => $this->path, // just return the regular path for now
            'filename' => $this->filename,
            'dimensions' => [
                'width' => $this->width,
                'height' => $this->height,
            ],
            'gallery' => (bool) $this->gallery,
            'sort_order' => $this->whenPivotLoaded('post_images', function () {
                return $this->pivot->sort_order;
            }),
            'size_human' => number_format($this->size / 1024, 2) . ' KB',
            'uploaded_at' => $this->created_at->format('Y-m-d H:i'),
        ];
    }
}