<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory {
    protected $model = Post::class;
    
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(),
            // Simulate HTML tags since you're using a WYSIWYG
            'body' => '<h2>' . $this->faker->words(3, true) . '</h2>' . 
                      '<p>' . implode('</p><p>', $this->faker->paragraphs(3)) . '</p>',
            'banner' => 'banners/' . $this->faker->uuid() . '.jpg',
            'created_by' => fn () => User::factory()->create()->id,
            'published' => $this->faker->boolean(80), // 80% chance of being true
        ];
    }
}