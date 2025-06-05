<?php

namespace App\Http\Controllers;

use App\Models\Password;
use Illuminate\Http\Request;

class PasswordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $passwords = auth('api')->user()->passwords()->latest()->get();

        return response()->json([
            'passwords' => $passwords
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'nullable|string|max:255',
            'username' => 'nullable|string|max:255',
            'password' => 'required|string',
            'url' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'folder_id' => 'nullable|exists:folders,id'
        ]);

        $password = Password::create([
            'user_id' => auth('api')->id(),
            'folder_id' => $request->folder_id,
            'title' => $request->title,
            'username' => $request->username,
            'password' => $request->password,
            'url' => $request->url,
            'notes' => $request->notes
        ]);

        return response()->json([
            'message' => 'Contraseña guardada correctamente.',
            'password' => $password
        ], 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(Password $password)
    {
        if ($password->user_id !== auth('api')->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        return response()->json(['password' => $password]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Password $password)
    {
        if ($password->user_id !== auth('api')->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'title' => 'nullable|string|max:255',
            'username' => 'nullable|string|max:255',
            'password' => 'required|string',
            'url' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'folder_id' => 'nullable|exists:folders,id'
        ]);

        $password->update([
            'title' => $request->title,
            'username' => $request->username,
            'password' => $request->password,
            'url' => $request->url,
            'notes' => $request->notes,
            'folder_id' => $request->folder_id
        ]);

        return response()->json([
            'message' => 'Contraseña actualizada correctamente.',
            'password' => $password
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Password $password)
    {
        if ($password->user_id !== auth('api')->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $password->delete();

        return response()->json(['message' => 'Contraseña eliminada correctamente.']);
    }
}
