<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Image extends Model {

    use HasFactory;

    protected $fillable = [
        'path',
        'filename',
        'width',
        'height',
        'size',
        'user_id',
        'gallery'
    ];

    public function uploader(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id');
    }
}