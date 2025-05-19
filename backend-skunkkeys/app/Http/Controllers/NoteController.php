<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NoteController extends Controller
{
    public function index()
    {
        return Note::where('user_id', Auth::id())->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'folder_id' => 'nullable|exists:folders,id',
        ]);

        $note = Note::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'user_id' => Auth::id(),
            'folder_id' => $validated['folder_id'] ?? null,
        ]);

        return response()->json($note, 201);
    }

    public function update(Request $request, Note $note)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'folder_id' => 'nullable|exists:folders,id',
        ]);

        $note->update([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'folder_id' => $validated['folder_id'] ?? null,
        ]);

        return response()->json($note);
    }

    public function destroy(Note $note)
    {
        $note->delete();
        return response()->json(['message' => 'Nota eliminada']);
    }
}
