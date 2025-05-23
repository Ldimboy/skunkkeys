<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    // REGISTRO
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $verificationCode = Str::random(6);

        $user = User::create([
            'name'              => $request->name,
            'email'             => $request->email,
            'password'          => Hash::make($request->password),
            'verification_code' => $verificationCode,
        ]);

        // Enviar email con código
        Mail::raw("Tu código de verificación es: $verificationCode", function ($message) use ($user) {
            $message->to($user->email)
                ->subject('Código de verificación - Skunk Keys');
        });

        return response()->json(['message' => 'Usuario registrado. Verifica tu correo.'], 201);
    }

    // LOGIN
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Credenciales inválidas'], 401);
        }

        $user = JWTAuth::user();


        if (!$user->is_verified) {
            return response()->json(['error' => 'Cuenta no verificada'], 403);
        }

        return response()->json([
            'token' => $token,
            'user'  => $user
        ]);
    }

    // VERIFICAR CÓDIGO
    public function verify(Request $request)
    {
        $user = User::where('email', $request->email)
            ->where('verification_code', $request->code)
            ->first();

        if (!$user) {
            return response()->json(['error' => 'Código incorrecto'], 400);
        }

        $user->is_verified = true;
        $user->verification_code = null;
        $user->save();

        return response()->json(['message' => 'Cuenta verificada correctamente']);
    }

    //Olvidar contraseña
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        $resetCode = Str::random(6);
        $user->reset_code = $resetCode;
        $user->reset_expires_at = now()->addMinutes(15); // Código válido por 15 minutos
        $user->save();

        Mail::raw("Tu código para recuperar tu contraseña es: $resetCode", function ($message) use ($user) {
            $message->to($user->email)
                ->subject('Código de recuperación - Skunk Keys');
        });

        return response()->json(['message' => 'Código de recuperación enviado al correo']);
    }

    //Reiniciar contraseña con el codigo enviado
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'code' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::where('email', $request->email)
            ->where('reset_code', $request->code)
            ->first();

        if (!$user) {
            return response()->json(['error' => 'Código inválido'], 400);
        }

        if (!$user->reset_expires_at || now()->greaterThan($user->reset_expires_at)) {
            return response()->json(['error' => 'El código ha expirado'], 400);
        }

        $user->password = Hash::make($request->new_password);
        $user->reset_code = null;
        $user->reset_expires_at = null;
        $user->save();

        return response()->json(['message' => 'Contraseña actualizada correctamente']);
    }
}
