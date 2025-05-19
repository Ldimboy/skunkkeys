<?php

namespace App\Http\Controllers;

use App\Models\Password;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;

class PasswordController extends Controller
{
    public function index()
    {
        return Password::where('user_id', Auth::id())->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'login' => 'required|string|max:255',
            'password' => 'required|string|max:255',
            'url' => 'nullable|string|max:255',
            'folder_id' => 'nullable|exists:folders,id',
        ]);

        $password = Password::create([
            'title' => $validated['title'],
            'login' => $validated['login'],
            'encrypted_password' => Crypt::encryptString($validated['password']),
            'url' => $validated['url'] ?? null,
            'user_id' => Auth::id(),
            'folder_id' => $validated['folder_id'] ?? null,
        ]);

        return response()->json($password, 201);
    }

    public function update(Request $request, Password $password)
    {
        // Asegurarse que el usuario actual es el dueño de la contraseña
        if ($password->user_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado.'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'login' => 'required|string|max:255',
            'password' => 'required|string|max:255',
            'url' => 'nullable|string|max:255',
            'folder_id' => 'nullable|exists:folders,id',
        ]);

        $password->update([
            'title' => $validated['title'],
            'login' => $validated['login'],
            'encrypted_password' => Crypt::encryptString($validated['password']),
            'url' => $validated['url'] ?? null,
            'folder_id' => $validated['folder_id'] ?? null,
        ]);

        return response()->json($password);
    }

    public function destroy(Password $password)
    {
        // Seguridad: asegurarse que borra solo lo suyo
        if ($password->user_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado.'], 403);
        }

        $password->delete();
        return response()->json(['message' => 'Contraseña eliminada']);
    }
}
