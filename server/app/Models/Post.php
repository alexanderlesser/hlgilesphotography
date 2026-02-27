<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Post extends Model {

    use HasFactory;

    protected $fillable = [
        'title',
        'body',
        'banner',
        'created_by',
        'published',
    ];

    protected $casts = [
        'published' => 'boolean',
        'created_at' => 'datetime:Y-m-d H:i',
        'updated_at' => 'datetime:Y-m-d H:i',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function images()
    {
        return $this->belongsToMany(Image::class, 'post_images')
                    ->withPivot('sort_order')
                    ->withTimestamps()
                    ->orderBy('pivot_sort_order', 'asc');
    }
}