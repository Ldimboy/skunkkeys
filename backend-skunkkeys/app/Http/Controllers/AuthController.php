<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // Validar campos
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|unique:users',
            'email' => 'required|email|unique:users',
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/[A-Z]/',      // al menos una mayúscula
                'regex:/[0-9]/',      // al menos un número
                'regex:/[@$!%*#?&]/', // al menos un símbolo
                'confirmed'           // password_confirmation obligatorio
            ],
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Generar código de verificación
        $verificationCode = Str::random(6);

        // Crear el usuario
        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'verification_code' => $verificationCode,
        ]);

        // Enviar correo sin blade, sin mailable, texto plano
        Mail::raw("Gracias por registrarte en Skunk Keys.\n\nTu código de verificación es: $verificationCode", function ($message) use ($user) {
            $message->to($user->email)
                ->subject('Tu código de verificación - Skunk Keys');
        });

        return response()->json([
            'message' => 'Usuario registrado. Verifica tu correo.'
            // Puedes incluir el código aquí solo en modo desarrollo:
            // 'verification_code' => $verificationCode
        ], 200);
    }

    public function verifyEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        if ($user->is_verified) {
            return response()->json(['message' => 'El usuario ya está verificado'], 400);
        }

        if ($user->verification_code !== $request->code) {
            return response()->json(['message' => 'Código incorrecto'], 401);
        }

        // Verificar y limpiar
        $user->is_verified = true;
        $user->verification_code = null;
        $user->save();

        return response()->json(['message' => 'Correo verificado correctamente'], 200);
    }

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('username', 'password');

        // Buscar usuario por username
        $user = User::where('username', $request->username)->first();

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        if (!$user->is_verified) {
            return response()->json(['message' => 'Correo no verificado'], 401);
        }

        if (!$user->is_active) {
            return response()->json(['message' => 'Cuenta congelada, contacte con el administrador'], 403);
        }

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401);
        }

        return response()->json([
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => config('jwt.ttl') * 60,
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'is_admin' => $user->is_admin
            ]
        ]);
    }

    public function logout()
    {
        auth('api')->logout();

        return response()->json([
            'message' => 'Sesión cerrada correctamente'
        ]);
    }

    public function me()
    {
        return response()->json(auth('api')->user());
    }

    public function resetPasswordRequest(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'No se encontró un usuario con ese correo.'], 404);
        }

        $resetCode = Str::random(6);
        $user->verification_code = $resetCode;
        $user->save();

        Mail::raw("Has solicitado restablecer tu contraseña.\n\nTu código de recuperación es: $resetCode", function ($message) use ($user) {
            $message->to($user->email)
                ->subject('Código de recuperación - Skunk Keys');
        });

        return response()->json(['message' => 'Se ha enviado un código de recuperación al correo electrónico.']);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string',
            'new_password' => [
                'required',
                'string',
                'min:8',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
                'regex:/[@$!%*#?&]/',
                'confirmed' // requiere new_password_confirmation
            ]
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || $user->verification_code !== trim($request->code)) {
            return response()->json(['message' => 'Código incorrecto o usuario no válido.'], 401);
        }

        $user->password = Hash::make($request->new_password);
        $user->verification_code = null;
        $user->save();

        return response()->json(['message' => 'Contraseña actualizada correctamente.']);
    }
}
