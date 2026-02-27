<?php

namespace Database\Factories;

use App\Models\UserRole;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => static::$password ??= Hash::make('password'),
            'role_id' => UserRole::where('name', UserRole::ADMINISTRATOR)->first()?->id,
        ];
    }

    public function superAdmin(): static
    {
        return $this->state(fn () => [
            'role_id' => UserRole::where('name', UserRole::SUPER_ADMINISTRATOR)->first()->id,
        ]);
    }

    public function admin(): static
    {
        return $this->state(fn () => [
            'role_id' => UserRole::where('name', UserRole::ADMINISTRATOR)->first()->id,
        ]);
    }
}
