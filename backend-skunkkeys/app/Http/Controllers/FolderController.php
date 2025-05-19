<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class FolderController extends Controller
{

    use AuthorizesRequests;

    public function index()
    {
        return Folder::where('user_id', Auth::id())->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',

        ]);

        $folder = Folder::create([
            'name' => $validated['name'],
            'user_id' => Auth::id()
        ]);

        return response()->json($folder, 201);
    }

    public function update(Request $request, Folder $folder)
    {

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $folder->update(['name' => $request->name]);

        return response()->json($folder);
    }

    public function destroy(Folder $folder)
    {

        $folder->delete();

        return response()->json(['message' => 'Carpeta eliminada']);
    }

    public function getContent($id)
    {
        $userId = Auth::id();

        $folder = Folder::where('id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();

        $passwords = $folder->passwords()->get();
        $notes = $folder->notes()->get();

        return response()->json([
            'folder' => $folder,
            'passwords' => $passwords,
            'notes' => $notes,
        ]);
    }
}
