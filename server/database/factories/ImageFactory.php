<?php

namespace Database\Factories;

use App\Models\Image;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ImageFactory extends Factory
{
    protected $model = Image::class;

    public function definition(): array
    {
        $width = $this->faker->numberBetween(800, 1600);
        $height = $this->faker->numberBetween(600, 1800);

        $urls = [
            'https://img.freepik.com/free-photo/closeup-shot-beautiful-butterfly-with-interesting-textures-orange-petaled-flower_181624-7640.jpg?semt=ais_user_personalization&w=740&q=80',
            'https://onlinejpgtools.com/images/examples-onlinejpgtools/sunflower.jpg',
            'https://cloudinary-marketing-res.cloudinary.com/image/upload/w_1300/q_auto/f_auto/hiking_dog_mountain',
            'https://images.unsplash.com/photo-1533450718592-29d45635f0a9?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8anBnfGVufDB8fHww',
            'https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg'
        ];

        return [
            'path' => $this->faker->randomElement($urls),
            'filename' => $this->faker->word() . '.jpg',
            'mime_type' => 'image/jpeg',
            'width' => $width,
            'height' => $height,
            'size' => $this->faker->numberBetween(50000, 2000000), 
            'hash' => md5(Str::random(40)),
            'gallery' => true,
            // Use existing first user if available, otherwise create one
            'user_id' => User::first()?->id ?? User::factory(),
        ];
    }
}