<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $notes = auth('api')->user()->notes()->latest()->get();

        return response()->json([
            'notes' => $notes
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'nullable|string|max:255',
            'content' => 'required|string',
            'folder_id' => 'nullable|exists:folders,id'
        ]);

        $note = Note::create([
            'user_id' => auth('api')->id(),
            'folder_id' => $request->folder_id,
            'title' => $request->title,
            'content' => $request->content
        ]);

        return response()->json([
            'message' => 'Nota creada correctamente.',
            'note' => $note
        ], 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(Note $note)
    {
        if ($note->user_id !== auth('api')->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        return response()->json(['note' => $note]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Note $note)
    {
        if ($note->user_id !== auth('api')->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'title' => 'nullable|string|max:255',
            'content' => 'required|string',
            'folder_id' => 'nullable|exists:folders,id'
        ]);

        $note->update([
            'title' => $request->title,
            'content' => $request->content,
            'folder_id' => $request->folder_id
        ]);

        return response()->json([
            'message' => 'Nota actualizada correctamente.',
            'note' => $note
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Note $note)
    {
        if ($note->user_id !== auth('api')->id()) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $note->delete();

        return response()->json(['message' => 'Nota eliminada correctamente.']);
    }
}
