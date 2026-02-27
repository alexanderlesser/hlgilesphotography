<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostImage extends Model {

    protected $fillable = [
        'post_id',
        'image_id',
        'sort_order'
    ];

    protected $touches = ['post'];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function image(): BelongsTo
    {
        return $this->belongsTo(Image::class);
    }
}