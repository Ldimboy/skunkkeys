<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\PasswordController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\AdminController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/verify', [AuthController::class, 'verify']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);


Route::middleware('auth:api')->group(function () {

    // Folders
    Route::get('/folders', [FolderController::class, 'index']);
    Route::post('/folders', [FolderController::class, 'store']);
    Route::put('/folders/{folder}', [FolderController::class, 'update']);
    Route::delete('/folders/{folder}', [FolderController::class, 'destroy']);

    // Passwords
    Route::get('/passwords', [PasswordController::class, 'index']);
    Route::post('/passwords', [PasswordController::class, 'store']);
    Route::put('/passwords/{password}', [PasswordController::class, 'update']);
    Route::delete('/passwords/{password}', [PasswordController::class, 'destroy']);

    // Notes
    Route::get('/notes', [NoteController::class, 'index']);
    Route::post('/notes', [NoteController::class, 'store']);
    Route::put('/notes/{note}', [NoteController::class, 'update']);
    Route::delete('/notes/{note}', [NoteController::class, 'destroy']);

    // Folder content
    Route::get('/folders/{id}/content', [FolderController::class, 'getContent']);

    // Admin
    Route::get('/admin/users', [AdminController::class, 'index']);
    Route::put('/admin/users/{user}/toggle-admin', [AdminController::class, 'toggleAdmin']);
    Route::delete('/admin/users/{user}', [AdminController::class, 'destroy']);
    Route::get('/admin/users/{user}', [AdminController::class, 'show']);
});
