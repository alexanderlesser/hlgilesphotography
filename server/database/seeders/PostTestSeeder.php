<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Image;
use App\Models\User;
use Illuminate\Database\Seeder;

class PostTestSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure we have an admin user
        $admin = User::first() ?? User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
        ]);

        // 2. Create 15 Posts
        Post::factory(15)
            ->create(['created_by' => $admin->id])
            ->each(function ($post) use ($admin) {
                
                // 3. Create a specific image to act as the Banner for this post
                $bannerImage = Image::factory()->create([
                    'user_id' => $admin->id,
                    'gallery' => false, // Banners might not be "portfolio" shots
                ]);

                // Update the post with the banner path
                $post->update(['banner' => $bannerImage->path]);

                // 4. Create 3 to 6 additional images for the Post Slider
                $sliderImages = Image::factory(rand(3, 6))->create([
                    'user_id' => $admin->id,
                    'gallery' => true, // These are beautiful shots for the gallery
                ]);

                // 5. Attach them to the post pivot table with sort_order
                foreach ($sliderImages as $index => $image) {
                    $post->images()->attach($image->id, [
                        'sort_order' => $index,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            });
    }
}