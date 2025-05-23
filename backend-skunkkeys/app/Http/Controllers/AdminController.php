<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    // Obtener todos los usuarios excepto el logueado
    public function index()
    {
        return User::where('id', '!=', Auth::id())->get();
    }

    // Cambiar si un usuario es admin o no
    public function toggleAdmin(User $user)
    {
        // Prevención: no modificar tu propio rol
        if ($user->id === Auth::id()) {
            return response()->json(['error' => 'No puedes modificar tu propio rol'], 403);
        }

        $user->is_admin = !$user->is_admin;
        $user->save();

        return response()->json(['message' => 'Rol actualizado', 'user' => $user]);
    }

    // Eliminar un usuario
    public function destroy(User $user)
    {
        // Prevención: no borrarse a sí mismo
        if ($user->id === Auth::id()) {
            return response()->json(['error' => 'No puedes eliminarte a ti mismo'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'Usuario eliminado']);
    }

    // Ver el contenido completo de un usuario (folders, notes, passwords)
    public function show(User $user)
    {
        $user->load('folders', 'notes', 'passwords');

        return response()->json($user);
    }
}
