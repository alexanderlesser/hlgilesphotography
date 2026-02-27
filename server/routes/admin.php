<?php

use App\Http\Controllers\Admin\AdminImageController;
use App\Http\Controllers\Admin\AdminPostController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\CreateAdminController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->group(function () {

    // Public Admin Route (No login required to attempt login!)
    Route::middleware('throttle:admin-login')
        ->post('/login', [AuthController::class, 'login']);

    // Protected Admin Routes (Requires valid token)
    Route::middleware(['auth:sanctum', 'throttle:admin'])->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/users', [CreateAdminController::class, 'store']);

        // Post Management
        Route::prefix('posts')->group(function () {
            Route::get('/', [AdminPostController::class, 'index']);      // GET /api/admin/posts
            Route::get('/{post}', [AdminPostController::class, 'show']); // GET /api/admin/posts/{id}

            Route::post('', [AdminPostController::class, 'store']);
            Route::put('/{post}', [AdminPostController::class, 'update']);
            Route::delete('/{post}', [AdminPostController::class, 'destroy']);
        });

        Route::prefix('images')->group(function () {
            Route::get('/', [AdminImageController::class, 'index']);
            Route::post('/', [AdminImageController::class, 'store']);
            // We use POST here because of the multipart/form-data limitation
            Route::patch('/{id}', [AdminImageController::class, 'update']);
        });
    });
});
