<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $adminId = auth('api')->id();

        $users = User::where('id', '!=', $adminId)
            ->select('id', 'username', 'email', 'is_admin', 'is_active', 'created_at')
            ->get();

        return response()->json(['users' => $users]);
    }

    public function show($id)
    {
        $user = User::select('id', 'username', 'email', 'is_admin', 'is_active', 'created_at')->findOrFail($id);

        return response()->json(['user' => $user]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'Usuario eliminado correctamente.']);
    }

    public function toggleActive($id)
    {
        if ($id == auth('api')->id()) {
            return response()->json(['message' => 'No puedes modificar tu propio estado.'], 403);
        }

        $user = User::findOrFail($id);
        $user->is_active = !$user->is_active;
        $user->save();

        return response()->json([
            'message' => 'Estado de actividad actualizado.',
            'is_active' => $user->is_active
        ]);
    }

    public function toggleAdmin($id)
    {
        if ($id == auth('api')->id()) {
            return response()->json(['message' => 'No puedes modificar tu propio rol.'], 403);
        }

        $user = User::findOrFail($id);
        $user->is_admin = !$user->is_admin;
        $user->save();

        return response()->json([
            'message' => 'Rol de administrador actualizado.',
            'is_admin' => $user->is_admin
        ]);
    }

    public function resetPassword(Request $request, $id)
    {
        if ($id == auth('api')->id()) {
            return response()->json(['message' => 'No puedes resetear tu propia contraseña.'], 403);
        }

        $request->validate([
            'new_password' => [
                'required',
                'string',
                'min:8',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
                'regex:/[@$!%*#?&]/',
                'confirmed' 
            ]
        ]);

        $user = User::findOrFail($id);
        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Contraseña reseteada correctamente.']);
    }
}
