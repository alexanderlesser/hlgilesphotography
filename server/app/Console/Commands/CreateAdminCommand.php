<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\UserRole;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class CreateAdminCommand extends Command
{
    protected $signature = 'app:create-admin';
    protected $description = 'Create a new admin user';

    public function handle(): int
    {
        // Ensure roles exist
        UserRole::firstOrCreate(['name' => UserRole::ADMINISTRATOR]);
        UserRole::firstOrCreate(['name' => UserRole::SUPER_ADMINISTRATOR]);

        $name = $this->ask('Name');
        $email = $this->ask('Email');

        if (User::where('email', $email)->exists()) {
            $this->error("A user with email '{$email}' already exists.");
            return Command::FAILURE;
        }

        $role = $this->choice('Role', [
            UserRole::ADMINISTRATOR,
            UserRole::SUPER_ADMINISTRATOR,
        ]);

        $password = Str::random(16);
        $userRole = UserRole::where('name', $role)->first();

        User::create([
            'name' => $name,
            'email' => $email,
            'password' => $password,
            'role_id' => $userRole->id,
        ]);

        $this->info("Admin user created successfully!");
        $this->table(['Field', 'Value'], [
            ['Name', $name],
            ['Email', $email],
            ['Role', $role],
            ['Password', $password],
        ]);

        $this->warn('Save this password — it will not be shown again.');

        return Command::SUCCESS;
    }
}
