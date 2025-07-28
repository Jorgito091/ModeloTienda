<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Crear un usuario admin
        User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // Crear un usuario normal
        User::create([
            'name' => 'Juan Pérez',
            'email' => 'juan@example.com',
            'password' => bcrypt('password'),
            'role' => 'user',
        ]);
    }
}
