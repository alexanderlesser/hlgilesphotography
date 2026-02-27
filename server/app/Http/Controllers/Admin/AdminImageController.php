<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpsertImageRequest;
use App\Http\Resources\ImageResource;
use App\Models\Image as ImageModel;
use Illuminate\Http\Request;
use Intervention\Image\Laravel\Facades\Image;
use Illuminate\Support\Facades\Storage;

class AdminImageController extends Controller
{
    public function index(Request $request)
    {
        $images = ImageModel::latest()
            ->when($request->search, function ($query, $search) {
                $query->where('filename', 'like', "%{$search}%");
            })
            ->paginate(24);

        return ImageResource::collection($images);
    }

    public function store(UpsertImageRequest $request)
    {
        $file = $request->file('image');
        $img = Image::read($file);
        
        // Let's go with 2500px as discussed for system cameras
        $img->scale(width: 2500); 

        // We'll encode to WebP here as it's better for web performance
        $encoded = $img->toWebp(quality: 80);
        
        $extension = 'webp';
        $baseName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $filename = ($request->filename ?? $baseName) . '.' . $extension;
        
        $path = "images/" . date('Y/m') . "/" . uniqid() . "_{$filename}";

        // Save locally for now
        Storage::disk('public')->put($path, (string) $encoded);

        $imageRecord = ImageModel::create([
            'path' => $path,
            'filename' => $filename,
            'width' => $img->width(),
            'height' => $img->height(),
            'size' => strlen($encoded), // Saved compressed size
            'user_id' => auth()->id(),
        ]);

        return new ImageResource($imageRecord);
    }

    public function update(Request $request, $id)
    {
        $image = ImageModel::findOrFail($id);

        if ($request->has('gallery')) {
            // This handles "0", 0, "false", and false correctly
            $image->gallery = filter_var($request->gallery, FILTER_VALIDATE_BOOLEAN);
        }
        
        $validated = $request->validate([
            'filename' => 'required|string|max:255',
            'gallery'  => 'sometimes|in:0,1' // Validate the incoming string 0 or 1
        ]);

        // Update filename from validated data
        $image->filename = $validated['filename'];

        // Manually handle the gallery boolean conversion
        if ($request->has('gallery')) {
            $image->gallery = $request->gallery === '1';
        }

        $image->save();
        
        $image->refresh();

        return new ImageResource($image);
    }

    public function destroy(ImageModel $image)
    {
        // Don't forget to delete the physical file!
        Storage::disk('public')->delete($image->path);
        $image->delete();

        return response()->noContent();
    }
}