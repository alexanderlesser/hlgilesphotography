<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(UserRole::class);
    }

    public function isSuperAdmin(): bool
    {
        return $this->role->name === UserRole::SUPER_ADMINISTRATOR;
    }

    public function isAdmin(): bool
    {
        return in_array($this->role->name, [
            UserRole::ADMINISTRATOR,
            UserRole::SUPER_ADMINISTRATOR,
        ]);
    }

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class, 'created_by');
    }

    public function images(): HasMany {
        return $this->hasMany(Image::class);
    }
}
