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
}
