<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class CreateAdminController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->isSuperAdmin()) {
            return response()->json([
                'message' => 'Only super administrators can create admin users.',
            ], Response::HTTP_FORBIDDEN);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'role' => ['required', 'string', 'in:' . UserRole::ADMINISTRATOR . ',' . UserRole::SUPER_ADMINISTRATOR],
        ]);

        $role = UserRole::where('name', $validated['role'])->firstOrFail();
        $password = Str::random(16);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $password,
            'role_id' => $role->id,
        ]);

        return response()->json([
            'user' => new UserResource($user),
            'password' => $password,
        ], Response::HTTP_CREATED);
    }
}
