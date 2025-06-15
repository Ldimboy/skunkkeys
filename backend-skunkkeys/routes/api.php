<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;

// Crud
use App\Http\Controllers\FolderController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\PasswordController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/verify-email', [AuthController::class, 'verifyEmail']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/reset-password-request', [AuthController::class, 'resetPasswordRequest']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

//  Ruta protegidas con login
Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/me', [AuthController::class, 'me']); //info user

    //Folder
    Route::post('/folders', [FolderController::class, 'store']);
    Route::get('/folders', [FolderController::class, 'index']);
    Route::put('/folders/{folder}', [FolderController::class, 'update']);
    Route::delete('/folders/{folder}', [FolderController::class, 'destroy']);
    Route::get('/folders/{folder}', [FolderController::class, 'show']);
    Route::get('/folders/{folder}/content', [FolderController::class, 'content']);


    //Note
    Route::post('/notes', [NoteController::class, 'store']);
    Route::get('/notes', [NoteController::class, 'index']);
    Route::put('/notes/{note}', [NoteController::class, 'update']);
    Route::delete('/notes/{note}', [NoteController::class, 'destroy']);
    Route::get('/notes/{note}', [NoteController::class, 'show']);

    //Password
    Route::post('/passwords', [PasswordController::class, 'store']);
    Route::get('/passwords', [PasswordController::class, 'index']);
    Route::put('/passwords/{password}', [PasswordController::class, 'update']);
    Route::delete('/passwords/{password}', [PasswordController::class, 'destroy']);
    Route::get('/passwords/{password}', [PasswordController::class, 'show']);
});


// Rutas protegidas Login + Admin
use App\Http\Controllers\UserController;

Route::middleware(['auth:api', 'admin'])->prefix('admin')->group(function () {
    Route::get('/users', [AdminController::class, 'listUsers']);
    Route::get('/users/{id}', [AdminController::class, 'show']);
    Route::delete('/users/{id}', [AdminController::class, 'destroy']);
    Route::put('/users/{id}/toggle-role', [AdminController::class, 'toggleAdmin']);
    Route::put('/users/{id}/toggle-active', [AdminController::class, 'toggleActive']);
    Route::put('/users/{id}/reset-password', [AdminController::class, 'resetPassword']);
});
