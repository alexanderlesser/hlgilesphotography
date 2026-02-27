<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\Image;
use App\Models\PostImage;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostImageFactory extends Factory
{
    protected $model = PostImage::class;

    public function definition(): array
    {
        return [
            'post_id' => Post::factory(),
            'image_id' => Image::factory(),
            'sort_order' => 0,
        ];
    }

    public function atPosition(int $order): static
    {
        return $this->state(fn (array $attributes) => [
            'sort_order' => $order,
        ]);
    }
}