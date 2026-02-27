<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $email = config('services.admin.email');
        $password = config('services.admin.password');

        if (!$email || !$password) {
            throw new \Exception(
                'Missing ADMIN_EMAIL or ADMIN_PASSWORD in the .env file. ' . 
                'Seeding cannot continue without these credentials.'
            );
        }

        // Create roles
        UserRole::firstOrCreate(['name' => UserRole::ADMINISTRATOR]);
        UserRole::firstOrCreate(['name' => UserRole::SUPER_ADMINISTRATOR]);

        // Create default super administrator
        User::factory()->superAdmin()->create([
            'name' => 'Super Admin',
            'email' => $email,
            'password' => Hash::make($password),
        ]);
    }
}
