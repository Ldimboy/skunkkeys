<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckIfActive
{
    public function handle(Request $request, Closure $next)
    {
        if (auth('api')->check() && !auth('api')->user()->is_active) {
            return response()->json([
                'message' => 'Cuenta congelada. Contacte con el administrador.'
            ], 403);
        }

        return $next($request);
    }
}
