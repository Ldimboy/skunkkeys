<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!auth('api')->user() || !auth('api')->user()->is_admin) {
            return response()->json(['message' => 'Permisos insuficientes'], 403);
        }

        return $next($request);
    }
}
