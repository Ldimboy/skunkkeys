<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use Illuminate\Http\Request;
use App\Models\Note;

class FolderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $folders = auth('api')->user()->folders()->latest()->get();

        return response()->json([
            'folders' => $folders
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255'
        ]);

        $folder = Folder::create([
            'user_id' => auth('api')->id(),
            'title' => $request->title
        ]);

        return response()->json([
            'message' => 'Carpeta creada correctamente.',
            'folder' => $folder
        ], 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(Folder $folder)
    {
        if ($folder->user_id !== auth('api')->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        return response()->json(['folder' => $folder]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Folder $folder)
    {
        // Verifica que el folder sea del usuario logueado
        if ($folder->user_id !== auth('api')->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255'
        ]);

        $folder->title = $request->title;
        $folder->save();

        return response()->json([
            'message' => 'Carpeta actualizada correctamente.',
            'folder' => $folder
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Folder $folder)
    {
        if ($folder->user_id !== auth('api')->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $folder->delete();

        return response()->json(['message' => 'Carpeta eliminada correctamente.']);
    }



    public function content(Folder $folder)
    {
        if ($folder->user_id !== auth('api')->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $notes = $folder->notes()->latest()->get();
        $passwords = $folder->passwords()->latest()->get();

        return response()->json([
            'notes' => $notes,
            'passwords' => $passwords
        ]);
    }
}
